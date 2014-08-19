angular.module('faceoff.newthreadconfirm', [
	'ionic',
	'services'
	])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('NTConfirmController', function($scope, $state, $rootScope, API, Device) {

  $scope.selectedFriend = $rootScope.selectedFriend;
  $scope.capturedImageURI = $rootScope.capturedImageURI;
  $scope.user = Device.user();
  var registeredFriend = false;

  $scope.confirm = function() {
    if (registeredFriend) {
      // Search for thread between users.
      // If found add new photo to thread, else start new thread.
      API.searchForThread($scope.user._id, $scope.selectedFriend._id)
        .success(function(foundThread) {
          if (foundThread) {
            createNewPhoto(foundThread._id, $scope.user._id, foundThread.creator);
          }
          else {
            createNewThread() ;
          }
        });
    }
    else {
      createNewThread();
    }
  };

  var createNewThread = function() {
    console.log("User ", JSON.stringify($scope.user));
    console.log("Friend ", JSON.stringify($scope.selectedFriend));
    API.newThread([$scope.user.phone, $scope.selectedFriend.phone])
      // After creating new thread, create a photo that will be added to thread.
      .success(function(newThread) {
        var threadId = newThread.data._id;
        var ownerId = newThread.data.participants[0];
        createNewPhoto(threadId, ownerId);
      })
      .error(function(error) {
        console.log(error);
      })
  }

  // Creator parameter only used for existing threads. Used to determine unread status.
  var createNewPhoto = function(threadId, userId, creator) {
    console.log("Creating Photo");
    console.log("threadID ", threadId);
    console.log("userID ", userId);
    API.newPhoto(threadId, userId, $scope.capturedImageURI)
      .then(function(data) {
        // If creator is defined mark the thread unread for appropriate party.
        if (creator) {
          if (userId === creator) {
            API.recipientRead(threadId, false);
          }
          else {
            API.creatorRead(threadId, false);
          }
        }
        $state.go('menu.status');
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  var init = function() {
    // Search database for the friend using their phone number.
    API.searchForUser({phone: $scope.selectedFriend.phone})
      .success(function(foundFriend) {
        // If found replace $scope.selectedFriend with their user account info.
        if (foundFriend) {
          registeredFriend = true;
          $scope.selectedFriend = foundFriend;
        }
      });
  }
  init();

});