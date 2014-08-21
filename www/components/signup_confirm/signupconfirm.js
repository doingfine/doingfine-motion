angular.module('doingfine.signupconfirm', [
	'ionic',
	'services'
	])

.controller('SignUpConfirmController', function($scope, $state, $ionicPopup, Device, API, PedometerService, FirebaseService) {

	$scope.user = Device.user();

	$scope.finish = function() {
		if($scope.user.confirmationCode.toString().length === 4) {
			API.confirmUser(Device.user()._id, $scope.user.confirmationCode).then(function(response) {
				console.log('Success, Confirmation Code Validated ', JSON.stringify(response));
				var user = response.data;
				if (user.verified) {
          Device.user(user);

					console.log(Device.user()._id);
					//Create New Firebase user with mobile user ID
					FirebaseService.createUser(Device.user()._id)
					.then(function(){
						PedometerService.start();
						console.log('Successfully created Firebase User');
					});

					$state.go('menu.status');
				} else {
					$scope.invalidCode();
				}
			}).catch(function(err) {
        $scope.invalidCode();
				console.log('Error ', JSON.stringify(err));
			});
		} else {
			console.log('form invalid');
		}
	};

	$scope.invalidCode = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Invalid',
      template: 'Sorry you have entered an invalid registration code. Please try again.'
    });
    alertPopup.then(function(res) {
      console.log('Try Again');
    });
  };

});
