var proto3loaded = false;

function proto03(){

  var enableClick = true; 

  var minAddends = store.get("minAddends");
  if(!minAddends) minAddends = 2; // store.get and store.set, and write adjustDifficulty !!

  var maxAddends = store.get("maxAddends");
  if(!maxAddends) maxAddends = 3;

  console.log("---ADEDNS---")
  console.log(minAddends,maxAddends)

  var stimCount = store.get("ant_problems_solved");
  if(!stimCount) stimCount = 0;

  var scoreDifferential = 0;

  // difficulty phases:
  // increase maxOptions every 5 correct trials (decrease after 2 incorrect?)
  // increase maxAddends along with maxOptions
  // no longer show leaves on final lilypad after 20 total correct trials (put back if 5 in a row incorrect?)
  // start doing subtraction problems as well after 50 total correct trials? (randomize add/sub)
  // start showing the equation form of the problem at the end (e.g., 1 + 3 + 2 = 6)
  var scoreIncrease = 1; // increase scoreIncrease by 1 every 5 correct trials
  var maxOptions = 4;
  var number_of_only_addition_problems = 10; // only addition problems (set 30 for kids, 10 for testing)

  queuesToUpdate['numberstim'] = true;
  var stimuli = stimQueues['numberstim'];
  proto3loaded = true;

/*------------------------------------------------------------------------------
                              Class: lillyFinal
------------------------------------------------------------------------------
*/

  function lillyFinal(_trial){
      this.trial = _trial
      this.specs = {}
      this.specs.size = 120
      this.specs.x = session.canvas.width/2;
      this.specs.y = session.canvas.height/2;
      this.conections = [];
      this.sinking = false;
      this.ang = 0;
  };

  Object.defineProperties(lillyFinal.prototype, {
      x: {
          get: function() {
              var bounds = this.container.getBounds();
              return bounds.x + (bounds.width/2);
          }
      },

      y: {
          get: function() {
              var bounds = this.container.getBounds();
              return bounds.y + (bounds.height/2);
          }
      },

      width: {
          get : function(){
              return this.container.getBounds().width;
          }
      },

      height: {
          get: function(){
              return this.container.getBounds().height;
          }
      }
  });

  lillyFinal.prototype.init = function(_value){

          var _this = this;

          this.container = new PIXI.Container();
          this.container.interactive = true;
          this.container.on("mousedown", function(){_this.clickStart(this)})
          this.container.on("touchstart", function(){_this.clickStart(this)})


          this.value = _value;
          this.lillypad = new PIXI.Sprite(assets.textures.lillyBig);
          this.lillypad.anchor.x = 0.5;
          this.lillypad.anchor.y = 0.5;
          this.lillypad.x = 0;
          this.lillypad.y = 0;
          this.lillypad.width = this.specs.size*2.5;
          this.lillypad.height = this.specs.size*2.5;
          this.container.addChild(this.lillypad);

          this.lillySink = new PIXI.extras.MovieClip(assets.sprites.lillyFinal_Sink);
          this.lillySink.anchor.x = 0.5;
          this.lillySink.anchor.y = 0.5;
          this.lillySink.x = 0;
          this.lillySink.y = 0;
          this.lillySink.width = this.specs.size*2.5;
          this.lillySink.height = this.specs.size*2.5;
          this.lillySink.animationSpeed = 0.1;
          this.lillySink.renderable = false;
          this.container.addChild(this.lillySink);

          this.cNumber =  new PIXI.Text(this.value, {font:"100px Arial", weight:"black", fill:"#ee3d51", stroke:"#ee3d51", strokeThickness: 1, });
          this.cNumber.anchor.x = 0.5;
          this.cNumber.anchor.y = 0.5;
          this.cNumber.x = this.lillypad.x - 10;
          this.cNumber.y = this.lillypad.y - 10;
          this.container.addChild(this.cNumber);

          this.customAnimation = new animation(this.container);
          this.customAnimation.setPos({x:this.specs.x,y:this.specs.y});

          this.leaves = [];
          var size = {width: 40, height: 40};
          this.setAntsDvision({width:10,height:10},0);

          for(var i = 0; i < this.value; i++){

              this.leaves.push(new PIXI.Sprite(assets.textures.leave));
              this.leaves[i].width = size.width;
              this.leaves[i].height = size.height;
              this.leaves[i].anchor.x = 0.5;
              this.leaves[i].anchor.y = 0.5;
              this.leaves[i].x = this.antsDivision[i].x;
              this.leaves[i].y = this.antsDivision[i].y;

              this.container.addChild(this.leaves[i]);
          }

          stage.addChild(this.container);
  };

  lillyFinal.prototype.sinkThis = function(){

      this.lillySink.renderable = true;
      this.lillypad.renderable = false;
      this.cNumber.renderable = false;

      this.lillySink.gotoAndPlay(0);
      this.state = "sinking";
  };

  lillyFinal.prototype.display = function(_currentValue){

      switch(this.state){

          case "sinking":

              if(this.lillySink.currentFrame == 8){
                  this.lillySink.stop();
                  this.state = "fading";
              }

              break;

          case "fading":

              this.ang = (this.ang + 0.05) % (Math.PI*2);
              this.lillySink.rotation = Math.sin(this.ang) * 0.05;

              this.container.alpha = this.container.alpha - 0.05;
              this.lillySink.width = this.lillySink.width - 0.5;
              this.lillySink.height = this.lillySink.height - 0.5;

              if(this.container.alpha < 0){
                  return true;
              }

              break;

          return false;

      }
  };

  lillyFinal.prototype.destroy = function(){

      this.container.removeChild(this.lillypad);
      this.lillypad.destroy();
      this.container.removeChild(this.cNumber);
      this.cNumber.destroy();

      stage.removeChild(this.container);
      this.container.destroy();
  };

  lillyFinal.prototype.setAntsDvision = function(_antSize,_extras){

      this.antsDivision = [];
      var n = this.specs.size;
      var ant = [];

      for (var i=0; i<this.value; i++){

          var angle = ((2*Math.PI)/this.value)*i

          this.antsDivision.push({
              x: this.x + (Math.cos(angle) * (n*0.76)) - _antSize.width,
              y: this.y + (Math.sin(angle) * (n*0.76)) - _antSize.height
          })

      }

      for (var i=0; i<_extras; i++){
          var angle = ((2*Math.PI)/_extras)*i;

          this.antsDivision.push({
              x : this.x + (Math.cos(angle) * (n*0.4)) - _antSize.width,
              y : this.y + (Math.sin(angle) * (n*0.4)) - _antSize.height
          })
      }
  };

  lillyFinal.prototype.clickStart = function(){

    if(!this.trial.animationDone){
      console.log("no clicking while animating")
      return
    }

    if(this.trial.singleClickOrigin){
      console.log(this.container.position,this)
      this.trial.CheckLinkClick(this.container.position,this.trial.singleClickOrigin.id);

    }
  }


/*
-------------------------------------------------------------------------------------------------------------
                                                Class: lillySmall
-------------------------------------------------------------------------------------------------------------
*/

  function lillySmall(_trial){
    	this.trial = _trial;
    	this.selected = true;
    	this.valueObjects = [];
      this.antsDivision = [];
      this.ang = getRandomInt(-11,11)/10;
      this.numberColor = [
        "#427010",
        "#ffec4a"
      ]
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
      this.circle.interactive = true;
      this.circle.buttonMode = true;

  	  this.circle
    		.on('mousedown', click)
        .on('touchstart', click)
    		.on('mouseup', function(){_this.clickEnd(this)})
        .on('mouseupoutside', function(){_this.clickEnd(this)})
        .on('touchend', function(){_this.clickEnd(this)})
        .on('touchendoutside', function(){_this.clickEnd(this)})
        .on('mousemove', function(){_this.drag(this)})
        .on('touchmove', function(){_this.drag(this)});

      function click(_event){
      	_this.clickStart(this,_event)
      }

      this.container.addChild(this.circle);
      this.circle.x = this.pos.x+this.size/2;
      this.circle.y = this.pos.y+this.size/2;

      this.cNumber =  new PIXI.Text(this.value, {font:"60px Arial",align: 'center', weight:"bold", fill:this.numberColor[0], stroke:"#098478", strokeThickness: 0, });
      this.cNumber.anchor.x = 0.5;
      this.cNumber.anchor.y = 0.5;
      this.cNumber.x = this.pos.x + this.size*0.5;
      this.cNumber.y = this.pos.y + this.size*0.5;

      this.circle.rotation = 0.1;
      this.container.addChild(this.cNumber);
      stage.addChild(this.container);

      this.ripples.height = this.size * 1.42;
      this.ripples.width = this.ripples.height*1.1;
      this.ripples.x = this.circle.x + this.size * 0.03;
      this.ripples.y = this.circle.y;
      this.ripples.anchor.x = 0.5;
      this.ripples.anchor.y = 0.5;
      this.ripples.gotoAndPlay(getRandomInt(0,5));
      this.ripples.animationSpeed = 0.05;
      this.ripples.alpha = 0.8;
      this.ripples.rotation = this.circle.rotation;
      this.setAntsDvision(_antSize);

      this.display(false);
  };

  lillySmall.prototype.createRipples = function(){
      this.ripples = new PIXI.extras.MovieClip(assets.sprites.ripple);
      stage.addChild(this.ripples);
  };

  lillySmall.prototype.clickStart = function(_this,_event){

    if(!this.trial.animationDone){
      console.log("no clicking while animating")
      return
    }

    //change lillypad to selected
   _this.data = _event.data;
   _this.dragging = true;

    console.log("clickstart");
    this.trial.clickCount++
    console.log(this.trial.clickCount)

    if(this.trial.clickCount > 1){
      console.log("no multiclick", this.trial.clickCount)
      return
    }else{

      this.trial.clickedLilly = this
      if(enableClick){
        return;
      }
      console.log("--",this.trial.clickCount)

      if(!this.trial.singleClickOrigin){

        this.trial.singleClickOrigin = this
        this.toggleSelection()

      }else{

        if(this.trial.singleClickOrigin !=  this) {
          this.trial.singleClickDest = this;
        }else{
          this.toggleSelection()
          this.trial.singleClickOrigin = undefined
        }
      }
    }

     //change lillypad to selected
    _this.data = _event.data;
    _this.dragging = true;

    console.log("end of clickstart" , this.trial.clickCount)

  };

  lillySmall.prototype.clickEnd = function(_this){

    this.trial.clickCount--

    //change lillypad to selected
    if(!this.dragging) return
    if(this.trial.clickedLilly != this) return

    console.log("clickend", this.trial.clickCount)
    if(this.trial.clickCount > 0){
      console.log("no multiclick")
      return
    }

    _this.dragging = false;
    this.dragging = false;

    //if both target and destination was cicked (not using drag):
    if(this.trial.singleClickDest && this.trial.singleClickOrigin){

      //if clicked on the same lilly toogle:
      if(this.trial.singleClickDest == this.trial.singleClickOrigin){
        this.trial.singleClickDest.toggleSelection()
        this.trial.singleClickDest = undefined;
        this.fadeStick = true;
      }else{
        this.trial.CheckLinkClick(_this.data.getLocalPosition(_this.parent),this.id);
      }

    }else{
      // check link for dragging
      this.trial.CheckLink(_this.data.getLocalPosition(_this.parent),this.id);
    }
  };

  lillySmall.prototype.drag = function(_this){

  	if(_this.dragging){

  		if(!this.dragging){
        this.trial.createStick(_this.data.getLocalPosition(_this.parent));
  			this.dragging = true;
      }

  		this.trial.moveStick(_this.data.getLocalPosition(_this.parent));
  	}
  };

  lillySmall.prototype.setAntsDvision = function(_antSize,_divisions){

      this.antsDivision = [];
      var n = this.size;
      var ant = [];

      for (var i=0; i<this.value; i++){

          var angle = ((2*Math.PI)/this.value)*i;

          this.antsDivision.push({
              x: this.circle.x + (Math.cos(angle) * (n*0.32)),
              y: this.circle.y + (Math.sin(angle) * (n*0.32))
          });

      }
  };

  lillySmall.prototype.destroy = function(){

      this.container.removeChild(this.circle)
      this.circle.destroy()
      this.circle = []

      this.container.removeChild(this.cNumber)
      this.cNumber.destroy()
      this.cNumber = []

      stage.removeChild(this.container)
      this.container.destroy(true)
      this.container = []

      stage.removeChild(this.ripples)
      this.ripples.destroy(true)
      this.ripples = []

      this.destroyed = true;
  };

  lillySmall.prototype.display = function(_show){

      if(!_show){

          for(var i = 0; i < round.trial.ants.sprites.length; i++){


              if(round.trial.ants.sprites[i].id == this.id )

                  round.trial.ants.sprites[i].sprite.renderable = false;

          }

          this.circle.interactive = false;
          this.circle.renderable = false;
          this.container.renderable = false;
          this.ripples.renderable = false;
          this.destroyed = true;

      }else{


          for(var i = 0; i < round.trial.ants.sprites.length; i++){

              if(round.trial.ants.sprites[i].id == this.id )

                  round.trial.ants.sprites[i].sprite.renderable = true;

          }

          this.circle.interactive = true;
          this.circle.renderable = true;
          this.container.renderable = true;
          this.ripples.renderable = true;
          this.destroyed = false;

      }
  };

  lillySmall.prototype.animate = function(){


      if(this.destroyed){
          return;
      };

      if(this.fade){

          this.circle.alpha -= 0.05;
          this.ripples.alpha -= 0.1;
          this.cNumber.alpha -= 0.05;

          if(this.circle.alpha <= 0){

              this.display(false)

          };


      }else{

          this.ang = (this.ang + 0.05) % (Math.PI*2);
          this.circle.width =  this.size + Math.sin(this.ang) * 2;
          this.circle.height =  this.size + Math.sin(this.ang) * 2;
          this.circle.rotation = Math.sin(this.ang) * 0.02;

      }
  };

  lillySmall.prototype.toggleSelection = function(){

    if(this.cNumber.style.fill == this.numberColor[0]){
      this.cNumber.style.fill = this.numberColor[1]
    }else{
      this.cNumber.style.fill = this.numberColor[0]
    }

    this.cNumber.updateText();

  }

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Ant
-------------------------------------------------------------------------------------------------------------
*/

  function Ant(_size,_pos,_id){

      this.size = _size;
      this.pos = _pos;
      this.id = _id;
      this.sprite =  new PIXI.Sprite(assets.textures.ants);
      this.sprite.width = this.size.width;
      this.sprite.height = this.size.height;
      this.sprite.anchor.x = 0.5;
      this.sprite.anchor.y = 0.5;
      this.sprite.renderable = false;
      stage.addChild(this.sprite);

      this.animation = new animation(this.sprite);
      this.AnimationStart = false;
      this.animationDone = false;
      this.state = -1;
      this.trajectory  = [];
      this.angles = [];
  };

  Ant.prototype.init = function(){

      stage.addChild(this.sprite)

      var dest = {
          x : this.pos.x,
          y : this.pos.y
      };

      this.animation.setPos(dest)
  };

  Ant.prototype.rotate = function(_n){

      this.sprite.rotation = this.angles[_n];
  };

  Ant.prototype.setTrajectory = function(_trajectory,_length,_offset){

    console.log(_length)

      this.length = _length || []
      this.trajectory = _trajectory || []
      this.state = 0
      this.animationDone = false
      this.animation.init(this.trajectory[0], this.length[0] ,_offset)
      this.angles = []


      // fix correct angles for ants in the ogirin lillypad

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

      if(this.animationDone){
          return true;
      }

      if(this.state < this.trajectory.length){

          this.rotate(this.state)

          if(this.animation.run()){ // if ant reached a step in the trajectory:

              this.state++;

              if(this.state != this.trajectory.length){

                  if(this.state == 1){

                      round.trial.antMoveDone("subtract");

                  }else if(this.state == 2){

                      round.trial.antMoveDone("add")
                  };

                  this.animation.init(this.trajectory[this.state],this.length[this.state])
              };

          };

          return false

      }else{

          round.trial.leavesToFade++;
          this.animationDone = true;
          return true;
      }
  };

  Ant.prototype.fade = function(){
      this.sprite.alpha -= 0.05;

      if(this.sprite.alpha < 0){
          return true;
      }else{
          return false;
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

  function Trial(_stim){

    this.starttime = Date.now();
    stimCount++;
    store.set('ant_problems_solved', stimCount);
    // check if _stim.options is undefined, in which case generate random trial
    // let's make sure we don't generate the answer as an extra (too easy!)

	  // origstim is the final desired sum. It is used to draw smaller lillypad
    // so the user has at least one way to solve the problem
    this.origstim = _stim; // e.g. {id:"1", audio:"1", text:"one", priority: 2}
    this.subtract = false;

    if(stimCount > number_of_only_addition_problems) {
      // could make greater likelihood of subtraction problems as stimCount increases
      if(Math.random() < .9999) this.subtract = true;
    }

    this.stimuli = this.createAdditionProblem(_stim, this.subtract);
    this.clickCount = 0
    this.singleClickDest;
    this.singleClickOrigin;
  	this.correctSum = false; // set true if they finish correctly
    this.clock = new ClockTimer();
  	this.sticks = [];
    this.stimPlayed = false; // first hear target number
  	this.trialState = "intro";
    this.introState = "playSound";
    this.specs = this.getSpecs();
    this.lillySmall = [];
    this.ripples = [];
    this.matrixAvailable = [];
    this.posMatrix = this.getMatrixPosition();
    this.operation = 0;

    this.animationDone = true;
    this.fadeStick = false;
    this.performOperation = false;
    this.countDone = false;

    this.ants = {
        size : {
            width : 9,
            height : 14,
        },
        sprites : [],
    };

    this.antsToAnimate = {
        origin : [],
        target : []
    };

    this.antsSub = 0;
    this.antsAdd = 0;
    this.leavesToFade = 0;
  };

  Trial.prototype.createAdditionProblem = function(stim,_sub) {

    console.log("-------------------------------")
    console.log(minAddends,maxAddends);

    // given a single number (desired sum), want to generate a set of addends
    // and potentially add another value that is too large

    var total = parseInt(stim.id);
    var Naddends = getRandomInt(minAddends, maxAddends); // get number of addends. Ex.: (2+3+4 = 9) addends = 3
    var cumSum = 0;
    var values = [];

    for (var i = 0; i < Naddends-1; i++) {
      var addend = getRandomInt(1,total-cumSum-1);
      cumSum += addend;
      values.push(addend);
    };

    if(total < 4){

      if(total == 1) { // special simple cases

          if(Math.random() > 0.5) return [1,0,0];
          values= [1,0,0];

      } else if(total==2) {

              if( Math.random() > 0.5) return [1,1,0];
              values= [1,1,1];

      } else if(total==3) {

              if(Math.random()>.5) return [1,2,0];
              values= [2,1,1]; // [1,1,1,0] is boring

      }

      if(_sub){
          values[1] = values[1] + (2*values[0]);
          values[0] = values[0]*-1;
      };

      console.log("<4 cases", values)
      return values;
    }

      values.push(total - cumSum);

      if(_sub){
        values[1] = values[1] + (2*values[0]);
        values[0] = values[0]*-1;
      };

      for(var i = 0; i <= (maxOptions-values.length); i++) {

        if(Math.random() < 0.6) {
          values.push(getRandomInt(0,total-1));
        } else {
          values.push(getRandomInt(total+1, total+3));
        }

      }

    console.log(values)
    return values;
  };

  Trial.prototype.adjustDifficulty = function() {

    if(scoreDifferential > 3) {

      if(minAddends < 4 )minAddends ++; // raise min, and max (if not too high)
      store.set("minAddends",minAddends);

      if(maxAddends < 5) maxAddends++;
      store.set("minAddends",minAddends);

    } else if(scoreDifferential<0) {

      if(maxAddends > minAddends) maxAddends--;

    }

    store.set("maxAddends",maxAddends);

  }

  Trial.prototype.init = function(){

      var lilipadValues = this.stimuli; // need to deep copy?

      if(lilipadValues.length > this.posMatrix.length){
          throw "SCREEN TOO SMALL!";
      }

      // create small liilypads
      for (var i=0; i<lilipadValues.length; i++){
          var pos = getRandomInt(0,this.posMatrix.length);
          this.lillySmall.push(new lillySmall(this));
      }

      // create riples : outside next loop to ensure ripples are aways bellow lillypads
      for (var i=0; i<lilipadValues.length; i++){
          this.lillySmall[i].createRipples();
      }

      // create lillpypads visuals and ants
      for (var i=0; i<lilipadValues.length; i++){

          this.lillySmall[i].init(lilipadValues[i], this.getPos(i), this.specs.lillyWidth, i, this.ants.size)

          //create ants
          for(var j = 0;j<lilipadValues[i];j++){
              var pos = this.lillySmall[i].antsDivision[j]
              this.ants.sprites.push( new Ant(this.ants.size, pos, i) )
          }

      }

      this.lillyFinal = new lillyFinal(this);
      this.lillyFinal.init(this.origstim.id);

      // create stick
      this.stick = new PIXI.Sprite(assets.textures.stick);
      this.stick.width = 0;
      this.stick.height = 15;
      this.stick.anchor.y = 0.5
      stage.addChild(this.stick);

      this.branch = new PIXI.Sprite(assets.textures.branch);
      this.branch.anchor.x = -0.2;
      stage.addChild(this.branch);


      for(var i=0;i<this.ants.sprites.length;i++){
          this.ants.sprites[i].init();
      };

      //create equation
      this.equation = new PIXI.Text("first", {
        font:"60px Arial",
        align: 'left',
        weight:"bold",
        fill: "#cccccc",
        stroke:"#cccccc",
        strokeThickness: 0,
      });
      this.equation.x = 150;
      this.equation.y = 20;
      this.equation.renderable = false;
      stage.addChild(this.equation)

      this.clock.start(1000);
  };

  Trial.prototype.UpdateEquation = function(_value,_subtracting){

    if(_subtracting){
      var sign = " "
    }else{
      var sign = " + "
    }

    if(this.equation.text == "first"){
      this.equation.renderable = true
    }

    this.equation.text = _value[0] + sign + _value[1] + " = " + (parseInt(_value[0]) + parseInt(_value[1]))

  }

  Trial.prototype.destroy = function(){

      this.equation.destroy()
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

  Trial.prototype.antMoveDone = function(_operation){

      if(_operation == "add"){

        this.antsAdd++

      } else if(_operation == "subtract"){

          this.antsSub--

       } else if(_operation == "final"){

          this.antsAdd--

      }
  };

  //Check if the stick was droped over an lillipad
  //Initializes operation and animation
  Trial.prototype.CheckLink = function(_dropPoint,_id){

    // FINAL MOVE:
    if(this.lillyFinal.lillypad.containsPoint(_dropPoint)){

      if(parseInt(this.lillySmall[_id].cNumber.text) < 0 ){// check if the ORIGIN lillipad has a negative number

        this.fadeStick = true;
        return;

      }

      this.trialState = "finished";
      this.leavesToFade = 0;
      this.finishedState = "countdown";
      this.animationDone = false;
      this.subtracting = false

      if(this.lillySmall[_id].value == this.origstim.id){

        var sign = " = "
        this.trialEnded = true;
        this.correctSum = true;

      }else{

        var sign = " ≠ "
        this.trialEnded = false; // GK: trial is still ended, but they got it wrong..

      }

      console.log("--------------------------------------------------------------------------")
      this.equation.renderable = true;
      var text = this.lillySmall[_id].cNumber.text + sign + this.lillyFinal.cNumber.text
      this.equation.text = text

      this.moveStick(true,"final");// adjust final stick size
      this.setAnimateAnts(_id,"final")//get new location for ants
      this.updateOperation(_id,"final");// update lllypad value

      return
    }

    //check which lillypad the stick was droped over
    for(var i=0; i<this.lillySmall.length; i++){

      // i = destitination id
      //_id = origin id

      if(this.lillySmall[i].circle.containsPoint(_dropPoint) && !this.lillySmall[i].destroyed){

          if(i == _id){ // return if its was dropped over itself
            this.stick.alpha = 0 // fade stick correctyl *************************************FIXME*****
            this.fadeStick = true;
            return
          }

          var values = [this.lillySmall[_id].cNumber.text,this.lillySmall[i].cNumber.text]

          if(parseInt(this.lillySmall[_id].cNumber.text) < 0 ){// check if the ORIGIN lillipad has a negative number

            this.UpdateEquation(values,false)
            this.subtracting = "origin"

          }else if (parseInt(this.lillySmall[i].cNumber.text) < 0){// check if the TARGET lillipad has a negative number

            this.UpdateEquation(values,true)
            this.subtracting = "target"

          }else{
              this.UpdateEquation(values,false)
              this.subtracting = false
          }

          this.moveStick(true,i) // adjust final stick size
          this.updateOperation(_id,i) // update lllypad value
          this.setAnimateAnts(_id,i); //get new location for ants

          return;

      }
    }


        this.fadeStick = true;
  }

  Trial.prototype.CheckLinkClick = function(_dropPoint,_id){

    if(enableClick){
      return;
    }
    console.log("checklinkclick")
    console.log(_dropPoint,_id);

    if(this.lillyFinal.lillypad.containsPoint(_dropPoint)){

      if(parseInt(this.lillySmall[_id].cNumber.text) < 0 ){// check if the ORIGIN lillipad has a negative number
        this.fadeStick = true;
        return;
      }

      this.trialState = "finished";
      this.leavesToFade = 0;
      this.finishedState = "countdown";
      this.animationDone = false;
      this.subtracting = false;

      if(this.lillySmall[_id].value == this.origstim.id){ // correct answear

        this.trialEnded = true;
        this.correctSum = true;

      }else{
        this.trialEnded = false; // GK: trial is still ended, but they got it wrong..
      }

      console.log(this.lillyFinal.container.position)

      this.createStick(this.singleClickOrigin.circle.position);
      this.moveStick(this.lillyFinal.container.position) // adjust final stick size
      this.moveStick(true , "final") // adjust final stick size
      this.setAnimateAnts(this.singleClickOrigin.id , "final"); //get new location for ants
      this.updateOperation(this.singleClickOrigin.id , "final") // update lllypad value

      return
    }


    if(this.singleClickDest && this.singleClickOrigin){

      if(parseInt(this.singleClickOrigin.cNumber.text) < 0 ){// check if the ORIGIN lillipad has a negative number

        this.subtracting = "origin"

      }else if (parseInt(this.singleClickDest.cNumber.text) < 0){// check if the TARGET lillipad has a negative number

        this.subtracting = "target"

      }else{
          this.subtracting = false
      }

      this.createStick(this.singleClickOrigin.circle.position);
      this.moveStick(this.singleClickDest.circle.position) // adjust final stick size
      this.moveStick(true,this.singleClickDest.id) // adjust final stick size
      this.updateOperation(this.singleClickOrigin.id,this.singleClickDest.id) // update lllypad value
      this.setAnimateAnts(this.singleClickOrigin.id,this.singleClickDest.id); //get new location for ants

      return;

    }

  };

  // Updates values (not text) of the lillypads based on the operaion
  Trial.prototype.updateOperation = function(_origin,_target){

    if(_target == "final"){

      this.lillyFinal.value = this.origstim.id - this.lillySmall[_origin].value
      this.lillySmall[_origin].value = 0
      this.performOperation = true;
      this.countDone = false;
      this.countDownTargets = [_origin,_target]

    }else{

      this.performOperation = true;
      this.countDone = false;

      // set countdown
      this.countDownTargets = [_origin,_target];

      //SUBTRACTION
      if(this.subtracting == "target"){

        if(Math.abs(this.lillySmall[_target].value) > this.lillySmall[_origin].value){

          //inverting values
          _origin = _target ^ _origin
          _target = _origin ^ _target
          _origin = _target ^ _origin

        }

        this.lillySmall[_origin].value = parseInt(this.lillySmall[_target].value) + parseInt(this.lillySmall[_origin].value)
        this.lillySmall[_target].value = 0;

        }else if (this.subtracting == "origin"){

          if(Math.abs(this.lillySmall[_origin].value) > this.lillySmall[_target].value){

            //inverting values
            _origin = _target ^ _origin
            _target = _origin ^ _target
            _origin = _target ^ _origin

          }

          this.lillySmall[_target].value = parseInt(this.lillySmall[_target].value) + parseInt(this.lillySmall[_origin].value)
          this.lillySmall[_origin].value = 0;

        //ADITION
        }else{

          this.lillySmall[_target].value = parseInt(this.lillySmall[_target].value) + parseInt(this.lillySmall[_origin].value)
          this.lillySmall[_origin].value = 0;

        };

    };

  };

  // Set position of the ants for the animation based on origin and target lillipads
  Trial.prototype.setAnimateAnts = function(_origin,_target){

    this.animationDone = false;
    var posCount = 0;

    var offset = {//offset start time for animations
      val : 300,
      tar : 0,
      ori : 0,
    };

    var originValue = parseInt(this.lillySmall[_origin].cNumber.text)
    var firstBaseSpeed = 500;
    var stickBaseSpeed = 800;
    var lastBaseSpeed = 500;
    var singleSpeed = 300;


    var speed = 0.2  // pixels per mili

    function getLength(_t1,_t2,_speedUp){

      console.log(_t2,_t2,_speedUp)
      var newSpeed = (speed + (0.005 * Math.abs(_speedUp)))

      if(newSpeed > 0.35) newSpeed = 0.25

      return getDistance(_t1.x,_t1.y,_t2.x,_t2.y) / newSpeed

    }

    //****************
    // FINAL LILLIPAD
    //****************

    if(_target == "final"){ // if the user drops the stick over the final circle:

        var t0 = { //start of the stick
          x: this.stick.x,
          y: this.stick.y,
        };

        var t1 = { // end of the stick
          x : this.stick.x + (Math.sin(this.stick.angle) * this.stick.width),
          y : this.stick.y - (Math.cos(this.stick.angle) * this.stick.width),
        };

        var extraAnts = this.lillySmall[_origin].value - this.lillyFinal.value
        var totalAntsSlow = this.lillySmall[_origin].value * 10
        if(totalAntsSlow > 300) totalAntsSlow == 300;

        if(extraAnts < 0) {extraAnts = 0};

        this.lillyFinal.setAntsDvision(this.ants.size,extraAnts);
        this.antsToAnimate.target = [];
        this.antsToAnimate.origin = [];
        this.antsToAnimate.id = {ogirin : _origin, target : _target};

        for(var i = 0; i<this.ants.sprites.length; i++){

          if(this.ants.sprites[i].id == _origin){

            var t2 = this.lillyFinal.antsDivision[posCount];
            var start = this.ants.sprites[i].sprite.position
            var trajectory = [t0,t1,t2];
            var antSpeeds = [
              250 - totalAntsSlow/2, //from start postiion to beggining of sticl
              1000 - totalAntsSlow, //along the stick
              500 - totalAntsSlow  // from end of stick to final position
            ]
            console.log(antSpeeds)
            this.ants.sprites[i].setTrajectory(trajectory,antSpeeds,(offset.val * offset.ori)-(totalAntsSlow*2));
            this.antsToAnimate.origin.push(i);
            offset.ori++;
            posCount++;

          };
        };


    //******************
    // REGULAR LILLIPAD
    //******************

    }else{

        var targetValue = parseInt(this.lillySmall[_target].cNumber.text)
        this.lillySmall[_target].setAntsDvision(this.ants.size);
        this.antsToAnimate.target = [];
        this.antsToAnimate.origin = [];
        this.antsToAnimate.id = {ogirin : _origin, target : _target};

        var oCounter = 0
        var tCounter = 0

        // Get negative value from the lillipad to be
        // used later in creating ants animations
        if(this.subtracting == "origin"){

          var negativeValue =  originValue

        }else if(this.subtracting == "target"){

          var negativeValue =  targetValue
        };

        //*************************************************
        // Check all ants to see if they are over one of
        // the lillipads selected by the user.
        // Ogigin = lillipad clicked first
        // Target = lillipad in wich the stik was released
        //*************************************************

        for(var i = 0; i<this.ants.sprites.length; i++){

          var antSubtracted = false;

          //*****************************
          // Ants on the ORIGIN lillipad
          //*****************************
          if(this.ants.sprites[i].id == _origin){

            console.log("ant on origin")
            // Generate position for animation

            var t0 = { //start of the stick
              x: this.stick.x,
              y: this.stick.y,
            };

            var t1 = { // end of the stick
              x : this.stick.x + (Math.sin(this.stick.angle) * this.stick.width),
              y : this.stick.y - (Math.cos(this.stick.angle) * this.stick.width),
            };

            //*********************************************************
            //SUBTRACION! (CLICKED ON A POSITIVE AND THE ON A NEGATIVE)
            //Move ants to negative lillipad!
            if(this.subtracting == "target"){

              console.log("negative target")

              console.log(oCounter,negativeValue)

              // Only move enoguth ants to make target zero
              if(oCounter < Math.abs(negativeValue)){

                console.log("move no diferent lilly")
                //center of lillipad
                var t2 = {
                  x : this.lillySmall[_target].circle.x,
                  y : this.lillySmall[_target].circle.y
                };

                oCounter++
                antSubtracted = true;


                var start = this.ants.sprites[i].sprite.position
                var trajectory = [t0,t1,t2];
                var antSpeeds = [
                  getLength(start,trajectory[0],originValue), //from start postiion to beggining of sticl
                  getLength(trajectory[0],trajectory[1],originValue), //along the stick
                  getLength(trajectory[1],trajectory[2],originValue) // from end of stick to final position
                ]

              //Move rest of the ants to regular ants division on positive lillipad
              }else{

                console.log("rearrange")
                this.lillySmall[_origin].setAntsDvision(this.ants.size);

                // trajectory needs to be an array!
                var trajectory = [ this.lillySmall[_origin].antsDivision[posCount-oCounter]];
                var antSpeeds = [singleSpeed]
              };

            //********************************************
            //ADDITION! Move ants based on direction of stick
            }else{

              var t2 = this.lillySmall[_target].antsDivision[posCount];

              var start = this.ants.sprites[i].sprite.position
              var trajectory = [t0,t1,t2];
              console.log(trajectory)
              var antSpeeds = [
                getLength(start,trajectory[0],originValue), //from start postiion to beggining of sticl
                getLength(trajectory[0],trajectory[1],originValue), //along the stick
                getLength(trajectory[1],trajectory[2],originValue) // from end of stick to final position
              ]

              console.log(antSpeeds)

            };

            // Create trajectory and add ant to be animated
            this.ants.sprites[i].setTrajectory(trajectory,antSpeeds, 100 * offset.ori++);//(offset.val * offset.ori));
            this.antsToAnimate.origin.push(i);
            this.ants.sprites[i].subtracted = antSubtracted
            offset.ori++;
            posCount++;

          //*****************************
          // Ants on the TARGET lillipad
          //*****************************

          }else if(this.ants.sprites[i].id == _target){

            // If the origin is negative move "extra" ants from target to origin to make subtraction
            if(this.subtracting === "origin"){

              console.log("subtracting on origin")

              // Only move enoguth ants to make origin zero
              if(tCounter <  Math.abs(negativeValue)){

                console.log("seting position to negative lillypad")

                var t0 = { // end of the stick
                  x : this.stick.x + (Math.sin(this.stick.angle) * this.stick.width),
                  y : this.stick.y - (Math.cos(this.stick.angle) * this.stick.width),
                };

                var t1 = { //start of the stick
                  x: this.stick.x,
                  y: this.stick.y,
                };

                var t2 = { // center of lillypad
                  x : this.lillySmall[_origin].circle.x,
                  y : this.lillySmall[_origin].circle.y
                };

                tCounter++
                antSubtracted = true;

                var start = this.ants.sprites[i].sprite.position
                var trajectory = [t0,t1,t2];
                var antSpeeds = [
                  getLength(start,trajectory[0],originValue), //from start postiion to beggining of sticl
                  getLength(trajectory[0],trajectory[1],originValue), //along the stick
                  getLength(trajectory[1],trajectory[2],originValue) // from end of stick to final position
                ]

              // Move rest of the ants to ants devision
              }else{

                console.log("seting position to positive lillypad")
                this.lillySmall[_target].setAntsDvision(this.ants.size);

                // trajectory needs to be an array!
                var trajectory = [ this.lillySmall[_target].antsDivision[posCount-tCounter]];
                var antSpeeds = [singleSpeed]
              };

            //ADDITION! Move ants based on direction of stick
            }else if(this.subtracting === false){

              var trajectory = [ this.lillySmall[_target].antsDivision[posCount] ];
              var antSpeeds = [singleSpeed]

            };

            console.log("legth will be:", antSpeeds)
            this.ants.sprites[i].setTrajectory(trajectory,antSpeeds,100 * offset.ori++)//(offset.val * offset.tar));
            this.antsToAnimate.target.push(i);
            this.ants.sprites[i].subtracted = antSubtracted
            offset.tar++;
            posCount++;

          };

        };

        if(this.singleClickOrigin) this.singleClickOrigin.toggleSelection()

        this.singleClickDest = undefined
        this.singleClickOrigin = undefined

    };
  };

  //<< ******* CALLED ON LOOP ******* >>
  // update values based on ants position
  Trial.prototype.countNumber = function(){

    var oriDone = false;
    var targDone = false;
    var tar = {};


    //REGULAR MOVE: TARGET
    if(this.countDownTargets[1] != "final"){

        tar = this.lillySmall[this.countDownTargets[1]]

        if(tar.cNumber.text != tar.value){

             if(this.subtracting == "origin"){

                tar.cNumber.text = parseInt(tar.cNumber.text) + this.antsSub;
                this.antsSub = 0;

             }else{

                tar.cNumber.text = parseInt(tar.cNumber.text) + this.antsAdd;
                this.antsAdd = 0;

             }

        } else{

            targDone = true;
        };

    // FINAL LILLYPAD COUNT
    }else{


        tar = this.lillyFinal;
        if(tar.cNumber.text > tar.value - this.lillySmall[this.countDownTargets[0]].value){

            tar.cNumber.text = parseInt(tar.cNumber.text) - this.antsAdd;
            this.antsAdd = 0;

        } else{

            targDone = true;

        };
    }

    //REGULAR MOVE: ORIGIN <<when ant reach beggining of stick>>
    if(this.lillySmall[this.countDownTargets[0]].cNumber.text != this.lillySmall[this.countDownTargets[0]].value){
    // change to equal the number it should be in the end

        if(this.subtracting == "origin"){

            this.lillySmall[this.countDownTargets[0]].cNumber.text = parseInt(this.lillySmall[this.countDownTargets[0]].cNumber.text) + this.antsAdd;
            this.antsAdd = 0;

        }else{

            this.lillySmall[this.countDownTargets[0]].cNumber.text = parseInt(this.lillySmall[this.countDownTargets[0]].cNumber.text) + this.antsSub;
            this.antsSub = 0;

        }

    }else{
        oriDone = true;
    };


    if(oriDone && targDone){

        return true;

    } else{

        return false;
    }
  };

  //<< ******* CALLED ON LOOP ******* >>
  Trial.prototype.animateAnts = function(_origin,_target){

   // if (this.animationDone) return

    var done = true;

    //*********************
    //move ants for ADITION
    //*********************
    if(this.subtracting === false){

      if(_target != "final"){ // animate ants on target lillypad

        for(var i = 0; i<this.antsToAnimate.target.length; i++){

          if(!this.ants.sprites[this.antsToAnimate.target[i]].move() || !this.ants.sprites[this.antsToAnimate.target[i]].animationDone){
            done = false;
          };

        };

      };


      for(var i = 0; i<this.antsToAnimate.origin.length; i++){// animate ants on origin lillypad

        if(!this.ants.sprites[this.antsToAnimate.origin[i]].move() || !this.ants.sprites[this.antsToAnimate.origin[i]].animationDone){

          done = false;

        };

      };


      if(done){ // set new ids for origin ants

        var newId = this.antsToAnimate.id.target;

        for(var i = 0; i<this.antsToAnimate.origin.length; i++){

          this.ants.sprites[this.antsToAnimate.origin[i]].id = newId;

        };

      return true;

      };


    //*************************
    //Move ants for SUBTRACTION
    //*************************

        }else{

            //Negative value on origin lillipad! Only move ants on target
            if(this.subtracting == "origin"){

                for(var i = 0; i<this.antsToAnimate.target.length; i++){

                    if(!this.ants.sprites[this.antsToAnimate.target[i]].move() || !this.ants.sprites[this.antsToAnimate.target[i]].animationDone){

                        done = false;

                    };

                };

            //Negative value on target lillipad! Only move ants on origin
            }else{

                for(var i = 0; i<this.antsToAnimate.origin.length; i++){

                    if(!this.ants.sprites[this.antsToAnimate.origin[i]].move() || !this.ants.sprites[this.antsToAnimate.origin[i]].animationDone){

                        done = false;


                    };

                };

            };


            if(done){

                this.animationDone = true

                //*******************************************
                //Removing ants that wen on negatice lillipad
                //*******************************************

                var indexCounter = 0

                //negative target
                if(this.subtracting == "target"){

                    for(var i = 0; i<this.antsToAnimate.origin.length; i++){


                        if(this.ants.sprites[this.antsToAnimate.origin[i-indexCounter]].subtracted){

                            this.ants.sprites[this.antsToAnimate.origin[i-indexCounter]].destroy()
                            this.ants.sprites.splice(this.antsToAnimate.origin[i-indexCounter],1)
                            indexCounter++

                        }

                    }

                //negative origin
                }else{

                    for(var i = 0; i<this.antsToAnimate.target.length; i++){


                        if(this.ants.sprites[this.antsToAnimate.target[i-indexCounter]].subtracted){

                            this.ants.sprites[this.antsToAnimate.target[i-indexCounter]].destroy()
                            this.ants.sprites.splice(this.antsToAnimate.target[i-indexCounter],1)
                            indexCounter++

                        }

                    }


                }

                return true
            };

        };


    return false;
  };

  Trial.prototype.finalAnimation = function(){

    if(this.countNumber()){
        if(this.animateAnts()){
            return true;
        }
    };

    return false;
  };

  Trial.prototype.createStick = function(_data){


    this.fadeStick = false;

    for(var i = 0; i<this.lillySmall.length; i++){

        if(this.lillySmall[i].circle.containsPoint(_data)){

            this.stick.startX = this.lillySmall[i].circle.x;
            this.stick.startY = this.lillySmall[i].circle.y;
            this.stick.alpha = 1;

            return;

        }
    }
  };

  Trial.prototype.moveStick = function(_data,_lillyId){

    //_data : if true set the final position for the stick
    // if false set the position from origin lillypad and touchcurrect position

    var lillyOffset = (this.specs.lillyWidth*0.7);
    this.branch.alpha = 1;

    // set the final position for the stick
    if(_data == true){

      if(_lillyId == "final"){

          var angle = getAngle(

              this.stick.startX,//center of origin lillypad
              this.stick.startY,//center of origin lillypag
              this.lillyFinal.x,
              this.lillyFinal.y

          )

          this.stick.angle = angle
          this.stick.width = getDistance(

              this.stick.x,
              this.stick.y,
              this.lillyFinal.x,
              this.lillyFinal.y

          ) - (this.lillywith)

      }else{


          var angle = getAngle(
            this.stick.startX,
            this.stick.startY,
            this.lillySmall[_lillyId].circle.x,
            this.lillySmall[_lillyId].circle.y
          )

          var distance = getDistance(

              this.stick.x,
              this.stick.y,
              this.lillySmall[_lillyId].circle.x,
              this.lillySmall[_lillyId].circle.y

          ) - (this.lillywith * 0.45)


          this.stick.angle = angle
          this.stick.width = distance

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

    }else{

      var angle = getAngle(this.stick.startX, this.stick.startY, _data.x, _data.y)
      var sine = Math.sin(angle)
      var cosine = Math.cos(angle)
      var opos = sine * (this.lillywith/2)*0.9
      var adj = cosine * (this.lillywith/2)*0.9
      var distance = getDistance(this.stick.startX + opos, this.stick.startY - adj, _data.x, _data.y)

      var outside = getDistance(

        this.clickedLilly.circle.x,
        this.clickedLilly.circle.y,
        _data.x,
        _data.y

      )

      this.stick.rotation = angle + Math.PI*1.5
      this.stick.x = this.stick.startX + opos
      this.stick.y = this.stick.startY - adj
      this.stick.width = getDistance(this.stick.startX + opos,this.stick.startY - adj,_data.x,_data.y)

      if( this.stick.width > this.branch.width){

          this.branch.renderable  = true;
          this.branch.rotation = angle + Math.PI
          this.branch.x = this.stick.x + sine * (this.stick.width * 0.5 - this.branch.width/2) + (cosine*13);
          this.branch.y = this.stick.y - cosine * (this.stick.width * 0.5 - this.branch.width/2) + (sine*13);

      }else{
          this.branch.renderable  = false;
      }

      //check if you are outside lillypad
      if(outside < this.lillywith/2){
        this.stick.width = 0
        this.branch.renderable  = false;
        return
      }


    }
  };

  Trial.prototype.removeStick = function(){

    if(this.stick.alpha >= 0){
        //animate alpha with animate function
        this.stick.alpha -= 0.1;
        this.branch.alpha -= 0.1;

    }else{
        this.fadeStick = false;
        this.animationDone = true
    }
  };

  Trial.prototype.getSpecs = function(){

    var obj = {
      canvasMargin : 30,
      bigLillypadWidth : 280,
      lillyWidth : 130,
      margin : 15
    };

    obj.width = session.canvas.width-(2*obj.canvasMargin)-(obj.bigLillypadWidth*1.2)-obj.lillyWidth/2;
	  obj.height = session.canvas.height-(2*obj.canvasMargin);
    obj.moduleSize = obj.lillyWidth+(obj.margin*2);

    obj.moduleWidthCount = Math.floor(obj.width/obj.moduleSize);
    obj.moduleHeightCount = Math.floor(obj.height/obj.moduleSize);

    obj.widthInter = obj.width/obj.moduleWidthCount;
    obj.heightInter = (obj.height/obj.moduleHeightCount) -  60;

    obj.margingW = ((obj.widthInter - obj.lillyWidth)/2);
    obj.margingH = 60 + (obj.heightInter - obj.lillyWidth)/2;

    this.lillywith = obj.lillyWidth;

    return obj;
  };

  Trial.prototype.getMatrixPosition = function(){

  	var allPos = [];

  	for(var i=0;i<this.specs.moduleWidthCount;i++){
  		for(var j=0;j<this.specs.moduleHeightCount;j++){
  			offset = j%2;

    		allPos.push({
          id: i,
          pos:{
            x:(this.specs.widthInter * i) + this.specs.margingW + this.specs.canvasMargin + ((this.specs.widthInter/2)*offset) + getRandomInt(-20,20),
            y:(this.specs.heightInter*j) + this.specs.margingH + this.specs.canvasMargin + getRandomInt(-20,20) + 30
          }
    		});
		}


  	}

  	for(var i=0; i<allPos.length; i++){
  		this.matrixAvailable.push(i);
  	}

      return allPos;
  };

  Trial.prototype.getPos = function(_i){

    var aPos = getRandomInt(0,this.matrixAvailable.length)
    var i = this.matrixAvailable[aPos]
    this.matrixAvailable.splice(aPos,1)


    return this.posMatrix[i]
  };

  Trial.prototype.intro = function(){

    switch(this.introState){

        case "playSound":

            if(this.clock.timeOut()){


                var dest = {};
                dest.x = session.canvas.width - this.lillyFinal.container.getBounds().width/2 - 30;
                dest.y = (session.canvas.height/2)// + (this.lillyFinal.container.getBounds().height/2);

                this.lillyFinal.customAnimation.init(dest,500,0,[1,0])

                this.introState = "moveFinalLillypad"

            }

            break;

        case "moveFinalLillypad":

            if(this.lillyFinal.customAnimation.run()){

                this.introState = "spawnSmallLillipads";
            }

            break;

        case "spawnSmallLillipads":

            for(var i = 0; i < this.lillySmall.length; i++){

                this.lillySmall[i].display(true)

            }

            return true

            break;

    }

    return false
  };

  Trial.prototype.fadeLeaves = function(){
    if(this.leavesToFade <= this.origstim.id){
        for(var i=0; i<this.leavesToFade; i++){
            this.lillyFinal.leaves[i].alpha -= 0.05;
        }
    }
  };

  Trial.prototype.storeStim = function(){

      logTrial({"starttime":this.starttime, "endtime":Date.now(), "stimtype":'ant', "stim":this.origstim.id, "correct":this.correctSum, "subtraction":this.subtract});

      var rand_adjust = Math.random() * .1 - .05; // slight randomization to shuffle stim
      if(this.correctSum) {
        var newpriority = this.origstim.priority + .5;
      } else {
        var newpriority = this.origstim.priority;  // same? or - Math.log(this.wrongClicks);
      }
      this.origstim.priority = newpriority + rand_adjust;

      console.log(this.origstim )
      return(this.origstim);
  };

  Trial.prototype.finished = function(){

    switch(this.finishedState){

        case "countdown":

          var countDone = this.countNumber();
          var animationDone = this.animateAnts();

          if(countDone && animationDone){

              if(this.trialEnded){

                  var pos = [];
                  for (var i=0; i<scoreIncrease; i++) {
                    pos.push({ x: this.stick.x, y: this.stick.y});
                  }
                  score.addScore(pos, scoreIncrease);
                  correct_sound.play();
                  score.setExplosion({ x: this.stick.x, y: this.stick.y},100,1000);
                  this.fadeStick = true;
                  this.clock.start(1000);
                  this.finishedState = "win";
                  scoreDifferential ++;
                  //round.changeDifficulty(true);

              } else {
                  this.lillyFinal.sinkThis();
                  // could play bad sound the number of ants they were wrong by...
                  incorrect_sound.play();
                  this.fadeStick = true;
                  this.finishedState = "lose";
                  scoreDifferential --;
              }
              this.adjustDifficulty();
          }


            break;


        case "lose":

            if(this.lillyFinal.state == "fading"){
               for(var i = 0; i<this.antsToAnimate.origin.length; i++){
                    this.ants.sprites[this.antsToAnimate.origin[i]].fade()
               }
            }

            //sink lillypad
            if(this.lillyFinal.display()){
                this.finishedState = "callNext"
            }

            break;


        case "win":
            // fade everything else and move final to center
            if(this.clock.timeOut()){
                this.finishedState = "callNext";
            }

            break;


        case "callNext":

            return true;

            break;

    }

    return false;
  };

  Trial.prototype.play = function(_updateTime){

    switch(this.trialState){

        case "intro":

            if(!this.stimPlayed) {
              assets.sounds.numbers[this.origstim.id].play();
              this.stimPlayed = true;
            }

            if(this.fadeStick){ this.removeStick()}

            if(this.intro()){
                this.trialState = "play"
            };

            break;

        case "play":

            for(var i=0;i<this.lillySmall.length;i++){
                this.lillySmall[i].animate();
            }

            if(this.fadeStick){

                this.removeStick();

            }else if(this.performOperation){

              var countDone = this.countNumber();
              var antsAnimationDone = this.animateAnts();

              if(countDone && antsAnimationDone){

                if(this.lillySmall[this.countDownTargets[0]].cNumber.text == 0) this.lillySmall[this.countDownTargets[0]].fade = true;
                if(this.lillySmall[this.countDownTargets[1]].cNumber.text == 0) this.lillySmall[this.countDownTargets[1]].fade = true;

                this.fadeStick = true;
                this.animationDone = false;
                this.performOperation = false;

                }
            }

            break;

        case "finished":

            score.displayStar();
            score.displayExplosion();
            this.fadeLeaves();

            if(this.fadeStick) this.removeStick()
            if(this.finished()) return true;

            break;

        };

        return false;
  };

//-------------------------------------------
// Global functions andd variables
//-------------------------------------------
  logTime("addsub",'start');
    // create the root of the scene graph and main classes
    var stage = new PIXI.Container();
    var round = new Round();
    score.stage = stage;

    this.destroy = function(){
        finishGame = true;
        session.hide()
    };

    //---------------------------------------loading assets

        if(proto3loaded){

            assets.addSprite("ripple",'sprites/lillypad/ripples/ripples.json',5)
            assets.addSprite("lillyFinal_Sink",'sprites/lillypad/final_sink/lillyFinal_Sink.json',9)

            assets.addTexture("stick","sprites/stick/stick.png")
            assets.addTexture("leave","sprites/stick/leave.png")
            assets.addTexture("branch","sprites/stick/branch.png")

            assets.addTexture("lillyBig","sprites/lillypad/big-01.png")
            assets.addTexture("lillySmall","sprites/lillypad/small-01.png")
            assets.addTexture("ants","sprites/lillypad/ant.png")
            assets.addTexture("bg","sprites/backGrounds/BackGround-05.png")

            for (var i = 0; i < numbers.length; i++) {
              //assets.sounds.numbers
              assets.addSound(Number(numbers[i].id),numbers[i].audio + '.mp3');

            };

            //assets.addSound("wrong",'wrong.mp3');
            assets.load(onAssetsLoaded)

        }else{

            onAssetsLoaded();

        };

        function onAssetsLoaded(){

            round.init(Trial,stage, stimuli);

            setTimeout(function(){

                session.show()
                update();

            });
        };

    //---------------------------------------LOOP

        var statsBol = false;

        if(statsBol){
            session.stats.domElement.style.display = "block"
        };

        var finishGame = false
        var previousTime = Date.now();
        var MS_PER_UPDATE = 33.3333333;
        var lag = 0

        function update() {

          if(finishGame){

            logTime("addsub",'stop');
            round.storeSession(stimuli, 'numberstim');
            session.stats.domElement.style.display = "none";
            round.destroy();
            assets.destroy();
            finishGame = false;
            currentview = new MainMenu(assets);

            return
          }

          if(statsBol) session.stats.begin()

        	//update position based on espectaed frame rate
	        var current = Date.now();
	        var elapsed = current - previousTime;
	        previousTime = current;
	        lag = lag + elapsed;


      	  while (lag >= MS_PER_UPDATE){
            round.play(lag/MS_PER_UPDATE);
            lag = lag - MS_PER_UPDATE;

	        }

  	        //---------------->> Thing that renders the whole stage
  	        session.render(stage)

  	        requestAnimationFrame(update);

          if(statsBol)session.stats.end()

        }

};
