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
	  	if(stopwatch.time === 0){
	  		stopwatch.stop();
			$("#A").empty();
			$("#B").empty();
			$("#C").empty();
			$("#D").empty();
			$("#timer").html("Out of Time!");
			$("#A").html("The Correct Answer was: " + game.correctAnswer);
			game.questionAnswered = true;
			game.questionNumber++;
			setTimeout(function(){game.displayQuestion(game.questions[game.questionNumber]);},1500);
		}else{
	    	$("#timer").html("Time Remaining: " + stopwatch.time + " seconds");
	    }
	  },
	  start: function() {
	  	console.log("timer var accessed and started");
	 	intervalId = setInterval(function(){
	 		stopwatch.count();}, 1000);
	 	$("#timer").html("Time Remaining: " + stopwatch.time + " seconds");
	  },
	  stop: function() {
	  	clearInterval(intervalId);
	  }
};

var game = {
	questionNumber: 0,
	correct: 0,
	correctAnswer: "",
	questionAnswered: false,
	questions: [],
	startGame: function() {
		$("#timer").html("Pick a difficulty level");
		var easy = $("<button>");
		easy.attr('id',"easy");
		easy.attr('onclick',"game.getJSON(this);");
		easy.addClass("diff");
		easy.html("Easy");
		var med = $("<button>");
		med.attr('id',"medium");
		med.attr('onclick',"game.getJSON(this);");
		med.addClass("diff");
		med.html("Medium");
		var hard = $("<button>");
		hard.attr('id',"hard");
		hard.attr('onclick',"game.getJSON(this);");
		hard.addClass("diff");
		hard.html("Hard");
		// $(".diff").attr('onclick',"game.getJSON();");
		$("#question").html(easy);
		$("#question").append(med);
		$("#question").append(hard);
		console.log("printed buttons");
		$("#A").empty();
		$("#B").empty();
		$("#C").empty();
		$("#D").empty();
		$(".answer").attr('onclick','game.choooseAnswer(this);');
	},
	getJSON: function(btn) {
		var diff = btn.getAttribute("id");
		console.log(diff);

		$.ajax({
		url: "https://opentdb.com/api.php?amount=15&category=18&difficulty=" + diff + "&type=multiple",
		method: "GET"
		}).done(function(response){
			console.log("getting questions");
			game.questions=response.results;
			game.displayQuestion(game.questions[game.questionNumber]);
		});
	},
	displayQuestion: function(data) {
		if(game.questionNumber === game.questions.length){
			console.log("game ended");
			game.reset();
			return;
		}
		stopwatch.reset();
		game.questionAnswered = false;
		console.log("adding question");
		$("#question").html(data.question);
		var options = ['A','B','C','D'];
		var correctIndex = Math.floor(Math.random()*4);
		console.log("the correct answer is at: " + options[correctIndex]);
		game.correctAnswer = data.correct_answer;
		console.log(game.correctAnswer);
		var slot = $("<p>").html(game.correctAnswer);
		var id = "#" + options[correctIndex];
		$(id).html(slot);
		options.splice(correctIndex,1);
		for(var j=0;j<options.length;j++){
			var slot = $("<p>").html(data.incorrect_answers[j]);
			var id = "#" + options[j];
			$(id).html(slot);
		}
		stopwatch.start();
		console.log("stopwatch started");
	},
	choooseAnswer: function(answer){
		stopwatch.stop();
		game.questionAnswered = true;
		var choice = $(answer).children().text();
		$("#A").empty();
		$("#B").empty();
		$("#C").empty();
		$("#D").empty();
		if(choice === game.correctAnswer){
			$("#timer").html("Correct!");
			game.correct++;
			console.log(game.correct);
		}else{
			$("#timer").html("Nope!");
			$("#question").append("<br><br>The correct answer was: " + game.correctAnswer);
		}
		game.questionNumber++;
		setTimeout(function(){game.displayQuestion(game.questions[game.questionNumber]);},1500);
	},
	reset: function(){
		console.log("trying to reset");
		$("#A").empty();
		$("#B").empty();
		$("#C").empty();
		$("#D").empty();
		$("#timer").html("You correctly answered " + game.correct + " out of " + game.questions.length + " questions.");
		game.correct = 0;
		game.questionNumber = 0;
		var resetBtn = $("<button>").text("Play Again?").attr('onclick',"game.startGame();");
		$("#question").html(resetBtn);
	}
};

$(document).ready(function(){

	game.startGame();

	// $(".answer").on("click",function(){
	// 	stopwatch.stop();
	// 	game.questionAnswered = true;
	// 	var choice = $(this).children().text();
	// 	$("#A").empty();
	// 	$("#B").empty();
	// 	$("#C").empty();
	// 	$("#D").empty();
	// 	if(choice === game.correctAnswer){
	// 		$("#timer").html("Correct!");
	// 		game.correct++;
	// 		console.log(game.correct);
	// 	}else{
	// 		$("#timer").html("Nope!");
	// 		$("#question").append("<br><br>The correct answer was: " + game.correctAnswer);
	// 	}
	// 	game.questionNumber++;
	// 	setTimeout(function(){game.displayQuestion(game.questions[game.questionNumber]);},1500);
	// });
});


