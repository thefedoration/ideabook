angular.module('ideabook.services', ['firebase'])
// angular.module('ionic.utils', [])

// .factory('$localstorage', ['$window', function($window) {
//   return {
//     set: function(key, value) {
//       $window.localStorage[key] = value;
//     },
//     get: function(key, defaultValue) {
//       return $window.localStorage[key] || defaultValue;
//     },
//     setObject: function(key, value) {
//       $window.localStorage[key] = JSON.stringify(value);
//     },
//     getObject: function(key) {
//       return JSON.parse($window.localStorage[key] || '{}');
//     }
//   }
// }]);


.factory("Auth", ["$firebaseAuth", "$rootScope", 
  function ($firebaseAuth, $rootScope) { 
    var ref = new Firebase(firebaseUrl); 
    return $firebaseAuth(ref); 
  }
])



.factory('Ideas', function($window) {

  var initialIdeas = [{title: 'My first idea', description: 'something genius', id:1, category: 1}];
  var ideas = initialIdeas;

  return {
    all: function() {
      return ideas.sort(function(i1,i2){
        return (new Date(i1.date) - new Date(i2.date)) ? -1 : (new Date(i2.date) - new Date(i1.date)) ? 1 : 0;
      });
    },
    remove: function(idea) {
      ideas.splice(ideas.indexOf(idea), 1);
    },
    get: function(ideaId) {
      for (var i = 0; i < ideas.length; i++) {
        if (ideas[i].id === parseInt(ideaId)) {
          return ideas[i];
        }
      }
      return null;
    },
    new: function(idea){
      idea.id = getNextId(ideas);
      ideas.unshift(idea);
      return idea;
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
      // console.log(categories, categoryId)
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
