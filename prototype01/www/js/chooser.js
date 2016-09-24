var MainMenu = function() {
  clickStart('container-exp','container-chooser');
};

function Start(){

  //------------->> move this inside module that handles game displaying
  // should store this on the first session and update available when exiting a game
  var Games = [
      {
        name: "Counting",
        available: true,
        callFunction: proto02,
        icon: "img/Menu/ladybug_icon.png"
      },

      {
        name: "Addition",
        available: true,
        callFunction: proto03,
        icon: "img/Menu/ants_icon.png"
      },

      {
        name: "Multiply",
        available: true,
        callFunction: Multiplication
      },

      {
        name: "Alphabet",
        available: true,
        callFunction: bubbleLetters,
        icon: "img/Menu/dragonfly_icon.png"
      },

      {
        name: "Memory",
        available: true,
        callFunction: memory
      },

      {
        name: "Spelling",
        available: true,
        callFunction: Hangman
      },

      {
        name: "Word Find",
        available: true,
        callFunction: WordFind
      },

      {
        name: "Drawing",
        available: true,
        callFunction: Sketch
      },

      {
        name: "Shapes",
        available: true,
        callFunction: Shapes,
        icon: "img/Menu/shapes_icon.png"
      },

      {
        name: "World Map",
        available: false,
        callFunction: WorldMap
      }
  ];

  // hide experiment and show chooser
  var containerMainMenu = document.getElementById("container-chooser")

  for(var i =0; i<Games.length; i++){
    // only add it if they have made enough progress to get to it!
    if(Games[i].available) {
      game = document.createElement("div");
      game.id = i;
      game.className = "MenuButton";
      if(Games[i].icon) {
        game.innerHTML = "<img src='"+Games[i].icon+"' width=170 height=170 />"
      } else {
        game.innerHTML = "<p>"+Games[i].name+"</p>";
      }

      var gameClick = function(){

        document.getElementById("container-exp").style.height = window.innerHeight
        session.setRenderer();

        clickStart('container-chooser','container-exp');
        currentview = new Games[this.id].callFunction();

      }

      game.onclick = gameClick;
      containerMainMenu.appendChild(game);
    }
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
