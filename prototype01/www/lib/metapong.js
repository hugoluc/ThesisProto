/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */
/*
 *
 * MetaPongJS -- An abstract, "make images fly around the page" framework.
 *
 * MetaPongJS version .90
 *
 * Summary:
 *
 *   MetaPong is simple but powerful JavaScript library that animates one or more images around an HTML5 web page.
 *   MetaPong's inputs are very simple at first, but can be combined to do very complicated things.
 *
 * Calling convention:
 *   The MetaPong contructor takes a bunch of arguments which dictate what gets animated and how. All of the args
 *   can either be a string or an Array. If the param is an Array, the contents of the array are randomly selected
 *   each time they are used. If the param is an Array that has only two numbers (viz. [1,20]) then the param produces
 *   a random number between the two numbers inclusive.
 *
 * Constructor Parameters:
 *   image_url -- URL pointing at the image(s) to be animated around the page. (Again, can be an Array...).
 *
 *   container -- HTML Object ID of the container within which to animate the objects. Default is document.documentElement.
 *
 *   count -- How many images to independently animate. Example, "2" or "[20,30]" or between 20 and 30. Images will
 *            be chosen from the image_url value/Array. Default is 1.
 *
 *   start_x -- The starting left position, in either absolute px or %. (Ditto...). Re-generated each time when bounce
 *              is set to "restart". If there are exactly two parameters, the array is interpreted as a RANGE.
 *              Default is ["0%", "100%"].
 *
 *   start_y -- Starting top position. Ditto.
 *
 *   start_clip -- True/False: Whether to allow start_x/start_y to clip the image, or to use (window_size-image_size)
 *                 as the right/bottom edge of possibilities. Default is "false", which means the entire image will
 *                 always be shown.
 *
 *   direction -- The direction to point the initial animation of the image in degrees. 0 is up. This can be a singleton
 *                value, a min/max pair (when an array with two members), or a set of directions to randomly choose
 *                from (when an array with >2 members).
 *
 *   speed -- Speed of animation in pixels per second. Default is 100.
 *
 *   bounce -- How to act when the leading/trailing* edge of the image encounters a side of the container. Valid
 *             values are: "wrap", "bounce", "restart".
 *             (* For "wrap" and "restart", it's the trailing edge, and for "bounce" it's the leading edge.
 *             Default is "bounce".
 *
 *   rotate_speed -- The number of degrees per second to rotate the image. Default is 0 (no rotating).
 *
 *   rotate_range -- An array of two values, a "from" angle and a "to" angle, which the rotation will rotate
 *                   through. Values must be between 0 and 359. If the first number is smaller than the second,
 *                   the rotation direction is clockwise, otherwise counter-clockwise. The default is "[0,359]".
 *
 *   rotate_bounce -- True/false: whether to "bounce" when the rotation comes to the limit. If false, the animation
 *                    just starts at the beginning (spin round and round). If true, the rotation reverses
 *                    itself (ex. if rotate_range is "[100, 200]", rotation will go from 100 to 200 degrees, then
 *                    from 200 to 100, then from 100 to 200, and so on). Default is false.
 *
 *   delay -- Number of seconds from calling start() to start animating the given image instance. Used
 *            each time when bounce is set to "restart". Default is 0.
 *
 *   image_rot -- True/False: rotate images in the input array instead of randomly choosing. Default is false (i.e. randomly select).
 *
 *   pos_rot -- Ditto, but for start_x and start_y arrays. Default is false (i.e. randomly select).
 *
 *   direction_rot -- Ditto, but for direction. Default is false (i.e. randomly select).
 *
 *
 * Methods:
 *   start() -- Start (or re-start) all animations from their initial positions.
 *
 *   pause() -- Pause all animations.
 *
 *   unpause() -- Restart animations after a pause.
 *
 *   stop() -- Remove the images from the screen altogether.
 *
 */


/*
 *
 *  MetaPong: Constructor....
 *
 */
function MetaPong(params) {
	var thisthis = this;

	MetaPong_private(this);		// load non-public methods

	this.isError = !this.processParams(params);
};

/*
 * MetaPong: "Public" Methods...
 *
 */
MetaPong.prototype.start = function(){
	this.urlIdxOn = 0;			// when image_rot is true, we use this for image_url
	this.xPosIdxOn = 0;			// when pos_rot is true, we use this for start_x
	this.yPosIdxOn = 0;			// when pos_rot is true, we use this for start_y
	this.dirIdxOn = 0;			// when direction_rot is true, we use this for direction

	this.imageList = [];
	this.isPaused = false;
	this.isStopped = false;

	this.imagesLoaded = false;

	this.clockspeed = 60;		// we're going to use the system animation clock now, so it's now universal

	//
	// create a MetaPongImage object for each object we need to create
	//
	for(var i = 0; i != this.count; i++){
		var img = new MetaPongImage(this);
		this.imageList.push(img);
	}

	//
	// start main animation loop...
	//
	this.mainLoop();

};

