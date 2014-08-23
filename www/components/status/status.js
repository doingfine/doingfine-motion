'use strict';
angular.module('doingfine.status', [
	'ionic',
	'services',
  'service.d3',
  'service.firebase'
	])

.controller('StatusController', function($scope, $rootScope, $interval, Device, d3Service, FirebaseService) {
  $scope.selectedUser = $rootScope.selectedUser || Device.user();

  // 'pulse' random km/h data every second

  FirebaseService.connectDownstream($scope.selectedUser._id);
  $scope.motionData = $rootScope.motionData = 0; // init
  $interval(function () {
    if ( $scope.motionData < (0.3 * 5)) {
      $scope.status = 'Is Still';
    } else if ($scope.motionData < (2.8 * 5)) {
      $scope.status = 'Walking';
    } else if ($scope.motionData < (5.5 * 5)) {
      $scope.status = 'Running';
    } else if ($scope.motionData < (8 * 5)) {
      $scope.status = 'Sprinting';
    } else {
      $scope.status = 'Driving';
    } 
    $scope.motionData = $rootScope.motionData;
    }, 500);

  $scope.hasFriends = true;
  if (Device.user().friends.length === 0) {
   $scope.hasFriends = false;
  }

  var onIcon = 'ion-social-rss', offIcon = 'ion-social-rss-outline';
  $scope.safeModeIcon = onIcon;

  $scope.safeMode = function () {
    if ($scope.safeModeIcon === onIcon) {
      $scope.safeModeIcon = offIcon;
    } else {
      $scope.safeModeIcon = onIcon;
    }
  };
	
});
