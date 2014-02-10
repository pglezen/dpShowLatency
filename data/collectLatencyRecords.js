var name = "collectLatencyRecords.js";

// Content code for injecting a latency record provided
// by Add-on code.

self.port.on("scanlatencies", function() {
  var logWindow = frames['mainFrame'];
  if (logWindow) {
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
      }
      return rowItem;
    });
    console.log(name + ': sending panelInfo with quantity: ' + panelInfo.length);
    self.port.emit('updateLatencyPanel', panelInfo);
  } else {
    console.log('Could not find iframe named "mainFrame".');
  }
});
