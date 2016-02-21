
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

      $('#choose-drop').on('click', function() {
         clickStart('container-chooser','container-exp');
         currentview = new DropGame();
			})

			$('#choose-count').on('click', function() {
        clickStart('container-chooser','container-exp');
         currentview = new CountGame();
			})

			$('#choose-read').on('click', function() {
        clickStart('container-chooser','container-exp');
        currentview = new ReadGame();
			})

      $('#choose-math').on('click', function() {
        clickStart('container-chooser','container-exp');
        currentview = new MathGame();
      })

      $('#choose-words').on('click', function() {
        clickStart('container-chooser','container-exp');
        currentview = new WordGame();
      })

      $('#choose-draw').on('click', function() {
        clickStart('container-chooser','draw');
        $('#wPaint').wPaint('menuOrientation', $('#wPaint').wPaint('menuOrientation') === 'vertical' ? 'horizontal' : 'vertical');
        //currentview = new DrawGame();
      })

      $('#choose-piano').on('click', function() {
        clickStart('container-chooser','piano');
        currentview = new Piano();
      })

};
