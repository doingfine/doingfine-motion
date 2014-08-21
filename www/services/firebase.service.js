angular.module('service.firebase', ['firebase'])

.factory('FirebaseService', ['$firebase', '$q',
  function($firebase, $q) {
    var firebaseRef = new Firebase("https://doingfinemotion.firebaseio.com");
    var usersRef = firebaseRef.child("users");

    var createUser = function(mobileUserID){
      var deferred = $q.defer();
      usersRef.child(mobileUserID).set({
        currentState: null,
        motionLastMin: null,
        motionLastHr: null,
        motionPerQHr: null
      }, function(err){
        if (err) { deferred.reject(); }
        deferred.resolve();
      });

      return deferred.promise;
    };

    var push = function(data) {
      firebaseRef.push(JSON.stringify(data));
    };

    return {
      createUser: createUser,
      push: push
    };
  }
]);
