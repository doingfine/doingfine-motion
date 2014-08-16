angular.module('doingfine.newthreadconfirm', [
	'ionic',
	'services'
	])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('NTConfirmController', function($scope, $state, $rootScope, API, Device) {

  $scope.selectedFriend = $rootScope.selectedFriend;

  $scope.confirm = function() {
    // adding a friend during user create implies it is an invite
    $scope.selectedFriend.friends = [Device.user()._id];
    $scope.selectedFriend.phone += '+1';
    API.newUser($scope.selectedFriend).success(function(newUser) {
      console.log('FRIEND ADDED : ', JSON.stringify(newUser));
      $state.go('status');
    })
    .error(function(error) {
      console.log(error);
    });
  };









  // $scope.confirm = function() {
  //   if (registeredFriend) {
  //     // Search for thread between users.
  //     // If found add new photo to thread, else start new thread.
  //     API.searchForThread($scope.user._id, $scope.selectedFriend._id)
  //       .success(function(foundThread) {
  //         if (foundThread) {
  //           createNewPhoto(foundThread._id, $scope.user._id, foundThread.creator);
  //         }
  //         else {
  //           createNewThread() ;
  //         }
  //       });
  //   }
  //   else {
  //     createNewThread();
  //   }
  // };

  // var createNewThread = function() {
  //   console.log("User ", JSON.stringify($scope.user));
  //   console.log("Friend ", JSON.stringify($scope.selectedFriend));
  //   API.newThread([$scope.user.phone, $scope.selectedFriend.phone])
  //     // After creating new thread, create a photo that will be added to thread.
  //     .success(function(newThread) {
  //       var threadId = newThread.data._id;
  //       var ownerId = newThread.data.participants[0];
  //       createNewPhoto(threadId, ownerId);
  //     })
  //     .error(function(error) {
  //       console.log(error);
  //     });
  // };

  // var init = function() {
  //   // Search database for the friend using their phone number.
  //   API.searchForUser({phone: $scope.selectedFriend.phone})
  //     .success(function(foundFriend) {
  //       // If found replace $scope.selectedFriend with their user account info.
  //       if (foundFriend) {
  //         registeredFriend = true;
  //         $scope.selectedFriend = foundFriend;
  //       }
  //     });
  // };
  // init();

});