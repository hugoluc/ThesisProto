function proto02(){





var sprites = {}
var renderer = PIXI.autoDetectRenderer(800, 600);
var canvas = document.body.appendChild(renderer.view);
// create the root of the scene graph
var stage = new PIXI.Container();
var thisGame = new Game();

PIXI.loader
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

    thisGame.play()

    // update the canvas with new parameters
    renderer.render(stage);//---------------->> thing that renders the whole stage
    requestAnimationFrame(update);

}





function gameStart(){
    
    // create an array of textures from an image path
    var frames = [];

    for (var i = 0; i < 4; i++) {
        
       var val = i < 10 ? '0' + i : i;

        // magically works since the spritesheet was loaded with the pixi loader
        frames.push(PIXI.Texture.fromFrame('ladybugsrites-0' + (i+1) + '.png'));
    }

    sprites.ladybugWalk = frames
    thisGame.init()
};


//----------------------------------
function ladyBug(){

    this.sprite = new PIXI.extras.MovieClip(sprites.ladybugWalk);
    this.sprite.x = getRandomInt(0,600);
    this.sprite.y = 200;
    this.sprite.on("click", function(){
        console.log("something")
    });

    this.sprite.animationSpeed = 0.1
    this.sprite.play()
    stage.addChild(this.sprite)

};

ladyBug.prototype.move = function(){

    this.sprite.y = this.sprite.y - 1;
    if(this.sprite.y  < 0){
        this.sprite.y = 600

    }

};



//---------------------------------GAME
function Game(){

    this.ladyBugs = []
    this.score = 0
    this.request = 0

}


Game.prototype.init = function(){

    for(var i=0; i<6; i++){

        this.ladyBugs.push(new ladyBug())

    }

}

Game.prototype.play = function(){

    for(var i=0; i<this.ladyBugs.length; i++){

        this.ladyBugs[i].move()

    }

}









}