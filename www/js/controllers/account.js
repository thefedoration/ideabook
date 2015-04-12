var accountControllers = angular.module('accountControllers', []);
accountControllers.controller('AccountCtrl', function($scope, $rootScope, $firebaseAuth, $rootScope, Users, Ideas) {

	if($rootScope.userId){
		$scope.currentUser = Users.get($rootScope.userId);
		$scope.ideas = Ideas.allForUser($rootScope.userId);
	}

	$scope.settings = {
		enableFriends: true
	};
});
