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
    });

    it("sets an empty temp board based on the rows and columns", function() {
      expect(game.tempState[0][0]).toBe(0);
      expect(game.tempState[9][9]).toBe(0);
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

  describe("setState", function() {
    xit("sets an initial state for the game", function() {
      var cells = [[0,2], [1,2], [2,2], [2,1], [1,0]];
      game.setState.call(cells);
      expect(game.state[0][2]).toBe(1);
      expect(game.state[2][1]).toBe(1);
    });
  });

});