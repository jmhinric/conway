var game;
var intervalId;
var speed;
var boardRows = 20;
var boardCols = 20;

newGame();

$(".start").on("click", function() {
  startGame();
  $(".start").attr("disabled", true);
  $(".reverse").attr("disabled", false);
  $(".step-back").attr("disabled", false);

  intervalId = setInterval(takeStep, 1000/parseInt(speed));
});

$(".step-forward").on("click", function() {
  startGame();
  $(".reverse").attr("disabled", false);
  $(".step-back").attr("disabled", false);
  takeStep();
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
    takeStepBack();
  }
});

$(".pause").on("click", stopTimer);

$(".clear").on("click", function() {
  stopTimer();
  newGame();
});

$(".board-size").submit(function(e) {
  e.preventDefault();
  changeBoardSize();
  newGame();
});

$("input.speed").on("keyup", function() {
  speed = $("input.speed").val();
});

function startGame() {
  if (!game.gameStarted) { game.updateHistory(); }
  game.gameStarted = true;
  clearInterval(intervalId);
}

function takeStep() {
  if (game.gameOver) {
    clearInterval(intervalId);
    $(".start").attr("disabled", false);
  }
  if (game.userChanged) {
    game.saveUserChanges();
    renderSavedState();
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
      createCell(row, col, game.state, "cell", ".board-wrapper");
    }
    $("<br>").appendTo(".board");
  }
}

function createCell(row, col, state, cellClass, appendToEl) {
  var status = state[row][col] === 1 ? "alive" : "";
  var cell = $("<div>");
  cell.addClass(cellClass)
      .addClass(status)
      .attr("id", row + "-" + col)
      .on("click", function() {
        game.userChanged = true;
        $(this).toggleClass("alive");
        var cellRow = this.id.split("-")[0];
        var cellCol = this.id.split("-")[1];
        state[cellRow][cellCol] = state[cellRow][cellCol] === 1 ? 0 : 1;
      });
  cell.appendTo(appendToEl);
}

function changeBoardSize() {
  boardRows = $("input[name = num-rows]").val();
  boardCols = $("input[name = num-cols]").val();
  $("input").val('').blur();

  var width = parseInt(boardRows) * 22 + 20;
  $(".board").css({"width": width});
}

function renderSavedState() {
  var newDiv = $("<div>")
  newDiv.attr("id", state)
        .addClass("temp-state");
  var state = game.userStates.length - 1;

  for(var row = 0; row < game.rows; row++) {
    for(var col = 0; col < game.cols; col++) {
      createCell(row, col, game.userStates[state], "mini-cell", newDiv);
    }
    $("<br>").appendTo(newDiv);
  }
  newDiv.appendTo(".temp-states");
  $("<br>").appendTo(".temp-states");
  $("<br>").appendTo(".temp-states");
}

