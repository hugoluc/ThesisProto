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
		this.sounds.letters = []
		this.sounds.words = []
		this.sprites = {};
		this.textures = {};


		this.loader = PIXI.loader;
		this.pixiLoaderQueue = [];
		this.textureQueue = [];
		this.soundsQueue = [];
		this.soundsNQueue = [];
		this.soundsLetterQueue = [];
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

		} else if(name.length===1){

			this.soundsLetterQueue.push([name,url])

		} else if(typeof(name)== "word"){ // need to distinguish words from generic sounds (bc they have different folders)

			this.soundsWordQueue.push([name,url])

		} else {

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
		this.sounds.words = {}
		this.sounds.alphabet = {}
		this.sounds.letters = {}
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

		// numbers are just like other words, so we might not need a separate Queue
		if(this.soundsNQueue) {

			for( var i=0; i < this.soundsNQueue.length; i++){
				this.sounds.numbers[String(this.soundsNQueue[i][0])] = new Audio('audio/' + language + '/' + this.soundsNQueue[i][1])
			}
		}

		if(this.soundsLetterQueue) {

			for( var i=0; i < this.soundsLetterQueue.length; i++){

				var path = 'audio/' + language + '/alphabet/' + this.soundsLetterQueue[i][1];
				this.sounds.letters[String(this.soundsLetterQueue[i][0])] = new Audio(path);
			}
		}

		if(this.soundsWordQueue) {

			for( var i=0; i < this.soundsWordQueue.length; i++){
				this.sounds.words[String(this.soundsNQueue[i][0])] = new Audio('audio/' + language + '/' + this.soundsWordQueue[i][1])
			}
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

	Round.prototype.init = function(_Trial,_stage, _stimuli){

		this.stage = _stage;
		this._trial = _Trial;
		this.stimuli = _stimuli;
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

		//var stim = this.stimuli.pop();
		//console.log("Round.getNextTrial stim:")
		//console.log(stim);
		//console.log(this.stimuli.pop()); // this does get the next one
	 	this.trial = new this._trial(this.stimuli.pop());

	  	if(this.trial.init != undefined){

				this.trial.init();
		}
	}

	Round.prototype.storeSession = function(stim, queue_name) {
		//storeSession();
		// push queue back to localstorage each time they quit a game
	}

	Round.prototype.destroy = function(){

		
		this.stage.removeChild(this.background)
		this.background.destroy(true,true)

		this.trial.destroy(this.stage)

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

			console.log("increasing difficulty");
			this.difficulty++;
			this.scoreDifferential = 0;
		}

		if(this.scoreDifferential <= this.scoreTrashhold[0]){

			console.log("decreasing difficulty");
			this.difficulty--;
			this.scoreDifferential = 0;

		}

		if(this.diffRange != undefined){

			if(this.difficulty < this.diffRange[0]){

				this.difficulty = this.diffRange[0]
			};

			if(this.difficulty > this.diffRange[1]){

				this.difficulty = this.diffRange[1];

			};

		}

		console.log("difficulty: ", this.difficulty);

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

	function gameScore(_round){

		this.score = 0;
		this.stars = [];
		this.svgIds = 0;
		this.starLength = 0;
		this.explosion = [];
		this.stage = {};

	};


	gameScore.prototype.addScore = function(_starsPos, _value, _duration, _svg, _index){

		this.score = this.score + (_starsPos.length * _value);
		this.valuePerStar = _value;
		var initDelay = 300;
		var delay = 0;
		var duration = _duration || 1000;
		this.index = _index || this.stage.children.length;

		if(_svg){ // draw svg star

			this.svg = true;
			var starGroup = d3.select("#scoreContainer")
			.append("svg")
			.attr("id", "starGroup")
			.attr({
			  x: 0,
			  y: 0,
			  width : window.innerWidth,
			  height : window.innerHeight,

			})

			for(var i = 0; i < _starsPos.length; i++){

				var starSvg = starGroup.append("svg:image")
				.attr("xlink:href", "svgs/starScore.svg")
				.attr({
				  x: _starsPos[i].x,
				  y: _starsPos[i].y,
				  width : 100,
				  height : 100,
				})
				.attr("id", "star-" + (this.starLength + 1))
				.transition()
				.delay(delay)
				.duration(_duration)
				.attr({
					x: window.innerWidth - 50,
					y: -50,
				})
				.each("end", function(){
				// Animation callback
					var id = this.id
					var _this = d3.select("#" + id).remove()
				});

				this.starLength = this.starLength + 1;
				delay = delay + initDelay
			};


		}else{// draw PIXI canvas star

			this.svg = false;

			for(var i = 0; i < _starsPos.length; i++){

				var star = new PIXI.Sprite(assets.textures.star);
				star.x = _starsPos[i].x;
				star.y = _starsPos[i].y;
				star.anchor.x = 0.5
				star.anchor.y = 0.5
				star.width = 10;
				star.height = 10;

				this.stage.addChildAt(star,this.index);

				//set animation for position
				var starAnimation = new animation(star);
				starAnimation.init({x:session.canvas.width - 25, y: -50},duration,0,[0,1]);

				//set animation for size
				var starFeaAnimation = new animation(star);
				starFeaAnimation.initFeature(
					["width", "height"], // features to animate
					90, // final size
					duration, // time value
					delay, // delay
					[0,0] // bezier courve
				);

				//set animation for rotation
				var startRotation = new animation(star);
				startRotation.initFeature(

					"rotation", // features to animate
					Math.PI * 2, // final position
					duration, // time value
					delay, // delay
					[0,1] // bezier courve

				);

				delay = delay + initDelay
				this.stars.push([star,starAnimation,starFeaAnimation,startRotation]);

			};

		};
	};

	gameScore.prototype.displayStar = function(){

		var animationDone = true


		for(var i = 0; i < this.stars.length; i++){



			if(!this.stars[i][2].runFeature()){ //call animation function for size on each star

				animationDone = false

			};

			if(!this.stars[i][3].runFeature()){//call animation for rotation


				animationDone = false

			}else {
								console.log("rotation done!!!")
			};

			if(this.stars[i][1].run()){ //call animation function for position on each star

				this.stage.removeChild(this.stars[i][0])
				this.stars[i][0].destroy()
				this.stars[i][0] = []
				this.stars[i][1] = []
				this.stars.splice(i,1);

				this.addScoreUI()

			}else{

				animationDone = false

			};




		};




		if(animationDone){

			return true;

		}

		return false;
	};

	gameScore.prototype.setExplosion = function(_pos,_radius,_duration){

			var starCount = getRandomInt(30,50)

			for(var i = 0; i < starCount; i++ ){

				var size = getRandomInt(7,15)
				var Estar = new PIXI.Sprite(assets.textures.star);
				Estar.x = _pos.x;
				Estar.y = _pos.y;
				Estar.anchor.x = 0.5
				Estar.anchor.y = 0.5
				Estar.width = size;
				Estar.height = size;

				var angle = getRandomFloat(-Math.PI,Math.PI)
				var duration = getRandomInt(300,_duration)

				var EstarAnimation = new animation(Estar);
				EstarAnimation.init(

					{
						"x" : (_pos.x + Math.cos(angle)*_radius) * (getRandomFloat(0.95,1.05)),
						"y" : (_pos.y + Math.sin(angle)*_radius) * (getRandomFloat(0.95,1.05)),
					},

					duration,
					getRandomInt(0,_duration*0.01),
					[0,1]

				);

				var startERotation = new animation(Estar);
				startERotation.initFeature(

					"rotation", // features to animate
					Math.PI * 4, // final position
					_duration, // time value
					0, // delay
					[0,1] // bezier courve

				);

				var EstarFeaAnimation = new animation(Estar);
				EstarFeaAnimation.initFeature(
					"alpha",
					0,
					duration*0.7, //length
					duration*0.3, // delay
					[0,1]

				);

				this.stage.addChild(Estar)
				this.explosion.push([Estar,EstarAnimation,EstarFeaAnimation,startERotation])

			};

			console.log("explosion set!-------------------------------------------------")
	};

	gameScore.prototype.displayExplosion = function(){

			var animationDone = true

			for(var i = 0; i < this.explosion.length; i++ ){

				if(!this.explosion[i][2].runFeature()){
					animationDone = false

				}

				if(!this.explosion[i][3].runFeature()){

					animationDone = false
				}

				if(this.explosion[i][1].run()){

					this.stage.removeChild(this.explosion[i][0])
					this.explosion[i][0].destroy()
					this.explosion[i][0] = []
					this.explosion[i][1] = []
					this.explosion.splice(i,1);

				}else{

					animationDone = false

				};

			};

			if(animationDone) {
				return true
			}else {
				return false
			}

	};

	gameScore.prototype.addScoreUI = function(){

		var newValue = parseInt(document.getElementById('scoreNumber').innerHTML) + this.valuePerStar;
		document.getElementById('scoreNumber').innerHTML = newValue

		if(newValue > 9){

			if(newValue > 99){

				document.getElementById('scoreNumber').style.left = 10
				document.getElementById('scoreNumber').style.top = 10
				document.getElementById('scoreNumber').style.fontSize = "18pt"

			}else{

				document.getElementById('scoreNumber').style.left = 10

			}

		}
	};
