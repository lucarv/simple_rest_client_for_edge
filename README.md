# REST Client for Edge Device

This module will poll a REST API in a loop and push the results to IoT Hub.  
Set the endpoint URL with an env named URL and the polling frequency with an env named INTERVAL.  
  
This sample uses axios to access an API located [here](http://ub4dev.northeurope.cloudapp.azure.com:8080/).  
If uou change the API you need to change the code accordingly.  
  
Polling is toggled by invoking DMs named **start** and **stop**
