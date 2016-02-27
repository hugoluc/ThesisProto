
function proto02(){


//place fps elements 
var statsBol = true;
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
    .add('sprites/ladyBug/ladyBug_Walk.json')
    .load(onAssetsLoaded);

function onAssetsLoaded(){
    assets.load()   
    thisRound.init()    
    update();
}

function update() {
    if(statsBol)stats.begin()


    thisRound.play()
    // update the canvas with new parameters
    renderer.render(stage);//---------------->> Thing that renders the whole stage
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


            //**************************************************************************
            //change to foor loop using language file
            //*************************************************************************
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "zero" + '.mp3' ))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "one" + '.mp3' ))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "two" + '.mp3' ))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "three" + '.mp3' ))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "four" + '.mp3' ))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "six" + '.mp3' ))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "seven" + '.mp3' ))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "eight" + '.mp3' ))
            this.sounds.push(new Audio('audio/' + 'english' + '/' + "nine" + '.mp3' ))
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

        // sprite variables
        this.sprite = new PIXI.extras.MovieClip(assets.sprites.ladybugWalk);
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
        this.sprite.scale.x = 1;
        this.sprite.scale.y = 1;    
        this.container.addChild(this.sprite);

        //number variables
        this.number =  new PIXI.Text("12", {font:"30px Arial", fill:"blue", stroke:"green", strokeThickness: 3, });
        this.number.x = this.sprite.x + (this.sprite.width/2) - this.number.width/2
        this.number.y = this.sprite.y + (this.sprite.height/2) - this.number.height/2
        this.container.addChild(this.number)

        stage.addChild(this.container)


        //----------------------class variables
        this.timer = new ClockTimer();
        this.angle = 0;
        this.start = {};
        this.end = {};
        this.waiting = false;
    };

    LadyBug.prototype.setUp = function(freeIds){

        // reset 
        this.waiting = false;
        this.correctAnswear = getRandomInt(2,5); 
        this.number.text = this.correctAnswear;
        this.container.ySpeed = 8/this.number.text;
        this.sprite.animationSpeed = 0.2/Math.sqrt(this.number.text);

        var moduleCount = window.innerWidth/this.sprite.width 
        //console.log(Math.floor(moduleCount))

        if(freeIds == undefined ){
            var moduleId = getRandomInt(0,Math.floor(moduleCount));
        }else{
            var moduleId = freeIds[getRandomInt(0,freeIds.length)];
        }

        this.start.x = moduleId * this.sprite.width;
        this.start.y = window.innerHeight;
       
        this.end.x = getRandomInt(this.start.x-this.sprite.width*2,this.start.x+this.sprite.width*2); 
        this.end.y = -this.sprite.height;
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

        if(this.waiting){
            
            if(this.timer.timeOut()){

                this.container.ySpeed = 10

            };
        
        }

        if(this.container.y  < this.end.y){

            this.container.y = this.start.y;
            this.setUp();

        }
    };


    LadyBug.prototype.click = function(){

        //console.log(this.number.text,thisRound.trial.correct.value)

        // check if its corret
        if(this.correctAnswear == thisRound.trial.correct.value){
        
            this.number.text--;
            //console.log("true")
            thisRound.trial.answer();  

            if(this.number.text == 0){
        
                this.timer.start(300);
                this.waiting = true
                this.container.ySpeed = 0;
                this.container.xSpeed = 0;
                this.sprite.animationSpeed = 0;
                
            }else if(this.number.text < 0){

                this.waiting = false;

            };

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
                value: 3,
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
        this.corrects = 0;

        //this.stimuli.value.play()

    }

    Trial.prototype.init = function(){

        for (var i=0; i<5; i++){

            this.ladyBugs.push(new LadyBug())
            this.ladyBugs[i].setUp()

        }

    }

    Trial.prototype.play = function(){

        for (var i=0; i<this.ladyBugs.length; i++){

            this.ladyBugs[i].move()

        }

    }


    Trial.prototype.answer = function(_correct){

        this.corrects = _correct;

    }

}