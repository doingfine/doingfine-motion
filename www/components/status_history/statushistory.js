angular.module('doingfine.statushistory', [
	'ionic'
	])

.controller('StatusHistoryController', function($scope, $state, $rootScope) {

  $scope.selectedUser = $rootScope.selectedUser;

  $scope.stepsData = [1, 2, 5, 6];
  
});