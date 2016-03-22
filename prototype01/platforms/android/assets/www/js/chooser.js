
var Chooser = function(_sos) {

    // hide experiment and show chooser
    clickStart('container-exp','container-chooser');
    var availableGames = 3
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


};
