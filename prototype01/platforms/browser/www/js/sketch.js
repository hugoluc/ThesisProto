var img;  // Declare variable 'img'.
var x = 900

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  img = loadImage("svgs/ladybug-01.png");  // Load the image
  console.log("ddd")
}


function draw() {


	if(allcanvas){
	
		background(123);
		x = x - 1;

		for(var i=0; i<9; i++){
			img(getRandomInt(0,800),x)
		}		
	}



}