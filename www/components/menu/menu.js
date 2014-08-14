'use strict';
angular.module('doingfine.menu', [
	'ionic'
	])

.controller('MenuController', function ($scope, FriendsService) {
	$scope.friends = FriendsService.all();
 });