angular.module('service.pedometer', [])

.factory('PedometerService', ['FirebaseService',
  function(FirebaseService) {

    var start = function(){
      window.PedometerCordova.init(function(data) {
        console.log(data);
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
