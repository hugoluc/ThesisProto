function mathSession(){

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
	}

	
	this.hide = function(){
		this.canvas.style.display = "none";	
	}

}
