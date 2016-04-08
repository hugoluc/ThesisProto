var proto2loaded = false;

var scoreDifferential = 0; // add 1 if correct, -1 if incorrect;
// modify game dynamics if scoreDifferential reaches +3 or -3
var walkSpeed = 8; // +1 if 3x correct; -1 if 3x incorrect
var numFoils = 8; // +2 if 3x correct, -1 if 3x incorrect


function proto02(){
/*
-------------------------------------------------------------------------------------------------------------
                                              Class: LadyBug
-------------------------------------------------------------------------------------------------------------
*/
    function LadyBug(value){

        var _this = this;

        this.startNumber = value; //getRandomInt(1,7);
        // container variables
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.mousedown = this.container.touchstart = function(){ _this.click(); }
        this.container.pivot = {
            x: 0,
            y: 0,
        }

        this.sprite = {};

        //console.log(assets.sprites.ladybugWalk)

        // sprite variables
        console.log(assets.sprites.ladyBug_Fly)
        this.sprite.walk = new PIXI.extras.MovieClip(assets.sprites.ladyBug_Walk);
        this.sprite.walk.animationSpeed = 0.1;
        this.sprite.walk.play();
        this.sprite.walk.scale.x = 0.34;
        this.sprite.walk.scale.y = 0.34;
        this.container.addChild(this.sprite.walk);

        this.sprite.fly = new PIXI.extras.MovieClip(assets.sprites.ladyBug_fly);
        this.sprite.fly.animationSpeed = 0.1;
        this.sprite.fly.alpha = 0;
        this.sprite.fly.scale.x = 0.34;
        this.sprite.fly.scale.y = 0.34;
        this.container.addChild(this.sprite.fly);

        console.log(assets.textures.ladyBug_dead)

        this.sprite.dead = new PIXI.Sprite(assets.textures.ladyBug_dead);
        this.sprite.dead.alpha = 0;
        this.sprite.dead.scale.x = 0.34;
        this.sprite.dead.scale.y = 0.34;
        this.container.addChild(this.sprite.dead);

        //number variables
        this.number =  new PIXI.Text("12", {font:"30px Arial", fill:"red", stroke:"red", strokeThickness: 1, });
        this.number.x = this.sprite.walk.x + (this.sprite.walk.width/2) - (this.number.width/2) + 7
        this.number.y = this.sprite.walk.y + (this.sprite.walk.height/2) - (this.number.height/2)
        this.container.addChild(this.number)

        stage.addChild(this.container)


        //----------------------class variables
        this.timer = new ClockTimer();
        this.angle = 0;
        this.start = {};
        this.end = {};
        this.state = "walk";
        this.playQueue = [];
    };

    LadyBug.prototype.checkOutOfScreen = function(){
        if (this.container.x < 0 || this.container.x > session.canvas.width || this.container.y+this.container.width < 0 || this.container.y > session.canvas.height){
            return true;
        }else {
            return false;
        };
    }

    LadyBug.prototype.destroy = function(){

        stage.removeChild(this.container);
        this.container.removeChildren(0,this.container.length);
        this.sprite.walk.destroy(true,true);
        this.sprite.fly.destroy(true,true);
        this.sprite.dead.destroy(true,true);
        this.container.destroy(true,true);
        this.number.destroy(true,true);
        this.state = "destroy";

    }


    LadyBug.prototype.setUp = function(freeIds){ // xpos
        
        this.sprite.walk.play();
        this.sprite.walk.alpha = 1;

        this.sprite.fly.stop()
        this.sprite.fly.alpha = 0;

        this.sprite.dead.alpha = 0;

        this.state = "walk";
        this.number.text = this.startNumber;
        this.container.ySpeed = walkSpeed / Math.log(this.number.text+5); 
        this.sprite.walk.animationSpeed = .05*walkSpeed/Math.log(this.number.text+4);

        var moduleCount = window.innerWidth/this.sprite.walk.width;

        if(freeIds == null){
            var moduleId = getRandomInt(0,Math.floor(moduleCount));
        }else{ // GK: make non-overlapping
            var moduleId = freeIds[getRandomInt(0,freeIds.length)];
        }


        this.start.x = moduleId * this.sprite.walk.width;
        this.start.y = window.innerHeight;

        this.end.x = getRandomInt(this.start.x-this.sprite.walk.width*2,this.start.x+this.sprite.walk.width*2);
        this.end.y = -this.sprite.walk.height;
        if(this.end.x > stage.width){
            this.end.x = stage.width;
        }else if(this.end.x < 10){
            this.end.x = 10;
        };

        this.container.xSpeed = (this.start.x-this.end.x)/(this.start.y - this.end.y)
        if(this.start.x > this.end.x){ this.container.xSpeed*-1 }

        this.container.rotation = getAngle(this.start.x,this.start.y,this.end.x,this.end.y)
        this.container.x = this.start.x;
        this.container.y = this.start.y;

        return moduleId;
    }

    LadyBug.prototype.move = function(_state){


        if(this.state == "destroy"){
            return
        }

        if (_state != undefined){
            this.state = _state;
        };

        //--->> move this inside animation class
        this.container.y = this.container.y - this.container.ySpeed;
        this.container.x = this.container.x - this.container.xSpeed;

        switch(this.state){

            case "walk":

                if(this.container.y  < this.end.y){

                    this.container.y = this.start.y;
                    this.setUp();

                };

                break;

            case "fly":

                this.sprite.walk.stop();
                this.sprite.walk.alpha = 0;

                this.sprite.fly.play()
                this.sprite.fly.alpha = 1;

                if(this.timer.timeOut()){

                    this.container.ySpeed = 10;

                    if(this.container.y  < this.end.y){

                        round.trial.answer(true)
                        this.container.y = this.start.y;
                        this.setUp();

                    }

                };

                break;

            case "dead":

                if(this.timer.getElapsed() > 1200){
                    this.sprite.dead.alpha =  this.sprite.dead.alpha - 0.05;

                    if(this.timer.timeOut()){
                        this.state = "walk";
                        this.setUp();
                    }

                }

                break;

            case "destroy":

                break;

        };
    };

    LadyBug.prototype.forceFly = function(){

        this.sprite.walk.stop();
        this.sprite.walk.alpha = 0;

        this.sprite.fly.play()
        this.sprite.fly.alpha = 1;

        this.number.text = "";
        this.container.rotation = 0;
        this.container.ySpeed = 10;
        this.container.xSpeed = 0;
        this.sprite.walk.animationSpeed = 0;

    }

    LadyBug.prototype.click = function(){
        //console.log("-------CLICK----------");

        var _this = this;
        // check if its correct
        if(this.startNumber == round.trial.stimuli.id){
            scoreDifferential += 1;

            //console.log("click over:--",this.number.text)

            this.number.text--;
            round.trial.answer();

            // flyes if it reaches 0
            if(this.number.text == 0) {
              // play feedback sound
              correct_sound.play(); // GK: why doesn't this play?
              this.number.text = ""
              this.timer.start(300);
              this.state = "fly"
              this.container.ySpeed = 0;
              this.container.xSpeed = 0;
              this.sprite.walk.animationSpeed = 0;

            // kills if it click one more time
            } else if(this.number.text < 0) {

                this.sprite.fly.stop();
                this.sprite.fly.alpha = 0;
                this.sprite.dead.alpha = 1;
                this.sprite.renderable = true;
                this.number.text = ""
                this.container.ySpeed = 0;
                this.container.xSpeed = 0;
                this.timer.start(1500);
                this.state = "dead";

            // try to present audio for each number in the countdown? maybe too slow..
            }else if (this.number.text > 0){

                // if(this.playQueue.length <= 0){
                //     console.log("--------------------------------")
                //     this.playQueue.push(this.number.text)
                //     assets.sounds[this.number.text].play()
                //     assets.sounds[this.number.text].playbackRate = 1.5
                //     assets.sounds[this.number.text].addEventListener("ended", function(){_this.playNext()})

                // }else{

                //     this.playQueue.push(this.number.text)
                // }
            }
        } else {
          scoreDifferential -= 1;
        }
    }

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Trial
-------------------------------------------------------------------------------------------------------------
*/
    function Trial(_stimuli){

      this.ladyBugs = [];
      this.stimuli = _stimuli;
      this.correct = _stimuli.id;
      this.correctImput = 0;
      this.playQueue = []
      this.correctSet = false;
    };

    Trial.prototype.destroy = function(){

        for(var i=0; i<this.ladyBugs.length; i++){

          this.ladyBugs[i].destroy()

        }

        this.UI.removeChildren(0,this.UI.children.length)
        this.circle.destroy(true.true)
        this.cNumber.destroy(true,true)

        stage.removeChild(this.UI)
        this.UI.destroy(true,true)
    };

    Trial.prototype.getFoils = function() {

      // get numFoils foils that are within +/-3 of the target number
      var corNum = parseInt(this.correct)
      var min = corNum < 3 ? 0 : corNum - 3;
      var foils = [];

      for (var i = 0; i < numFoils; i++) {

        foils.push( getRandomInt(min, corNum + 3) );

      }

      return(foils);
    };

    Trial.prototype.init = function(){

      interval = Math.floor(screen_width / (numFoils + 1.0));
      this.foils = this.getFoils();
      this.foils.push(parseInt(this.correct)); // make sure we have the correct answer
      this.foils = shuffle(this.foils);
      console.log(this.foils);

      for (var i=0; i<numFoils; i++){

        var xpos = getRandomInt(20 + interval*i, interval*(i+1) - 20);
        this.ladyBugs.push(new LadyBug(this.foils[i]));
        this.ladyBugs[i].setUp(); // i+2 ?? xpos ?

      }

      this.UI = new PIXI.Container()
      this.UI.customAnimation = new animation(this.UI)

      this.trialTimer = new ClockTimer();

      this.circle = new PIXI.Graphics()
      this.circle.lineStyle(0);
      this.circle.beginFill(0x02d1aa);
      this.circle.drawCircle(0,0,100);
      this.circle.endFill();
      this.UI.addChild(this.circle);
      this.circle.x = 80,
      this.circle.y = session.canvas.height-60;

      this.cNumber =  new PIXI.Text(this.correct, {font:"100px Arial", weight:"bold", fill:"#098478", stroke:"#098478", strokeThickness: 1, });
      this.cNumber.x = 50
      this.cNumber.y = session.canvas.height-120
      this.UI.addChild(this.cNumber);

      stage.addChild(this.UI)
      this.trialState = "play"; // GK: was "play"
    };

    Trial.prototype.play = function(_updateTime){

        switch(this.trialState){

            case "intro":

                //move to the middle
                // move to the corner
                // chanto to play

            case "play":

                for (var i=0; i<this.ladyBugs.length; i++){
                  this.ladyBugs[i].move()
                };

                if(this.correctImput >= 1){

                    for (var i=0; i<this.ladyBugs.length; i++){ this.ladyBugs[i].forceFly() };

                    this.trialState = "showNext"
                    this.showNextState = "flyall"

                }

                break;

            case "showNext":

                // moke all fly, call trial loop
                // round.getNextTrial()

                if(this.showNextNumber()){

                    this.correctImput = 0;
                    for (var i=0; i<this.ladyBugs.length; i++){ this.ladyBugs[i].state = "walk"  };
                    this.trialState = "play";

                };

                break;

            };
        };


    Trial.prototype.showNextNumber = function(){

      // GK: when do we lose previous trial.stimuli???
      // push back onto queue (once..) for later GK: ideally would do this in round loop, between trials
      //this.stimuli.priority += .5;
      //stimQueues['numberstim'].push(this.stimuli);
      //console.log('pushed '+this.stimuli.id+' back on queue');

      // GK somewhere here do the star + score
        switch(this.showNextState){

            case "flyall":

                var next = true;

                for (var i=0; i<this.ladyBugs.length; i++){

                    if(!this.ladyBugs[i].checkOutOfScreen()){
                        next = false
                    }

                    this.ladyBugs[i].move("noReset")
                };

                if(next){

                    var dest = {}
                    dest.x = renderer.width/2 - this.UI.getBounds().width/2
                    dest.y = renderer.height/2 - this.UI.getBounds().height/2

                    this.showNextState = "center";
                    this.UI.customAnimation.init({x:dest.x,y:dest.y},1000)

                }

                break;

            case "center":

                if(this.UI.customAnimation.run()){
                    this.showNextState = "change";
                    this.trialTimer.start(1000);
                }

                break;


            case "change":

                if(!this.correctSet && this.trialTimer.getElapsed() > 500){
                    
                    this.stimuli = stimQueues['numberstim'].pop();
                    console.log(this.stimuli);
                    this.correct = this.stimuli.id;
                    this.cNumber.text = this.stimuli.id;
                    this.correctSet = true;
                    assets.sounds.numbers[this.stimuli.id].play();
                }

                if(this.trialTimer.timeOut()){

                    var dest = {}
                    dest.x = 0
                    dest.y = renderer.height- this.UI.getBounds().height

                    this.UI.customAnimation.init({x:dest.x,y:dest.y},1000)
                    this.showNextState = "corner"
                }

                break;

            case "corner":

                if(this.UI.customAnimation.run()){

                    this.showNextState = "flyall"
                    this.correctSet = false;
                    return true
                }

                break;

        }

        return false
    };

    /*
    *********************************************************************
    Handles the answer given by the user
    TRUE = answeras is exacly iqual to the expected answerer
    other parameter could be passed to specify a partial ansewer
    like for exaple a smashed bug (correct identification but wrong counting)
    *********************************************************************
    */
    Trial.prototype.answer = function(_correct){

        if(_correct){
            this.correctImput++;
        }
    };


/*
-------------------------------------------------------------------------------------------------------------
                                        Global variables and functions
-------------------------------------------------------------------------------------------------------------
*/


// create the root of the scene graph and main classes
var stage = new PIXI.Container();
//var assets = new Assets();


this.destroy = function(){

    finishGame = true;
    session.hide()

}

function onAssetsLoaded(){
    
    session.show()
    round.init(Trial,stage)
    update();

}


//-------------------loading assets

    assets.addSprite("ladyBug_Walk",'sprites/ladyBug/ladyBug_Walk.json',4)
    assets.addSprite("ladyBug_fly",'sprites/ladyBug/ladyBug_fly.json',4)
    assets.addTexture("ladyBug_dead",'sprites/ladyBug/ladyBug_dead.png')
    assets.addTexture("bg",'sprites/backGrounds/BackGround-01.png')

    for (var i = 0; i < numbers.length; i++) {
      assets.addSound(Number(numbers[i].id),numbers[i].audio + '.mp3');
    }

    assets.load(onAssetsLoaded)

//---------------------------------------LOOP

var statsBol = false;

if(statsBol){

    session.stats.domElement.style.display = "block"

};

var finishGame = false
var previousTime = Date.now();
var MS_PER_UPDATE = 16.66667;
var lag = 0


function adjustGameDynamics() { // move inside game

  if(scoreDifferential >= 3) {

    scoreDifferential = 0;
    walkSpeed += 1;
    console.log('streaky-full speed ahead!');

  } else if(scoreDifferential <=- 3 & walkSpeed>2) {

    scoreDifferential = 0;
    walkSpeed -= 1;
    console.log('mistakes were made; slowing down');

  }

}

function update() {

    if(finishGame){

        console.log('finishGame - storing session!');
        storeSession();

        session.stats.domElement.style.display = "none"
        round.destroy();
        assets.destroy();
        finishGame = false;
        currentview = new Chooser(); // return assets??

        return
    }

    if(statsBol)session.stats.begin();

        //update position based on espectaed frame rate
        var current = Date.now();
        var elapsed = current - previousTime;
        previousTime = current;
        lag = lag + elapsed;

        while (lag >= MS_PER_UPDATE){

        // update the canvas with new parameters
          round.play(lag/MS_PER_UPDATE);
          adjustGameDynamics()

          lag = lag - MS_PER_UPDATE;
        }

        //---------------->> Thing that renders the whole stage
        session.render(stage)

        requestAnimationFrame(update);

    if(statsBol) session.stats.end()
}


}
