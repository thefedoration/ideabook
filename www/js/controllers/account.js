var accountControllers = angular.module('accountControllers', []);
accountControllers.controller('AccountCtrl', function($scope, $firebaseAuth, $rootScope) {
	$scope.settings = {
		enableFriends: true
	};
});
