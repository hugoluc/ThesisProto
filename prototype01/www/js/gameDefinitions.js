/*
-------------------------------------------------------------------------------------------------------------
                                               Class: canvasSession
-------------------------------------------------------------------------------------------------------------
*/

	function CanvasSession(){

		this.renderer = {};
		this.canvas = 2;


		this.init = function(){

			console.log("-----------SESSION--------")


			var header = document.getElementById("header-exp").style.height = window.innerHeight*0.08
			renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight-header+1);
			this.canvas = document.getElementById("container-exp").appendChild(renderer.view);
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
			renderer.render(_stage);
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
                                               Class: Assets
-------------------------------------------------------------------------------------------------------------
*/

	function Assets(){

		this.sounds = {}
		this.sprites = {}
		this.textures = {}


		this.loader = PIXI.loader
		this.pixiLoaderQueue = []
		this.textureQueue = []
		this.soundsQueue = []

		this.state = "loading"

	}

	Assets.prototype.addSprite = function(data){

		console.log(data)
		console.log(this.pixiLoaderQueue)

		if(data.length > 3) {

			throw ("3 parameters required. [name,jsonurl,pngUrl,imageCOunt]")

		}

		for (var i=0; i<this.pixiLoaderQueue.length; i++){
		

			if(data[1] == String(this.pixiLoaderQueue[i][1])){

				return
		
			}
		
		}
		
		this.pixiLoaderQueue.push(data)

	}

	Assets.prototype.addTexture = function(data){
		this.textureQueue.push(data)
	}


	Assets.prototype.addSound = function(data){
		this.soundsQueue.push(data)
	}


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

	}


	Assets.prototype.start = function(){

		console.log("creating pixi objects...")
		this.sounds = {}
		this.sprites = {}
		this.textures = {}

		for( var i=0; i < this.textureQueue.length; i++){

			this.textures[this.textureQueue[i][0]] = new PIXI.Texture.fromImage(this.textureQueue[i][1])
		
		}


		for( var i=0; i < this.soundsQueue.length; i++){
		
			this.textures.push(new Audio('audio/' + language + '/' + this.soundsQueue[i]))
		
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

	}

	Assets.prototype.destroy = function(){


		this.loader.reset()

		for (sounds in this.sounds){
	
			this.sounds[sounds] = []

		}

		for(sprites in this.spritres){
			
			this.sprites[sprites].destroy(true)

		}

		for(textures in this.textures){
			
			this.textures[textures].destroy(true)
		}


	}

/*
-------------------------------------------------------------------------------------------------------------
                                               Class: Round
-------------------------------------------------------------------------------------------------------------
*/



