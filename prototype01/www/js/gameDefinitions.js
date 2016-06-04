/*
-------------------------------------------------------------------------------------------------------------
                                               Class: canvasSession
-------------------------------------------------------------------------------------------------------------
*/

	function CanvasSession(){

		this.renderer = {};
		this.canvas = {};


		this.init = function(){

			var header = document.getElementById("header-exp").style.height = window.innerHeight*0.08
			this.renderer = new PIXI.WebGLRenderer ( window.innerWidth, window.innerHeight-header+1 ); //PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight-header+1);
			this.canvas = document.getElementById("container-exp").appendChild(this.renderer.view);
			this.canvas.style.marginTop = header
			this.canvas.style.display = "none"

			this.stats = new Stats();
		    document.body.appendChild( this.stats.domElement );
		    this.stats.domElement.style.position = "absolute";
		    this.stats.domElement.style.top = "0px";
		    this.stats.domElement.style.zIndex = 10;
		    this.stats.domElement.id = "stats"
		    this.stats.domElement.style.display = "none"

		}

		this.render = function(_stage){
			this.renderer.render(_stage);
		}

		this.show = function(){
			this.canvas.style.display = "inline";
			document.getElementById("header-exp").style.display = "inline"
		}


		this.hide = function(){
			this.canvas.style.display = "none";
				document.getElementById("header-exp").style.display = "none"
		}
	}


/*
-------------------------------------------------------------------------------------------------------------
                                               Class: AssetsLoader
-------------------------------------------------------------------------------------------------------------
*/

	function Assets(){

		this.sounds = {}
		this.sounds.numbers = []

		this.sprites = {};
		this.textures = {};


		this.loader = PIXI.loader;
		this.pixiLoaderQueue = [];
		this.textureQueue = [];
		this.soundsQueue = [];
		this.soundsNQueue = [];

		this.state = "loading";
	};

	Assets.prototype.addSprite = function(name,url,count){

		if(name == "undefined" || url == "undefined" || count == "undefined") {

			throw ("3 parameters required. [name,jsonurl,pngUrl,imageCount]")

		}

		for (var i=0; i<this.pixiLoaderQueue.length; i++){

			if( url == String(this.pixiLoaderQueue[i][1]) ){

				return

			}

		}

		this.pixiLoaderQueue.push([name,url,count])
	}

	Assets.prototype.addTexture = function(name,url){

		this.textureQueue.push([name,url]);
	};

	Assets.prototype.addSound = function(name,url){


		if(typeof(name) == "number"){

			this.soundsNQueue.push([name,url])

		}else{

			this.soundsQueue.push([name,url])

		}

	};

	Assets.prototype.load = function(_callback){

		console.log("loading sprites assets...")

		this.callback = _callback

		var _this = this

		if(this.pixiLoaderQueue.length > 0){

			for(var i=0; i<this.pixiLoaderQueue.length; i++){

				this.loader.add(this.pixiLoaderQueue[i][1])

			}

			this.loader.load( function(){
				console.log("PIXI loader call back")
				_this.start()
			})

		}else{

			this.start()

		}
	};

	Assets.prototype.start = function(){

		console.log("creating pixi objects...")
		this.sounds = {}
		this.sounds.numbers = {}
		this.sprites = {}
		this.textures = {}

		for( var i=0; i < this.textureQueue.length; i++){

			this.textures[this.textureQueue[i][0]] = new PIXI.Texture.fromImage(this.textureQueue[i][1])

		}

		for( var i=0; i < this.soundsQueue.length; i++){

			this.sounds[this.soundsQueue[i][0]] = []

		}

		for( var i=0; i < this.soundsQueue.length; i++){

			this.sounds[this.soundsQueue[i][0]].push(new Audio('audio/' + this.soundsQueue[i][0] + '/' + this.soundsQueue[i][1]))

		}


		for( var i=0; i < this.soundsNQueue.length; i++){

			this.sounds.numbers[String(this.soundsNQueue[i][0])] = new Audio('audio/' + language + '/' + this.soundsNQueue[i][1])

		}

		for( var i=0; i < this.pixiLoaderQueue.length; i++){

			this.sprites[this.pixiLoaderQueue[i][0]] = []

			for(var j=0; j < this.pixiLoaderQueue[i][2]; j++){

				this.sprites[this.pixiLoaderQueue[i][0]].push(

					PIXI.Texture.fromFrame( this.pixiLoaderQueue[i][0] +  '-' + j + '.png')

					)
			}

		}

		this.callback()
	};

	Assets.prototype.destroy = function(){

		this.loader.reset()

		for (sounds in this.sounds.numbers){

			this.sounds.numbers[sounds] = []

		}

		for (sounds in this.sounds){

			this.sounds[sounds] = []

		}

		for(sprites in this.spritres){

			this.sprites[sprites].destroy(true)

		}

		for(textures in this.textures){

			this.textures[textures].destroy(true)
		}
	};

