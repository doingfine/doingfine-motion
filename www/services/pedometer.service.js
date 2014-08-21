angular.module('service.pedometer', ['service.firebase'])

.factory('PedometerService', ['FirebaseService',
  function(FirebaseService) {

    var start = function(){
      window.PedometerCordova.init('', function(data) {
        // console.log(data);
        FirebaseService.push(data);
        //process the data into format required by Firebase
        //fire AJAX request to send data to Firebase
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
