'use strict';
angular.module('doingfine.test', [
	'ionic',
	'services'
	])

.controller('TestController', function($scope, $cordovaDeviceMotion) {
  var watch;

  // $scope.getAcceleration = function () {
  //   $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
  //     // Success!
  //   }, function(err) {
  //     // An error occured. Show a message to the user
  //   });
  // };

  $scope.watchAcceleration = function () {
    var options = { frequency: 2000 };  // Update every 2 seconds

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

  // $scope.clearWatch = function() {
  // // use watchID from watchAccelaration()
	//
  //   if(!watch) { return; }
	//
  //   $cordovaDeviceMotion.clearWatch(watch.watchId).then(function(result) {
  //     // Success!
  //   }, function(err) {
  //     // An error occured. Show a message to the user
	//
  //   });
  // };

	$scope.watchAcceleration();

	var Fetcher = window.plugins.backgroundFetch;

	// // Your background-fetch handler.
	// var fetchCallback = function() {
	// 		console.log('BackgroundFetch initiated');
	//
	// 		// cordova.plugin.notification.local.add({ message: 'Just fetched!' });  //local notification
	// 		Fetcher.finish();   // <-- N.B. You MUST called #finish so that native-side can signal completion of the background-thread to the os.
	//
	// 		// // perform your ajax request to server here
	// 		// $.get({
	// 		//     url: '/heartbeat.json',
	// 		//     callback: function(response) {
	// 		//         // process your response and whatnot.
	// 		//
	// 		//         window.plugin.notification.local.add({ message: 'Just fetched!' });  //local notification
	// 		//         Fetcher.finish();   // <-- N.B. You MUST called #finish so that native-side can signal completion of the background-thread to the os.
	// 		//     }
	// 		// });
	// };

	$scope.startBgProcess = function(){
		// Fetcher.configure(fetchCallback);
		Fetcher.configure();
	};
});
