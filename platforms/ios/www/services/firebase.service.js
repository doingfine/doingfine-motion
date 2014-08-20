angular.module('service.firebase', [])

.factory('FirebaseService', ['$firebase',
  function($firebase) {
    var fb = new Firebase("https://doingfinemotion.firebaseio.com/");

    var push = function(data) {
      fb.push(JSON.stringify(data));
    };

    return {
      push: push
    };
  }
]);
