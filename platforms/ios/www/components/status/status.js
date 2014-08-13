angular.module('faceoff.status', [
	'ionic',
	'services'
	])

.controller('StatusController', function($scope, $state, API, Device) {

  $scope.user = Device.user();

  var init = function() {
    console.log("Fetch Users Now, User ID: ", $scope.user._id);
    API.getAllThreadsData($scope.user._id)
      .success(function(data) {
        console.log("Success ", JSON.stringify(data));
        $scope.threads = data.threads;
      })
      .error(function(error) {
        console.log("Error ", JSON.stringify(error));
      });
  }
  init();

	$scope.selectThread = function(thread) {
    // Mark thread as read before navigating to thread view.
    if ($scope.user._id === thread.creator) {
      API.creatorRead(thread._id, true);
    }
    else {
      API.recipientRead(thread._id, true);
    }
		$state.go('thread', {threadId: thread._id});
	};

  /*
  // Used in testing for seeding a user with data. 
  // Uncomment here and in status.html to add seed data to database.
  $scope.seedDataBase = function() {
    var userData = {
      first: 'Dave',
      last: 'G-W',
      phone: 5553331234,
      email: 'dave@me.com',
      status: 'confirmed',
      threads: [],
      uuid: 'dave123'
    }
    API.newUser(userData);
  }
  */
});