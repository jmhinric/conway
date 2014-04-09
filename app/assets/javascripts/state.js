// **********************************************
// OSCILLATORS
// **********************************************


// Period 3 
Conway.State.CATERER = ["Caterer, Period 3", [[1,3], [2,1], [2,5], [2,6], [2,7], [2,8], [3,1], [3,5], [4,1], [5,4], [6,2], [6,3]]];

// Period 4 'Glider'
Conway.State.GLIDER = ["Glider, Period 4", [[0,2], [1,2], [2,2], [2,1], [1,0]]];

// Period 8 'Figure Eight'
Conway.State.FIGUREEIGHT = ["Figure Eight, Period 8", [[3,3], [3,4], [4,3], [4,4], [4,6], [5,7], [6,4], [7,5], [7,7], [7,8], [8,7], [8,8]]];

// Period 11 '38P11.1'
Conway.State.THIRTYEIGHTP = ["38P11.1, Period 11", [[1,3], [1,4], [1,6], [1,7], [2,4], [2,6], [2,8], [3,4], [3,9], [4,1], [4,2], [4,4], [4,10], [5,1], [5,2], [5,4], [5,11], [6,4], [6,6], [6,12], [7,4], [7,6], [7,7], [7,11], [7,12], [8,5], [9,6], [9,7], [9,8], [9,9], [9,10], [9,11], [9,12], [10,12], [11,8], [11,9], [12,8], [12,9]]];

Conway.State.PENTADECATHLON = ["Pentadecathlon, Period 15", [[8,5], [8,6], [7,7], [9,7], [8,8], [8,9], [8,10], [8,11], [7,12], [9,12], [8,13], [8,14]]];


Conway.State.states = [
  Conway.State.CATERER,
  Conway.State.GLIDER,
  Conway.State.FIGUREEIGHT,
  Conway.State.THIRTYEIGHTP,
  Conway.State.PENTADECATHLON
  ];