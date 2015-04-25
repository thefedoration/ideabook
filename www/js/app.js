
var firebaseUrl = "https://sweltering-heat-2752.firebaseio.com";

function onDeviceReady() {
    angular.bootstrap(document, ["ideabook"]);
}
document.addEventListener("deviceready", onDeviceReady, false);

var ideabook = angular.module('ideabook', [
  'ionic', 
  'firebase', 
  'ideabook.services',
  'loginControllers',
  'ideaControllers',
  'feedControllers',
  'friendControllers',
  'accountControllers',
])
.run(function($ionicPlatform, $rootScope, $location, Auth, $ionicLoading, $http) {

  $rootScope.firebaseUrl = firebaseUrl;
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    // org.apache.cordova.statusbar required
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    Auth.$onAuth(function (authData) {
      if (authData) {

        // set rootscope variables that we might use in our app
        $rootScope.userId = authData.uid;
        $rootScope.fbId = authData.facebook.id;
        $rootScope.authToken = authData.facebook.accessToken;

        $location.path('/tab/ideas');
      } else {
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

    $rootScope.numChildren = function(node){
      if (node){
        return Object.keys(node).filter(function(key){
          return (key.indexOf('$') == -1)
        }).length
      }
      return 0
    }

    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the login page
        if (error === "AUTH_REQUIRED") {
            $location.path("/login");
        }
    });

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // ionic configurations
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.backButton.text('Back').icon('ion-chevron-left');
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.navBar.alignTitle('center');

  $stateProvider
  .state('login', { 
    url: "/login", 
    templateUrl: "templates/login/login.html", 
    controller: 'LoginCtrl',
    resolve: { 
      "currentAuth": ["Auth", function (Auth) { 
        return Auth.$waitForAuth(); 
      }] 
    }
  })
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    resolve: {
      "currentAuth": ["Auth", function (Auth) {
        return Auth.$requireAuth();
      }]
    }
  })
  .state('tab.ideas', {
      url: '/ideas',
      views: {
        'tab-ideas': {
          templateUrl: 'templates/ideas/ideas.html',
          controller: 'IdeasAllCtrl'
        }
      },
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
    .state('tab.idea-edit', {
      url: '/ideas/:ideaId/edit',
      views: {
        'tab-ideas': {
          templateUrl: 'templates/ideas/idea-new.html',
          controller: 'IdeaEditCtrl'
        }
      },
    })

  .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friends/friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friends/friend.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/account/account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.feed', {
    url: '/feed',
    views: {
      'tab-feed': {
        templateUrl: 'templates/feed/feed.html',
        controller: 'FeedCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

