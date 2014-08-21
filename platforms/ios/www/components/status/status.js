'use strict';
angular.module('doingfine.status', [
	'ionic',
	'services',
  'service.d3'
	])

.controller('StatusController', function($scope, $rootScope, Device, d3Service) {
  $scope.selectedFriend = $rootScope.selectedFriend || Device.user();

  $scope.demoData = [10,20,30,40,60, 80, 20, 50];

  $scope.d3Service = d3Service;
  
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
