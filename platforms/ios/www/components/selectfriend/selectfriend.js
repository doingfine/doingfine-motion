angular.module('faceoff.newthreadselectfriend', [
	'ionic',
	'services'
	])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('NTSelectFriendController', function($scope, $state, $rootScope, Device, Contacts) {

  $scope.capturedImageURI = $rootScope.capturedImageURI;
  $scope.searchText;
  
  // grab contacts with phone numbers
  if (Device.isPhone()) {
    Contacts.getAll().then(function(contacts) {
      $scope.friends = Contacts.contactsWithPhone(contacts);
    }).catch(function(err) { console.log(err); });
  } else {
    $scope.friends = Contacts.contactsWithPhone();
  }

  $scope.selectFriend = function(friend) {
    // UI Router is super limited
      // url -> strings only
      // params -> strings only
      // resolve -> can inject objects, but have to create a service even for something simple
      // ....so we use $rootScope bc it is fast and simple
        // for more see:
          // https://github.com/angular-ui/ui-router/issues/928
          // http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$stateProvider#state
    $rootScope.selectedFriend = friend;
    $state.go('newthreadconfirm');
  };

});