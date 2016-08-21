fs = require('fs');

var decimals = 3
var control = 5

var resolution = Math.pow(10,decimals)
var bezierData = {}

var bezier = function (_t,_p0,_p1,_p2,_p3){

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

var t0 = {x:0,y:0}
var t3 = {x:1,y:1}

for(var i=0; i<control; i++){ // get x values (get one x and y value for every 0.005 in x)


	var n1 = i/(control - 1) 
	// console.log(n1 + ">>")
	// console.log((n1 * resolution) + "-----------------")
	n1 = n1.toFixed(2)

	//creating t0
	for(var j=0; j<control; j++){

		var n2 = j/(control-1)
		n2 = n2.toFixed(2)

		name = n1 + "-"+ n2
		bezierData[name] = []

		var t1 = {x:n1,y:0}
		var t2 = {x:n2,y:1}

		console.log(t0,t1,t2,t3)

		for (var l = 0; l < resolution; l++) {

			var t = l/resolution

			// var xVal = toString(bezier(t,t0,t1,t2,t3).x.toFixed(4)) 
			// if xVal[4] == 5 && xVal[4] == lasXval+1
			// 		var yVal = toString(bezier(t,t0,t1,t2,t3).y.toFixed(4))
			//		lastXval = xVal 
			//bezierData[name].push(yVal)

			bezierData[name].push(bezier(t,t0,t1,t2,t3).x.toFixed(10))

			if(l < 10){

				console.log(bezier(t,t0,t1,t2,t3).y.toFixed(10))

			}

		};

	}

}

	// FOR ALL THE X VALUES:
	//if fourth character if iqual 0.5, and the third character is 1 bigger than the last third character
	//=> add y value to the bezier data


bezier.config = {"resolution": resolution, "decimals" : decimals, "control" : control }


fs.writeFile('bezier.js', "var bezierCurveSpecs = " + JSON.stringify(bezierData,null,1), function (err) {
  if (err) return console.log(err);
  console.log('Hello World > helloworld.txt');
});