angular.module('faceoff.confirmaccount', [
	'ionic',
	'services'
	])

.controller('ConfirmAccountController', function($scope, $state, AccountService) {

	$scope.resendSMS = function() {
		// prompt server to resend account confirmation SMS
	};

	// startup loading screen while AccountService decides which state to go to
		// in future could be triggered automatically with a set interval
	$scope.logIn = function() {
		AccountService.authAndRoute();
	};

});