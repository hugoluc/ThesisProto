
var Chooser = function() {


    // hide experiment and show chooser
    clickStart('container-exp','container-chooser');
    document.getElementById("header-exp").style.display = "block"


    for(var i=0; i<availableGames; i++ ){

      size = window.innerWidth/2

      $('#choose-game0'+(i+1))
        .css("top", i*(100/availableGames)+"%")
        //.css("height", window.innerWidth/4)
        //.css("background", getRandomColor())
    };



    var game1 = document.getElementById("choose-game01")

    var ratio = game1.clientWidth/game1.clientHeight
    game1.height = window.innerHeight/2.5
    game1.width = game1.height * ratio
    
    game1.onclick =  function(){
      console.log("")
      clickStart('container-chooser','container-exp');
      currentview = new proto02();

    };


    var game2 = document.getElementById("choose-game02")
    
    var ratio = game2.clientWidth/game2.clientHeight
    game2.height = window.innerHeight/2.5
    game2.width = game1.width
    game2.display = "block"

    game2.onclick =  function(){
      console.log("")
      clickStart('container-chooser','container-exp');
      currentview = new proto03();

     };

    game2.style.marginTop = game2.height * 0.1
    game1.style.marginTop = (window.innerHeight - (game2.height*2.1))/2

    var container = document.getElementById("container-chooser")
    container.style.marginLeft = (window.innerWidth - game1.width)/2


    var game3 = document.getElementById("choose-game03")

    game3.onclick =  function(){
      console.log("starting spellingGame");
      clickStart('container-chooser','container-exp');
      currentview = new spellingGame();
    }

    var game4 = document.getElementById("choose-game04")

    game4.onclick =  function(){
      console.log("starting wordGuess");
      init_screen();
      clickStart('container-chooser','container-exp');
      currentview = new Hangman();
    }

    // var game5 = document.getElementById("choose-game05")

    // game5.onclick =  function(){
    //   console.log("test");
    //   clickStart('container-chooser','container-exp');
    //   currentview = new proto04();
    //  }


  session.stats.end()

};
