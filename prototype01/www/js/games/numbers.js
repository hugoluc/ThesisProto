var proto2loaded = false;

var LOGTHIS =  false;

function proto02(){
  var stimCount = store.get('numbers_problems_solved');
  if(!stimCount) stimCount = 0;
  var numFoils = store.get('numbers_ladybug_foils');
  if(!numFoils) numFoils = 1; // +1 if 2x correct; -1 if 2x incorrect
  var minFoils = 1;
  var maxFoils = 7;
  var walkSpeed = store.get("walkSpeed");
  if(!walkSpeed) walkSpeed = 3; // +1 if 1x correct; -1 if 1x incorrect
  var scoreIncrease = 1; // +1 every 10 trials
  var baseProbNoTargetNumber = 50; // increases with stimCount (less likely to show target number)
  logTime("counting",'start');
  var scoreDifferential = 0; // add 1 if correct, -1 if incorrect;
  // modify game dynamics if scoreDifferential reaches +2 or -2

  queuesToUpdate['numberstim'] = true;
  var stimuli = stimQueues['numberstim'];

  /*
  -------------------------------------------------------------------------------------------------------------
                                                Class: LadyBug
  -------------------------------------------------------------------------------------------------------------
  */

  function LadyBug(value){

      var _this = this;

      this.startNumber = value;
      this.container = new PIXI.Container();
      this.container.interactive = true;
      this.container.buttonMode = true;
      this.container.mousedown = this.container.touchstart = function(_event){ _this.click(_event); }
      this.container.pivot = {

          x: 0,
          y: 0,

      };

      this.counter = 0;
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
      this.sprite.fly.renderable = false
      this.sprite.fly.scale.x = 0.34;
      this.sprite.fly.scale.y = 0.34;
      this.container.addChild(this.sprite.fly);

      this.sprite.dead = new PIXI.Sprite(assets.textures.ladyBug_dead);
      this.sprite.dead.renderable = false;
      this.sprite.dead.scale.x = 0.34;
      this.sprite.dead.scale.y = 0.34;
      this.container.addChild(this.sprite.dead);

      this.sprite.nBg = new PIXI.Sprite(assets.textures.counter_red)
      this.sprite.nBg.alpha = 0.6
      this.sprite.nBg.anchor.x = 0.5
      this.sprite.nBg.anchor.y = 0.5
      this.sprite.nBg.scale.x = 0.9
      this.sprite.nBg.scale.y = 0.9
      this.sprite.nBg.x = this.sprite.walk.x + (this.sprite.walk.width*0.48)
      this.sprite.nBg.y = this.sprite.walk.y + (this.sprite.walk.height*0.55)
      this.container.addChild(this.sprite.nBg);

      //number variables
      this.number =  new PIXI.Text("12", {font:"32px Arial", fill:"#6defcc", stroke:"#6defcc", strokeThickness: 0});
      this.number.anchor.x = 0.5
      this.number.anchor.y = 0.5
      this.number.x = this.sprite.walk.x + (this.sprite.walk.width*0.5)// - (this.number.textWidth/2)
      this.number.y = this.sprite.walk.y + (this.sprite.walk.height*0.55) //- (this.number.textHeight/2)
      this.container.addChild(this.number)

      stage.addChild(this.container)

      //----------------------class variables
      this.timer = new ClockTimer();
      this.angle = 0;
      this.start = {};
      this.end = {};
      this.state = "walk";
      this.playQueue = [];
      this.customAnimation = new animation(this.container)

  };

  LadyBug.prototype.setFly = function(){

      var dest = {
          x:this.container.x,
          y:-this.container.height,
      }

      var distance = dest.y - this.container.y
      var length = Math.abs(distance/1)

      this.customAnimation.init(dest,length)
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

  LadyBug.prototype.setUp = function(_pos,_offset){

      if(_offset == undefined){_offset = 0}

      this.sprite.walk.play()
      this.sprite.walk.renderable = true

      this.sprite.fly.stop()
      this.sprite.fly.renderable = false;

      this.sprite.dead.renderable = false;

      this.state = "walk";
      this.number.text = this.startNumber;

      this.sprite.walk.animationSpeed = 1 / (2*walkSpeed+2); //.05*walkSpeed; // /Math.log(this.number.text+3);

      this.start.x = _pos;
      this.start.y = window.innerHeight
      this.end.x = getRandomInt(this.start.x - this.sprite.walk.width*2,this.start.x+this.sprite.walk.width*2);
      this.end.y = -this.sprite.walk.height;

      if(this.end.x > stage.width){

          this.end.x = stage.width;

      }else if(this.end.x < 10){

          this.end.x = 200;
      };

      this.container.rotation = getAngle(this.start.x,this.start.y,this.end.x,this.end.y);

      this.customAnimation.setPos(this.start);

      var distance = getDistance(this.start.x,this.start.y,this.end.x,this.end.y);

      var clickCount = Math.ceil(this.startNumber/this.bugType);
      //var diff = round.difficulty
      //var score = (5 + diff - clickCount)
      //var speedOut = (score*0.3/19) + 0.13
      // distance*10 = very slow, distance*3 is very fast
      if(clickCount > 10) { // super slow for large click counts
        var length = distance * clickCount;
      } else {
        var length = distance * (12 - walkSpeed);
      }
      _offset = _offset + getRandomInt(0,1800)

      this.customAnimation.init(this.end,length,_offset)
  };

  LadyBug.prototype.move = function(_state){

      if(this.state == "destroy"){
          return
      }

      if (_state != undefined){
          this.state = _state;
      };

      switch(this.state){

          case "walk":

              if(this.customAnimation.run()){

                  var i = getRandomInt(0,round.trial.availableSpots.length)
                  var xpos = round.trial.getSpotPos(i)
                  this.offscreen = true;
                  this.setUp(xpos);

              };

              break;

          case "fly":

              if(this.timer.timeOut()){

                  if(!this.Playsound){
                    correct_sound.play();
                    this.Playsound = true;
                  }

                  if(this.customAnimation.run()){
                      round.trial.correctInput = true;
                      round.trial.answer(true);
                  }

              };

              break;

          case "dead":

            if(this.timer.getElapsed() > 1200){

              this.sprite.dead.alpha =  this.sprite.dead.alpha - 0.05;

              if(this.timer.timeOut()){
                this.state = "walk";
                var i = getRandomInt(0,round.trial.availableSpots.length)
                var xpos = round.trial.getSpotPos(i)
                this.setUp(xpos);
                this.sprite.dead.alpha = 1;
                this.sprite.nBg.renderable = true;
                this.lastS = true;
              }

            }

            break;

          case "noReset":

              if(this.customAnimation.run()){
                  return true;
              }

              break;
      };

      return false;
  };

  LadyBug.prototype.forceFly = function(){

      this.sprite.walk.stop();
      this.sprite.walk.renderable = false;

      this.sprite.fly.play()
      this.sprite.fly.renderable = true;

      this.sprite.nBg.renderable = false;

      this.number.text = "";
      this.container.rotation = 0;
      this.container.ySpeed = 10;
      this.container.xSpeed = 0;
      this.container.interactive = false;
      this.sprite.walk.animationSpeed = 0;

      this.setFly()
  };

  LadyBug.prototype.click = function(_event){

      round.trial.clickPos = _event.data.global
      round.trial.total_clicks += 1;

      if(round.trial.state == "nextTrial"){
          return
      }

      var _this = this;

      // check if its correct
      if(this.startNumber == round.trial.origstim.id){

          //console.log(">>CLICK<<")

          if(this.number.text != 0){

            if(this.number.text - round.trial.bugType < 0){
              this.number.text = 0
            }else{
              this.number.text = (this.number.text - round.trial.bugType)
            }

          }else if(this.number.text == 0){
              this.number.text = -1
          }

          // flyes if it reaches 0
          if(this.number.text == 0) {

              this.number.text = ""
              this.sprite.walk.renderable = false;

              this.sprite.nBg.renderable = false;

              this.sprite.fly.play()
              this.sprite.fly.renderable = true;

              this.setFly()
              this.state = "fly"
              this.timer.start(550);

              round.trial.getFeedback(true,false)

              return

          // kills if it click one more time
          } else if(this.number.text < 0) {

              this.wrongClicks += 1;
              round.trial.answer(false);
              //round.changeDifficulty(false)
              round.trial.getFeedback(false,true);

              this.sprite.fly.stop();
              this.sprite.fly.renderable = false;
              this.sprite.walk.renderable = false;
              this.sprite.dead.renderable = true;
              this.number.text = ""
              this.state = "dead";
              this.timer.start(1500);

              return

              // get feedback regular correct click
              }else if (this.number.text > 0){
                  round.trial.getFeedback(true,false);
              };

            }else{ // wrong click

                if(!this.correctInput){
                    round.trial.wrongClicks += 1;
                    round.trial.answer(false);
                    //round.changeDifficulty(false);
                    if(walkSpeed > 2) walkSpeed -= 1;
                    round.trial.getFeedback(false,false);
                };
            };
        };

  LadyBug.prototype.resetFeedback = function(){

      if(this.offscreen){
          this.offscreen = false;
          return true
      }
  };

  /*
  -------------------------------------------------------------------------------------------------------------
                                                  Class: Trial
  -------------------------------------------------------------------------------------------------------------
  */

  function Trial(_stimuli){

    //_stimuli.id = 10
  this.starttime = Date.now()
  this.ladyBugs = [];
  this.origstim = _stimuli;
  this.correct = _stimuli.id;
  this.correctInput = false;
  this.answerGiven = false;
  this.correctSet = false;
  this.introState = "displaySound";
  this.nextTrialState = "flyAll";
  this.availableSpots = [];
  this.instructionWidth = session.canvas.height/8;  // size of the ciurcle for instruction
  this.goldCount = 0;
  this.soundCount = 0;
  this.goingUp = true;
  this.audioQueue = [];
  this.audioQueuePlay = false;
  this.playing = [];
  this.audioTimer = new ClockTimer();
  this.wrongClicks = 0; // # clicks on wrong ladybugs (or too many clicks)
  this.stimPlayed = false;
  this.total_clicks = 0; // total ladybug touches (good and bad)

  };

  Trial.prototype.intro = function(){

      switch(this.introState){

          case "displaySound":
              if(!this.stimPlayed) {
                //assets.sounds.numbers[this.correct].play();
                this.origstim.howl.play();
                this.stimPlayed = true;
              }

              if(this.trialTimer.timeOut()){

                  var dest = {};
                  dest.x = this.instructionWidth*1.2;
                  dest.y = session.canvas.height-(this.instructionWidth * 1.5);

                  this.instruction.customAnimation.init({x:dest.x,y:dest.y},1000,0,[0.25,0.00]);
                  this.introState = "moveToCorner";

                  //console.log("-----------------------------------------------------------")

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

  Trial.prototype.play = function(_updateTime){

      switch(this.trialState){

        case "intro":

            if(this.intro()){

                this.trialState = "play";
            };

            break;


        case "play":

            // the last in array is always the target bug
            if(this.ladyBugs[this.ladyBugs.length-1].resetFeedback()){
              this.getFeedback(true,true);
            };

            for (var i=0; i<this.ladyBugs.length; i++){
              this.ladyBugs[i].move();
            };


            if(this.correctInput){

                for (var i=0; i<this.ladyBugs.length; i++){ this.ladyBugs[i].forceFly() };

                if(this.correctAnswer){

                    //round.changeDifficulty(true);
                    var pos = [];
                    for (var i=0; i<scoreIncrease; i++) {
                      pos.push({ x: this.clickPos.x, y: this.clickPos.y});
                    }
                    score.addScore(pos, scoreIncrease);
                    score.setExplosion({ x: this.clickPos.x, y: this.clickPos.y},100,1000);

                } else {
                    var pos = [{ x: this.clickPos.x, y: this.clickPos.y}];
                    score.addScore(pos, 1);
                    score.setExplosion({ x: this.clickPos.x, y: this.clickPos.y},100,1000);
                }

                this.trialState = "nextTrial";
            }

            this.displayFeedbacks();
            this.playAudioQueue();

            break;

        case "nextTrial":

          var nextTrialDone = true;

          this.displayFeedbacks()
          if(!score.displayStar()) nextTrialDone = false;
          if(!score.displayExplosion()) nextTrialDone = false ;
          if(!this.nextTrial()) nextTrialDone = false;

          if(nextTrialDone){
            stimCount ++;
            store.set('numbers_problems_solved', stimCount);
            return true;
          }

          break;

        };

          return false
  };

  Trial.prototype.nextTrial = function(){

      switch(this.nextTrialState){

          case "flyAll":
              // wait until all ladybugs are off the screen.
              var done = true;
              for (var i=0; i<this.ladyBugs.length; i++){
                  if(!this.ladyBugs[i].move("noReset")){
                      done = false
                  };
              };

              if(done){

                  var dest = {}
                  dest.x = session.canvas.width/2
                  dest.y = session.canvas.height/2
                  this.instruction.customAnimation.init({x:dest.x,y:dest.y},1000)
                  this.nextTrialState = "moveToCenter"
              };

              break;

          case "moveToCenter":

              if(this.instruction.customAnimation.run()){
                  this.trialTimer.start(500)
                  this.nextTrialState = "callNextTrial"
              };

              break;

          case "callNextTrial":

              if(this.trialTimer.timeOut()){
                  return true;
              };

              break;

      };

      return false;
  };

  Trial.prototype.init = function(){

      this.foils = this.getFoils();
      this.foils = shuffle(this.foils);

      for (var i=0; i<this.foils.length; i++){
          var xpos = getRandomInt(20 + interval*i, interval*(i+1) - 20);
          this.ladyBugs.push(new LadyBug(this.foils[i]));
      }

      this.ladyBugs.push(new LadyBug(this.correct))

      //determine individual spots available based on the screen with and the bug width to position ladybugs
      // this will try to fit as much bugs as possible on the width of gthe sreen without overlaying them
      var interval = Math.floor((screen_width - this.instructionWidth*4.5) / this.ladyBugs[0].container.width);

      for(var i = 0; i<interval; i++){
          this.availableSpots.push(i);
      }

      // array with randon numbers up the the number of indivisual spots available
      this.availableSpots = shuffle(this.availableSpots)

      for(var i = 0; i<this.ladyBugs.length; i++){

          // get the position for the ladybug based on the possible individual spots available
          var posN = i%interval

          if(i > interval){
              // if the are more foils then spots available, off set the time of the animations start
              var offset = 200 * posN
          }

          // position of bug on screen based on available spot
          var xpos = this.getSpotPos(posN)

          this.ladyBugs[i].setUp(xpos,offset);

      }

      this.instruction = new PIXI.Container()
      this.instruction.customAnimation = new animation(this.instruction)

      this.trialTimer = new ClockTimer();

      this.createInstructions();

      this.trialTimer.start(1000);
      this.trialState = "intro";

      this.movetoCorner = false;

      this.instruction.customAnimation.setPos({x:session.canvas.width/2,y:session.canvas.height/2})
  };

  Trial.prototype.failTask = function(){
    this.fail = true;
  };

  Trial.prototype.getSpotPos = function(_i){
    return (this.availableSpots[_i] * this.ladyBugs[0].container.width) + this.instructionWidth*4;
  };

  Trial.prototype.storeStim = function(){
    logTrial({"starttime":this.starttime, "endtime":Date.now(), "stimtype":'count', "stim":this.origstim.id, "countBy":this.bugType, "total_clicks":this.total_clicks, "incorrect_clicks":this.wrongClicks});
    var rand_adjust = Math.random() * .1 - .05; // slight randomization to shuffle stim
    adjustGameDynamics(this.wrongClicks);
    if(this.wrongClicks < 2) {
      var newpriority = this.origstim.priority + .5;
    } else if(this.wrongClicks < 5) {
      var newpriority = this.origstim.priority - .1; //*Math.log(this.wrongClicks);
    } else {
      var newpriority = this.origstim.priority - .2;
    }
    this.origstim.priority = newpriority + rand_adjust;
    return(this.origstim);
  };

  Trial.prototype.chooseCountBy = function(goalNum, maxCountBy) {
    if(maxCountBy==1) {
      return 1;
    } else if(goalNum % maxCountBy == 0) {
      // it's divisible! choose this with > prob the larger the number
      if(goalNum > 20) var factor = .1;
      if((Math.random() + .02*goalNum) > .6) { // GK
        return maxCountBy;
      }
    }
    // try counting by 1 less
    return this.chooseCountBy(goalNum, maxCountBy-1);
  }

  Trial.prototype.createInstructions = function(){
    // if divisible by 10, do that with some probability
    // else: if divisible by 9, do that with some prob
    // else: if divisible by 8, do that with some probability
    if(this.correct==1) {
      this.bugType = 1;
    } else {
      this.bugType = this.chooseCountBy(this.correct, this.correct-1);
    }

      // if(this.correct < 10){
      //     this.bugType = 1;
      //     if(this.correct == 9){
      //       this.bugType = 3;
      //     }
      // } else if(this.correct < 21){
      //     if(this.correct == 15){
      //       this.bugType = 3;
      //     } else {
      //       this.bugType = 2;
      //     }
      // }else if(this.correct < 30) {
      //     this.bugType = 3;
      // } else{
      //     this.bugType = 4;
      // }
      // OLD:
      // Single bug: from 1 to 5
      // Double bug: form 6,7_,8,10,
      // Triple bugs: 9,11_,12,13_,14,15
      // 4bug: 16,_17,18,_19,20

      // NEW:
      // single: 1 to 9
      // by 2: 10 to 20

      //get Instruction available size

      //-------------------------------------------------------------bg BLUE
      this.bgBlue = new PIXI.Container();

      //blue bg for numbers
      this.nunBgBlue = new PIXI.Sprite(assets.textures.instructions_blue);
      this.nunBgBlue.anchor.x = 0.5;
      this.nunBgBlue.anchor.y = 0.5;
      this.nunBgBlue.width = this.instructionWidth*2;
      this.nunBgBlue.height = this.instructionWidth*2;
      this.bgBlue.addChild(this.nunBgBlue);

      this.countBgBlue = new PIXI.Sprite(assets.textures.instructions_blue);
      this.countBgBlue.anchor.x = 0.5;
      this.countBgBlue.anchor.y = 0.5;
      this.countBgBlue.width = this.instructionWidth*2.1;
      this.countBgBlue.height = this.instructionWidth*2.1;
      this.countBgBlue.x = this.instructionWidth;
      this.bgBlue.addChild(this.countBgBlue);

      this.bgBlue.customAnimation = new animation(this.bgBlue);
      this.instruction.addChild(this.bgBlue);

      //-------------------------------------------------------------bg RED
      this.bgRed = new PIXI.Container();

      //red bg for numbers
      this.nunBgRed = new PIXI.Sprite(assets.textures.instructions_red);
      this.nunBgRed.anchor.x = 0.5;
      this.nunBgRed.anchor.y = 0.5;
      this.nunBgRed.width = this.instructionWidth*2;
      this.nunBgRed.height = this.instructionWidth*2;
      this.bgRed.addChild(this.nunBgRed);

      this.countBgRed = new PIXI.Sprite(assets.textures.instructions_red);
      this.countBgRed.anchor.x = 0.5;
      this.countBgRed.anchor.y = 0.5;
      this.countBgRed.width = this.instructionWidth*2.1;
      this.countBgRed.height = this.instructionWidth*2.1;
      this.countBgRed.x = this.instructionWidth;
      this.bgRed.addChild(this.countBgRed);

      this.bgRed.customAnimation = new animation(this.bgRed);
      this.bgRed.renderable = false;
      this.bgRed.alpha = 0;
      this.instruction.addChild(this.bgRed);

      this.counter = {
          blue : [],
          red: [],
          gold: []
      };

      var MaxWidth = this.instructionWidth*2;
      var MaxHeight = this.instructionWidth*2.5;

      var width =  this.bugType + ((this.bugType-1)/3);
      var height = Math.ceil(this.correct/this.bugType) + ((Math.ceil(this.correct/this.bugType) - 1)/3 );

      var counterWidth = (MaxWidth / width) / 2;
      var counterHeight = (MaxHeight / height) / 2;
      var counterSize = [];

      if(this.correct == 1){
          var counterSize = counterWidth/2;
      }else{
          var counterSize = counterWidth < counterHeight ? counterWidth : counterHeight;
      }

      var counterMargin = counterSize/3;

      width = (this.bugType * counterSize) + (this.bugType-1 * counterMargin)

      var startY = (counterMargin/3) + (counterSize/2)-(Math.ceil(this.correct/this.bugType)*(counterSize + counterMargin))/2
      var startX = this.instructionWidth - (width/2) + (counterSize/2) - counterMargin/3

      for (key in this.counter){

          var column = 0
          var row = -1

          for(var i = 0; i < this.correct; i++){

              column = column%this.bugType;

              if(column == 0){row++}

              var name = "counter_" + key
              this.counter[key].push(new PIXI.Sprite(assets.textures[name]))
              this.counter[key][i].anchor.x = 0.5
              this.counter[key][i].anchor.y = 0.5

              this.counter[key][i].y = startY + (row * (counterSize+counterMargin) )
              this.counter[key][i].x = startX + (column*(counterSize + counterMargin))

              this.counter[key][i].width = counterSize;
              this.counter[key][i].height = counterSize;

              if(key == "blue"){
                  this.bgBlue.addChild(this.counter[key][i]);
              }else if(key == "red"){
                  this.bgRed.addChild(this.counter[key][i]);
              }else{
                  this.counter[key][i].renderable = false;
                  this.instruction.addChild(this.counter[key][i]);
              }

              column++;

          };

      };

      var fontSize = this.instructionWidth*0.8;

      this.rNumber =  new PIXI.Text(this.correct, {font: fontSize + "px Arial", weight:"Bold", fill:"#592c33", stroke:"#592c33", strokeThickness: 2, });
      this.rNumber.anchor.x = 0.5;
      this.rNumber.anchor.y = 0.5;
      this.bgRed.addChild(this.rNumber);

      this.bNumber =  new PIXI.Text(this.correct, {font: fontSize + "px Arial", weight:"Bold", fill:"#2c6875", stroke:"#2c6875", strokeThickness: 2, });
      this.bNumber.anchor.x = 0.5;
      this.bNumber.anchor.y = 0.5;
      this.bgBlue.addChild(this.bNumber);

      stage.addChild(this.instruction);

      // 0 -- 15
      // decrease probability of showing target number with > stimCount
      var threshold = baseProbNoTargetNumber + stimCount*2;
      var value = getRandomInt(0,100);

      if( value <= threshold ) { // && this.correct > 2
          this.rNumber.alpha = 0;
          this.bNumber.alpha = 0;
          this.nunBgBlue.alpha = 0;
          this.nunBgRed.alpha = 0;
      };
  };

  Trial.prototype.destroy = function(){

      for(var i=0; i<this.ladyBugs.length; i++){
        this.ladyBugs[i].destroy();
      };

      this.instruction.removeChildren(0,this.instruction.children.length);

      for (key in this.counter){
          for(var i = 0; i < this.correct; i++){
              this.counter[key][i].destroy();
          }
      }

      this.countBgBlue.destroy();
      this.countBgRed.destroy();
      this.nunBgBlue.destroy();
      this.nunBgRed.destroy();

      this.bNumber.destroy(true,true);
      this.rNumber.destroy(true,true);

      stage.removeChild(this.instruction);
      this.instruction.destroy(true,true);
  };

  Trial.prototype.getFoils = function(){

    // get numFoils foils that are within +/-3 of the target number
    var corNum = parseInt(this.correct);
    var min = corNum - 6;
    if(min < 0) min = 0;
    var foils = [];

    for (var i = 0; i < numFoils; i++) {
      var thisFoil = getRandomInt(min, corNum + 6);
      while (thisFoil == this.correct || thisFoil < 1){
         thisFoil = getRandomInt(min, corNum + 6);
      }
      foils.push(thisFoil);
    }

    return(foils);
    };

    Trial.prototype.getFeedback = function(_feedback,_reset){

    if(_reset){

      for(var i=0; i < this.counter.gold.length; i++){

         this.counter.gold[i].renderable = false
         this.counter.gold[i].alpha = 0
         this.counter.blue[i].renderable = true
      }

      if(!_feedback){

        incorrect_sound.play();
        this.playAudioQueue("stop");

        if(!this.redDone){

          this.feedbackState = "red";

          this.setBlink(false);
          this.bgRed.renderable = true;
          this.blinks = 0;

          this.feedback = false;
          this.redDone = false;
        }

       }

       this.goldCount = 0;
       this.soundCount = 0;
       this.goingUp = true;

    } else if(_feedback){ // provide feedback

       // set up audio queue for feedback
       this.playAudioQueue("add", [noteScale[this.soundCount]])

       if(this.goingUp) {
         this.soundCount++;
       } else {
         this.soundCount--;
       }
       if(this.soundCount==0) {
         this.goingUp = true;
       } else if(this.soundCount==4) {
         this.goingUp = false;
       }

       var lightUp = 0

       if(this.goldCount + this.bugType > this.correct){

           lightUp = this.correct - this.goldCount + this.goldCount

       }else{

           lightUp = this.bugType + this.goldCount

       }

       for(var i = this.goldCount; i < lightUp; i++){

           this.counter.gold[i].renderable = true
           this.counter.gold[i].alpha = 1
           this.counter.blue[i].renderable = false
           this.goldCount++

       }

    }else{

     incorrect_sound.play();

       if(!this.redDone){

           this.feedbackState = "red"

           this.setBlink(false)
           this.bgRed.renderable = true;
           this.blinks = 0

           this.feedback = false;
           this.redDone = false;

       }
    }
  };

  Trial.prototype.setBlink = function(_back){

      if(_back){

          this.bgBlue.customAnimation.initFeature("alpha",1,100,0,[0,1])
          this.bgRed.customAnimation.initFeature("alpha",0,100,0,[0,1])

          this.bgBlue.customAnimation.initFeature("alpha",1,100,0,[0,1])
          this.bgRed.customAnimation.initFeature("alpha",0,100,0,[0,1])


      }else{

          this.bgBlue.customAnimation.initFeature("alpha",0,100,0,[0,1])
          this.bgRed.customAnimation.initFeature("alpha",1,100,0,[0,1])

      }
  };

  Trial.prototype.displayFeedbacks = function(){
      //this is called every frame in the loop

      switch(this.feedbackState){

          case "red":

              var redDone = false
              var blueDone = false

              if(this.bgRed.customAnimation.runFeature()){ redDone = true}

              if(this.bgBlue.customAnimation.runFeature()){ blueDone = true}

              if(redDone && blueDone){

                  this.setBlink(true)
                  this.feedbackState = "blue"

              }

              break;


          case "blue":

              var redDone = false
              var blueDone = false

              if(this.bgRed.customAnimation.runFeature()){ redDone = true}

              if(this.bgBlue.customAnimation.runFeature()){ blueDone = true}

              if(redDone && blueDone){

                  this.blinks++

                  if(this.blinks < 1){


                      this.setBlink(false)
                      this.feedbackState = "red"

                  }else{

                      this.feedbackState = ""

                  }

              }

               break;

      };
  };

  Trial.prototype.playAudioQueue = function(_perform,_audio){

      if(_perform == "add"){

          this.audioQueue.push(_audio)

      }else if(_perform == "stop"){

          for(var i =0; i<this.playing.length; i++){

              this.playing[i].currentTime = 0
              this.playing[i].pause()

          }

          this.audioQueuePlay = false;
          this.playing = []
          this.audioQueue = []


      }else if (this.audioQueue.length > 0){
        // >1 clicked-but-not-yet-played sound in the Q
          if(!this.audioQueuePlay){

              for(var i =0; i<this.audioQueue[0].length; i++){
                  // this goes too high GK
                  this.playing.push(this.audioQueue[0][i])
                  this.audioQueue[0][i].play()
              }

              var time = 180;

              this.audioTimer.start(time);
              this.audioQueuePlay = true;

          }

          if(this.audioTimer.timeOut()){

              //remove item from array
              this.audioQueue.splice(0,1)

              //check if queue is empty
              if(this.audioQueue.length > 0){

                  for(var i = 0; i<this.audioQueue[0].length; i++){

                      this.audioQueue[0][i].currentTime = 0;
                      this.playing.push(this.audioQueue[0][i]);
                      this.audioQueue[0][i].play();

                  }

                  var time  = 180;
                  this.audioTimer.start(time);

              }else{

                  this.audioQueuePlay = false;

              }

              return

              if(this.audioQueue.length > 0 && this.audioQueue[0].paused){
                  this.audioQueue.splice(0,1);
                  this.audioQueue[0].currentTime = 0;
                  this.audioQueue[0].play();
                  this.audioTimer.start(180);
              }else{
                  this.audioQueuePlay = false;
              }

          }
      }
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

      if(!this.answerGiven){

          this.correctAnswer = _correct;
          this.answerGiven = true;

      };
  };

  /*
  -------------------------------------------------------------------------------------------------------------
                                          Global variables and functions
  -------------------------------------------------------------------------------------------------------------
  */

  // create the root of the scene graph and main classes
  var stage = new PIXI.Container();
  var round = new Round();
  score.stage = stage;

  this.destroy = function(){
      finishGame = true;
      session.hide();
  };

  function onAssetsLoaded(){

      session.show();
      round.init(Trial,stage,stimuli);

      var scoreRange = [-3,1]; // -3 = decrease difficulty, 3 = increase difficulty
      var difficultyRange = [0,15]; // 0=superSlow, 10=superfast
      round.setDifficultyParams(scoreRange,difficultyRange,5);

      session.render(stage);
      update();
  };

  //---------------------------------------loading assets

      assets.addSprite("ladyBug_Walk",'sprites/ladyBug/ladyBug_Walk.json',4);
      assets.addSprite("ladyBug_fly",'sprites/ladyBug/ladyBug_fly.json',4);

      assets.addTexture("counter_blue",'sprites/ladyBug/Instructions/counter_blue.png');
      assets.addTexture("counter_red",'sprites/ladyBug/Instructions/counter_red.png');
      assets.addTexture("counter_gold",'sprites/ladyBug/Instructions/counter_gold.png');
      assets.addTexture("instructions_blue",'sprites/ladyBug/Instructions/instructions_blue.png');
      assets.addTexture("instructions_red",'sprites/ladyBug/Instructions/instructions_red.png');

      assets.addTexture("ladyBug_dead",'sprites/ladyBug/ladyBug_dead.png');

      if(window.innerWidth < 1200){
          assets.addTexture("bg",'sprites/backGrounds/BackGround-01.png');
      }else{
          assets.addTexture("bg",'sprites/backGrounds/BackGround-01_2x.png');
      }

      // for (var i = 0; i < numbers.length; i++) {
      //   //assets.sounds.numbers
      //   assets.addSound(Number(numbers[i].id),numbers[i].audio + '.mp3');
      //
      // };

      // for (var i = 0; i < correctSounds.length; i++) {
      //
      //     for (var j = 0; j < correctSounds[i].length; j++) {
      //
      //         if(i == 0){
      //
      //             assets.addSound("correct1",correctSounds[i][j].audio + '.mp3');
      //
      //         }else{
      //
      //             assets.addSound("correct2",correctSounds[i][j].audio + '.mp3');
      //
      //         }
      //
      //     };
      // };

      //assets.addSound("wrong",'wrong.mp3');
      assets.load(onAssetsLoaded)

  //---------------------------------------LOOP


  var statsBol = true;

  if(statsBol){
      session.stats.domElement.style.display = "block"
  };

  var finishGame = false
  var previousTime = Date.now();
  var MS_PER_UPDATE = 16.66;
  var lag = 0

  function adjustGameDynamics(wrongClicks) {
    scoreIncrease = Math.ceil(stimCount / 10);
    if(wrongClicks < 2) {
      scoreDifferential += 1;
    } else {
      scoreDifferential -= 1;
    }
    if(scoreDifferential >= 1) {
      console.log("adjusting dynamics: harder");
      scoreDifferential = 0;
      if(walkSpeed < 9) walkSpeed += 1;
      if(numFoils < maxFoils) numFoils += 1;
    } else if(scoreDifferential <= 0) {
      console.log("adjusting dynamics: easier");
      scoreDifferential = 0;
      if(walkSpeed>2) walkSpeed -= 1;
      if(numFoils > minFoils) numFoils -= 1;
    }
    store.set('numbers_ladybug_foils', numFoils);
    store.set('walkSpeed', walkSpeed);
  };

  function update() {

    if(finishGame){
        logTime("counting",'stop');
        //console.log('counting game over - storing');
        //stimuli.push(this.trial.origstim); // GK: save current trial too
        console.log(round.trial.origstim);
        stimuli.push(round.trial.origstim);
        round.storeSession(stimuli, 'numberstim');
        session.stats.domElement.style.display = "none";
        round.destroy();
        assets.destroy();
        finishGame = false;
        session.render(stage);
        //console.log(">>>>>>>>",stimQueues['numberstim'])

        currentview = new MainMenu();
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

            lag = lag - MS_PER_UPDATE;

        }

        //---------------->> Thing that renders the whole stage
        session.render(stage)

        requestAnimationFrame(update);

    if(statsBol) session.stats.end()
  }

};
