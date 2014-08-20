'use strict';
angular.module('doingfine.status', [
	'ionic',
	'services',
  'service.d3'
	])

.controller('StatusController', function($scope, $rootScope, $interval, Device, d3Service) {
  $scope.selectedFriend = $rootScope.selectedFriend || Device.user();

  // flip flop demo data to test binding D3 to scope
  var a = [10,20,30,40,60, 80, 20, 50];
  var b = [40,30,30,90,60, 40, 20, 20];
  $scope.demoData = a;
  $interval(function() {
    if ($scope.demoData[0] === 10) {
      $scope.demoData = b;
    } else {
      $scope.demoData = a;
    }
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