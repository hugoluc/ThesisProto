var multiplicationLoaded = false;

function Multiplication(){

  queuesToUpdate['numberstim'] = true;
  var stimuli = stimQueues['numberstim'];




/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Trial
-------------------------------------------------------------------------------------------------------------
*/

  var numberss = [4]

	function Trial(_stimuli,_correct){

		var specs = [

			{
				stimuli : {
					values : numberss,
					// Maybe use this later to terermine in wich direction the game is testing the user
				},
			}
		]

    this.counter = 0

		this.stimuli = specs[0].stimuli;
		this.correctAnswears = this.stimuli.values.slice()
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


		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		// Create Sprites for intructions eggs
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    //called for moutiple times if stimuli has more than one number
		for(var i = 0; i < this.stimuli.values.length; i++){

      var container = new PIXI.Container()
      var suport = new PIXI.Graphics()
      suport.scale.y = 0.5
      container.addChild(suport)

      var getSpotsId = getRandomInt(1,4)
      var getEggsId;
      if(getRandomInt(0,2) == 0){
        getEggsId = "Blue"
      }else{
        getEggsId = "Orange"
      }

      // creating container with all eggs and numbers
      for(var j = 0; j < this.stimuli.values[i]; j++){

        var allEggAssests = new PIXI.Container()

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
        circle.drawCircle(0, -30,60);
        circle.endFill();
        allEggAssests.addChild(circle)

        container.addChildAt(allEggAssests,stage.children.length)
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

      //generating animations
      var toNestAnimationScale = (this.tileSize/2)/eggFinalSize
      for(var j = 1; j < container.children.length; j++){

        container.children[j].animation = new animation(container.children[j])
        container.children[j].animation.initScale(

          {x : toNestAnimationScale, y:  toNestAnimationScale}, //Final value of animation
          500, // Time of animation
          (300 * j), // Delay
          [0,0] //Bezier animation handles

        )
      }

      //adjust suport position and size
      suport.y =+  ((source.height/2)*(finalScale))
      suport.lineStyle(0);
      suport.beginFill(0xffffda, 1);
      suport.drawCircle(0, 0,((source.width)*(finalScale)));
      suport.endFill();

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

    console.log(this.eggs)

		this.timer = new ClockTimer();
		this.timer.start(1000);
	};

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

			break;

		case "Win":


      for(var i = 1; i < this.eggs[this.answeraGiven].children.length; i++){
        this.eggs[this.answeraGiven].children[i].animation.run()
        this.eggs[this.answeraGiven].children[i].animation.runScale()
      }

			break;

		case "Lose":

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

        console.log(this.boardSpecs.y)

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
    		.on('mouseup', function(){_this.clickEnd(this)})
        .on('mouseupoutside', function(){_this.clickEnd(this)})
        .on('touchend', function(){_this.clickEnd(this)})
        .on('touchendoutside', function(){_this.clickEnd(this)})

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

      console.log(divisors)

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

			this.boardSpecs.rows = Math.ceil(Math.sqrt(this.stimuli.values))// + getRandomInt(0,3)

			if(Math.ceil(this.boardSpecs.maxWidth / (this.boardSpecs.maxHeight / this.boardSpecs.rows)) - 1 < Math.ceil(Math.sqrt(this.stimuli.values))){
			// check if board is going to be big enough to fit the answear if squares are based on the rows

				//set rows and sizes to have enouth area to draw the answear
				this.boardSpecs.columns = Math.ceil(Math.sqrt(this.stimuli.values))
				this.boardSpecs.tileSize = this.tileSize = this.boardSpecs.maxWidth / this.boardSpecs.columns

			}else{

				// if there is extra space, populate entire screen width with squares
				this.boardSpecs.tileSize = this.boardSpecs.maxHeight / this.boardSpecs.rows
				this.tileSize = this.boardSpecs.tileSize
				this.boardSpecs.columns = Math.ceil(this.boardSpecs.maxWidth / (this.boardSpecs.maxHeight / this.boardSpecs.rows)) - 1

			};

		};

    //set corerct x and y position
    this.boardSpecs.x = this.boardSpecs.instructionWidth + this.boardSpecs.boardMargin + (this.boardSpecs.maxWidth-(this.boardSpecs.columns * this.tileSize))/2
    this.boardSpecs.y = this.boardSpecs.boardMargin + ((session.height-(2*this.boardSpecs.boardMargin))-(this.boardSpecs.rows * this.tileSize))/2
	};

	Trial.prototype.clickStart = function(_event){

		if(this.playState == "drawingNest"){

			this.nestCreated = false;
			this.firstClickTile = _event.target.id
			this.lastTarget = this.boardMatrix[_event.target.id].tile
			_event.target.dragging = true;

			console.log(_event.target.id)

		}else if(this.playState == "win"){



		};
	};

	Trial.prototype.deleteNest = function(_index){ // delete nest on _index

		for(var i = 0; i < this.selection.tiles.length; i++){

			if(this.selection.tiles[i].sprite != undefined){

				stage.removeChild(this.selection.tiles[i].sprite);
				this.selection.tiles[i].sprite.destroy();
				this.selection.tiles[i].sprite = undefined;

			};

		};
	};

	Trial.prototype.drag = function(_event,_this){

    if(this.playState != "drawingNest"){

      return;

    }


		if(_this.dragging){ // ensure that only one tile will trigger the reponse

			var point = { // get mouse position

				x : _event.data.global.x,
				y : _event.data.global.y
			};

			for(object in this.boardMatrix){ // check wich tile is below cursor and draw nest based on the position

				if(this.boardMatrix[object].graphic.containsPoint(point)){

					if(this.boardMatrix[object].tile != this.lastTarget){

						this.deleteNest()

						this.selection = this.calculateSelection( // calculate new selection

							this.boardMatrix[this.firstClickTile].tile,
							this.boardMatrix[object].tile

						)

						for(var i = 0; i<this.selection.tiles.length; i++){

							if(this.boardMatrix[this.selection.tiles[i].id].used){

								console.log("overlap!")
								var id = this.lastTarget.x + "-" + this.lastTarget.y

								this.selection = this.calculateSelection( // calculate new selection

									this.boardMatrix[this.firstClickTile].tile,
									this.boardMatrix[id].tile

								)

								this.drawNest()
								return

							}

						};

						this.drawNest()
						this.lastTarget = this.boardMatrix[object].tile
						return;

					};

				};

			};

		};
	};

	Trial.prototype.clickEnd = function(_this){

		console.log("clickend!")
    console.log(stage)

		if(!this.nestCreated && this.playState == "drawingNest"){ // ensure that only one tile will trigger the response

			this.boardMatrix[this.firstClickTile].graphic.dragging = false;

			for(var i=0; i<this.selection.tiles.length; i++){

				var id = this.selection.tiles[i].id;
				this.boardMatrix[id].used = true;

			};

			this.nests[this.nestCount] = this.selection;
			this.nestCount++;
			this.nestCreated = true;
			this.checkAnswer();

		}else if(_this.id == this.firstClickTile && this.playState == "drawingNest"){

			this.boardMatrix[this.firstClickTile].graphic.dragging = false;

		};
	};

	Trial.prototype.checkAnswer = function(){

			var correct = false
			var id;

			for(var i = 0; i < this.stimuli.values.length; i++){

				console.log(this.nests[this.nestCount-1].tiles.length,this.stimuli.values[i])


				if(this.nests[this.nestCount-1].tiles.length == this.stimuli.values[i]){

					id = i
					correct = true
					break;

				};

			};

			if(correct){

				this.aswear.push(true);
				this.answeraGiven = this.correctAnswears.splice(i,1)

        var scale = 1/this.eggs[this.answeraGiven].scale.x
        console.log(this.eggs[this.answeraGiven].children[2].x)

        var a = stage.removeChild(this.eggs[this.answeraGiven])
        stage.addChildAt(a,stage.children.length-1)

        //set animation for eggs
        for(var j = 1; j < this.eggs[this.answeraGiven].children.length; j++){

          console.log(this.nests.tiles[j].sprite,)

          var pos = {
            x : ((this.tileSize*scale/2) + (this.boardMatrix[this.selection.tiles[j-1].id].pos.x - this.eggs[this.answeraGiven].x) * scale),
            y : ((this.tileSize*scale/2) + (this.boardMatrix[this.selection.tiles[j-1].id].pos.y - this.eggs[this.answeraGiven].y) * scale)

          }
          this.eggs[this.answeraGiven].children[j].animation.init(

            pos, //Final value of animation
            500, // Time of animation
            (300 * j), // Delay
            [0,0] //Bezier animation handles

          )
        }

			  this.selection = { tiles : [] };

			}else{
				this.aswear = false;
				this.playState = "Lose"
				console.log("YOU LOSE!")
			}

			if(this.aswear.length == this.stimuli.values.length){

				this.playState = "Win"
				console.log("YOU WIN!")

			};
	};

	Trial.prototype.drawNest = function(_start,_end){


			function createNestTile(_arrayPos,_asset,_this,_flip,_){

				var sprite = new PIXI.Sprite(_asset);
				if(_flip){

					sprite.width = -_this.tileSize * 1.6
					sprite.rotation = -Math.PI * 1.5

				}else{

					sprite.width = _this.tileSize * 1.6

				};

				sprite.height = _this.tileSize * 1.6
				sprite.x = _this.boardMatrix[_this.selection.tiles[_arrayPos].id].pos.x + _this.tileSize*0.5,
				sprite.y = _this.boardMatrix[_this.selection.tiles[_arrayPos].id].pos.y + _this.tileSize*0.5,
				sprite.anchor.x = 0.5
				sprite.anchor.y = 0.5

				_this.selection.tiles[_arrayPos].sprite = sprite
				stage.addChildAt(_this.selection.tiles[_arrayPos].sprite,stage.children.length - 1)

			};

			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			//Creating sprites for the Nest based on
			//the position of the array stored in the
			//selection and in boardMatrix.
			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

			if(this.selection.tiles.length <= 1){// Draw nest in the shape of a single saquare

			}else if(this.selection.columns > 1 && this.selection.rows > 1){ // Draw nest in the shape of a rectangle

				//>>>>>>>>>>>>>>>>>>
				//Creating Corners:
				//>>>>>>>>>>>>>>>>>>

				//--------------------------------------------------------corner bottom left
				createNestTile( 0, assets.textures.CBL, this )

				//--------------------------------------------------------corner top right
				createNestTile(
					(this.selection.rows  * this.selection.columns) -1,
					assets.textures.CTR,
					this
				);

				//--------------------------------------------------------corner top left
				createNestTile(
					this.selection.rows - 1,
					assets.textures.CTL,
					this
				);

				//--------------------------------------------------------corner bottom right
				createNestTile(
					this.selection.rows * (this.selection.columns-1),
					assets.textures.CBR,
					this
				);

				//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
				//Creating TOP/BOTTOM sides + Middle:
				//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

				for(var i = 0; i < this.selection.columns-2; i++){

					//side-top
					var top = ((i + 1) * this.selection.rows ) + this.selection.rows - 1;
					createNestTile( top , assets.textures.ST, this );


					//side-bottom
					var bot = (i + 1) * this.selection.rows
					createNestTile( bot , assets.textures.SB, this );


					// Middle
					for(var j = 0; j < this.selection.rows-2; j++){

						var midId = ((i + 1) * this.selection.rows) + 1 + j
						createNestTile( midId , assets.textures.M, this );

					};

				};


				//>>>>>>>>>>>>>>>>>>>>>>>>>>
				//Creating LEFT/RIGHT sides
				//>>>>>>>>>>>>>>>>>>>>>>>>>>

				for(var i = 0; i < this.selection.rows-2; i++){

					//side-left
					var left = i + 1

					createNestTile( left , assets.textures.SL, this );

					//side-right
					var right = 1  + i + ((this.selection.columns-1) * this.selection.rows)
					createNestTile( right , assets.textures.SR, this );

				};


			}else{ // Draw nest in the shape of a line

				if(this.selection.rows == 1){ //horizontal line

					//Top
					createNestTile(
						this.selection.tiles.length-1,
						assets.textures.LT,
						this,
						true
						)

					//Middle
					for(var i = 0; i < this.selection.columns-2; i++){


						createNestTile(
							i+1,
							assets.textures.LM,
							this,
							true
							)

					};

					//Bottom
					createNestTile(
						0,
						assets.textures.LB,
						this,
						true
						)

				}else{ //vertical line

					//BOTTOM
					createNestTile(
						0,
						assets.textures.LB,
						this
						)

					//Middle
					for(var i = 0; i < this.selection.rows-2; i++){


						createNestTile(
							i+1,
							assets.textures.LM,
							this
							)

					};

					//TOP
					createNestTile(
						this.selection.tiles.length-1,
						assets.textures.LT,
						this
						)

				};
			};
	};

	Trial.prototype.calculateSelection = function(_start,_end){

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

		// for(object in  this.boardMatrix){

		// 	stage.removeChild(this.boardMatrix[object].sprite);
		// 	this.boardMatrix[object].sprite.destroy(true,true);

		// 	stage.removeChild(this.boardMatrix[object].graphic);
		// 	this.boardMatrix[object].graphic.destroy(true,true);

		// };

		while(stage.children[0]) stage.removeChild(stage.children[0])

		return

		console.log(stage.children.length)

		for (var i = 0; i < stage.children.length; i++){

			console.log(stage.children[0])

			if(stage.children[i].children.length > 0){

				stage.removeChild(stage.children[i])
				stage.children[i].destroy(true,true);


			}else{

				stage.removeChild(stage.children[i])
				stage.children[i].destroy(true,true);

			}

			console.log(i)
  		console.log(stage.children.length)
		}

		console.log(stage.children.length)
		console.log(stage)
		console.log("Destruction DONE!")
	};

//------------------------------------------
// Global functions and variables
//-------------------------------------------

	// create the root of the scene graph and main classes
    var stage = new PIXI.Container();

    var round = new Round();

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
            assets.addTexture("eggBlue","sprites/eggs/Egg-Blue.png")
            assets.addTexture("eggOrange","sprites/eggs/Egg-Orange.png")
            assets.addTexture("spot01","sprites/eggs/spot-01.png")
            assets.addTexture("spot02","sprites/eggs/spot-02.png")
            assets.addTexture("spot03","sprites/eggs/spot-03.png")
            assets.addTexture("eggShadow","sprites/eggs/Shadow.png")

      			assets.addTexture("cliff","sprites/eggs/cliff.png")

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

                console.log("finishing Game")

                session.stats.domElement.style.display = "none"
                round.destroy()
                assets.destroy()
                finishGame = false
                currentview = new MainMenu(assets)

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
