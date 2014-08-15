angular.module('doingfine.nofriends', [
	'ionic',
	'services'
	])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('NoFriendsController', function($scope) {

  // yolo

});