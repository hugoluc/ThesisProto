function spellingGame(){
  /*
  -------------------------------------------------------------------------------------------------------------
                                                 Class: Assets
  -------------------------------------------------------------------------------------------------------------
  */
  function Assets(){
      this.sprites = {};
      this.sounds = [];
  }

  Assets.prototype.load = function(){
    var bg_texture = PIXI.Texture.fromImage("svgs/sky-grass.svg");
    this.sprites.background = new PIXI.Sprite(bg_texture);
    var sun = new PIXI.Texture.fromImage("svgs/sun.svg")
    this.sprites.sun = new PIXI.Sprite(sun);
    var smiley = PIXI.Texture.fromImage("svgs/smiley.svg"); //'_assets/basics/bunny.png');
    this.sprites.smiley = new PIXI.Sprite(smiley);
    var cloud = PIXI.Texture.fromImage("svgs/cloud-1.svg");
    this.sprites.cloud = new PIXI.Sprite(cloud);
    var rainbow = PIXI.Texture.fromImage("svgs/rainbow.svg");
    this.sprites.rainbow = new PIXI.Sprite(rainbow);

    // load all alphabet audio files
    for (var i = 0; i < letters.length; i++) {
      this.sounds.push(new Audio('audio/' + language + '/' + letters[i].audio + '.mp3'));
    }

  }

  Assets.prototype.destroy = function(){
      this.sprites = [];
      this.sounds = [];
  }


  //var renderer = PIXI.autoDetectRenderer(screen_width-5, screen_height-5, {backgroundColor : 0x1099bb});
  //document.body.appendChild(renderer.view);

  var speed = .2 // scale up or down based on performance

  function Sun() {
    var _this = this;
    this.sprite = new PIXI.Sprite(assets.sprites.sun);
    this.sprite.scale.x = .6;
    this.sprite.scale.y = .6;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.position.x = 50;
    this.sprite.position.y = 50;
    stage.addChild(this.sprite);
    // on click (or when they score) let's make the sun swell a bit
  }

  function Background() {
    var _this = this;
    this.sprite = new PIXI.Sprite(assets.sprites.background);
    this.sprite.scale.x = 2.5; //screen_width / bg.width;
    this.sprite.scale.y = 2.1;//screen_height / bg.height;
    //stage.addChild(this.sprite);
  }


  function Rainbow() {
    //var rainbow = PIXI.Texture.fromImage("../svgs/rainbow.svg");
    var _this = this;
    this.sprite = new PIXI.Sprite(assets.sprites.rainbow);
    this.sprite.scale.x = .3;
    this.sprite.scale.y = .3;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.rotation = Math.PI / 2;
    this.sprite.position.x = screen_width - 90;
    this.sprite.position.y = screen_height - 200;
    stage.addChild(this.sprite);
  }


  var textStyle = {
      font : '40px Arial',
      stroke : '#000000',
      strokeThickness : 3
  };

  // bounding box for stimuli
  var boundsPadding = 100;
  //var bounds = new PIXI.Rectangle(-boundsPadding, -boundsPadding,
  //                                    renderer.width + boundsPadding * 2,
  //                                    renderer.height + boundsPadding * 2);

  // create a new Sprite using the texture
  function Stimulus(text, isTarget) {
    var _this = this;
    this.container = new PIXI.Container();
    this.container.buttonMode = true; // cursor turns into hand on mouseover
    this.container.interactive = true;
    this.container.isClicked = false;
    this.container.position.x = getRandomInt(-150,-50);
    this.container.position.y = getRandomInt(100,510);
    console.log(assets.sprites);
    this.sprite = new PIXI.Sprite(assets.sprites.cloud); //
    //this.sprite = {};
    // center the sprite's anchor point
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.anchor.set(.5)
    this.sprite.scale.x = .8;
    this.sprite.scale.y = .8;

    //stim.on('mousedown', onDown);
    //stim.on('touchstart', onDown);

    this.container // events for drag start
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
    this.container.addChild(this.sprite);

    this.txt = new PIXI.Text(text,textStyle);
    this.txt.x = -25;
    this.txt.y = -25;
    this.container.addChild(this.txt);
    this.speed = speed + Math.random(); // + or * difficulty
    this.offset = getRandomInt(1,20);

    //stage.addChild(this.container);
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

  /*
  -------------------------------------------------------------------------------------------------------------
                                                  Class: Round
  -------------------------------------------------------------------------------------------------------------
  */
      function Round(){
          this.score = 0;
          this.language = "english"
          //this.background = PIXI.Sprite.fromImage('sprites/backGrounds/BackGround-01.png');
          // this.background.height = canvas.height;
          this.background = new Background();
          stage.addChild(this.background.sprite);
      }

      // Round.prototype.getNextTri = function(stim){ }

      Round.prototype.play = function(_updateTime){
          //this.trial.play(_updateTime)
      }

      Round.prototype.init = function(){
        //queuesToUpdate['numberstim'] = true;
        //stim = stimQueues['numberstim'].pop();
        //var audstim = new Audio('audio/' + language + '/' + stim.audio + ".mp3")
        //audstim.play()
        //var specsthis = this.getNextTri(stim);
        //while (!quit) {
          //this.trial = new Trial(stim); // then we recycle this trial...for now (could make a loop here)
          //this.trial.init();
        //}
        this.stim = Stimulus("A", true);
        stage.addChild(this.stim.container);
      }

      Round.prototype.destroy = function(){
          this.trial.destroy()
          stage.removeChild(this.background)
          this.background.destroy(true,true)
      }




/*
-------------------------------------------------------------------------------------------------------------
                                        Global variables and functions
-------------------------------------------------------------------------------------------------------------
*/

  stage = new PIXI.Container(); // these were private (var stage)
  var assets = new Assets();
  var thisRound = new Round();

  //var bg = new Background();
  var sun = new Sun();
  var onscreen = [];
  var rainbow = Rainbow();
  //var stim_container = new PIXI.Container();
  //stim_container.addChild(createStimulus("A", true));
  //stim_container.addChild(createStimulus("B", false));
  //stage.addChild(stim_container);

  //place fps elements
  var statsBol = true;
  if(statsBol){

      stats = new Stats();
      document.body.appendChild( stats.domElement );
      stats.domElement.style.position = "absolute";
      stats.domElement.style.top = "0px";
      stats.domElement.style.zIndex = 10;
  }

  this.destroy = function(){
      finishGame = true;
      session.hide()
  }

  function onAssetsLoaded(){
      assets.load()
      session.show()
      thisRound.init()
      update();
  }

  if(!game_loaded){
    console.log("--------------------------------------");
    PIXI.loader
      .add("svgs/sun.svg")
      .add("svgs/sky-grass.svg")
      .add("svgs/rainbow.svg")
      .add("svgs/cloud-1.svg")
      .load(onAssetsLoaded);
    game_loaded = true;
  } else{
    onAssetsLoaded();

    onscreen.push(Stimulus("A", true));
    onscreen.push(Stimulus("B", true));
    for(var i=0; i<onscreen.length; i++) {
      stage.addChild(onscreen[i]);
    }
  }

  var finishGame = false
  var previousTime = Date.now();
  var MS_PER_UPDATE = 16.66667;
  var lag = 0

  var offset = 2
  var tick = 0;

  // animation loop
  function update() {

      if(finishGame){
          console.log('finishGame - storing session!');
          storeSession();
          thisRound.destroy();
          finishGame = false;
          currentview = new Chooser(); // return assets? that's why nodes increase..
      }

      if(statsBol) stats.begin();

      var current = Date.now();
      var elapsed = current - previousTime;
      previousTime = current;
      lag = lag + elapsed;

      while (lag >= MS_PER_UPDATE){
        thisRound.play(lag/MS_PER_UPDATE);
        //adjustGameDynamics()
        lag = lag - MS_PER_UPDATE;
      }

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
      sun.rotation -= .001;

      // update the canvas with new parameters
      //---------------->> Thing that renders the whole stage
      tick += .1;
      session.render(stage)
      requestAnimationFrame(update);
      if(statsBol) stats.end()
  }
}
