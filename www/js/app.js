// Ionic Starter App

var firebaseUrl = "https://sweltering-heat-2752.firebaseio.com";

function onDeviceReady() {
    angular.bootstrap(document, ["ideabook"]);
}
document.addEventListener("deviceready", onDeviceReady, false);

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('ideabook', ['ionic', 'ideabook.controllers', 'ideabook.services', 'firebase'])

.run(function($ionicPlatform, $rootScope, $location, Auth, $ionicLoading) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.firebaseUrl = firebaseUrl;
    $rootScope.displayName = null;

    Auth.$onAuth(function (authData) {
        if (authData) {
            console.log("Logged in as:", authData.uid);
        } else {
            console.log("Logged out");
            $ionicLoading.hide();
            $location.path('/login');
        }
    });

    $rootScope.logout = function () {
        console.log("Logging out from the app");
        $ionicLoading.show({
            template: 'Logging Out...'
        });
        Auth.$unauth();
    }

    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $location.path("/login");
        }
    });

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', { 
    url: "/login", 
    templateUrl: "templates/login/login.html", 
    controller: 'LoginCtrl',
    resolve: { 
      "currentAuth": ["Auth", function (Auth) { 
        console.log(Auth)
        return Auth.$waitForAuth(); 
      }] 
    }
  })


  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    resolve: {
      "currentAuth": ["Auth", function (Auth) {
        console.log(Auth)
        return Auth.$requireAuth();
      }]
    }
  })

  // Each tab has its own nav history stack:

  // .state('tab.dash', {
  //   url: '/dash',
  //   views: {
  //     'tab-dash': {
  //       templateUrl: 'templates/tab-dash.html',
  //       controller: 'DashCtrl'
  //     }
  //   }
  // })
  .state('tab.ideas', {
      url: '/ideas',
      views: {
        'tab-ideas': {
          templateUrl: 'templates/ideas/ideas.html',
          controller: 'IdeasAllCtrl'
        }
      }
    })
    .state('tab.idea-new', {
      url: '/ideas/new',
      cache: false,
      views: {
        'tab-ideas': {
          templateUrl: 'templates/ideas/idea-new.html',
          controller: 'IdeaNewCtrl'
        }
      },
    })
    .state('tab.idea-detail', {
      url: '/ideas/:ideaId',
      views: {
        'tab-ideas': {
          templateUrl: 'templates/ideas/idea-detail.html',
          controller: 'IdeaDetailCtrl'
        }
      }
    })

  .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
