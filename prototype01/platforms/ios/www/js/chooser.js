
var Chooser = function() {

    clickStart('container-exp','container-chooser');

    language = 'swahili'; // default

    $("#language").change(function() {

      var head= document.getElementsByTagName('head')[0];
      var script= document.createElement('script');
      script.type= 'text/javascript';
      script.src= "../static/js/language/"+$(this).val()+".js";
      head.appendChild(script);
      language = $(this).val();
      console.log(language);
    });

    var availableGames = 3

    for(var i=0; i<availableGames; i++ ){


      size = window.innerWidth/availableGames
      console.log(size)

      $('#choose-game0'+(i+1))
        .css("top", i*(100/availableGames)+"%")
        .css("height", size)
        .css("background", getRandomColor())
    

    }

    $('#choose-game01').on('click', function() {
      console.log("-------------")
       clickStart('container-chooser','container-exp');
       currentview = new DropGame();
		})

		$('#choose-game02').on('click', function() {
      clickStart('container-chooser','container-exp');
		})

		$('#choose-game03').on('click', function() {
      clickStart('container-chooser','container-exp');
		})


};
