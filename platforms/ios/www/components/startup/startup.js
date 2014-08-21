angular.module('doingfine.startup', [
	'ionic',
	'services'
	])

.controller('StartUpController', function($scope, $state, AccountService) {

	console.log("start");
	// startup loading screen while AccountService decides which state to go to
	AccountService.authAndRoute();
	console.log("up");

});