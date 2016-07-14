var gameloaded = true;
var stimCount = -1;

/*
  game works like this:
  x = target + distractors
  trial starts with x bubbles (clouds?) drawn onscreen, and a target letter is
  heard. then the dragonfly appears in a random location and flies
  (slowly at first) towards the target. if the target is clicked before the
  dragonfly reaches it, a point is scored (more for faster?). if the wrong
  bubble is popped or if the dragonfly gets there first, (or dragonfly gets a point?)
  number of distractors increases after 3 right, and speed adjusts constantly
*/

function bubbleLetters(){
  queuesToUpdate['alphabetstim'] = true;
  var stimuli = stimQueues['alphabetstim'];
  console.log(stimuli)
/*
-------------------------------------------------------------------------------------------------------------
                                                Class: bubble
-------------------------------------------------------------------------------------------------------------
*/

  function bubble(_trial){

  	this.trial = _trial
    //console.log(this.trial)
  	this.selected = true
  	this.valueObjects = []
    this.ang = getRandomInt(-11,11)/10
  };

    bubble.prototype.init = function(_value,_position,_size,_id){

        var _this = this;

        this.value = _value;
    	  this.id = _id;
        this.clicked = false;
        this.posdId = _position.id
        this.pos = _position.pos;
        this.size = _size;

        this.container = new PIXI.Container()
        this.trialTimer = new ClockTimer();

        this.circle = new PIXI.Sprite(assets.textures.bubble)
        this.circle.width = this.size
        this.circle.height = this.size
        this.circle.anchor.x = 0.5
        this.circle.anchor.y = 0.5
        this.container.interactive = true; // or circle?
        this.container.buttonMode = true; // or circle?
        this.container.mousedown = this.container.touchstart = function(){ click(); }
    	  // this.circle
      	// 	.on('mousedown', click)
        //  .on('touchstart', click);
        //  .on('touchmove', function(){_this.drag(this)})
        //  .on('mousemove', function(){_this.drag(this)})

        function click() {
          _this.click();
        }

        this.container.addChild(this.circle);
        this.circle.x = this.pos.x+this.size/2;
        this.circle.y = this.pos.y+this.size/2;

        this.cNumber =  new PIXI.Text(this.value, {font:"60px Arial",align: 'center', weight:"red", fill:"#427010", stroke:"#098478", strokeThickness: 1, });
        this.cNumber.anchor.x = 0.5
        this.cNumber.anchor.y = 0.5
        this.cNumber.x = this.pos.x + this.size*0.5;
        this.cNumber.y = this.pos.y + this.size*0.5;

        this.circle.rotation = 0.1
        this.container.addChild(this.cNumber);
        stage.addChild(this.container)
        this.display(false)
    };


    bubble.prototype.click = function(){ //_this,_event
      this.clicked = true;
      var correct_click = (this.value===this.trial.stimuli.correctValue);
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
        this.container.removeChild(this.circle)
        this.circle.destroy()
        this.circle = []

        this.container.removeChild(this.cNumber)
        this.cNumber.destroy()
        this.cNumber = []

        stage.removeChild(this.container)
        this.container.destroy(true)
        this.container = []

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

    bubble.prototype.animate = function(){
        if(this.destroyed){
            return;
        };

        if(this.fade){
            this.circle.alpha -= 0.05;
            this.cNumber.alpha -= 0.05;
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
            //this.container.position.x += 1;
            //this.container.position.y += Math.sin(tick + st.offset) * .3; // move bubbles a bit?
        }
    };

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Trial
-------------------------------------------------------------------------------------------------------------
*/

    function Trial(_stimulus){
        stimCount++;
        // correct on 1st trial, but 2nd trial has undefined correctValue?
        console.log(_stimulus)
        this.stimuli = {correctValue: [_stimulus.text], extras: ['B','C','D'], priority: _stimulus.priority};
        //console.log(this.stimuli);
		    // Correct is the target letter that the dragonfly approaches
        this.correct = this.stimuli.correctValue;
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

    Trial.prototype.init = function(){
        // need to track the target's location so the dragonfly can go to it
        var bubbleValues = [this.stimuli.correctValue];
        for (var i=0; i<this.stimuli.extras.length; i++){
            bubbleValues.push(this.stimuli.extras[i]);
        }

        if(bubbleValues.length > this.posMatrix.length){
            throw "SCREEN TOO SMALL!";
        }

        for (var i=0; i<bubbleValues.length; i++){
            //var pos = getRandomInt(0,this.posMatrix.length);
            this.bubble.push(new bubble(this)); // each bubble gets the whole trial..?
        }

        // create bubble graphics
        for (var i=0; i<bubbleValues.length; i++){
            this.bubble[i].init(bubbleValues[i], this.getPos(i), this.specs.stimWidth, i)
        }

        //console.log(this.bubble[0]);
        // first bubble is target
        this.targetx = this.bubble[0].circle.position.x + 25; // this.bubble[0].pos.x;
        this.targety = this.bubble[0].circle.position.y + 25; // this.bubble[0].pos.y;

        // create dragonfly
        this.dragonfly = new PIXI.Sprite(assets.textures.dragonfly)
        this.dragonfly.width = 200;
        this.dragonfly.height = 100;
        this.dragonfly.position.x = 50; // from previous trial..
        this.dragonfly.position.y = 100; // from prev trial
        this.dragonfly.anchor.y = 0.5;
        this.dragonfly.anchor.x = 0.5;
        stage.addChild(this.dragonfly);

        this.deltax = Math.abs(this.targetx - this.dragonfly.position.x) / 200;
        this.deltay = Math.abs(this.targety - this.dragonfly.position.y) / 200;

        this.clock.start(1000);
    };

    Trial.prototype.destroy = function(){

        for(var i = 0; i<this.bubble.length; i++){
            this.bubble[i].destroy()
        }

        stage.removeChild(this.dragonfly)
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
        this.finishedState = "win";
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
          this.dragonfly.position.x -= this.deltay;
        }
      }

      if((dist) < 10) { // dragonfly won!
        assets.sounds.wrong[0].play();
        this.finishedState = "lose";
        return true;
      } else {
        return false;
      }
    }

    // GK: ToDo finish this! (where is learner's correctness?)
    Trial.prototype.storeStim = function() {
        if(this.wrongClicks===0) {
          var newpriority = this.stimuli.priority + .5;
        } else {
          var newpriority = this.stimuli.priority - Math.log(this.wrongClicks+1);
        }
        this.stimuli.priority = newpriority;
        return(this.stimuli);
    };

    Trial.prototype.finished = function() {

        switch(this.finishedState){
            case "endanimation":
                if(this.trialEnded){
                    console.log(this.stimuli.correct.value);
                    this.clock.start(1000);
                    this.finishedState = "win";
                }else{
                    this.finishedState = "lose";
                }
                break;

            case "lose":
                console.log("dragonfly won!")
                this.finishedState = "callNext";
                // if(this.lillyFinal.display()){
                //     this.finishedState = "callNext"
                // }
                break;

            case "win":
                if(this.clock.timeOut()){
                    this.finishedState = "callNext";
                }
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
                assets.sounds.letters[this.stimuli.correctValue[0]].play();
                if(this.intro()){
                    this.trialState = "play";
                }
                break;

            case "play":
                for(var i=0;i<this.bubble.length;i++){
                    this.bubble[i].animate();
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

    this.destroy = function(){
        finishGame = true;
        session.hide()
    };

    //---------------------------------------loading assets

        if(gameloaded) {
            //assets.addSprite("dragonfly",'sprites/dragonfly/dragonfly_fly.json',3) // used TexturePacker, doesn't work..
            assets.addTexture("dragonfly","sprites/dragonfly/separate/dragonfly-0.png")
            assets.addTexture("bubble","img/bubble.png")
            assets.addTexture("bg","sprites/backGrounds/BackGround-05.png")

            //console.log(stimuli) // undefined?
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
          round.init(Trial,stage, stimuli);
          setTimeout(function(){
              console.log("starting the game!")
              session.show()
              update();
          });
        };

    //---------------------------------------LOOP
        var statsBol = false;
        if(statsBol){
            session.stats.domElement.style.display = "block"
        };

        var finishGame = false
        var previousTime = Date.now();
        var MS_PER_UPDATE = 16.66667;
        var lag = 0

        function update() {

            if(finishGame){
                console.log("ending bubbleLetters")
                session.stats.domElement.style.display = "none"
                round.destroy()
                assets.destroy()
                finishGame = false
                currentview = new MainMenu(); // assets?
                return
            }

            if(statsBol) session.stats.begin()

          	//update position based on expected frame rate
  	        var current = Date.now();
  	        var elapsed = current - previousTime;
  	        previousTime = current;
  	        lag = lag + elapsed;

        	  while (lag >= MS_PER_UPDATE){
              round.play(lag/MS_PER_UPDATE);
              lag = lag - MS_PER_UPDATE;
  	        }

    	      //---------------->> Thing that renders the whole stage
    	      session.render(stage)
    	      requestAnimationFrame(update);
            if(statsBol)session.stats.end()

        }

};
