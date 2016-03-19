var proto3loaded = false

function proto03(){

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
                

    }

    Assets.prototype.destroy = function(){
    
        this.sprites = []
        this.sounds = []

    }

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: lillyFinal
-------------------------------------------------------------------------------------------------------------
*/

function lillyFinal(){

    this.specs = {}
    this.specs.size = 120
    this.specs.x = session.canvas.width-100;
    this.specs.y = session.canvas.height/2;
    this.conections = []

}


lillyFinal.prototype.init = function(_value){

        this.value = _value
        this.lillypad = new PIXI.Graphics()
        this.lillypad.lineStyle(0);
        this.lillypad.beginFill(0x02d1aa);
        this.lillypad.drawCircle(0,0,this.specs.size);
        this.lillypad.endFill();
        stage.addChild(this.lillypad)
        this.lillypad.x = this.specs.x
        this.lillypad.y = this.specs.y

        this.cNumber =  new PIXI.Text(this.value, {font:"100px Arial", weight:"black", fill:"#098478", stroke:"#098478", strokeThickness: 1, });
        this.cNumber.x = this.lillypad.x - (this.specs.size/2)
        this.cNumber.y = this.lillypad.y - (this.specs.size/2)

        stage.addChild(this.cNumber)

}

lillyFinal.prototype.display = function(_currentValue){

	// animate lillypad
	//check how many ants are conected and chanche aperance

}


