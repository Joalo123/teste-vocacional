app = angular.module("quizlet");

jQuery.extend( jQuery.easing, {
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}
});


app.directive('quiz', function(questions, levels) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'quiz.html',
		link: function(scope, elem, attrs) {
			scope.send_to_rd_station = function(form_data){
				/*
				jQuery.ajax({
          type: 'POST',
          url: 'https://www.rdstation.com.br/api/1.2/conversions',
          data: form_data,
          crossDomain: true,
          error: function (response) {
            console.log(response);
          }
        });
				*/
			};

			scope.start = function() {

				scope.id = 0;

        scope.score = {};
				scope.categories = questions.getCategories();
				for (i in scope.categories){
					scope.score[scope.categories[i]] = 0;
				}
				scope.group_length = 3;
				scope.completed_percentage = 0;
				scope.questions_length = questions.length();
				scope.quizOver = false;
				scope.signed = true;


				scope.shared = false;
				scope.social_text = "";

				var data_array = {
					nome: 					 scope.name,
					email: 					 scope.email,
					identificador: 	 'iniciou-quiz',
					token_rdstation: 'TOKEN-RDSTATION'
				};

				//scope.send_to_rd_station(data_array);

				//ga('send', 'event', 'estagio_quiz', "iniciou");

			};

			scope.explained = function() {
				scope.inProgress = true;
				scope.getQuestions();
			}

			scope.reset = function() {
				scope.inProgress = false;
				scope.score = 0;
			}

			scope.setOptions = function(options) {
				var answerString = options[answer];
				var counter = options.length, temp, index;
		    while (counter > 0) {
		        index = Math.floor(Math.random() * counter);
		        counter--;
		        temp = options[counter];
		        options[counter] = options[index];
		        options[index] = temp;
		    }

				scope.options = options;
				scope.answer = options.indexOf(answerString);
			}

			scope.getQuestions = function() {
				scope.questions = [];


				for (var i=0; i < scope.group_length; i++){
					var question = questions.getQuestion(scope.id)

					if (question){
						scope.questions.push({
							question:question.question,
							category: question.category,
							id: scope.id
						});
						scope.id++
					}else {
						scope.group_length = i;
					}
				}

				if(scope.questions.length > 0) {

					scope.options = [1,2,3,4,5];

				} else {

					scope.quizOver = true;
					scope.hideProgress = true;
					scope.setResults();

				}
			};

			scope.setResults = function(){
				//scope.level = levels.getLevel(scope.score);
				//scope.social_text = "Fiz o Quiz e sou um " + scope.level.title +  ". Quer testar seu conhecimento?";

				scope.norm_score = []
		    norm = 0
		    for (i in scope.categories){
		      var val = scope.score[scope.categories[i]];
		      norm += val*val;
		    }
		    norm = Math.sqrt(norm);
		    for (i in scope.categories){
					scope.norm_score.push( Math.round( 100 * scope.score[scope.categories[i]] / norm ) );
		      scope.score[scope.categories[i]] = scope.norm_score[i];
		    }

				scope.courses = levels.getCourses(scope.score);


				setTimeout(function(){
					scope.setResultsCharts();
				}, 500);


				/*ga('send', 'event', 'estagio_quiz', "finalizou");

				var data_array = {
					nome: 					 scope.name,
					email: 					 scope.email,
					pontuacao:       scope.score,
					nivel:           scope.level.title,
					fracos:          scope.weak_categories.toString(),
					fortes:          scope.strong_categories.toString(),
					identificador: 	 'finalizou-quiz',
					token_rdstation: 'TOKEN-RDSTATION'
				};

				scope.send_to_rd_station(data_array);*/
			}



			scope.setResultsCharts = function(){
				console.log('setting charts');

				var chartColors = [
					'rgb(255, 99, 132)',
					'rgb(255, 159, 64)',
					'rgb(255, 205, 86)',
					'rgb(75, 192, 192)',
					'rgb(54, 162, 235)',
					'rgb(153, 102, 255)',
					'rgb(201, 203, 207)'
				];

		    var color = Chart.helpers.color;

		    var default_config = {
		        type: 'radar',
		        data: {
		            labels: scope.categories,
		            datasets: [{
		                //label: "Suas inteligências de Gardner",
		                backgroundColor: color(chartColors[0]).alpha(0.2).rgbString(),
		                borderColor: chartColors[0],
		                pointBackgroundColor: chartColors[0],
		                data: scope.norm_score
		            }]
		        },
		        options: {
								legend: {
									display: false
								},
		            scale: {
		              ticks: {
		                beginAtZero: true
		              }
		            }
		        }
		    };

		    scope.main_chart = new Chart($("#main-chart"), default_config);

				for (var i in scope.courses){

					scope.courses[i].bar = new ProgressBar.Circle('#chart-'+ scope.courses[i].id, {
					  strokeWidth: 6,
					  easing: 'easeInOut',
					  duration: 1400,
					  color: '#de9e1f',
					  trailColor: '#eee',
					  trailWidth: 2,
					  svgStyle: {width: '100%', height: '60%'},
					  text: {
					    style: {
					      'font-size': '30px',
					      position: 'absolute',
					      right: '36%',
					      top: '39%',
					      padding: 0,
					      margin: 0,
					      transform: null
					    },
					    autoStyleContainer: false
					  },
					  from: {color: '#FFEA82'},
					  to: {color: '#de9e1f'},
					  step: (state, bar) => {
					    bar.setText(Math.round(bar.value() * 100) + '%');
					    bar.path.setAttribute('stroke', state.color);
					  }
					});

					scope.courses[i].bar.animate(1 - scope.courses[i].error/100);

				}

			};

			scope.scrollTo = function(p) {
				$("html, body").animate(
					{scrollTop: p },
					{duration: 400, easing: 'easeInOutCubic'}
				);
			}

			scope.checkAnswer = function() {

				if($('input.answers:checked').length < scope.group_length){
					// set error message
					qst = $('.options').closest('.questions');
					for (var i = 0; i < qst.length; i++){
						if ($(qst[i]).find('input.answers:checked').length == 0){
							// maybe change class
							scope.scrollTo($(document).scrollTop() + qst[i].getBoundingClientRect().top);
							break;
						}
					}
					return;
				}

				scope.scrollTo(0);

				for(var i = 0; i < scope.group_length; i++){
					var ans = $('input[name=answer_' + scope.questions[i].id + ']:checked').val();
					scope.score[scope.questions[i].category] += Number(ans);
				}

				//ga('send', 'event', 'answers_by_level', "level " + scope.id, answerStatus);
				//ga('send', 'event', 'answers_by_question', "question " + questions.getQuestion(scope.id).id, answerStatus);

        scope.nextQuestions();
			};

			scope.nextQuestions = function() {
				scope.completed_percentage = (scope.id + 1) * (100 / scope.questions_length);

				scope.getQuestions();
			};

			scope.socialConversion = function(network_name) {
				scope.shared = true;

				var data_array = {
					nome: 					 scope.name,
					email: 					 scope.email,
					network_name:    network_name,
					identificador: 	 'compartilhou-quiz',
					token_rdstation: 'TOKEN-RDSTATION'
				};

				scope.send_to_rd_station(data_array);
			};

			scope.shareFacebook = function(){
				scope.socialConversion("Facebook");

				FB.ui({
				  method: 'feed',
				  link: 'http://',
					name: scope.social_text,
					description: "",
					picture: "http://" + scope.level.image

				}, function(response){
				});
			};

			scope.shareTwitter = function(){
				scope.socialConversion("Twitter");

				scope.social_text += " http:// via @";

				var url = "https://twitter.com/intent/tweet?text=" + scope.social_text;

				window.open(url, "_blank");
			};

			scope.shareLinkedIn = function(){
				scope.socialConversion("LinkedIn");

				var url = "https://www.linkedin.com/shareArticle?mini=true";

				url += "&url=http://";
				url += "&title=Quiz";
				url += "&summary=" + scope.social_text;

				window.open(url, "_blank");
			};


			scope.reset();
		}
	}
});
