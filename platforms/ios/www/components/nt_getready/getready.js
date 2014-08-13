angular.module('faceoff.newthreadgetready', [
	'ionic',
	'services'
	])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('NTGetReadyController', function($scope, $state, Camera, $timeout, $rootScope, API, Device) {

  $scope.shoot = function() {
    Camera.getPicture().then(function(imageURI) {
      $rootScope.capturedImageURI = imageURI;
      $state.go('newthreadselectfriend');
    }).catch(function(err) { console.log(err); });
  };

  // make countdown timer that visually updates on page, before launching camera (future feature)
  // if ($state.current.name === 'newthreadgetready') {
  //   $timeout($scope.shoot, 500);
  // }

});