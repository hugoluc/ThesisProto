
//<div><button id='solve'>Solve Puzzle</button></div>

var WordFind = function() {
  $("#container-exp").append("<div id='puzzle'></div>")
  $("#container-exp").append("<div id='words'></div>")

  this.destroy = function() {
    session.hide();
    currentview = new MainMenu(assets);
  }

  var words = ['cat','bat','fat','but','gut','the'];
  // start a word find game
  var gamePuzzle = wordfindgame.create(words, '#puzzle', '#words');

  // $('#solve').click( function() {
  //   wordfindgame.solve(gamePuzzle, words);
  // });

  // create just a puzzle, without filling in the blanks and print to console
  var puzzle = wordfind.newPuzzle( words,
    {height: 5, width: 5, fillBlanks: false} );
  wordfind.print(puzzle);
}
