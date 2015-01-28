angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

// .controller('IdeasAllCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, Categories) {
//   	$scope.categories = Categories.all();

// 	/*
// 	**	NEW CATEGORY STUFF
// 	*/
// 	$ionicModal.fromTemplateUrl('new-category.html', {
// 	scope: $scope,
// 		animation: 'slide-in-up'
// 	}).then(function(modal) {
// 		$scope.modal = modal;
// 	});
// 	$scope.saveCategory = function(category){
// 		category = Categories.new(category);
// 		if ($scope.idea){
// 			$scope.idea.category = category.id;
// 		}
// 		$scope.closeModal();
// 	}
// 	$scope.setCategoryColor = function(c) {
// 		$scope.category.color=c;
// 	}
// 	$scope.setCategoryIcon = function(i) {
// 		$scope.category.icon=i;
// 	}
// 	$scope.openCategoryModal = function() {
// 		$scope.category = {};
// 		$scope.categoryColors = ['#e5e5e5','#145fd7','#43cee6','#66cc33','#f0b840','#ef4e3a','#8a6de9','#444'];
// 		$scope.categoryIcons = ['home','search','heart','settings','email','paper-airplane','upload','medkit','map','person-add','chatbox-working','beer','pizza','power','camera','image','flash','bug','music-note','mic-a','bag','card','cash','pricetags','happy','sad','trophy','beaker','earth','planet','bonfire','leaf','model-s','plane','ios7-cart','ios7-home','ios7-bookmarks','ios7-americanfootball', 'ios7-paw', 'ios7-eye'];
// 		$scope.modal.show();
// 	};
// 	$scope.closeCategoryModal = function() {
// 	    $scope.modal.hide();
// 	};
// 	// end of new category stuff
// })

.controller('IdeasAllCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, Ideas, Categories) {
  	$scope.ideas = Ideas.all();
  	$scope.categories = Categories.all();

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

.controller('IdeaDetailCtrl', function($scope, $stateParams, Ideas) {
  $scope.idea = Ideas.get($stateParams.ideaId);
})

.controller('FriendsCtrl', function($scope) {

})

.controller('FriendDetailCtrl', function($scope, $stateParams) {

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
