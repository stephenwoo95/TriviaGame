////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////-----TIMER-----///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

var intervalId;

var stopwatch = {

	  time: 30,

	  reset: function() {
	    stopwatch.time = 30;
	  },
	  count: function() {
	  	if(stopwatch.time > 0){
	  		stopwatch.time--;
	  	}
	  	if(stopwatch.time === 0){
	  		game.timeUp();
		}else{
	    	$("#timer").html("Time Remaining: " + stopwatch.time + " seconds");
	    }
	  },
	  start: function() {
	 	intervalId = setInterval(function(){
	 		stopwatch.count();}, 1000);
	 	$("#timer").html("Time Remaining: " + stopwatch.time + " seconds");
	  },
	  stop: function() {
	  	clearInterval(intervalId);
	  }
};

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////------GAME------//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

var game = {
	questionNumber: 0,
	correct: 0,
	correctAnswer: "",
	questions: [],
	//called to clear the answer choices
	emptyAnswers: function() {
		$("#A").empty();
		$("#B").empty();
		$("#C").empty();
		$("#D").empty();
	},
	//called to populate difficulty buttons and set button functions
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
		//set button functionalities
		$(".diff").attr('onclick',"game.getJSON(this);");
		$(".answer").attr('onclick','game.choooseAnswer(this);');
	},
	//called to grab trivia from API
	getJSON: function(btn) {
		var diff = btn.getAttribute("id");
		$.ajax({
		url: "https://opentdb.com/api.php?amount=15&category=18&difficulty=" + diff + "&type=multiple",
		method: "GET"
		}).done(function(response){
			//start off displaying first question
			game.questions=response.results;
			game.displayQuestion(game.questions[game.questionNumber]);
		});
	},
	//called to display current question and answers
	displayQuestion: function(data) {
		if(game.questionNumber === game.questions.length){
			game.reset();
			return;
		}
		stopwatch.reset();
		//display question
		$("#question").html(data.question);
		var options = ['A','B','C','D'];
		//set random placement for correct choice
		var correctIndex = Math.floor(Math.random()*4);
		game.correctAnswer = data.correct_answer;
		var slot = $("<p>").html(game.correctAnswer);
		var id = "#" + options[correctIndex];
		//add answer choices
		$(id).html(slot);
		options.splice(correctIndex,1);
		for(var j=0;j<options.length;j++){
			var slot = $("<p>").html(data.incorrect_answers[j]);
			var id = "#" + options[j];
			$(id).html(slot);
		}
		stopwatch.start();
	},
	//called when a choice is clicked
	choooseAnswer: function(answer){
		stopwatch.stop();
		var choice = $(answer).children().text();
		game.emptyAnswers();
		if(choice === game.correctAnswer){
			$("#timer").html("Correct!");
			game.correct++;
		}else{
			$("#timer").html("Nope!");
			$("#question").append("<br><br>The correct answer was: " + game.correctAnswer);
		}
		game.nextQuestion();
	},
	//called when no choice clicked in 30 seconds
	timeUp: function(){
		stopwatch.stop();
		game.emptyAnswers();
		$("#timer").html("Out of Time!");
		var reveal = $("<p>").html("The Correct Answer was: " + game.correctAnswer);
		$("#A").append(reveal);
		game.nextQuestion();
	},
	//called to move onto next question
	nextQuestion: function(){
		//increment question number
		game.questionNumber++;
		//display next question after 1.5 seconds
		setTimeout(function(){game.displayQuestion(game.questions[game.questionNumber]);},1500);
	},
	//called to end game and ask for replay
	reset: function(){
		game.emptyAnswers();
		$("#timer").html("You correctly answered " + game.correct + " out of " + game.questions.length + " questions.");
		game.correct = 0;
		game.questionNumber = 0;
		var resetBtn = $("<button>").text("Play Again?").attr('onclick',"game.startGame();");
		$("#question").html(resetBtn);
	}
};

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////------MAIN------//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

//start game when document loads
$(document).ready(function(){
	game.startGame();
});


