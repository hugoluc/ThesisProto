
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
};

animation.prototype.stop = function(){
  this.finished = true;
  this.obj = [];
}

animation.prototype.init = function(dest,length,offset){


  this.finished = false;
  this.timeSet = false;

  this.dest = {
    x : dest.x,
    y : dest.y,
  }

  
  this.offset = offset || 0;
  this.anLength = length || 2000;

  var start = {};
  start.x = this.obj.getBounds().x || this.obj.x
  start.y = this.obj.getBounds().y || this.obj.y

  this.startPos = {};
  this.startPos.x = this.obj.x;
  this.startPos.y = this.obj.y;

  this.distance = {};
  this.distance.x = this.dest.x - start.x;
  this.distance.y =  this.dest.y - start.y;

  this.speed = {};
  this.speed.x = this.distance.x/this.anLength;
  this.speed.y = this.distance.y/this.anLength;

  this.now = 0;

  // console.log("start",this.startPos) 
  // console.log("dest",this.dest.x,this.dest.y)
  // console.log("distance:","x:" + this.distance.x ,"y:" +this.distance.y);
  // console.log("speed:", "x:" +this.speed.x ,"y:" + this.speed.y);
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
      
      this.obj.x = this.obj.x + frameTime * this.speed.x
      this.obj.y = this.obj.y + frameTime * this.speed.y      
    
    }

    
    return false


  }
};

animation.prototype.bezier = function(_t,_p0,_p1,_p2,_p3){

  var _u = 1 - _t;
  var _tt = _t * _t;
  var _uu = _u * _u;
  var _uuu = _uu * _u;
  var _ttt = _tt * _t;

  var px = _uuu * _p0.x; //first term
  px = px + (3 * _uu * _t * _p1.x); //second term
  px = px + (3 * _u * _tt * _p2.x); //third term
  px = px + (_ttt * _p3.x); //fourth term

  var py = (_uuu * _p0.y) ; //first term
  py = py + (3 * _uu * _t * _p1.y); //second term
  py = py + (3 * _u * _tt * _p2.y); //third term
  py = py + (_ttt * _p3.y); //fourth term

  return {x:px,y:py}
};
