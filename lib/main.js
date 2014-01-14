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
var widgets     = require("sdk/widget");
var windows     = require("sdk/windows").browserWindows;
var contextMenu = require("sdk/context-menu");

var latencyWindow = null;
var latencyTab = null;
var latencyTabWorker = null;

var menuItem = contextMenu.Item({
  label: "Analyze Latency Record",
  context: contextMenu.SelectorContext('a[href]'),
  contentScriptFile: data.url('selectionMenuItem.js'),
  onMessage: function(selectionText) { 
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
});

// This function to return a function that sends the 'newrecord'
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

// Define the widget for summarizing available latency records.
//
var latencySummary = widgets.Widget({
  id: "dpshowlatency@glezen.org",
  label: "Show Latency",
  contentURL: "http://www.mozilla.org/favicon.ico",
  onClick: function() {
    console.log("widget clicked.");
  }
});
