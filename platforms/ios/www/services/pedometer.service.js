angular.module('service.pedometer', ['service.firebase'])

.factory('PedometerService', ['FirebaseService',
  function(FirebaseService) {

    var start = function(userId){
      window.PedometerCordova.init('', function(data) {
        // console.log(data);
        FirebaseService.update(userId, data);
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
