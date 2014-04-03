function Game(numRows, numCols) {
  if (numRows === undefined ||
      numCols === undefined) {
    throw "Please specify the number of rows and columns.";
  }

  this.rows = numRows;
  this.cols = numCols;
  this.state = [];

  // Initialize the state as all 0s.
  for(var i = 0; i < this.rows; i++) {
    this.state.push(new Array(this.cols));
    for(var j = 0; j < this.cols; j++) {
      this.state[i][j] = 0;
    }
  }

}


Game.prototype.changeState = function(row, col) {
  this.state[row][col] = this.state[row][col] === 0 ? 1 : 0;
};