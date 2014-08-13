angular.module('services', ['ngCordova', 'ionic'])

.factory('AccountService', ['$state', 'Device', 'API', function($state, Device, API) {
  
  return {
    authAndRoute: function() {
      var user = Device.user();

      // we assume user is from local storage
      if (user.status === 'fresh') {
        $state.go('signupphone');
      } else if (user.status === 'pending') {
        // update user from server, then check again
        API.getUser(Device.user()._id).then(function(json) {
          if (user.status === 'confirmed') {
            $state.go('menu.status');
          } else {
            $state.go('confirmaccount');
          }
        })
      } else if (user.status === 'confirmed') {
        $state.go('menu.status');
      }
    }
  }

}])

.factory('ThreadsService', function() {
  // Some fake testing data
  var seedImgPath = 'img/seedFaces/'
  var currentUser = {
    id: 4, first: 'Dave', last: 'G-W', phone: '5552221111'
  }
  var threads = [
    { id: 0, first: 'Scruff', last: 'McGruff', new: true, photos: [seedImgPath+'1.jpg', seedImgPath+'9.jpg', seedImgPath+'5.jpg', seedImgPath+'10.jpg'] },
    { id: 1, first: 'G.I.', last: 'Joe', new: false, photos: [seedImgPath+'10.jpg', seedImgPath+'4.jpg', seedImgPath+'6.jpg', seedImgPath+'7.jpg'] },
    { id: 2, first: 'Miss', last: 'Frizzle', new: true, photos: [seedImgPath+'3.jpg', seedImgPath+'8.jpg', seedImgPath+'12.jpg', seedImgPath+'1.jpg'] },
    { id: 3, first: 'Ash', last: 'Ketchum', new: false, photos: [seedImgPath+'5.jpg', seedImgPath+'9.jpg', seedImgPath+'11.jpg', seedImgPath+'2.jpg'] }
  ];

  var selectedThread = { first: 'Empty at First'};

  return {
    all: function() {
      return threads;
    },
    setSelected: function(thread) {
      selectedThread = [currentUser, thread]
    },
    getSelected: function() {
      return selectedThread;
    }
  }
})

.factory('Contacts', ['$q', 'Device', function($q, Device) {

  var concisePhone = function(phone) {
    // +1 (970) 618-7050  becomes  9706187050
    // remove '+1' '(' ')' '-' '.' ' '  LAST CHARACTER IS NOT AN EMPTY SPACE
    phone = phone.toString();
    phone = phone.replace(/[' ')(\- ]/g, '');
    phone = phone.replace(/\+1/g, '');
    // don't allow 1 at front of number
    if (phone.slice(0, 1) === '1') {
      phone = phone.slice(1);
    }
    return phone;
  };

  var userMatchingPhone = function(contacts, phone) {
  // returns first user with a matching phone number from contacts
    for(var i = 0; i < contacts.length; i++) {
      if (contacts[i].phoneNumbers) {
        var phones = contacts[i].phoneNumbers;
        for (var j = 0; j < phones.length; j++) {
          if (concisePhone(phones[j].value) === phone) {
            var match = {};
            match.first = contacts[i].name.givenName;
            match.last = contacts[i].name.familyName;
            return match;
          }
        }
      }
    }
    return null;
  };
  
  var contactsWithPhone = function(contacts) {
  // returns all contacts in an array with first, last, and phone
  // phone is mobile number formatted to 8880005555
    var friends = [];

    var bestPhone = function(phones) {
      var best = phones[0].value;
      for (var i = 0; i < phones.length; i++){
        if (phones[i].type === 'mobile') {
          best = phones[i].value;
        }
      }
      return best;
    };

    for(var i = 0; i < contacts.length; i++) {
      var c = contacts[i];
      if (c.phoneNumbers && c.name.givenName && c.name.familyName) {
        var friend = {};
        friend.first = c.name.givenName;
        friend.last = c.name.familyName;
        friend.phone = concisePhone(bestPhone(c.phoneNumbers));
        friends.push(friend);
      }
    }

    // Log friends in Xcode Console
    // for (var i = 0; i < 30; i++){
    //   console.log(JSON.stringify(friends[i]));
    // }
    return friends;
  };

  // asynchronous
  var getAllContacts = function(callback) {
    var q = $q.defer();

    var fields = ['id', 'displayName'];
    var options = { multiple: true };

    navigator.contacts.find(fields, function(contacts) {
      q.resolve(contacts);
    }, function(err) {
      q.reject(err);
    }, options);

    return q.promise;
  };

  // dummy data
  var computerContacts = [
    { first: 'Tim', last: 'McGruff', phone: '7778880001' },
    { first: 'James', last: 'Joe' , phone: '2223334444' },
    { first: 'Swill', last: 'Frizzle', phone: '3334445555' },
    { first: 'Relf', last: 'Ketchum', phone: '1114446666' }
  ];

  return {
    getAll: function() {
      return getAllContacts(); // promise resolves with array
    },
    userMatchingPhone: function(contacts, phone) {
      return userMatchingPhone(contacts, phone);
    },
    concisePhone: function(phone) {
      return concisePhone(phone);
    },
    contactsWithPhone: function(contacts) {
      if (Device.isPhone()) {
        return contactsWithPhone(contacts);
      } else {
        return computerContacts;
      }
    }
  }

}])

