angular.module('ideabook.controllers', [])

.controller('LoginCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) { 
	var ref = new Firebase($rootScope.firebaseUrl); 
	var auth = $firebaseAuth(ref); 

	$ionicModal.fromTemplateUrl('templates/login/signup.html', { 
		scope: $scope 
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
})



.controller('DashCtrl', function($scope) {})

.controller('IdeasAllCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, $ionicModal, Ideas, Categories) {
  	/****  actions ****/
	// stringifys date for input
	$scope.toStringDate = function(date){
		if (date){return date.yyyymmdd();}
	}

	$scope.getCategory = function(id){
		return Categories.get(id);
	}

	$scope.openSidemenu = function(){
		$ionicSideMenuDelegate.toggleLeft();
	}

	$scope.fetchIdeas = function(){
		$scope.ideas = Ideas.allForUser($rootScope.userId);
		$scope.filteredIdeas = $scope.ideas;
	}

	$scope.filterCategory = function(category){
		if (category){
			$scope.filteredIdeas = ($scope.ideas).filter(function(idea){
				return (idea.category==category.id)
			})
		} else {
			$scope.filteredIdeas = $scope.ideas;
		}
		$scope.activeCategory = category;
	}

	// makes sure that we get the ideas when userId comes in
	$scope.$watch('userId', function() {
       $scope.fetchIdeas()
   	});

   	$scope.$watch('filteredIdeas', function() {
   		$scope.filteredIdeas.$loaded().then(function() {
   			setTimeout(function(){
   				$scope.ideasLoaded = true;
   			}, 100);
	    });
   	});

	/****  init ****/
	$scope.fetchIdeas()
  	$scope.categories = Categories.all();
})

.controller('IdeaNewCtrl', function($scope, $stateParams, $ionicModal, $state, Ideas, Categories) {
	$scope.idea = {'date': (new Date())};
	$scope.categories = Categories.all();

	// saves idea then returns to list of them
	$scope.saveIdea = function(idea){
		$scope.errors = {};
		var formElements = ['date', 'title', 'description', 'category']
		var errors = formElements.filter(function(element){return !$scope.idea[element]});
		if (errors && errors.length){
			errors.forEach(function(error){
				$scope.errors[error] = true;
			});
		} else {
			Ideas.new(idea);
			$state.go('tab.ideas');
		}
	}

	// watches category to see if new category modal to be opened
	$scope.$watch('idea.category', function(value) {
	    if (value==0) {$scope.openCategoryModal()} // 'New Category' has value of 0
	}, true);

	$scope.$on('modal.hidden', function() {
	    if ($scope.idea.category=='New Category'){
	    	$scope.idea.category=undefined;
	    }
	    $scope.category = {};
	});

	/*
	**	NEW CATEGORY STUFF
	*/
	$ionicModal.fromTemplateUrl('new-category.html', {
	scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.saveCategory = function(category){
		category = Categories.new(category);
		if ($scope.idea){
			$scope.idea.category = category.id;
		}
		$scope.closeCategoryModal();
	}
	$scope.setCategoryColor = function(c) {
		$scope.category.color=c;
	}
	$scope.setCategoryIcon = function(i) {
		$scope.category.icon=i;
	}
	$scope.openCategoryModal = function() {
		$scope.category = {};
		$scope.categoryColors = ['#e5e5e5','#145fd7','#43cee6','#66cc33','#f0b840','#ef4e3a','#8a6de9','#444'];
		$scope.categoryIcons = ['home','search','heart','settings','email','paper-airplane','upload','medkit','map','person-add','chatbox-working','beer','pizza','power','camera','image','flash','bug','music-note','mic-a','bag','card','cash','pricetags','happy','sad','trophy','beaker','earth','planet','bonfire','leaf','model-s','plane','ios7-cart','ios7-home','ios7-bookmarks','ios7-americanfootball', 'ios7-paw', 'ios7-eye'];
		$scope.modal.show();
	};
	$scope.closeCategoryModal = function() {
	    $scope.modal.hide();
	};
	// end of new category stuff
})

.controller('IdeaDetailCtrl', function($scope, $state, $stateParams, Ideas) {
  	$scope.idea = Ideas.get($stateParams.ideaId);

  	$scope.deleteIdea = function(idea) {
    	Ideas.remove(idea)
    	$state.go('tab.ideas');
	};
})

.controller('FriendsCtrl', function($scope) {

})

.controller('FriendDetailCtrl', function($scope, $stateParams) {

})

.controller('AccountCtrl', function($scope, $firebaseAuth, $rootScope) {
	

	$scope.settings = {
		enableFriends: true
	};
});
