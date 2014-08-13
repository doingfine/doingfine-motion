angular.module('faceoff.signupname', [
	'ionic',
	'services'
	])

.controller('SignUpNameController', function(Contacts, $scope, $state, $ionicPopup, Device, API) {

	$scope.user = Device.user(); // has phone, status, uuid, first(blank), last(blank)

	// Match device user's phone to name in contacts and update scope
	// Goal: App onboarding process reduced to a single user-provided field (phone)
	if (Device.isPhone()) {
		Contacts.getAll().then(function(contacts) {
			var match = Contacts.userMatchingPhone(contacts, Device.user().phone);
			if (match) {
				$scope.user.first = match.first;
				$scope.user.last = match.last;
			}
		}).catch(function(err) { console.log(err); });
	}

	$scope.completeSignUp = function() {

		if ($scope.user.first && $scope.user.first.length > 0 && $scope.user.last.length > 0) {
			// update local user
			Device.user($scope.user);

			// create new user and update local user
			API.newUser(Device.user()).then(function(response) {
				console.log("THEN ", JSON.stringify(response));
				var user = response.data; // response message wrapped in data
				Device.user(user);
				console.log("New User: ", JSON.stringify(Device.user()));
				console.log("New User: ", JSON.stringify(user));
				$state.go('signupconfirm');
			}).catch(function(err) {
				console.log('ERROR ', JSON.stringify(err));
			});
		} else {
			$scope.invalidName();
		}

	};

 // show alert for invalid names
 $scope.invalidName = function() {
   $ionicPopup.alert({
     title: 'Name Required',
     template: 'First and Last name required.'
   }).then(function(res) {
     console.log('Try Again');
   });
 };

});