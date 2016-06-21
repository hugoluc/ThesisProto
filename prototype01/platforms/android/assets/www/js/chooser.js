var MainMenu = function() {

  clickStart('container-exp','container-chooser');

};

function Start(){

  //------------->> move this inside module that handles game displaying
  var availableGames = [

      {
        name: "Counting",
        available: true,
        callFucntion: proto02
      },


      {
        name: "Addition",
        available: true,
        callFucntion: proto03
      },


      {
        name: "Multiplication",
        available: true,
        callFucntion: Multiplication
      },


      {
        name: "Fairy",
        available: true,
        callFucntion: 2
      },


      {
        name: "HangMan",
        available: true,
        callFucntion: HangmanTrial
      },


      {
        name: "WordSearch",
        available: true,
        callFucntion: WordTrial
      },


      {
        name: "Drawing",
        available: true,
        callFucntion: proto02
      },

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
      currentview = new availableGames[this.id].callFucntion();

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