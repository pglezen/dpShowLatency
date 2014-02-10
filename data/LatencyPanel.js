// Filename: LatencyPanel.js
//
// This is a content script injected into the latency 
// summary panel rendered by LatencyPanel.html.

var name = 'LatencyPanel.js';

self.port.on('UpdateLatency', function(latencySummary) {
  console.log('LatencyPanel received latency summary quantity: ' + latencySummary.length);
  var latencyTable = document.getElementById('LatencyTable');

  // Remove rows that might exist from the last time.
  //
  for (rows = latencyTable.getElementsByTagName('tr'); 
       rows.length > 0; 
       latencyTable.removeChild(rows[0]));

  latencySummary.forEach(function(latencyItem) {
    var row  = document.createElement('tr');
    var cell = document.createElement('td');
    var button = document.createElement('button');
    button.textContent = latencyItem['txnId'];
    button.onclick = function() { 
      self.postMessage(latencyItem['latency']);
    };
    cell.appendChild(button);
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = latencyItem['timestamp'];
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = latencyItem['latency'];
    row.appendChild(cell);

    latencyTable.appendChild(row);
  });
});

