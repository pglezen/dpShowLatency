# DataPower Latency Log Entry Analyzer #

**Note**: To download/install the add-on please check the
[pages site](http://pglezen.github.io/dpShowLatency/).

This Firefox add-on interprets an IBM DataPower appliance
latency log entry based on the interpretation explained in
[Herman's BLOG entry](https://www.ibm.com/developerworks/community/blogs/HermannSW/entry/latency_messages_in_datapower_appliance21?lang=en).
The add-on provides a context menu item that is enabled
for latency log entries in the DataPower Web UI 
log viewer.  Simply right click the entry and select
**Analyze Latency Record**.  This creates a new window
with information about the latency record.  Repeating
the process for other records will use the same window.

Branch 1.1 added the *latency panel* - a summary of the
latency records on a given page.  A widget was added to
activate it.  Check the 
[pages site](http://pglezen.github.io/dpShowLatency/)
for screenshots.

This is all just an automation of the copy-n-paste needed
for the
[Show Latency Page](http://pglezen.github.io/dpShowLatency/ShowLatency.html) 
with an extra pinch of event handling to receive the
latency messages from the add-on.  If the add-on does 
not work well for you, you can always use the
[Show Latency Page](http://pglezen.github.io/dpShowLatency/ShowLatency.html)
via copy-n-paste.

