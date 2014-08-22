angular.module('doingfine.statushistory', [
	'ionic'
	])

.controller('StatusHistoryController', function($scope, $state, $rootScope) {

  $scope.selectedFriend = { first: 'Nelson' }; // $rootScope.selectedFriend || Device.user();

  $scope.days = [
                  { day: 'Today' }, { data: [0, 5, 0, 9, 5, 0, 2, 3, 1, 1, 5] },
                  { day: 'Wed' }, { data: [9, 5, 0, 0, 5, 0, 2, 3, 8, 1, 5] },
                  { day: 'Tue' }, { data: [0, 5, 0, 3, 5, 6, 2, 3, 4, 6, 3] }
                ];
  
});