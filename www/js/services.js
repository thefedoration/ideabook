angular.module('starter.services', [])
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




.factory('Ideas', ['$window', function($window) {

  var initialIdeas = [{title: 'My first idea', description: 'something genius', id:1, category: 1}];
  if (!$window.localStorage['ideas'] || true){$window.localStorage['ideas'] = JSON.stringify(initialIdeas)}

  return {
    all: function() {
      var ideas = JSON.parse($window.localStorage['ideas']);
      return ideas.sort(function(i1,i2){
        return (new Date(i1.date) - new Date(i2.date)) ? -1 : (new Date(i2.date) - new Date(i1.date)) ? 1 : 0;
      });
    },
    remove: function(idea) {
      var ideas = JSON.parse($window.localStorage['ideas']);
      $window.localStorage['ideas'] = JSON.stringify(ideas.splice(ideas.indexOf(idea), 1));
    },
    get: function(ideaId) {
      var ideas = JSON.parse($window.localStorage['ideas']);
      for (var i = 0; i < ideas.length; i++) {
        if (ideas[i].id === parseInt(ideaId)) {
          return ideas[i];
        }
      }
      return null;
    },
    new: function(idea){
      var ideas = JSON.parse($window.localStorage['ideas']);
      idea.id = getNextId(ideas);
      $window.localStorage['ideas'] = JSON.stringify(ideas.unshift(idea));
      return idea;
    },
  }
}])

.factory('Categories', ['$window', function($window) {

  // set up initial empty array of ideas
  var initialCategories = [
    {name: ' New Category', id:0},
    {name: 'Products', icon: 'wand', color: '#43cee6', id:1},
    {name: 'Businesses', icon: 'social-bitcoin', color: '#ef4e3a', id:2},
    {name: 'Software Projects', icon: 'code-working', color: '#66cc33', id:3},
  ];

  if (!$window.localStorage['categories'] || true){$window.localStorage['categories'] = JSON.stringify(initialCategories)}

  return {
    all: function() {
      var categories = JSON.parse($window.localStorage['categories']);
      return categories.sort(function(a, b) {return (a['name'] < b['name']) ? 1 : (a['name'] > b['name']) ? -1 : 0});
    },
    remove: function(category) {
      var categories = JSON.parse($window.localStorage['categories']);
      $window.localStorage['categories'] = JSON.stringify(categories.splice(categories.indexOf(category), 1));
    },
    get: function(categoryId) {
      var categories = JSON.parse($window.localStorage['categories']);
      for (var i = 0; i < categories.length; i++) {
        if (categories.id === parseInt(categoryId)) {
          return categories[i];
        }
      }
      return null;
    },
    new: function(category){
      var categories = JSON.parse($window.localStorage['categories']);
      var found = categories.filter(function(item){
        return (item.name==category.name);
      })
      if (!found || !found.length){
        category.id = getNextId(categories);
        $window.localStorage['categories'] = JSON.parse(categories.unshift(category));
        return category;
      }
    },
  }
}])


// gets next id from an array of items
function getNextId(items){
  if (!items || items.length==0){
    return 1;
  }
  var ids = items.map(function(item){return item.id})
  return (Math.max.apply(null, ids) + 1);
}
