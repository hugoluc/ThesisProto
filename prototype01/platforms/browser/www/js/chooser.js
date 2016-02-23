
var Chooser = function() {

    // hide experiment and show chooser
    clickStart('container-exp','container-chooser');



    // determine the size of the choosers based on the number of games unlocked
      // -(determine if we show all games and make them not clickable or show only the unlcoked ones)
    var availableGames = 3
    for(var i=0; i<availableGames; i++ ){

      size = window.innerWidth/availableGames
      console.log(size)

      $('#choose-game0'+(i+1))
        .css("top", i*(100/availableGames)+"%")
        .css("height", size)
        .css("background", getRandomColor())
      }


    //put click funcintion in to chooser button
    $('#choose-game01').on('click', function() {
      console.log("-------------")
       clickStart('container-chooser','container-exp');
       currentview = new proto01(true);
		})

		$('#choose-game02').on('click', function() {
      clickStart('container-chooser','container-exp');
		})

		$('#choose-game03').on('click', function() {
      clickStart('container-chooser','container-exp');
		})


};
