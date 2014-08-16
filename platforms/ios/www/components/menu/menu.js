'use strict';
angular.module('doingfine.menu', [
	'ionic'
	])

.controller('MenuController', function ($scope, $state, FriendsService, $rootScope) {
	$scope.friends = FriendsService.all();
  $scope.getUserActivity = function (f) {
    $rootScope.selectedFriend = f;
    $state.go('menu.status', null, {reload: true});
  };
 });