function proto01(){

	var self = this

	var container = d3.select("#screen")
	var ladyBugs = []

	var ladyBugSize = {
		width : 71,
		height : 84
	}
	
	var lastPos = getRandomInt(0+(ladyBugSize.width/2),window.innerWidth-(ladyBugSize.width/2))

	this.setBugsData = function(pos,attribute,value){

		console.log("--",ladyBugs[pos][1][attribute])
		ladyBugs[pos][1][attribute] = value 

	}

	function ladyTouch (){

		var text = this.childNodes[1].innerHTML
		text = parseInt(text) - 1

		if(text <= 0){

			currentview.finishInteraction(this.childNodes[0].id)

		}


		console.log(this.childNodes[0].id)
		this.childNodes[1].innerHTML = text

	}

	function getBugSpecs(last){

		var bugSpecs = {

			y : 700,
			t : 0,
			start : getRandomInt(0+(ladyBugSize.width*2),window.innerWidth-(ladyBugSize.width*2)),
			number : getRandomInt(1,6),

		}

		bugSpecs.speed = 0.3/bugSpecs.number
		bugSpecs.end = bugSpecs.start + getRandomInt(-50,50)


		return bugSpecs

	}

	for (var i=0; i<5; i++ ){

		var specs = getBugSpecs(lastPos)

		var ladyGroup = container.append("g")
					.attr("id", "ladyGroup" + i)
					.on("click", ladyTouch)

		var lady = ladyGroup.append("svg:image").attr("xlink:href", "svgs/ladybug.png")
		.attr({
		  x: specs.start,
		  y: specs.y,
		  width: ladyBugSize.width,
		  height: ladyBugSize.height,
		  bugId : i
		})
		.attr("id", "lady-" + i)
		.attr("class", "bug")


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
	var t_y = 0
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

			    t_x = 0
				t_y = ladyBugs[i][1].t + t * ladyBugs[i][1].speed
				ladyBugs[i][1].t = t_y

				//console.log(t_y)

				if(ladyBugs[i][1].t > window.innerHeight+400){


					if(ladyBugs[i][0].select("image").attr("clicked") == "true"){

						var target = ladyBugs[i][0].select("image").attr("xlink:href", "svgs/ladybug.svg")
							.attr({
								width: 71,
								height: 84,
								clicked: "true" 
							})
						target.attr("x", target.attr("x")+32)

					}

					ladyBugs[i][1] = getBugSpecs()
					ladyBugs[i][0].attr("transform",  "translate(0,0)");	
					ladyBugs[i][0].select("image").attr("x", ladyBugs[i][1].start)
					ladyBugs[i][0].select("text").attr("x", ladyBugs[i][1].start+30).text(ladyBugs[i][1].number)

				}

				ladyBugs[i][0].attr("transform",  "translate("+ -t_x +"," + -t_y + ")");	

		    }
	    
	}

}

proto01.prototype.finishInteraction = function(id){


	var target = d3.select("#" + id)
		.attr("xlink:href", "svgs/ladybug-flying.svg")
		.attr({
			width: 116,
			height: 130,
			clicked: "true" 
		})

		console.log(target.attr("clicked"))
		target.attr("x", target.attr("x")-32)

		console.log(" --  ", target.attr("bugId"))
		currentview.setBugsData(target.attr("bugId"),"speed", 0.5)

}


