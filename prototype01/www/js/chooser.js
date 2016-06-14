var MainMenu = function() {

  clickStart('container-exp','container-chooser');

};

function Start(){

  //------------->> move this inside module that handles game displaying
  var availableGames = [

      {
        name: "Counting",
        available: true,
        callFunction: proto02
      },


      {
        name: "Addition",
        available: true,
        callFunction: proto03
      },


      {
        name: "Multiplication",
        available: true,
        callFunction: 1
      },


      {
        name: "Fairy",
        available: true,
        callFunction: 2
      },


      {
        name: "HangMan",
        available: true,
        callFunction: Hangman
      },


      {
        name: "WordSearch",
        available: true,
        callFunction: WordTrial
      },


      {
        name: "Drawing",
        available: true,
        callFunction: Sketch
      },

      {
        name: "Shapes",
        available: true,
        callFunction: Shapes
      }
  ]

  // hide experiment and show chooser
  var containerMainMenu = document.getElementById("container-chooser")

  for(var i =0; i<availableGames.length; i++){

    game = document.createElement("div");
    game.id = i
    game.className = "MenuButton"
    game.innerHTML = availableGames[i].name



    var gameClick = function(){

      clickStart('container-chooser','container-exp');
      currentview = new availableGames[this.id].callFunction();

    }

    game.onclick = gameClick
    containerMainMenu.appendChild(game)

  }

  if(!PIXIInitialized){

      session = new CanvasSession();
      assets = new Assets();
      score = new gameScore();

      assets.addTexture('star',"sprites/star/star.png")

      session.init();
      PIXIInitialized = true;

  }

  currentview = new MainMenu();

}
