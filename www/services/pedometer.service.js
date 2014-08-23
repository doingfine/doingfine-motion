angular.module('service.pedometer', ['service.firebase'])

.factory('PedometerService', ['FirebaseService',
  function(FirebaseService) {

    var start = function(userId){
      window.PedometerCordova.init('', function(data) {
        // console.log(data);
        var curStatus = '', curSpeed = '', speed = 0;
        // get speed from data
        speed = parseFloat(data.match(/[-+]?\b[0-9]+(\.[0-9]+)?\b/)[0]);
        if ( speed !== null) {
          if ( speed < 0.3) {
            curStatus = 'Is Still';
          } else if (speed < 2.8) {
            curStatus = 'Walking';
          } else if (speed < 5.5) {
            curStatus = 'Running';
          } else if (speed < 8) {
            curStatus = 'Sprinting';
          } else {
            curStatus = 'Driving';
          }

          FirebaseService.connectUpstream(userId, curStatus, speed);
          //process the data into format required by Firebase
          //fire AJAX request to send data to Firebase
        }
      });
      window.PedometerCordova.start();
    };

    return {
      start: start
    };
  }
]);

//Pedometer Plugin spits out the following data:

// On change of the "type" of motion as a STRING:
// 	"Not moving"
// 	"Walking"
// 	"Running"
// 	"Sprinting"
// 	"Automotive"
//
// Every second or so (sometimes there is delay, especially after inactivity) STRING:
// 	"0.00 km/h", where 0 represents a digit from 0-9, first 0 can be greater than 9.
