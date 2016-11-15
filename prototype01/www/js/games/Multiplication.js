var multiplicationLoaded = false;

function Multiplication(){
  logTime('multiplication','start');
  queuesToUpdate['numberstim'] = true;
  var stimuli = stimQueues['numberstim'];
  console.log("----------------------------------", stimuli)


/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Trial
-------------------------------------------------------------------------------------------------------------
*/

  var stimCounter = 0;

  while(stimuli.content[stimCounter].id < 2){
    stimCounter++
  }

  var numbers = [stimuli.content[stimCounter]]

	function Trial(_stimuli,_correct){

    var specs = []
    for(var i = 0; i < numbers.length; i++){

      specs.push({
        stimuli : {
          values : _stimuli.id
        }
      })
    }

    this.counter = 0
    this.played = false;
		this.stimuli = specs[0].stimuli;
    this._stimuli = numbers
		this.aswear = []
		this.boardMatrix = {}
		this.lastTarget = ""
		this.nestCreated = false
		this.nests = []
		this.nestCount = 0
		this.selection = {
			tiles : [],
		}

		this.playState = "intro"
		this.introState = "intruction"

		this.eggs = {}

		this.setBoardSpecs() // set board variables and sizes
    this.setBoardMatrix()

    this.fullNests = {
      "CBL" : [],
      "CBR" : [],
      "CTL" : [],
      "CTR" : [],
      "SB" : [],
      "SL" : [],
      "SR" : [],
      "ST" : [],
      "M" : [],
      "LB" : [],
      "LT" : [],
      "LM" : [],
      "intro" : [],
      "intruction" : []
    }

    var start = {
      x : 0,
      y : 0
    }

    var end = {
      x : this.boardSpecs.columns-1,
      y : this.boardSpecs.rows-1
    }

    var hEnd = {
      x : this.boardSpecs.columns-1,
      y : 0
    }

    var vEnd = {
      x : 0,
      y : this.boardSpecs.rows-1
    }

    var fullNestSelection = this.calculateSelection(start,end)
    var HlineSelection = this.calculateSelection(start,hEnd)
    var VlineSelection = this.calculateSelection(start,vEnd)

    for(var i = 0; i< this.stimuli.values.length; i++){

     this.createFullNests(fullNestSelection)
     this.createFullNests(HlineSelection)
     this.createFullNests(VlineSelection)

    };

    this.createEggs();
		this.timer = new ClockTimer();
		this.timer.start(1000);

	};

  Trial.prototype.createEggs = function(){

    		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    		// Create Sprites for intructions eggs
    		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        //called for moutiple times if stimuli has more than one number
    		for(var i = 0; i < this.stimuli.values.length; i++){

          var container = new PIXI.Container() // container for all eggs of each sirimuli
          var suport = new PIXI.Graphics()
          suport.scale.y = 0.9
          container.addChild(suport)

          var getSpotsId = getRandomInt(1,4)
          var getEggsId;
          if(getRandomInt(0,2) == 0){
            getEggsId = "Blue"
          }else{
            getEggsId = "Orange"
          }

          var _this = this;


          function eggsclicked(){

            if(_this.playState != "Win" && _this.playState != "placingEggs"){
              return;
            }

            console.log(_this.playState)

            if(_this.answearGiven == this.id){ // correct answear given || orrect nest size

              if(_this.playState == "Win" && !this.clicked){
                this.clicked = true

                var pos = {
                  x : this.getBounds().x + (this.getBounds().width/2),
                  y : this.getBounds().y + (this.getBounds().height/2)
                }
                score.addScore([pos], 1, 1000, false)
                score.setExplosion(pos,100,800)

              }
              if(_this.playState == "placingEggs"){
                _this.EggsClickedValue = this.id
                _this.eggsToNestAnimation()
                _this.eggsClicked = true;
              }


            }else{ //wrong answear given || wrong nest size
              _this.eggsClicked = true;
              _this.EggsClickedValue = this.id
              _this.answearGiven = this.id
              _this.eggsToNestAnimation()
            }
          }

          var nCounter = 0;

          // filling container with all eggs and numbers
          for(var j = 0; j < this.stimuli.values[i]; j++){

            var allEggAssests = new PIXI.Container()
            allEggAssests.id = this.stimuli.values[i]
            allEggAssests.interactive = true;
            allEggAssests.on("mousedown", eggsclicked)
            allEggAssests.clicked = false;

            var shadow = new PIXI.Sprite(assets.textures["eggShadow"])
            shadow.anchor.x = 0.5
            shadow.anchor.y = 0.5

            if(j != this.stimuli.values[i]-1){
              shadow.alpha = 0
            }

            allEggAssests.addChild(shadow)

            var sprite = new PIXI.Sprite(assets.textures["egg" + getEggsId])
            sprite.anchor.x = 0.5
      			sprite.anchor.y = 0.5
            allEggAssests.addChild(sprite)

            var spots = new PIXI.Sprite(assets.textures["spot0" + getSpotsId])
            spots.anchor.x = 0.5
      			spots.anchor.y = 0.5
            spots.scale.x = 0.99
            spots.scale.y = 0.99
            allEggAssests.addChild(spots)

            var circle = new PIXI.Graphics()
            circle.lineStyle(0);
            circle.beginFill(0xeaf0af, 1);
            circle.drawCircle(0, -20,40);
            circle.endFill();
            allEggAssests.addChild(circle)

            var style = {
              fontWeight : 'bold',
              fill : '#AAAAAAA',
              stroke : '#AAAAAAA',
              strokeThickness : 1,
            };

            var richText = new PIXI.Text(j+1,style);
            nCounter++
            richText.anchor.x = 0.5
            richText.anchor.y = 0.5
            richText.y = -20
            allEggAssests.addChild(richText)

            container.addChildAt(allEggAssests,container.children.length)
          }

          //setting egg size
          var bounds = container.getBounds()
          var distance = 30
          var source = container.children[1].children[1].texture.baseTexture.source
          var eggFinalSize = (this.boardSpecs.maxHeight - ((this.stimuli.values.length-1)*distance))/this.stimuli.values.length
          var finalScale = eggFinalSize/source.height

          if((source.width)*finalScale > this.boardSpecs.instructionWidth * 0.7){
            var eggFinalSize = this.boardSpecs.instructionWidth * 0.7
            var finalScale = eggFinalSize/source.width
          }

          //generating animations for individual eggs
          var toNestAnimationScale = (this.tileSize/2)/eggFinalSize;
          for(var j = 1; j < container.children.length; j++){

            //move egg to nest and scale acordinly
            container.children[j].animation = new animation(container.children[j])
            container.children[j].animation.initScale(

              {x : toNestAnimationScale, y:  toNestAnimationScale}, //Final value of animation
              500, // Time of animation
              (300 * j), // Delay
              [0,0] //Bezier animation handles

            )
            container.children[j].fadeAnimation = new animation(container.children[j])
            container.children[j].fadeAnimation.initFeature(

              "alpha", //feature to animate
              0, //Final value of animation
              500, // Time of animation
              0, // Delay
              [0,0] //Bezier animation handles

            )

          }

          //adjust suport position and size
          suport.y =+ ((source.height/4)*(finalScale))
          suport.lineStyle(0);
          suport.beginFill(0xffffda, 1);
          suport.drawCircle(0, 0,((source.width)*(finalScale)));
          suport.endFill();
          suport.scale.x = 0.5
          suport.scale.y = 0.4

          //setting container variables
          container.scale.x = 0
          container.scale.y = 0
          container.x = 300 + i * ((source.width)*(finalScale))
          container.y = 300

    			container.customAnimation = new animation(container)
          container.customAnimation.initScale(

    				{x : finalScale, y : finalScale}, //Final value of animation
    				500, // Time of animation
    				(100 * i), // Delay
    				[0,0] //Bezier animation handles

    			)

          //adding to eggs and containers to global variables
    			stage.addChild(container)
    			this.eggs[this.stimuli.values[i] + ""] = container

    		};
  }

	Trial.prototype.play = function(first_argument) {

		switch(this.playState){

		case "intro": // Display Introduction and instructions

			if(this.intro()){

				this.playState = "drawingNest"
				console.log("GameState =drawingNest")

			}

			break;

		case "drawingNest": // Allow user to draw nest and give answear

			break;

		case "placingEggs": //Allow user to place eggs

      if(this.eggsClicked){

        var done = true

        for(var i = 1; i < this.eggs[this.answearGiven].children.length; i++){

          if (!this.eggs[this.answearGiven].children[i].animation.run()) done = false
          if (!this.eggs[this.answearGiven].children[i].animation.runScale()) done = false

        }

        if(done) {

          this.eggsClicked = false;

          if(!this.aswear){

            for(var i = 1; i < this.eggs[this.answearGiven].children.length; i++){

              console.log(this.eggs[this.answearGiven].children[i].animation.initScale(

                {x : 0, y : 0}, //Final value of animation
        				1000, // Time of animation
        				(100 * i), // Delay
        				[0,0] //Bezier animation handles

              ))

              this.eggs[this.answearGiven].children[i].fadeAnimation.initFeature(

                "rotation", // features to animate
                Math.PI * 4, // final position
                1000, // time value
                0, // delay
                [0,1] // bezier courve

              );
            }

            for(var i = 0; i < this.nests.length; i++){
              for(var j = 0; j < this.nests[i].tiles.length;j++){

                this.nests[i].tiles[j].sprite.animation = new animation(this.nests[i].tiles[j].sprite)
                this.nests[i].tiles[j].sprite.animation.initFeature(

                  "alpha", // features to animate
                  0, // final position
                  500, // time value
                  0, // delay
                  [0,1] // bezier courve
                )
              }
            }

            this.playState = "Lose"

          } else if(this.aswear.length == this.stimuli.values.length){

    				this.playState = "Win"
            this.eggsClicked = false;

    				console.log("YOU WIN!")

    			}else

            this.playState = "drawingNest"

          }

      }


			break;

		case "Win":

      var done = true;

      if(!score.displayStar())  done = false;
      if(!score.displayExplosion()) done = false;

      for(var i = 1; i < this.eggs[this.answearGiven].children.length; i++){

        if(this.eggs[this.answearGiven].children[i].clicked){
          if(!this.eggs[this.answearGiven].children[i].fadeAnimation.runFeature()){
            done = false
          }
        }else{
          done = false
        }

      }

      console.log(done)

      if(done){
        return true;
      }

			break;

		case "Lose":

      var done = true;

      for(var i = 1; i < this.eggs[this.answearGiven].children.length; i++){

        if(!this.eggs[this.answearGiven].children[i].fadeAnimation.runFeature()) done = false;
        if(!this.eggs[this.answearGiven].children[i].animation.runScale()) done = false;

      }

      for(var i = 0; i < this.nests.length; i++){
        for(var j = 0; j < this.nests[i].tiles.length;j++){
          if(!this.nests[i].tiles[j].sprite.animation.runFeature()) done = false;
        }
      }

      if(done){
        return true;
      }

			break;


		};
	};

	Trial.prototype.intro = function(){

		switch(this.introState){

			case "intruction":

				if(this.timer.timeOut()){

					var done = true

					for(i in this.eggs){

						if(!this.eggs[i].customAnimation.runScale()){

							done = false;
						};
            
            if(!this.played) {
              this.played = true;
              this._stimuli[0].howl.play();
            }
					};

					if(done){

            var counter = 0
            var finalYpos;

            for(i in this.eggs){

              if(this.stimuli.values.length == 1){
                finalYpos = session.height/2
              }else{
                var eggHeight = this.eggs[this.stimuli.values[0]].getBounds().height
                var spacing = (this.boardSpecs.maxHeight - (this.stimuli.values.length*eggHeight)) / (this.stimuli.values.length-1)
                finalYpos = (eggHeight/2) + this.boardSpecs.boardMargin + (eggHeight * counter) + (spacing * counter)
                console.log(eggHeight,spacing,finalYpos)
              }

							var pos = {
								y : finalYpos,
								x : this.boardSpecs.x/2
							}

							this.eggs[i].customAnimation.init(

								pos,
								1500,
								100*counter,
								[0.75,0.25]
							)

              counter++

						};

						console.log("introState = moveLeft")
						this.timer.start(1000);
						this.introState = "moveLeft"
						this.drawBoard();

					};

				};

				break;

			case "moveLeft":

				if(this.timer.timeOut()){

					var done = true

          for(i in this.eggs){

						if(!this.eggs[i].customAnimation.run()){
							done = false;
						};

					};

					if(done){

						this.timer.start(0);
						console.log("introState = createBoard")
						this.introState = "createBoard";

					};

				}


				break;

			case "createBoard":

				if(this.timer.timeOut()){

					console.log("introState = done")
					return true

				};

				break


		};

		return false;
	};

	Trial.prototype.setBoardMatrix = function(){

		console.log("setting borad matrix!")

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		// Creating divisions for board
		//
		//   ______________
		//   |   2   |  3 |
		//   |_______|____|
		//   |     |      |
		//   |  0  |   1  |
		//   |_____|______|
		//
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

		//Dividing the board into two parts. The bottom one being the
		//biggest if the hight is an even number
		var divisionHoz = Math.ceil(this.boardSpecs.rows/2); // This equals the heith of the bottom division

		if(this.boardSpecs.columns%2 != 0){

			var divVerTop = Math.ceil(this.boardSpecs.columns/2);

		}else{

			var divVerTop = (this.boardSpecs.columns/2) + 1;

		}

		var divVerBot = this.boardSpecs.columns - divVerTop;

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		//Creating reference for the board background and boardMatrix
		//This is also used to create the selection and nest

		// Array order: [[0,0],[0,1],[0,2],[1,0],[1,1][1,2],[2,0],[2,1],[2,2]
		// Board index Example:

		// [0,2] [1,3] [2,2]
		// [0,1] [1,2] [2,1]
		// [0,0] [1,0] [2,0]

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.grid = new PIXI.Container()

		for(var i=0; i<this.boardSpecs.columns; i++){

			var _y = 0

			for(var j = this.boardSpecs.rows-1; j >= 0; j--){


				var indice = i + "-" + _y

				var pos = {

					x: i * this.boardSpecs.tileSize + this.boardSpecs.x,
					y: j * this.boardSpecs.tileSize + this.boardSpecs.y,

				};

				this.boardMatrix[indice] = {

					"graphic" : new PIXI.Graphics(),// interactive area of the board
					"tile" : {x : i, y : _y}, // x and y coordinates of the tiles
					"pos" : pos, // pixel position of the tile aligned on the top left corner
					"used" : false,

				}

        this.grid.addChild(this.boardMatrix[indice].graphic)
				_y++;


			};

		};
  };

  Trial.prototype.drawBoard = function(){

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		// Create Sprites for the board background
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

		var _this = this;

	    function click(_event){

        	_this.clickStart(_event);

      }

		for(object in  this.boardMatrix){

			this.boardMatrix[object].graphic.beginFill(0xFFFFFF, 0.0);
      this.boardMatrix[object].graphic.lineStyle(2, 0xb9b03f, 0.5);
			this.boardMatrix[object].graphic.drawRect(this.boardMatrix[object].pos.x, this.boardMatrix[object].pos.y, this.boardSpecs.tileSize, this.boardSpecs.tileSize);
			this.boardMatrix[object].graphic.endFill();
			this.boardMatrix[object].graphic.id = object
			this.boardMatrix[object].graphic.interactive = true;

      //touch start
			this.boardMatrix[object].graphic
			.on('mousedown', click)
      .on('touchstart', click)

      //touch end
  		.on('mouseup', function(event){ console.log(event); _this.clickEnd(this)})
      .on('mouseupoutside', function(event){console.log(event); _this.clickEnd(this)})
      .on('touchend', function(event){console.log(event); _this.clickEnd(this)})
      .on('touchendoutside', function(event){console.log(event);_this.clickEnd(this)})

      //drag
      .on('mousemove', function(_event){_this.drag(_event,this)})
      .on('touchmove', function(_event){_this.drag(_event,this)});

		};

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		// Create Sprites for Branches
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    var TL = new PIXI.Sprite(assets.textures.TL)
    stage.addChild(TL)
    var TR = new PIXI.Sprite(assets.textures.TR)
    stage.addChild(TR)
    var BL = new PIXI.Sprite(assets.textures.BL)
    stage.addChild(BL)
    var BR = new PIXI.Sprite(assets.textures.BR)

    stage.addChild(BR)

    if(this.boardSpecs.rows < 3){

      var scale = (this.tileSize*1.4) / TL.getBounds().height
      TL.x = this.boardSpecs.x + this.tileSize * 0.5
      TR.x = this.boardSpecs.x + ((this.boardSpecs.columns * this.tileSize)/2)
      BL.x = this.boardSpecs.x + (this.tileSize*0.2)
      BL.y = session.height - (BL.getBounds().height * scale)
      BR.x = this.boardSpecs.x +  ((this.boardSpecs.columns * this.tileSize)/2)
      BR.y = session.height - (BR.getBounds().height * scale)

    }else if(this.boardSpecs.rows == 3){

      var scale = (this.tileSize*2.2) / TL.getBounds().height
      TL.x = this.boardSpecs.x + this.tileSize * 0.5
      TR.x = this.boardSpecs.x + ((this.boardSpecs.columns * this.tileSize)/2)
      BL.x = this.boardSpecs.x + (this.tileSize*0.2)
      BL.y = session.height - (BL.getBounds().height * scale)
      BR.x = this.boardSpecs.x +  ((this.boardSpecs.columns * this.tileSize)/2)
      BR.y = session.height - (BR.getBounds().height * scale)

    }else{

      var scale = (session.height/2) / TR.getBounds().height
      TR.x = this.boardSpecs.x + ((this.boardSpecs.columns * this.tileSize)/2)

      TL.x = this.boardSpecs.x + (this.boardSpecs.columns/8 * this.tileSize)

      BL.x = this.boardSpecs.x + (this.boardSpecs.columns/8 * this.tileSize)
      BL.y = session.height -  (BL.getBounds().height * scale)

      BR.x = this.boardSpecs.x +  ((this.boardSpecs.columns * this.tileSize)/2)
      BR.y = session.height - (BR.getBounds().height * scale)

    }

    TL.scale.x = TL.scale.y = scale
    TR.scale.x = TR.scale.y = scale
    BL.scale.x = BL.scale.y = scale
    BR.scale.x = BR.scale.y = scale

    stage.addChild(this.grid)

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		// Create Sprites for cover leaves
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    var CLBR = new PIXI.Sprite(assets.textures["CL-BR"])
    var scale = ((this.tileSize * 0.8) + ((session.height - (this.boardSpecs.rows*this.tileSize))/2))/ CLBR.getBounds().height

    var CLContainer = new PIXI.Container()

    CLBR.scale.x = CLBR.scale.y = scale
    CLBR.y = session.height - (CLBR.getBounds().height*scale)
    CLBR.x = session.width - (CLBR.getBounds().width*scale)

    var CLTL = new PIXI.Sprite(assets.textures["CL-TL"])
    CLTL.scale.x = (session.width * 0.15)/CLTL.getBounds().width
    CLTL.scale.y = CLTL.scale.x = scale
    CLContainer.addChild(CLTL)

    var CLTM = new PIXI.Sprite(assets.textures["CL-TM"])
    CLTM.scale.x = scale
    CLTM.scale.y = scale
    CLTM.x = (session.width/2) - (CLTM.getBounds().width*scale)/2
    CLContainer.addChild(CLTM)

    var CLTR = new PIXI.Sprite(assets.textures["CL-TR"])
    CLTR.scale.x = CLTR.scale.y = scale
    CLTR.x = session.width - (CLTR.getBounds().width*scale)
    CLContainer.addChild(CLTR)

    var CLBL = new PIXI.Sprite(assets.textures["CL-BL"])
    CLBL.scale.x = CLBL.scale.y = scale
    CLBL.y = session.height - (CLBL.getBounds().height*scale)

    CLContainer.addChild(CLBL)

    CLContainer.addChild(CLBR)
    stage.addChild(CLContainer)
	};

	Trial.prototype.setBoardSpecs = function(){

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		//This function sets the adequate sizes to be used
		//when drawing the board background and division lines
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

		this.boardSpecs = {}

		//Define general areas for the board and instruction area:
		this.boardSpecs.instructionWidth = (session.width/5 > 200) ? session.width/5 : 200 ;
		this.boardSpecs.boardMargin = session.width/20;
		this.boardSpecs.x = this.boardSpecs.instructionWidth + this.boardSpecs.boardMargin;
		this.boardSpecs.y = this.boardSpecs.boardMargin + (session.height * 0.1);
		this.boardSpecs.maxWidth = session.width - this.boardSpecs.instructionWidth - (2 * this.boardSpecs.boardMargin);
		this.boardSpecs.maxHeight = session.height - (2 * this.boardSpecs.boardMargin) - (session.height * 0.1);

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		//create board specs for games with more than one eggs
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if(this.stimuli.values.constructor === Array && this.stimuli.values.length != 1) {

			var divisors = []//final pairs of divisors for the stimuli values

			//Get divisors for every stimuli value
			for (var i = 0; i < this.stimuli.values.length; i++) {

				var allDivisors = [] //all possible divisors
				var divisorsPairs = [] //pair of divisors that generates final number

				for(var j = 1; j<=this.stimuli.values[i]; j++){

					if(this.stimuli.values[i]%j == 0){

						allDivisors.push(j)

					};

				};

				if(allDivisors.length%2 != 0){
				// if there is an odd number of divisors make a square
				// ex.: 3 x 3 = 9
				// FINAL NUMBER: 9
				// ALL POSSIBLE DIVISORS: 1,3,9
				// FINAL DIVISORS: [3,3]

					divisorsPairs.push(
						allDivisors[Math.floor(allDivisors.length/2)],
						allDivisors[Math.floor(allDivisors.length/2)]
						)

				}else{
				// If there is an even number of divisors use the two number from the middle
				// ex.: 2 x 4 = 8
				// FINAL NUMBER: 8
				// ALL POSSIBLE DIVISORS: 1,2,4,8
				// FINAL DIVISORS: [2,4]

					divisorsPairs.push(
						allDivisors[allDivisors.length/2],
						allDivisors[(allDivisors.length/2)-1]
					)
				};

				divisors.push(divisorsPairs)

			};

			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			//Simple algorithms to determine values of
			//rows andcollumns in order to fit all areas
			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			this.boardSpecs.rows = 0
			this.boardSpecs.columns = 0
			var areas = Math.floor(divisors.length/2) // number of vertical areas
      var divisorIdCounter = 0

			for(var i = 0; i <= areas ; i++){

        var id = divisorIdCounter
        divisorIdCounter++

				if(i != areas){

					this.boardSpecs.rows += divisors[id][1] > divisors[id+1][1] ? divisors[id][1] : divisors[id+1][1];

					if(this.boardSpecs.columns < divisors[id][0] + divisors[id+1][0]){

						this.boardSpecs.columns = divisors[id][0] + divisors[id+1][0]

					};

				}else{ // last insertion

					this.boardSpecs.rows += divisors[id][1]

					if(this.boardSpecs.columns < divisors[id][0]){

						this.boardSpecs.columns = divisors[id][0]

					};

				};

			};

			if(this.boardSpecs.maxHeight / this.boardSpecs.rows < this.boardSpecs.maxWidth / this.boardSpecs.columns) {

				this.boardSpecs.tileSize = this.boardSpecs.maxHeight / this.boardSpecs.rows
				this.tileSize = this.boardSpecs.tileSize

			}else{

				this.boardSpecs.tileSize = this.boardSpecs.maxWidth / this.boardSpecs.columns
				this.tileSize = this.boardSpecs.tileSize
	    }

      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  		//create board specs for games with just one eggs
  		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

		}else{

      var divisors = []//final pairs of divisors for the stimuli values


      //Get divisors for every stimuli value
      for (var i = 0; i < this.stimuli.values.length; i++) {

        var allDivisors = [] //all possible divisors
        var divisorsPairs = [] //pair of divisors that generates final number

        for(var j = 1; j<=this.stimuli.values[i]; j++){

          if(this.stimuli.values[i]%j == 0){

            allDivisors.push(j)

          };

        };

        if(allDivisors.length%2 != 0){
        // if there is an odd number of divisors make a square
        // ex.: 3 x 3 = 9
        // FINAL NUMBER: 9
        // ALL POSSIBLE DIVISORS: 1,3,9
        // FINAL DIVISORS: [3,3]

          divisorsPairs.push(
            allDivisors[Math.floor(allDivisors.length/2)],
            allDivisors[Math.floor(allDivisors.length/2)]
            )

        }else{
        // If there is an even number of divisors use the two number from the middle
        // ex.: 2 x 4 = 8
        // FINAL NUMBER: 8
        // ALL POSSIBLE DIVISORS: 1,2,4,8
        // FINAL DIVISORS: [2,4]

          divisorsPairs.push(
            allDivisors[allDivisors.length/2],
            allDivisors[(allDivisors.length/2)-1]
          )
        };

        divisors.push(divisorsPairs)

      };

      var random = getRandomInt(1,allDivisors.length/2)

      console.log(random,divisorsPairs)
      var row = allDivisors[random]
      var coll = allDivisors[allDivisors.length-random-1]


			this.boardSpecs.rows = row + getRandomInt(1 ,2) //Math.ceil(Math.sqrt(this.stimuli.values))// + getRandomInt(0,3)
      this.boardSpecs.columns = coll + getRandomInt(0,1)

      console.log(this.boardSpecs.rows,this.boardSpecs.columns)

			if((this.boardSpecs.maxWidth/this.boardSpecs.columns) * this.boardSpecs.rows < this.boardSpecs.maxHeight){
			// check if board is going to be big enough to fit the grid if tileSize is based on the coll

				//set rows and sizes to have enouth area to draw the answear
				this.boardSpecs.tileSize = this.boardSpecs.maxWidth / this.boardSpecs.columns
        this.tileSize = this.boardSpecs.tileSize

			}else{

				this.boardSpecs.tileSize = this.boardSpecs.maxHeight / this.boardSpecs.rows
				this.tileSize = this.boardSpecs.tileSize

			};

		};

    //set corerct x and y position
    this.boardSpecs.x = this.boardSpecs.instructionWidth + this.boardSpecs.boardMargin + (this.boardSpecs.maxWidth-(this.boardSpecs.columns * this.tileSize))/2
    this.boardSpecs.y = this.boardSpecs.boardMargin + ((session.height-(2*this.boardSpecs.boardMargin))-(this.boardSpecs.rows * this.tileSize))/2
	};

	Trial.prototype.clickStart = function(_event){

    this.clickPlaystate = this.playState

		if(this.playState == "drawingNest" && !this.singleClick){

      this.clickPlaystate = this.playState
			this.nestCreated = false;
			this.firstClickTile = _event.target.id
			this.lastTarget = this.boardMatrix[_event.target.id].tile
			_event.target.dragging = true;

		}
	};

	Trial.prototype.deleteNest = function(_index){ // delete nest on _index

		for(var i = 0; i < this.selection.tiles.length; i++){

			if(this.selection.tiles[i].sprite != undefined){

        this.selection.tiles[i].sprite.alpha = 0
        this.selection.tiles[i].sprite.rotation = 0
        this.fullNests[this.selection.tiles[i].sprite.nestAssetsId].push(this.selection.tiles[i].sprite)
				this.selection.tiles[i].sprite = undefined;

			};
		};
	};

	Trial.prototype.drag = function(_event,_this){

    if(this.playState != "drawingNest"){
      return;
    }

		if(_this.dragging){ // ensure that only one tile will trigger the reponse

      this.singleClick = false;

			var point = { // get mouse position
				x : _event.data.global.x,
				y : _event.data.global.y
			};

			for(object in this.boardMatrix){
      // check wich tile is below cursor and draw nest based on the position

				if(this.boardMatrix[object].graphic.containsPoint(point)){

					if(this.boardMatrix[object].tile != this.lastTarget){
          //only draw when user changes to a different tile

						this.deleteNest()
            //delete previous nest

						this.selection = this.calculateSelection( // calculate new selection

							this.boardMatrix[this.firstClickTile].tile,
							this.boardMatrix[object].tile

						)

						for(var i = 0; i<this.selection.tiles.length; i++){

							if(this.boardMatrix[this.selection.tiles[i].id].used){
              //if user changes to a tile with a nest already in it

								console.log("overlap!")
								var id = this.lastTarget.x + "-" + this.lastTarget.y

								this.selection = this.calculateSelection( // calculate new selection

									this.boardMatrix[this.firstClickTile].tile,
									this.boardMatrix[id].tile

								)

								this.showNest(this.selection)
								return

							}

						};

						this.showNest(this.selection)
						this.lastTarget = this.boardMatrix[object].tile
						return;

					};

				};

			};

		};
  };

  Trial.prototype.showNest = function(_selection){

    var selection = _selection

		function showNestTile(_arrayPos,_asset,_this,_flip){

      var sprite = _this.fullNests[_asset].splice(0,1)[0]

      if(_flip){
        sprite.rotation = -Math.PI / 2;
        sprite.width = _this.tileSize * 1.6
      }else{
        console.log(_asset)
        sprite.width = Math.abs(_this.tileSize * 1.6)
        sprite.rotation = 0
      }

			sprite.height = _this.tileSize * 1.6
			sprite.x = _this.boardMatrix[_this.selection.tiles[_arrayPos].id].pos.x + _this.tileSize*0.5,
			sprite.y = _this.boardMatrix[_this.selection.tiles[_arrayPos].id].pos.y + _this.tileSize*0.5,
			sprite.anchor.x = 0.5
			sprite.anchor.y = 0.5

			_this.selection.tiles[_arrayPos].sprite = sprite
      _this.selection.tiles[_arrayPos].sprite.nestAssetsId = _asset
      _this.selection.tiles[_arrayPos].sprite.alpha = 1
			stage.addChildAt(_this.selection.tiles[_arrayPos].sprite,stage.children.length - 2)

		};

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		//Creating sprites for the Nest based on
		//the position of the array stored in the
		//selection and in boardMatrix.
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

		if(selection.rows * selection.columns  <= 1){// Draw nest in the shape of a single saquare

		}else if(selection.columns > 1 && selection.rows > 1){ // Draw nest in the shape of a rectangle

			//>>>>>>>>>>>>>>>>>>
			//Creating Corners:
			//>>>>>>>>>>>>>>>>>>

			//--------------------------------------------------------corner bottom left
			showNestTile( 0, "CBL", this )

			//--------------------------------------------------------corner top right
			showNestTile(
				(selection.rows  * selection.columns) -1,
				"CTR",
				this
			);

			//--------------------------------------------------------corner top left
			showNestTile(
				selection.rows - 1,
				"CTL",
				this
			);

			//--------------------------------------------------------corner bottom right
			showNestTile(
				selection.rows * (selection.columns-1),
				"CBR",
				this
			);

			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			//Creating TOP/BOTTOM sides + Middle:
			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

			for(var i = 0; i < selection.columns-2; i++){

				//side-top
				var top = ((i + 1) * selection.rows ) + selection.rows - 1;
				showNestTile( top , "ST", this );


				//side-bottom
				var bot = (i + 1) * selection.rows
				showNestTile( bot , "SB", this );


				// Middle
				for(var j = 0; j < selection.rows-2; j++){

					var midId = ((i + 1) * selection.rows) + 1 + j
					showNestTile( midId , "M", this );

				};

			};


			//>>>>>>>>>>>>>>>>>>>>>>>>>>
			//Creating LEFT/RIGHT sides
			//>>>>>>>>>>>>>>>>>>>>>>>>>>

			for(var i = 0; i < selection.rows-2; i++){

				//side-left
				var left = i + 1

				showNestTile( left , "SL", this );

				//side-right
				var right = 1  + i + ((selection.columns-1) * selection.rows)
				showNestTile( right , "SR", this );

			};


		}else{ // Draw nest in the shape of a line

			if(selection.rows == 1){ //horizontal line

				//Top
				showNestTile(
					selection.tiles.length-1,
					"LB",
					this,
					true
					)

				//Middle
				for(var i = 0; i < selection.columns-2; i++){

					showNestTile(
						i+1,
						"LM",
						this,
						true
						)

				};

				//Bottom
				showNestTile(
					0,
					"LT",
					this,
					true
					)

			}else{ //vertical line

				//BOTTOM
				showNestTile(
					0,
					"LB",
					this
					)

				//Middle
				for(var i = 0; i < selection.rows-2; i++){


					showNestTile(
						i+1,
						"LM",
						this
						)

				};

				//TOP
				showNestTile(
					selection.tiles.length-1,
					"LT",
					this
					)

			};
		};
  };

	Trial.prototype.clickEnd = function(_this){

    if(this.clickPlaystate != this.playState) return

		if(!this.nestCreated && this.playState == "drawingNest"){
    // ensure that only one tile will trigger the response

      if(this.singleClick){

        this.selection = this.calculateSelection( // calculate new selection
          this.boardMatrix[this.firstClickTile].tile,
          this.boardMatrix[_this.id].tile
        )

        this.showNest(this.selection)

      } else if(this.selection.tiles.length == 0){

        this.singleClick = true;

      }


			this.boardMatrix[this.firstClickTile].graphic.dragging = false;

			for(var i=0; i<this.selection.tiles.length; i++){

				var id = this.selection.tiles[i].id;
				this.boardMatrix[id].used = true;

			};

			this.checkAnswer();

		}else if(_this.id == this.firstClickTile && this.playState == "drawingNest"){

			this.boardMatrix[this.firstClickTile].graphic.dragging = false;

		};

    console.log(">>");

	};

	Trial.prototype.checkAnswer = function(){

    if(this.selection.tiles.length == 0){
      return;
    }

    this.nests[this.nestCount] = this.selection;
    this.nestCount++;
    this.nestCreated = true;

		var correct = false;
		var id;

		for(var i = 0; i < this.stimuli.values.length; i++){

			if(this.nests[this.nestCount-1].tiles.length == this.stimuli.values[i]){
				id = i
				correct = true
				break;
			};
		};

		if(correct){

			this.aswear.push(true);
			this.answearGiven = this.stimuli.values[id+""]
      this.playState = "placingEggs"

			}else{

				this.aswear = false;
				this.playState = "placingEggs"
				console.log("YOU LOSE!")
			}
	};

  Trial.prototype.eggsToNestAnimation = function(){

    //>>>>>>>>>>>>>>>>>>>>>>
    //set animation for eggs
    //>>>>>>>>>>>>>>>>>>>>>>

    //adjust layer on staging so eggs are displayed on top of the nest
    var eggIndex = this.EggsClickedValue;
    var a = stage.removeChild(this.eggs[eggIndex])
    stage.addChildAt(a,stage.children.length-1)

    //Assiging position for animation on every egg
    var scale = 1/this.eggs[eggIndex].scale.x
    var l = this.selection.rows
    var counter = 0;
    var firstNestTile = this.selection.tiles[0]
    var finalNestTile = this.selection.tiles[this.selection.tiles.length-1]
    var extraCount = this.eggs[eggIndex].children.length-this.selection.tiles.length-1
    var outsideNestPos = []

    console.log(firstNestTile,finalNestTile)

    //fucntion declarations

    var _this = this;

    function populateRight(){

      console.log(">>>>>>>>>RIGHT")

      for(var i = 1;i < _this.boardSpecs.columns - finalNestTile.x; i++){
        for(var j = 0; j < _this.selection.rows; j++){

          var x = finalNestTile.x + i;
          var y = finalNestTile.y - j;

          var pos = {
            x : ((_this.boardMatrix[x + "-" + y].pos.x - _this.eggs[eggIndex].x) * scale) + (_this.tileSize/2),
            y : ((_this.boardMatrix[x + "-" + y].pos.y - _this.eggs[eggIndex].y) * scale) + (_this.tileSize/2)
          }
          outsideNestPos.push(pos);
        }
      }

    }

    function populateBottom(){

      console.log(">>>>>>>>>> BOTTOM")
      console.log(finalNestTile.y)



      for(var i = 0;i < finalNestTile.y-1; i++){

        for(var j = 0; j < _this.boardSpecs.columns; j++){

          var x = j;
          var y = finalNestTile.y - _this.selection.rows - i;

          console.log("i:" + i + "  -  " + "j:" + j )
          console.log(x,y)

          var pos = {
            x : ((_this.boardMatrix[x + "-" + y].pos.x - _this.eggs[eggIndex].x) * scale) + (_this.tileSize/2),
            y : ((_this.boardMatrix[x + "-" + y].pos.y - _this.eggs[eggIndex].y) * scale) + (_this.tileSize/2)
          }
          outsideNestPos.push(pos);
        }
      }

    }

    function populateLeft(_eggs){

      if(_eggs == 0) return

      console.log(">>>>>>>>>> LEFT")
      console.log(_eggs)

      //get how many columns to populate based on number of _eggs
      var start = firstNestTile.x - colToPop
      var colToPop = Math.ceil(_eggs/_this.selection.rows)
      var lastColumnReminder = _eggs%_this.selection.rows
      var finalReminder;

      console.log(colToPop)
      console.log(lastColumnReminder)

      if(lastColumnReminder == 0){

        finalReminder = _this.selection.rows

      }else{

        finalReminder = lastColumnReminder

      }

      for(var i = 0;i < finalReminder; i++){

        var x = firstNestTile.x - colToPop;
        var y = finalNestTile.y - i;

        var pos = {
          x : ((_this.boardMatrix[x + "-" + y].pos.x - _this.eggs[eggIndex].x) * scale) + (_this.tileSize/2),
          y : ((_this.boardMatrix[x + "-" + y].pos.y - _this.eggs[eggIndex].y) * scale) + (_this.tileSize/2)
        }

        outsideNestPos.push(pos);

      }

      console.log("-------------------")

      for(var i = 0;i < colToPop-1; i++){
        for(var j = 0; j < _this.selection.rows; j++){

          var x = firstNestTile.x - colToPop + i + 1;
          var y = finalNestTile.y - j;

          console.log("i:" + i + "  -  " + "j:" + j )
          console.log(x,y)

          var pos = {
            x : ((_this.boardMatrix[x + "-" + y].pos.x - _this.eggs[eggIndex].x) * scale) + (_this.tileSize/2),
            y : ((_this.boardMatrix[x + "-" + y].pos.y - _this.eggs[eggIndex].y) * scale) + (_this.tileSize/2)
          }
          outsideNestPos.push(pos);
          extraCount--
        }
      }
    }

    function populateTop(_eggs){

      console.log(">>>>>>>>>> TOP")
      console.log(_eggs)

      //get how many columns to populate based on number of _eggs
      var rowToPop = Math.ceil(_eggs/_this.boardSpecs.columns)
      var start = firstNestTile.x - rowToPop
      var lastColumnReminder = _eggs%_this.boardSpecs.columns
      var finalReminder;

      console.log(rowToPop)
      console.log(lastColumnReminder)

      if(lastColumnReminder == 0){

        finalReminder = _this.boardSpecs.columns

      }else{

        finalReminder = lastColumnReminder

      }

      for(var i = 0;i < finalReminder; i++){

        var x = (_this.boardSpecs.columns - finalReminder) + i;
        var y = finalNestTile.y + 1;

        var pos = {
          x : ((_this.boardMatrix[x + "-" + y].pos.x - _this.eggs[eggIndex].x) * scale) + (_this.tileSize/2),
          y : ((_this.boardMatrix[x + "-" + y].pos.y - _this.eggs[eggIndex].y) * scale) + (_this.tileSize/2)
        }

        outsideNestPos.push(pos);

      }

      for(var i = 0;i < rowToPop-1; i++){
        for(var j = 0; j < _this.boardSpecs.collumns; j++){

          var x = j;
          var y = finalNestTile.y + i;

          console.log("i:" + i + "  -  " + "j:" + j )
          console.log(x,y)

          var pos = {
            x : ((_this.boardMatrix[x + "-" + y].pos.x - _this.eggs[eggIndex].x) * scale) + (_this.tileSize/2),
            y : ((_this.boardMatrix[x + "-" + y].pos.y - _this.eggs[eggIndex].y) * scale) + (_this.tileSize/2)
          }
          outsideNestPos.push(pos);
        }
      }
    }

    //check wich areas needs to be populated
    //if (exta eggs >= availabe area)  fill area & call next

    var areas = {
      right   : (this.boardSpecs.columns - finalNestTile.x - 1) * (this.selection.rows),
      left    : firstNestTile.x * this.selection.rows,
      bottom  : firstNestTile.y * this.boardSpecs.columns,
    }

    console.log(">>>>>>>>>>>>>>");
    console.log(areas)
    console.log(extraCount)

    if(areas.right >= extraCount){
      //if you can fit all eggs on the right, only populate the right
      console.log("1")
      populateRight()

    }else if(areas.left >= extraCount - areas.right){
      //if you can fit all remaining on the left and right, only populate the left and right
      console.log("2")
      populateLeft(extraCount - areas.right)
      populateRight()

    }else if( areas.bottom >= extraCount - areas.left - areas.right){
      console.log("3")
      populateLeft(areas.left)
      populateRight()
      populateBottom()

    }else{

      populateTop(extraCount - areas.left - areas.bottom - areas.right)
      populateLeft(areas.left)
      populateRight()
      populateBottom()

    }

    //set final position and initiate animation
    for(var j = 0; j < this.eggs[eggIndex].children.length-1; j++){

      //placing eggs outside nest
      if(j > this.selection.tiles.length-1){

        var pos = outsideNestPos[counter]
        counter++

      //Place eggs inside nest
      }else{

        var index = (l - 1) - (j%l) + (Math.floor(j/l)*l);
        var offset = {
          x : (this.tileSize*scale/2),
          y : (this.tileSize*scale/2)
        }

        //offset animation position based on position over the nestCount
        if(this.selection.tiles[index].x - firstNestTile.x  == 0){ // left side
          offset.x =offset.x + (this.tileSize*scale/4)
        }else if(this.selection.tiles[index].x - firstNestTile.x == this.selection.columns-1){ // right side
          offset.x = offset.x - (this.tileSize*scale/4)
        }

        //offset animation position based on position over the nestCount
        if(this.selection.tiles[index].y - firstNestTile.y == 0){ // top side
          offset.y = offset.y - (this.tileSize*scale/4)
        }else if(this.selection.tiles[index].y - firstNestTile.y == this.selection.rows-1){ // top side
          offset.y = offset.y + (this.tileSize*scale/4)
        }

        var pos = {
          x : ( offset.x + (this.boardMatrix[this.selection.tiles[index].id].pos.x - this.eggs[eggIndex].x) * scale),
          y : ( offset.y + (this.boardMatrix[this.selection.tiles[index].id].pos.y - this.eggs[eggIndex].y) * scale)
        }
      }
      console.log(pos)

      //initiation animation
      this.eggs[eggIndex].children[j+1].animation.init(
        pos, //Final value of animation
        500, // Time of animation
        (200 * j), // Delay
        [0,0] //Bezier animation handles
      )
    }

    this.selection = { tiles : [] };
  };

	Trial.prototype.createFullNests = function(_selection){

      var selection = _selection

      console.log("----------------------", stage.children.length)
      console.log(stage.children[stage.children.length-1])

			function createNestTile(_arrayPos,_asset,_this,_flip,_){

				var sprite = new PIXI.Sprite(assets.textures[_asset]);

				sprite.height = _this.tileSize * 1.6
				sprite.x = _this.boardMatrix[selection.tiles[_arrayPos].id].pos.x + _this.tileSize*0.5,
				sprite.y = _this.boardMatrix[selection.tiles[_arrayPos].id].pos.y + _this.tileSize*0.5,
				sprite.anchor.x = 0.5
				sprite.anchor.y = 0.5
        sprite.alpha = 0

        _this.fullNests[_asset].push(sprite)



        stage.addChildAt(sprite,stage.children.length-1)

			};

			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			//Creating sprites for the Nest based on
			//the position of the array stored in the
			//selection and in boardMatrix.
			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

			if(selection.columns * selection.rows <= 1){// Draw nest in the shape of a single saquare

			}else if(selection.columns > 1 && selection.rows > 1){ // Draw nest in the shape of a rectangle

				//>>>>>>>>>>>>>>>>>>
				//Creating Corners:
				//>>>>>>>>>>>>>>>>>>

				//--------------------------------------------------------corner bottom left
				createNestTile( 0, "CBL", this )

				//--------------------------------------------------------corner top right
				createNestTile(
					(selection.rows  * selection.columns) -1,
					"CTR",
					this
				);

				//--------------------------------------------------------corner top left
				createNestTile(
					selection.rows - 1,
					"CTL",
					this
				);

				//--------------------------------------------------------corner bottom right
				createNestTile(
					selection.rows * (selection.columns-1),
					"CBR",
					this
				);

				//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
				//Creating TOP/BOTTOM sides + Middle:
				//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

				for(var i = 0; i < selection.columns-2; i++){

					//side-top
					var top = ((i + 1) * selection.rows ) + selection.rows - 1;
					createNestTile( top , "ST", this );


					//side-bottom
					var bot = (i + 1) * selection.rows
					createNestTile( bot , "SB", this );


					// Middle
					for(var j = 0; j < selection.rows-2; j++){

						var midId = ((i + 1) * selection.rows) + 1 + j
						createNestTile( midId , "M", this );

					};

				};


				//>>>>>>>>>>>>>>>>>>>>>>>>>>
				//Creating LEFT/RIGHT sides
				//>>>>>>>>>>>>>>>>>>>>>>>>>>

				for(var i = 0; i < selection.rows-2; i++){

					//side-left
					var left = i + 1

					createNestTile( left , "SL", this );

					//side-right
					var right = 1  + i + ((selection.columns-1) * selection.rows)
					createNestTile( right , "SR", this );

				};


			}else{ // Draw nest in the shape of a line

				if(selection.rows == 1){ //horizontal line

					//Top
					createNestTile(
						selection.tiles.length-1,
						"LT",
						this,
						true
						)

					//Middle
					for(var i = 0; i < selection.columns-2; i++){


						createNestTile(
							i+1,
							"LM",
							this,
							true
							)

					};

					//Bottom
					createNestTile(
						0,
						"LB",
						this,
						true
						)

				}else{ //vertical line

					//BOTTOM
					createNestTile(
						0,
						"LB",
						this
						)

					//Middle
					for(var i = 0; i < selection.rows-2; i++){


						createNestTile(
							i+1,
							"LM",
							this
							)

					};

					//TOP
					createNestTile(
						selection.tiles.length-1,
						"LT",
						this
						)

				};
			};
  };

	Trial.prototype.calculateSelection = function(_start,_end){

    // console.log(_start,_end)

		var selectedTile = []

		var distance = {
			x : Math.abs(_end.x - _start.x),
			y : Math.abs(_start.y - _end.y)
		}

		var xMin = (_start.x < _end.x) ? _start.x : _end.x
		var yMin = (_start.y < _end.y) ? _start.y : _end.y

		var type = "centered"

		for (var i = 0; i < distance.x+1; i++) { // number of columns

			var _x = i + xMin;

			for (var j = 0; j < distance.y+1; j++) { // number of rows

				var _y = j + yMin;

				selectedTile.push({

					x : _x,
					y : _y,
					id : _x + "-" + _y


				})

			};

		};

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		//Returns tiles in this order on the borad:

		// Tiles Examble:

		// columns = 3
		// rows = 4

		//   4 9 14
		//   3 8 13
		//   2 7 12
		//   1 6 11
		//   0 5 10
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

		return {

			"tiles" : selectedTile,
			"rows" : distance.y+1,
			"columns" : distance.x+1

		};
	};

	Trial.prototype.destroy = function(_stage){

    console.log("<><><><>destroy")

    var bg;

    function deleteChildren(_child,_parent){

      console.log(_child.children.length)

      if(_child.children.length > 0){
          while(_child.children.length > 0){
            console.log("--" + _child.children.length)
            deleteChildren(_child.children[0],_child)
          }
          console.log("all children deleted")
      }

      if(_child.id == "bg"){
        bg = _parent.removeChild(_child)
        console.log("==================================", bg)
      }else{
        _parent.removeChild(_child)
        _child.destroy()
      }
    }

    while(stage.children.length > 0){

      console.log(">>>>>>>>>>>>>>>>> " + stage.children.length)
      deleteChildren(stage.children[0],stage)

    }

    if(bg) stage.addChild(bg)
		console.log(stage.children.length)
		console.log(stage)
		console.log("Destruction DONE!")
	};

  Trial.prototype.storeStim = function(){

      var rand_adjust = Math.random() * .1 - .05; // slight randomization to shuffle stim
      var newpriority = this._stimuli[0].priority

      this._stimuli[0].priority = newpriority + rand_adjust;

      console.log(this._stimuli[0])
      return(this._stimuli[0]);

  };

//------------------------------------------
// Global functions and variables
//-------------------------------------------

	// create the root of the scene graph and main classes
    var stage = new PIXI.Container();
    var round = new Round();
    score.stage = stage;

    this.destroy = function(){
        finishGame = true;
        session.hide()
    };

    //---------------------------------------loading assets

        if(!multiplicationLoaded){

            //cover leaves
            assets.addTexture("CL-BL","sprites/coverLeaves/BL.png")
            assets.addTexture("CL-BR","sprites/coverLeaves/BR.png")
            assets.addTexture("CL-TL","sprites/coverLeaves/TL.png")
            assets.addTexture("CL-TM","sprites/coverLeaves/TM.png")
            assets.addTexture("CL-TR","sprites/coverLeaves/TR.png")

            //Branches
            assets.addTexture("CBL","sprites/Branches/C-BL.png")
            assets.addTexture("CTL","sprites/Branches/C-TL.png")
            assets.addTexture("CTR","sprites/Branches/C-TR.png")
            assets.addTexture("BL","sprites/Branches/BL.png")
            assets.addTexture("BR","sprites/Branches/BR.png")
            assets.addTexture("TL","sprites/Branches/TL.png")
            assets.addTexture("TR","sprites/Branches/TR.png")

            //eggs
            assets.addTexture("eggBlue","sprites/eggsMulti/Egg-Blue.png")
            assets.addTexture("eggOrange","sprites/eggsMulti/Egg-Orange.png")
            assets.addTexture("spot01","sprites/eggsMulti/spot-01.png")
            assets.addTexture("spot02","sprites/eggsMulti/spot-02.png")
            assets.addTexture("spot03","sprites/eggsMulti/spot-03.png")
            assets.addTexture("eggShadow","sprites/eggsMulti/Shadow.png")

      			//assets for rectangle nest
      			assets.addTexture("CBL","sprites/nest/CBL.png")
      			assets.addTexture("CBR","sprites/nest/CBR.png")
      			assets.addTexture("CTL","sprites/nest/CTL.png")
      			assets.addTexture("CTR","sprites/nest/CTR.png")
      			assets.addTexture("SB","sprites/nest/SB.png")
      			assets.addTexture("SL","sprites/nest/SL.png")
      			assets.addTexture("SR","sprites/nest/SR.png")
      			assets.addTexture("ST","sprites/nest/ST.png")
      			assets.addTexture("M","sprites/nest/M.png")

      			//assets for tree background
      			assets.addTexture("boardLeaves","sprites/nest/boardLeaves.png")

      			//Assets for line nest
      			assets.addTexture("LB","sprites/nest/LB.png")
      			assets.addTexture("LT","sprites/nest/LT.png")
      			assets.addTexture("LM","sprites/nest/LM.png")

            assets.addTexture("bg","sprites/backGrounds/bg-multiplicatiom.png")

            assets.load(onAssetsLoaded)

            //multiplicationLoaded = true

        }else{

            onAssetsLoaded();

        };

        function onAssetsLoaded(){

        console.log("assetsloaded!")

        round.init(Trial, stage, stimuli);

        setTimeout(function(){

            console.log("starting the game!")
            session.show()
            update();

        });

        };

    //--------------------------------------- Game Loop

        var statsBol = true;

        if(statsBol){
            session.stats.domElement.style.display = "block"
        };

        var finishGame = false
        var previousTime = Date.now();
        var MS_PER_UPDATE = 16.66667;
        var lag = 0

        function update() {

            if(finishGame){

                logTime("multiplication",'stop');

                session.stats.domElement.style.display = "none";
                round.destroy();
                console.log("--");
                assets.destroy();
                finishGame = false;
                currentview = new MainMenu(assets);

                return
            };

            if(statsBol) session.stats.begin()

          	//update position based on expected frame rate
  	        var current = Date.now();
  	        var elapsed = current - previousTime;
  	        previousTime = current;
  	        lag = lag + elapsed;

        	 while (lag >= MS_PER_UPDATE){

	              round.play(lag/MS_PER_UPDATE);
	              lag = lag - MS_PER_UPDATE;

  	        };

	        //---------------->> Thing that renders the whole stage
	        session.renderer.render(stage)

	        requestAnimationFrame(update);

        	if(statsBol)session.stats.end()

        };

};
