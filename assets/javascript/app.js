var intervalId;

var stopwatch = {

	  time: 30,

	  reset: function() {
	    stopwatch.time = 30;
	  },
	  start: function() {
	 	intervalId = setInterval(stopwatch.count, 1000);
	  },
	  stop: function() {
	  	clearInterval(intervalId);
	  },
	  count: function() {
	  	if(stopwatch.time > 0){
	  		stopwatch.time--;
	  	}
	    $("#timer").html("Time Remaining: " + stopwatch.time + " seconds");
	  }
};

var game = {
	questionNumber: 0,
	correct: 0,
	startGame: function() {
		$("#timer").html("Pick a difficulty level");
		var easy = $("<button>");
		easy.addClass("easy");
		easy.html("Easy");
		var med = $("<button>");
		med.addClass("medium");
		med.html("Medium");
		var hard = $("<button>");
		hard.addClass("hard");
		hard.html("Hard");
		$("#question").append(easy);
		$("#question").append(med);
		$("#question").append(hard);
	},
	displayQuestions: function(response) {
		if(game.questionNumber == response.results.length-1){
			$("#timer").empty();
			$("#A").empty();
			$("#B").empty();
			$("#C").empty();
			$("#D").empty();
			$("#question").html("You scored " + game.correct + " out of 15. <br>");
			return;
		}
		$("#question").html(response.results[game.questionNumber].question);
		var options = ['A','B','C','D'];
		var correctIndex = Math.floor(Math.random()*4);
		var correctAnswer = response.results[game.questionNumber].correct_answer
		$("#" + options[correctIndex]).html(correctAnswer);
		for(var j=0;j<options.length;j++){
			$("#" + options[j]).html(response.results[game.questionNumber].incorrect_answers[j]);
		}
		stopwatch.start();
		while(stopwatch.time !== 0){
			$(".answer").on("click",function(){
				stopwatch.stop();
				$("#A").empty();
				$("#B").empty();
				$("#C").empty();
				$("#D").empty();
				if(this.textContent === correctAnswer){
					$("#question").html("Correct!");
					game.correct++;
				}else{
					$("#question").html("Nope!");
					$("#A").html("The Correct Answer was: " + correctAnswer);
				}
				stopwatch.reset();
				game.questionNumber++;
				setTimeout(game.displayQuestions(response),4000);
			});
		}
		stopwatch.stop();
		$("#A").empty();
		$("#B").empty();
		$("#C").empty();
		$("#D").empty();
		$("#question").html("Out of Time!");
		$("#A").html("The Correct Answer was: " + correctAnswer);
		setTimeout(game.displayQuestions(response),4000);
	},
	reset: function(){

	}
};

$(document).ready(function(){

	game.startGame();
	$("button").on("click",function() {
		var diff = this.getAttribute("class");

		$.ajax({
		url: "https://opentdb.com/api.php?amount=15&category=18&difficulty=" + diff + "&type=multiple",
		method: "GET"
		}).done(function(response){
			game.displayQuestions(response);
			game.reset();
		});
	});

})