MetaPong.prototype.pause = function(){
	this.isPaused = true;
};

MetaPong.prototype.unpause = function(){
	this.isPaused = false;
};

MetaPong.prototype.stop = function(){
	this.isStopped = true;

	for(var i = 0; i != this.imageList.length; i++){
		this.imageList[i].destroy();
	}
};

/*
 * MetaPong: "Private" Methods...
 *
 */
function MetaPong_private(thisthis) {
	thisthis.timeoutRoutine = function(func) {
		window.requestAnimationFrame(function(timestamp){
			func();
		});
	}

	thisthis.mainLoop = function () {
		if(!(thisthis.imagesLoaded)){
			// check to see if all of the images have loaded yet...
			var i;
			for (i = 0; i != thisthis.imageList.length; i++) {
				if(thisthis.imageList[i].imageError){
					thisthis.errorMessage = "Error loading image [" + thisthis.imageList[i].url + "]";
					console.log("MetaPong: " + thisthis.errorMessage);
					thisthis.isError = true;
					return;		// die
				}
				if(!(thisthis.imageList[i].imageLoaded)){
					break;
				}
			}

			if(i == thisthis.imageList.length){
				// everything passed... we're good to go... we'll be good next
				thisthis.imagesLoaded = true;

				// fall through to normal loop processing...
			}
			else {
				// still waiting... don't execute the rest and come back here in 200ms
				thisthis.timeoutRoutine(thisthis.mainLoop);
				return;
			}
		}
		if (!(thisthis.isPaused)) {
			for (var i = 0; i != thisthis.imageList.length; i++) {
				if (thisthis.imageList[i].currentDelay > 0) {
					thisthis.imageList[i].currentDelay -= thisthis.clockspeed;
				}
				else {
					thisthis.imageList[i].draw();
					thisthis.imageList[i].calcNextPos();
				}
			}
		}
		if (!(thisthis.isStopped)) {
			thisthis.timeoutRoutine(thisthis.mainLoop);
		}
	}

	thisthis.processParams = function (params) {
		//
		// subroutines to process various kinds of inputs...
		//
		function stringOrArrayParam(paramName, defaultVal) {
			if (params.hasOwnProperty(paramName)) {
				if (typeof params[paramName] === "string") {
					thisthis[paramName] = [params[paramName]];
				}
				else {
					thisthis[paramName] = params[paramName];
				}
			}
			else {
				thisthis[paramName] = defaultVal;
			}
		}

		function boolParam(paramName, defaultVal) {
			if (params.hasOwnProperty(paramName)) {
				thisthis[paramName] = params[paramName];
			}
			else {
				thisthis[paramName] = defaultVal;
			}
		}

		function numberParam(paramName, defaultVal) {
			if (params.hasOwnProperty(paramName)) {
				var num = parseInt(params[paramName]);

				if(isNaN(num)){
					console.log("MetaPong: param [" + paramName + "] invalid (must be a number); using default.");
					thisthis[paramName] = defaultVal;
				}
				else {
					thisthis[paramName] = num;
				}
			}
			else {
				thisthis[paramName] = defaultVal;
			}
		}

		function stringParam(paramName, defaultVal, validVals) {
			if (params.hasOwnProperty(paramName)) {
				if (validVals.indexOf(params[paramName]) == -1) {
					console.log("MetaPong: param [" + paramName + "] invalid; using default.");
					thisthis[paramName] = defaultVal;
				}
				else {
					thisthis[paramName] = params[paramName];
				}
			}
			else {
				thisthis[paramName] = defaultVal;
			}
		}

		//
		// now process the individual params...
		//
		if (params.hasOwnProperty("container")) {
			thisthis.container = document.getElementById(params.container);
			if (thisthis.container == null) {
				console.log("MetaPong: invalid container ID; using document.documentElement instead.");
				thisthis.container = document.documentElement;
			}
		}
		else {
			thisthis.container = document.documentElement;
		}

		stringOrArrayParam("image_url", []);


		if (thisthis.image_url.length == 0) {
			console.log("MetaPong: no URL specified. Die.");
			thisthis.errorMessage = "No URL for an image specifed. Must specify at least one image URL.";
			return false;
		}

		numberParam("count", 1);
		stringOrArrayParam("start_x", ["0%", "100%"]);
		stringOrArrayParam("start_y", ["0%", "100%"]);
		boolParam("start_clip", false);
		stringOrArrayParam("direction", [0, 359]);
		numberParam("speed", 100);
		stringParam("bounce", "bounce", ["bounce", "wrap", "restart"]);
		numberParam("rotate_speed", 0);

		stringOrArrayParam("rotate_range", [0, 359]);
		if(thisthis.rotate_range.length != 2){
			console.log("MetaPong: rotate_range input array must have exactly two members: reverting to default.");
			this.rotate_range = [0,359];
		}
		else {
			var normalizeRR = function (rr) {
				if (rr > 359) {
					console.log("MetaPong: rotate_range input member is > 359; converting to value % 360.");
					return rr % 360;
				}
				else if (rr < 0) {
					// should we allow negative degrees? for now, just punt...
					console.log("MetaPong: rotate_range input member is negative: resetting to zero.");
					return 0;
				}
				else {
					return rr;
				}
			};
			this.rotate_range[0] = normalizeRR(this.rotate_range[0]);
			this.rotate_range[1] = normalizeRR(this.rotate_range[1]);
		}

		boolParam("rotate_bounce", false);
		numberParam("delay", 0);

		boolParam("image_rot", false);
		boolParam("pos_rot", false);
		boolParam("direction_rot", false);

		return true;
	};

	thisthis.getNextUrl = function () {
		if (thisthis.image_rot) {
			var rv = thisthis.image_url[thisthis.urlIdxOn];

			if (thisthis.urlIdxOn == thisthis.image_url.length-1) {
				thisthis.urlIdxOn = 0;
			}
			else {
				thisthis.urlIdxOn++;
			}
			return rv;
		}
		else {
			var randIdx = _randBetween(0, thisthis.image_url.length - 1);

			return thisthis.image_url[randIdx];
		}
	};

	thisthis.getStartingX = function (imageWidth) {
		return thisthis.getStartingXY(true, imageWidth);
	};

	thisthis.getStartingY = function (imageHeight) {
		return thisthis.getStartingXY(false, imageHeight);
	};


	thisthis.getStartingXY = function (isX, imageSize) {
		var containerSize = isX ? thisthis.getWidth() : thisthis.getHeight();
		var startVar = isX ? thisthis.start_x : thisthis.start_y;

		if(!(thisthis.start_clip)){
			containerSize -= imageSize;		// make the container effective smaller so we'll never clip in this dimension
		}

		if (thisthis.pos_rot) {
			var posIdxOn = isX ? thisthis.xPosIdxOn : thisthis.yPosIdxOn;

			var rv = _getPos(startVar[posIdxOn], containerSize);

			if (posIdxOn == startVar.length-1) {
				if(isX){
					thisthis.xPosIdxOn = 0;
				}
				else {
					thisthis.yPosIdxOn = 0;
				}
			}
			else {
				if(isX){
					thisthis.xPosIdxOn++;
				}
				else {
					thisthis.yPosIdxOn++;
				}
			}
			return rv;
		}
		else {
			if(startVar.length == 2){
				//
				// get a random number between the two values..
				//
				var randNum = _randBetween(startVar[0], startVar[1]);

				if((typeof startVar[0] === "string") && startVar[0].indexOf("%") != -1){
					return _getPos(randNum + "%", containerSize);
				}
				else {
					return _getPos(randNum, containerSize);
				}
			}
			else {
				//
				// otherwise pick a random element from the array...
				//
				return _getPos(startVar[_randBetween(0, startVar.length-1)], containerSize);
			}
		}
	};

	thisthis.getStartingDirection = function () {
		if (thisthis.direction_rot) {
			var rv = thisthis.direction[thisthis.dirIdxOn];

			if (thisthis.dirIdxOn == thisthis.direction.length-1) {
				thisthis.dirIdxOn = 0;
			}
			return rv;
		}
		else {
			if(thisthis.direction.length == 2){
				//
				// get a random number between the two values..
				//
				return _randBetween(thisthis.direction[0], thisthis.direction[1]);
			}
			else {
				//
				// otherwise pick a random element from the array...
				//
				return thisthis.direction[_randBetween(0, thisthis.direction.length-1)];
			}
		}
	};

	thisthis.getWidth = function () {
		return this.container.clientWidth;
	};

	thisthis.getHeight = function () {
		return this.container.clientHeight;
	};

	function _getPos(posvar, containerSize){
		if(!(typeof posvar === "string")){
			return posvar;
		}
		if(posvar.indexOf("%") != -1){
			var pctVal = parseInt(posvar.replace("%", ""));

			if(isNaN(pctVal)){
				// should complain somehow?
				return 0;
			}
			else {
				var pctMult = pctVal / 100;
				return Math.floor(pctMult * containerSize);
			}
		}
		else {
			var pixVal = parseInt(posvar.replace("px", ""));
			if(isNaN(pixVal)){
				// should complain somehow?
				return 0;
			}
			else {
				return pixVal;
			}
		}
	}

	thisthis.getXpos = function (posvar) {
		// calculate the x pos from the given input var based on the current container
		return _getPos(posvar, thisthis.getWidth());
	};

	thisthis.getYpos = function (posvar) {
		// calculate the y pos from the given input var based on the current container
		return _getPos(posvar, thisthis.getHeight());
	};
}