.factory('Camera', ['$q', 'Device', function($q, Device) {
  // ideally getPicture would check for device type and launch webcam or phone cam(future feature)
 
  return {
    // opens photo view and returns a promise, promise resolves with a URI
    getPicture: function(options) {
      if (Device.isPhone()) {
        var q = $q.defer();
        if (options === undefined) {
          // cameraDirection: "1" for front-facing, "2" for user-facing
          // destinationType: Camera.DestinationType.DATA_URL
          options = {
            cameraDirection: 1,
            quality: 90, // 1-100
            allowEdit : true, // necessary for Square aspect ratio
            targetWidth: 640,
            targetHeight: 640,
            correctOrientation: 1,
            saveToPhotoAlbum: false,
            destinationType: navigator.camera.DestinationType.FILE_URI,
              // DATA_URL : 0,      // Return image as base64-encoded string
              // FILE_URI : 1,      // Return image file URI as stored in memory
              // NATIVE_URI : 2     // Return image native URI (e.g., assets-library:// on iOS 
            sourceType : navigator.camera.PictureSourceType.CAMERA
          };
        }
        
        navigator.camera.getPicture(function(result) {
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);
        
        return q.promise;
      } else {
        // generates a random photo in browser
        // for development purposes
        var q = $q.defer();
        var numImages = 26;
        var directory = 'img/seedFaces/';
        var index = Math.ceil(Math.random()*numImages);
        q.resolve(directory+index+'.jpg');
        return q.promise;
      }
    }
  }
}])

// Custom service to make device information available at any time
// expose device type (phone or computer)
// and store device user data
.factory('Device', function() {
  var device = {};

  return {
    // available: model, platform, uuid, version
    get: function() {
      return device;
    },
    getItem: function(key) {
      return device[key];
    },
    set: function(obj) {
      device = obj;
    },
    setItem: function(key, value) {
      device[key] = value;
    },
    isPhone: function() {
      return device.type === 'phone';
    },
    user: function(obj) {
      if (obj) {
        window.localStorage.setItem('deviceUser', JSON.stringify(obj));
      } else {
        return JSON.parse(window.localStorage.getItem('deviceUser'));
      }
    }
  }
})

// Workaround attempt for sending multipart form data. Currently not used.
.factory('formDataObject', function() {
  return function(data) {
    var fd = new FormData();
    angular.forEach(data, function(value, key) {
      fd.append(key, value);
    });
    return fd;
  };
})

.factory('API', function($q, $http, formDataObject, $state) {
  var apiCall = {};

  var devAPIRoute = 'http://localhost:9000';
  var chrisAPIRoute = 'https://wwslgfhlcc.localtunnel.me';
  var shawnAPIRoute = 'https://wwslgfhlcc.localtunnel.me';
  var prodAPIRoute = 'http://tradingfaces.herokuapp.com';

  // Set the API route to use. devAPIRoute for testing, prodAPIRoute for production.
  var APIRoute = prodAPIRoute;

  apiCall.confirmUser = function(userId, code) {
    return $http({
      url: APIRoute + '/api/users/confirm',
      method: 'POST',
      data: {
        id: userId,
        code: code
      }
    });
  };

  apiCall.newUser = function(userData) {
    return $http({
      url: APIRoute + '/api/users',
      method: 'POST',
      data: userData
    });
  };

  apiCall.getUser = function(userId) {
    return $http({
      url: APIRoute + '/api/users/' + userId,
      method: 'GET'
    });
  };

  apiCall.searchForUser = function(user) {
    return $http({
      url: APIRoute + '/api/users/find',
      method: 'POST',
      data: user
    });
  };

  apiCall.searchForThread = function(user1, user2) {
    return $http({
      url: APIRoute + '/api/threads/find-thread',
      method: 'POST',
      data: {
        participants: [user1, user2]
      }
    });
  };

  apiCall.newThread = function(participants) {
    return $http({
      url: APIRoute + '/api/threads',
      method: 'POST',
      data: {
        participants: participants // participants should be an array of phone numbers: Ex [1002003000, 1112223333]
      }
    });
  };

  // Does not work for multipart forms.
  apiCall.newPhoto = function(threadId, ownerId, imageURI, cb) {
    // Uncomment and comment out below for testing in the browser
    // return $http({
    //   url: APIRoute + '/api/photos',
    //   method: 'POST',
    //   data: {
    //     threadId: threadId,
    //     owner: ownerId,
    //     url: imageURI
    //   }
    // });
    
    var q = $q.defer();
    console.log("New Photo");
    var win = cb;
    var win = function(data) {
      q.resolve(data);
    };
    var fail = function(error) {
      q.reject(error);
    };

    var options = new FileUploadOptions;
    options.fileKey = 'photo';
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
    console.log('filename ', options.fileName);
    options.mimeType = 'image/jpeg';
    options.params = {
      'owner': ownerId,
      'threadId': threadId
    };
    options.chunkedMode = true;

    var endpoint = encodeURI(APIRoute + '/api/photos/');

    var ft = new FileTransfer();
    console.log("Bottom of newPhoto");
    ft.upload(imageURI, endpoint, win, fail, options, true); // true = trustAllHosts
    return q.promise
  };

  apiCall.getThread = function(threadId) {
    return $http({
      url: APIRoute + '/api/threads/' + threadId,
      method: 'GET'
    });
  };

  apiCall.getThreadData = function(threadId) {
    return $http({
      url: APIRoute + '/api/threads/all/' + threadId,
      method: 'GET'
    });
  };

  apiCall.getAllThreadsData = function(threadId) {
    return $http({
      url: APIRoute + '/api/users/threads/' + threadId,
      method: 'GET'
    });
  };

  apiCall.creatorRead = function(threadId, read) {
    return $http({
      url: APIRoute + '/api/threads/' + threadId + '/creator/read/' + read,
      method: 'GET'
    });
  };

  apiCall.recipientRead = function(threadId, read) {
    return $http({
      url: APIRoute + '/api/threads/' + threadId + '/recipient/read/' + read,
      method: 'GET'
    });
  };

  /************************
   *** SAMPLE API Calls ***
   ************************
    API.getAllUsers()
      .success(function(data) {
        console.log(data);
      })
      .error(function(error) {
        console.log(error);
      });

    API.newThread([1112223334,1234567890])
      .success(function(newThread) {
        console.log(newThread);
        var threadId = newThread.data._id;
        var ownerId = newThread.data.participants[0];
        // Remove this line when we have real photos to send.
        Camera.getRandomPicture().then(function(image) {
          API.newPhoto(threadId, ownerId, image)
            .success(function(data) {
              console.log(data);
            })
            .error(function(error) {
              console.log(error);
            });
        })
      })
      .error(function(error) {
        console.log('error');
        console.log(error);
      })

    newPhoto only test.
    API.newPhoto("53c741465a44899857fb64a8", "53c741465a44899857fb64a6")
      .success(function(data) {
        console.log(data);
      })
      .error(function(error) {
        console.log(error);
      })
    
    API.getThread('53c741465a44899857fb64a8')
      .success(function(data) {
        console.log(data);
      })
      .error(function(error) {
        console.log(error);
      });

    API.getUser('53c741465a44899857fb64a6')
      .success(function(data) {
        console.log(data);
      })
      .error(function(error) {
        console.log(error);
      });

    API.getAllThreadsData('53c7794489f357de7dbf6186')
      .success(function(data) {
        console.log(data);
      })
      .error(function(error) {
        console.log(error);
      });
  */  

  return apiCall;
})
