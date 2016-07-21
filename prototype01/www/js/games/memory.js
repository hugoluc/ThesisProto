// simple memory game in which the player tries to find the matching tile:
// might be upper- and lower-case (A-a), numeral to number word (1-one),
// picture-word (all of the stimuli should also be heard aloud), shape-name,
// and even simple math problems (1+1=2)
// TBD: do we mix up stimulus types, or randomly choose a game type?
// could use as a mini-game, and give it in the middle of other Games
// with the appropriate stimuli

function memory(){
  var game_loaded = true;
  queuesToUpdate['alphabetstim'] = true;
  var stimQ = stimQueues['alphabetstim'];
  var stimSize = 90;
  var stage;
  var renderer;
  var tile;
  var first_tile;
  var second_tile;
  var gameGrid;
  var logo;
  var pause_timer;
  var defaultImage;
  var pairsFinished = 8;
  var progressBarContainer;
  var progressBarTimer;
  var timer;
  var timer_txt;
  var nCount = 60;
  var colordeck = new Array(1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8);
  var ncol = 4;
  var nrow = 4;

  function init(){
    // create an new instance of a pixi stage and make it Interactive (mandatory)
  	//stage = new PIXI.Stage(0xffffff, true);
  	//renderer = PIXI.autoDetectRenderer(800, 500);
  	//document.body.appendChild(renderer.view);
  	initGame();
  	drawTimerBar();
  	requestAnimationFrame( update );
  }

  function initGame() {
  	//Game background
  	background = new PIXI.Graphics();
    background.beginFill(0xcccccc);
    background.drawRect(90, 50, ncol*(stimSize+2), nrow*(stimSize+2));
    stage.addChild(background);

  	//Game Grid container for all Tiles.
  	gameGrid = new PIXI.Container();
  	stage.addChild(gameGrid);

  	for (var x=1; x<=ncol; x++) {
  		for (var y=1; y<=nrow; y++) {
  			var random_card = Math.floor(Math.random()*colordeck.length);
      	//defaultImage = PIXI.Sprite.fromImage(assetFolder+"color_default.png");
        graphics = new PIXI.Graphics();
        graphics.beginFill(0xe74c3c); // Red
        defaultImage = graphics.drawRoundedRect(0, 0, 85, 85, 10); // drawRoundedRect(x, y, width, height, radius)
        graphics.endFill();
  			tile = new PIXI.Container();
  			tile.col = colordeck[random_card];
  			colordeck.splice(random_card,1);
  			tile.addChild(defaultImage);
  			tile.position.x = 97 + (x-1)*stimSize;
  			tile.position.y = 57 + (y-1)*stimSize;
  			gameGrid.addChild(tile);
  			tile.interactive = true;
  			tile.buttonMode = true;
  			tile.click = tile_clicked;
  		}
  	}
  }


  function tile_clicked(){
  	var clicked = this;
  	//clicked.scale.x = 0.9;
  	//clicked.scale.y = 0.9;

  	if (first_tile == null) {
  		first_tile = clicked;

  		switch( clicked.col ) {

  			case 1: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"banana.png") ); break;
  			case 2: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"cherry.png") );break;
  			case 3: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"grape.png") );break;
  			case 4: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"lemon.png") );break;
  			case 5: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"melon.png") );break;
  			case 6: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"orange.png") );break;
  			case 7: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"strawberry.png") );break;
  			case 8: first_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"watermelon.png") );break;
  		}

  	} else if (second_tile == null && first_tile != clicked) {
  		second_tile = clicked;

  		switch( clicked.col ) {
  			case 1: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"banana.png") ); break;
  			case 2: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"cherry.png") );break;
  			case 3: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"grape.png") );break;
  			case 4: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"lemon.png") );break;
  			case 5: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"melon.png") );break;
  			case 6: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"orange.png") );break;
  			case 7: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"strawberry.png") );break;
  			case 8: second_tile.addChild( PIXI.Sprite.fromImage(assetFolder+"watermelon.png") );break;
  		}

  		//Check if we have a pair or not.
  		if (first_tile.col == second_tile.col) {


  			console.log("PAIR FOUND")

  			if(pairsFinished != 1) {
  				pairsFinished--;
  				setTimeout(remove_tiles, 1000);
  				console.log("TO PAIR: " + pairsFinished);

  			} else {

  				console.log("YOU WON!");
  				timer.stop();
  				stage.removeChild(progressBarTimer);
  				timer_txt.text = "Well Done!";
  				stage.removeChild(gameGrid);
  				//showWinnerSpriteSheet();

  			}

  		} else {

  			console.log("NO PAIR FOUND")
  			setTimeout(reset_tiles, 1000);
  		}
  	}

  }

  function drawTimerBar(){

  	progressBarTimer = new PIXI.Graphics();
  	progressBarTimer.beginFill(0xaaaaff);
  	progressBarTimer.drawRect(0, 0, 250, 20);
  	progressBarTimer.position.y = 450;
  	progressBarTimer.position.x = 50;
  	stage.addChild(progressBarTimer);
  	timer_txt = new PIXI.Text(nCount, {font:"40px Arial", fill:"#FFFFFF"});
  	timer_txt.position.x = 50;
  	timer_txt.position.y = progressBarTimer.position.y + 20;
  	stage.addChild(timer_txt);
  	timer = new Timer(1000, 60); // 1 second * 60 times
    timer.addEventListener(TimerEvent.TIMER, onTick)
    timer.addEventListener(TimerEvent.TIMER_COMPLETE, onTimerComplete)
    timer.start();

  }

  function onTick(event){
  	nCount--;
  	timer_txt.text = nCount;
  	progressBarTimer.scale.x = 1 - event.target.currentCount / 60;
  }

  function onTimerComplete(event){
  	timer_txt.text = "Time's Up!";
  }

  function reset_tiles() {
    graphics = new PIXI.Graphics();
    graphics.beginFill(0xe74c3c); // Red
    defaultImage = graphics.drawRoundedRect(0, 0, 85, 85, 10); // drawRoundedRect(x, y, width, height, radius)
    graphics.endFill();
  	first_tile.addChild( defaultImage );
  	second_tile.addChild( defaultImage );
  	first_tile = null;
  	second_tile = null;
  }

  function remove_tiles() {
  	gameGrid.removeChild(first_tile);
  	gameGrid.removeChild(second_tile);
  	first_tile = null;
  	second_tile = null;
  }

  function showWinnerSpriteSheet() {
  	//To be done.
  }


  //-------------------------------------------
  // Global functions and variables
  //-------------------------------------------

      // create the root of the scene graph and main classes
      var stage = new PIXI.Container();
      var round = new Round();
      score.stage = stage;

      this.destroy = function(){
          finishGame = true;
          session.hide()
      };

      //---------------------------------------loading assets

      if(bubblegameloaded) {

          for (var i = 0; i < letters.length; i++) {
            assets.addSound(letters[i].text,letters[i].audio + '.mp3');
          };
          assets.addSound("wrong",'wrong.mp3');
          assets.addSound("correct1",correctSounds[0][0].audio + '.mp3');
          assets.load(onAssetsLoaded);
      } else {
          onAssetsLoaded();
      };

      function onAssetsLoaded(){
        //round.init(Trial,stage, stimQ);
        init();
        setTimeout(function(){
            console.log("starting the game!");
            session.show();
            update();
        });
      };

      //---------------------------------------LOOP
      var statsBol = false;
      if(statsBol){
          session.stats.domElement.style.display = "block";
      };

      var finishGame = false;
      var previousTime = Date.now();
      var MS_PER_UPDATE = 16.66667;
      var lag = 0;

      function update() {

          if(finishGame){
              console.log("ending memory game");
              session.stats.domElement.style.display = "none";
              round.destroy();
              assets.destroy();
              finishGame = false;
              currentview = new MainMenu(); // assets?
              //bubblegameloaded = false; // or does leaving it on prevent re-loading assets?
              return;
          }

          if(statsBol) session.stats.begin();

          //update position based on expected frame rate
          var current = Date.now();
          var elapsed = current - previousTime;
          previousTime = current;
          lag = lag + elapsed;

          // while (lag >= MS_PER_UPDATE){
          //   round.play(lag/MS_PER_UPDATE);
          //   lag = lag - MS_PER_UPDATE;
          // }

          // render the stage
          session.render(stage);
          requestAnimationFrame(update);
          if(statsBol) session.stats.end();

      }
}
