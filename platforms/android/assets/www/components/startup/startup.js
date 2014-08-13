angular.module('faceoff.startup', [
	'ionic',
	'services'
	])

.controller('StartUpController', function($scope, $state, AccountService) {

	// startup loading screen while AccountService decides which state to go to
	AccountService.authAndRoute();

});