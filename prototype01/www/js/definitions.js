
// window size (vs. expected Android tablet dimensions
var screen_width = window.innerWidth, // (1200)
    screen_height = window.innerHeight; // (768)

var uuid; // try to get unique device ID to use as user ID

var theme_song = new Howl({
  src: ['audio/theme.mp3'],
  autoplay: false,
  loop: true,
  volume: 0.3,
  buffer: true
});

// Howlers cache, play and replay faster
var incorrect_sound = new Howl({
  src: ['audio/wrong/negative_short.mp3'], // ['audio/wrong/wrong.mp3'],
  autoplay: false,
  buffer: true
});

// mult and add/sub
var incorrect_long_sound = new Howl({
  src: ['audio/wrong/negative_long.mp3'], // ['audio/wrong/wrong.mp3'],
  autoplay: false,
  buffer: true
});

var correct_sound = new Howl({
  src: ['audio/correct.wav'],
  autoplay: false,
  buffer: true
});

var reveal_sound = new Howl({
  src: ['audio/positive_1s.mp3'],
  autoplay: false,
  buffer: true
});

// cordova plugin add cordova-plugin-device
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(device.uuid);
    uuid = device.uuid;
}

// audio/swahili/feedback
var feedback_audio_files = ["welcome", "addition_instruct", "ant_instruct", "bee_instruct",
  "tap_button", "drawing_instruct", "drawing_instruct2",
  "egg_instruct1", "hangman_instruct","good_job", "ladybug_instruct",
  "memory_instruct", "mult_instruct", "try_again", "very_good"];
// good job = kazi nzuri
// tap button = bomba kifungo
// try again = jaribu tena
// very good = bora asana
// welcome = karibu

var feedback_sounds = {}; // a bunch of Howls

var letter_sounds = {};

var noteScale = [];

var loadAudioFiles = function() {
  for (var i = 0; i < numbers.length; i++) {
    numbers[i].howl = new Howl({
      src: ['audio/'+language+'/'+numbers[i].audio+'.mp3'],
      autoplay: false,
      buffer: true
    });
  }

  for (var i = 0; i < letters.length; i++) {
    letter_sounds[letters[i].audio] = new Howl({
      src: ['audio/'+language+'/alphabet/'+letters[i].audio+'.mp3'],
      autoplay: false,
      buffer: true
    });
  }

  // 'correct2' notes for counting
  for (var i = 1; i < 6; i++) {
    noteScale[i-1] = new Howl({
      src: ['audio/correct2/'+i+'.mp3'],
      autoplay: false,
      buffer: true
    });
  }

  for (var i = 0; i < feedback_audio_files.length; i++) {
    feedback_sounds[ feedback_audio_files[i] ] = new Howl({
      src: ['audio/'+language+'/feedback/'+feedback_audio_files[i]+'.mp3'],
      autoplay: false,
      buffer: true
    });
  }

  //console.log(feedback_sounds);
}

// var nextTrial = null; // for setTimeout so we can clearTimeout
var score;

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
