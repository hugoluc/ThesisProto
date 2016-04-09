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
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.mousedown = this.container.touchstart = function(){ _this.click(); }
        this.container.pivot = {
            x: 0,
            y: 0,
        }

        this.sprite = {};

        // sprite variables

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
    };

    LadyBug.prototype.destroy = function(){

        stage.removeChild(this.container);
        this.container.removeChildren(0,this.container.length);
        this.sprite.walk.destroy(true);
        this.sprite.fly.destroy(true);
        this.sprite.dead.destroy();
        this.container.destroy(true);
        this.number.destroy(true);
        this.state = "destroy";

    };

    LadyBug.prototype.setUp = function(freeIds){

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
    };

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
    };

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
    };

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
      this.introState = "displaySound"
      this.nextTrialState = "flyAll"
    };


    Trial.prototype.init = function(){

        interval = Math.floor(screen_width / (numFoils + 1.0));
        this.foils = this.getFoils();
        this.foils.push(parseInt(this.correct)); // make sure we have the correct answer
        this.foils = shuffle(this.foils);

        for (var i=0; i<numFoils; i++){

            var xpos = getRandomInt(20 + interval*i, interval*(i+1) - 20);
            this.ladyBugs.push(new LadyBug(this.foils[i]));
            this.ladyBugs[i].setUp(); // i+2 ?? xpos ?

        }

        this.instruction = new PIXI.Container()
        this.instruction.customAnimation = new animation(this.instruction)

        this.trialTimer = new ClockTimer();

        this.circle = new PIXI.Graphics()
        this.circle.lineStyle(0);
        this.circle.beginFill(0x02d1aa);
        this.circle.drawCircle(0,0,100);
        this.circle.endFill();
       
        this.instruction.addChild(this.circle); 
        this.circle.x = session.canvas.width/2
        this.circle.y = session.canvas.height/2

        this.cNumber =  new PIXI.Text(this.correct, {font:"100px Arial", weight:"bold", fill:"#098478", stroke:"#098478", strokeThickness: 1, });
        this.cNumber.x = session.canvas.width/2 - this.cNumber.width/2
        this.cNumber.y = session.canvas.height/2 - this.cNumber.height/2
        this.instruction.addChild(this.cNumber);
        
        stage.addChild(this.instruction)

        this.trialTimer.start(1000);
        this.trialState = "intro";

        this.movetoCorner = false;
    };

    Trial.prototype.destroy = function(){

        for(var i=0; i<this.ladyBugs.length; i++){

          this.ladyBugs[i].destroy()

        }

        this.instruction.removeChildren(0,this.instruction.children.length)
        this.circle.destroy(true.true)
        this.cNumber.destroy(true,true)

        stage.removeChild(this.instruction)
        this.instruction.destroy(true,true)
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



    Trial.prototype.intro = function(){

        switch(this.introState){

            case "displaySound":

                assets.sounds.numbers[this.correct].play()
                
                if(this.trialTimer.timeOut()){

                    var dest = {}
                    dest.x = -30
                    dest.y = session.canvas.height-180
                    this.instruction.customAnimation.init({x:dest.x,y:dest.y},1000)
                    this.introState = "moveToCorner"

                }


                break;


            case "moveToCorner":


                    if(this.instruction.customAnimation.run()){

                        return true;                  

                    }

                break;

        }

        return false;
    };

    Trial.prototype.nextTrial = function(){
        
        console.log(this.nextTrialState)

        switch(this.nextTrialState){

            case "flyAll":

                // wait until all ladybugs are off the screen.
                var done = true;

                for (var i=0; i<this.ladyBugs.length; i++){

                    if(!this.ladyBugs[i].checkOutOfScreen()){

                        done = false

                    }

                    this.ladyBugs[i].move("noReset")

                };

                if(done){

                    var dest = {}
                    dest.x = (session.canvas.width/2)-100// - (this.circle.width/2)
                    dest.y = (session.canvas.height/2)-100// - (this.circle.height/2)
                    this.instruction.customAnimation.init({x:dest.x,y:dest.y},1000)
                    this.nextTrialState = "moveToCenter"

                };

                break;

            case "moveToCenter":

                if(this.instruction.customAnimation.run()){

                    this.trialTimer.start(500)
                    this.nextTrialState = "callNextTrial"

                }

                break;


            case "callNextTrial":

                if(this.trialTimer.timeOut()){

                    return true;
                }


                break;
        
        }
        
        return false;

    };

    Trial.prototype.play = function(_updateTime){

        switch(this.trialState){

            case "intro":

                if(this.intro()){

                    this.trialState = "play";  
                }

                break;


            case "play":

                for (var i=0; i<this.ladyBugs.length; i++){

                  this.ladyBugs[i].move()

                };

                if(this.correctImput >= 1){

                    for (var i=0; i<this.ladyBugs.length; i++){ this.ladyBugs[i].forceFly() };

                    this.trialState = "nextTrial"

                }

                break;

            case "nextTrial":

                if(this.nextTrial()){
                    return true
                }

                break;

            };

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
var round = new Round();

this.destroy = function(){

    finishGame = true;
    session.hide()

}

function onAssetsLoaded(){
    
    session.show()
    round.init(Trial,stage)
    session.render(stage)
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
          //adjustGameDynamics()

          lag = lag - MS_PER_UPDATE;
        }

        //---------------->> Thing that renders the whole stage
        session.render(stage)

        requestAnimationFrame(update);

    if(statsBol) session.stats.end()
}


}
