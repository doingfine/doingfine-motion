'use strict';
angular.module('doingfine.menu', [
	'ionic'
	])

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

 });