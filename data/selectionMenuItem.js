var name = "selectionMenuItem.js";

// Content code for selection menu item.
//
self.on("click", function(event) {
  console.log(name + ": Click handler received event: " + event);
  if (event.textContent) {
    self.postMessage(event.textContent);
  } else {
    console.log(name + ": Failure - link had no text content.");
  }
});


// The "context" event handler dynamically determines 
// whether to show the menu item.
//
self.on("context", function(node) {
  var selectionText = node.textContent;
  console.log(name + ": Checking text selection: [" + selectionText + "]");
  var containsLatencyRecord = 
        (selectionText.search(/Latency:\s+((\d+\s+){16})(.*)/) != -1);
  if (!containsLatencyRecord) {
    console.log(name + ": Failed to detect a selected latency record.");
    console.log(name + ": selected node name = " + node.nodeName);
    console.log(name + ": selected text = " + selectionText);
  } else {
    console.log(name + ": returning context = " + containsLatencyRecord);
  }
  return containsLatencyRecord;
});
