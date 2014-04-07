describe("Game", function() {
  var game;

  beforeEach(function() {
    game = new Game(10,10);
  });

  describe("#initialize", function() {
    it("throws an error if initial board size is not given", function(){
      expect(function(){game = new Game();}).toThrow("Please specify the number of rows and columns.");
    });

    it("sets the number of rows and columns for the board", function() {
      game = new Game(10,10);
      expect(game.rows).toBe(10);
      expect(game.cols).toBe(10);
    });

    it("sets an empty board based on the rows and columns", function() {
      expect(game.state[0][0]).toBe(0);
      expect(game.state[9][9]).toBe(0);
      expect(game.state.length).toBe(10);
    });

    it("sets an empty temp board based on the rows and columns", function() {
      expect(game.tempState[0][0]).toBe(0);
      expect(game.tempState[9][9]).toBe(0);
      expect(game.tempState.length).toBe(10);
    });

  });

  describe("#neighborsAlive", function() {

    it("returns how many neighbors of a cell are alive", function() {
      game.state[0][1] = 1;
      game.state[1][0] = 1;
      game.state[2][2] = 1;
      expect(game.neighborsAlive(1,1)).toBe(3);
    });

    it("returns how many neighbors are alive for cells on the edge of the board", function() {
      game.state[0][0] = 1;
      game.state[1][0] = 1;
      expect(game.neighborsAlive(0,1)).toBe(2);
    });

    it("returns how many neighbors are alive for corner cells", function() {
      game.state[9][8] = 1;
      expect(game.neighborsAlive(9,9)).toBe(1);
    });

    it("only counts alive neighbors and not the alive status of the tested cell itself", function() {
      game.state[8][8] = 1;
      game.state[8][9] = 1;
      game.state[9][8] = 1;
      game.state[9][9] = 1;
      expect(game.neighborsAlive(9,9)).toBe(3);
      expect(game.neighborsAlive(8,9)).toBe(3);
      expect(game.neighborsAlive(9,8)).toBe(3);
      expect(game.neighborsAlive(8,8)).toBe(3);
    });
  });

  describe("#liveOrDie", function() {
    it("returns true if a cell is alive and has two live neighbors", function() {
      game.state[0][1] = 1;
      game.state[1][0] = 1;
      game.state[1][1] = 1;
      expect(game.liveOrDie(1,1)).toBe(true);
    });

    it("returns false if a cell is dead and has two live neighbors", function() {
      game.state[0][1] = 1;
      game.state[1][0] = 1;
      expect(game.liveOrDie(1,1)).toBe(false);
    });

    it("returns true if a cell is alive and has three live neighbors", function() {
      game.state[0][1] = 1;
      game.state[1][0] = 1;
      game.state[2][2] = 1;
      game.state[1][1] = 1;
      expect(game.liveOrDie(1,1)).toBe(true);
    });

    it("returns true if a cell is dead and has three live neighbors", function() {
      game.state[0][1] = 1;
      game.state[1][0] = 1;
      game.state[2][2] = 1;
      expect(game.liveOrDie(1,1)).toBe(true);
    });

    it("returns false if a cell is alive and has less than two live neighbors", function() {
      game.state[2][2] = 1;
      game.state[1][1] = 1;
      expect(game.liveOrDie(1,1)).toBe(false);
    });

    it("returns false if a cell is dead and has less than two live neighbors", function() {
      game.state[2][2] = 1;
      expect(game.liveOrDie(1,1)).toBe(false);
    });

    it("returns false if a cell is alive and has more than three live neighbors", function() {
      game.state[4][4] = 1;
      game.state[4][6] = 1;
      game.state[5][5] = 1;
      game.state[6][4] = 1;
      game.state[6][6] = 1;
      expect(game.liveOrDie(5,5)).toBe(false);
    });

    it("returns false if a cell is dead and has more than three live neighbors", function() {
      game.state[4][4] = 1;
      game.state[4][6] = 1;
      game.state[6][4] = 1;
      game.state[6][6] = 1;
      expect(game.liveOrDie(5,5)).toBe(false);
    });
  });

  describe("#tempClear", function() {
    it("clears the tempState array so it can be used again", function() {
      game.tempState[0][0] = 1;
      game.tempState[2][2] = 1;
      game.tempState[8][3] = 1;
      game.tempClear();
      expect(game.tempState[0][0]).toBe(0);
      expect(game.tempState[2][2]).toBe(0);
      expect(game.tempState[8][8]).toBe(0);
    });
  });

  describe("#step", function() {
    it("takes one step in the game", function() {
      game.state[0][1] = 1;
      game.state[1][1] = 1;
      game.state[2][1] = 1;

      game.step(1);
      expect(game.state[0][0]).toBe(0);
      expect(game.state[0][1]).toBe(0);
      expect(game.state[0][2]).toBe(0);
      expect(game.state[1][0]).toBe(1);
      expect(game.state[1][1]).toBe(1);
      expect(game.state[1][2]).toBe(1);
      expect(game.state[2][0]).toBe(0);
      expect(game.state[2][1]).toBe(0);
      expect(game.state[2][2]).toBe(0);
    });

    it("can be called twice and still work correctly", function() {
      game.state[0][1] = 1;
      game.state[1][1] = 1;
      game.state[2][1] = 1;

      game.step(2);
      expect(game.state[0][0]).toBe(0);
      expect(game.state[0][1]).toBe(1);
      expect(game.state[0][2]).toBe(0);
      expect(game.state[1][0]).toBe(0);
      expect(game.state[1][1]).toBe(1);
      expect(game.state[1][2]).toBe(0);
      expect(game.state[2][0]).toBe(0);
      expect(game.state[2][1]).toBe(1);
      expect(game.state[2][2]).toBe(0);
    });

    it("works with a known 'glider' state", function() {
      game.state[1][0] = 1;
      game.state[2][1] = 1;
      game.state[2][2] = 1;
      game.state[0][2] = 1;
      game.state[1][2] = 1;

      game.step(4);
      
      expect(game.state[1][0]).toBe(0);
      expect(game.state[0][2]).toBe(0);
      expect(game.state[1][2]).toBe(0);
      expect(game.state[2][2]).toBe(0);
      expect(game.state[2][1]).toBe(1);
      expect(game.state[3][2]).toBe(1);
      expect(game.state[3][3]).toBe(1);
      expect(game.state[1][3]).toBe(1);
      expect(game.state[2][3]).toBe(1);
    });
  });

  describe("#stateClear", function() {
    it("clears the State array", function() {
      game.state[0][0] = 1;
      game.state[2][2] = 1;
      game.state[8][3] = 1;
      game.stateClear();
      expect(game.state[0][0]).toBe(0);
      expect(game.state[2][2]).toBe(0);
      expect(game.state[8][8]).toBe(0);
    });
  });

  describe("#updateHistory", function() {
    it("records the initial state of the board to the game's history", function() {
      game.setInitialState();
      game.updateHistory();
      game.step(1);
      expect(game.history.length).toBe(2);
    });

    it("records two steps of the board to the game's history", function() {
      game.setInitialState();
      game.updateHistory();
      game.step(2);
      expect(game.history[0][0][2]).toBe(1);
      expect(game.history[1][0][2]).toBe(0);
    });

    it("records three steps of the board to the game's history", function() {
      game.setInitialState();
      game.updateHistory();
      game.step(3);
      expect(game.history[0][0][2]).toBe(1);
      expect(game.history[1][0][2]).toBe(0);
      expect(game.history[2][0][2]).toBe(1);

      expect(game.history[0][1][2]).toBe(1);
      expect(game.history[1][1][2]).toBe(1);
      expect(game.history[2][1][2]).toBe(0);
    });

    it("records three steps of the board to the game's stringHistory", function() {
      game = new Game(3,3);
      game.setInitialState();
      game.updateHistory();
      game.step(3);
      expect(game.stringHistory[0]).toBe("001101011");
      expect(game.stringHistory.length).toBe(4);
    });
  });

  describe("#stepBack", function() {
    it("takes one step back in the game's history", function() {
      game.setInitialState();
      game.updateHistory();
      game.step(2);
      game.stepBack(1);
      expect(game.state[0][1]).toBe(1);
      expect(game.state[1][2]).toBe(1);
      expect(game.state[1][3]).toBe(1);
      expect(game.state[2][1]).toBe(1);
      expect(game.state[2][2]).toBe(1);
    });

    it("takes three steps back in the game's history", function() {
      game.setInitialState();
      game.updateHistory();
      game.step(3);
      game.stepBack(3);
      expect(game.state[0][2]).toBe(1);
      expect(game.state[1][2]).toBe(1);
      expect(game.state[2][2]).toBe(1);
      expect(game.state[2][1]).toBe(1);
      expect(game.state[1][0]).toBe(1);
    });

    it("updates the game's step counter", function() {
      game.setInitialState();
      game.step(4);
      expect(game.stepCount).toBe(4);
      game.stepBack(3);
      expect(game.stepCount).toBe(1);
    });

    it("erases the game's history as it steps back", function() {
      game.setInitialState();
      game.step(2);
      expect(game.history.length).toBe(2);
      game.stepBack(1);
      expect(game.history.length).toBe(1);
    });

    it("erases the game's string history as it steps back", function() {
      game.setInitialState();
      game.step(2);
      expect(game.stringHistory.length).toBe(2);
      game.stepBack(1);
      expect(game.stringHistory.length).toBe(1);
    });
  });

  describe("saveUserChanges", function() {
    it("saves states of the game the user creates", function() {
      game.setInitialState();
      game.updateHistory();
      game.step(2);
      game.state[2][4] = 1;
      game.state[2][5] = 1;
      game.state[3][5] = 1;
      game.userChanged = true;
      game.step(2);
      expect(game.userStates[0][2][4]).toBe(1);
      expect(game.userStates[0][2][5]).toBe(1);
      expect(game.userStates[0][3][5]).toBe(1);
    });

    it("saves states of the game the user creates after having taken steps", function() {
      game.setInitialState();
      game.updateHistory();
      game.step(2);
      game.state[2][4] = 1;
      game.state[2][5] = 1;
      game.state[3][5] = 1;
      game.userChanged = true;
      game.step(2);
      game.userChanged = true;
      game.step(1);
      expect(game.userStates.length).toBe(2);
    });
  });

  // These tests maybe belong under "#step" ???
  describe("stillLife", function() {
    it("tests to ensure the game does not consist only of 'still life objects'", function() {
      game.state[0][0] = 1;
      game.state[0][1] = 1;
      game.state[1][0] = 1;
      game.updateHistory();
      game.step(3);
      console.log(game.history);
      console.log("Steps: " + game.stepCount);
      console.log("History length: " + game.history.length);
      expect(game.history.length).toBe(3);
      expect(game.stepCount).toBe(2);
    });

    it("allows the game to step if the user has changed the board from being a still life object", function() {
      game.state[0][0] = 1;
      game.state[0][1] = 1;
      game.state[1][0] = 1;
      game.step(3);
      game.state[1][2] = 1;
      game.userChanged = true;
      game.step(1);
      expect(game.stepCount).toBe(3);
    });
  });
});


















