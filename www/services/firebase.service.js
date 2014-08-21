angular.module('service.firebase', ['firebase'])

.factory('FirebaseService', ['$firebase', '$q',
  function($firebase, $q) {
    var firebaseRef = new Firebase("https://doingfinemotion.firebaseio.com");
    var usersRef = firebaseRef.child("users");



    var createUser = function(mobileUserID){
      var deferred = $q.defer();
      var onComplete = function (err) {
        if (err) {
          deferred.reject();
        } else {
          deferred.resolve();
        }
      };
      usersRef.child(mobileUserID).set({
        currentState: "abc"
      }, onComplete );

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
