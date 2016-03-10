
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o) {
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function getAngle(x,y,_x,_y){

  var oposite = _x - x;
  var adjacent = _y - y;
  var hipotenuse = Math.sqrt((oposite*oposite)+(adjacent*adjacent))
  var sinOfAngleX = oposite / hipotenuse
  return Math.asin(sinOfAngleX)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max-min)) + min;
}

// hides one page and shows the next
function clickStart(hide, show) {

        document.getElementById(hide).style.display="none";
        document.getElementById(show).style.display = "block";
        window.scrollTo(0,0);
}

function getRandomColor() {

    var letters = '0123456789ABCDEF'.split('');
    var color = '#';

    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;

}


function ClockTimer(){

  this.timerStarted = false;

};

ClockTimer.prototype.start = function(_length){

    this.timerStarted = true;
    this.setTime = _length;
    this.startTime = Date.now();

};


ClockTimer.prototype.timerRunnnig = function(){

  return this.timerStarted


}

ClockTimer.prototype.timeOut = function() {

  //console.log(Date.now()-this.startTime)
  if(Date.now()-this.startTime > this.setTime){
    return true;
  }else{
    
    //console.log("------->>SET-TIME: " + this.setTime)
    //console.log("------->>START-TIME: " + this.startTime)
    //console.log("----------->>NOE: " + Date.now())
    return false;
  }

};


ClockTimer.prototype.cancel = function(){

  this.timerStarted = false

}


ClockTimer.prototype.getElapsed = function(){

    return Date.now() - this.startTime;


};

function animation(obj){

  this.timeSet = false;
  this.lastTime = 0;
  this.obj = obj;

}

animation.prototype.init = function(dest,length,style){

  this.finished = false;
  this.timeSet = false;

  this.dest = {
    x : dest.x,
    y : dest.y,
  } 
  
  this.anLength = length || 2000;
  this.style = style || "linear";

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

}

animation.prototype.run = function(){

  if(this.finished){
    return true
  }
  
  if(!this.timeSet){

    //console.log("start",this.startPos)    
    this.StartTime = Date.now();
    this.lastTime = Date.now();
    this.timeSet = true;
  }


  var last = this.now;
  this.now = Date.now();
  // FIXME, first frame is wrong
  var frameTime = this.now - last;

  var now = Date.now();
  var elapsed = now - this.StartTime;

  if(Math.abs(this.speed.x * elapsed) < Math.abs(this.distance.x) || Math.abs(this.speed.y * elapsed) < Math.abs(this.distance.y)){

    var s = false
    if(s){
        
    }else{

      //if linear: 
      var p0 = {x:99.0, y:0.0};
      var p1 = {x:99.0, y:0.0};
      var p2 = {x:99.0, y:1.0};
      var p3 = {x:99.0, y:1.0};

      var t = elapsed / this.anLength;
      var speed = this.bezier(t, p0, p1, p2, p3);

      this.obj.x = this.startPos.x + speed.y * this.distance.x; 
      this.obj.y = this.startPos.y + speed.y * this.distance.y;
    }
    
    return false;

  }else{

    this.obj.x =  this.startPos.x + (this.speed.x * this.anLength) 
    this.obj.y =  this.startPos.y + (this.speed.y * this.anLength) 
    this.finished = true;
    return true
  
  }

}


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

}
