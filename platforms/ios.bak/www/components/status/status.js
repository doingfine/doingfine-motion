'use strict';
angular.module('doingfine.status', [
	'ionic',
	'services',
  'service.d3'
	])

.controller('StatusController', function($scope, $rootScope, $interval, Device, d3Service) {
  $scope.selectedFriend = $rootScope.selectedFriend || Device.user();

  // 'pulse' random km/h data every second
  $scope.motionData = 0;
  $interval(function() {
    $scope.motionData = Math.floor(Math.random() * 12);
  }, 1000);

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
