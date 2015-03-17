
angular.module('ideabook.services', ['firebase'])

.factory("Auth", ["$firebaseAuth", "$rootScope", 
  function ($firebaseAuth, $rootScope) { 
    var ref = new Firebase(firebaseUrl); 
    return $firebaseAuth(ref); 
  }
])


.factory('Ideas', function($window, $firebase, $rootScope, $q) {
  var ref = new Firebase($rootScope.firebaseUrl); 
  var ideasRef = ref.child('ideas');
  var usersRef = ref.child('users');
  var categoriesRef = ref.child('categories');

  return {
    all: function() {
      return $firebase(ideasRef.orderByChild("created").limitToLast(20)).$asArray(); 
    },
    allForUser: function(userId) {
      return $firebase(ideasRef.orderByChild("userId").startAt(userId).endAt(userId)).$asArray()
    },
    get: function(ideaId) {
      return $firebase(ideasRef.child(ideaId)).$asObject();
    },
    remove: function(idea) {
      idea.$loaded().then(function(idea){
        var categoryId = idea.category;
        var ideaId = idea.$id;
        var userId = idea.userId;
        $firebase(ideasRef).$remove(ideaId);
        $firebase(categoriesRef.child(categoryId).child('ideas')).$remove(ideaId);
        $firebase(usersRef.child(userId).child('ideas')).$remove(ideaId);
      })
    },
    new: function(idea){
      idea.userId = $rootScope.userId;
      idea.date = idea.date.toDateString();
      idea.created = (new Date).getTime();
      // adds idea to list of ideas then to category and user
      $firebase(ideasRef).$push(idea).then(function(newIdea){
        $firebase(categoriesRef.child(idea.category).child('ideas').child(newIdea.key())).$set(true);
        $firebase(usersRef.child(idea.userId).child('ideas').child(newIdea.key())).$set(true);
      });
    },
    update: function(idea){
      idea.date = idea.date.toDateString();

      // if we are changing categories, change the reference on the category
      var category = $firebase(ideasRef.child(idea.$id).child('category')).$asObject();
      category.$loaded(function(category){
        var oldCategory = category.$value;
        if (oldCategory!=idea.category){
          $firebase(categoriesRef.child(oldCategory).child('ideas')).$remove(idea.$id);
          $firebase(categoriesRef.child(idea.category).child('ideas').child(idea.$id)).$set(true);
        }

        // updates this idea with new information
        for (key in idea){
          if (idea[key] && key.indexOf('$')==-1 && key!=='forEach'){
            $firebase(ideasRef.child(idea.$id).child(key)).$set(idea[key])
          }
        }
      })
    },
  }
})

.factory('Categories', function($window, $q, $firebase, $rootScope) {
  var ref = new Firebase($rootScope.firebaseUrl); 
  var usersRef = ref.child('users');
  var categoriesRef = ref.child('categories');

  return {
    all: function(userId) {
      return $firebase(categoriesRef).$asArray()
    },
    allForUser: function(userId) {
      return $firebase(categoriesRef.orderByChild("userId").startAt(userId).endAt(userId)).$asArray();
    },
    get: function(categoryId) {
      return $firebase(categoriesRef.child(categoryId)).$asObject();
    },
    remove: function(category) {
      var categoryId = category.$id;
      var userId = $rootScope.userId;
      $firebase(categoriesRef).$remove(categoryId);
      $firebase(usersRef.child(userId).child('categories')).$remove(categoryId);
    },
    new: function(category){
      // create new category, add to user's categories. resolves a promise so we get category id
      category.userId = $rootScope.userId;
      category.created = (new Date).getTime();
      var deferred = $q.defer();
      $firebase(categoriesRef).$push(category).then(function(newCategory){
        $firebase(usersRef.child(category.userId).child('categories').child(newCategory.key())).$set(true);
        deferred.resolve(newCategory.key());
      })
      return deferred.promise;
    },
  }
})

.factory('Users', function($window, $firebase, $rootScope, $q) {
  var ref = new Firebase($rootScope.firebaseUrl); 
  var usersRef = ref.child('users');

  return {
    get: function(userId) {
      return $firebase(usersRef.child(userId)).$asObject();
    },
  }
})
