var allcanvas;

function proto01(canvas){

	if(canvas){


		allcanvas = true;

	}else{
		var container = d3.select("#screen")

		var ladyBugs = []

		for (var i=0; i<10; i++ ){

			var lady = container.append("svg:image").attr("xlink:href", "svgs/ladybug.svg")
			.attr({
			  x: getRandomInt(0,window.innerWidth),
			  y: window.innerHeight-100,
			  width: 70,
			  height: 70,
			})
			.attr("id", "lady-" + i)
			.attr("class", "bug")
			.attr("transform", function(d) {return "translate(0,0)"})
			.on("touchstart", function(){
				console.log("somehting")
			})

	    	ladyBugs.push(lady)

		}

		var timer_ret_val = false
		var duration = 1000
		var targetX = 100
		var last = 0
		var t = 0
		var t_x = 0



		d3.timer(function(elapsed) {

		    t = elapsed - last
			last = elapsed;

			console.log("-->",elapsed)
			console.log("->",last)
			console.log(">",t )
		    
		    update();
		    return timer_ret_val;
		},20);

		function update(){

		    t_x = t_x - (t * targetX) / duration 
		    
		    console.log("--------------", t_x)
			    
		    for (var i=0; i<ladyBugs.length; i++){

				//ladyBugs[i].attr("y", t_x);
		    	ladyBugs[i].attr("transform", function(d) {return "translate(100," + t_x + ")";});

		    }
		}
	}

}



