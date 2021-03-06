Conway.Board.intervalId = {};
Conway.Board.speed = {};

// Set default board size
Conway.Board.defaultRows = 20;
Conway.Board.defaultCols = 20;

// *******************************************

Conway.newGame = function(rows, cols) {
  var glider = [[0,2], [1,2], [2,2], [2,1], [1,0]];
  this.game = new Conway.Game(rows, cols);
  $(".temp-states").empty();
  this.game.setInitialGameState(Conway.State.GLIDER[1]);
  Conway.Board.render();
};

Conway.startGame = function() {
  if (!Conway.game.gameStarted) { Conway.game.updateHistory(); }
  this.game.gameStarted = true;
  clearInterval(Conway.Board.intervalId);
};

Conway.loadTemplates = function() {
  var title;
  var array;
  Conway.State.states.forEach(function(val, index, arr) {
    title = val[0];
    $("<p>").text(title)
            .on("click", function() {
              Conway.game.history = [];
              Conway.game.stringHistory = [];
              Conway.game.stepCount = 0;
              Conway.game.gameStarted = false;
              Conway.game.gameOver = false;
              Conway.game.userChanged = false;
              Conway.game.message = "";
              Conway.game.oscPeriod = '';
              clearInterval(Conway.Board.intervalId);
              array = val[1];
              Conway.game.setInitialGameState(val[1]);
              Conway.Board.render();
            })
            .appendTo(".known-states h2");
  });
};

Conway.Board.takeStep = function() {
  if (Conway.game.userChanged) {
    Conway.game.saveUserChanges();
    Conway.Board.renderSavedState();
  }

  if (Conway.game.gameOver) {
    clearInterval(Conway.Board.intervalId);
    $(".start").attr("disabled", false);
  } else { Conway.game.step(1); }
  
  Conway.Board.render();
};

Conway.Board.takeStepBack = function() {
  if (Conway.game.stepCount === 0) {
    clearInterval(Conway.Board.intervalId);
    $(".reverse").attr("disabled", true);
    $(".step-back").attr("disabled", true);
  }
  Conway.game.stepBack(1);
  Conway.Board.render();
};


Conway.Board.render = function() {
  $(".board-wrapper").empty();
  $(".steps").text("Steps: " + Conway.game.stepCount);
  $(".message").text(Conway.game.message);

  for(var row = 0; row < Conway.game.rows; row++) {
    for(var col = 0; col < Conway.game.cols; col++) {
      Conway.Board.createCell(row, col, Conway.game.state, "cell", ".board-wrapper");
    }
    $("<br>").appendTo(".board-wrapper");
  }
};

Conway.Board.createCell = function(row, col, state, cellClass, appendToEl) {
  var status = state[row][col] === 1 ? "alive" : "";
  var cell = $("<div>");
  cell.addClass(cellClass)
      .addClass(status)
      .attr("id", row + "-" + col);
  Conway.Board.cellListener(state, cell, cellClass);
  cell.appendTo(appendToEl);
};

Conway.Board.cellListener = function(state, cell, cellClass) {
  if (cellClass != "mini-cell") {
    cell.on("click", function() {
      Conway.game.userChanged = true;
      Conway.game.gameOver = false;
      Conway.game.message = "";
      Conway.game.oscPeriod = "";
      $(this).toggleClass("alive");
      var cellRow = this.id.split("-")[0];
      var cellCol = this.id.split("-")[1];
      state[cellRow][cellCol] = state[cellRow][cellCol] === 1 ? 0 : 1;
    });
  }
};

Conway.Board.renderSavedState = function() {
  var newDiv = $("<div>");
  var state = Conway.game.userStates.length - 1;
  var width = parseInt(Conway.Board.defaultCols, 0) * 19 + 20;
  newDiv.attr("id", state)
        .addClass("temp-state")
        .css({"width": width});

  for(var row = 0; row < Conway.game.rows; row++) {
    for(var col = 0; col < Conway.game.cols; col++) {
      Conway.Board.createCell(row, col, Conway.game.userStates[state], "mini-cell", newDiv);
    }
  $("<br>").appendTo(newDiv);
  }
  Conway.Board.loadButtonCss(newDiv, state);
  Conway.Board.saveButtonCss(newDiv, state);
};

Conway.Board.loadButtonCss = function(newDiv, id) {
  $("<button>").addClass("load")
               .text("Load")
               .attr("id", id + "-" + Conway.game.rows + "-" + Conway.game.cols)
               .on("click", function () {
                  var id = this.id.split("-");
                  Conway.Game.resetGame(id);
                  Conway.Board.render();
               })
               .appendTo(newDiv);
};

Conway.Game.resetGame = function(id) {
  Conway.game.clearState();
  Conway.game.history = [];
  Conway.game.stringHistory = [];
  Conway.game.stepCount = 0;
  Conway.game.gameStarted = false;
  Conway.game.gameOver = false;
  Conway.game.userChanged = false;
  Conway.game.message = "";
  Conway.game.oscPeriod = '';
  Conway.game.rows = id[1];
  Conway.game.cols = id[2];
  Conway.game.setGameState(Conway.game.userStates[id[0]], id[1], id[2]);
};

Conway.Board.saveButtonCss = function(newDiv, id) {
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
};

Conway.Board.stopTimer = function() {
  clearInterval(Conway.Board.intervalId);
  $(".start").attr("disabled", false);
  $(".reverse").attr("disabled", false);
  $(".step-forward").attr("disabled", false);
  $(".step-back").attr("disabled", false);
};