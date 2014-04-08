function Game(numRows, numCols) {
  if (numRows === undefined ||
      numCols === undefined) {
    throw "Please specify the number of rows and columns.";
  }

  this.rows = numRows;
  this.cols = numCols;
  this.stepCount = 0;
  this.gameStarted = false;
  this.userChanged = false;
  this.gameOver = false;

  this.state = [];
  this.tempState = [];
  this.history = [];
  this.stringHistory = [];
  this.userStates = [];
  this.userStringStates = [];

  this.init();
}

Game.prototype.init = function() {
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
    }
  }
};

Game.prototype.step = function(steps) {
  if(this.stepCount === 0 || this.userChanged || !this.gameOver) {
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
  }
};

Game.prototype.stepBack = function(steps) {
  for(var i = 0; i < this.rows; i++) {
    for(var j = 0; j < this.cols; j++) {
      this.state[i][j] = this.history[this.stepCount-steps][i][j];
    }
  }
  this.stepCount -= steps;
  this.history.pop();
  this.stringHistory.pop();
};

Game.prototype.setInitialState = function() {
  this.state[0][2] = 1;
  this.state[1][2] = 1;
  this.state[2][2] = 1;
  this.state[2][1] = 1;
  this.state[1][0] = 1;
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
  var tempHistory = [];
  var tempString = "";

  for(var i = 0; i < this.rows; i++) {
    var row = [];
    for(var j = 0; j < this.cols; j++) {
      row.push(this.state[i][j]);
      tempString += this.state[i][j];
    }
    tempHistory.push(row);
  }
  this.history.push(tempHistory);
  this.stringHistory.push(tempString);
};

Game.prototype.saveUserChanges = function() {
  var temp = [];
  var tempString = "";

  for(var i = 0; i < this.rows; i++) {
    var row = [];
    for(var j = 0; j < this.cols; j++) {
      row.push(this.state[i][j]);
      if (this.state[i][j] === 1) {
        tempString += i + "-" + j + "/";
      }
    }
    temp.push(row);
  }
  this.userStringStates.push(tempString);
  this.userStates.push(temp);
  this.userChanged = false;
};

Game.prototype.setGameState = function(array, rows, cols) {
  for(var i = 0; i < rows; i++) {
    for(var j = 0; j < cols; j++) {
      this.state[i][j] = array[i][j];
    }
  }
};

Game.prototype.stillLife = function() {
  var strHi = this.stringHistory;
  this.gameOver = (strHi[strHi.length - 1] === strHi[strHi.length - 2]);
  return this.gameOver;
};

Game.prototype.oscillates = function () {
  var count = 0;
  var strHist = this.stringHistory;

  for(var i = 0; i < strHist.length - 2; i++) {
    if(strHist[strHist.length-1] === strHist[i]) {count++;}
  }
  return count > 0;
};









