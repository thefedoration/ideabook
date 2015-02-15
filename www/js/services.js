
angular.module('ideabook.services', ['firebase'])

.factory("Auth", ["$firebaseAuth", "$rootScope", 
  function ($firebaseAuth, $rootScope) { 
    var ref = new Firebase(firebaseUrl); 
    return $firebaseAuth(ref); 
  }
])


.factory('Ideas', function($window, $firebase, $rootScope) {
  var ref = new Firebase($rootScope.firebaseUrl); 
  var ideasRef = ref.child('ideas');

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
      return $firebase(ideasRef).$remove(idea.$id);
    },
    new: function(idea){
      idea.userId = $rootScope.userId;
      idea.category = idea.category.$id;
      idea.date = idea.date.toDateString();
      idea.created = (new Date).getTime();
      return $firebase(ideasRef).$push(idea);
    },
  }
})

.factory('Categories', function($window, $q, $firebase, $rootScope) {
  var ref = new Firebase($rootScope.firebaseUrl); 
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
      return $firebase(categoriesRef).$remove(category.$id);
    },
    // not using because we need async callback, so calling this directly in controller
    // new: function(category){
    //   category.userId = $rootScope.userId;
    //   category.created = (new Date).getTime();
    //   $firebase(categoriesRef).push(category);
    // },
  }
})


// gets next id from an array of items
// function getNextId(items){
//   if (!items || items.length==0){
//     return 1;
//   }
//   var ids = items.map(function(item){return item.id})
//   return (Math.max.apply(null, ids) + 1);
// }
