
function Multiplication(){
  queuesToUpdate['mathstim'] = true;
  var stimuli = stimQueues['mathstim'];


/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Trial
-------------------------------------------------------------------------------------------------------------
*/

	function Trial(_stimuli,_correct){

		this.stimuli = _stimuli || 6;
		this.correct = _correct || 6;
		this.boardMatrix = {}
		this.lastTarget = ""
		this.selection = {
			tiles : [],
		}
		this.playState = "intro"
	};

	Trial.prototype.init = function(first_argument) {
		
		this.setBoard();
	};

	Trial.prototype.play = function(first_argument) {


		switch(this.playState){

		case "intro": // Display Introduction and instructions

			if(true){

				this.playState = "drawingNest"

			}

			break;


		case "drawingNest": // Allow user to draw nest and give answear




			break;


		case "placingEggs": //Allow user to place eggs



			break;
		
		case "Win":




			break;


		};
	};

	Trial.prototype.setBoard = function(){

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		//sizes to be used when drawing
		//the board background and division lines
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

		var instructionWidth = session.canvas.width/5;
		var boardMargin = session.canvas.width/20
		var boardSpecs = { 

			"x" : instructionWidth + boardMargin,
			"y" : boardMargin,
			"maxWidth" : session.canvas.width - instructionWidth - (2 * boardMargin),
			"maxHeight" : session.canvas.height - (2 * boardMargin),

		}

		boardSpecs.rows = Math.ceil(Math.sqrt(this.correct)) + getRandomInt(0,3)
		boardSpecs.tileSize = boardSpecs.maxHeight / boardSpecs.rows

		this.tileSize = boardSpecs.tileSize

		boardSpecs.collums = Math.ceil(boardSpecs.maxWidth / boardSpecs.tileSize) - 1


		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		//Creating reference for the board background on boardMatrix
		//This is also used to create the selection and nest
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

		for(var i=0; i<boardSpecs.collums; i++){
		
			var _y = 0

			for(var j=boardSpecs.rows-1; j >= 0; j--){


				var pos = {

					x: i * boardSpecs.tileSize + boardSpecs.x,
					y: j * boardSpecs.tileSize + boardSpecs.y,
				
				};

				this.boardMatrix[ i + "-" + _y] = {

					//*************************************************** <FIXME> REPLACE GRAPHIC BY SPRITE
					"sprite" : new PIXI.Graphics(), // sprite od the board background
					"tile" : {x : i, y : _y}, // x and y coordinates of the tiles
					"pos" : pos, // pixel position of the tile aligned on the top left corner
				}


				stage.addChild(this.boardMatrix[ i + "-" + _y].sprite)
				_y++;

			};

		};


		var _this = this;

	    function click(_event){

        	_this.clickStart(_event);

        }


		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		// Create Sprites for the board background
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


		var graphics = new PIXI.Graphics();

		for(object in  this.boardMatrix){

			//*************************************************** <FIXME> REPLACE GRAPHIC BY SPRITE
			this.boardMatrix[object].sprite.lineStyle(1, 0x0000FF, 0.1);
			this.boardMatrix[object].sprite.beginFill(0xFF00BB, 0.1);
			this.boardMatrix[object].sprite.drawRect(this.boardMatrix[object].pos.x, this.boardMatrix[object].pos.y, boardSpecs.tileSize, boardSpecs.tileSize);
			this.boardMatrix[object].sprite.endFill();
			this.boardMatrix[object].sprite.id = object

			this.boardMatrix[object].sprite.interactive = true;

            //touch start			
			this.boardMatrix[object].sprite
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

		stage.addChild(graphics)

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		// Create Sprites for the board background
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


	};

	Trial.prototype.clickStart = function(_event){

		if(this.playState == "drawingNest"){

			console.log(">>>>>>>>>>>>>", this.playState)

			this.firstClickTile = _event.target.id
			this.lastTarget = this.boardMatrix[_event.target.id].tile
			_event.target.dragging = true;

			for(var i = 0; i < this.selection.tiles.length; i++){

				if(this.selection.tiles[i].sprite != undefined){

					stage.removeChild(this.selection.tiles[i].sprite);
					this.selection.tiles[i].sprite.renderable = false;
					this.selection.tiles[i].sprite.destroy();
					this.selection.tiles[i].sprite = undefined;


				};

			};

			console.log(_event.target.id)

		}else if(this.playState == "placingEggs"){




		};

	};

	Trial.prototype.drag = function(_event,_this){

       
		if(_this.dragging){

			var point = {
				x : _event.data.global.x, //session.renderer.plugins.interaction.mouse.global.x,
				y : _event.data.global.y //session.renderer.plugins.interaction.mouse.global.y
			}

			for(object in this.boardMatrix){

				if(this.boardMatrix[object].sprite.containsPoint(point)){

					this.drawNest(this.boardMatrix[object].tile)
					return;

				}

			}

		};
	};

	Trial.prototype.clickEnd = function(_this){

		if(!_this.dragging){

			this.boardMatrix[this.firstClickTile].sprite.dragging = false;
			console.log(this.playState)			
			this.playState = "placingEggs"

			if(this.selection.tiles.length == this.correct ){

				this.aswear = true

			}else{

				this.aswear = false
				this.playState = "drawingNest"
			}


		}else if(_this.id == this.firstClickTile){

			this.boardMatrix[this.firstClickTile].sprite.dragging = false;

		};
	};

	Trial.prototype.drawNest = function(_target){ 


		if(_target != this.lastTarget){ // check if the user changed the selection
			

			for(var i = 0; i < this.selection.tiles.length; i++){ // clean last nest

				if(this.selection.tiles[i].sprite != undefined){

					stage.removeChild(this.selection.tiles[i].sprite);
					this.selection.tiles[i].sprite.destroy();
					this.selection.tiles[i].sprite = undefined;

				};

			};
			
			this.selection = this.calculateSelection( // calculate new selection
				
				this.boardMatrix[this.firstClickTile].tile,
				_target 
			
			)

			function createNestTile( _arrayPos,_asset,_this ){

				_this.selection.tiles[_arrayPos].sprite = new PIXI.Sprite(_asset);

				_this.selection.tiles[_arrayPos].sprite.width = _this.tileSize
				_this.selection.tiles[_arrayPos].sprite.height = _this.tileSize
				_this.selection.tiles[_arrayPos].sprite.x = _this.boardMatrix[_this.selection.tiles[_arrayPos].id].pos.x + _this.tileSize*0.5,
				_this.selection.tiles[_arrayPos].sprite.y = _this.boardMatrix[_this.selection.tiles[_arrayPos].id].pos.y + _this.tileSize*0.5,
				_this.selection.tiles[_arrayPos].sprite.anchor.x = 0.5
				_this.selection.tiles[_arrayPos].sprite.anchor.y = 0.5
				stage.addChild(_this.selection.tiles[_arrayPos].sprite)

			};


			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			//Creating sprites for the Nest based on 
			//the position of the array stored in the
			//selection and in boardMatrix.
			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>			


			if(this.selection.tiles.length <= 1){// Draw nest in the shape of a single saquare



			}else if(this.selection.collumns > 1 && this.selection.rows > 1){ // Draw nest in the shape of a rectangle
			

				//>>>>>>>>>>>>>>>>>>
				//Creating Corners:
				//>>>>>>>>>>>>>>>>>>

				//--------------------------corner bottom left
				createNestTile( 0, assets.textures.CBL, this )


				//--------------------------------------corner top right	 
				createNestTile(
					(this.selection.rows  * this.selection.collumns) -1,
					assets.textures.CTR,
					this
				);


				//-----------corner top left
				createNestTile(
					this.selection.rows - 1,
					assets.textures.CTL,
					this
				);


				//--------------------------------corner bottom right
				createNestTile(

					this.selection.rows * (this.selection.collumns-1),
					assets.textures.CBR,
					this

				);

				//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
				//Creating TOP/BOTTOM sides + Middle:
				//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 


				for(var i = 0; i < this.selection.collumns-2; i++){

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
					var right = 1  + i + ((this.selection.collumns-1) * this.selection.rows)
					createNestTile( right , assets.textures.SR, this ); 

				};

		

		
			}else{ // Draw nest in the shape of a line

			console.log("LINE!")

			};

		};

		this.lastTarget = _target;  
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

		for (var i = 0; i < distance.x+1; i++) { // number of collumns
		
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
			"collumns" : distance.x+1

		};
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

        if(proto3loaded){

            assets.addTexture("stick","sprites/stick/stick.png")
            assets.addTexture("leave","sprites/stick/leave.png")
            assets.addTexture("branch","sprites/stick/branch.png")

			assets.addTexture("cliff","sprites/eggs/cliff.png")
			assets.addTexture("egg","sprites/eggs/egg.png")

			assets.addTexture("CBL","sprites/nest/CBL.png")
			assets.addTexture("CBR","sprites/nest/CBR.png")
			assets.addTexture("CTL","sprites/nest/CTL.png")
			assets.addTexture("CTR","sprites/nest/CTR.png")
			assets.addTexture("SB","sprites/nest/SB.png")
			assets.addTexture("SL","sprites/nest/SL.png")
			assets.addTexture("SR","sprites/nest/SR.png")
			assets.addTexture("ST","sprites/nest/ST.png")
			assets.addTexture("M","sprites/nest/M.png")

            assets.addTexture("bg","sprites/backGrounds/BackGround-03.png")

            assets.load(onAssetsLoaded)

        }else{

            onAssetsLoaded();

        };

        function onAssetsLoaded(){

        console.log("assetsloaded!")

        round.init(Trial,stage, stimuli);

            setTimeout(function(){
                console.log("starting the game!")
                session.show()
                update();
            });
        };

    //--------------------------------------- Game Loop

        var statsBol = false;

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
            }

            if(statsBol) session.stats.begin()

          	//update position based on expected frame rate
  	        var current = Date.now();
  	        var elapsed = current - previousTime;
  	        previousTime = current;
  	        lag = lag + elapsed;

        	  while (lag >= MS_PER_UPDATE){
              round.play(lag/MS_PER_UPDATE);
              lag = lag - MS_PER_UPDATE;

  	        }

        	        //---------------->> Thing that renders the whole stage
        	        session.render(stage)

        	        requestAnimationFrame(update);

                if(statsBol)session.stats.end()

        }

}