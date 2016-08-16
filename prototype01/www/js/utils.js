
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

};

animation.prototype.stop = function(){

  this.finished = true;
  this.obj = [];
};

animation.prototype.initFeature = function(_feature,_dest,_length,_offset,_bezier){


  this.dest = _dest
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

      this.featureStart.push(this.obj[this.feature[i]])
      this.featureDistance.push(_dest - this.featureStart[i])
      this.featureSpeed.push(this.featureDistance[i] / this.feaLength)

    }


  }

  if(_bezier != undefined ){
  
    this.feaBezier = true;
    this.feaBezName = _bezier[0].toFixed(2) + "-" + _bezier[1].toFixed(2)
  
  };

};

animation.prototype.runFeature = function(_log){

  if(this.feaFinished){
    return true;
  };

  var last = this.feaNow;
  this.feaNow = Date.now();
  var frameTime = this.feaNow - last;

  if(!this.feaTimeSet){
  
    this.feaStartTime = Date.now();
    this.feaLastTime = Date.now();
    this.feaTimeSet = true;
    frameTime =  0

  };

  var elapsed = this.feaNow - this.feaStartTime


  // if(_log){
  //     console.log("distance", this.featureDistance)
  //     console.log("obj", this.obj)
  //     console.log("feateure", this.feature)
  // }

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

        var location = Math.floor(((elapsed-this.offset)*bezierCurveSpecs[this.bezName].length - 1)/this.anLength)
        bez = bezierCurveSpecs[this.feaBezName][location]


        if(this.feature.constructor === Array){

          for(var i = 0; i < this.feature.length; i++){

            this.obj[this.feature[i]] = this.featureStart[i] + (this.featureDistance[i] * bez)

          }

        }else{
        
          this.obj[this.feature] = this.featureStart + (this.featureDistance * bez)
        
        }
      
      }else{

        if(this.feature.constructor === Array){

          for(var i = 0; i < this.feature.length; i++){

            this.obj[this.feature[i]] = this.obj[this.feature[i]] + (frameTime * this.featureSpeed[i]) 

            // console.log(">>>>>>>>>>>>>>>>>")
            // console.log(i, this.obj[this.feature[i]])
            // console.log(frameTime, this.featureSpeed[i])

            this.obj[this.feature[i]] = this.obj[this.feature[i]] + (frameTime * this.featureSpeed[i]) 
          
          }

        }else{

          this.obj[this.feature] = this.obj[this.feature[i]] + (frameTime * this.featureSpeed[i])         
        
        };

      };

    };

    return false;
  
  };
};

animation.prototype.log = function(){

  if(this.logCount == 0){

    console.log("---------------------")
    console.log(this.obj)
    console.log("startPos: ", this.startPos)
    console.log("distance: ", this.distance)
    console.log("speed: ", this.speed)
    console.log("bounds: ", this.obj.getBounds() )
    console.log("features:-------")
    console.log("startPos: ", this.featureStart)  
    console.log("distance: ", this.featureDistance)
    console.log("speed: ", this.featureSpeed)
    console.log("dest: ", this.dest )  

    this.logCount++


  }else if(this.logCount < 10){

    this.logCount++

    console.log("---------------------")
    console.log(this.obj.x, this.obj.y)
    console.log(this.obj.x, this.obj.y)
    console.log("---------------------")
    console.log(this.obj[this.feature])


  }

}

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
    console.log("---------------------------------",start)

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

  
  if(!this.timeSet){
   
    this.StartTime = Date.now();
    this.lastTime = Date.now();
    this.timeSet = true;
    frameTime =  0

  }

  var elapsed = this.now - this.StartTime

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

        this.obj.y = this.startPos.y + (this.distance.y * bez)
        this.obj.x = this.startPos.x + (this.distance.x * bez)


      }else{

        this.obj.x = this.obj.x + frameTime * this.speed.x
        this.obj.y = this.obj.y + frameTime * this.speed.y

      }      
    
    }
    
    return false


  }
};