/*
-------------------------------------------------------------------------------------------------------------
                                                Class: lillySmall
-------------------------------------------------------------------------------------------------------------
*/


    function lillySmall(_trial){

    	this.trial = _trial
    	this.selected = true
    	this.valueObjects = []

    }


    lillySmall.prototype.init = function(_value,_position,_size,_id){

    	var _this = this;

        this.value = _value
    	this.id = _id;
    	this.connections = [];
    	this.value = _value;
    	this.posdId = _position.id
    	this.pos = _position.pos;
    	this.size = _size; 


    	if(_value > 0){

    		//draw ents
    		for(var i=0; i<_value; i++){
    			this.valueObjects.push("ents")			
    		}

    	}else{

    		//draw ents
    		for(var i=0; i<_value; i++){
    			this.valueObjects.push("ents")			
    		}

    	}

        this.container = new PIXI.Container()
        this.trialTimer = new ClockTimer();

        this.circle = new PIXI.Graphics()
        this.circle.lineStyle(0);
        this.circle.beginFill(0x02d1aa);
        this.circle.drawCircle(0,0,this.size/2);
        this.circle.endFill();
        this.circle.interactive = true;
        this.circle.buttonMode = true;

    	this.circle
    		//touchstart
    		.on('mousedown', click)
            .on('touchstart', click)    
            //touch ende
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

        this.cNumber =  new PIXI.Text(this.value, {font:"100px Arial", weight:"black", fill:"#098478", stroke:"#098478", strokeThickness: 1, });
        this.cNumber.x = this.pos.x + this.size/4;
        this.cNumber.y = this.pos.y
        this.container.addChild(this.cNumber);

        stage.addChild(this.container)
    	//create images
    	//position
    	//create number
    	//

    };

    lillySmall.prototype.clickStart = function(_this,_event){


        /***********************************
        
        FIX THIS! 
        CHECK TO SEE IF THE FIRST POINT ON CLICK IS OVER THE ACTUAL CIRCLE
        IN ORDER TO PREVENDE CREATION OF STICKS OUTSITE THE LILLYPAD!

        ************************************/

    	//change lillypad to selected
    	_this.data = _event.data;
        _this.dragging = true;
    };

    lillySmall.prototype.clickEnd = function(_this){

    	//change lillypad to selected

    	if(!this.dragging) return

        _this.dragging = false;
        this.dragging = false;

        this.trial.CheckLink(_this.data.getLocalPosition(_this.parent),this.id)
    };

    lillySmall.prototype.drag = function(_this){

    	//change lillypad to selected
    	if(_this.dragging){

    		if(!this.dragging){
    			this.stick = this.trial.createStick(_this.data.getLocalPosition(_this.parent));
    			this.dragging = true;
    		};

    		this.trial.moveStick(_this.data.getLocalPosition(_this.parent))

    	};
    };

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Trial
-------------------------------------------------------------------------------------------------------------
*/

    function Trial(_stimuli,_correct){
		
		/*----------------------
		Stimuli is the number necessery to get to the answear.
		It should be used to draw smaller lillypad so the user has at least one
		way to solve the problem	
		------------------------*/
    	this.stimuli = _stimuli

		/*----------------------
		Correct is the final number that should be placed in the final lillypad	
		------------------------*/
    	this.correct = _correct

    	this.sticks = []

    	this.trialState = "play"
        this.lillySmall = [];
        this.lillyFinal = new lillyFinal();
        this.matrixAvailable = []
        this.specs = this.getSpecs()
        this.posMatrix = this.getMatrixPosition()
        this.operation = 0
        this.fadeStick = false;
    }

    Trial.prototype.init = function(){


        this.lillyFinal.init(this.correct.value)

        var lilipadValues = this.stimuli.correctValues

        for (var i=0; i<this.stimuli.extras.size; i++){     

            lilipadValues.push(getRandomInt(this.stimuli.extras.min,this.stimuli.extras.max))
        
        }
        

        if(lilipadValues.length > this.posMatrix.length){
        
            throw "SCREEN TOO SMALL!"
        
        }

        for (var i=0; i<lilipadValues.length; i++){

            var pos = getRandomInt(0,this.posMatrix.length) 
            this.lillySmall.push(new lillySmall(this))
            this.lillySmall[i].init(lilipadValues[i],this.getPos(i),this.specs.lillyWidth,i)

        }

        this.stick = new PIXI.Graphics()
        this.stick.lineStyle(0);
        this.stick.beginFill(0x996630);
        this.stick.drawRect(0,0,1,10);
        this.stick.endFill();
        stage.addChild(this.stick);
    
    }

    //creates links between lillypads if allowed
	Trial.prototype.CheckLink = function(_dropPoint,_id){

        var conected = false;

        if(this.lillyFinal.lillypad.containsPoint(_dropPoint)){

            console.log("END!")
            this.updateOperation(_id,"final")
            return

        }

        //check which lillypad the stick was droped over
        for(var i=0; i<this.lillySmall.length; i++){

            if(this.lillySmall[i].circle.containsPoint(_dropPoint)){ 

                if(i == _id){
                    this.stick.alpha = 0
                    return  
                } 

                console.log("DROPED OVER: " + i)
                conected = true

                this.updateOperation(_id,i)

                return;    

            }

        }

        if(conected){

            this.removeStick()

        }else{

            this.stick.alpha = 0
        }
    	
    }


    Trial.prototype.updateOperation = function(_origin,_target){

        if(_target == "final"){

            //this.countdown(_origin,target)
            //this.animateAnts(_origin,target)

            this.lillySmall[_origin].cNumber.text = 0;
            this.lillySmall[_origin].value = 0;
            this.fadeStick = true;
            //this.removeStick();

        }else{

            var sum = this.lillySmall[_origin].value + this.lillySmall[_target].value;

            this.lillySmall[_origin].cNumber.text = 0;
            this.lillySmall[_target].cNumber.text = sum;

            this.lillySmall[_origin].value = 0;
            this.lillySmall[_target].value = sum;
            this.fadeStick = true;
            
        }

        // countDown number periodicly
        // move ents along the stick
        // count up the target

    }


    Trial.prototype.createStick = function(_data){

    	// console.log("-------------")
	    this.stick.x = _data.x;
	    this.stick.y = _data.y;
        this.stick.alpha = 1


    	// console.log(stick.pivot = 10)
    	// console.log("-------------")
    }


    Trial.prototype.moveStick = function(_data){

    	// console.log(">>move")
    	// console.log(this.sticks)
    	// console.log(">>move")
    	this.loop = false;

    	this.stick.width = getDistance(this.stick.x,this.stick.y,_data.x,_data.y)
    	var angle = getAngle(this.stick.x,this.stick.y,_data.x,_data.y)
    	if (this.stick.y < _data.y){
    		angle = -angle + Math.PI;
    	}
    	this.stick.rotation = angle - Math.PI/2
    }


    Trial.prototype.removeStick = function(){


        if(this.stick.alpha > 0){

            //animate alpha with animate function
            this.stick.alpha = this.stick.alpha -  0.1

        }else{
            this.fadeStick = false
        }
    	// console.log(">>>>>")
    	// console.log(this.sticks)
    }

	Trial.prototype.getSpecs = function(){

		var obj = {}

		obj.canvasMargin = 30
        obj.bigLillypadWidth = 280;
        obj.lillyWidth = 130;
        obj.margin = 15
		
        obj.width = session.canvas.width-(2*obj.canvasMargin)-obj.bigLillypadWidth-obj.lillyWidth/2;
		obj.height = session.canvas.height-(2*obj.canvasMargin);

    	obj.moduleSize = obj.lillyWidth+(obj.margin*2)
    	
    	obj.moduleWidthCount = Math.floor(obj.width/obj.moduleSize)
    	obj.moduleHeightCount = Math.floor(obj.height/obj.moduleSize);

    	obj.widthInter = obj.width/obj.moduleWidthCount
    	obj.heightInter = obj.height/obj.moduleHeightCount

    	obj.margingW = (obj.widthInter - obj.lillyWidth)/2
    	obj.margingH = (obj.heightInter - obj.lillyWidth)/2

    	return obj

	}    

    Trial.prototype.destroy = function(){

        // for(var i=0; i<this.ladyBugs.length; i++){
        //     this.ladyBugs[i].destroy()
        // }

        // this.UI.removeChildren(0,this.UI.children.length)
        // this.circle.destroy(true.true)
        // this.cNumber.destroy(true,true)
        // stage.removeChild(this.UI)
        // this.UI.destroy(true,true)
    }

    Trial.prototype.getMatrixPosition = function(){

        console.log(this.specs.moduleWidthCount,this.specs.moduleHeightCount)

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
    }

    Trial.prototype.getPos = function(_i){

    	var aPos = getRandomInt(0,this.matrixAvailable.length)
    	var i = this.matrixAvailable[aPos]
    	this.matrixAvailable.splice(aPos,1)


    	return this.posMatrix[i]
    }

    Trial.prototype.play = function(_updateTime){


        switch(this.trialState){

            case "intro":
                

                break;  

            case "play":
                
                if(this.fadeStick){
                    
                    this.removeStick()
                }

                break;


            case "finished":


                break;



            };
        };


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

    Round.prototype.getNextTri = function(){

        var specs = {
            
            // This will be displayed to user
            stimuli : 
            {
                correctValues : [4,5,2],
				extras : {
					min : 1,
					max : 3,
					size : 3, 
				}
            },

            //This will the what the users needs to imput/select
            correct : 
            {
                type: "number",
                value: 11,
            }
        
        }

        return [specs.stimuli, specs.correct]

    }

    Round.prototype.play = function(_updateTime){
        this.trial.play(_updateTime)
    }

    Round.prototype.init = function(){

        var specsthis = this.getNextTri();
        this.trial = new Trial(specsthis[0],specsthis[1]);
        this.trial.init();
    }

    Round.prototype.destroy = function(){

        this.trial.destroy()
        stage.removeChild(this.background)
        this.background.destroy(true,true)

    }



//-------------------------------------------
// Global functions andd variables
//-------------------------------------------

var statsBol = false;

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

if(proto3loaded){

    PIXI.loader.load(onAssetsLoaded);

    proto3loaded = true;

}else{

    onAssetsLoaded();

}

var finishGame = false

var previousTime = Date.now();
var MS_PER_UPDATE = 16.66667;
var lag = 0

function update() {

    if(finishGame){

        thisRound.destroy()
        finishGame = false
        currentview = new Chooser(assets)

    }

        if(statsBol)stats.begin()

        	//update position based on espectaed frame rate
	        var current = Date.now();
	        var elapsed = current - previousTime;
	        previousTime = current;
	        lag = lag + elapsed;


	        while (lag >= MS_PER_UPDATE){            
	            thisRound.play(lag/MS_PER_UPDATE);
	            lag = lag - MS_PER_UPDATE;
	        }

	        //---------------->> Thing that renders the whole stage
	        session.render(stage)


	        requestAnimationFrame(update);

        if(statsBol)stats.end()
        
}

}