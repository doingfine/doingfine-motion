'use strict';
angular.module('doingfine.menu', [
	'ionic'
	])

<<<<<<< HEAD
.controller('MenuController', function ($scope) {
	$scope.friends = [
    {
      first: 'Shawn',
      last: 'Hartley'
    },
    {
      first: 'Nelson',
      last: 'Riley'
    },
    {
      first: 'Andrew',
      last: 'Zey'
    }];

=======
.controller('MenuController', function ($scope, $state, FriendsService, $rootScope) {
	$scope.friends = FriendsService.all();
  $scope.getUserActivity = function (f) {
    $rootScope.selectedFriend = f;
    $state.go('menu.status', null, {reload: true});
  };
>>>>>>> 7641ac23bc53b5029484fa1c7f1bffe0b9e95a88
 });