/*
-------------------------------------------------------------------------------------------------------------
                                               Class: Round
-------------------------------------------------------------------------------------------------------------
*/

	function Round(){

		this.trial = {}
		this.score;
		this.difficulty = 0;
		this.scoreDifferential = 0;
		this.trial;

	}

	Round.prototype.init = function(_Trial,_stage, stimuli){
		//console.log("round stimuli:");
		//console.log(stimuli);
		this.stage = _stage;
		this._trial = _Trial;
		this.stimuli = stimuli;
	  this.background = new PIXI.Sprite(assets.textures.bg);

	 	this.stage.addChild(this.background);

	 	this.getNextTrial();
	 	session.render(_stage);

	   	//console.log(x, x.width)

	   	// var ratio = this.background.height/this.background.width
	    this.background.width = session.canvas.width;
	    this.background.height = session.canvas.height;



	}

	Round.prototype.getNextTrial = function(){

		//var stim = stimQueues['numberstim'].pop();
	 	this.trial = new this._trial(this.stimuli.pop());
	  this.trial.init();

	}

	Round.prototype.storeSession = function(stim, queue_name) {
		//storeSession();
		// when do we actually want to push everything back to local storage?
		// if we do it each time they quit a game, we have to pull it back from LS again if they reopen
	}

	Round.prototype.destroy = function(){

		this.trial.destroy()
		this.stage.removeChild(this.background)
	    this.background.destroy(true,true)

	}

	Round.prototype.play = function(){

		if(this.trial.play()){
			this.stimuli.push(this.trial.storeStim());
			this.trial.destroy();
			console.log("last trial destroyed!");
			this.getNextTrial();
			console.log("new trial created!");
		}

	};

	//-----------------------------
	//    Handling difficulty
	//-----------------------------

	Round.prototype.changeDifficulty = function(_correct,_value){

		console.log(this.difficulty,this.scoreDifferential,this.scoreTrashhold[0])

		//if the input was a correct one
		if(_correct){

			this.scoreDifferential = this.scoreDifferential + 1

		// if the input was wrong
		}else{

			this.scoreDifferential =  this.scoreDifferential - 1
		}

		if(this.scoreDifferential >= this.scoreTrashhold[1]){

			console.log("increasing difficulty")
			this.difficulty++
			this.scoreDifferential = 0
		}

		if(this.scoreDifferential <= this.scoreTrashhold[0]){

			console.log("decreasing difficulty")
			this.difficulty--
			this.scoreDifferential = 0

		}

		if(this.diffRange != undefined){

			if(this.difficulty < this.diffRange[0]){
				
				this.difficulty = this.diffRange[0]
			};

			if(this.difficulty > this.diffRange[1]){
				
				this.difficulty = this.diffRange[1]
			};

		}

		console.log(this.difficulty)

	};

	Round.prototype.setDifficultyParams = function(_trashhold,_range,_start){

		this.diffRange = _range;
		this.scoreTrashhold = _trashhold;
		this.difficulty = _start || this.diffRange[0]

	};



/*
-------------------------------------------------------------------------------------------------------------
                                               Class: Score
-------------------------------------------------------------------------------------------------------------
*/

function gameScore(){

	this.score = 0;
	this.starts = [];


};

gameScore.prototype.addScore = function(_starsPos, _value, _delay){

	this.score = this.score + (_starsPos.length * _value); 
	var initDelay = _delay || 200;
	var delay = 0

	console.log(_starsPos)

	for(var i = 0; i < _starsPos.length; i++){

		var star = new PIXI.Sprite(assets.textures.star);
		star.x = _starsPos[i].x;
		star.y = _starsPos[i].y;

		this.stage.addChild(star);
		
		var starAnimation = new animation(star);
		starAnimation.init({x:session.canvas.width - star.width/2, y:-star.width/2},1000,delay,[0,1]);
		delay = delay + initDelay

		this.starts.push([star,starAnimation]);

	};




};

gameScore.prototype.displayStar = function(){

		var animationDone = true

		for(var i = 0; i < this.starts.length; i++){
			
			if(this.starts[i][1].run()){

				this.stage.removeChild(this.starts[i][0])
				this.starts[i][0].destroy()
				this.starts[i][0] = []
				this.starts[i][1] = []
				this.starts.splice(i,1);


			}else{

				animationDone = false

			};

		};

		if(animationDone){
		
			return true;

		}

		return false;

};
