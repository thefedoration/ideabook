var accountControllers = angular.module('accountControllers', []);
accountControllers.controller('AccountCtrl', function($scope, $rootScope, $firebaseAuth, $rootScope, Users, Ideas, Auth) {

	if($rootScope.userId){
		$scope.currentUser = Users.get($rootScope.userId);
		$scope.ideas = Ideas.allForUser($rootScope.userId);
	} else {
		console.log('no')
		Auth.$onAuth(function (authData) {
			if (authData) {
				console.log('auth on accounts page')
				// set rootscope variables that we might use in our app
				$rootScope.userId = authData.uid;
				$rootScope.fbId = authData.facebook.id;
				$rootScope.authToken = authData.facebook.accessToken;
				$scope.currentUser = Users.get($rootScope.userId);
				$scope.ideas = Ideas.allForUser($rootScope.userId);
			} else {
				console.log('no auth!')
			}
	    });
	}

	$scope.settings = {
		enableFriends: true
	};
});
