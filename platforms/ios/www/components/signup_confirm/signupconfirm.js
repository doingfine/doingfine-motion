angular.module('doingfine.signupconfirm', [
	'ionic',
	'services'
	])

.controller('SignUpConfirmController', function($scope, $state, $ionicPopup, Device, API) {

	$scope.user = Device.user();

	$scope.finish = function() {
		if($scope.user.confirmationCode.toString().length === 4) {
			API.confirmUser(Device.user()._id, $scope.user.confirmationCode).then(function(response) {
				console.log('Success, Confirmation Code Validated ', JSON.stringify(response));
				var user = response.data;
				if (user.verified) {
<<<<<<< HEAD
					Device.user(user);
					$state.go('menu');
=======
          Device.user(user);
					$state.go('menu.status');
>>>>>>> 7641ac23bc53b5029484fa1c7f1bffe0b9e95a88
				} else {
					$scope.invalidCode();
				}
			}).catch(function(err) {
				console.log('Error ', JSON.stringify(err));
			});
		} else {
			console.log('form invalid');
		}
	};

	$scope.invalidCode = function() {
   $ionicPopup.alert({
     title: 'Sorry',
     template: 'That code did not match the code we sent you.'
   }).then(function(res) {
     console.log('Try Again');
   });
 };

});