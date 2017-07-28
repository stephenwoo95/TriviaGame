var intervalId;

var stopwatch = {

	  time: 30,

	  reset: function() {
	    stopwatch.time = 30;
	  },
	  count: function() {
	  	console.log("count accessed");
	  	if(stopwatch.time > 0){
	  		stopwatch.time--;
	  	}
	    $("#timer").html("Time Remaining: " + stopwatch.time + " seconds");
	  },
	  start: function() {
	  	stopwatch.time = 30;
	  	console.log("timer var accessed and started");
	 	intervalId = setInterval(stopwatch.count, 1000);
	 	console.log(count);
	  },
	  stop: function() {
	  	clearInterval(intervalId);
	  }
};

var game = {
	questionNumber: 0,
	correct: 0,
	startGame: function() {
		$("#timer").html("Pick a difficulty level");
		var easy = $("<button>");
		easy.attr('id',"easy");
		easy.addClass("diff");
		easy.html("Easy");
		var med = $("<button>");
		med.attr('id',"medium");
		med.addClass("diff");
		med.html("Medium");
		var hard = $("<button>");
		hard.attr('id',"hard");
		hard.addClass("diff");
		hard.html("Hard");
		$("#question").html(easy);
		$("#question").append(med);
		$("#question").append(hard);
		console.log("printed buttons");
		$("#A").empty();
		$("#B").empty();
		$("#C").empty();
		$("#D").empty();
	},
	displayQuestions: function(response) {
		console.log(game.questionNumber);
		if(game.questionNumber == response.results.length-1){
			$("#timer").empty();
			$("#A").empty();
			$("#B").empty();
			$("#C").empty();
			$("#D").empty();
			$("#question").html("You scored " + game.correct + " out of 15.");
			console.log("game ended");
			return;
		}
		console.log("adding question");
		console.log(response.results[game.questionNumber].question);
		$("#question").html(response.results[game.questionNumber].question);
		var options = ['A','B','C','D'];
		var correctIndex = Math.floor(Math.random()*4);
		console.log("the correct answer is at: " + options[correctIndex]);
		var correctAnswer = response.results[game.questionNumber].correct_answer;
		console.log(correctAnswer);
		var id = "#" + options[correctIndex];
		console.log(id);
		$(id).html(options[correctIndex] + ". " + correctAnswer);
		options.splice(correctIndex,1);
		for(var j=0;j<options.length;j++){
			var id = "#" + options[j];
			console.log(id);
			console.log(response.results[game.questionNumber].incorrect_answers[j]);
			$(id).html(options[j] + ". " + response.results[game.questionNumber].incorrect_answers[j]);
		}
		stopwatch.start();
		console.log("stopwatch started");
		while(stopwatch.time >= 0){
			console.log(stopwatch.time);
			$(".answer").on("click",function(){
				stopwatch.stop();
				$("#A").empty();
				$("#B").empty();
				$("#C").empty();
				$("#D").empty();
				if(this.textContent === correctAnswer){
					$("#question").html("Correct!");
					game.correct++;
					console.log(game.correct);
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
		console.log("trying to reset");
		game.questionNumber = 0;
		game.correct = 0;
		var resetBtn = $("<button>").text("Play Again?").addClass("reset");
		$("#B").html(resetBtn);
	}
};

$(document).ready(function(){

	game.startGame();
	$(".diff").on("click",function() {
		var diff = this.getAttribute("id");
		console.log(diff);

		$.ajax({
		url: "https://opentdb.com/api.php?amount=15&category=18&difficulty=" + diff + "&type=multiple",
		method: "GET"
		}).done(function(response){
			console.log("getting questions");
			console.log(response);
			game.displayQuestions(response);
			console.log("game ended in doc");
			game.reset();
		});
	});

	$(".reset").on("click",function() {
		game.startGame();
	});

})

