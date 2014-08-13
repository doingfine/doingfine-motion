angular.module('faceoff.signupphone', [
	'ionic',
	'services'
	])

.controller('SignUpPhoneController', function(Contacts, $scope, $state, $ionicPopup, Device) {

	$scope.user = Device.user();

	$scope.doPhone = function() {
		// validate phone number format
		var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
		if (PHONE_REGEXP.test($scope.user.phone)) {
			// update user in local storage
			var deviceUser = Device.user();
			deviceUser.phone = Contacts.concisePhone($scope.user.phone);
			Device.user(deviceUser);
			
			$state.go('signupname');
		} else {
			$scope.invalidPhone();
		}

	};

	$scope.test = function() {
		// Place for testing new functionality
	};

	// show alert for invalid phone
	$scope.invalidPhone = function() {
	  $ionicPopup.alert({
	    title: 'Invalid Phone Number',
      template: 'Phone number must be 10 digits.'
	  }).then(function(res) {
	    console.log('Try Again');
    });
  };

});