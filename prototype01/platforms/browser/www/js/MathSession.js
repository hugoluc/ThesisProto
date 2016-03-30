function mathSession(){

	this.renderer = {};
	this.canvas = 2;


	this.init = function(){

		var header = document.getElementById("header-exp").style.height = window.innerHeight*0.08
		renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight-header+1,{antialias: true});
		this.canvas = document.getElementById("container-exp").appendChild(renderer.view);
		this.canvas.style.marginTop = header
		this.canvas.style.display = "none"

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
