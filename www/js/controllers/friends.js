var friendControllers = angular.module('friendControllers', []);
friendControllers.controller('FriendsCtrl', function($scope, $rootScope, $http, $timeout) {

	$scope.ref = new Firebase($rootScope.firebaseUrl); 
	$scope.friendsLoaded = false;
	$scope.friends = [];

	// gets users friends list from facebook and updates the list
	$scope.updateFriendsList = function(){
		if ($rootScope.authToken){
	        $http.get('https://graph.facebook.com/'+ $rootScope.fbId +'/friends?access_token='+$rootScope.authToken).then(function(result) {
	            if (result && result.data && result.data.data){
	            	var friends = result.data.data;
	            	var numFriends = friends.length;
	            	var numLoadedFriends = 0;

	            	friends.forEach(function(friend){
	            		var user_id = 'facebook:'+String(friend.id);
	            		$scope.ref.child("users").child(user_id).once('value', function (snapshot) { 
	            			$scope.$apply(function(){
	            				numLoadedFriends += 1;
								var val = snapshot.val();
								if (val){
									$scope.friends.push(val)
								}
								if (numLoadedFriends==numFriends){
									$scope.friendsLoaded = true;
								}
							});
						});
	            	})
	            	
	            }
	        });
        } else {
        	$timeout(function(){
        		$scope.updateFriendsList()
        	}, 500)
        }
	}

	// initialize friends and people
	$scope.updateFriendsList();

})

.controller('FriendDetailCtrl', function($scope, $stateParams) {

})