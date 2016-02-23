// // Android tablet dimensions
var screen_width = window.innerWidth,
    screen_height = window.innerHeight; // 768

// var screen; // fullscreen svg for each task

// var nextTrial = null; // for setTimeout so we can clearTimeout

// var score = 0; // get from summarydata for each game type (or one for all?)

// var background_image_files = ["plains1.png","plains2.png","sky0_1024x600.jpg",
//   "sky1_1024x600.jpg","sky2_1024x600.jpg","sky3_1024x600.jpg","sky4_1024x600.jpg"]

var init_screen = function() {
  // .select("body")
  screen = d3.select("#container-exp").append("svg")
    .attr({
      width: screen_width,
      height: screen_height
    })
    .attr("id", "screen");
};

// var setup_screen = function() {
//   var bg_image_fname = background_image_files[getRandomInt(0,background_image_files.length-1)];
//   // maybe randomly choose from a few different backgrounds? or consistent by task
//   //d3.select("body").style("background-image", "../static/images/backgrounds/plains1.png");
//   //d3.select("body").each(function(d, i) { $(this).css("background-image", "../static/images/backgrounds/plains1.png"); });
//   //$(this).parent().css("background-image", "url(../static/images/backgrounds/plains1.png) no-repeat;");
//   // background-image: url(../static/images/backgrounds/plains1.png);
//   //$('#container-exp').css("background-image", "url(../static/images/backgrounds/plains1.png)");

//   screen.selectAll("*").remove(); // clear remnants of previous round...(not sure why they stick around)
//   var background = screen.append("g")
//     .attr({
//       width: screen_width,
//       height: screen_height
//     })
//     .attr("id", "background");

//   background.append("svg:image")
//     .attr("xlink:href", "../static/images/backgrounds/"+bg_image_fname)
//     .attr({
//       x: 0,
//       y: 0,
//       width: screen_width,
//       height: screen_height
//     })
//     .attr("id", "background");

//     return background;
// };

// // try: <audio preload="auto"> <source="" /></audio>
// var correct_sound = new Audio('../static/audio/correct.wav');
// var incorrect_sound = new Audio('../static/audio/birdcry.mp3');

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
// function Stimulus() {
//     var evt = window.event || arguments[1] || arguments.callee.caller.arguments[0];
//     var target = evt.target || evt.srcElement;
//     var options = {};
//     if (arguments[0]) options = arguments[0];
//     var default_args = {
//         'id'     :  '',
//         'image'  :  '',
//         'text'   :  '',
//         'audio'  :  '',
//         'seq'    :  []
//     }
//     for (var index in default_args) {
//         if (typeof options[index] == "undefined") options[index] = default_args[index];
//     }
// }

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

// var finish = function() {
//   // svg.transition()
//   //   .duration(200)
//   //   .style("opacity", 0).remove();
//   clearTimeout(nextTrial);
//   //d3.selectAll("image").remove();
//   screen.selectAll("*")
//     .transition() // d3.select("#background")
//     .each("end",function() {
//       d3.select(this)
//         .transition()
//         .style("opacity",0)
//         .delay(0)
//         .duration(0)
//         .remove();
//      });
//   screen.select("#background").remove(); // #background
//   // .exit().remove() does not work
// };

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

// var draw_scene = function() {
//   var background = screen.append("g")
//     .attr({
//       width: screen_width,
//       height: screen_height
//     })
//     .attr("id", "background")
//     .style("background-color", '#5FD1FC');;

//   var hill_ypos = screen_height - 250;

//   var cloud_index = [{"id": 1}, {"id": 2}, {"id": 3}, {"id": 4}, {"id": 5}];

//   var sun = background.append("image")
//         .attr("xlink:href", function(d) { return "../static/images/scene/sun.svg"; })
//         .attr("x", 50)
//         .attr("y", 50)
//         .attr("width",100)
//         .attr("height",100)
//         .style("opacity",1);

//   var clouds = background.selectAll("image").data(cloud_index).enter()
//         .append("image")
//         .attr("xlink:href", function(d) { return "../static/images/scene/cloud-"+d.id+".svg"; })
//         .attr("x", function(d) { return getRandomInt(0,screen_width-100); })
//         .attr("y", function(d) { return getRandomInt(0,hill_ypos); })
//         .attr("width", function(d) { return getRandomInt(50,220); })
//         .attr("height", function(d) { return getRandomInt(50,220); })
//         .style("opacity",.9);

//   var backhills = background.append("image")
//         .attr("xlink:href", function(d) { return "../static/images/scene/grass-hill-back.svg"; })
//         .attr("x", -90)
//         .attr("y", hill_ypos)
//         .attr("width",screen_width)
//         .attr("height",300)
//         .style("opacity",1);

//   var midhills = background.append("image")
//         .attr("xlink:href", function(d) { return "../static/images/scene/grass-hill-middle.svg"; })
//         .attr("x", 0)
//         .attr("y", hill_ypos)
//         .attr("width",screen_width+40)
//         .attr("height",300)
//         .style("opacity",1);

//   var fronthills = background.append("image")
//         .attr("xlink:href", function(d) { return "../static/images/scene/grass-hill-front.svg"; })
//         .attr("x", -20)
//         .attr("y", hill_ypos+50)
//         .attr("width",screen_width+50)
//         .attr("height",300)
//         .style("opacity",1);

//   var tree = background.append("image")
//         .attr("xlink:href", function(d) { return "../static/images/scene/tree.svg"; })
//         .attr("x", screen_width-310)
//         .attr("y", hill_ypos+40)
//         .attr("width",100)
//         .attr("height",150)
//         .style("opacity",1);

//   return background;
// };

// // display locally stored trials
// function displayStats(){
//     if (!window.localStorage){ return; }
//     var i = 0;
//     var key = "";
//     var index = [];
//     var cachedSearches = [];
//     for (i=0;i<localStorage.length;i++){
//         key = localStorage.key(i);
//         if (key.indexOf("index::") == 0){
//             index = JSON.parse(localStorage.getItem(key));
//             cachedSearches.push ({keyword: key.slice(7), numResults: index.length});
//         }
//     }
//     cachedSearches.sort(function(a,b){
//         if (a.numResults == b.numResults){
//             if (a.keyword.toLowerCase() < b.keyword.toLowerCase()){
//                 return -1;
//             } else if (a.keyword.toLowerCase() > b.keyword.toLowerCase()){
//                 return 1;
//             }
//             return 0;
//         }
//         return b.numResults - a.numResults;
//     }).slice(0,10).forEach(function(search){
//         var li = document.createElement("li");
//         var txt = document.createTextNode(search.keyword + " : " + search.numResults);
//         li.appendChild(txt);
//         $("stats").appendChild(li);
//     });
// }
