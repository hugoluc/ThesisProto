
function proto02(){


//place fps elements 
var statsBol = false;
if(statsBol){
    stats = new Stats(); 
    document.body.appendChild( stats.domElement );
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = "0px";
    stats.domElement.style.zIndex = 10;
}

//crete canvas
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight-51);
var canvas = document.getElementById("container-exp").appendChild(renderer.view);
canvas.style.marginTop = "0px"

// create the root of the scene graph and main classes
var stage = new PIXI.Container();
var thisRound = new Round();
var assets = new Assets();

PIXI.loader
    .add('sprites/backGrounds/BackGround-01.png')
    .add('sprites/ladyBug/ladyBug_WalkV3.json')
    .add('sprites/ladyBug/ladyBug_fly.json')
    .add('sprites/ladyBug/ladtBug_flyStatic.png')
    .add('sprites/ladyBug/ladtBug_dead.png')
    .load(onAssetsLoaded);

function onAssetsLoaded(){
    assets.load()   
    thisRound.init()    
    update();
}

function update() {
    if(statsBol)stats.begin()


    renderer.render(stage);
    thisRound.play()
    // update the canvas with new parameters

//---------------->> Thing that renders the whole stage

    requestAnimationFrame(update);
    if(statsBol)stats.end()
}

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


            //**************************************************************************
            //change to foor loop using language file
            //*************************************************************************
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "zero" + '.mp3'))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "one" + '.mp3'))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "two" + '.mp3'))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "three" + '.mp3'))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "four" + '.mp3'))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "five" + '.mp3'))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "six" + '.mp3'))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "seven" + '.mp3'))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "eight" + '.mp3'))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "nine" + '.mp3'))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "ten" + '.mp3' ))


    }

