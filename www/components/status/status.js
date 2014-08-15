'use strict';
angular.module('doingfine.status', [
	'ionic',
	'services'
	])

.controller('StatusController', function($scope, $rootScope, Device) {
  $scope.selectedFriend = $rootScope.selectedFriend;

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