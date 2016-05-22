// window size (vs. expected Android tablet dimensions
var screen_width = window.innerWidth, // (1200)
    screen_height = window.innerHeight; // (768)

// // try: <audio preload="auto"> <source="" /></audio>
var correct_sound = new Audio('audio/correct.wav');
var incorrect_sound = new Audio('audio/birdcry.mp3');

// var screen; // fullscreen svg for each task

// var nextTrial = null; // for setTimeout so we can clearTimeout

var score = 0; // get from summarydata for each game type (or one for all?)

var background_image_files = ["plains1.png","plains2.png"]; //,"sky0_1024x600.jpg",
// "sky1_1024x600.jpg","sky2_1024x600.jpg","sky3_1024x600.jpg","sky4_1024x600.jpg"]

var correctSounds = [

   [
    {id:1, audio:"1" },
    {id:2, audio:"2" },
    {id:3, audio:"3" },
    {id:4, audio:"4" }
   ],

   [
    {id:1, audio:"1" },
    {id:2, audio:"2" },
    {id:3, audio:"3" },
    {id:4, audio:"4" },
    {id:5, audio:"5" }
   ]

  ];

var init_screen = function() {
  screen = d3.select("#container-exp").append("svg")
    .attr({
      width: screen_width,
      height: screen_height
    })
    .attr("id", "screen");
};

var setup_screen = function(drawBGimage) {
  var bg_image_fname = background_image_files[getRandomInt(0,background_image_files.length-1)];

  screen.selectAll("*").remove(); // clear remnants of previous round...(not sure why they stick around)
  var background = screen.append("g")
    .attr({
      width: screen_width,
      height: screen_height
    })
    .attr("id", "background");
  console.log(screen_width)
  if(drawBGimage) {
    background.append("svg:image")
      .attr("xlink:href", "img/"+bg_image_fname)
      .attr({
        x: 0,
        y: 0,
        width: screen_width,
        height: screen_height
      })
      .attr("id", "background");
    }

    return background;
};


// // basic stimulus definition with image, text, audio, and sequence of correct/incorrect
// // (maybe also lag since previous presentation, in absolute time and trials?)
function Stimulus() {
    //var evt = window.event || arguments[1] || arguments.callee.caller.arguments[0];
    //var target = evt.target || evt.srcElement;
    var options = {};
    if (arguments[0]) options = arguments[0];
    var default_args = {
        'id'     :  '',
        'image'  :  '',
        'text'   :  '',
        'audio'  :  '',
        'seq'    :  [],
        'priority' : 2
    }
    for (var index in default_args) {
        if (typeof options[index] == "undefined") options[index] = default_args[index];
    }
}

function count_unique_elements_in_array(arr) {
  var counts = {};
  for (var i = 0; i < arr.length; i++) {
      counts[arr[i]] = 1 + (counts[arr[i]] || 0);
  }
  return(Object.keys(counts).length)
}


// // go back to chooser
// var back_button = function() {
//   finish();
//   setTimeout(function(){
//     currentview = new Chooser();
//   }, 500);
// };

// function incrScore() {
//      score += 10;
//      document.getElementById("score").innerHTML="Score: "+score;
// }

// function decrScore() {
//      score -= 10;
//      document.getElementById("score").innerHTML="Score: "+score;
// }
