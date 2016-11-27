var multiplicationLoaded = false;

function Multiplication(){

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Trial
-------------------------------------------------------------------------------------------------------------
*/

	function Trial(_stimuli,_correct){

    this.starttime = Date.now();
    this.counter = 0;
    this.played = false;
		this.stimuli = _stimuli;
		this.answer = [];
		this.boardMatrix = {};

		this.playState = "intro";
		this.introState = "instruction";
    this.layoutSpecs = this.layoutSpecs();

	};

	Trial.prototype.play = function(first_argument) {

		switch(this.playState){

		case "intro": // Display Introduction and instructions

			if(this.intro()){
				this.playState = "Playing"
			}

			break;

		case "Playing": //Allow user to place eggs
      var done  = true;

      if(done){
          this.playState = "Lose"
      }

			break;

		case "Lose":
      var done = true;
      if(done){
        return true;
      }

			break;

    case "Win":

      var done = true;
      if(done){
        return true;
      }

			break;

    return false;

	};

	Trial.prototype.intro = function(){

		switch(this.introState){

			case "instruction":

        var done = false;
        if(done){
          this.introState = "moveInstructions"
        }

				break;

			case "moveInstructions":

        var done = true
        if(done){
          this.introState = "setUp"
        }

				break;

			case "setUp":

        var done = true;

				if(done){

					return true

				};

				break


		};

		return false;
	};

	Trial.prototype.layoutSpecs = function(){

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		//This function sets the adequate sizes to be used
		//when drawing the board background and division lines
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

		layoutSpecs = {}

		//Define general areas for the board and instruction area:
		layoutSpecs.instructionWidth = (session.width/5 > 200) ? session.width/5 : 200 ;
		layoutSpecs.boardMargin = session.width/20;
		layoutSpecs.x = this.boardSpecs.instructionWidth + this.boardSpecs.boardMargin;
		layoutSpecs.y = this.boardSpecs.boardMargin + (session.height * 0.1);
		layoutSpecs.maxWidth = session.width - this.boardSpecs.instructionWidth - (2 * this.boardSpecs.boardMargin);
		layoutSpecs.maxHeight = session.height - (2 * this.boardSpecs.boardMargin) - (session.height * 0.1);

    return layoutSpecs;

	};

	Trial.prototype.destroy = function(_stage){

    var bg;

    function deleteChildren(_child,_parent){

      if(_child.children.length > 0){
          while(_child.children.length > 0){
            deleteChildren(_child.children[0],_child)
          }
      }

      if(_child.id == "bg"){
        bg = _parent.removeChild(_child)
      }else{
        _parent.removeChild(_child)
        _child.destroy()
      }
    }

    while(stage.children.length > 0){

      deleteChildren(stage.children[0],stage)

    }

    if(bg) stage.addChild(bg)

  };

  Trial.prototype.storeStim = function(){

    if(this.stimOne){

      this._stimuli.priority = this._stimuli.priority + 1;

    }else{

      logTrial({
        "starttime":this.starttime,
        "endtime":Date.now(),
        "stimtype":'mult',
        "stim":this._stimuli.id,
        "length":this.nests[0].rows,
        "width":this.nests[0].columns
      });

      var rand_adjust = Math.random() * .1 - .05; // slight randomization to shuffle stim
      if(this.answer){
        this._stimuli.priority = this._stimuli.priority + .5 + rand_adjust;
      }else{
        this._stimuli.priority = this._stimuli.priority - .1 + rand_adjust;
      }

      var newpriority = this._stimuli.priority
      this._stimuli.priority = newpriority + rand_adjust;

    }

    return(this._stimuli);

  };

//------------------------------------------
// Global functions and variables
//-------------------------------------------

  logTime('multiplication','start');
  queuesToUpdate['numberstim'] = true;
  var stimuli = stimQueues['numberstim'];

  var stimCount = store.get("multi_problems_solved")
  if(!stimCount) stimCount = 0;

  // if they pass 10s on a trial, give verbal instructions
  var instructionsGiven = 10000; // give after 10 seconds, then set to -1 (given)


	// create the root of the scene graph and main classes
    var stage = new PIXI.Container();
    var round = new Round();
    score.stage = stage;

    this.destroy = function(){
        finishGame = true;
        session.hide()
    };

    //---------------------------------------loading assets

      if(!multiplicationLoaded){

        //load Textures
        assets.addTexture("CL-BL","sprites/coverLeaves/BL.png")

        //load Sprites
        assets.addSprite("ladyBug_Walk",'sprites/ladyBug/ladyBug_Walk.json',4);
        assets.addSprite("ladyBug_fly",'sprites/ladyBug/ladyBug_fly.json',4);

        //loadBG
        assets.addTexture("bg","sprites/backGrounds/bg-multiplicatiom.png")
        assets.load(onAssetsLoaded)

      }else{
        onAssetsLoaded();
      };

      function onAssetsLoaded(){
        round.init(Trial, stage, stimuli);
        setTimeout(function(){
            session.show()
            update();
        });
      };

    //--------------------------------------- Game Loop

    var statsBol = false;
    if(statsBol) session.stats.domElement.style.display = "block"

    var finishGame = false
    var previousTime = Date.now();
    var MS_PER_UPDATE = 33.3333333;
    var lag = 0

    function update() {

      //********************************STATS END
      if(statsBol) session.stats.begin()


      //go back to Main menu
      if(finishGame){
        logTime("multiplication",'stop');
        session.stats.domElement.style.display = "none";
        round.destroy();
        assets.destroy();
        finishGame = false;
        currentview = new MainMenu(assets);
        return
      };

    	//update position based on expected frame rate
      var current = Date.now();
      var elapsed = current - previousTime;
      previousTime = current;
      lag = lag + elapsed;

  	  while (lag >= MS_PER_UPDATE){
        round.play(lag/MS_PER_UPDATE);
        lag = lag - MS_PER_UPDATE;
      };

      //Render stage
      session.renderer.render(stage)
      requestAnimationFrame(update);


      //********************************STATS END
      if(statsBol)session.stats.end()

  };

};
