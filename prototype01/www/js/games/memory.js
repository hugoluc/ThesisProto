// simple memory game in which the player tries to find the matching tile:
// might be upper- and lower-case (A-a), numeral to number word (1-one),
// picture-word (all of the stimuli should also be heard aloud), shape-name,
// and even simple math problems (1+1=2)
// TBD: do we mix up stimulus types, or randomly choose a game type?
// could use as a mini-game, and give it in the middle of other Games
// with the appropriate stimuli

function memory(){
  var self = this;
  logTime("memory",'start');
  var stimCount = store.get("memory_rounds_solved");
  if(!stimCount) stimCount = 0; // use to switch from letters...
  //var clock = new ClockTimer();
  var scoreIncrease = 1; // increase scoreIncrease by 1 every 5 correct trials
  var game_loaded = true;

  var stimSize = 95;
  var renderer;
  var first_tile;
  var second_tile;
  self.flippedTiles = [];
  self.gameGrid;
  var pause_timer;
  var defaultImage;
  var progressBarContainer;
  var progressBarTimer;
  var timer;
  var timer_txt;
  var nCount = 60; // time given to complete: adjust for difficulty
  var maxTime = 60;
  var ncol = 4;
  var nrow = 2; // start with 2x4 (4 pairs), increase to 4x4 or 4x5 max
  var maxRows = 5; // 4*5 = 10 pairs...
  var pairsFinished = (ncol * nrow) / 2;
  self.tiles = [];
  self.numTries = 0;

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

  var Tile = function(trial, x, y, stim) {
    var _this = this;
    this.trial = trial;
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
    graphics.drawRoundedRect(0, 0, this.width-8, this.height-8, 10); // drawRoundedRect(x, y, width, height, radius)
    graphics.endFill();
    this.container.scale.x = 1.0;
  	this.container.scale.y = 1.0;
    this.container.addChild(graphics)
    this.isFaceUp = false;
  }

  Tile.prototype.click = function(){
    if (self.flippedTiles.length < 2 && !this.isFaceUp) {
        this.drawFaceUp();
        self.flippedTiles.push(this);
        if (self.flippedTiles.length === 2) {
            self.numTries++;
            if (self.flippedTiles[0].stim.id === self.flippedTiles[1].stim.id) {
                self.flippedTiles[0].isMatch = true;
                self.flippedTiles[1].isMatch = true;
                //console.log(this.stim);
                assets.sounds.letters[this.stim.audio].play();
            }
            //delayStartFC = frameCount;
            //loop(); // audio and score stuff
            this.trial.handle_click();
        }
    }

    var foundAllMatches = true;
    for (var i = 0; i < self.tiles.length; i++) {
        foundAllMatches = foundAllMatches && self.tiles[i].isMatch;
    }
    if (foundAllMatches) {
        // end round and go on to next
        // var feedback = new Howl({
        //   src: ['audio/'+language+'/feedback/'+'very_good'+'.mp3'],
        //   autoplay: true,
        //   onend: function() {
        //     console.log("next trial");
        //     console.log(this.trialState);
        //   }
        // });
        this.trialState = "finished";
        //text("You found them all in " + numTries + " tries!", 20, 375);
    }
  }

  Tile.prototype.drawFaceUp = function() {
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0x0033ee); // green-blue
    graphics.drawRoundedRect(0, 0, stimSize-8, stimSize-8, 10); // drawRoundedRect(x, y, width, height, radius)
    graphics.endFill();
    this.container.addChild(graphics);
    this.container.scale.x = 0.97;
  	this.container.scale.y = 0.97;
    var txt = new PIXI.Text(this.stim.text, {font:"40px Arial", fill:"#FFFFFF"});
    txt.position.x = (stimSize-8) / 2;
    txt.position.y = (stimSize-8) / 2;
    txt.anchor.x = 0.5;
    txt.anchor.y = 0.5;
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
    console.log(_stim)
    this.stim = _stim; // although we need (ncol*nrow) / 2 stimuli -- not just one
    this.trialState = "play";
    this.clock = new ClockTimer();
  }

  Trial.prototype.destroy = function() {
      // for(var i = 0; i<this.bubble.length; i++){
      //     this.bubble[i].destroy()
      // }
      //
      // stage.removeChild(this.dragonfly);
      // this.dragonfly.destroy();
  };

  Trial.prototype.init = function() {
    nCount = maxTime;
  	//Game Grid container for all Tiles.
  	self.gameGrid = new PIXI.Container();
  	stage.addChild(self.gameGrid);
  	for (var x=1; x<=ncol; x++) {
  		for (var y=1; y<=nrow; y++) {
  			var random_card = Math.floor(Math.random()*pairs.length);
      	//defaultImage = PIXI.Sprite.fromImage(assetsDir+"card_back.png");
  			var stim = pairs[random_card];
  			pairs.splice(random_card,1);

        var tmp = new Tile(this, 129 + (x-1)*stimSize, 59 + (y-1)*stimSize, stim);
        self.gameGrid.addChild(tmp.container)
        self.tiles.push(tmp);
  		}
  	}

    for(var i=0; i<self.tiles.length; i++) {
      self.tiles[i].drawFaceDown();
      //console.log(self.tiles[i])
    }

  	this.drawTimerBar();
  	//requestAnimationFrame( update );
  }

  Trial.prototype.play = function(_updateTime){
      switch(this.trialState){
          case "play":

              break;

          case "finished":
              for(var i=1;i<(nrow*ncol);i++){
                  self.tiles[i].fade = true;
              }
              score.displayStar();
              score.displayExplosion();

              if(this.finished()){
                  return true;
              }
              break;
          };
          return false;
  };

  Trial.prototype.finished = function() {
      switch(this.finishedState){
          case "endanimation":
              this.adjustDifficulty(this.trialWon);
              if(this.trialWon){
                  this.clock.start(1500);
                  this.finishedState = "win";
                  console.log("finished-win");
              }else{
                  this.clock.start(1500);
                  this.finishedState = "lose";
                  console.log("finished-lose");
              }
              break;

          case "lose":
              console.log("time ran out");
              if(this.clock.timeOut()) {
                this.finishedState = "callNext";
              }
              break;

          case "win":
              if(this.clock.timeOut()) {
                this.finishedState = "callNext";
              }
              break;

          case "callNext":
              return true;
              break;
      }

      return false;
  };

  Trial.prototype.handle_click = function() {
    // only gets called when two tiles have been clicked
  		//Check if we have a pair or not.
  		if (self.flippedTiles[0].stim.id === self.flippedTiles[1].stim.id) {
  			console.log("PAIR FOUND")

  			if(pairsFinished != 1) {
          //score.addScore(pos, scoreIncrease);
          correct_sound.play();
          this.finishedState = "endanimation";
          pairsFinished--;
  				setTimeout(remove_tiles, 1000);
  				console.log("remaining pairs: " + pairsFinished);

  			} else {
          this.trialWon = true;
          this.trialState = "finished";
  				timer.stop();
  				stage.removeChild(progressBarTimer);
  				timer_txt.text = ''; // play kazi nzuri / "Well Done!";
  				stage.removeChild(self.gameGrid);
          // destroy and start next round??
  				//showWinnerSpriteSheet();
          verbal_audio_feedback(true);
  			}

  		} else {
        assets.sounds.wrong[0].play();
  			setTimeout(reset_tiles, 1000);
  		}
  }

  Trial.prototype.drawTimerBar = function(){

  	progressBarTimer = new PIXI.Graphics();
  	progressBarTimer.beginFill(0xaaaaff);
  	progressBarTimer.drawRect(0, 0, 250, 20);
  	progressBarTimer.position.y = 450;
  	progressBarTimer.position.x = 50;
  	stage.addChild(progressBarTimer);
  	timer_txt = new PIXI.Text(maxTime, {font:"40px Arial", fill:"#FFFFFF"});
  	timer_txt.position.x = 50;
  	timer_txt.position.y = progressBarTimer.position.y + 20;
  	stage.addChild(timer_txt);
  	timer = new Timer(1000, maxTime); // 1 second * 60 times
    timer.addEventListener(TimerEvent.TIMER, onTick)
    timer.addEventListener(TimerEvent.TIMER_COMPLETE, this.onTimerComplete)
    timer.start();

  }

  Trial.prototype.adjustDifficulty = function(won) {
    if(won) {
      scoreIncrease++;
      if(scoreIncrease>2) {
        maxTime = maxTime - 5; // less time
        if(scoreIncrease>5 & nrow<maxRows) nrow++; // another row
      }
    } else {
      scoreIncrease--;
      if(scoreIncrease<1) {
        maxTime = maxTime + 5;
        if(scoreIncrease<0 & nrow>2) nrow--;
      }
    }
  }

  // how does it make sense to adjust for each stim on the trial?
  Trial.prototype.storeStim = function() {
      if(this.trialWon) {
        var newpriority = this.stim.priority + .03;
      } else {
        var newpriority = this.stim.priority; // Math.log(this.wrongClicks+1) or -.1
      }
      this.stim.priority = newpriority;
      return this.stim;
  };

  function onTick(event){
  	nCount--;
  	timer_txt.text = nCount;
  	progressBarTimer.scale.x = 1 - event.target.currentCount / 60;
  }

  Trial.prototype.onTimerComplete = function(event){
    this.trialWon = false;
    this.trialState = "finished"
  	timer_txt.text = "Try again!"; // feedback in that language
    verbal_audio_feedback(false);
    // timeout for a few seconds and then a new round -- with more time, and maybe fewer tiles
  }

  function reset_tiles() {
    for (var i = 0; i < self.flippedTiles.length; i++) {
       self.flippedTiles[i].drawFaceDown();
    }
    self.flippedTiles = [];
  }

  function remove_tiles() {
    for (var i = 0; i < self.flippedTiles.length; i++) {
  	   self.gameGrid.removeChild(self.flippedTiles[i].container);
    }
  	self.flippedTiles = [];
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
      assets.addTexture("bg","sprites/backGrounds/BackGround-05.png");
      for (var i = 0; i < letters.length; i++) {
        assets.addSound(letters[i].audio,letters[i].audio + '.mp3', "letters");
      };
      assets.addSound("wrong",'wrong.mp3');
      assets.addSound("correct1",correctSounds[0][0].audio + '.mp3');
      assets.load(onAssetsLoaded);
  } else {
      onAssetsLoaded();
  };

  function onAssetsLoaded(){

    // maybe select a random type of stimQ?
    // - definitely want shapes, could do number/quantity and small addition/subtraction
    // or the type the user hasn't played in a while?

    round.init(Trial, stage, stimQ);

    //init(pairs);
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
              logTime("memory",'stop');
              round.storeSession(stimQ, "alphabetstim")
              session.stats.domElement.style.display = "none";
              round.destroy(); // error here gameDefinitions:316
              assets.destroy();
              finishGame = false; // false?
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

          while (lag >= MS_PER_UPDATE){
            round.play(lag/MS_PER_UPDATE);
            lag = lag - MS_PER_UPDATE;
          }

          // render the stage
          session.render(stage);
          requestAnimationFrame(update);
          if(statsBol) session.stats.end();

      }
}
