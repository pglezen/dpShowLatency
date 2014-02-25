// Filename: LatencyPanel.js
//
// This is a content script injected into the latency 
// summary panel rendered by LatencyPanel.html.

var name = 'LatencyPanel.js';

self.port.on('UpdateLatency', function(latencySummary) {
  console.log('LatencyPanel received latency summary quantity: ' + latencySummary.length);
  var latencyTable = document.getElementById('LatencyTable');

  // Remove rows that might exist from the last time.
  // But don't delete the header.
  //
  for (rows = latencyTable.getElementsByTagName('tr'); 
       rows.length > 1; 
       latencyTable.removeChild(latencyTable.lastChild));

  var maxLatency = 0;
  var minLatency = 3600000;

  // Find the max and min of all the max latencies.
  // This will determine how we scale the color.
  //
  latencySummary.forEach(function(latencyItem) {
    var latency = latencyItem['max'];
	 maxLatency = Math.max(maxLatency, latency);
	 minLatency = Math.min(minLatency, latency);
  });
  if (minLatency < 0  ||  maxLatency < minLatency) {
    console.log(name + ': Max Latency = ' + maxLatency);
    console.log(name + ': Min Latency = ' + minLatency);
  }

  // Return color string based on latency.
  // Low latencies are green, highs are red.
  //
  function latencyColor(latency) {
    var colorStep = Math.floor(255 * (latency - minLatency) / (maxLatency - minLatency));
    var greenHex = (colorStep > 239 ? '0' : '') + (255 - colorStep).toString(16);
	 var   redHex = (colorStep <  16 ? '0' : '') + colorStep.toString(16);
	 var colorString = '#' + redHex + greenHex + '00';
    return colorString;
  }

  latencySummary.forEach(function(latencyItem) {
    var row  = document.createElement('tr');
    var cell = document.createElement('td');
    var button = document.createElement('button');
    button.textContent = latencyItem['txnId'];
    button.onclick = function() { 
      self.postMessage(latencyItem['latency']);
    };
    cell.appendChild(button);
	 cell.className = "txn";
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = latencyItem['timestamp'];
	 cell.className = "time";
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = latencyItem['max'];
	 cell.className = "duration";
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = latencyItem['uri'];
	 cell.className = "uri";
    row.appendChild(cell);

    row.style.backgroundColor = latencyColor(latencyItem['max']);
    latencyTable.appendChild(row);
  });
});

