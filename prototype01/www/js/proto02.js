var proto2loaded = false;
var scoreDifferential = 0; // add 1 if correct, -1 if incorrect;
// modify game dynamics if scoreDifferential reaches +3 or -3
var walkSpeed = 9; // +1 if 3x correct; -1 if 3x incorrect
var numFoils = 8; // +2 if 3x correct, -1 if 3x incorrect


function proto02(){

/*
-------------------------------------------------------------------------------------------------------------
                                               Class: Assets
-------------------------------------------------------------------------------------------------------------
*/
    function Assets(){
        this.sprites = {};
        this.sounds = [];
    }

    Assets.prototype.load = function(){

            // create an array of textures from an image path
            var frames = [];
            for (var i = 0; i < 4; i++) {
              var val = i < 10 ? '0' + i : i;
              // magically works since the spritesheet was loaded with the pixi loader
              frames.push(PIXI.Texture.fromFrame('ladyBug_Walk-0' + (i+1) + '.png'));
            }
            this.sprites.ladybugWalk = frames

            var frames = [];
            for (var i = 0; i < 4; i++) {
              var val = i < 10 ? '0' + i : i;
              // magically works since the spritesheet was loaded with the pixi loader
              frames.push(PIXI.Texture.fromFrame('ladtBug_fly-0' + (i+1) + '.png'));
            }
            this.sprites.ladybugFly = frames

            // load all number audio files
            for (var i = 0; i < numbers.length; i++) {
              this.sounds.push(new Audio('audio/' + language + '/' + numbers[i].audio + '.mp3'));
            }
            //this.sounds.push(new Audio('audio/' + 'english' + '/' + "zero" + '.mp3'))

    }

    Assets.prototype.destroy = function(){
        this.sprites = [];
        this.sounds = [];
    }

/*
-------------------------------------------------------------------------------------------------------------
                                              Class: LadyBug
-------------------------------------------------------------------------------------------------------------
*/
    function LadyBug(){

        var _this = this;

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
        this.sprite.walk = new PIXI.extras.MovieClip(assets.sprites.ladybugWalk);
        this.sprite.walk.animationSpeed = 0.1;
        this.sprite.walk.play();
        this.sprite.walk.scale.x = 0.34;
        this.sprite.walk.scale.y = 0.34;
        this.container.addChild(this.sprite.walk);

        this.sprite.fly = new PIXI.extras.MovieClip(assets.sprites.ladybugFly);
        this.sprite.fly.animationSpeed = 0.1;
        this.sprite.fly.alpha = 0;
        this.sprite.fly.scale.x = 0.34;
        this.sprite.fly.scale.y = 0.34;
        this.container.addChild(this.sprite.fly);

        this.sprite.dead = PIXI.Sprite.fromImage('sprites/ladyBug/ladtBug_dead.png');
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


    LadyBug.prototype.setUp = function(freeIds){

        this.sprite.walk.play();
        this.sprite.walk.alpha = 1;

        this.sprite.fly.stop()
        this.sprite.fly.alpha = 0;

        this.sprite.dead.alpha = 0;

        this.state = "walk";
        this.startNumber = getRandomInt(1,7); // GK: max should be the target
        this.number.text = this.startNumber;
        this.container.ySpeed = walkSpeed / Math.log(this.number.text+2); //8/this.number.text;
        this.sprite.walk.animationSpeed = .05*walkSpeed/Math.log(this.number.text+2);

        var moduleCount = window.innerWidth/this.sprite.walk.width;

        if(freeIds == undefined ){
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
        if(this.start.x > this.end.x){ this.container.xSpeed*-1}


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

                        thisRound.trial.answer(true)
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
        if(this.startNumber == thisRound.trial.correct.value){
            scoreDifferential += 1;

            //console.log("click over:--",this.number.text)

            this.number.text--;
            thisRound.trial.answer();

            // flyes if it reaches 0
            if(this.number.text == 0) {
              // play feedback sound
              correct_sound.play();
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
                                                Class: Round
-------------------------------------------------------------------------------------------------------------
*/
    function Round(){

        this.score = 0;
        this.language = "english"
        this.background = PIXI.Sprite.fromImage('sprites/backGrounds/BackGround-01.png');
        // this.background.height = canvas.height;

        stage.addChild(this.background);

    }

    /*
    ------
     Get next spects from the user queue
     *TO-DO: Replace values to queue values
    ------
    */

    Round.prototype.getNextTri = function(stim){
        var specs = {
            // This will be displayed to user
            stimuli :
            {
                type: "sound",
                value: new Audio('audio/' + this.language + '/' + stim.audio + ".mp3"),
            },
            //This will be what the users needs to input/select
            correct :
            {
                type: "number",
                value: stim.id //getRandomInt(2,4),
            }
        }

        return [specs.stimuli, specs.correct]
    }

    Round.prototype.play = function(_updateTime){
        this.trial.play(_updateTime)
    }

    Round.prototype.init = function(){
      queuesToUpdate['numberstim'] = true;
      stim = stimQueues['numberstim'].pop();
      var audstim = new Audio('audio/' + language + '/' + stim.audio + ".mp3")
      audstim.play()
      var specsthis = this.getNextTri(stim);
      this.trial = new Trial(specsthis[0],specsthis[1]); // then we recycle this trial...for now
      this.trial.init();
    }

    Round.prototype.destroy = function(){
        this.trial.destroy()
        stage.removeChild(this.background)
        this.background.destroy(true,true)
    }

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Trial
-------------------------------------------------------------------------------------------------------------
*/
    function Trial(_stimuli,_correct){
      this.ladyBugs = [];
      this.stimuli = _stimuli;
      this.correct = _correct;
      this.correctImput = 0;
      this.playQueue = []
      this.correctSet = false;
      //this.stimuli.value.play()
    }

    Trial.prototype.destroy = function(){
        for(var i=0; i<this.ladyBugs.length; i++){
          this.ladyBugs[i].destroy()
        }

        this.UI.removeChildren(0,this.UI.children.length)
        this.circle.destroy(true.true)
        this.cNumber.destroy(true,true)
        stage.removeChild(this.UI)
        this.UI.destroy(true,true)

    }

    Trial.prototype.playNext= function(){
        // console.log(assets.sounds[this.playQueue[0]].pause())
        // console.log("SONG ENDED")
        // console.log("--<", this.playQueue)
        // this.playQueue.splice(0, 1);

        // if(this.playQueue.length == 1){

        //     var _this = this;
        //     console.log("-- queue full! -- ")
        //     console.log("--<", this.playQueue)
        //     assets.sounds[this.playQueue[0]].play()
        //     assets.sounds[this.playQueue[0]].playbackRate = 1.5

        // } else {
        //     var _this = this;
        //     console.log("-- queue full! -- ")
        //     console.log("--<", this.playQueue)
        //     assets.sounds[this.playQueue[0]].play()
        //     assets.sounds[this.playQueue[0]].playbackRate = 1.5
        // }
    }

    Trial.prototype.init = function(){

      //interval = Math.floor(screen_width / self.objects.length);
      //for(var i=0; i<numFoils; i++) {
        //var xpos = getRandomInt(stim_diam+10 + interval*i, interval*(i+1) - stim_diam-10);
        for (var i=0; i<numFoils; i++){

            this.ladyBugs.push(new LadyBug())
            this.ladyBugs[i].setUp(i+2); //

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

        this.cNumber =  new PIXI.Text(thisRound.trial.correct.value, {font:"100px Arial", weight:"bold", fill:"#098478", stroke:"#098478", strokeThickness: 1, });
        this.cNumber.x = 50
        this.cNumber.y = session.canvas.height-120
        this.UI.addChild(this.cNumber);

        stage.addChild(this.UI)
        this.trialState = "play";
    }

    Trial.prototype.play = function(_updateTime){

        switch(this.trialState){

            case "play":
                for (var i=0; i<this.ladyBugs.length; i++){ this.ladyBugs[i].move() };
                correct_sound.play();
                if(this.correctImput >= 1){//------------------------------------------------------------------------------------------

                    for (var i=0; i<this.ladyBugs.length; i++){ this.ladyBugs[i].forceFly() };

                    this.trialState = "showNext"
                    this.showNextState = "flyall"

                }

                break;

            case "showNext":
                if(this.showNextNumber()){

                    this.correctImput = 0;
                    for (var i=0; i<this.ladyBugs.length; i++){ this.ladyBugs[i].state = "walk"  };
                    this.trialState = "play";

                };

                break;

            };
        };

    Trial.prototype.showNextNumber = function(){
      // GK somehwere here do the star + score
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
                    this.correct.value = this.stimuli.id;
                    this.cNumber.text = this.correct.value;
                    this.correctSet = true;
                    var audstim = new Audio('audio/' + language + '/' + this.stimuli.audio + ".mp3")
                    audstim.play()
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

//place fps elements
var statsBol = true;
if(statsBol){

    stats = new Stats();
    document.body.appendChild( stats.domElement );
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = "0px";
    stats.domElement.style.zIndex = 10;
}


// create the root of the scene graph and main classes
var stage = new PIXI.Container();
var thisRound = new Round();
var assets = new Assets();


this.destroy = function(){
    finishGame = true;
    session.hide()
}

function onAssetsLoaded(){
    assets.load()
    session.show()
    thisRound.init()
    update();
}

if(!proto2loaded){

    console.log("--------------------------------------");

    PIXI.loader
      .add('sprites/ladyBug/ladyBug_WalkV3.json')
      .add('sprites/ladyBug/ladyBug_fly.json')
      .add('sprites/ladyBug/ladtBug_flyStatic.png')
      .add('sprites/ladyBug/ladtBug_dead.png')
      .load(onAssetsLoaded);

    proto2loaded = true;

} else{

    onAssetsLoaded();

}

var finishGame = false
var previousTime = Date.now();
var MS_PER_UPDATE = 16.66667;
var lag = 0

function adjustGameDynamics() {
  if(scoreDifferential>=3) {
    scoreDifferential = 0;
    walkSpeed += 1;
    console.log('streaky-full speed ahead!');
  } else if(scoreDifferential<=-3 & walkSpeed>2) {
    scoreDifferential = 0;
    walkSpeed -= 1;
    console.log('mistakes were made; slowing down');
  }
}

function update() {

    if(finishGame){
        console.log('finishGame - storing session!');
        storeSession();
        thisRound.destroy();
        finishGame = false;
        currentview = new Chooser(assets);
    }

    if(statsBol) stats.begin();

    var current = Date.now();
    var elapsed = current - previousTime;
    previousTime = current;
    lag = lag + elapsed;

    while (lag >= MS_PER_UPDATE){
      thisRound.play(lag/MS_PER_UPDATE);
      adjustGameDynamics()
      lag = lag - MS_PER_UPDATE;
    }

    // update the canvas with new parameters
    //---------------->> Thing that renders the whole stage
    session.render(stage)

    requestAnimationFrame(update);

    if(statsBol) stats.end()
}


}
