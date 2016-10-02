
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o) {
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function getAngle(x,y,_x,_y){

  return -Math.atan2(x - _x, y - _y)
}

function getDistance(x,y,_x,_y){
  var oposite = _x - x;
  var adjacent = _y - y;
  var hipotenuse = Math.sqrt((oposite*oposite)+(adjacent*adjacent))
  return hipotenuse
};

function getRandomInt(min, max) {

  return Math.floor(Math.random() * (max-min)) + min;

};

function getRandomFloat(min, max){

  return Math.random() * (max-min) + min;

}

// hides one page and shows the next
function clickStart(hide, show) {

        document.getElementById(hide).style.display="none";
        document.getElementById(show).style.display = "block";
        window.scrollTo(0,0);
};

function getRandomColor() {

    var letters = '0123456789ABCDEF'.split('');
    var color = '#';

    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Clock
-------------------------------------------------------------------------------------------------------------
*/


  function ClockTimer(){

    this.timerStarted = false;

  };

  ClockTimer.prototype.start = function(_length){

      this.timerStarted = true;
      this.setTime = _length;
      this.startTime = Date.now();
      this.last = Date.now();
  };

  ClockTimer.prototype.timeOut = function() {

    if(Date.now()-this.startTime > this.setTime){

      return true;

    }else{

      return false;
    }

  };

  ClockTimer.prototype.timerRunnnig = function(){

    return this.timerStarted

  };

  ClockTimer.prototype.cancel = function(){

    this.timerStarted = false

  };

  ClockTimer.prototype.getElapsed = function(){

      return Date.now() - this.startTime;
  };

/*
-------------------------------------------------------------------------------------------------------------
                                                Class: Animation
-------------------------------------------------------------------------------------------------------------
*/


function animation(obj){

  //receives a PIXI.Object object
  if(obj == undefined){

    throw "animation: PIXI object passed as the parameter in the animation contructor"

  }

  this.timeSet = false;
  this.lastTime = 0;
  this.obj = obj;
  this.bezier = false;

  this.logCount = 0

  this.print = false
};

animation.prototype.stop = function(){
  this.finished = true;
  this.obj = [];
};

animation.prototype.initFeature = function(_feature,_dest,_length,_offset,_bezier){

  this.dest = _dest
  console.log(_dest)
  this.feaFinished = false;
  this.feaTimeSet = false;

  this.feature = _feature
  this.feaLength = _length
  this.feaOff = _offset || 0

  if(this.feature.constructor !== Array){

    this.featureStart = this.obj[this.feature]
    this.featureDistance = _dest - this.featureStart
    this.featureSpeed = this.featureDistance / this.feaLength

  }else{

    this.featureStart = []
    this.featureDistance = []
    this.featureSpeed = []

    for(var i = 0; i < this.feature.length; i++){

      if(this.feature[i] == "scale.x"){

        this.feature[i] = this.obj

      }else if (this.feature[i] == "scale.y"){


      }

      this.featureStart.push(this.obj[this.feature[i]])

      if(_dest.constructor !== Array){
        this.featureDistance.push(_dest - this.featureStart[i])
      }else{
        this.featureDistance.push(_dest[i] - this.featureStart[i])
      }


      this.featureSpeed.push(this.featureDistance[i] / this.feaLength)

    }

  }

  if(_bezier != undefined ){

    this.feaBezier = true;
    this.feaBezName = _bezier[0].toFixed(2) + "-" + _bezier[1].toFixed(2)

  };

  //console.log("INITIALIZING FEATURE: ", this.feature);
  //console.log("Current Value is: ", this.obj[this.feature]);

};

animation.prototype.runFeature = function(_log){

  if(this.feaFinished){
    return true;
  };

  if(!this.feaTimeSet){ // caaled only the first frame of animation

    this.feaStartTime = Date.now();
    frameTime =  0;
    elapsed = 0;
    this.feaTimeSet = true;

  }else{

    var elapsed = this.feaNow - this.feaStartTime;

  };

  var last = this.feaNow;
  this.feaNow = Date.now();
  var frameTime = this.feaNow - last;

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Position after animation is done
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  if(elapsed > this.feaLength + this.feaOff){

    if(this.feature.constructor === Array){

      for(var i = 0; i < this.feature.length; i++){

        this.obj[this.feature[i]] = this.featureStart[i] + this.featureDistance[i]
        this.feaFinished = true

      };

    }else{

      for(var i = 0; i < this.feature.length; i++){

        this.obj[this.feature] = this.featureStart + this.featureDistance
        this.feaFinished = true

      };

    };

    return true

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Animate features
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  }else{

    if(elapsed >= this.feaOff){

      if(this.feaBezier){

        var location = Math.floor(((elapsed-this.feaOff)*(bezierCurveSpecs[this.feaBezName].length-1))/this.feaLength)
        bez = bezierCurveSpecs[this.feaBezName][location]


        if(this.feature.constructor === Array){

          for(var i = 0; i < this.feature.length; i++){

            this.obj[this.feature[i]] = this.featureStart[i] + (this.featureDistance[i] * bez)

          }

        }else{

          if(this.print){

            console.log("location ", location);
            console.log("bezdata ", bez);
            console.log("feature", this.feature)
            console.log("featureValue ", this.obj[this.feature]);
            console.log("last ", last);
            console.log("this.now ", this.feaNow);
            console.log("framtetime ", frameTime);
            console.log("this.starttime ", this.feaStartTime);

          }

          this.obj[this.feature] = this.featureStart + (this.featureDistance * bez)

        }

      }else{

        if(this.feature.constructor === Array){

          for(var i = 0; i < this.feature.length; i++){

            this.obj[this.feature[i]] = this.obj[this.feature[i]] + (frameTime * this.featureSpeed[i])
            this.obj[this.feature[i]] = this.obj[this.feature[i]] + (frameTime * this.featureSpeed[i])

          }

        }else{

          this.obj[this.feature] = this.obj[this.feature] + (frameTime * this.featureSpeed)

        };

      };

    };

    return false;

  };
};

animation.prototype.log = function(){

  if(this.logCount == 0){

    console.log(">>>>>>>>>>>>>>>>>>>>>")
    console.log(this.obj.x,this.obj.y)
    console.log(this.obj.constructor.name);
    console.log("startPos: ", this.startPos)
    console.log("distance: ", this.distance)
    console.log("speed: ", this.speed)
    console.log("bounds: ", this.obj.getBounds() )
    console.log("features:-------")
    console.log("Feature: ", this.feature );
    console.log("feature value ", this.obj[this.feature])
    console.log("startPos: ", this.featureStart)
    console.log("distance: ", this.featureDistance)
    console.log("speed: ", this.featureSpeed)
    console.log("dest: ", this.dest )
    console.log("Bezier:--------");
    console.log("bezfeature:", this.feaBezName);
    console.log(">>>>>>>>>>>>>>>>>>>>>")

    this.logCount++


  }else if(this.logCount < 10){

    this.logCount++

    console.log("---------------------")
    console.log(this.obj.x, this.obj.y)
    if(this.feature){

    console.log("feature: ", this.obj[this.feature])

    }

    this.print = true

  }else{

    this.print = false

  }

}

animation.prototype.setPos = function(dest){

  this.dest = {
    x : dest.x,
    y : dest.y,
  }

  var start = {};

  if(this.obj.constructor.name != "Container"){

    start.x = this.obj.x
    start.y = this.obj.y

    this.startPos = {};
    this.startPos.x = this.obj.x;
    this.startPos.y = this.obj.y;

    this.distance = {};
    this.distance.x = this.dest.x - (start.x);
    this.distance.y =  this.dest.y - (start.y);

  }else{

    start.x = this.obj.getBounds().x
    start.y = this.obj.getBounds().y

    this.startPos = {};
    this.startPos.x = this.obj.x;
    this.startPos.y = this.obj.y;

    this.distance = {};
    this.distance.x = this.dest.x - (this.startPos.x);
    this.distance.y =  this.dest.y - (this.startPos.y);

  }

  this.obj.x = this.obj.x + this.distance.x;
  this.obj.y = this.obj.y + this.distance.y;
};

animation.prototype.run = function(){

  if(this.finished){
    return true
  }

  var last = this.now;
  this.now = Date.now();
  var frameTime = this.now - last;
  var elapsed;

  if(!this.timeSet){

    this.StartTime = Date.now();
    this.lastTime = this.StartTime
    this.timeSet = true;
    frameTime =  0

  }else{
    var elapsed = this.now - this.StartTime
  }

  if(elapsed > this.anLength+this.offset){

    this.obj.x =  this.startPos.x + this.distance.x
    this.obj.y =  this.startPos.y + this.distance.y
    this.finished = true;

    return true

  }else{

    if(elapsed >= this.offset){

      if(this.bezier){

        var location = Math.floor(((elapsed-this.offset)*bezierCurveSpecs[this.bezName].length - 1)/this.anLength)
        bez = bezierCurveSpecs[this.bezName][location]

        if(this.print){

          console.log("bezire!--:")
          console.log("position:", this.obj.x,this.obj.y);
          console.log(location)
          console.log(bez)

        }

        this.obj.y = this.startPos.y + (this.distance.y * bez);
        this.obj.x = this.startPos.x + (this.distance.x * bez);

      }else{

        this.obj.x = this.obj.x + frameTime * this.speed.x;
        this.obj.y = this.obj.y + frameTime * this.speed.y;

      }

    }

    return false


  }
};

animation.prototype.init = function(dest,length,offset,bezier){

  this.finished = false;
  this.timeSet = false;

  if(bezier != undefined ){
    this.bezier = true;
    this.bezName = bezier[0].toFixed(2) + "-" + bezier[1].toFixed(2)
  }

  this.dest = {
    x : dest.x,
    y : dest.y,
  }

  this.offset = offset || 0;
  this.anLength = length || 2000;

  var start = {};

  if(this.obj.constructor.name != "Container"){

    start.x = this.obj.x
    start.y = this.obj.y

    this.startPos = {};
    this.startPos.x = this.obj.x;
    this.startPos.y = this.obj.y;

    this.distance = {};
    this.distance.x = this.dest.x - (start.x);
    this.distance.y =  this.dest.y - (start.y);



  }else{


    start.x = this.obj.getBounds().x
    start.y = this.obj.getBounds().y

    this.startPos = {};
    this.startPos.x = this.obj.x;
    this.startPos.y = this.obj.y;

    this.distance = {};
    this.distance.x = this.dest.x - (this.startPos.x);
    this.distance.y =  this.dest.y - (this.startPos.y);

  }

  this.speed = {};
  this.speed.x = this.distance.x/this.anLength;
  this.speed.y = this.distance.y/this.anLength;

  this.now = 0;
};

animation.prototype.runScale = function(){

  if(this.finished){
    return true
  }

  var last = this.now;
  this.now = Date.now();
  var frameTime = this.now - last;
  var elapsed;

  if(!this.timeSet){

    this.StartTime = Date.now();
    this.lastTime = this.StartTime
    this.timeSet = true;
    frameTime =  0

  }else{
    var elapsed = this.now - this.StartTime
  }

  if(elapsed > this.anLength+this.offset){

    this.obj.scale.x =  this.startPos.x + this.distance.x
    this.obj.scale.y =  this.startPos.y + this.distance.y
    this.finished = true;

    return true

  }else{

    if(elapsed >= this.offset){

      if(this.bezier){

        var location = Math.floor(((elapsed-this.offset)*bezierCurveSpecs[this.bezName].length - 1)/this.anLength)
        bez = bezierCurveSpecs[this.bezName][location]

        if(this.print){

          console.log("bezire!--:")
          console.log("position:", this.obj.scale.x,this.obj.scale.y);
          console.log(location)
          console.log(bez)

        }

        this.obj.scale.y = this.startPos.y + (this.distance.y * bez);
        this.obj.scale.x = this.startPos.x + (this.distance.x * bez);

      }else{

        this.obj.scale.x = this.obj.scale.x + frameTime * this.speed.x;
        this.obj.scale.y = this.obj.scale.y + frameTime * this.speed.y;

      }

    }

    return false


  }
};

animation.prototype.initScale = function(dest,length,offset,bezier){

  this.finished = false;
  this.timeSet = false;

  if(bezier != undefined ){
    this.bezier = true;
    this.bezName = bezier[0].toFixed(2) + "-" + bezier[1].toFixed(2)
  }

  this.dest = {
    x : dest.x,
    y : dest.y,
  }

  this.offset = offset || 0;
  this.anLength = length || 2000;

  var start = {};

  start.x = this.obj.scale.x
  start.y = this.obj.scale.y

  this.startPos = {};
  this.startPos.x = this.obj.scale.x;
  this.startPos.y = this.obj.scale.y;

  this.distance = {};
  this.distance.x = this.dest.x - (this.startPos.x);
  this.distance.y =  this.dest.y - (this.startPos.y);

  this.speed = {};
  this.speed.x = this.distance.x/this.anLength;
  this.speed.y = this.distance.y/this.anLength;

  this.now = 0;

};
