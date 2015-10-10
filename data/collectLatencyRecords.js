var name = "collectLatencyRecords.js";

// Content code for injecting a latency record provided
// by Add-on code.

self.port.on("scanlatencies", function() {
  var logWindow = frames['mainFrame'];
  if (!logWindow) {
    console.log('Could not find iframe named "mainFrame"; using window.');
    logWindow = window;
  }
    var allLinks = logWindow.document.getElementsByTagName("a");
    console.log("Link count: " + allLinks.length);
    var latencyLinks = Array.prototype.filter.call(allLinks, function(linkNode) {
      return (linkNode.textContent.search(/^Latency: /) !== -1);
    });
    console.log("Latency link count: " + latencyLinks.length);
    var panelInfo = latencyLinks.map(function(latencyLink) {
      var rowItem = {};
      var rowElement = latencyLink.parentNode.parentNode;
      if (rowElement.nodeName == 'TR') {
        rowItem['timestamp'] = rowElement.firstElementChild.textContent;
        rowItem['txnId'] = rowElement.children[3].textContent;
        rowItem['latency'] = latencyLink.textContent;
        rowItem['max'] = parseLatencyRecord(latencyLink.textContent).max;
        rowItem['uri'] = parseLatencyRecord(latencyLink.textContent).uri;
      }
      return rowItem;
    });
    console.log(name + ': sending panelInfo with quantity: ' + panelInfo.length);
    self.port.emit('updateLatencyPanel', panelInfo);
});


  function parseLatencyRecord(rawLatency) {
    var result = {
      times: [],
      max: 0,
      url: '',
      uri: ''
    }
    console.log('Raw latency = ' + rawLatency);
    var debug = true;

    // Regular expression for latency log.          
    var latencyMatch = rawLatency.match(/Latency:\s+((?:\d+\s+){16})(.*)/);
    
    if (debug) {
      console.log('There are ' + latencyMatch.length + ' matches in the latency array.');
      for (var i = 0; i < latencyMatch.length; i++) {
        console.log("latencyMatch[" + i + "] = " + latencyMatch[i]);
      }
      console.log("Full Match = " + latencyMatch[0]);
      console.log("Time Match = " + latencyMatch[1]);
      console.log("URL Match  = " + latencyMatch[2]);
    }

    // The following use of the trim() function fails with IE 8
    // Search Stackoverflow for ".trim() in JavaScript not working in IE"
    // for a few work-arounds.
    //
    result.times = latencyMatch[1].trim().split(/\s+/);
    result.max = Math.max.apply(Math, result.times);
    result.url = latencyMatch[2].match(/\[([^\]]+)/)[1];
    if (result.url) {
      result.uri = result.url.match(/https?:\/\/[^\/]+\/(.*)/)[1];
    } else {
      console.log(name + ': result.url is null.');
    }
    if (debug) {
      console.log("There are " + result.times.length + " latency times.");
    }
    return result;
  }
