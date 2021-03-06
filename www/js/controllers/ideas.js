var ideaControllers = angular.module('ideaControllers', []);
ideaControllers.controller('IdeasAllCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $ionicModal, Ideas, Categories) {
  	/****  actions ****/
	// stringifys date for input
	$scope.toStringDate = function(date){
		if (date){return date.yyyymmdd();}
	}

	// this fires too many times. why?
	$scope.getCategory = function(id){
		for (key in $scope.categories){
			if(typeof $scope.categories[key] === 'object'){
				if ($scope.categories[key] && $scope.categories[key]['$id']==id){
					return $scope.categories[key]
				}
			}
		}
	}

	// spits out number of children in a node (makes sure not to count dolla $igns)
	$scope.numChildren = function(node){
		if (node){
			return Object.keys(node).filter(function(key){
				return (key.indexOf('$') == -1)
			}).length
		}
		return 0
	}

	$scope.openSidemenu = function(){
		$ionicSideMenuDelegate.toggleLeft();
	}

	$scope.fetchIdeas = function(){
		$scope.ideas = Ideas.allForUser($rootScope.userId);
	}

	$scope.fetchCategories = function(){
		$scope.categories = Categories.allForUser($rootScope.userId);
	}

	// sets active category
	$scope.filterCategory = function(category){
		$scope.activeCategory = category;
		$rootScope.activeCategory = category;
	}

	// returns value to order the list of ideas by. goes by date first, then timestamp. reverse order
	$scope.orderByDate = function(idea) {
		var date = (new Date(idea.date)).getTime()
		return 0 - parseInt(String(date)+String(idea.created))
	};

	// deletes category if it has no ideas in it
	$scope.deleteCategory = function(category) {
		if (category && category.ideas && Object.keys(category.ideas).length){
			return $ionicPopup.alert({
		     title: 'Unable to delete category',
		     template: 'It has ideas in it!'
		   });
		}
		$ionicPopup.confirm({
			title: 'Delete Category',
			template: 'Are you sure you want to delete this category?'
		}).then(function(res) {
			if(res){
				Categories.remove(category)
				$scope.filterCategory(undefined);
			}
		});
	};

	// clears all ideas from a category
	$scope.clearCategory = function(category) {
		$ionicPopup.confirm({
			title: 'Clear Category',
			template: 'Are you sure you want to delete all of the ideas in this category?'
		}).then(function(res) {
			if(res && category.ideas && Object.keys(category.ideas)){
				Object.keys(category.ideas).forEach(function(ideaId){
					var idea = Ideas.get(ideaId)
					Ideas.remove(idea)
				})
			}
		});
	};

	// makes sure that we get the ideas when userId comes in
	$scope.$watch('userId', function() {
       $scope.fetchIdeas()
       $scope.fetchCategories()
   	});

	// watches when ideas are loaded to end loading animation
   	$scope.$watch('ideas', function() {
   		$scope.ideas.$loaded().then(function() {
   			$scope.ideasLoaded = true;
	    });
   	});

	/****  init ****/
	$scope.fetchIdeas()
	$scope.fetchCategories()
})


