angular.module('starter.services', [])

.factory('Ideas', function() {
  // Might use a resource here that returns a JSON array

  // set up initial empty array of ideas
  var ideas = [];

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
      ideas.unshift(idea);
    },
  }
})

.factory('Categories', function() {
  // Might use a resource here that returns a JSON array

  // set up initial empty array of ideas
  var categories = [
    {name: 'Products'},
    {name: 'Businesses'},
    {name: 'Software Projects'},
  ];

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
        categories.unshift(category);
      }
    },
  }
})


/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});
