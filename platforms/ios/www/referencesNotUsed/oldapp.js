// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'services', 'firebase', 'controllers'])

.config(function($compileProvider, $stateProvider, $urlRouterProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

  $stateProvider

    .state('playorpass', {
      url: "/playorpass",
      templateUrl: "templates/playorpass.html",
      controller: 'PlayPassController'
    });

  $stateProvider

    .state('passit', {
      url: "/passit",
      templateUrl: "templates/passit.html",
      controller: 'PlayPassController'
    });
  
  $stateProvider

    .state('start', {
      url: "/start",
      templateUrl: "templates/start.html",
      controller: 'AppController'
    });

  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppController'
    })

    .state('app.popular', {
      url: "/popular",
      views: {
        'menuContent' :{
          templateUrl: "templates/popular.html",
          controller: 'AppController'
        }
      }
    })

    .state('app.photobooth', {
      url: "/photobooth",
      views: {
        'menuContent' :{
          templateUrl: "templates/photobooth.html",
          controller: 'PersonalController'
        }
      }
    })

    .state('app.test', {
      url: "/test",
      views: {
        'menuContent' :{
          templateUrl: "templates/test.html",
          controller: 'TestController'
        }
      }
    });

  // Default route
  $urlRouterProvider.otherwise('/start');
})

.run(function($ionicPlatform, Device) {
  console.log("RUNNING APP");
  $ionicPlatform.ready(function() {
    console.log("PLATFORM READY");
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    // Grab and set all device details (ie uuid)
    Device.set(ionic.Platform.device());
  });
})

.controller('AppController', function($scope, $rootScope, $location, $ionicViewService, $ionicModal, $timeout, $firebase, Device) {

  $rootScope.rootUser = "rootUser";

  // Check Firebase for existing users
  var FB = new Firebase("https://facegame.firebaseio.com/");
  var users = FB.child("users");
  $scope.users = $firebase(users);

  // Test for a user with a ** requires priority **
  // var userz = new Firebase("https://facegame.firebaseio.com/users");
  // var show = function(snap) {
  //   var dog = {dog: "hound"};
  //   console.log(JSON.stringify(dog));
  //   console.log("SHOWING----------");
  //   console.log(snap);
  //   // $rootScope.currentUser = JSON.stringify(snap);
  // };
  // userz
  //   .startAt(Device.get('uuid'))
  //   .endAt(Device.get('uuid'))
  //   .once('value', show);
  
  // Form data for the login modal
  $scope.loginData = {};

  // Prepare the modal
  $ionicModal.fromTemplateUrl('templates/newuser.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Hide login modal
  $scope.closeSignup = function() {
    $scope.modal.hide();
  };

  // Show login modal
  $scope.openSignup = function() {
    $scope.modal.show();
  };

  $scope.doSignup = function() {

    $scope.users.$add({username: $scope.loginData.username, uuid: Device.get('uuid')})
    .then(function(ref) {
      console.log("New Firebase User Reference: ", ref.name()); // key
      $scope.closeSignup();
    });;

  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $rootScope.rootUser = $scope.loginData.username;
    console.log('Doing login: ', $rootScope.rootUser);
    // save with priority ** not working **
    // $scope.users['newuser'] = {username: $scope.loginData.username, uuid: Device.get('uuid')};
    // $scope.users['newuser'].priority = Device.get('uuid');
    // $scope.users.$save('newuser').then(function(ref) {
    //   console.log("Another New Firebase User Reference: ", ref.name()); // key
    // });
    // simulate login
    $timeout(function() {
      // use ionicViewService to hide the back button on next view
      $ionicViewService.nextViewOptions({
        disableBack: true
      });
      // go to photobooth after login
      $location.path('/app/photobooth');
    }, 20);
  };

})


///////////////////////////////////////////////////////////////////
////////////////////////   Test Controller
///////////////////////////////////////////////////////////////////

.controller('TestController', function($scope, $rootScope, $firebase, Camera, Device) {
  // make the current user accessible
  $scope.rootUser = $rootScope.rootUser;

  $scope.user = {};
  // var ref = new Firebase("https://facegame.firebaseio.com/");
  var ref = new Firebase("https://gdwjjyuzekg.firebaseio-demo.com/");
  $scope.messages = $firebase(ref);
  // $scope.messages = [{from: "george", body: "work please"}];

  // photo model: uri, createdAt
  $scope.photos = [];

  $scope.addMessage = function() {
    $scope.user.uuid = Device.get('uuid');
    $scope.messages.$add({from: Math.floor(Math.random()*100), body: 'firebased'})
    .then(function(ref) {
      console.log("New Firebase Reference Name: ", ref.name()); // key
    });
  };
  $scope.removeMessage = function(key) {
    $scope.messages.$remove(key); //'-JRINR32u2LSaPF1ATXP'
  };
  // if using any type of sorting filter with ng-repeat, use $id as described here:
  // http://stackoverflow.com/questions/20982617/angularjs-with-angularfire-0-5-0-remove-item-doesnt-work?rq=1

  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      console.log("Image URI ", imageURI);
      // $scope.lastPhoto = imageURI; // single photo
      $scope.photos.push({uri: imageURI, createdAt: 11});
    }, function(err) {
      console.err(err);
    }, {
      quality: 75,
      targetWidth: 320, // 320
      targetHeight: 320, // 320
      saveToPhotoAlbum: false
    });
  };

});
