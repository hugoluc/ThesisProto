
//<div><button id='solve'>Solve Puzzle</button></div>
// could make a 'hint' button that shows a word (or starting letter?)

var WordFind = function() {
  document.getElementById("header-exp").style.display = "inline";
  $("#container-exp").append("<div id='puzzle'></div>");
  $("#container-exp").append("<div id='words'></div>");
  $("#container-exp").css("background-color","green");

  this.destroy = function() {
    //session.hide();
    document.getElementById("header-exp").style.display = "none";
    $("#puzzle").remove();
    $("#words").remove();
    currentview = new MainMenu(assets);
  }

  var words = ['cat','bat','fat','but','gut','the'];
  // need to know when all words are found, then start a new round with new words

  // start a word find game
  var gamePuzzle = wordfindgame.create(words, '#puzzle', '#words');
  // modify wordfindgame to say each word as it's found

  // $('#solve').click( function() {
  //   wordfindgame.solve(gamePuzzle, words);
  // });

  // create just a puzzle, without filling in the blanks and print to console
  var puzzle = wordfind.newPuzzle( words,
    {height: 5, width: 5, fillBlanks: false} );
  wordfind.print(puzzle);
}
