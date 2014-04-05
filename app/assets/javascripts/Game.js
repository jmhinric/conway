function Game(numRows, numCols) {
  if (numRows === undefined ||
      numCols === undefined) {
    throw "Please specify the number of rows and columns.";
  }

  this.rows = numRows;
  this.cols = numCols;
  this.stepCount = 0;
  this.state = [];
  this.tempState = [];
  this.history = [];
  // this.tempHistory = [];

  this.init();
}

Game.prototype.init = function() {
  for(var i = 0; i < this.rows; i++) {
    this.state.push(new Array(this.cols));
    this.tempState.push(new Array(this.cols));
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

Game.prototype.liveOrDie = function(row, col) {
  var neighbors = this.neighborsAlive(row, col);
  var shouldLive;
  shouldLive = neighbors === 3 ? true
    : (neighbors === 2 && this.state[row][col] === 1) ? true : false;
  return shouldLive;
};

Game.prototype.updateState = function() {
  for(var i = 0; i < this.rows; i++) {
    for(var j = 0; j < this.cols; j++) {
      this.state[i][j] = this.tempState[i][j];
    }
  }
};

Game.prototype.tempClear = function() {
  // Reset the arrays to all 0s.
  for(var i = 0; i < this.rows; i++) {
    for(var j = 0; j < this.cols; j++) {
      this.tempState[i][j] = 0;
      // this.tempHistory[i][j] = 0;
    }
  }
};

Game.prototype.step = function(steps) {
  for(var k = 0; k < steps; k++) {
    this.stepCount++;
    this.tempClear();
    for(var i = 0; i < this.rows; i++) {
      for(var j = 0; j < this.cols; j++) {
        this.tempState[i][j] = this.liveOrDie(i,j) ? 1 : 0;
      }
    }
    this.updateState();
    this.updateHistory();
  }
};

Game.prototype.setInitialState = function() {
  this.state[0][2] = 1;
  this.state[1][2] = 1;
  this.state[2][2] = 1;
  this.state[2][1] = 1;
  this.state[1][0] = 1;
  this.updateHistory();
};

// Reset the state to all 0s.
Game.prototype.stateClear = function() {
  for(var i = 0; i < this.rows; i++) {
    for(var j = 0; j < this.cols; j++) {
      this.state[i][j] = 0;
    }
  }
};

Game.prototype.updateHistory = function() {
  // this.tempClear();
  var tempHistory = [];
  // var cell;

  for(var i = 0; i < this.rows; i++) {
    var row = [];
    for(var j = 0; j < this.cols; j++) {
      row.push(this.state[i][j]);
    }
    tempHistory.push(row);
  }
  this.history.push(tempHistory);
};

Game.prototype.stepBack = function(steps) {
  for(var i = 0; i < this.rows; i++) {
    for(var j = 0; j < this.cols; j++) {
      this.state[i][j] = this.history[this.stepCount-steps][i][j];
    }
  }
  this.stepCount--;
  this.history.pop();
};











