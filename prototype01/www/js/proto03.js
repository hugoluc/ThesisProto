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
    this.specs.size = 100
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

        if(this.connections.length > 1){
            console.log("THIS LILYPAD HAS TOO MANY CONECTIONS!")
            return
        }else if(!this.selected){
            console.log("THIS LILYPAD IS NOT THE SELECTED ONE")
            return

        }

    	//change lillypad to selected
    	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>")
    	console.log("clicked over:", this.id)
    	console.log("Pos_ID:", this.posdId)
    	console.log("connectios:", this.connections)
    	console.log("----------------------------")
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

    	this.trialState = "intro"
        this.lillySmall = [];
        this.lillyFinal = new lillyFinal();
        this.matrixAvailable = []
        this.specs = this.getSpecs()
        this.posMatrix = this.getMatrixPosition()
        this.lillyLinkd = []
        this.operation = 0
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
            this.lillySmall[i].init(lilipadValues[i],this.getPos(i),this.specs.moduleSize,i)

        }
    
    }

    //creates links between lillypads if allowed
	Trial.prototype.CheckLink = function(_dropPoint,_id){

        var noLink = true;

        if(this.sticks.length == 1){
            for(var i=0; i<this.lillySmall.length; i++){
                this.lillySmall[i].selected = false;                
            }            
        }

        //check which lillypad the stick was droped over
        for(var i=0; i<this.lillySmall.length; i++){

            if(this.lillySmall[i].circle.containsPoint(_dropPoint)){ 

                console.log("DROPED OVER: " + i)

                if(this.lillySmall[i].connections.length > 1){
                    console.log("the target has too many connections!")
                    this.removeStick();
                    return;

                }

                for(var j=0; j<this.lillySmall[i].connections.length;j++){

                    if(this.lillySmall[i].connections[j] == _id){
                        
                        this.removeStick();
                        return;             
                    
                    }

                }

                //add links fisrt and remove later if lop is detected
                this.lillySmall[_id].connections.push(i);
                this.lillySmall[i].connections.push(_id);

                this.checkLoop(_id,i,_id)

                if(this.loop){

                    console.log("DELETING CONECTIONS AND ERASING STICK")
                    console.log("-------------------------------------")

                    console.log("removing link from: "+_id)
                    console.log("before: " +  this.lillySmall[_id].connections)
                    this.lillySmall[_id].connections.splice(this.lillySmall[_id].connections.length-1,1);
                    console.log("after: " +  this.lillySmall[_id].connections)

                    console.log("removing link from: "+i)
                    console.log("before: " +  this.lillySmall[i].connections)
                    this.lillySmall[i].connections.splice(this.lillySmall[i].connections.length-1,1);
                    console.log("before: " +  this.lillySmall[i].connections)
                    this.removeStick();
                    noLink = false;

                }else{

                    this.lillySmall[i].selected = true;
                    this.sticks[this.sticks.length-1].id = [_id,i]
                    this.updateOperation(_id,i);
                }

                return;

            }

        }

        if(this.lillyFinal.lillypad.containsPoint(_dropPoint)){

            this.lillyFinal.conections.push(_id)
            console.log("FINISH TASk!!")

            if(this.operation == this.lillyFinal.value){

                this.getLinearOperation()
                console.log("correct")

            }else{

                console.log("wrong!")

            }

            return;
            //this.checkAnswers

        }

        if(noLink){

             this.removeStick();

        }    
	}

    this.getLinearOperation = function(){

        var _this = this

        var getNext = function(origin,_this){


        }


    }

    Trial.prototype.updateOperation = function(_origin,_target){

        if(this.lillySmall[_origin].connections.length <= 1){
            console.log("-----")
            this.lillyLinkd.push([this.lillySmall[_origin].id, this.lillySmall[_origin].value])
        }


        if(this.lillySmall[_target].connections.length <= 1){
            this.lillyLinkd.push([this.lillySmall[_target].id, this.lillySmall[_target].value])            
        }

        this.operation = 0;

        for(var i=0;i<this.lillyLinkd.length;i++){

            this.operation = this.operation + this.lillyLinkd[i][1]
            console.log(this.operation)
        }
    }

	Trial.prototype.checkLoop = function(_origin,_target,_last){

        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>")
        console.log("checking loop")
        console.log("origin: " + _origin )
        console.log("target: " +  _target )
        console.log("last: " + _last )
        console.log("----")

        if(_target == _origin){
            console.log("<<LOOP DETECTED>>")
            this.loop = true;
            return;
        }else{

            var newTargets = this.lillySmall[_target].connections;
            
            for(var i =0; i < newTargets.length; i++){

                console.log("target:" + newTargets[i])
            
                if(newTargets[i] != _last){

                    console.log("CALLING ON: " + [_origin,newTargets[i],_target])
                    this.checkLoop(_origin,newTargets[i],_target)

                }
               
            
            }


        }	
	}


    Trial.prototype.createStick = function(_data){

    	// console.log("-------------")
    	var stick = new PIXI.Graphics()
	    stick.lineStyle(0);
	    stick.beginFill(0x996630);
	    stick.drawRect(0,0,1,10);
	    stick.endFill();
		stage.addChild(stick);
	    stick.x = _data.x;
	    stick.y = _data.y;
    	this.sticks.push(stick)


    	// console.log(stick.pivot = 10)
    	// console.log("-------------")
    }


    Trial.prototype.moveStick = function(_data){

    	// console.log(">>move")
    	// console.log(this.sticks)
    	// console.log(">>move")
    	this.loop = false;
    	this.sticks[this.sticks.length-1].width = getDistance(this.sticks[this.sticks.length-1].x,this.sticks[this.sticks.length-1].y,_data.x,_data.y)
    	var angle = getAngle(this.sticks[this.sticks.length-1].x,this.sticks[this.sticks.length-1].y,_data.x,_data.y)
    	if (this.sticks[this.sticks.length-1].y < _data.y){
    		angle = -angle + Math.PI;
    	}
    	this.sticks[this.sticks.length-1].rotation = angle - Math.PI/2
    }


    Trial.prototype.removeStick = function(){


    	stage.removeChild(this.sticks[this.sticks.length-1])

        console.log(this.sticks[this.sticks.length-1])

    	this.sticks[this.sticks.length-1].destroy()
    	this.sticks.splice(this.sticks.length-1,1)
    	// console.log(">>>>>")
    	// console.log(this.sticks)
    }

	Trial.prototype.getSpecs = function(){

		var obj = {}

		obj.canvasMargin = 50
		obj.width = session.canvas.width-(2*obj.canvasMargin);
		obj.height = session.canvas.height-(2*obj.canvasMargin);
		obj.bigLillypadWidth = 400;
    	obj.lillyWidth = 90;
    	obj.margin = obj.lillyWidth*0.1

    	obj.moduleSize = obj.lillyWidth+(obj.margin*2)
    	
    	obj.moduleWidthCount = Math.floor((obj.width-obj.bigLillypadWidth)/obj.moduleSize)
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


    	for(var i=0;i<this.specs.moduleWidthCount-1;i++){

    		for(var j=0;j<this.specs.moduleHeightCount;j++){

    			offset = j%2

    			if(offset == 1 && i==this.specs.moduleWidthCount-2){
                    
    				continue

    			}else{

    				if(true){//j>0 && j<this.specs.moduleHeightCount-1){

			    		allPos.push({

                            id: i,
                            pos:{
                                x:(this.specs.widthInter*i)+this.specs.margingW+((this.specs.widthInter/2)*offset)+this.specs.canvasMargin,
                                y:(this.specs.heightInter*j)+this.specs.margingH+this.specs.canvasMargin,                                 
                            }

			    	
			    		})

					}
    			}

			
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
					size : 10, 
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