var proto3loaded = true

function proto03(){


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
    };

    lillyFinal.prototype.init = function(_value){

            this.value = _value
            this.lillypad = new PIXI.Sprite(assets.textures.lillyBig)
            this.lillypad.anchor.x = 0.5
            this.lillypad.anchor.y = 0.5            
            stage.addChild(this.lillypad)
            this.lillypad.x = this.specs.x
            this.lillypad.y = this.specs.y
            this.lillypad.width = this.specs.size*2.5
            this.lillypad.height = this.specs.size*2.5

            this.cNumber =  new PIXI.Text(this.value, {font:"100px Arial", weight:"black", fill:"#ee3d51", stroke:"#ee3d51", strokeThickness: 1, });
            this.cNumber.x = this.lillypad.x - (this.specs.size/2)
            this.cNumber.y = this.lillypad.y - (this.specs.size/2)

            stage.addChild(this.cNumber)
    };

    lillyFinal.prototype.display = function(_currentValue){
    	// animate lillypad
    };

    lillyFinal.prototype.destroy = function(){

        stage.removeChild(this.lillypad);
        this.lillypad.destroy();
        stage.removeChild(this.cNumber);
        this.cNumber.destroy();
    };

    lillyFinal.prototype.getAntsDivision = function(_antSize){

        this.antsDivision = []
        var n = this.specs.size
        var ant = []

        for (var i=0; i<this.value; i++){

            var angle = ((2*Math.PI)/this.value)*i 

            // console.log(  this.lillypad.x + (Math.cos(angle) * (n*0.32)) - _antSize.width  )

            this.antsDivision.push({

                x : this.lillypad.x + (Math.cos(angle) * (n*0.7)) - _antSize.width,
                y : this.lillypad.y + (Math.sin(angle) * (n*0.7)) - _antSize.height,
            
            }) 

        }
    };

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: lillySmall
-------------------------------------------------------------------------------------------------------------
*/


    function lillySmall(_trial){

    	this.trial = _trial
    	this.selected = true
    	this.valueObjects = []
        this.antsDivision = []
        this.ang = getRandomInt(-11,11)/10
    };

    lillySmall.prototype.init = function(_value,_position,_size,_id,_antSize){
    	
        var _this = this;

        this.value = _value;
    	this.id = _id;
    	this.connections = [];
    	this.posdId = _position.id
    	this.pos = _position.pos;
    	this.size = _size; 

        this.container = new PIXI.Container()
        this.trialTimer = new ClockTimer();

        this.circle = new PIXI.Sprite(assets.textures.lillySmall)
        this.circle.width = this.size
        this.circle.height = this.size
        this.circle.anchor.x = 0.5
        this.circle.anchor.y = 0.5
        //this.circle.drawCircle(0,0,this.size/2);
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

        this.cNumber =  new PIXI.Text(this.value, {font:"60px Arial",align: 'center', weight:"black", fill:"#427010", stroke:"#098478", strokeThickness: 1, });
        this.cNumber.anchor.x = 0.5
        this.cNumber.anchor.y = 0.5
        this.cNumber.x = this.pos.x + this.size*0.5;
        this.cNumber.y = this.pos.y + this.size*0.5;


        this.circle.rotation = 0.1

        this.container.addChild(this.cNumber);

        stage.addChild(this.container)

        this.ripples.height = this.size * 1.42
        this.ripples.width = this.ripples.height*1.1
        this.ripples.x = this.circle.x + this.size * 0.03
        this.ripples.y = this.circle.y
        this.ripples.anchor.x = 0.5
        this.ripples.anchor.y = 0.5
        this.ripples.gotoAndPlay(getRandomInt(0,5))
        this.ripples.animationSpeed = 0.05
        this.ripples.alpha = 0.8
        this.ripples.rotation = this.circle.rotation


        this.ripples.rotation = this.circle.rotation
        this.getAntsDivision(_antSize)
    };

    lillySmall.prototype.createRipples = function(){


        this.ripples = new PIXI.extras.MovieClip(assets.sprites.ripple);
        stage.addChild(this.ripples);
    };

    lillySmall.prototype.clickStart = function(_this,_event){

        if(!thisRound.trial.AnimationDone){
            return
        }

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

    lillySmall.prototype.getAntsDivision = function(_antSize,_divisions){

        this.antsDivision = []
        var n = this.size
        var ant = []

        for (var i=0; i<this.value; i++){

            var angle = ((2*Math.PI)/this.value)*i 

            this.antsDivision.push({

                x : this.circle.x + (Math.cos(angle) * (n*0.32)) - _antSize.width,
                y : this.circle.y + (Math.sin(angle) * (n*0.32)) - _antSize.height,
            
            }) 

        }
    };

    lillySmall.prototype.destroy = function(){

        this.container.removeChild(this.circle)
        this.circle.destroy()

        this.container.removeChild(this.cNumber)
        this.cNumber.destroy()

        stage.removeChild(this.container)
        this.container.destroy(true)

        stage.removeChild(this.ripples)
        this.ripples.destroy(true)
    };

    lillySmall.prototype.animate = function(){

        if(this.fade){

            this.circle.alpha -= 0.01;
            this.ripples.alpha -= 0.1;
            this.cNumber.alpha -= 0.01


        }else{
        
            this.ang = (this.ang + 0.05) % (Math.PI*2);
            this.circle.width =  this.size + Math.sin(this.ang) * 2;
            this.circle.height =  this.size + Math.sin(this.ang) * 2;
            this.circle.rotation = Math.sin(this.ang) * 0.02;
        
        }
    };


/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Ant
-------------------------------------------------------------------------------------------------------------
*/


    function Ant(_size,_pos,_id){

        this.size = _size;
        this.pos = _pos;
        this.id = _id;
        this.sprite =  new PIXI.Sprite(assets.textures.ants)
        this.sprite.width = this.size.width;
        this.sprite.height = this.size.height;
        this.sprite.anchor.x = 0.5
        this.sprite.anchor.y = 0.5
        stage.addChild(this.sprite)        

        this.animation = new animation(this.sprite)
        this.AnimationStart = false
        this.AnimationDone = false
        this.state = -1
        this.trajectory  = []
        this.angles = []
    };

    Ant.prototype.init = function(){

        stage.addChild(this.sprite)
        this.sprite.x = this.pos.x
        this.sprite.y = this.pos.y
    };

    Ant.prototype.rotate = function(_n){

        
        this.sprite.rotation = this.angles[_n];
    };

    Ant.prototype.setTrajectory = function(_trajectory,_length,_offset){

        this.length = 100
        this.trajectory = _trajectory || []
        this.state = 0
        
        this.animation.init(this.trajectory[0],500,_offset)
        this.angles = []


        // fix correct angles for ants in the ogirin lilluypad 

        for(var i = 0; i<this.trajectory.length; i++){

            if(i == 0 ){

                this.angles.push(getAngle( this.sprite.x,this.sprite.y,this.trajectory[i].x,this.trajectory[i].y  )) 
                    
            }else{

                this.angles.push(getAngle( this.trajectory[i-1].x,this.trajectory[i-1].y,this.trajectory[i].x,this.trajectory[i].y )) 

            }
        
        }

        this.rotate(this.state)
    };

    Ant.prototype.move = function(){

        if(this.state < this.trajectory.length){

            this.rotate(this.state)

            if(this.animation.run()){
                
                this.state++

                if(this.state != this.trajectory.length){
                   
                    this.animation.init(this.trajectory[this.state],500)                       
                };

            };

            return false

        }else{

            this.AnimationDone = true;
            return true


        }   
    };

    Ant.prototype.destroy = function() {

        stage.removeChild(this.sprite)
        this.sprite.destroy()
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


        this.clock = new ClockTimer()

    	this.sticks = []

    	this.trialState = "play"
        this.lillySmall = [];
        this.ripples = [];
        this.lillyFinal = new lillyFinal();
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
                width : 6,
                height : 10,
            },
            sprites : [],
        }
        
        this.antsToAnimate = {
            origin : [],
            target : []
        }
    };

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

            // create small liilypads 
            var pos = getRandomInt(0,this.posMatrix.length) 
            this.lillySmall.push(new lillySmall(this))

        }

        for (var i=0; i<lilipadValues.length; i++){
            this.lillySmall[i].createRipples();
        }


        for (var i=0; i<lilipadValues.length; i++){

            this.lillySmall[i].init(lilipadValues[i], this.getPos(i), this.specs.lillyWidth, i, this.ants.size)

            //crete ants 
            for(var j = 0;j<lilipadValues[i];j++){
                
                var pos = this.lillySmall[i].antsDivision[j]
                this.ants.sprites.push( new Ant(this.ants.size, pos, i) )
            
            }

        }


        // create stick
        this.stick = new PIXI.Sprite(assets.textures.stick)
        this.stick.width = 0;
        this.stick.height = 15;
        stage.addChild(this.stick);

        this.branch = new PIXI.Sprite(assets.textures.branch)
        stage.addChild(this.branch);


        for(var i=0;i<this.ants.sprites.length;i++){
               

            this.ants.sprites[i].init()

        }    
    };

    Trial.prototype.destroy = function(){
        

        this.lillyFinal.destroy()

        for(var i=0;i<this.ants.sprites.length;i++){
               

            this.ants.sprites[i].destroy()

        }    

        for(var i = 0; i<this.lillySmall.length; i++){

            this.lillySmall[i].destroy()
        
        }

        stage.removeChild(this.stick)
        this.stick.destroy();
        stage.removeChild(this.branch)
        this.branch.destroy();
    };

    //creates links between lillypads if allowed
	Trial.prototype.CheckLink = function(_dropPoint,_id){


        // FINAL MOVE:
        if(this.lillyFinal.lillypad.containsPoint(_dropPoint)){

            if(this.lillySmall[_id].value == this.correct.value){

                this.moveStick(true,"final")
                this.updateOperation(_id,"final")
                this.trialState = "finished"
                this.trialEnded = true;

            }else{

                this.moveStick(true,"final")
                this.updateOperation(_id,"final")
                this.trialState = "finished"
                this.trialEnded = true;

            }

            return
        }

        //check which lillypad the stick was droped over
        for(var i=0; i<this.lillySmall.length; i++){

            if(this.lillySmall[i].circle.containsPoint(_dropPoint)){ 

                if(i == _id){
                    this.stick.alpha = 0
                    return  
                } 

                this.moveStick(true,i)
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
            this.clock.start(1000/this.lillySmall[_origin].value)

            this.setAnimateAnts(_origin,_target)

        }else{

            this.performOperation = true;
            this.countDone = false;

            // set countdown
            this.countDownTargets = [_origin,_target] 
            this.clock.start(1000/this.lillySmall[_origin].value)
         
            //update value for lillypads
            this.lillySmall[_target].value = this.lillySmall[_target].value + this.lillySmall[_origin].value
            this.lillySmall[_origin].value = 0
            
            //get new location for ants
            this.setAnimateAnts(_origin,_target)

        }
    };

    Trial.prototype.setAnimateAnts = function(_origin,_target){

        this.AnimationDone = false
            
        var t0 = {
            x: this.stick.x,
            y: this.stick.y,
        }
        
        var t1 = {

            x : this.stick.x + (Math.sin(this.stick.angle) * this.stick.width),
            y : this.stick.y - (Math.cos(this.stick.angle) * this.stick.width),
        }

        var offset = {//offset start time for animations
            val : 200,
            tar : 0,
            ori : 0,
        }


        var posCount = 0
        
        if(this.stick.angle < 0){
            t0.y = t0.y - this.stick.height
            t1.y = t1.y - this.stick.height
        }

        if(this.stick.angle < -Math.PI/2 || this.stick.angle > Math.PI/2){

            t0.x = t0.x - this.ants.size.width
            t1.x = t1.x - this.ants.size.width
            
        }


        if(_target == "final"){ // > if you droped the stick over the final circle

            this.lillyFinal.getAntsDivision(this.ants.size)
            this.antsToAnimate.target = []
            this.antsToAnimate.origin = []
            this.antsToAnimate.id = {ogirin : _origin, target : _target}

            for(var i = 0; i<this.ants.sprites.length; i++){

                if(this.ants.sprites[i].id == _origin){

                    var t2 = this.lillyFinal.antsDivision[posCount]
                    var trajectory = [t0,t1,t2]

                    this.ants.sprites[i].setTrajectory(trajectory,length,(offset.val * offset.ori))
                    this.antsToAnimate.origin.push(i)
                    offset.ori++
                    posCount++
                

                }   
            }     

        }else{ // if you dropped the stick over a small lillypad
      
            this.lillySmall[_target].getAntsDivision(this.ants.size)
            this.antsToAnimate.target = []
            this.antsToAnimate.origin = []
            this.antsToAnimate.id = {ogirin : _origin, target : _target}


            for(var i = 0; i<this.ants.sprites.length; i++){


                if(this.ants.sprites[i].id == _origin){

                    var t2 = this.lillySmall[_target].antsDivision[posCount]

                    var trajectory = [t0,t1,t2]

                    this.ants.sprites[i].setTrajectory(trajectory,length,(offset.val * offset.ori))
                    this.antsToAnimate.origin.push(i)
                    offset.ori++
                    posCount++

                }else if(this.ants.sprites[i].id == _target){


                    var trajectory = [ this.lillySmall[_target].antsDivision[posCount] ]
                    
                    this.ants.sprites[i].setTrajectory(trajectory,length,(offset.val * offset.tar))
                    
                    this.antsToAnimate.target.push(i)
                    offset.tar++
                    posCount++
                }

            }
    
        }
    };

    Trial.prototype.animateAnts = function(_origin,_target){

        var done = true 
       // console.log("---------START-----------" + done)

       if(_target != "final"){
            
            for(var i = 0; i<this.antsToAnimate.target.length; i++){

                //console.log(this.ants.sprites[this.antsToAnimate.target[i]].AnimationDone)

                if(!this.ants.sprites[this.antsToAnimate.target[i]].move()  || !this.ants.sprites[this.antsToAnimate.target[i]].AnimationDone){
                    done = false;
                }

            }


       }

        for(var i = 0; i<this.antsToAnimate.origin.length; i++){

            if(!this.ants.sprites[this.antsToAnimate.origin[i]].move() || !this.ants.sprites[this.antsToAnimate.origin[i]].AnimationDone){
                done = false;
            }

        }


        if(done){

            this.AnimationDone = true;
            this.fadeStick = true;

            var newId = this.antsToAnimate.id.target

            for(var i = 0; i<this.antsToAnimate.origin.length; i++){

                this.ants.sprites[this.antsToAnimate.origin[i]].id = newId 

            }      

            return true

        }else{

            return false
        }
    };

    Trial.prototype.createStick = function(_data){

        this.fadeStick = false
    	
        // console.log("-------------")
        for(var i = 0; i<this.lillySmall.length; i++){

            if(this.lillySmall[i].circle.containsPoint(_data)){

                this.stick.startX = this.lillySmall[i].circle.x;
                this.stick.startY = this.lillySmall[i].circle.y;
                this.stick.alpha = 1

            }

        }
    };

    Trial.prototype.moveStick = function(_data,_lillyId){

        var lillyOffset = (this.specs.lillyWidth*0.7)
        this.branch.alpha = 1;

        if(_data == true){

            if(_lillyId == "final"){

                var angle = getAngle(this.stick.startX ,this.stick.startY,this.lillyFinal.lillypad.x,this.lillyFinal.lillypad.y)
                this.stick.angle = angle

                this.stick.width = getDistance(
                
                    this.stick.x,
                    this.stick.y,
                    this.lillyFinal.lillypad.x,
                    this.lillyFinal.lillypad.y
                
                ) - (this.lillywith) 

            }else{
    
                
                var angle = getAngle(this.stick.startX ,this.stick.startY,this.lillySmall[_lillyId].circle.x,this.lillySmall[_lillyId].circle.y)
                this.stick.angle = angle

                this.stick.width = getDistance(
                
                    this.stick.x,
                    this.stick.y,
                    this.lillySmall[_lillyId].circle.x,
                    this.lillySmall[_lillyId].circle.y
                
                ) - (this.lillywith * 0.45) 

            }
            
            
            this.stick.rotation = angle + Math.PI*1.5;           

            var sine = Math.sin(angle)
            var cosine = Math.cos(angle)

            if( this.stick.width > this.branch.width){

                this.branch.renderable  = true;
                this.branch.rotation = angle + Math.PI
                this.branch.x = this.stick.x + sine * (this.stick.width * 0.5 - this.branch.width/2) + (cosine*13);
                this.branch.y = this.stick.y - cosine * (this.stick.width * 0.5 - this.branch.width/2) + (sine*13);            
            
            }else{
                
                this.branch.renderable  = false;
            
            }
    
            return
        }      


    	var angle = getAngle(this.stick.startX, this.stick.startY, _data.x, _data.y)

    	this.stick.rotation = angle + Math.PI*1.5

        var sine = Math.sin(angle)
        var cosine = Math.cos(angle)

        var opos = sine * (this.lillywith/2)*0.9
        var adj = cosine * (this.lillywith/2)*0.9

        this.stick.x = this.stick.startX + opos// + (this.specs.lillyWidth*0.7);
        this.stick.y = this.stick.startY - adj// + (this.specs.lillyWidth*0.65);
        this.stick.width = getDistance(this.stick.x,this.stick.y,_data.x,_data.y)

        if( this.stick.width > this.branch.width){

            this.branch.renderable  = true;
            this.branch.rotation = angle + Math.PI
            this.branch.x = this.stick.x + sine * (this.stick.width * 0.5 - this.branch.width/2) + (cosine*13);
            this.branch.y = this.stick.y - cosine * (this.stick.width * 0.5 - this.branch.width/2) + (sine*13);            
        
        }else{
            this.branch.renderable  = false;
        }
    };

    Trial.prototype.removeStick = function(){

        if(this.stick.alpha >= 0){

            //animate alpha with animate function
            this.stick.alpha = this.stick.alpha -  0.15
            this.branch.alpha =- 0.15

        }else{

            this.fadeStick = false;
        
        }
    };

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

    Trial.prototype.countNumber = function(){

            
        if(this.lillySmall[this.countDownTargets[0]].cNumber.text > 0){

            if(this.clock.timeOut()){

                if(this.countDownTargets[1] == "final"){

                    this.lillySmall[this.countDownTargets[0]].cNumber.text--
                    this.clock.start(this.clock.setTime)

                }else{

                    this.lillySmall[this.countDownTargets[0]].cNumber.text--
                    this.lillySmall[this.countDownTargets[1]].cNumber.text++
                    this.clock.start(this.clock.setTime)

                }

            }

        }else{

            this.countDone = true;

        }
    };

    Trial.prototype.finalAnimation = function(){

        if(this.countNumber()){
            if(this.animateAnts()){
                return true;
            }
        };

        return false;
    };

    Trial.prototype.play = function(_updateTime){


        switch(this.trialState){

            case "intro":
                



                break;  

            case "play":


                for(var i=0;i<this.lillySmall.length;i++){

                    this.lillySmall[i].animate()

                }


                if(this.fadeStick){
                    
                    this.removeStick()

                }else if(this.performOperation){
                
                    this.countNumber()
                    this.animateAnts()

                    if(this.countDone && this.AnimationDone){
                        this.performOperation = false
                    }
                    
                }

                break;


            case "finished":

                if(this.fadeStick){
                    this.removeStick()
                }

                if(this.performOperation){
                
                    this.countNumber()
                    this.animateAnts()


                    if(this.countDone && this.AnimationDone){
                        this.clock.start(3000)
                        this.performOperation = false
                    }

                    


                }else{

                    if(this.clock.timeOut()){

                        return false;
                   
                    }
                
                }


                break;



            };

            return true;
    };

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Round
-------------------------------------------------------------------------------------------------------------
*/

    function Round(){

        this.score = 0;
        this.language = "english"
        this.trialCount = -1

        this.specs = [

            //--------------------------------------0
            {
                stimuli: {
                
                    correctValues : [1,1],     
                    extras : {
                        min : 1,
                        max: 1, 
                        size: 0,
                    }
                },

                correct :{

                    type: "number",
                    value: 2,

                }
            },

            //--------------------------------------1
            {
                stimuli: {
                
                    correctValues : [2,1,1],     
                    extras : {
                        min : 0,
                        max: 0, 
                        size: 0,
                    }
                },

                correct :{

                    type: "number",
                    value: 3,

                }
            },

            //--------------------------------------2
            {
                stimuli: {
                
                    correctValues : [2,2,3,1],     
                    extras : {
                        min : 0,
                        max: 0, 
                        size: 0,
                    }
                },

                correct :{

                    type: "number",
                    value: 5,

                }
            },

            //--------------------------------------3
            {
                stimuli: {
                
                    correctValues : [2,3,3,1],     
                    extras : {
                        min : 0,
                        max: 0, 
                        size: 0,
                    }
                },

                correct :{

                    type: "number",
                    value: 6,

                }
            },

             //--------------------------------------4
            {
                stimuli: {
                
                    correctValues : [1,4,3,1],     
                    extras : {
                        min : 1,
                        max: 3, 
                        size: 1,
                    }
                },

                correct :{

                    type: "number",
                    value: 8,

                }
            },


             //--------------------------------------5
            {
                stimuli: {
                
                    correctValues : [2,5,4],     
                    extras : {
                        min : 1,
                        max: 4, 
                        size: 2,
                    }
                },

                correct :{

                    type: "number",
                    value: 11,

                }
            },

            //--------------------------------------6
            {
                stimuli: {
                
                    correctValues : [4,5,3,1],     
                    extras : {
                        min : 1,
                        max: 4, 
                        size: 2,
                    }
                },

                correct :{

                    type: "number",
                    value: 13,

                }
            },


        ]


    }

    /*
    ------
     Get next spects from the user queue
     *TO-DO: Replace values to queue values
    ------
    */

    Round.prototype.getNextTri = function(){

        this.trialCount = (this.trialCount+1) % 7

        return [this.specs[this.trialCount].stimuli,this.specs[this.trialCount].correct]
        


    };

    Round.prototype.play = function(_updateTime){

 
        if(!this.trial.play(_updateTime)){
            
            var specsthis = this.getNextTri();
            this.trial.destroy()
            this.trial = new Trial(specsthis[0],specsthis[1])
            this.trial.init()
        
        }
 
    };

    Round.prototype.init = function(){

        this.background = new PIXI.Sprite(assets.textures.bg)
        this.background.height = session.canvas.height;
        this.background.width = session.canvas.width;
        stage.addChild(this.background);

        var specsthis = this.getNextTri();
        this.trial = new Trial(specsthis[0],specsthis[1]);
        this.trial.init();
    };

    Round.prototype.destroy = function(){

        this.trial.destroy()
        stage.removeChild(this.background)
        this.background.destroy(true,true)
    };

//-------------------------------------------
// Global functions andd variables
//-------------------------------------------

// create the root of the scene graph and main classes
var stage = new PIXI.Container();
var thisRound = new Round();


this.destroy = function(){
    finishGame = true;
    session.hide()
}

function onAssetsLoaded(){

    session.show();
    thisRound.init();
    update();

}

if(proto3loaded){

    assets.addSprite(["ripple",'sprites/lillypad/ripples/ripples.json',5])

    assets.addTexture(["stick","sprites/stick/stick.png"])
    assets.addTexture(["leave","sprites/stick/leave.png"])
    assets.addTexture(["branch","sprites/stick/branch.png"])

    assets.addTexture(["lillyBig","sprites/lillypad/big-01.png"])
    assets.addTexture(["lillySmall","sprites/lillypad/small-01.png"])
    assets.addTexture(["ants","sprites/lillypad/ant.png"])
    assets.addTexture(["bg","sprites/backGrounds/BackGround-05.png"])

    assets.load(onAssetsLoaded)
    //proto3loaded = false;

}else{

    onAssetsLoaded();

}

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

        console.log("finishing Game")

        session.stats.domElement.style.display = "none"
        thisRound.destroy()
        assets.destroy()
        finishGame = false
        currentview = new Chooser(assets)

        return
    }



        if(statsBol)session.stats.begin()

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

        if(statsBol)session.stats.end()
        
        console.log("--end")
}

}