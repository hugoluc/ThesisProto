
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

  this.timeSet = false;
  this.lastTime = 0;
  this.obj = obj;
  this.bezier = false;
};

animation.prototype.stop = function(){
  this.finished = true;
  this.obj = [];
};

animation.prototype.init = function(dest,length,offset,bezier){

  console.log("INIT",LOGTHIS)


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

  // console.log("--------------ANIMATION SETUP---------------------------")
  // console.log("id", this.obj)
  // console.log("startPOS",this.startPos) 
  // console.log("start",start) 
  // console.log("dest",this.dest.x,this.dest.y)
    if(LOGTHIS){

      console.log("distance:","x:" + this.distance.x + " / y:" +this.distance.y);
      console.log("speed:", "x:" + this.speed.x + " / y:" + this.speed.y);      
    
    }  


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

    if(this.obj.children.length != 4){
      return true 
    }

    // console.log("-----ANIMATION DONE!")
    // console.log(this.obj.getBounds())
    // console.log([this.obj.x,this.obj.y])
    // console.log("---------------------- ")

    return true

  }else{

    if(elapsed >= this.offset){

      if(this.bezier){


        var location = Math.floor((elapsed*999)/this.anLength)
        bez = bezierCurveSpecs[this.bezName][location]

        console.log(this.bezName,location,bez)
        console.log((this.distance.y * bez))

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
