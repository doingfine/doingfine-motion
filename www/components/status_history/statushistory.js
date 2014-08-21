angular.module('doingfine.statushistory', [
	'ionic'
	])

.controller('StatusHistoryController', function($scope, $state, $rootScope) {

  $scope.selectedFriend = $rootScope.selectedFriend;

  $scope.stepsData = [1, 2, 5, 6];
  
});