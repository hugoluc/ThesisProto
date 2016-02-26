
function proto02(){

var statsBol = true;

if(statsBol){
    stats = new Stats(); 
    document.body.appendChild( stats.domElement );
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = "0px";
    stats.domElement.style.zIndex = 10;
}

var sprites = {}
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight-51);
var canvas = document.getElementById("container-exp").appendChild(renderer.view);
canvas.style.marginTop = "0px"

console.log("canvasHeight", canvas.height)

//var canvas = document.body.appendChild(renderer.view);
// create the root of the scene graph
var stage = new PIXI.Container();
var thisGame = new Game();

PIXI.loader
    .add('sprites/backGrounds/BackGround-01.png')
    .add('sprites/ladyBug/ladyBug_Walk.json')
    .load(onAssetsLoaded);

var movies = [];
var lady1;
var lady2;

function onAssetsLoaded()
{

    gameStart()        
    update();
}

function update() {

    if(statsBol)stats.begin()
    thisGame.play()

    // update the canvas with new parameters
    renderer.render(stage);//---------------->> thing that renders the whole stage
    requestAnimationFrame(update);
    if(statsBol)stats.end()

}

function gameStart(){
    
    // create an array of textures from an image path
    var frames = [];

    for (var i = 0; i < 4; i++) {
        
       var val = i < 10 ? '0' + i : i;

        // magically works since the spritesheet was loaded with the pixi loader
        frames.push(PIXI.Texture.fromFrame('ladyBug_Walk-0' + (i+1) + '.png'));
    }

    sprites.ladybugWalk = frames 

    thisGame.init()
};


//----------------------------------
function ladyBug(){

    // container variables
    this.container = new PIXI.Container()
    this.container.interactive = true
    this.container.buttonMode = true
    this.container.mousedown = this.container.touchstart = this.click

    // sprite variables
    this.sprite = new PIXI.extras.MovieClip(sprites.ladybugWalk);
    this.sprite.animationSpeed = 0.1;
    this.sprite.play()
    this.container.addChild(this.sprite)


    //number variables
    this.number =  new PIXI.Text("12", {font:"30px Arial", fill:"blue", stroke:"green", strokeThickness: 3, });
    this.number.x = this.sprite.x + (this.sprite.width/2) - this.number.width/2
    this.number.y = this.sprite.y + (this.sprite.height/2) - this.number.height/2
    this.container.addChild(this.number)

    stage.addChild(this.container)


    //----------------------class variables
    this.angle = 0;
    this.start = {}
    this.end = {}


};

ladyBug.prototype.setUp = function(freeIds){

    // reset 
    this.number.text = getRandomInt(2,10);
    this.container.ySpeed = 5/this.number.text  
    this.sprite.animationSpeed = 0.2/Math.sqrt(this.number.text);

    var moduleCount = window.innerWidth/this.sprite.width 
    console.log(Math.floor(moduleCount))

    if(freeIds == undefined ){
        var moduleId = getRandomInt(0,Math.floor(moduleCount));
    }else{
        var moduleId = freeIds[getRandomInt(0,freeIds.length)];
    }

    this.start.x = moduleId * this.sprite.width;
    this.start.y = window.innerHeight;
   
    this.end.x = getRandomInt(this.start.x-this.sprite.width*2,this.start.x+this.sprite.width*2); 
    this.end.y = -this.sprite.height;
    if(this.end.x > stage.width){
        this.end.x = stage.width;
    }else if(this.end.x < 0){
        this.end.x = 0;
    };

    this.container.xSpeed = (this.start.x-this.end.x)/(this.start.y - this.end.y)
    if(this.start.x > this.end.x){ this.container.xSpeed*-1}


    this.container.rotation = getAngle(this.start.x,this.start.y,this.end.x,this.end.y)
    this.container.x = this.start.x;
    this.container.y = this.start.y;

    return moduleId;

}

ladyBug.prototype.move = function(){

    //console.log(this.container.y)
    this.container.y = this.container.y - this.container.ySpeed;
    this.container.x = this.container.x - this.container.xSpeed;


    if(this.container.y  < this.end.y){

        this.container.y = this.start.y;
        this.setUp()

    }

};

ladyBug.prototype.click = function(){

    var text = this.getChildAt(1).text--;

    if(text < 2){

        this.ySpeed = 10;
        this.getChildAt(0).animationSpeed = 0.3

    }

}


//---------------------------------GAME
function Game(){

    this.ladyBugs = []
    this.score = 0
    this.request = 0
    this.background = PIXI.Sprite.fromImage('sprites/backGrounds/BackGround-01.png')
    stage.addChild(this.background)

}


Game.prototype.init = function(){

    for(var i=0; i<6; i++){

        this.ladyBugs.push(new ladyBug())
        this.ladyBugs[i].setUp()
    }

}

Game.prototype.play = function(){

    for(var i=0; i<this.ladyBugs.length; i++){

        this.ladyBugs[i].move()

    }

}









}