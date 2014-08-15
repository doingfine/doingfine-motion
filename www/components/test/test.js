'use strict';
angular.module('doingfine.test', [
	'ionic',
	'services'
	])

.controller('TestController', function($scope, $cordovaDeviceMotion) {
  var watch;

  $scope.getAcceleration = function () {
    $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user
    });
  };

  $scope.watchAcceleration = function () {
    var options = { frequency: 1000 };  // Update every 1 second

    watch = $cordovaDeviceMotion.watchAcceleration(options);

    watch.promise.then(
      function() {/* unused */},
      function(err) {},
      function(acceleration) {
        console.log('Acceleration X: ' + acceleration.x + '\n' +
           'Acceleration Y: ' + acceleration.y + '\n' +
           'Acceleration Z: ' + acceleration.z + '\n' +
           'Timestamp: '      + acceleration.timestamp + '\n');
    });
  };

  $scope.clearWatch = function() {
  // use watchID from watchAccelaration()

    if(!watch) { return; }

    $cordovaDeviceMotion.clearWatch(watch.watchId).then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user

    });
  };

	$scope.watchAcceleration();
	console.log('Hello');
});
