
function Multiplication(){
  queuesToUpdate['mathstim'] = true;
  var stimuli = stimQueues['mathstim'];



/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Trial
-------------------------------------------------------------------------------------------------------------
*/

	function Trial(_stimuli,_correct){

		this.stimuli = _stimuli || 12;
		this.correct = _correct || 12;
		this.boardMatrix = {}

	}

	Trial.prototype.init = function(first_argument) {
		
		this.setBoard();
		// body...
	};

	Trial.prototype.play = function(first_argument) {
		
	};

	Trial.prototype.setBoard = function(){

		var instructionWidth = session.canvas.width/7;
		var boardMargin = session.canvas.width/20
		var boardSpecs = {

			"x" : instructionWidth + boardMargin,
			"y" : boardMargin,
			"maxWidth" : session.canvas.width - instructionWidth - (2 * boardMargin),
			"maxHeight" : session.canvas.height - (2 * boardMargin),


		}

		boardSpecs.rows = Math.ceil(this.correct/2) + getRandomInt(0,3)
		boardSpecs.tileSize = boardSpecs.maxHeight / boardSpecs.rows


		boardSpecs.collums = Math.ceil(boardSpecs.maxWidth / boardSpecs.tileSize) - 1

		for(var i=0; i<boardSpecs.collums; i++){
		
			var _y = 0

			for(var j=boardSpecs.rows-1; j >= 0; j--){


				var pos = {

					x: i * boardSpecs.tileSize + boardSpecs.x,
					y: j * boardSpecs.tileSize + boardSpecs.y,
				
				};

				this.boardMatrix[ i + "-" + _y] = {
					
	//*************************************************** <FIXME> REPLACE GRAPHIC BY SPRITE
					"sprite" : new PIXI.Graphics(),
					"tile" : [i,_y],
					"pos" : pos,

				}

				stage.addChild(this.boardMatrix[ i + "-" + _y].sprite)
				_y++;

			};

		};

	    function click(_event){
        
        	console.log(_event)

        	_this.clickStart(_event);

        }

	//---------------------- display board bg
	//*************************************************** <FIXME> REPLACE GRAPHIC BY SPRITE
	
		console.log(this.boardMatrix)

		var graphics = new PIXI.Graphics();

		for(object in  this.boardMatrix){

			this.boardMatrix[object].sprite.lineStyle(1, 0x0000FF, 0.1);
			this.boardMatrix[object].sprite.beginFill(0xFF00BB, 0.1);
			this.boardMatrix[object].sprite.drawRect(this.boardMatrix[object].pos.x, this.boardMatrix[object].pos.y, boardSpecs.tileSize, boardSpecs.tileSize);
			graphics.endFill();

		};

		stage.addChild(graphics)
	
	//----------------------
	
		var _this = this;

		var boardArea = new PIXI.Container() 
		
		console.log(boardSpecs.rows)
		boardArea.interactive = false;
		boardArea.width = boardSpecs.collums * boardSpecs.tileSize;
		boardArea.height = boardSpecs.rows * boardSpecs.tileSize
		boardArea.x = this.boardMatrix[ "0-" + (boardSpecs.rows-1)].pos.x
		boardArea.x = this.boardMatrix[ "0-" + (boardSpecs.rows-1)].pos.y

		boardArea

			.on('mousedown', click)
            .on('touchstart', click)

            //touch end
    		.on('mouseup', function(){_this.clickEnd(this)})
            .on('mouseupoutside', function(){_this.clickEnd(this)})
            .on('touchend', function(){_this.clickEnd(this)})
            .on('touchendoutside', function(){_this.clickEnd(this)})
            
            //drag
            .on('mousemove', function(){_this.drag(this)})
            .on('touchmove', function(){_this.drag(this)});


		stage.addChild(boardArea)

	};

	Trial.prototype.clickStart = function(){
		console.log("START")
	};

	Trial.prototype.drag = function(){
		//console.log("drag")
	};

	Trial.prototype.clickEnd = function(){
		console.log("END")
	};


	Trial.prototype.drawNest = function(){
	};

	Trial.prototype.selectBoardTile = function(_start,_end){

		var selectedTile = []

		var distance = {
			x :  Math.abs(_end.x - _start.x),
			y : Math.abs(_start.y - _tend.y)
		}

		var totalTilesSelected = distance.x * distance.y; 

		var xMin = (_start.x < _end.x) ? _start.x : _end.x 
		var yMin = (_start.y < _end.y) ? _start.y : _end.y

		for (var i = 0; i < distance.x+1; i++) {
		
			var _x = i + xMin;

			for (var j = 0; j < distance.x+1; j++) {
		
				var _y = j + yMin;

				selectedTile.push({
					x : _x,
					y : _y 
					})

			};
		
		};

		return selectedTile
	};

//-------------------------------------------
// Global functions andd variables
//-------------------------------------------

 // create the root of the scene graph and main classes
    var stage = new PIXI.Container();

        function click(_event){
        	_this.clickStart(this,_event)
        }
    var round = new Round();

    this.destroy = function(){
        finishGame = true;
        session.hide()
    };

    //---------------------------------------loading assets

        if(proto3loaded){

            // assets.addSprite("ripple",'sprites/lillypad/ripples/ripples.json',5)
            // assets.addSprite("lillyFinal_Sink",'sprites/lillypad/final_sink/lillyFinal_Sink.json',9)

            assets.addTexture("stick","sprites/stick/stick.png")
            assets.addTexture("leave","sprites/stick/leave.png")
            assets.addTexture("branch","sprites/stick/branch.png")

            // assets.addTexture("lillyBig","sprites/lillypad/big-01.png")
            // assets.addTexture("lillySmall","sprites/lillypad/small-01.png")
            // assets.addTexture("ants","sprites/lillypad/ant.png")
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

    //---------------------------------------LOOP

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

          	//update position based on espectaed frame rate
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