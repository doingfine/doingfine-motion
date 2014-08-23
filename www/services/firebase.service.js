angular.module('service.firebase', ['firebase'])

.factory('FirebaseService', ['$firebase', '$q', '$rootScope',
  function($firebase, $q, $rootScope) {
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

    var connectUpstream = function(userId, curStatus, curSpeed) {
      usersRef.child(userId).update({
        curStatus: curStatus,
        currentSpeed: curSpeed
      });
    };

    var connectDownstream = function (userId) {
      console.log("called inside connectDownstream userid", userId);
      usersRef.child(userId).on('child_changed', function (snapshot) {
        console.log('Snap: ', JSON.stringify(snapshot.val()));
        $rootScope.motionData = snapshot.val();
      });
    };

    return {
      connectUpstream: connectUpstream,
      connectDownstream: connectDownstream,
      createUser: createUser
    };
  }
]);
