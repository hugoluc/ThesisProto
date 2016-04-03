function proto04(){


/*
-------------------------------------------------------------------------------------------------------------
                                               Class: Assets
-------------------------------------------------------------------------------------------------------------
*/
    function Assets(){

        this.textures = {};
        this.sounds = [];
    };
    
    Assets.prototype.load = function(){

        this.textures.stick = {

            stick: new PIXI.Texture.fromImage("sprites/stick/stick.png"),
            leave: new PIXI.Texture.fromImage("sprites/stick/leave.png"),
            branch: new PIXI.Texture.fromImage("sprites/stick/branch.png")

        }

        this.textures.lillySmall = new PIXI.Texture.fromImage("sprites/lillypad/small-01.png")
        this.textures.ants = new PIXI.Texture.fromImage("sprites/lillypad/ant.png")
        this.textures.bg = new PIXI.Texture.fromImage("sprites/backGrounds/BackGround-04.png")
    };

    Assets.prototype.destroy = function(){
    
        this.textures.stick.stick.destroy(true,true)
        this.textures.stick.leave.destroy(true,true)
        this.textures.stick.branch.destroy(true,true)
        this.textures.lillySmall.destroy(true,true)
        this.textures.ants.destroy(true,true)
        this.textures.bg.destroy(true,true)
        console.log(this.textures)
        this.textures = null;
        this.sounds = null;
    };




/*
-------------------------------------------------------------------------------------------------------------
                                               Class: Assets
-------------------------------------------------------------------------------------------------------------
*/



	console.log("game!")

	this.destroy = function(){

		finishGame = true;
	    session.hide()
	}


	var statsBol = false;

	// create the root of the scene graph and main classes
	var stage = new PIXI.Container();
	var assets = new Assets()

	function onAssetsLoaded(){
 		
 		assets.load()
	    session.show()
	    console.log("----") 
	    update();


	}

	if(proto3loaded){

	    PIXI.loader
	    .load(onAssetsLoaded);

	    proto3loaded = false;

	}else{

	    onAssetsLoaded();

	}

	//---------------------------------------LOOP

	var finishGame = false

	var previousTime = Date.now();
	var MS_PER_UPDATE = 16.66667;
	var lag = 0

	function update() {

	    if(finishGame){

	        finishGame = false
	        assets.destroy()
	        currentview = new Chooser()

	    }

	        if(statsBol)stats.begin()

	        	//update position based on espectaed frame rate
		        var current = Date.now();
		        var elapsed = current - previousTime;
		        previousTime = current;
		        lag = lag + elapsed;


		        while (lag >= MS_PER_UPDATE){           
		            lag = lag - MS_PER_UPDATE;
		        }

		        //---------------->> Thing that renders the whole stage
		        session.render(stage)


		        requestAnimationFrame(update);

	        if(statsBol)stats.end()
	        
	}


}