angular.module('service.pedometer', [])

.factory('PedometerService', function() {

  var start = function(){
    window.PedometerCordova.init(function(data) {
      console.log(data);
      //fire AJAX request to send data to Firebase
    });
    window.PedometerCordova.start();
  };

  return {
    start: start
  };
});