/*
-------------------------------------------------------------------------------------------------------------
                                              Class: LadyBug
-------------------------------------------------------------------------------------------------------------
*/
    function LadyBug(){

        var _this = this


        // container variables
        this.container = new PIXI.Container()
        this.container.interactive = true
        this.container.buttonMode = true
        this.container.mousedown = this.container.touchstart = function(){ _this.click() }
        this.container.pivot = {
            x: 0,
            y: 0,
        }

        this.sprite = {}
    

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

    LadyBug.prototype.setUp = function(freeIds){

        this.sprite.walk.play();
        this.sprite.walk.alpha = 1;

        this.sprite.fly.stop()
        this.sprite.fly.alpha = 0;

        this.sprite.dead.alpha = 0;

        this.state = "walk";
        this.startNumber = getRandomInt(2,5); 
        this.number.text = this.startNumber;
        this.container.ySpeed = 8/this.number.text;
        this.sprite.walk.animationSpeed = 0.2/Math.sqrt(this.number.text);

        var moduleCount = window.innerWidth/this.sprite.walk.width 

        if(freeIds == undefined ){
            var moduleId = getRandomInt(0,Math.floor(moduleCount));
        }else{
            var moduleId = freeIds[getRandomInt(0,freeIds.length)];
        }

        this.start.x = moduleId * this.sprite.walk.width;
        this.start.y = window.innerHeight;
       
        this.end.x = getRandomInt(this.start.x-this.sprite.walk.width*2,this.start.x+this.sprite.walk.width*2); 
        this.end.y = -this.sprite.walk.height;
        if(this.end.x > stage.width){
            this.end.x = stage.width;
        }else if(this.end.x < 0){
            this.end.x = 0;
        };

        this.container.xSpeed = (this.start.x-this.end.x)/(this.start.y - this.end.y)
        if(this.start.x > this.end.x){ this.container.xSpeed*-1}


        this.container.rotation = getAngle(this.start.x,this.start.y,this.end.x,this.end.y)
        this.container.x = this.start.x;
        this.container.y = this.start.y;

        return moduleId;
    }

    LadyBug.prototype.move = function(){

        //console.log(this.container.y)
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
        
        };
    };

    LadyBug.prototype.click = function(){

        console.log("-------CLICK----------")


        var _this = this;
        // check if its corret
        if(this.startNumber == thisRound.trial.correct.value){

            console.log("click over:--",this.number.text)

            // // add feedback sound to the queue

            this.number.text--;
            thisRound.trial.answer();  

            // flyes if it reaches 0
            if(this.number.text == 0){

                this.number.text = ""        
                this.timer.start(300);
                this.state = "fly"
                this.container.ySpeed = 0;
                this.container.xSpeed = 0;
                this.sprite.walk.animationSpeed = 0;

            // kills if it click one more time    
            }else if(this.number.text < 0){

                this.sprite.fly.stop();
                this.sprite.fly.alpha = 0;
                this.sprite.dead.alpha = 1;
                this.sprite.renderable = true;
                this.number.text = ""
                this.container.ySpeed = 0;
                this.container.xSpeed = 0;
                this.timer.start(1500);
                this.state = "dead";

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
       
        stage.addChild(this.background);

    }


    /*
    ------
     Get next spects from the user queue
     *TO-DO: Replace values to queue values
    ------
    */

    Round.prototype.getNextTri = function(){

        var specs = {
            
            // This will be displayed to user
            stimuli : 
            {
                type: "sound",                              
                value: new Audio('audio/' + this.language + '/' + "three" + ".mp3"),
            },

            //This will the what the users needs to imput/select
            correct : 
            {
                type: "number",
                value: getRandomInt(2,4),
            }
        
        }

        return [specs.stimuli, specs.correct]

    }

    Round.prototype.play = function(){
        this.trial.play()
    }

    Round.prototype.init = function(){

        var specsthis = this.getNextTri();
        this.trial = new Trial(specsthis[0],specsthis[1]);
        this.trial.init();
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

        //this.stimuli.value.play()

    }


    Trial.prototype.playNext= function(){


        // console.log("-----------")

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

        // }else{

        //     var _this = this;
        //     console.log("-- queue full! -- ")
        //     console.log("--<", this.playQueue)
        //     assets.sounds[this.playQueue[0]].play()
        //     assets.sounds[this.playQueue[0]].playbackRate = 1.5

        // }

    }

    Trial.prototype.init = function(){

        this.UI = new PIXI.Container()
        
        this.circle = new PIXI.Graphics()
        this.circle.lineStyle(0);
        this.circle.beginFill(0x02d1aa);
        this.circle.drawCircle(canvas.width-40, canvas.height-40,150);
        this.circle.endFill();
        this.UI.addChild(this.circle);

        this.cNumber =  new PIXI.Text(thisRound.trial.correct.value, {font:"100px Arial", weight:"bold", fill:"#098478", stroke:"#098478", strokeThickness: 1, });
        this.cNumber.x = canvas.width-100
        this.cNumber.y = canvas.height-150
        this.UI.addChild(this.cNumber);
        stage.addChild(this.UI)

        for (var i=0; i<5; i++){

            this.ladyBugs.push(new LadyBug())
            this.ladyBugs[i].setUp()

        }

    }

    Trial.prototype.play = function(){

        /* 
        Check for the amout of correct imput
        necessery to move to new task
        */ 
        if(this.correctImput >= 1){
            for (var i=0; i<this.ladyBugs.length; i++){

                // this.ladyBugs[i].flyAll()

            }

            this.correct.value = getRandomInt(2,5)
            this.cNumber.text = this.correct.value
            this.correctImput = 0            

            //thisRound.init()
        }else{

            for (var i=0; i<this.ladyBugs.length; i++){

                this.ladyBugs[i].move()


            }
        }
    }

    /*
    *********************************************************************
    Handles the answer given by the user
    TRUE = answeras is exacly iqual to the aspected answerer
    other parameter could be passed to specify a partial ansewer
    like for exaple a smashed bug (correct identificantion but wrong counting)
    *********************************************************************
    */
    Trial.prototype.answer = function(_correct){

        if(_correct){
            this.correctImput++;
        }

    }

}



