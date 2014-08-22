'use strict';
angular.module('doingfine.menu', [
	'ionic'
	])

.controller('MenuController', function ($scope, $state, FriendsService,
                                        $rootScope, Device, API) {
  var currentUserId = Device.user()._id;
  $scope.currentUserFirst = Device.user().first;
  $scope.currentUserLast = Device.user().last;
  API.getAllFriends(currentUserId)
    .success(function (data) {
      $scope.friends = data;
    })
    .error(function (err) {
      console.log(err);
    });
  $scope.getUserActivity = function (f) {
    $rootScope.selectedUser = f;
    $state.go('menu.status', null, {reload: true});
  };
 });
