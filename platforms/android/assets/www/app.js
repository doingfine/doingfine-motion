// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', [
  'ionic', 
  'services', // break up later
  'ngCordova',
  'faceoff.startup',
  'faceoff.signupphone',
  'faceoff.signupname',
  'faceoff.signupconfirm',
  'faceoff.newthreadgetready',
  'faceoff.newthreadselectfriend',
  'faceoff.newthreadconfirm',
  'faceoff.menu',
  'faceoff.status',
  'faceoff.thread',
  'faceoff.confirmaccount'
  ])

.config(function($compileProvider, $stateProvider, $urlRouterProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

  $stateProvider

    // start up
    .state('startup', {
      url: "/startup",
      templateUrl: "components/startup/startup.html",
      controller: 'StartUpController'
    })

    // sign up flow
    .state('signupphone', {
      url: '/signup',
      templateUrl: 'components/signup_phone/signupphone.html',
      controller: 'SignUpPhoneController'
    })

    .state('signupname', {
      url: '/signup',
      templateUrl: 'components/signup_name/signupname.html',
      controller: 'SignUpNameController'
    })

    .state('signupconfirm', {
      url: '/signup',
      templateUrl: 'components/signup_confirm/signupconfirm.html',
      controller: 'SignUpConfirmController'
    })

    // confirm account
    .state('confirmaccount', {
      url: "/confirmaccount",
      templateUrl: "components/confirm_account/confirmaccount.html",
      controller: 'ConfirmAccountController'
    })

    //Sidebar Child Views
    .state('menu', {
      url: '/',
      abstract: true,
      templateUrl: 'components/menu/menu.html',
      controller: 'MenuController'
    })

    .state('menu.status', {
      url: 'status',
      views: {
        'menuContent': {
          templateUrl: 'components/status/status.html',
          controller: 'StatusController'
        }
      },
      resolve: {
        threads: function(ThreadsService) {
          return ThreadsService.all();
        }
      }
    })

    // new thread flow
    .state('newthreadgetready', {
      url: '/getready',
      templateUrl: 'components/nt_getready/getready.html',
      controller: 'NTGetReadyController'
    })

    .state('newthreadselectfriend', {
      url: '/selectfriend',
      templateUrl: 'components/nt_selectfriend/selectfriend.html',
      controller: 'NTSelectFriendController'
    })

    .state('newthreadconfirm', {
      url: '/confirm',
      templateUrl: 'components/nt_confirm/confirm.html',
      controller: 'NTConfirmController'
    })

    // thread
    .state('thread', {
      url: '/thread/:threadId',
      templateUrl: 'components/thread/thread.html',
      controller: 'ThreadController'
    })

  // Default route
  $urlRouterProvider.otherwise('/startup');
})

// Run Time Operations (startup)
.run(function($ionicPlatform, Device, AccountService) {
  $ionicPlatform.ready(function() {
    console.log('Platform Ready');

    // Grab and set all device details (model, platform, uuid, version) if available
    Device.set(ionic.Platform.device());
    Device.setItem('type', 'phone');

    var simulationUsers = [
      { _id: 0, first: '', last: '', status: 'fresh', uuid: '1234' },
      { _id: 1, first: 'G.I.', last: 'Joe', status: 'pending', uuid: '2345', phone: 1112223333 },
      { _id: 2, first: 'Miss', last: 'Frizzle', status: 'confirmed', uuid: '3456', phone: 2223334444 },
      { _id: 3, first: 'Ash', last: 'Ketchum', status: 'confirmed', uuid: '4567', phone: 3334445555 },
      { _id: '53c88bfa5591db000025b15f', first: 'Dave', last: 'G-W', phone: 5553331234, email: 'dave@me.com', status: 'confirmed', threads: [], uuid: 'dave123'}
    ];

    // if no device data is available, we can assume we are in the browser
    if (ionic.Platform.device().uuid === undefined) {
      // so we manually specify a deviceUser profile (simulation mode)
      window.localStorage.setItem('deviceUser', JSON.stringify(simulationUsers[0]));
      Device.setItem('type', 'internetdevice');
    }
    // otherwise if a user doesn't yet exist in the phone's local storage, we create one
    else if (window.localStorage.getItem('deviceUser') === null) {
      var deviceUser = { first: '', last: '', status: 'fresh', uuid: Device.getItem('uuid') };
      console.log("Device User: ", JSON.stringify(deviceUser));
      window.localStorage.setItem('deviceUser', JSON.stringify(deviceUser));
      // Don't know why we need to do this here to work on phone
      // expect that accessing storage takes too long
      AccountService.authAndRoute();
    }
    console.log("Platform Done Ready");
    
  });
});