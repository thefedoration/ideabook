// turns date into proper format
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
};

// reverses angular ng-repeat (used to get newest first)
ideabook.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

// filters by property, returns all if property undefined
ideabook.filter('filterByProperty', function() {
  return function(ideas, property, value) {
  	if (!value){ return ideas }
  	return ideas.filter(function(idea){
  		return idea[property]==value;
  	})
  };
});