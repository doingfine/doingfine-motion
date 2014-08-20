angular.module('service.firebase', ['firebase'])

.factory('FirebaseService', ['$firebase',
  function($firebase) {
    var fb = new Firebase("https://doingfinemotion.firebaseio.com/");

    var push = function(data) {
      fb.set(JSON.stringify(data));
      // fb.push(JSON.stringify(data));
    };

    return {
      push: push
    };
  }
]);
