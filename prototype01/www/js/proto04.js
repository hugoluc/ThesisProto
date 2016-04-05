var proto4loaded = true	

function proto04(){


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
 		
	    session.show()
	    console.log("----") 
	    update();

	}

	if(proto4loaded){

		assets.addSprite(["ripple",'sprites/lillypad/ripples/ripples.json','sprites/lillypad/ripples/ripples.png',4])
		assets.load(onAssetsLoaded)

	}else{

	    onAssetsLoaded(onAssetsLoaded);

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