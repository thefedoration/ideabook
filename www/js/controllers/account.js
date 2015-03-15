var accountControllers = angular.module('accountControllers', []);
accountControllers.controller('AccountCtrl', function($scope, $rootScope, $firebaseAuth, $rootScope, Users, Ideas) {
	$scope.numChildren = function(node){
		if (node){
			return Object.keys(node).filter(function(key){
				return (key.indexOf('$') == -1)
			}).length
		}
		return 0
	}

	if($rootScope.userId){
		$scope.currentUser = Users.get($rootScope.userId);
		$scope.ideas = Ideas.allForUser($rootScope.userId);
	}

	$scope.settings = {
		enableFriends: true
	};
});
