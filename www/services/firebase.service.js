angular.module('service.firebase', ['firebase'])

.factory('FirebaseService', ['$firebase',
  function($firebase) {
    var firebaseRef = new Firebase("https://doingfinemotion.firebaseio.com/");
    var usersRef = firebaseRef.child("users");

    var createUser = function(mobileUserID){
      var deferred = $q.defer();
      usersRef.child(mobileUserID).set({
        currentState: {},
        motionLastMin: {},
        motionLastHr: {},
        motionPerQHr: {}
      }, function(err){
        if (err) {
          deferred.reject();
        } else {
          deferred.resolve();
        }
      });

      return deferred.promise;
    };

    var push = function(data) {
      console.log(fb);
      firebaseRef.set(JSON.stringify(data));
    };

    return {
      createUser: createUser,
      push: push
    };
  }
]);
