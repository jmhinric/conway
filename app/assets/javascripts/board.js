// $(document).ready(function() {
  var game;
  var intervalId;
  game = new Game(20,20);

  setState();
  render();

  $(".start").on("click", function() {
    intervalId = setInterval(takeStep, 100);
  });

  $(".pause").on("click", function() {
    clearInterval(intervalId);
  });

  $(".clear").on("click", function() {
    game.stateClear();
    game.stepCount = 0;
    setState();
    render();
  });

  function takeStep() {
    game.step(1);
    render();
  }

  function render() {
    $(".board-wrapper").empty();
    $(".steps").text("Steps: " + game.stepCount);
    for(var row = 0; row < game.rows; row++) {
      for(var col = 0; col < game.cols; col++) {
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
      $("<br>").appendTo(".board-wrapper");
    }
  }

  function setState() {
    game.state[0][2] = 1;
    game.state[1][2] = 1;
    game.state[2][2] = 1;
    game.state[2][1] = 1;
    game.state[1][0] = 1;
  }

// });