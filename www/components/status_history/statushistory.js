angular.module('doingfine.statushistory', [
	'ionic'
	])

.controller('StatusHistoryController', function($scope, $state, $rootScope) {

  $scope.selectedFriend = $rootScope.selectedFriend;

  $scope.stepsData = [0, 5, 0, 10, 5, 0, 2, 3, 4, 6, 5];
  
});