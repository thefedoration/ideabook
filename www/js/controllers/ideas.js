var ideaControllers = angular.module('ideaControllers', []);
ideaControllers.controller('IdeasAllCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, $ionicModal, Ideas, Categories) {
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
		$scope.filteredIdeas = $scope.ideas;
	}

	$scope.fetchCategories = function(){
		$scope.categories = Categories.allForUser($rootScope.userId);
	}

	$scope.filterCategory = function(category){
		if (category){
			$scope.filteredIdeas = ($scope.ideas).filter(function(idea){
				return (idea.category==category.$id)
			})
		} else {
			$scope.filteredIdeas = $scope.ideas;
		}
		$scope.activeCategory = category;
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

	// makes sure that we get the ideas when userId comes in
	$scope.$watch('userId', function() {
       $scope.fetchIdeas()
       $scope.fetchCategories()
   	});

	// watches when ideas are loaded to end loading animation
   	$scope.$watch('ideas', function() {
   		$scope.ideas.$loaded().then(function() {
   			// $scope.ideasLoaded = true;
   			setTimeout(function(){
   				$scope.ideasLoaded = true;
   			}, 100);
	    });
   	});

   	// watches categories to see if it should add any initial fixtures
   	$scope.$watch('categories', function() {
   		$scope.categories.$loaded().then(function() {
   			setTimeout(function(){
   				if ($scope.categories.length==0){
   					$scope.createCategoryFixtures($scope.userId);
   				}
   			}, 200);
	    });
   	});

	/****  init ****/
	$scope.fetchIdeas()
	$scope.fetchCategories()
})


.controller('IdeaNewCtrl', function($scope, $rootScope, $firebase, $stateParams, $ionicModal, $state, Ideas, Categories) {
	$scope.idea = {'date': (new Date())};
	$scope.categories = Categories.allForUser($rootScope.userId);

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

	// saves category, hides modal, sets current category
	$scope.saveCategory = function(category){
		category.userId = $rootScope.userId;
      	category.created = (new Date).getTime();
      	$firebase($scope.categoriesRef).$push(category).then(function(newCategory){
      		$scope.idea.category = newCategory.key()
      		$scope.modal.hide();
      	});	
	}

	// when closing new category modal, set category to blank
	$scope.$on('modal.hidden', function() {
	    if ($scope.idea.category.name==' New Category'){
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


.controller('IdeaDetailCtrl', function($scope, $state, $stateParams, Ideas, $ionicPopup, $ionicActionSheet) {
  	$scope.idea = Ideas.get($stateParams.ideaId);

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
            console.log('BUTTON CLICKED', index);
            return true;
          },
          destructiveButtonClicked: function () {
       		$scope.deleteIdea($scope.idea)
            return true;
          }
        });
    };
})



