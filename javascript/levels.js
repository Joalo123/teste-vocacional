app = angular.module("quizlet");

app.factory("levels", function() {

  var courses = [];

  $.ajax({
    url: 'javascript/courses_b.csv',
    dataType: 'text',
  }).done(csvLoaded);

  function csvLoaded(data) {
    var allRows = data.split(/\r?\n|\r/);

    var header;
    for (var singleRow = 0; singleRow < allRows.length-1; singleRow++) {
      if (singleRow === 0) {
        header = allRows[singleRow].split(';');
      }else {
        cells = allRows[singleRow].split(';');
        courses.push({
          id: singleRow,
          name: cells[header.indexOf('name')],
          slug: cells[header.indexOf('slug')],
          area: cells[header.indexOf('area')],
          great_area: cells[header.indexOf('great_area')],
          description: cells[header.indexOf('description')],
          curve: {}
        })

        for (var i = 5; i < header.length; i++ ){
          courses[courses.length -1]['curve'][header[i]] = cells[i];
        }
      }
    }
  }

  var getMaxScores = function(score, categories){
    var score_arr = []
    norm = 0
    for (var cat = 0; cat < categories.length; cat++){
      var val = score[categories[cat]];
      score_arr.push({'category': categories[cat], 'value': val});
      norm += val*val;
    }
    norm = Math.sqrt(norm);
    for (var el = 0; el < score_arr.length; el++){
      score_arr[el]['value'] = Math.round( 100 * score_arr[el]['value'] / norm );
    }

    score_arr.sort(function(a, b){
      return b.value - a.value
    })

    return score_arr.slice(0,3);
  };


  var computeError = function(required, score){
    error = 0;

    for (cat in required){
      var s1 = score[required[cat]['category']]
      var s2 = required[cat]['value']
      error += (s1-s2)*(s1-s2);
    }
    return Math.sqrt(error/3);
  }

  return {
		getCourses: function(score) {

      categories =  Object.keys(score)

      for (var i = 0; i < courses.length; i++){
        courses[i].required = getMaxScores(courses[i].curve, categories);
        courses[i]['error'] = computeError(courses[i].required, score);
      }

      courses.sort(function(a,b){
        return a.error - b.error;
      });

      return courses.slice(0, 6);
		}
  };
});