/*
 *
 *
 * MetaPongImage class
 *
 *
 */
function MetaPongImage(metapong)
{
	var thisthis = this;		// keep a pointer to the top-level object around

	this.metapong = metapong;
	this.url = metapong.getNextUrl();
	this.direction = metapong.getStartingDirection();
	this.imageTag = null;					// the first call to draw() will create this...

	this.currentRotate = this.metapong.rotate_range[0];				// inititial rotation positon
	this.currentRotateIsClockwise = true;							// start going clockwise
	this.cyclesSinceLastRotate = 0;

	this.imageLoaded = false;
	this.imageError = false;
	this.imageAdded = false;
	this.height = 0;
	this.width = 0;

	this.imageTag = document.createElement("img");
	this.imageTag.onload = function(){
		thisthis.imageLoaded = true;
		thisthis.height = this.height;
		thisthis.width = this.width;
		thisthis.posX = thisthis.metapong.getStartingX(this.height);
		thisthis.posY = thisthis.metapong.getStartingY(this.width);
	}
	this.imageTag.onerror = function(){
		thisthis.imageError = true;
	}
	this.imageTag.setAttribute("src", this.url);
	this.imageTag.style.position = "absolute";

	this.currentDelay = this.metapong.delay;		// initial delay
}


MetaPongImage.prototype.draw = function()		// set the IMG tag to the current location and rotate based on the current rotation
{
	//
	// create the img tag if we haven't already...
	//
	this.imageTag.style.left = this.posX + "px";
	this.imageTag.style.top = this.posY + "px";

	if (!(this.imageAdded)) {
		this.metapong.container.appendChild(this.imageTag);
		this.imageAdded = true;
	}

	if (this.metapong.rotate_speed != 0) {
		this.imageTag.style.WebkitTransform = "rotate(" + this.currentRotate + "deg)";		// For Chrome, Safari, Opera
		this.imageTag.style.msTransform = "rotate(" + this.currentRotate + "deg)";			// For IE9
		this.imageTag.style.transform = "rotate(" + this.currentRotate + "deg)"				// Standard syntax
	}
};


