angular.module('services', ['ngCordova', 'ionic'])

.factory('AccountService', ['$state', 'Device', 'API', function($state, Device, API) {

  return {
    // On app startup, either ask the user to sign up or go to their account
    authAndRoute: function() {
      if (Device.user().verified === false) {
        $state.go('signupphone');
      } else {
        $state.go('menu.status');
      }
    }
  };

}])

.factory('FriendsService', function() {
  // Some fake testing data
  var seedImgPath = 'img/seedFaces/';
  var currentUser = { id: 4, first: 'Dave', last: 'G-W', phone: '5552221111' };
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
      selectedThread = [currentUser, thread];
    },
    getSelected: function() {
      return selectedThread;
    }
  };
})

.factory('Contacts', ['$q', 'Device', function($q, Device) {

  // utility: output standard '1113334488' format
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

  // utility: trim '+1' from a phone number
  var phoneTrimCountryCode = function (phone) {
    if (phone.slice(0,1) === '+') {
      return phone.slice(2);
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
    phoneTrimCountryCode: function(phone) {
      return phoneTrimCountryCode(phone);
    },
    contactsWithPhone: function(contacts) {
      if (Device.isPhone()) {
        return contactsWithPhone(contacts);
      } else {
        return computerContacts;
      }
    }
  };

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
  };
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

  var devAPIRoute = 'https://doingfine.localtunnel.me'; // https://doingfine.localtunnel.me
  var prodAPIRoute = 'http://doinfine.azurewebsites.net';

  // Set the API route to use. devAPIRoute for testing, prodAPIRoute for production.
  var APIRoute = devAPIRoute;

  apiCall.newUser = function(userData) {
    return $http({
      url: APIRoute + '/api/mobileusers',
      method: 'POST',
      data: userData
    });
  };

  apiCall.confirmUser = function(userId, code) {
    return $http({
      url: APIRoute + '/api/mobileusers/' + userId + '/verify',
      method: 'POST',
      data: {
        code: JSON.stringify(code)
      }
    });
  };

  apiCall.getAllFriends = function(userId) {
    return $http({
      url: APIRoute + '/api/mobileusers/' + userId + '/friends',
      method: 'GET'
    });
  };

  apiCall.addFriend = function (userId, friendId){
    "use strict";
    return $http({
      url: APIRoute + '/api/mobileusers/' + userId + '/friends',
      method: 'POST',
      data: JSON.stringify({friends: [friendId]})
    });
  };

  return apiCall;
});
