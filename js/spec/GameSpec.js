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

  });

  describe("#changeState", function() {
    it("change's a cell's status from dead to alive", function() {
      game.changeState(0,0);
      expect(game.state[0][0]).toBe(1);
    });

    it("change's a cell's status from alive to dead", function() {
      game.state[0][0] = 1;
      game.changeState(0,0);
      expect(game.state[0][0]).toBe(0);
    });
  });

  


  
});