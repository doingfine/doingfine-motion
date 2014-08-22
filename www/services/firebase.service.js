angular.module('service.firebase', ['firebase'])

.factory('FirebaseService', ['$firebase', '$q',
  function($firebase, $q, Device) {
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
        currentState: " ",
        currentSpeed: " "
      }, onComplete );

      return deferred.promise;
    };

    var update = function(userId, curStatus, curSpeed) {
      usersRef.child(userId).update({
        curStatus: curStatus,
        currentSpeed: curSpeed
      });
    };

    return {
      createUser: createUser,
      update: update
    };
  }
]);
