var bubblegameloaded = false;

/*
  game works like this:
  x = target + distractors
  trial starts with x bubbles drawn onscreen, and a target letter is
  heard. then the dragonfly appears in a random location and flies
  (slowly at first) towards the target. if the target is clicked before the
  dragonfly reaches it, a point is scored (more for faster?). if the wrong
  bubble is popped or if the dragonfly gets there first, (or dragonfly gets a point?)
  number of distractors increases after 3 right, and speed adjusts constantly
*/

function bubbleLetters(){
  queuesToUpdate['alphabetstim'] = true;
  var stimQ = stimQueues['alphabetstim'];
  var dragonfly_start_pos = {'x':250, 'y':250};
  var stimCount = -1;
  bubblegameloaded = true;
  var Nfoils = 2;
  var minFoils = 1;
  var maxFoils = 9;
  var dragonflyFramesUntilArrival = 200; // lower is faster
  var minDragonflyFrames = 100; // and it changes by 10
  var maxDragonflyFrames = 300;
  var scoreIncrease = 1;
/*
-------------------------------------------------------------------------------------------------------------
                                                Class: bubble
-------------------------------------------------------------------------------------------------------------
*/

  function bubble(_trial){

  	this.trial = _trial;
  	this.selected = true;
  	this.valueObjects = [];
    this.ang = getRandomInt(-11,11)/5;
  };

    bubble.prototype.init = function(_value,_position,_size,_id){

        var _this = this;

        this.value = _value;
    	  this.id = _id;
        this.clicked = false;
        this.posdId = _position.id;
        this.pos = _position.pos;
        this.size = _size;

        this.container = new PIXI.Container();
        this.trialTimer = new ClockTimer();

        this.circle = new PIXI.Sprite(assets.textures.bubble)
        this.circle.width = this.size
        this.circle.height = this.size
        this.circle.anchor.x = 0.5
        this.circle.anchor.y = 0.5
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.mousedown = this.container.touchstart = function(){ click(); }

        function click() {
          _this.click();
        }

        this.container.addChild(this.circle);
        this.circle.x = this.pos.x+this.size/2;
        this.circle.y = this.pos.y+this.size/2;
        // fill:"#427010", stroke:"#098478" getRandomColor
        this.cStim =  new PIXI.Text(this.value, {font:"60px Arial",align: 'center', weight:"red", fill: getRandomColor(), stroke:"#098478", strokeThickness: 1, });
        this.cStim.anchor.x = 0.5
        this.cStim.anchor.y = 0.5
        this.cStim.x = this.pos.x + this.size*0.5;
        this.cStim.y = this.pos.y + this.size*0.5;

        this.circle.rotation = 0.1
        this.container.addChild(this.cStim);
        stage.addChild(this.container)
        this.display(false)
    };


    bubble.prototype.click = function(){ //_this,_event
      this.clicked = true;
      var correct_click = (this.value===this.trial.target);
      // if correct, play correct sound, stop the dragonfly, and move on
      if(correct_click) {
        correct_sound.play();
        console.log(this);
      }
      if(!correct_click) { // incorrect: pop bubble, play bad sound and wait
        this.fade = true;
        assets.sounds.wrong[0].play();
      }
      return correct_click;
    };


    bubble.prototype.destroy = function(){
        this.container.removeChild(this.circle);
        this.circle.destroy();
        this.circle = [];

        this.container.removeChild(this.cStim);
        this.cStim.destroy();
        this.cStim = [];

        stage.removeChild(this.container);
        this.container.destroy(true);
        this.container = [];

        this.destroyed = true;
    };

    bubble.prototype.display = function(_show){
        if(!_show){
            this.circle.interactive = false;
            this.circle.renderable = false;
            this.container.renderable = false;
            this.destroyed = true;
        }else{
            this.circle.interactive = true;
            this.circle.renderable = true;
            this.container.renderable = true;
            this.destroyed = false;
        }
    };

    bubble.prototype.animate = function(tick){
        if(this.destroyed){
            return;
        };

        if(this.fade){
            this.circle.alpha -= 0.05;
            this.cStim.alpha -= 0.05;
            this.circle.scale.x += .02;
            this.circle.scale.y += .02;
            if(this.circle.alpha <= 0){
                this.display(false)
            };
        }else{
            this.ang = (this.ang + 0.05) % (Math.PI*2);
            this.circle.width =  this.size + Math.sin(this.ang) * 2;
            this.circle.height =  this.size + Math.sin(this.ang) * 2;
            this.circle.rotation = Math.sin(this.ang) * 0.02;
            this.container.position.x += .5*Math.cos(this.ang );
            this.container.position.y += .5*Math.sin(this.ang ); //* .3; // move bubbles a bit?
        }
    };

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Trial
-------------------------------------------------------------------------------------------------------------
*/

    function Trial(_stim){
        stimCount++;
        this.target = _stim.text; // the target letter the dragonfly approaches
        this.lowercase = false;
        // eventually mix in some lower case letters
        if(stimCount>10 & Math.random()<.5) this.lowercase = true;

        this.foils = this.generateFoils(this.target);
        this.origstim = _stim; // in original form to push back on stimulus queue
        this.clock = new ClockTimer()

    	  this.trialState = "intro"
        this.introState = "playSound"

        this.bubble = [];
        this.matrixAvailable = []
        this.specs = this.getSpecs()
        this.posMatrix = this.getMatrixPosition()
        this.operation = 0

        this.AnimationDone = true;
        this.performOperation = false;
        this.countDone = false;

    };

    Trial.prototype.generateFoils = function(target) {
      // sample Nfoils that are NOT the target
      //return ['B','C','D'];
      var foils = [];
      var shl = shuffle(letters.slice());
      while(foils.length<Nfoils) {
        var tmp = shl.pop();
        if(tmp.text!=target) foils.push(tmp.text);
      }
      console.log(foils);
      return foils;
    };

    Trial.prototype.init = function(){
        // need to track the target's location so the dragonfly can go to it
        var bubbleValues = [this.target];
        for (var i=0; i<this.foils.length; i++){
            bubbleValues.push(this.foils[i]);
        }

        if(bubbleValues.length > this.posMatrix.length){
            throw "SCREEN TOO SMALL!";
        }

        for (var i=0; i<bubbleValues.length; i++){
            //var pos = getRandomInt(0,this.posMatrix.length);
            this.bubble.push(new bubble(this));
        }

        // create bubble graphics
        for (var i=0; i<bubbleValues.length; i++){
            var bubval = bubbleValues[i];
            if(this.lowercase) bubval = bubval.toLowerCase();
            this.bubble[i].init(bubval, this.getPos(i), this.specs.stimWidth, i)
        }

        //console.log(this.bubble[0]);
        // first bubble is target
        this.targetx = this.bubble[0].circle.position.x + 25; // this.bubble[0].pos.x;
        this.targety = this.bubble[0].circle.position.y + 25; // this.bubble[0].pos.y;

        // create dragonfly
        this.dragonfly = new PIXI.Sprite(assets.textures.dragonfly)
        this.dragonfly.width = 200;
        this.dragonfly.height = 100;
        this.dragonfly.position.x = dragonfly_start_pos.x;
        this.dragonfly.position.y = dragonfly_start_pos.y;
        this.dragonfly.anchor.y = 0.5;
        this.dragonfly.anchor.x = 0.5;
        stage.addChild(this.dragonfly);

        this.deltax = Math.abs(this.targetx - this.dragonfly.position.x) / dragonflyFramesUntilArrival;
        this.deltay = Math.abs(this.targety - this.dragonfly.position.y) / dragonflyFramesUntilArrival;

        this.clock.start(1000);
    };

    Trial.prototype.destroy = function(){

        for(var i = 0; i<this.bubble.length; i++){
            this.bubble[i].destroy()
        }

        stage.removeChild(this.dragonfly);
        this.dragonfly.destroy();
    };


	Trial.prototype.getSpecs = function(){
		var obj = {};
		obj.canvasMargin = 30;
    obj.stimWidth = 130;
    obj.margin = 15;

    obj.width = session.canvas.width-(2*obj.canvasMargin)-obj.stimWidth/2;
		obj.height = session.canvas.height-(2*obj.canvasMargin);

  	obj.moduleSize = obj.stimWidth+(obj.margin*2);

  	obj.moduleWidthCount = Math.floor(obj.width/obj.moduleSize);
  	obj.moduleHeightCount = Math.floor(obj.height/obj.moduleSize);

  	obj.widthInter = obj.width/obj.moduleWidthCount;
  	obj.heightInter = obj.height/obj.moduleHeightCount;

  	obj.marginW = (obj.widthInter - obj.stimWidth)/2;
  	obj.marginH = (obj.heightInter - obj.stimWidth)/2;

    return obj;
	};

    Trial.prototype.getMatrixPosition = function(){
    	var allPos = []
    	for(var i=0;i<this.specs.moduleWidthCount;i++){
    		for(var j=0;j<this.specs.moduleHeightCount;j++){
    			offset = j%2;
	    		allPos.push({
                    id: i,
                    pos:{
                        x:(this.specs.widthInter*i)+this.specs.marginW+this.specs.canvasMargin+((this.specs.widthInter/2)*offset)+getRandomInt(-20,20),
                        y:(this.specs.heightInter*j)+this.specs.marginH+this.specs.canvasMargin+getRandomInt(-20,20),
                    }
	    		  });
			  }
    	}

    	for(var i=0; i<allPos.length; i++){
    		this.matrixAvailable.push(i)
    	}

      return allPos
    };

    Trial.prototype.getPos = function(_i){
    	var aPos = getRandomInt(0,this.matrixAvailable.length)
    	var i = this.matrixAvailable[aPos]
    	this.matrixAvailable.splice(aPos,1)
    	return this.posMatrix[i]
    };

    Trial.prototype.intro = function(){
        switch(this.introState){
            case "playSound":
                if(this.clock.timeOut()){
                    var dest = {};
                    dest.x = session.canvas.width / 2;
                    dest.y = (session.canvas.height/2);
                    this.introState = "spawnBubbles";
                }
                break;

            case "spawnBubbles":
                for(var i = 0; i < this.bubble.length; i++){
                    this.bubble[i].display(true);
                }
                return true;
                break;

        }
        return false;
    };

    Trial.prototype.moveDragonfly = function() {
      // if they have clicked the target, they won
      if(this.bubble[0].clicked) {
        this.finishedState = "endanimation"; // "win"
        this.trialWon = true;
        dragonfly_start_pos = this.dragonfly.position;
        return true;
      }
      //if distance from target is <10, person loses
      var dist = distance(this.dragonfly.position.x, this.dragonfly.position.y, this.targetx, this.targety);
      if(dist>=10) {
        if(this.targetx > this.dragonfly.position.x) {
          this.dragonfly.position.x += this.deltax;
        } else {
          this.dragonfly.position.x -= this.deltax;
        }

        if(this.targety > this.dragonfly.position.y) {
          this.dragonfly.position.y += this.deltay;
        } else {
          this.dragonfly.position.y -= this.deltay;
        }
      }

      if((dist) < 10) { // dragonfly won!
        assets.sounds.wrong[0].play();
        dragonfly_start_pos = this.dragonfly.position;
        this.finishedState = "endanimation";
        this.trialWon = false;
        return true;
      } else {
        return false;
      }
    }

    Trial.prototype.storeStim = function() {
        if(this.trialWon) {
          var newpriority = this.origstim.priority + .5;
        } else {
          var newpriority = this.origstim.priority; // Math.log(this.wrongClicks+1) or -.1
        }
        this.origstim.priority = newpriority;
        return this.origstim;
    };

    Trial.prototype.adjustDifficulty = function(won) {
      if(won) {
        if(Nfoils<maxFoils) Nfoils++;
        if(dragonflyFramesUntilArrival>minDragonflyFrames) dragonflyFramesUntilArrival -= 10;
      } else {
        if(Nfoils>minFoils) Nfoils--;
        if(dragonflyFramesUntilArrival<maxDragonflyFrames) dragonflyFramesUntilArrival += 10;
      }
    }

    Trial.prototype.finished = function() {

        switch(this.finishedState){
            case "endanimation":
                this.adjustDifficulty(this.trialWon);
                if(this.trialWon){
                    this.clock.start(1000);
                    this.finishedState = "win";
                    var pos = [];
                    for (var i=0; i<scoreIncrease; i++) {
                      pos.push({ x: 300, y: 300});
                    }
                    score.addScore(pos, scoreIncrease);
                    score.setExplosion({ x: 300, y: 300},100,1000);
                    score.displayStar();
                    score.displayExplosion();
                }else{
                    this.clock.start(1000);
                    this.finishedState = "lose";
                }
                break;

            case "lose":
                console.log("dragonfly won!"); // make it swell?
                if(this.clock.timeOut()) this.finishedState = "callNext";
                break;

            case "win":
                if(this.clock.timeOut()) this.finishedState = "callNext";
                break;

            case "callNext":
                return true;
                break;
        }

        return false;
    };

    Trial.prototype.play = function(_updateTime){
        switch(this.trialState){
            case "intro":
                assets.sounds.letters[this.target].play();
                if(this.intro()){
                    this.trialState = "play";
                }
                break;

            case "play":
                for(var i=0;i<this.bubble.length;i++){
                    this.bubble[i].animate(_updateTime);
                }

                var dragonflyReachedTarget = this.moveDragonfly();

                if(dragonflyReachedTarget) { // computer wins!
                  // points, get rid of bubbles, start new trial

                  this.trialState = "finished"; // wait 1000ms for feedback and bubble pops
                }
                break;

            case "finished":
                for(var i=0;i<this.bubble.length;i++){
                    this.bubble[i].fade = true; // make fade into pop -- increase size as fading
                }

                if(this.finished()){
                    return true;
                }
                break;
            };
            return false;
    };

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
            //assets.addSprite("dragonfly",'sprites/dragonfly/dragonfly_fly.json',3) // used TexturePacker, doesn't work..
            assets.addTexture("dragonfly","sprites/dragonfly/separate/dragonfly-0.png")
            assets.addTexture("bubble","img/bubble.png")
            assets.addTexture("bg","sprites/backGrounds/BackGround-05.png")

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
          round.init(Trial,stage, stimQ);
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
                console.log("ending bubbleLetters")
                session.stats.domElement.style.display = "none"
                round.destroy();
                assets.destroy();
                finishGame = false;
                currentview = new MainMenu(); // assets?
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
};
