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
    $(".message").text("");

    intervalId = setInterval(takeStepBack, 1000/parseInt(speed));
  }
});

$(".step-back").on("click", function() {
  if (game.stepCount > 0) {
    clearInterval(intervalId);
    $(".message").text("");
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
  if (game.stillLife()) {
    $(".message").text("Still Life");
  } else { game.step(1); }
  oscillationCheck();
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
  $(".temp-states").empty();
  $(".message").text("");
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
    $("<br>").appendTo(".board-wrapper");
  }
}

function createCell(row, col, state, cellClass, appendToEl) {
  var status = state[row][col] === 1 ? "alive" : "";
  var cell = $("<div>");
  cell.addClass(cellClass)
      .addClass(status)
      .attr("id", row + "-" + col);
  if (cellClass === "cell") {
    cell.on("click", function() {
      game.userChanged = true;
      game.gameOver = false;
      $(this).toggleClass("alive");
      var cellRow = this.id.split("-")[0];
      var cellCol = this.id.split("-")[1];
      state[cellRow][cellCol] = state[cellRow][cellCol] === 1 ? 0 : 1;
    });
  }
  cell.appendTo(appendToEl);
}

function changeBoardSize() {
  boardRows = $("input[name = num-rows]").val();
  boardCols = $("input[name = num-cols]").val();
  $("input").val('').blur();

  var width = parseInt(boardCols) * 22 + 20;
  $(".board-wrapper").css({"width": width});
}

function renderSavedState() {
  var newDiv = $("<div>");
  newDiv.attr("id", state)
        .addClass("temp-state");
  var state = game.userStates.length - 1;

  for(var row = 0; row < game.rows; row++) {
    for(var col = 0; col < game.cols; col++) {
      createCell(row, col, game.userStates[state], "mini-cell", newDiv);
    }
  $("<br>").appendTo(newDiv);
  }
  loadButtonCss(newDiv, state);
  saveButtonCss(newDiv, state);
}

function loadButtonCss(newDiv, id) {
  $("<button>").addClass("load")
               .text("Load")
               .attr("id", id + "-" + game.rows + "-" + game.cols)
               .on("click", function () {
                  resetDom();
                  var id = this.id.split("-");
                  resetGame();
                  render();
               })
               .appendTo(newDiv);
}

function saveButtonCss(newDiv, id) {
  var div = $("<div>").addClass("save")
                      .appendTo(newDiv);
  $("<input type='text' placeholder='Name it'>")
    .addClass("save-text")
    .appendTo(div);
  $("<button>").addClass("save-button")
               .text("Save")
               .attr("id", id)
               .appendTo(div);
  $("<br>").appendTo(newDiv);
  $(".temp-states").prepend(newDiv);
}

function resetDom() {
  game.history = [];
  game.stepCount = 0;
  game.gameStarted = false;
  game.gameOver = false;
  $(".message").text("");
}

function resetGame() {
  game.rows = id[1];
  game.cols = id[2];
  game.setGameState(game.userStates[id[0]], id[1], id[2]);
}

function oscillationCheck() {
  if (game.oscillates()) {
    $(".message").text("Oscillation!!!");
  }
}
