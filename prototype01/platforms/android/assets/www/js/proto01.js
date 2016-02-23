function proto01(){

	var container = d3.select("#screen")
	var ladyBugs = []

	var ladyBugSize = {
		width : 71,
		height : 84
	}
	
	var lastPos = getRandomInt(0+(ladyBugSize.width/2),window.innerWidth-(ladyBugSize.width/2))

	function ladyTouch (){

		var text = this.childNodes[1].innerHTML
		text = parseInt(text) - 1
		console.log(text)
		this.childNodes[1].innerHTML = text
	}

	function getBugSpecs(last){

		var bugSpecs = {

			start : getRandomInt(0+(ladyBugSize.width/2),window.innerWidth-(ladyBugSize.width/2)),
			number : getRandomInt(1,6),

		}

		bugSpecs.speed = 0.4/bugSpecs.number
		bugSpecs.end = bugSpecs.start + getRandomInt(-50,50)

		return bugSpecs

	}

	for (var i=0; i<3; i++ ){

		var specs = getBugSpecs(lastPos)

		var ladyGroup = container.append("g")
					.attr("id", "ladyGroup" + i)
					.on("click", ladyTouch)

		var lady = ladyGroup.append("svg:image").attr("xlink:href", "svgs/ladybug.png")
		.attr({
		  x: specs.start,
		  y: 700,
		  width: ladyBugSize.width,
		  height: ladyBugSize.height,
		})

		.attr("id", "lady-" + i)
		.attr("class", "bug")
		.attr("transform", function(d) {return "translate(0,0)"})
		.on("touchstart", function(){
			console.log("somehting")
		})

		var number = ladyGroup.append("text")
		
		number.attr({

			x : specs.start+30,
			y : 700+55,


		}).attr("font-family", "sans-serif")
		.attr("font-size", "20px")
		.attr("fill", "red")
		.text(specs.number);


    	ladyBugs.push([ladyGroup,specs])

	}

	var timer_ret_val = false
	var duration = 1200
	var targetX = 100
	var last = 0
	var t_x = 0
	var total = 0

	d3.timer(function(elapsed) {

	    var t = elapsed - last
		last = elapsed;
		total = total + t
		//console.log("fps=",1000/t)
	    
	    update(t);
	    return timer_ret_val;
	});

	function update(t){

		    
	    for (var i=0; i<ladyBugs.length; i++){

		    t_x = total * -ladyBugs[i][1].speed
		    t_y = 0

	    	console.log("-----")
	    	console.log(ladyBugs[i][0][0])
	    	console.log(ladyBugs[i][1].speed)
	    	console.log(t_x)


	    	ladyBugs[i][0].attr("transform", function(d) {return "translate("+ t_y +"," + t_x + ")";});

	    }
	}

}

proto01.prototype.getAngle = function(lastPos){




}





