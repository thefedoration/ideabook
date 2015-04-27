var loginControllers = angular.module('loginControllers', []);
loginControllers.controller('LoginCtrl', function($scope, $ionicModal, $state, $http, $firebaseAuth, $ionicLoading, $rootScope, Categories) { 
	var ref = new Firebase($rootScope.firebaseUrl); 
	var auth = $firebaseAuth(ref); 

	$ionicModal.fromTemplateUrl('templates/login/signup.html', { 
		scope: $scope, animation: 'slide-in-up'
	}).then(function (modal) { 
		$scope.modal = modal; 
	}); 

	$scope.logInWithFacebook = function () { 
		$ionicLoading.show({ 
			template: 'Authenticating...' 
		}); 
		ref.authWithOAuthPopup("facebook", function(error, authData) {
			$ionicLoading.hide(); 
			if (error) {
				console.log("Login Failed!", error);
			} else {
				ref.child("users").child(authData.uid).once('value', function (snapshot) { 
					var val = snapshot.val();
					if (!val || !val.fbId){
						ref.child("users").child(authData.uid).set({ 
							provider: authData.provider, 
							firstName: authData.facebook.cachedUserProfile.first_name, 
							lastName: authData.facebook.cachedUserProfile.last_name, 
							fbId: authData.facebook.id, 
							link: authData.facebook.cachedUserProfile.link, 
							name: authData.facebook.cachedUserProfile.name, 
							picture: authData.facebook.cachedUserProfile.picture.data.url, 
							email: authData.facebook.email
						}); 
					}

					$ionicLoading.hide(); 
					$scope.modal.hide(); 

					// ref.child("users").child(authData.uid).once('value', function (snapshot) {console.log(snapshot.val())})

					// creates user's initial categories if they do not have any
					$scope.createCategoryFixtures(ref, authData);

					$state.go('tab.ideas'); 
				});
			}
		});
	} 

	// created initial category fixtures
	$scope.createCategoryFixtures = function(ref, authData){
		ref.child("users").child(authData.uid).once('value', function (snapshot) { 
			var val = snapshot.val();
			if (!val.categories || Object.keys(val.categories).length==0){
				console.log('creating categories')
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
		}); 
	}



	// $scope.createUser = function (user) { 
	// 	console.log("Create User Function called"); 
	// 	if (user && user.email && user.password) { 
	// 		$ionicLoading.show({ 
	// 			template: 'Signing Up...' 
	// 		}); 
	// 		auth.$createUser({ 
	// 			email: user.email, 
	// 			password: user.password 
	// 		}).then(function (userData) { 
	// 			ref.child("users").child(userData.uid).set({ 
	// 				email: user.email, 
	// 			}); 
	// 			$ionicLoading.hide(); 
	// 			$scope.modal.hide(); 
	// 			$rootScope.userId = userData.uid;
	// 			$scope.createCategoryFixtures();
	// 		}).catch(function (error) { 
	// 			alert("Error: " + error); 
	// 			$ionicLoading.hide(); 
	// 		}); 
	// 	} else alert("Please fill all details"); 
	// } 
	
	// $scope.signIn = function (user) { 
	// 	if (user && user.email && user.pwdForLogin) { 
	// 		$ionicLoading.show({ 
	// 			template: 'Signing In...' 
	// 		}); 
	// 		auth.$authWithPassword({ 
	// 			email: user.email, 
	// 			password: user.pwdForLogin 
	// 		}).then(function (authData) { 
	// 			ref.child("users").child(authData.uid).once('value', function (snapshot) { 
	// 				var val = snapshot.val();
	// 				$rootScope.userId = authData.uid;
	// 				if (!val.categories || Object.keys(val.categories).length==0){
	// 					$scope.createCategoryFixtures();
	// 				}
	// 			}); 
	// 			$ionicLoading.hide(); 
	// 			$state.go('tab.ideas'); 
	// 		}).catch(function (error) { 
	// 			alert("Authentication failed:" + error.message); 
	// 			$ionicLoading.hide(); 
	// 		}); 
	// 	} else alert("Please enter email and password both"); 
	// } 
})