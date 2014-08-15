'use strict';
angular.module('doingfine.status', [
	'ionic',
	'services'
	])

.controller('StatusController', function($scope, $rootScope, API, Device) {
  $scope.selectedFriend = $rootScope.selectedFriend;

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

  /*
  // Used in testing for seeding a user with data. 
  // Uncomment here and in status.html to add seed data to database.
  $scope.seedDataBase = function() {
    var userData = {
      first: 'Dave',
      last: 'G-W',
      phone: 5553331234,
      email: 'dave@me.com',
      status: 'confirmed',
      threads: [],
      uuid: 'dave123'
    }
    API.newUser(userData);
  }
  */
});