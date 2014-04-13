Conway.Game = function(numRows, numCols) {
  if (numRows === undefined ||
      numCols === undefined) {
    throw "Please specify the number of rows and columns.";
  }

  this.rows = numRows;
  this.cols = numCols;
  this.stepCount = 0;
  this.message = '';

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
};

Conway.Game.prototype.init = function() {
  for(var i = 0; i < this.rows; i++) {
    this.state.push(new Array(this.cols));
    this.tempState.push(new Array(this.cols));
    for(var j = 0; j < this.cols; j++) {
      this.state[i][j] = 0;
      this.tempState[i][j] = 0;
    }
  }
};

Conway.Game.prototype.neighborsAlive = function(row, col) {
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

Conway.Game.prototype.liveOrDie = function(row, col) {
  var neighbors = this.neighborsAlive(row, col);
  var shouldLive;
  shouldLive = neighbors === 3 ? true
    : (neighbors === 2 && this.state[row][col] === 1) ? true : false;
  return shouldLive;
};

Conway.Game.prototype.updateState = function() {
  for(var i = 0; i < this.rows; i++) {
    for(var j = 0; j < this.cols; j++) {
      this.state[i][j] = this.tempState[i][j];
    }
  }
};

Conway.Game.prototype.tempClear = function() {
  // Reset the arrays to all 0s.
  for(var i = 0; i < this.rows; i++) {
    for(var j = 0; j < this.cols; j++) {
      this.tempState[i][j] = 0;
    }
  }
};

Conway.Game.prototype.step = function(steps) {
  for(var k = 0; k < steps; k++) {
    this.oscillates();
    this.stillLife();

    if(this.stepCount === 0 || this.userChanged || !this.gameOver) {
      this.stepCount++;
      this.tempClear();
      for(var i = 0; i < this.rows; i++) {
        for(var j = 0; j < this.cols; j++) {
          this.tempState[i][j] = this.liveOrDie(i,j) ? 1 : 0;
        }
      }
      this.updateState();
      this.updateHistory();
      this.userChanged = false;
    }
  }
};

Conway.Game.prototype.stepBack = function(steps) {
  for(var i = 0; i < this.rows; i++) {
    for(var j = 0; j < this.cols; j++) {
      this.state[i][j] = this.history[this.stepCount-steps][i][j];
    }
  }
  this.stepCount -= steps;
  this.history.pop();
  this.stringHistory.pop();
};

Conway.Game.prototype.setInitialState = function() {
  this.state[0][2] = 1;
  this.state[1][2] = 1;
  this.state[2][2] = 1;
  this.state[2][1] = 1;
  this.state[1][0] = 1;
};

// Reset the state to all 0s.
Conway.Game.prototype.clearState = function() {
  for(var i = 0; i < this.rows; i++) {
    for(var j = 0; j < this.cols; j++) {
      this.state[i][j] = 0;
    }
  }
};

Conway.Game.prototype.updateHistory = function() {
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

Conway.Game.prototype.saveUserChanges = function() {
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
};

Conway.Game.prototype.setGameState = function(array, rows, cols) {
  for(var i = 0; i < rows; i++) {
    for(var j = 0; j < cols; j++) {
      this.state[i][j] = array[i][j];
    }
  }
};

Conway.Game.prototype.stillLife = function() {
  var lastIndex = this.stringHistory.length - 1;
  if (this.stringHistory[lastIndex] === this.stringHistory[lastIndex - 1] && !this.userChanged) {
    this.gameOver = true;
    this.message = "Still Life";
  }
};

Conway.Game.prototype.oscillates = function () {
  this.oscPeriod = 0;
  this.message = '';
  var lastIndex = this.stringHistory.length - 1;

  for(var i = 0; i < lastIndex - 1; i++) {
    if(this.stringHistory[lastIndex] === this.stringHistory[i]) {
      this.oscPeriod = lastIndex - i;
    }
  }

  if(this.oscPeriod > 0) {
    this.message = 'Period ' + this.oscPeriod + ' Oscillator';
  } else { this.message = ''; }
};

Conway.Game.prototype.setInitialGameState = function(array) {
  this.clearState();
  var row = ''; var col = '';
  for(var i = 0; i < array.length; i++) {
    row = array[i][0];
    col = array[i][1];
    this.state[row][col] = 1;
  }
};

