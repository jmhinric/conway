function Game(numRows, numCols) {
  if (numRows === undefined ||
      numCols === undefined) {
    throw "Please specify the number of rows and columns.";
  }

  this.rows = numRows;
  this.cols = numCols;
  this.stepCount = 0;
  this.oscPeriod = '';
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
  this.oscPeriod = 0;
  var strHist = this.stringHistory;

  for(var i = 0; i < strHist.length - 2; i++) {
    if(strHist[strHist.length-1] === strHist[i]) {this.oscPeriod = strHist.length - i - 1;}
  }
  return this.oscPeriod > 0;
};

Game.prototype.setInitialGameState = function(array) {
  array.forEach(function(val) {
    var row = val[0];
    console.log(row);
    var col = val[1];
    console.log(col);
    this.state[row][col] = 1;
  });
};

// PERIOD 11 OSCILLATOR:
// var osc11 = ["1-3", "1-4", "1-6", "1-7",
//    "2-4", "2-6", "2-8",
//    "3-4", "3-9",
//    "4-1", "4-2", "4-4", "4-10",
//    "5-1", "5-2", "5-4", "5-11",
//    "6-4", "6-6", "6-12",
//    "7-4", "7-6", "7-7", "7-11", "7-12",
//    "8-5",
//    "9-6", "9-7", "9-8", "9-9", "9-10", "9-11", "9-12",
//    "10-12",
//    "11-8", "11-9",
//    "12-8", "12-9"];






