# DataPower Latency Log Entry Analyzer #

This Firefox add-on interprets an IBM DataPower appliance
latency log entry based on [Herman's BLOG entry](https://www.ibm.com/developerworks/community/blogs/HermannSW/entry/latency_messages_in_datapower_appliance21?lang=en).
The add-on provides a context menu item that is enabled
whenever for latency log entry in the DataPower Web UI 
log viewer.  Simply right click the entry and select
**Analyze Latency Record**.  This creates a new window
with information about the latency record.  Repeating
the process for other records will use the same window.

This is all just an automation of the
[Show Latency](http://glezen.org/ShowLatency.html) with
an extra pinch of event handling to receive messages from
the add-on.  If the add-on does not work well for you,
you can always use ShowLatency via copy-n-paste.

