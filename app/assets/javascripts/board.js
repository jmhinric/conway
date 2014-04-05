var game;
var intervalId;
var speed;
var boardRows = 20;
var boardCols = 20;
game = new Game(boardRows, boardCols);

game.setInitialState();
render();

$(".start").on("click", function() {
  intervalId = setInterval(takeStep, 1000/parseInt(speed));
  $(".start").attr("disabled", true);
});

$(".pause").on("click", stopTimer);

$(".clear").on("click", function() {
  stopTimer();
  game = new Game(boardRows, boardCols);
  game.setInitialState();
  render();
});

$(".one-step").on("click", function() {
  game.step(1);
  render();
});

$(".step-back").on("click", function() {
  game.stepBack(1);
  render();
});

$("input.speed").on("keyup", function(e) {
  console.log($("input.speed").val());
  speed = $("input.speed").val();
});

function takeStep() {
  game.step(1);
  render();
}

function stopTimer() {
  clearInterval(intervalId);
  $(".start").attr("disabled", false);
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
        $(this).toggleClass("alive");
        var cellRow = this.id.split("-")[0];
        var cellCol = this.id.split("-")[1];
        game.state[cellRow][cellCol] = game.state[cellRow][cellCol] === 1 ? 0 : 1;
      });
  cell.appendTo(".board-wrapper");
}

