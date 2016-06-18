var gameloaded = true
var stimCount = -1

/*
  game works like this:
  x = target + distractors
  trial starts with x bubbles (clouds?) drawn onscreen, and then
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
  	this.selected = true
  	this.valueObjects = []
      this.antsDivision = []
      this.ang = getRandomInt(-11,11)/10
  };

    bubble.prototype.init = function(_value,_position,_size,_id,_antSize){

        var _this = this;

        this.value = _value;
    	this.id = _id;
    	this.connections = [];
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
        this.circle.interactive = true;
        this.circle.buttonMode = true;

    	this.circle
    		//touchstart
    		.on('mousedown', click)
        .on('touchstart', click)
    		.on('mouseup', function(){_this.clickEnd(this)})
        .on('mouseupoutside', function(){_this.clickEnd(this)})
        .on('touchend', function(){_this.clickEnd(this)})
        .on('touchendoutside', function(){_this.clickEnd(this)})
        //drag
        .on('mousemove', function(){_this.drag(this)})
        .on('touchmove', function(){_this.drag(this)});

        function click(_event){
        	_this.clickStart(this,_event)
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


    bubble.prototype.clickStart = function(_this,_event){

        if(!round.trial.AnimationDone){
            return
        }

    	//change lillypad to selected
    	_this.data = _event.data;
        _this.dragging = true;
    };

    bubble.prototype.clickEnd = function(_this){

    	//change lillypad to selected

    	if(!this.dragging) return

        _this.dragging = false;
        this.dragging = false;

        this.trial.CheckLink(_this.data.getLocalPosition(_this.parent),this.id)
    };

    bubble.prototype.drag = function(_this){

    	//change lillypad to selected
    	if(_this.dragging){

    		if(!this.dragging){
    			//this.stick = this.trial.createStick(_this.data.getLocalPosition(_this.parent));
    			this.dragging = true;
    		};

    		//this.trial.moveStick(_this.data.getLocalPosition(_this.parent))

    	};
    };

    bubble.prototype.getAntsDivision = function(_antSize,_divisions){

        this.antsDivision = []
        var n = this.size
        var ant = []

        for (var i=0; i<this.value; i++){

            var angle = ((2*Math.PI)/this.value)*i

            this.antsDivision.push({

                x : this.circle.x + (Math.cos(angle) * (n*0.32)),
                y : this.circle.y + (Math.sin(angle) * (n*0.32))

            })

        }

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

            for(var i = 0; i < round.trial.ants.sprites.length; i++){


                if(round.trial.ants.sprites[i].id == this.id )

                    round.trial.ants.sprites[i].sprite.renderable = false;

            }

            this.circle.interactive = false;
            this.circle.renderable = false;
            this.container.renderable = false;
            this.destroyed = true;

        }else{


            for(var i = 0; i < round.trial.ants.sprites.length; i++){


                if(round.trial.ants.sprites[i].id == this.id )

                    round.trial.ants.sprites[i].sprite.renderable = true;

            }

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

            if(this.circle.alpha <= 0){

                this.display(false)

            };


        }else{

            this.ang = (this.ang + 0.05) % (Math.PI*2);
            this.circle.width =  this.size + Math.sin(this.ang) * 2;
            this.circle.height =  this.size + Math.sin(this.ang) * 2;
            this.circle.rotation = Math.sin(this.ang) * 0.02;

        }
    };

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Trial
-------------------------------------------------------------------------------------------------------------
*/

    function Trial(_stimuli,_correct){
        stimCount++;


    this.stimuli = {correctValue: [_stimuli.text], extras: ['B','C','D']};
    console.log(_stimuli);
		/*----------------------
		Correct is the final number that should be placed in the final lillypad
		------------------------*/
    	this.correct = this.stimuli.correctValue;

      this.clock = new ClockTimer()

    	this.sticks = []

    	this.trialState = "intro"
        this.introState = "playSound"

        this.bubble = [];
        this.matrixAvailable = []
        this.specs = this.getSpecs()
        this.posMatrix = this.getMatrixPosition()
        this.operation = 0

        this.AnimationDone = true;
        this.fadeStick = false;
        this.performOperation = false;
        this.countDone = false;

        this.ants = {

            size : {
                width : 9,
                height : 14,
            },
            sprites : [],
        };

        this.antsToAnimate = {
            origin : [],
            target : []
        };

        this.antsSub = 0;
        this.antsAdd = 0;
        this.leavesToFade = 0
    };

    Trial.prototype.init = function(){
        var lilipadValues = this.stimuli.correctValue
        for (var i=0; i<this.stimuli.extras.length; i++){
            lilipadValues.push(this.stimuli.extras[i]);
        }

        if(lilipadValues.length > this.posMatrix.length){
            throw "SCREEN TOO SMALL!"
        }

        // create small liilypads
        for (var i=0; i<lilipadValues.length; i++){
            var pos = getRandomInt(0,this.posMatrix.length)
            this.bubble.push(new bubble(this))
        }

        // create lillpypads visuals and ants
        for (var i=0; i<lilipadValues.length; i++){

            this.bubble[i].init(lilipadValues[i], this.getPos(i), this.specs.lillyWidth, i, this.ants.size)

        }

        //this.lillyFinal.init(this.stimuli.correct.value);


        // create stick
        this.stick = new PIXI.Sprite(assets.textures.stick)
        this.stick.width = 0;
        this.stick.height = 15;
        this.stick.anchor.y = 0.5
        stage.addChild(this.stick);

        this.branch = new PIXI.Sprite(assets.textures.branch)
        this.branch.anchor.x = -0.2
        stage.addChild(this.branch);

        this.clock.start(1000)
    };

    Trial.prototype.destroy = function(){
        //this.lillyFinal.destroy()

        for(var i=0;i<this.ants.sprites.length;i++){
            this.ants.sprites[i].destroy()
        }

        for(var i = 0; i<this.bubble.length; i++){
            this.bubble[i].destroy()
        }

        stage.removeChild(this.stick)
        this.stick.destroy();
        stage.removeChild(this.branch)
        this.branch.destroy();
    };

    Trial.prototype.antMoveDone = function(_operation){

        if(_operation == "add"){
          console.log("ants >> In")
          this.antsAdd++
        }else if(_operation == "subtract"){
            this.antsSub--
        }else if(_operation == "final"){
            this.antsAdd--
        };
    };

    //creates links between lillypads if allowed
	Trial.prototype.CheckLink = function(_dropPoint,_id){

        // FINAL MOVE:
        if(this.lillyFinal.lillypad.containsPoint(_dropPoint)){

            //this.moveStick(true,"final")
            this.updateOperation(_id,"final")
            this.trialState = "finished"
            this.leavesToFade = 0
            this.finishedState = "countdown"

            if(this.bubble[_id].value == this.stimuli.correct.value){


                this.trialEnded = true;

            }else{

                this.trialEnded = false;

            }

            return
        }


        //check which lillypad the stick was droped over
        for(var i=0; i<this.bubble.length; i++){

            if(this.bubble[i].circle.containsPoint(_dropPoint)){

                if(i == _id){
                    this.stick.alpha = 0
                    return
                }

                //this.moveStick(true,i)
                this.updateOperation(_id,i)

                return;

            }

        }

        this.fadeStick = true;
    };

  Trial.prototype.updateOperation = function(_origin,_target){

        if(_target == "final"){

            this.performOperation = true;
            this.countDone = false;

            this.countDownTargets = [_origin,_target]

            this.setAnimateAnts(_origin,_target)

        }else{

            this.performOperation = true;
            this.countDone = false;

            // set countdown
            this.countDownTargets = [_origin,_target]

            //update value for lillypads
            this.bubble[_target].value = parseInt(this.bubble[_target].value) + parseInt(this.bubble[_origin].value)
            this.bubble[_origin].value = 0

            //get new location for ants
            this.setAnimateAnts(_origin,_target)

        };
    };

	Trial.prototype.getSpecs = function(){

		var obj = {}

		obj.canvasMargin = 30
    obj.bigLillypadWidth = 280;
    obj.lillyWidth = 130;
    obj.margin = 15

    obj.width = session.canvas.width-(2*obj.canvasMargin)-(obj.bigLillypadWidth*1.2)-obj.lillyWidth/2;
		obj.height = session.canvas.height-(2*obj.canvasMargin);

  	obj.moduleSize = obj.lillyWidth+(obj.margin*2)

  	obj.moduleWidthCount = Math.floor(obj.width/obj.moduleSize)
  	obj.moduleHeightCount = Math.floor(obj.height/obj.moduleSize);

  	obj.widthInter = obj.width/obj.moduleWidthCount
  	obj.heightInter = obj.height/obj.moduleHeightCount

  	obj.margingW = (obj.widthInter - obj.lillyWidth)/2
  	obj.margingH = (obj.heightInter - obj.lillyWidth)/2

    this.lillywith = obj.lillyWidth
    return obj
	};

    Trial.prototype.getMatrixPosition = function(){
    	var allPos = []
    	for(var i=0;i<this.specs.moduleWidthCount;i++){
    		for(var j=0;j<this.specs.moduleHeightCount;j++){
    			offset = j%2
	    		allPos.push({
                    id: i,
                    pos:{
                        x:(this.specs.widthInter*i)+this.specs.margingW+this.specs.canvasMargin+((this.specs.widthInter/2)*offset)+getRandomInt(-20,20),
                        y:(this.specs.heightInter*j)+this.specs.margingH+this.specs.canvasMargin+getRandomInt(-20,20),
                    }
	    		})
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
                    dest.y = (session.canvas.height/2)
                    this.introState = "spawnBubbles"
                }
                break;

            case "spawnBubbles":
                for(var i = 0; i < this.bubble.length; i++){
                    this.bubble[i].display(true)
                }
                return true
                break;

        }
        return false
    };


    // GK: ToDo finish this! (where is learner's correctness?)
    Trial.prototype.storeStim = function(){
      var newpriority = 1
        // if(this.wrongClicks===0) {
        //   var newpriority = this.stimuli.priority + .5;
        // } else {
        //   var newpriority = this.stimuli.priority - Math.log(this.wrongClicks);
        // }
        this.stimuli.priority = newpriority;
        return(this.stimuli);
    };

    Trial.prototype.finished = function(){

        switch(this.finishedState){

            case "countdown":


                var countDone = this.countNumber()
                var animationDone = this.animateAnts()

                if(countDone && animationDone){

                    if(this.trialEnded){

                        //console.log("changinf to win...")
                        console.log(this.leavesToFade,this.stimuli.correct.value)
                        this.fadeStick = true;
                        this.clock.start(1000)
                        this.finishedState = "win";

                    }else{

                        this.lillyFinal.sinkThis();
                        this.fadeStick = true;
                        this.finishedState = "lose";

                    }

                }

                break;

            case "lose":

                if(this.lillyFinal.state == "fading"){

                   for(var i = 0; i<this.antsToAnimate.origin.length; i++){

                        this.ants.sprites[this.antsToAnimate.origin[i]].fade()
                   }
                }

                //sink lillypad
                if(this.lillyFinal.display()){
                    this.finishedState = "callNext"
                }

                break;

            case "win":

                // fade everryhting else
                // move final to center

                //alert("YOU WIN!")
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
                if(this.fadeStick){ this.removeStick() }

                if(this.intro()){
                    this.trialState = "play"
                };

                break;

            case "play":


                for(var i=0;i<this.bubble.length;i++){
                    this.bubble[i].animate()
                }

                if(this.fadeStick) {
                    this.removeStick()
                } else if(this.performOperation){

                    var countDone = this.countNumber()
                    var AnimationDone = this.animateAnts()

                    if(countDone && AnimationDone){
                        this.bubble[this.countDownTargets[0]].fade = true
                        this.fadeStick = true;
                        this.performOperation = false
                    }
                }

                break;

            case "finished":
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
            //assets.addSprite("ripple",'sprites/lillypad/ripples/ripples.json',5)
            assets.addTexture("bubble","img/bubble.png")
            assets.addTexture("bg","sprites/backGrounds/BackGround-05.png")
            assets.load(onAssetsLoaded)
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

          	//update position based on espectaed frame rate
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
