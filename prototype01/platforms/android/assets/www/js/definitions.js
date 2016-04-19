// // Android tablet dimensions
var screen_width = window.innerWidth,
    screen_height = window.innerHeight; // 768

// // try: <audio preload="auto"> <source="" /></audio>
var correct_sound = new Audio('audio/correct.wav');
var incorrect_sound = new Audio('audio/birdcry.mp3');

// var screen; // fullscreen svg for each task

// var nextTrial = null; // for setTimeout so we can clearTimeout

var score = 0; // get from summarydata for each game type (or one for all?)

// stimuli for the ant game
var addition = [
  {sum:"1", options:["1","0","0"]},
  {sum:"2", options:["1","1","0"]},
  {sum:"3", options:["2","1","0"]},
  {sum:"4", options:["2","2","1","0"]},
  {sum:"4", options:["1","1","3","0"]},
  {sum:"5", options:["1","1","2","3"]},
  {sum:"5", options:["2","2","1","4"]},
  {sum:"6", options:["1","1","2","3"]},
  {sum:"6", options:["3","3","1","2"]},
  {sum:"7", options:["1","2","3","1","2"]},
  {sum:"7", options:["2","2","2","4","1"]},
  {sum:"8", options:["4","2","2","1","0"]},
  {sum:"8", options:["5","3","2","1","2"]},
];

 var background_image_files = ["plains1.png","plains2.png"]; //,"sky0_1024x600.jpg",
  // "sky1_1024x600.jpg","sky2_1024x600.jpg","sky3_1024x600.jpg","sky4_1024x600.jpg"]

var init_screen = function() {
  screen = d3.select("#container-exp").append("svg")
    .attr({
      width: screen_width,
      height: screen_height
    })
    .attr("id", "screen");
};

var setup_screen = function() {
  var bg_image_fname = background_image_files[getRandomInt(0,background_image_files.length-1)];

  screen.selectAll("*").remove(); // clear remnants of previous round...(not sure why they stick around)
  var background = screen.append("g")
    .attr({
      width: screen_width,
      height: screen_height
    })
    .attr("id", "background");
  console.log(screen_width)
  background.append("svg:image")
    .attr("xlink:href", "img/"+bg_image_fname)
    .attr({
      x: 0,
      y: 0,
      width: screen_width,
      height: screen_height
    })
    .attr("id", "background");

    return background;
};

// // database stuff
// // should create a unique session ID each time and store under that
// // also load the previous session and choose stimuli from the last stage achieved
// var AUTH_TOKEN = 'CbfMSHpeCpLxCE2HBu3eUycicHONcqBQqopB8Xk1';

// // if no internet an error is thrown: net::ERR_INTERNET_DISCONNECTED
// // (then we should store all the data in a cookie until reconnected)

// // https://www.firebase.com/docs/android/guide/offline-capabilities.html
// // for offline storage on Android:
// // Firebase.getDefaultConfig().setPersistenceEnabled(true);
// // if this doesn't work out for some reason (app restarts lose data?) there
// // are save-json-to-sqlite-DB solutions, e.g.: https://github.com/wenchaojiang/JSQL
// var dbref = new Firebase("https://egoteach.firebaseio.com/");
// dbref.authWithCustomToken(AUTH_TOKEN, function(error, authData) {
//   if (error) {
//     console.log("Login Failed!", error);
//   } else {
//     console.log("Login Succeeded!", authData);
//   }
// });

// var summarydata = dbref.child("summary"); // session times and duration, level achieved in each game?
// var dropdata = dbref.child("drop"); // store each dropGame trial's correct/incorrect clicks
// var wordsdata = dbref.child("words"); //
// var countdata = dbref.child("count"); // counting game

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

// // localStorage tutorial: http://www.ibm.com/developerworks/library/x-html5mobile2/
// // save trial data to local storage
// function saveTrial(keyword, tweet){
//     // check if the browser supports localStorage
//     if (!window.localStorage){
//         console.log("no localStorage, i.e. no adaptive learning algorithm");
//         return;
//     }
//     if (!localStorage.getItem("trial" + tweet.id)){
//         localStorage.setItem("trial" + tweet.id, JSON.stringify(tweet));
//     }
//     var index = localStorage.getItem("index::" + keyword);
//     if (index){
//         index = JSON.parse(index);
//     } else {
//         index = [];
//     }
//     if (!index.contains(tweet.id)){
//         index.push(tweet.id);
//         localStorage.setItem("index::"+keyword, JSON.stringify(index));
//     }
// }



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
