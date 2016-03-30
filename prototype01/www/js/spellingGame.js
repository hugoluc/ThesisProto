var renderer = PIXI.autoDetectRenderer(screen_width-5, screen_height-5, {backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

var speed = .2 // scale up or down based on performance

// create the root of the scene graph
var stage = new PIXI.Container();

function createBackground() {
  var bg_texture = PIXI.Texture.fromImage("../svgs/sky-grass.svg");
  var bg = new PIXI.Sprite(bg_texture);
  bg.scale.x = 2.5; //screen_width / bg.width;
  bg.scale.y = 2.1;//screen_height / bg.height;
  stage.addChild(bg);
}

createBackground();


function createSun() {
  var sun = new PIXI.Texture.fromImage("../svgs/sun.svg")
  sunsp = new PIXI.Sprite(sun);
  sunsp.scale.x = .6;
  sunsp.scale.y = .6;
  sunsp.anchor.x = 0.5;
  sunsp.anchor.y = 0.5;
  sunsp.position.x = 50;
  sunsp.position.y = 50;
  stage.addChild(sunsp);
  // on click (or when they score) let's make the sun swell a bit
  return(sunsp);
}

var sunsp = createSun();

//
function createRainbow() {
  var rainbow = PIXI.Texture.fromImage("../svgs/rainbow.svg");
  var rb = new PIXI.Sprite(rainbow);
  rb.scale.x = .3;
  rb.scale.y = .3;
  rb.anchor.x = 0.5;
  rb.anchor.y = 0.5;
  rb.rotation = Math.PI / 2;
  rb.position.x = screen_width - 90;
  rb.position.y = screen_height - 200;
  stage.addChild(rb);
  return(rb);
}

var rainbow = createRainbow();

// create a texture from an image path
var smiley = PIXI.Texture.fromImage("../svgs/smiley.svg"); //'_assets/basics/bunny.png');

var cloud = PIXI.Texture.fromImage("../svgs/cloud-1.svg");

var textStyle = {
    font : '40px Arial',
    stroke : '#000000',
    strokeThickness : 3
};

// bounding box for stimuli
var boundsPadding = 100;
var bounds = new PIXI.Rectangle(-boundsPadding, -boundsPadding,
                                    renderer.width + boundsPadding * 2,
                                    renderer.height + boundsPadding * 2);

// create a new Sprite using the texture
function createStimulus(text, isTarget) {
  var stim = new PIXI.Sprite(cloud);
  // center the sprite's anchor point
  stim.anchor.x = 0.5;
  stim.anchor.y = 0.5;
  stim.buttonMode = true; // cursor turns into hand on mouseover
  stim.interactive = true;
  stim.anchor.set(.5)

  stim.isClicked = false;

  //stim.on('mousedown', onDown);
  //stim.on('touchstart', onDown);

  stim // events for drag start
    .on('mousedown', onDragStart)
    .on('touchstart', onDragStart)
    // events for drag end
    .on('mouseup', onDragEnd)
    .on('mouseupoutside', onDragEnd)
    .on('touchend', onDragEnd)
    .on('touchendoutside', onDragEnd)
    // events for drag move
    .on('mousemove', onDragMove)
    .on('touchmove', onDragMove);

  var txt = new PIXI.Text(text,textStyle);
  txt.x = -25;
  txt.y = -25;
  stim.addChild(txt);
  stim.position.x = getRandomInt(-150,-50);
  stim.position.y = getRandomInt(100,510);
  stim.scale.x = .8;
  stim.scale.y = .8;
  stim.speed = speed + Math.random(); // + or * difficulty
  stim.offset = getRandomInt(1,20)
  return(stim);
}

// make bigger with click
function onDown (eventData) {
    this.scale.x += 0.3;
    this.scale.y += 0.3;
}


function onDragStart(event) {
    // store a reference to the data because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

var onscreen = [];

//var stim_container = new PIXI.Container();
//stim_container.addChild(createStimulus("A", true));
//stim_container.addChild(createStimulus("B", false));
//stage.addChild(stim_container);
onscreen.push(createStimulus("A", true));
onscreen.push(createStimulus("B", true));
for(var i=0; i<onscreen.length; i++) {
  stage.addChild(onscreen[i]);
}


var offset = 2
var tick = 0;
// start animating
animate();
function animate() {
    for (var i = 0; i < onscreen.length; i++) {
      st = onscreen[i];
      if(st.position.x > bounds.width) {
        stage.removeChild(st);
      } else {
        st.position.x += st.speed;
        st.scale.y = 0.97 + Math.sin(tick + st.offset) * 0.02;
        st.position.y += Math.sin(tick + st.offset) * .3;
      }
    }
    sunsp.rotation -= .001;
    //stim_container.position.x += .7;
    //stim_container.scale.y = 0.97 + Math.sin(tick + offset) * 0.02;
    //onscreen[0].rotation += 0.1;
    //onscreen[1].rotation -= 0.1;
    //onscreen[2].rotation -= 0.2;
    //onscreen[1].position.x -= 1;
    //onscreen[2].scale.x -= 0.01;
    tick += .1;
    renderer.render(stage);
    requestAnimationFrame(animate);
}
