// File: main.js for the dpShowLatency Add-on.
//
// Author: Paul Glezen
//
// Description:
//
//   This add-on accepts context-menu events from a log
//   window and forwards them to an analysis window.
//   The "Latency Analyzer" menu item is associated with
//   link text that contains a latency log entry.  The
//   content script is selectionMenuItem.js.
//
//   The first time it is invoked, it opens a separate
//   window, loads the ShowLatency.html file, and injects
//   the injectLatencyRecord.js content script.  It 
//   forwards the latency record via a 'newrecord' event
//   to the Latency tab's worker object.
//
var name = "main.js";

var data        = require("sdk/self").data;
var tabs        = require("sdk/tabs");
var panel       = require("sdk/panel");
var windows     = require("sdk/windows").browserWindows;
var contextMenu = require("sdk/context-menu");

var { ActionButton } = require("sdk/ui/button/action")

var latencyWindow = null;
var latencyTab = null;
var latencyTabWorker = null;

// Define a context menu item that is active whenever
// the user right-clicks a latency record link in the
// DataPower Web UI log viewer.
//
var menuItem = contextMenu.Item({
  label: "Analyze Latency Record",
  context: contextMenu.SelectorContext('a[href]'),
  contentScriptFile: data.url('selectionMenuItem.js'),
  onMessage: updateLatencyWindow
});


// Update the latency analysis window with a new record.
// If the window is not open, open one.  The variable
// "name" is defined by the enclosing function.  It is
// used for console.log output.
//
function updateLatencyWindow(selectionText) { 
  console.log(name + ": Received text: " + selectionText);
  if (latencyTab == null) {
    if (latencyWindow == null) {
      console.log(name + ": creating new Latency window.");
      latencyWindow = windows.open({ 
        url: data.url("ShowLatency.html"), 
        name: "Latency Analyzer",
        outerWidth: "600",
        menubar: "off",
        toolbar: "off",
        onOpen: addLatencyContentScript(selectionText),
        onClose: function() {
          console.log(name + ": latency window closed.");
          latencyWindow = null; 
          latencyTab = null;
       }
      });
    } else {
      console.log(name + ": Inconsistent state failure; tab == null, window != null");
    }
  } else {
    latencyTabWorker.port.emit('newrecord', selectionText);
    console.log(name + ": emiting 'newrecord' event to existing latency window " 
                     + "with [" + selectionText + "]");
  }
}


// This function returns a function that sends the 'newrecord'
// event to the Latency tab content script.  The input parameter
// is used to send the content script an event that contains the
// initial latency record.
//
function addLatencyContentScript(selectionText) {
  return function(window) {
    if (latencyWindow.tabs.length == 1) {
      latencyTab = latencyWindow.tabs[0];
      latencyTab.on('ready', function() {
        console.log(name + ": Attaching worker to latency tab.");
        latencyTabWorker = latencyTab.attach(
          {contentScriptFile: data.url('injectLatencyRecord.js')}
        );
        latencyTabWorker.port.emit("newrecord", selectionText);
        console.log(name + ": emitting 'newrecord' event to new window with [" 
                         + selectionText + "]");
      });
    } else {
      console.log(name + ": latencyWindow.tabs.length = " + latencyWindow.tabs.length);
    }
  }
}


// Define the ToggleButton that, when clicked, pops-up
// the latency summary panel.
//
var latencySummaryButton = ActionButton({
  id: "dpshowlatency-button",
  label: "DP Latency",
  icon: { "32": "./thermo-icon.png" },
  onClick: function() {
    console.log("Latency button clicked.");
    worker = tabs.activeTab.attach({
      contentScriptFile: data.url('collectLatencyRecords.js')
    });
    worker.port.on('updateLatencyPanel', function(latencyInfo) {
      console.log(name + ': Received latencyInfo quantity: ' + latencyInfo.length);
      latencySummaryButton.state('tab').badge = latencyInfo.length;
      latencyPanel.port.emit('UpdateLatency', latencyInfo);
      console.log('UpdateLatency event sent to latency panel.');
      latencyPanel.show();
      console.log('Invoked show() on panel.');
    });
    worker.port.on('updateButtonBadge', function(badgeCount) {
      console.log(name + ': Received badge count: ' + badgeCount);
      if (isNaN(badgeCount)) {
        console.log("Attempted to update badge with non-numeric.");
      } else {
        latencySummaryButton.state('tab').badge = badgeCount;
      }
    })
    worker.port.emit('scanlatencies');
  }
});

// Define the panel that summarizes latency records.
//
var latencyPanel = panel.Panel({
  width: 500,
  height: 400,
  contentURL: './LatencyPanel.html',
  contentScriptFile: './LatencyPanel.js',
  position: latencySummaryButton,
  onMessage: updateLatencyWindow
});

