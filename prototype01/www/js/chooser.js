
var Chooser = function() {

    // hide experiment and show chooser
    clickStart('container-exp','container-chooser');
    var availableGames = 5;

    for(var i=0; i<availableGames; i++ ){

      size = window.innerWidth/availableGames

      $('#choose-game0'+(i+1))
        .css("top", i*(100/availableGames)+"%")
        .css("height", size)
        .css("background", getRandomColor())
      }

    var game1 = document.getElementById("choose-game01")

    game1.onclick =  function(){
      console.log("")
      clickStart('container-chooser','container-exp');
      currentview = new proto02();

    }

    var game2 = document.getElementById("choose-game02")

    game2.onclick =  function(){
      console.log("")
      clickStart('container-chooser','container-exp');
      currentview = new proto03();

     }

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
      currentview = new WordGame();
    }

    var game5 = document.getElementById("choose-game05")

    game5.onclick =  function(){
      console.log("test");
      clickStart('container-chooser','container-exp');
      currentview = new proto04();
     }


  session.stats.end()

};
