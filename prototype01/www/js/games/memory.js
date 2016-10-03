// simple memory game in which the player tries to find the matching tile:
// might be upper- and lower-case (A-a), numeral to number word (1-one),
// picture-word (all of the stimuli should also be heard aloud), shape-name,
// and even simple math problems (1+1=2)
// TBD: do we mix up stimulus types, or randomly choose a game type?
// could use as a mini-game, and give it in the middle of other Games
// with the appropriate stimuli

function memory(){
  var self = this;
  var clock = new ClockTimer();
  var scoreIncrease = 1; // increase scoreIncrease by 1 every 5 correct trials
  var game_loaded = true;
  //queuesToUpdate['alphabetstim'] = true;
  //var stimQ = stimQueues['alphabetstim'];
  var stimSize = 90;
  var stage;
  var renderer;
  //var tile;
  var first_tile;
  var second_tile;
  self.flippedTiles = [];
  self.gameGrid;
  var pause_timer;
  var defaultImage;
  //var pairsFinished = 8;
  var progressBarContainer;
  var progressBarTimer;
  var timer;
  var timer_txt;
  var nCount = 60;
  var ncol = 4;
  var nrow = 4;
  var pairsFinished = (ncol * nrow) / 2;
  self.tiles = [];

  var Tile = function(x, y, stim) {
    var _this = this;
    this.x = x;
    this.y = y;
    this.stim = stim;
    this.container = new PIXI.Container();
    this.container.position.x = x;
    this.container.position.y = y;
    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.mousedown = this.container.touchstart = function(){ click(); }
    this.clicked = false;
    this.width = stimSize;
    this.height = stimSize;

    function click() {
      _this.click();
    }
  };

  Tile.prototype.drawFaceDown = function() {
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0xe74c3c); // red
    graphics.drawRoundedRect(0, 0, this.width-5, this.height-5, 10); // drawRoundedRect(x, y, width, height, radius)
    graphics.endFill();
    this.container.addChild(graphics)
    this.isFaceUp = false;
  }

  Tile.prototype.click = function(){ //_this,_event
    //console.log(this.stim); // a few are undefined??
    this.drawFaceUp();
    //tile_clicked(this);
  }

  Tile.prototype.drawFaceUp = function() {
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0x0033ee); // green-blue
    graphics.drawRoundedRect(0, 0, 85, 85, 10); // drawRoundedRect(x, y, width, height, radius)
    graphics.endFill();
    this.container.addChild(graphics);
    var txt = new PIXI.Text(this.stim.text, {font:"40px Arial", fill:"#FFFFFF"});
  	txt.position.x = 25;
  	txt.position.y = 20;
  	//stage.addChild(txt);
    this.container.addChild(txt)
    this.isFaceUp = true;
  }

  Tile.prototype.destroy = function(){
      //this.container.removeChild(this.circle);
      //this.circle.destroy();
      //this.circle = [];
      stage.removeChild(this.container);
      this.container.destroy(true);
      this.container = [];
      this.destroyed = true;
  };

  function Trial(_stim){
    this.stim = _stim; // although we need (ncol*nrow) / 2 stimuli -- not just one
  }

  Trial.prototype.destroy = function(){
      // for(var i = 0; i<this.bubble.length; i++){
      //     this.bubble[i].destroy()
      // }
      //
      // stage.removeChild(this.dragonfly);
      // this.dragonfly.destroy();
  };

  function init(pairs){
    // create an new instance of a pixi stage and make it Interactive (mandatory)
  	//stage = new PIXI.Stage(0xffffff, true);
  	//renderer = PIXI.autoDetectRenderer(800, 500);
  	//document.body.appendChild(renderer.view);
  	initGame(pairs);
  	drawTimerBar();
  	requestAnimationFrame( update );
  }

  function initGame(pairs) {
  	//Game background
  	background = new PIXI.Graphics();
    background.beginFill(0xcccccc);
    background.drawRect(120, 50, ncol*(stimSize+2), nrow*(stimSize+2));
    stage.addChild(background);

  	//Game Grid container for all Tiles.
  	self.gameGrid = new PIXI.Container();
  	stage.addChild(self.gameGrid);
  	for (var x=1; x<=ncol; x++) {
  		for (var y=1; y<=nrow; y++) {
  			var random_card = Math.floor(Math.random()*pairs.length);
      	//defaultImage = PIXI.Sprite.fromImage(assetsDir+"card_back.png");
  			var stim = pairs[random_card];
  			pairs.splice(random_card,1);

        var tmp = new Tile(127 + (x-1)*stimSize, 57 + (y-1)*stimSize, stim);
        self.gameGrid.addChild(tmp.container)
        self.tiles.push(tmp);
  		}
  	}

    for(var i=0; i<self.tiles.length; i++) {
      self.tiles[i].drawFaceDown();
      //console.log(self.tiles[i])
    }
  }

  function get_text_card(letter) {
    var tmp = new PIXI.Container();
    graphics = new PIXI.Graphics();
    graphics.beginFill(0x0033ee); // green-blue
    graphics.drawRoundedRect(0, 0, 85, 85, 10); // drawRoundedRect(x, y, width, height, radius)
    graphics.endFill();
    tmp.addChild(graphics);
    var txt = new PIXI.Text(letter, {font:"40px Arial", fill:"#FFFFFF"});
  	txt.position.x = 25;
  	txt.position.y = 20;
  	//stage.addChild(txt);
    tmp.addChild(txt)
    return tmp;
  }

  mouseClicked = function() {
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].isUnderMouse(mouseX, mouseY)) {
            if (flippedTiles.length < 2 && !tiles[i].isFaceUp) {
                tiles[i].drawFaceUp();
                flippedTiles.push(tiles[i]);
                if (flippedTiles.length === 2) {
                    numTries++;
                    if (flippedTiles[0].face === flippedTiles[1].face) {
                        flippedTiles[0].isMatch = true;
                        flippedTiles[1].isMatch = true;
                    }
                    delayStartFC = frameCount;
                    loop();
                }
            }
        }
    }
    var foundAllMatches = true;
    for (var i = 0; i < tiles.length; i++) {
        foundAllMatches = foundAllMatches && tiles[i].isMatch;
    }
    if (foundAllMatches) {
        fill(0, 0, 0);
        textSize(20);
        text("You found them all in " + numTries + " tries!", 20, 375);
    }
  };

  function tile_clicked(clicked){
    console.log(clicked)
    //var clicked = this;
  	clicked.scale.x = 0.97;
  	clicked.scale.y = 0.97;

  	if (first_tile == null) {
  		first_tile = clicked;

  		switch( clicked.col ) {
        // PIXI.Sprite.fromImage(assetFolder+"banana.png")
  			case 1: first_tile.addChild( get_text_card('A') ); break;
  			case 2: first_tile.addChild( get_text_card('B') );break;
  			case 3: first_tile.addChild( get_text_card('C') );break;
  			case 4: first_tile.addChild( get_text_card('D') );break;
  			case 5: first_tile.addChild( get_text_card('E') );break;
  			case 6: first_tile.addChild( get_text_card('F') );break;
  			case 7: first_tile.addChild( get_text_card('G') );break;
  			case 8: first_tile.addChild( get_text_card('H') );break;
  		}

  	} else if (second_tile == null && first_tile != clicked) {
  		second_tile = clicked;

  		switch( clicked.col ) {
  			case 1: second_tile.addChild( get_text_card('a') ); break;
  			case 2: second_tile.addChild( get_text_card('b') );break;
  			case 3: second_tile.addChild( get_text_card('c') );break;
  			case 4: second_tile.addChild( get_text_card('d') );break;
  			case 5: second_tile.addChild( get_text_card('e') );break;
  			case 6: second_tile.addChild( get_text_card('f') );break;
  			case 7: second_tile.addChild( get_text_card('g') );break;
  			case 8: second_tile.addChild( get_text_card('h') );break;
  		}

  		//Check if we have a pair or not.
  		if (first_tile.col == second_tile.col) {

  			console.log("PAIR FOUND")

  			if(pairsFinished != 1) {
          var pos = [];
          for (var i=0; i<scoreIncrease; i++) {
            pos.push({ x: 200, y: 300}); // need click/tile position
          }
          score.addScore(pos, scoreIncrease);
          correct_sound.play();
          score.setExplosion({ x: 200, y: 300},100,1000);
          clock.start(1000);
          score.displayStar();
          score.displayExplosion();

          pairsFinished--;
  				setTimeout(remove_tiles, 1000);
  				console.log("TO PAIR: " + pairsFinished);


  			} else {

  				console.log("YOU WON!");
  				timer.stop();
  				stage.removeChild(progressBarTimer);
  				timer_txt.text = "Well Done!";
  				stage.removeChild(self.gameGrid);
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

  // function get_default_tile() {
  //   var deftile = new PIXI.Graphics();
  //   deftile.beginFill(0xe74c3c); // red
  //   deftile.drawRoundedRect(0, 0, stimSize-5, stimSize-5, 10); // drawRoundedRect(x, y, width, height, radius)
  //   deftile.endFill();
  //   return deftile;
  // }

  function reset_tiles() {
  	//first_tile.addChild( get_default_tile() );
  	//second_tile.addChild( get_default_tile() );
    first_tile.drawFaceDown();
  	second_tile.drawFaceDown();
    first_tile.scale.x = 1;
  	first_tile.scale.y = 1;
    second_tile.scale.x = 1;
  	second_tile.scale.y = 1;
  	first_tile = null;
  	second_tile = null;
  }

  function remove_tiles() {
  	self.gameGrid.removeChild(first_tile);
  	self.gameGrid.removeChild(second_tile);
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

  if(game_loaded) {

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
    queuesToUpdate['alphabetstim'] = true;
    var stimQ = stimQueues['alphabetstim'];

    var pairs = [];
    for (var i = 0; i < pairsFinished; i++) {
      var s_low = stimQ.pop()
      s_low.text = s_low.text.toLowerCase();
      var s_up = $.extend(true, {}, s_low);
      s_up.text = s_up.text.toUpperCase();
      pairs.push(s_low);
      pairs.push(s_up);
    }
    console.log(pairs);
    // maybe select a random type of stimQ?
    // - definitely want shapes, could do number/quantity and small addition/subtraction
    // or the type the user hasn't played in a while?

    round.init(Trial, stage, stimQ);

    init(pairs);
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
              finishGame = true; // false?
              currentview = new MainMenu(); // assets?
              game_loaded = false; // or does leaving it on prevent re-loading assets?
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
