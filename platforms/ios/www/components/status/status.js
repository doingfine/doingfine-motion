'use strict';
angular.module('doingfine.status', [
	'ionic',
	'services'
	])

<<<<<<< HEAD
.controller('StatusController', function($scope, $state, API, Device) {
  var onIcon = 'ion-social-rss', offIcon = 'ion-social-rss-outline';
  $scope.safeModeIcon = onIcon;
  $scope.user = Device.user();

  $scope.safeMode = function () {
    if ($scope.safeModeIcon === onIcon) {
      $scope.safeModeIcon = offIcon;
    } else {
      $scope.safeModeIcon = onIcon;
    }
  };
=======
.controller('StatusController', function($scope, $rootScope, Device) {
  $scope.selectedFriend = $rootScope.selectedFriend || Device.user();

  $scope.hasFriends = true;
  if (Device.user().friends.length === 0) {
   $scope.hasFriends = false;
  }

  var onIcon = 'ion-social-rss', offIcon = 'ion-social-rss-outline';
  $scope.safeModeIcon = onIcon;
>>>>>>> 7641ac23bc53b5029484fa1c7f1bffe0b9e95a88

  $scope.safeMode = function () {
    if ($scope.safeModeIcon === onIcon) {
      $scope.safeModeIcon = offIcon;
    } else {
      $scope.safeModeIcon = onIcon;
    }
  };

});