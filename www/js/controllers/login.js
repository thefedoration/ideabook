var loginControllers = angular.module('loginControllers', []);
loginControllers.controller('LoginCtrl', function($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope, Categories) { 
	var ref = new Firebase($rootScope.firebaseUrl); 
	var auth = $firebaseAuth(ref); 

	$ionicModal.fromTemplateUrl('templates/login/signup.html', { 
		scope: $scope, animation: 'slide-in-up'
	}).then(function (modal) { 
		$scope.modal = modal; 
	}); 

	$scope.createUser = function (user) { 
		console.log("Create User Function called"); 
		if (user && user.email && user.password) { 
			$ionicLoading.show({ 
				template: 'Signing Up...' 
			}); 
			auth.$createUser({ 
				email: user.email, 
				password: user.password 
			}).then(function (userData) { 
				ref.child("users").child(userData.uid).set({ 
					email: user.email, 
				}); 
				$ionicLoading.hide(); 
				$scope.modal.hide(); 
				$rootScope.userId = userData.uid;
				$scope.createCategoryFixtures();
			}).catch(function (error) { 
				alert("Error: " + error); 
				$ionicLoading.hide(); 
			}); 
		} else alert("Please fill all details"); 
	} 
	
	$scope.signIn = function (user) { 
		if (user && user.email && user.pwdForLogin) { 
			$ionicLoading.show({ 
				template: 'Signing In...' 
			}); 
			auth.$authWithPassword({ 
				email: user.email, 
				password: user.pwdForLogin 
			}).then(function (authData) { 
				ref.child("users").child(authData.uid).once('value', function (snapshot) { 
					var val = snapshot.val();
					$rootScope.userId = authData.uid;
					if (!val.categories || Object.keys(val.categories).length==0){
						$scope.createCategoryFixtures();
					}
				}); 
				$ionicLoading.hide(); 
				$state.go('tab.ideas'); 
			}).catch(function (error) { 
				alert("Authentication failed:" + error.message); 
				$ionicLoading.hide(); 
			}); 
		} else alert("Please enter email and password both"); 
	} 

   	// created initial category fixtures
	$scope.createCategoryFixtures = function(){
		var initialCategories = [
			{name: ' New Category'},
		    {name: 'Product', icon: 'wand', color: '#43cee6'},
		    {name: 'Business', icon: 'social-bitcoin', color: '#ef4e3a'},
		    {name: 'Software Project', icon: 'code-working', color: '#66cc33'},
		];
		initialCategories.forEach(function(category){
			Categories.new(category)
		})
	}
})