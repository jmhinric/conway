function Game(numRows, numCols) {
  if (numRows === undefined ||
      numCols === undefined) {
    throw "Please specify the number of rows and columns.";
  }

  this.rows = numRows;
  this.cols = numCols;
  this.state = [];
  this.tempState = [];

  this.init();
}

Game.prototype.init = function() {
  // Initialize the state as all 0s.
  for(var i = 0; i < this.rows; i++) {
    this.state.push(new Array(this.cols));
    this.tempState.push(new Array(this.cols));
    for(var j = 0; j < this.cols; j++) {
      this.state[i][j] = 0;
      this.tempState[i][j] = 0;
    }
  }
};

Game.prototype.neighborsAlive = function(row, col) {
  var aliveCount = 0;
  for(var cRow = row-1; cRow <= row+1; cRow++) {
    for(var cCol = col-1; cCol <= col+1; cCol++) {
      // Make sure cells are on the board
      if (cRow > -1 && cCol > -1 && cRow < this.rows && cCol < this.cols && this.state[cRow][cCol] === 1) {
        aliveCount++;
      }
    }
  }
  // Correct for a potential over-count
  return this.state[row][col] === 1 ? aliveCount-1: aliveCount;
};

