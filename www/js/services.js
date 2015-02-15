
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
      idea.date = idea.date.toDateString();
      idea.created = (new Date).getTime();
      return ideasRef.push(idea);
    },
  }
})

.factory('Categories', function() {

  // set up initial empty array of ideas
  var initialCategories = [
    {name: ' New Category', id:0},
    {name: 'Products', icon: 'wand', color: '#43cee6', id:1},
    {name: 'Businesses', icon: 'social-bitcoin', color: '#ef4e3a', id:2},
    {name: 'Software Projects', icon: 'code-working', color: '#66cc33', id:3},
  ];

  var categories = initialCategories;

  return {
    all: function() {
      return categories.sort(function(a, b) {return (a['name'] < b['name']) ? 1 : (a['name'] > b['name']) ? -1 : 0});
    },
    remove: function(category) {
      categories.splice(categories.indexOf(category), 1);
    },
    get: function(categoryId) {
      for (var i = 0; i < categories.length; i++) {
        if (categories[i].id === parseInt(categoryId)) {
          return categories[i];
        }
      }
      return null;
    },
    new: function(category){
      var found = categories.filter(function(item){
        return (item.name==category.name);
      })
      if (!found || !found.length){
        category.id = getNextId(categories);
        categories.unshift(category);
        return category;
      }
    },
  }
})


// gets next id from an array of items
function getNextId(items){
  if (!items || items.length==0){
    return 1;
  }
  var ids = items.map(function(item){return item.id})
  return (Math.max.apply(null, ids) + 1);
}
