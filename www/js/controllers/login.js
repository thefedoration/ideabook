var loginControllers = angular.module('loginControllers', []);
loginControllers.controller('LoginCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) { 
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
				alert("User created successfully!"); 
				ref.child("users").child(userData.uid).set({ 
					email: user.email, 
				}); 

				// creates initial category fixtures
				$scope.createCategoryFixtures(userData.uid);
				$ionicLoading.hide(); 
				$scope.modal.hide(); 
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
					// To Update AngularJS $scope either use $apply or $timeout 
					$scope.$apply(function () { 
						// apply values to scope here?
					}); 
				}); 
				$ionicLoading.hide(); 
				$state.go('tab.ideas'); 
			}).catch(function (error) { 
				alert("Authentication failed:" + error.message); 
				$ionicLoading.hide(); 
			}); 
		} else alert("Please enter email and password both"); 
	} 

	$scope.createCategoryFixtures = function(uid){
		var initialCategories = [
			{name: ' New Category', userId: uid},
		    {name: 'Products', icon: 'wand', color: '#43cee6', userId: uid},
		    {name: 'Businesses', icon: 'social-bitcoin', color: '#ef4e3a', userId: uid},
		    {name: 'Software Projects', icon: 'code-working', color: '#66cc33', userId: uid},
		];
		initialCategories.forEach(function(category){
			ref.child("categories").push(category); 
		})
	}
})