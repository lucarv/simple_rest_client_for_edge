'use strict';
require('dotenv').config()

const axios = require('axios')
var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;

var counter = 0, loop;
const apis = ['', 'this', 'that']
const url = process.env.URL;

Client.fromEnvironment(Transport, function (err, client) {
  if (err) {
    throw err;
  } else {
    client.on('error', function (err) {
      throw err;
    });

    // connect to the Edge instance
    client.open(function (err) {
      if (err) {
        throw err;
      } else {
        console.log('IoT Hub module client initialized');

        client.onMethod('start', function (req, res) {
          loop = setInterval(function () {
            axios.get(url + apis[counter], {
            })
              .then(function (response) {
                console.log(response.data);
                var outputMsg = new Message(JSON.stringify(response.data));
                client.sendOutputEvent('output1', outputMsg, printResultFor('Sending received message'));
                counter++
                if (counter == 3) counter = 0;
              })
              .catch(function (error) {
                console.log(error);
              })
              .then(function () {
                // always executed
              });
          }, process.env.INTERVAL);
          res.send(200, 'Telemetry started.', function (err) {
            if (err) console.error('Error sending method response :\n' + err.toString());
            else console.log('Response to method \'' + req.methodName + '\' sent successfully.');
          })

        });


        client.onMethod('stop', function (req, res) {
          clearInterval(loop);
          response.send(200, 'Telemetry stopped.', function (err) {
            if (err) console.error('Error sending method response :\n' + err.toString());
            else console.log('Response to method \'' + req.methodName + '\' sent successfully.');
          });
        });

        // Act on input messages to the module.
        client.on('inputMessage', function (inputName, msg) {
          pipeMessage(client, inputName, msg);
        });
      }
    });
  }
});

// This function just pipes the messages without any change.
function pipeMessage(client, inputName, msg) {
  client.complete(msg, printResultFor('Receiving message'));

  if (inputName === 'input1') {
    var message = msg.getBytes().toString('utf8');
    if (message) {
      var outputMsg = new Message(message);
      client.sendOutputEvent('output1', outputMsg, printResultFor('Sending received message'));
    }
  }
}

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      console.log(op + ' error: ' + err.toString());
    }
    if (res) {
      console.log(op + ' status: ' + res.constructor.name);
    }
  };
}

