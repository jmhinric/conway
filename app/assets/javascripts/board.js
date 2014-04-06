var game;
var intervalId;
var speed;
var boardRows = 20;
var boardCols = 20;

newGame();

$(".start").on("click", function() {
  if (!game.gameStarted) { game.updateHistory(); }
  game.gameStarted = true;

  clearInterval(intervalId);
  $(".start").attr("disabled", true);
  $(".reverse").attr("disabled", false);

  intervalId = setInterval(takeStep, 1000/parseInt(speed));
});

$(".step-forward").on("click", function() {
  if (!game.gameStarted) { game.updateHistory(); }
  game.gameStarted = true;

  clearInterval(intervalId);
  $(".reverse").attr("disabled", false);
  $(".step-back").attr("disabled", false);
  
  game.step(1);
  render();
});

$(".reverse").on("click", function() {
  // Can't click reverse if stepCount is 0
  if (game.stepCount > 0) {
    
    clearInterval(intervalId);
    $(".reverse").attr("disabled", true);
    $(".start").attr("disabled", false);
    $(".step-back").attr("disabled", false);

    intervalId = setInterval(takeStepBack, 1000/parseInt(speed));
  }
});

$(".step-back").on("click", function() {
  if (game.stepCount > 0) {
    clearInterval(intervalId);
    
    game.stepBack(1);
    render();
  }
});

$(".pause").on("click", stopTimer);

$(".clear").on("click", function() {
  stopTimer();
  newGame();
});

$(".board-size").submit(function(e) {
  e.preventDefault();
  boardRows = $("input[name = num-rows]").val();
  boardCols = $("input[name = num-cols]").val();
  $("input").val('').blur();

  var width = parseInt(boardRows) * 22 + 20;
  $(".board").css({"width": width});

  newGame();
});

$("input.speed").on("keyup", function() {
  speed = $("input.speed").val();
});

function takeStep() {
  if (game.stillLife()) {
    clearInterval(intervalId);
    $(".start").attr("disabled", false);
  }
  game.step(1);
  render();
}

function takeStepBack() {
  if (game.stepCount === 0) {
    clearInterval(intervalId);
    $(".reverse").attr("disabled", true);
    $(".step-back").attr("disabled", true);
  }
  game.stepBack(1);
  render();
}

function stopTimer() {
  clearInterval(intervalId);
  $(".start").attr("disabled", false);
  $(".reverse").attr("disabled", false);
  $(".step-forward").attr("disabled", false);
  $(".step-back").attr("disabled", false);
}

function newGame() {
  game = new Game(boardRows, boardCols);
  game.setInitialState();
  render();
}

function render() {
  $(".board-wrapper").empty();
  $(".steps").text("Steps: " + game.stepCount);
  for(var row = 0; row < game.rows; row++) {
    for(var col = 0; col < game.cols; col++) {
      createCell(row, col);
    }
    $("<br>").appendTo(".board-wrapper");
  }
}

function createCell(row, col) {
  var status = game.state[row][col] === 1 ? "alive" : "";
  var cell = $("<div>");
  cell.addClass("cell")
      .addClass(status)
      .attr("id", row + "-" + col)
      .on("click", function() {
        game.userChanged = true;
        $(this).toggleClass("alive");
        var cellRow = this.id.split("-")[0];
        var cellCol = this.id.split("-")[1];
        game.state[cellRow][cellCol] = game.state[cellRow][cellCol] === 1 ? 0 : 1;
      });
  cell.appendTo(".board-wrapper");
}