MetaPongImage.prototype.calcNextPos = function(){
	//
	// set the new x/y and rotation vars for the next cycle -- this is the main animation logic...
	//
	//
	var cyclesPerSecond = 1000 / this.metapong.clockspeed;

	//
	// Rotation...
	//
	if(this.metapong.rotate_speed != 0){
		//
		// we might not need to rotate in every cycle. because of this, we need to keep track of how
		// many cycles it's been since we last rotated, and rotate to the current position.
		// note here that "cycles" means how many times we've tried to draw(), not necessarily real wall time.
		//

		//
		// to get degrees, we need to calculate how many cycles at our current clockspeed would
		// take a second, and then divide that by rotate_speed
		//
		var degreesPerCycle = this.metapong.rotate_speed / cyclesPerSecond;		// need to leave this float
		var degreesToRotate = Math.floor((this.cyclesSinceLastRotate+1) * degreesPerCycle);

		if(degreesToRotate != 0){
			//
			// we have a whole number degree to rotate... figure out what to rotate to...
			//
			if(this.metapong.rotate_bounce) {
				// some handy vars to allow us to work on a continuous number line...
				var effectiveUpperLimit = this.metapong.rotate_range[1];
				if(this.metapong.rotate_range[1] < this.metapong.rotate_range[0]) {
					effectiveUpperLimit += 360;
				}
				var effectiveCurrentRotate = this.currentRotate;
				if(this.metapong.rotate_range[1] < this.metapong.rotate_range[0]) {
					if(this.currentRotate < this.metapong.rotate_range[0]) {
						effectiveCurrentRotate += 360;
					}
				}

				if (this.currentRotateIsClockwise){
					if ( (effectiveCurrentRotate + degreesToRotate) > effectiveUpperLimit) {
						// gone past the edge... do a "bounce": rotate the other direction the remaining way and reverse
						//
						this.currentRotate += this.metapong.rotate_range[1] - (this.currentRotate + degreesToRotate);
						this.currentRotateIsClockwise = false;
					}
					else {
						this.currentRotate += degreesToRotate;
						if(this.currentRotate >= 360){
							this.currentRotate -= 360;
						}
					}
				}
				else {
					// should be perfect inverse of above...
					//
					if ((effectiveCurrentRotate - degreesToRotate) < this.metapong.rotate_range[0]) {
						// gone past the edge... do a "bounce": rotate the other direction the remaining way and reverse
						//
						this.currentRotate = (this.currentRotate+degreesToRotate) % 360;
						this.currentRotateIsClockwise = true;
					}
					else {
						this.currentRotate -=  degreesToRotate;
						if(this.currentRotate <= 0){
							this.currentRotate += 360;
						}
					}
				}
			}
			else {
				//
				// simpler: wrap mode...
				//
				if((this.currentRotate + degreesToRotate) > this.metapong.rotate_range[1]) {
					this.currentRotate = this.metapong.rotate_range[0];		// reset to beginning of range
				}
				else {
					this.currentRotate += degreesToRotate;
				}
			}
			this.cyclesSinceLastRotate = 0;
		}
		else {
			// no whole degree to rotate... skip until next cycle...
			this.cyclesSinceLastRotate++;
		}
	}

	//
	// movement...
	//
	var degreesFromAngle = function(angle) { return angle * (180 / Math.PI); };
	var angleFromDegree = function(angle){ return angle * Math.PI / 180; };

	var pixelsToMove = Math.floor(this.metapong.speed / cyclesPerSecond);

	var moveX = Math.cos(angleFromDegree(this.direction)) * pixelsToMove;
	var moveY = Math.sin(angleFromDegree(this.direction)) * pixelsToMove;

	var newX = this.posX + moveX;
	var newY = this.posY + moveY;

	if( (newX < 0 || newX > (this.metapong.getWidth()-this.width) ) || (newY < 0 || newY > (this.metapong.getHeight()-this.height) ) ){
		//
		// we've run into a wall...
		//
		if(this.metapong.bounce == "bounce"){
			// reflect the current direction based on the well we hit...
			var wallAngle;

			if(newX < 0 || newX > (this.metapong.getWidth()-this.width)) {
				// X pos was the culprit...
				wallAngle = 90;
			}
			else {
				// Y pos was the culprit...
				wallAngle = 0;
			}
			this.direction = (wallAngle * 2) - this.direction;
		}
		else if(this.metapong.bounce == "wrap"){
			if(newX < 0 || newX > (this.metapong.getWidth()-this.width)){
				// X pos was the culprit...
				if(newX < 0){
					// tried to go past the beginning, restart at the right...
					this.posX = this.metapong.getWidth() - this.width;
				}
				else {
					// tried to go past the end, restart at zero
					this.posX = 0;
				}
			}
			else {
				// Y pos was the culprit...
				if(newY < 0){
					// tried to go past the beginning, restart at the bottom...
					this.posY = this.metapong.getHeight() - this.height;
				}
				else {
					// tried to go past the end, restart at zero
					this.posY = 0;
				}
			}
		}
		else if(this.metapong.bounce == "restart"){
			this.posX = this.metapong.getStartingX(this.width);
			this.posY = this.metapong.getStartingY(this.height);

			//
			// implement the Start Delay...
			//
			this.currentDelay = this.metapong.delay;
		}
		else {
			// cannot get here, based on param validation...
		}
	}
	else {
		this.posX = newX;
		this.posY = newY;
	}
};


MetaPongImage.prototype.destroy = function(){
	// delete the img tag from the container (if it hasn't been removed already)
	if(this.imageTag.parentNode != null) {
		this.imageTag.parentNode.removeChild(this.imageTag);
	}
};

//
// subroutines...
//



function _randBetween(minStr, maxStr) {
	var min = (typeof minStr === "string") ? parseInt(minStr.replace("px", "").replace("%", "")) : minStr;
	var max = (typeof maxStr === "string") ? parseInt(maxStr.replace("px", "").replace("%", "")) : maxStr;

	var rnd = Math.random();

	return Math.floor(rnd * (max - min + 1)) + min;
}

function _clog(str) { console.log(str)}

function _dumpobj(obj) {
	_clog(JSON.stringify(obj, null, "\t"));
}

