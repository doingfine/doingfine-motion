angular.module('faceoff.thread', [
	'ionic'
	])

.controller('ThreadController', function($scope, $state, $stateParams, API, $ionicModal) {
  var init = function() {
    // Get all the thread data needed to generate view.
    API.getThreadData($stateParams.threadId)
      .success(function(data) {
        $scope.participants = data.participants;
        $scope.photos = data.photos;
      })
      .error(function(error) {
        console.log(error);
      });
  }
  init();

  $scope.replyPhoto = function(recipient) {
    $state.go('newthreadgetready');
  };

  $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function(url) {
      $scope.modal.url = url;
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
});