.controller('IdeaNewCtrl', function($scope, $rootScope, $firebase, $stateParams, $ionicModal, $state, Ideas, Categories) {
	$scope.idea = {'date': (new Date()), 'privacy':'private'};
	$scope.categories = Categories.allForUser($rootScope.userId);


	// fancy select
	$scope.privacyOptions = [
	    {option:'private', checked: true, icon: 'ion-ios7-locked'}, 
	    {option:'all friends', checked: false, icon: 'ion-earth'}, 
	    {option:'selected friends', checked: false, icon: 'ion-ios7-people', friends:[]}
    ];
    $scope.privacy = $scope.privacyOptions.filter(function(item){
    	return item.checked
    })[0];

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

	/****  new category stuff ****/
	$scope.categoriesRef = (new Firebase($rootScope.firebaseUrl)).child('categories');

	// watches category to see if new category modal to be opened
	$scope.$watch('idea.category', function(id) {
		if (id){
			var category = $firebase($scope.categoriesRef.child(id)).$asObject();
			category.$loaded().then(function(){
				if (category && category.name==' New Category') {$scope.openCategoryModal()}
			})
		}
	}, true);

	// if we have category in sidebar, set current
	$scope.$watch('activeCategory', function(activeCategory) {
		if (activeCategory){
			$scope.idea.category=activeCategory.$id;
		}
	}, true);

	// saves category, hides modal, sets current category
	$scope.saveCategory = function(category){
		category.userId = $rootScope.userId;
      	category.created = (new Date).getTime();

      	Categories.new(category).then(function(newCategory) {
      		$scope.idea.category = newCategory;
      		$scope.modal.hide();
      	})
	}

	// when closing new category modal, set category to blank
	$scope.$on('modal.hidden', function() {
	    if ($scope.idea.category.name==' New Category' || !$scope.idea.category.name){
	    	$scope.idea.category=undefined;
	    }
	    $scope.category = {};
	});

	// initialize new category modal
	$ionicModal.fromTemplateUrl('templates/ideas/category-new.html', { 
		scope: $scope, animation: 'slide-in-up'
	}).then(function (modal) { 
		$scope.modal = modal; 
	}); 

	// opens and initializes the options
	$scope.openCategoryModal = function() {
		$scope.category = {};
		$scope.categoryColors = ['#e5e5e5','#145fd7','#43cee6','#66cc33','#f0b840','#ef4e3a','#8a6de9','#444'];
		$scope.categoryIcons = ['home','search','heart','settings','email','paper-airplane','upload','medkit','map','person-add','chatbox-working','beer','pizza','power','camera','image','flash','bug','music-note','mic-a','bag','card','cash','pricetags','happy','sad','trophy','beaker','earth','planet','bonfire','leaf','model-s','plane','ios7-cart','ios7-home','ios7-bookmarks','ios7-americanfootball', 'ios7-paw', 'ios7-eye'];
		$scope.modal.show();
	};
})


.controller('IdeaDetailCtrl', function($scope, $rootScope, $state, $stateParams, Ideas, Categories, Users, $ionicPopup, $ionicActionSheet) {

  	// this fires too many times. why?
	$scope.getCategory = function(id){
		for (key in $scope.categories){
			if(typeof $scope.categories[key] === 'object'){
				if ($scope.categories[key] && $scope.categories[key]['$id']==id){
					return $scope.categories[key]
				}
			}
		}
	}

  	$scope.deleteIdea = function(idea) {
		$ionicPopup.confirm({
			title: 'Delete Idea',
			template: 'Are you sure you want to delete this idea?'
		}).then(function(res) {
			if(res){
				Ideas.remove(idea)
    			$state.go('tab.ideas');
			}
		});
	};

	$scope.showActionsheet = function () {
        $ionicActionSheet.show({
          // titleText: 'Idea Actions',
          buttons: [
            { text: 'Edit' },
            { text: 'Share' },
          ],
          destructiveText: 'Delete',
          cancelText: 'Cancel',
          buttonClicked: function (index) {
            if (index==0){
            	return $state.go('tab.idea-edit', {'ideaId':$scope.idea.$id});
            }
            return true;
          },
          destructiveButtonClicked: function () {
       		$scope.deleteIdea($scope.idea)
            return true;
          }
        });
    };

    $scope.objectLength = function (items) {
    	if (!items){return 0}
    	return Object.keys(items).length
    }

    /****  init ****/
    $scope.idea = Ideas.get($stateParams.ideaId);
  	$scope.idea.$loaded(function(){
  		$scope.category = Categories.get($scope.idea.category)
  		$scope.user = Users.get($scope.idea.userId)
  	})
})

.controller('IdeaEditCtrl', function($scope, $rootScope, $controller, $firebase, $stateParams, $state, Ideas, Categories) {

	/****  init ****/

	// inherits IdeaNewCtrl because a lot of the functions are the same
	$controller('IdeaNewCtrl', {$scope: $scope});

	// $scope.categories = Categories.allForUser($rootScope.userId);
    $scope.idea = Ideas.get($stateParams.ideaId);
  	$scope.idea.$loaded(function(){
	    $scope.idea.date = new Date($scope.idea.date);
  		$scope.category = Categories.get($scope.idea.category)
  	})

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
			Ideas.update(idea);
			$state.go('tab.idea-detail', {'ideaId':$scope.idea.$id});
		}
	}
})



