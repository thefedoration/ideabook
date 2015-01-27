angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('IdeasCtrl', function($scope, Ideas) {
  	$scope.ideas = Ideas.all();

	// stringifys date for input
	$scope.toStringDate = function(date){
		if (date){return date.yyyymmdd();}
	}
})

.controller('IdeaNewCtrl', function($scope, $stateParams, $state, $ionicModal, Ideas, Categories) {
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

	$scope.saveCategory = function(category){
		Categories.new(category);
		$scope.idea.category = category.name;
		$scope.closeModal();
	}

	// watches category to see if new category modal to be opened
	$scope.$watch('idea.category', function(value) {
	    if (value=='New Category') {$scope.openModal()}
	}, true);

	/*
	**	NEW CATEGORY STUFF
	*/
	$ionicModal.fromTemplateUrl('new-category.html', {
	scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openModal = function() {
		$scope.category = {};
		$scope.categoryColors = ['#e5e5e5','#145fd7','#43cee6','#66cc33','#f0b840','#ef4e3a','#8a6de9','#444']
		$scope.modal.show();
	};
	$scope.closeModal = function() {
	    $scope.modal.hide();
	};
	$scope.$on('modal.hidden', function() {
	    if ($scope.idea.category=='New Category'){
	    	$scope.idea.category=undefined;
	    }
	    $scope.category = {};
	});
	$scope.setCategoryColor = function(c) {
		if (!$scope.category){
			$scope.category = {}
		}

		$scope.category.color=c;
	}
	/*	NEW CATEGORY STUFF */
})

.controller('IdeaDetailCtrl', function($scope, $stateParams, Ideas) {
  $scope.idea = Ideas.get($stateParams.ideaId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
