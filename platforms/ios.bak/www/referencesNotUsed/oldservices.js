angular.module('services', [])

.factory('Camera', ['$q', function($q) {
 
  return {
    // opens photo view and returns a promise, promise returns a URI
    getPicture: function(options) {
      var q = $q.defer();
      
      if (options === undefined) {
        // cameraDirection: "1" for front-facing, "2" for user-facing
        // base 64 encoded = destinationType: Camera.DestinationType.DATA_URL
        // file location = destinationType: Camera.DestinationType.FILE_URI
        options = {
          cameraDirection: 1,
          quality: 75,
          targetWidth: 320,
          targetHeight: 320,
          saveToPhotoAlbum: true
        };
      }
      
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      
      return q.promise;
    }
  }
}])

// service to make device information available at any time
.factory('Device', function() {
  var device;

  return {
    // available: model, platform, uuid, version
    get: function(key) {
      return device[key];
    },
    set: function(obj) {
      device = obj;
    }
  }
})












/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});
