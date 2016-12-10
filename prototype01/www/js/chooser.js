var MainMenu = function() {
  clickStart('container-exp','container-chooser');
  logTime('menu','start');
  theme_song.play();
};

function Start(){

  //------------->> move this inside module that handles game displaying
  // should store this on the first session and update available when exiting a game
  var Games = [
      {
        name: "Counting",
        available: true,
        callFunction: proto02,
        icon: "img/Menu/ladybug.png"
      },

      {
        name: "Addition",
        available: true,
        callFunction: proto03,
        icon: "img/Menu/lilly.png"
      },

      {
        name: "Multiply",
        available: true,
        callFunction: Multiplication,
        icon : "img/Menu/Egg.png"
      },

      {
        name: "Alphabet",
        available: true,
        callFunction: bubbleLetters,
        icon: "img/Menu/flower.png"
      },

      {
        name: "Memory",
        available: true,
        callFunction: memory,
        icon: "img/Menu/Memory.png"
      },

      {
        name: "Spelling",
        available: true,
        callFunction: Hangman,
        icon : "img/Menu/rock.png"
      },

      {
        name: "Word Find",
        available: false,
        callFunction: WordFind
      },

      {
        name: "Drawing",
        available: true,
        callFunction: Sketch,
        icon: "img/Menu/Drawing.png"
      },

      {
        name: "Shapes",
        available: false,
        callFunction: Shapes,
        icon: "img/Menu/shapes_icon.png"
      },

      {
        name: "World Map",
        available: false,
        callFunction: WorldMap
      },

      {
        name: "Snake",
        available: false,
        callFunction: Snake
      },

      {
        name: "Dashboard",
        available: false,
        callFunction: Dashboard
      }
  ];

  var finished = 0;
  for(var i = Games.length-1; i >= 0; i--){
    if(Games[i].available && Games[i].icon){
      finished++;
    }
  }

  // hide experiment and show chooser
  var containerMainMenu = document.getElementById("icons");
  var totalWidth = 0;
  var allAvailable = [];
  var biggest = 0;
  var counter = 0;

  for(var i = Games.length-1; i >= 0; i--){

    // only add it if they have made enough progress to get to it!
    if(Games[i].available) {

      if(Games[i].icon) {

        var game = new Image();
        game.src = Games[i].icon
        game.id = i;
        game.style.display = "none"

        game.onload = function(){
          counter++;

          console.log( "loaded", this);
          console.log("finished:", finished,counter )

          totalWidth = totalWidth + this.naturalWidth
          if(biggest < this.naturalHeight ){
            biggest = this.naturalHeight
          }

          if(finished == counter){
             arrangeSize()
          }

        }

      } else {

        var game = document.createElement("div");
        game.id = i;
        game.innerHTML = "<p>"+Games[i].name+"</p>";

      }

      game.className = "MenuButton";


      var gameClick = function(){
        theme_song.stop();
        logTime('menu','stop');
        document.getElementById("container-exp").style.height = window.innerHeight
        session.setRenderer();
        //logTime(Games[this.id].name); // better than doing in each file?
        clickStart('container-chooser','container-exp');
        currentview = new Games[this.id].callFunction();

      }

      game.onclick = gameClick;
      containerMainMenu.insertBefore(game, containerMainMenu.children[0]);
      allAvailable.push(game)

    }
  }

  var dashboard = document.createElement("dashBoard")
  var dashClickCount = 0
  dashBoard.onclick = function(){
    dashClickCount++;
    if(dashClickCount > 5){

      dashClickCount = 0;
      //logTime('menu','stop');
      //document.getElementById("container-exp").style.height = window.innerHeight
      clickStart('container-chooser','container-exp');
      currentview = new Games[Games.length-1].callFunction();
    }
  }

  function arrangeSize(){

    var scale = window.innerWidth/(totalWidth+200);
    biggest = biggest*scale;
    var left = (window.innerWidth - (totalWidth*scale))/2;

    for(var i = allAvailable.length-1; i >= 0; i--){

      allAvailable[i].style.display = "block"
      allAvailable[i].style.width = allAvailable[i].naturalWidth * scale
      allAvailable[i].style.left = left
      allAvailable[i].style.top = ((window.innerHeight - biggest)/2) + (biggest - (allAvailable[i].naturalHeight*scale))/2
      left = left + (allAvailable[i].naturalHeight * scale)
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
