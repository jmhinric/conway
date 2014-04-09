$(function() {
  // start a new game of life
  Conway.newGame(Conway.Board.defaultRows, Conway.Board.defaultCols);
  Conway.loadTemplates();

  // *******************************************
  // REGISTER EVENT LISTENERS FOR BUTTONS
  // *******************************************

  // start button event listener
  //   disables start button, enable reverse and step-back
  $(".start").on("click", function() {
    Conway.startGame();
    $(".start").attr("disabled", true);
    $(".reverse").attr("disabled", false);
    $(".step-back").attr("disabled", false);

    Conway.Board.intervalId = setInterval(Conway.Board.takeStep, 1000/parseInt(Conway.Board.speed, 0));
  });

  // step-forward button event listener
  //   disables reverse and step-back buttons
  $(".step-forward").on("click", function() {
    Conway.startGame();
    $(".reverse").attr("disabled", false);
    $(".step-back").attr("disabled", false);
    Conway.Board.takeStep();
  });

  $(".reverse").on("click", function() {
    // Can't click reverse if stepCount is 0
    if (Conway.game.stepCount > 0) {
      clearInterval(Conway.Board.intervalId);
      $(".reverse").attr("disabled", true);
      $(".start").attr("disabled", false);
      $(".step-back").attr("disabled", false);
      Conway.game.message = '';
      Conway.game.gameOver = false;

      Conway.Board.intervalId = setInterval(Conway.Board.takeStepBack, 1000/parseInt(Conway.Board.speed, 0));
    }
  });

  $(".step-back").on("click", function() {
    if (Conway.game.stepCount > 0) {
      clearInterval(Conway.Board.intervalId);
      Conway.game.message = '';
      Conway.game.gameOver = false;
      Conway.Board.takeStepBack();
    }
  });

  $(".pause").on("click", Conway.Board.stopTimer);

  $(".clear").on("click", function() {
    Conway.Board.stopTimer();
    Conway.newGame(Conway.Board.defaultRows, Conway.Board.defaultCols);
  });

  $(".board-size").submit(function(e) {
    var width;
    
    e.preventDefault();

    Conway.Board.defaultRows = $("input[name = num-rows]").val();
    Conway.Board.defaultCols = $("input[name = num-cols]").val();
    $("input").val('').blur();

    width = parseInt(Conway.Board.defaultCols, 0) * 22 + 20;
    $(".board-wrapper").css({"width": width});

    Conway.newGame(Conway.Board.defaultRows, Conway.Board.defaultCols);
  });

  $("input.speed").on("keyup", function() {
    Conway.Board.speed = $("input.speed").val();
  });
});