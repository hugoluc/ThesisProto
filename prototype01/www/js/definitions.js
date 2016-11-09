
// window size (vs. expected Android tablet dimensions
var screen_width = window.innerWidth, // (1200)
    screen_height = window.innerHeight; // (768)

// // try: <audio preload="auto"> <source="" /></audio>
var correct_sound = new Audio('audio/correct.wav');
var incorrect_sound = new Audio('audio/birdcry.mp3');

// var nextTrial = null; // for setTimeout so we can clearTimeout

var score = 0; // get from summarydata for each game type (or one for all?)

var background_image_files = ["farmbackground.jpg","plains1.png","plains2.png"];
//,"sky0_1024x600.jpg","sky1_1024x600.jpg","sky2_1024x600.jpg","sky3_1024x600.jpg","sky4_1024x600.jpg"]

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

function distance(x1,y1, x2,y2) {
  // returns linear distance between (x1,y1) and (x2,y2)
  var dx2 = Math.pow(x2-x1, 2);
  var dy2 = Math.pow(y2-y1, 2);
  return Math.sqrt(dx2+dy2);
}

// // go back to chooser
// var back_button = function() {
//   finish();
//   setTimeout(function(){
//     currentview = new MainMenu();
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
