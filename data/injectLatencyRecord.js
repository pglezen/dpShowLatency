var name = "injectLatencyRecord.js";

// Content code for injecting a latency record provided
// by Add-on code.

self.port.on("newrecord", function(rawlatency) {
  var inputField = document.getElementById("latencyRecordField");
  if (inputField) {
	 inputField.value = rawlatency;
	 console.log(name + ": Set latencyRecordField to " + inputField.value);
	 document.defaultView.postMessage("parseAndRender", "*");
  } else {
	 console.log(name + ": Failed to locate latencyRecordField in DOM.");
  }
});
