    var proto2loaded = false;

    var scoreDifferential = 0; // add 1 if correct, -1 if incorrect;
    // modify game dynamics if scoreDifferential reaches +3 or -3
    var walkSpeed = 8; // +1 if 3x correct; -1 if 3x incorrect
    var numFoils = 3; // +2 if 3x correct, -1 if 3x incorrect

    var LOGTHIS =  false;

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

            this.counter = 0
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
            this.sprite.walk.animationSpeed = .05*walkSpeed/Math.log(this.number.text+4);

            this.start.x = _pos;
            this.start.y = window.innerHeight;

            this.end.x = getRandomInt(this.start.x - this.sprite.walk.width*2,this.start.x+this.sprite.walk.width*2);
            this.end.y = -this.sprite.walk.height;
            
            if(this.end.x > stage.width){
              
                this.end.x = stage.width;
            
            }else if(this.end.x < 10){
              
                this.end.x = 200;
            };


            this.container.rotation = getAngle(this.start.x,this.start.y,this.end.x,this.end.y)
           
            this.customAnimation.setPos(this.start)

            speed = (this.startNumber * 1000) + 1400 // IMPROVE THIS!!!!
            this.customAnimation.init(this.end,speed,_offset)
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

                            round.trial.answer(true)

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
                            this.sprite.dead.alpha = 1
                            this.lastS = true
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

            this.number.text = "";
            this.container.rotation = 0;
            this.container.ySpeed = 10;
            this.container.xSpeed = 0;
            this.container.interactive = false;
            this.sprite.walk.animationSpeed = 0;

            this.setFly()
        };

        LadyBug.prototype.click = function(){

            var _this = this;

            // check if its correct
            if(this.startNumber == round.trial.stimuli.id){


                console.log(">>CLICK<<")
                console.log(this.number.text - 100)


                if(this.number.text != 0){

                    if(this.number.text - round.trial.bugType < 0){

                       this.number.text = 0

                    }else{

                       this.number.text = (this.number.text - round.trial.bugType)

                    }


                }else if(this.number.text == 0){

                    this.number.text = -1
                }

                console.log(this.number.text)

                // flyes if it reaches 0
                if(this.number.text == 0) {

                    // play feedback sound
                    this.number.text = ""
                    this.sprite.walk.renderable = false;

                    this.sprite.fly.play()
                    this.sprite.fly.renderable = true;

                    this.setFly()
                    this.state = "fly"
                    this.timer.start(550);

                    round.trial.getFeedback(true,false)  

                    return

                // kills if it click one more time
                } else if(this.number.text < 0) {

                    round.trial.getFeedback(false,true)

                    this.sprite.fly.stop();
                    this.sprite.fly.renderable = false;
                    this.sprite.walk.renderable = false;
                    this.sprite.dead.renderable = true;
                    this.number.text = ""
                    this.state = "dead";
                    this.timer.start(1500);

                    return

                // regular click
                }else if (this.number.text > 0){

                    round.trial.getFeedback(true,false) 

                };

            }else {

               round.trial.getFeedback(false,false) 
            }
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

            this.ladyBugs = [];
            this.stimuli = _stimuli;
            this.correct = _stimuli.id;
            this.correctImput = 0;
            this.playQueue = [];
            this.correctSet = false;
            this.introState = "displaySound";
            this.nextTrialState = "flyAll";
            this.availableSpots = [];
            this.instructionWidth = 100;  // size of the ciurcle for instruction
            this.goldCount = 0
        };

        Trial.prototype.init = function(){


            this.foils = this.getFoils();
           // this.foils.push(parseInt(this.correct)); // make sure we have the correct answer
           

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

                this.availableSpots.push(i)

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

            this.instructionWidth = 100;  // size of the ciurcle for instruction
            this.createInstructions();

            this.trialTimer.start(1000);
            this.trialState = "intro";

            this.movetoCorner = false;

            this.instruction.customAnimation.setPos({x:session.canvas.width/2,y:session.canvas.height/2})

           // assets.sounds.numbers[this.correct].play()
        };

        Trial.prototype.getSpotPos = function(_i){

            return (this.availableSpots[_i] * this.ladyBugs[0].container.width) + this.instructionWidth*4
        };

        Trial.prototype.createInstructions = function(){


            if(this.correct < 6){

                this.bugType = 1

            }else if(this.correct < 11){

                if(this.correct == 9){

                    this.bugType = 3

                }else{

                this.bugType = 2

                }


            }else if(this.correct < 16) {

                this.bugType = 3


            }else{

                this.bugType = 4

            }

            // Single bug: from 1 to 5
            // Double bug: form 6,7_,8,10,
            // Triple bugs: 9,11_,12,13_,14,15
            // 4bug: 16,_17,18,_19,20


            //get Instruction available size
            this.instructionWidth = 100;  // size of the ciurcle for instruction



            //-------------------------------------------------------------bg BLUE
            this.bgBlue = new PIXI.Container()

            console.log(this.bgBlue)
            //blue bg for numbers
            this.nunBgBlue = new PIXI.Sprite(assets.textures.instructions_blue)
            this.nunBgBlue.anchor.x = 0.5
            this.nunBgBlue.anchor.y = 0.5
            this.nunBgBlue.width = this.instructionWidth*2
            this.nunBgBlue.height = this.instructionWidth*2
            this.bgBlue.addChild(this.nunBgBlue)

            this.countBgBlue = new PIXI.Sprite(assets.textures.instructions_blue)
            this.countBgBlue.anchor.x = 0.5
            this.countBgBlue.anchor.y = 0.5
            this.countBgBlue.width = this.instructionWidth*3
            this.countBgBlue.height = this.instructionWidth*3
            this.countBgBlue.x = this.instructionWidth
            this.bgBlue.addChild(this.countBgBlue)

            this.bgBlue.customAnimation = new animation(this.bgBlue)
            this.instruction.addChild(this.bgBlue)

            //-------------------------------------------------------------bg RED
            this.bgRed = new PIXI.Container()

            //red bg for numbers
            this.nunBgRed = new PIXI.Sprite(assets.textures.instructions_red)
            this.nunBgRed.anchor.x = 0.5
            this.nunBgRed.anchor.y = 0.5
            this.nunBgRed.width = this.instructionWidth*2
            this.nunBgRed.height = this.instructionWidth*2
            this.bgRed.addChild(this.nunBgRed)

            this.countBgRed = new PIXI.Sprite(assets.textures.instructions_red)
            this.countBgRed.anchor.x = 0.5
            this.countBgRed.anchor.y = 0.5
            this.countBgRed.width = this.instructionWidth*3
            this.countBgRed.height = this.instructionWidth*3
            this.countBgRed.x = this.instructionWidth
            this.bgRed.addChild(this.countBgRed)

            this.bgRed.customAnimation = new animation(this.bgRed)
            this.bgRed.renderable = false;
            this.bgRed.alpha = 0
            this.instruction.addChild(this.bgRed)

        
            this.counter = {

                blue : [],
                red: [],
                gold: []

            }

            var counterWidth = 30; // make it as big as possible!!
            var counterMargin = 10


            var startY = (counterWidth/2)-(Math.ceil(this.correct/this.bugType)*(counterWidth + counterMargin))/2
            var startX = this.instructionWidth

            for (key in this.counter){
                
                var column = 0
                var row = -1

                for(var i = 0; i < this.correct; i++){

                    column = column%this.bugType

                    if(column == 0){row++}

                    var name = "counter_" + key
                    this.counter[key].push(new PIXI.Sprite(assets.textures[name]))
                    this.counter[key][i].anchor.x = 0.5
                    this.counter[key][i].anchor.y = 0.5
                
                    this.counter[key][i].y = startY + (row * (counterWidth+counterMargin) )
                    this.counter[key][i].x = startX + (column*(counterWidth + counterMargin))                 

                    this.counter[key][i].width = counterWidth
                    this.counter[key][i].height = counterWidth

                    if(key == "blue"){

                        this.counter[key][i].renderable = true

                    }else{

                        this.counter[key][i].renderable = false

                    }

                    this.instruction.addChild(this.counter[key][i])

                    column++ 

                };

            };


            this.cNumber =  new PIXI.Text(this.correct, {font:"80px Arial", weight:"Bold", fill:"#2c6875", stroke:"#098478", strokeThickness: 1, });
            this.cNumber.x = -this.instructionWidth/2 + 20
            this.cNumber.y = -this.instructionWidth/2
            this.instruction.addChild(this.cNumber);

            stage.addChild(this.instruction)
        };

        Trial.prototype.destroy = function(){

            for(var i=0; i<this.ladyBugs.length; i++){

              this.ladyBugs[i].destroy()

            };

            this.instruction.removeChildren(0,this.instruction.children.length)

            for (key in this.counter){
                
                for(var i = 0; i < this.correct; i++){

                    this.counter[key][i].destroy()

                }
            }

            this.countBgBlue.destroy()
            this.countBgRed.destroy()
            this.nunBgBlue.destroy()
            this.nunBgRed.destroy()

            this.cNumber.destroy(true,true)


            stage.removeChild(this.instruction)
            this.instruction.destroy(true,true)
        };

        Trial.prototype.getFoils = function() {

          // get numFoils foils that are within +/-3 of the target number
          var corNum = parseInt(this.correct)
          var min = corNum - 3;
          var foils = [];

          for (var i = 0; i < numFoils; i++) {


             var thisFoil = getRandomInt(min, corNum + 3)

             while (thisFoil == this.correct || thisFoil < 1){

                thisFoil = getRandomInt(min, corNum + 3)

             }

            foils.push(thisFoil);

          }


            //  foils = [1,2,3]

          return(foils);
        };

        Trial.prototype.getFeedback = function(_feedback,_reset){

            if(_reset){
                
                for(var i=0; i < this.counter.gold.length; i++){

                    this.counter.gold[i].renderable = false
                    this.counter.gold[i].alpha = 0
                    this.counter.blue[i].renderable = true

                }

                this.goldCount = 0
            
            } else if(_feedback){

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

                this.bgBlue.customAnimation.initFeature("alpha",1,200,0,[0,1])
                this.bgRed.customAnimation.initFeature("alpha",0,200,0,[0,1])

            }else{

                this.bgBlue.customAnimation.initFeature("alpha",0,200,0,[0,1])
                this.bgRed.customAnimation.initFeature("alpha",1,200,0,[0,1])

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

                        console.log("red")

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


                case "positieve":
                        



                        break;



            };

        };
        
        Trial.prototype.intro = function(){

            switch(this.introState){

                case "displaySound":
                    
                    if(this.trialTimer.timeOut()){

                        var dest = {}
                        dest.x = this.instructionWidth*1.2
                        dest.y = session.canvas.height-(this.instructionWidth * 1.5)

                        this.instruction.customAnimation.init({x:dest.x,y:dest.y},1000,0,[0.75,1])

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

        Trial.prototype.play = function(_updateTime){


            switch(this.trialState){

                case "intro":

                    if(this.intro()){

                        this.trialState = "play";  
                    }

                    break;


                case "play":

                    if(this.ladyBugs[this.ladyBugs.length-1].resetFeedback()){
                        this.getFeedback(false,true)
                    }

                    this.displayFeedbacks()

                    for (var i=0; i<this.ladyBugs.length; i++){

                      this.ladyBugs[i].move()

                    };


                    if(this.correctImput > 1){

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

        Trial.prototype.nextTrial = function(){
            
            switch(this.nextTrialState){

                case "flyAll":

                    // wait until all ladybugs are off the screen.
                    var done = true;

                    for (var i=0; i<this.ladyBugs.length; i++){

                        if(!this.ladyBugs[i].move("noReset")){

                            done = false

                        }

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

            assets.addTexture("counter_blue",'sprites/ladyBug/Instructions/counter_blue.png')
            assets.addTexture("counter_red",'sprites/ladyBug/Instructions/counter_red.png')
            assets.addTexture("counter_gold",'sprites/ladyBug/Instructions/counter_gold.png')
            assets.addTexture("instructions_blue",'sprites/ladyBug/Instructions/instructions_blue.png')
            assets.addTexture("instructions_red",'sprites/ladyBug/Instructions/instructions_red.png')


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

          } else if(scoreDifferential <=- 3 & walkSpeed>2) {

            scoreDifferential = 0;
            walkSpeed -= 1;

          }
        };

        function update() {

            if(finishGame){

                console.log('finishGame - storing session!');
                storeSession();

                session.stats.domElement.style.display = "none"
                round.destroy();
                assets.destroy();
                finishGame = false;
                session.render(stage)

                console.log(">>>>>>>>",stimQueues['numberstim'])

                currentview = new Chooser();


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

};
