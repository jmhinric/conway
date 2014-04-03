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

});