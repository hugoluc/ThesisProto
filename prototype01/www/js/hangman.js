var screen;
var nextTrial = false; // ready to go on

// stage 1. pop up a word, play the word, and then show the object
// stage 2. pop up a word and show a few objects; let them click. (if wrong, play the word)
var imageSize = 240;
var stim_diam = 80
var button_width = 60;
var button_height = 60;

var p = navigator.platform;
//console.log(p); // laptop = 'MacIntel'
if(p==='iPad' || p==='iPhone' || p==='iPod') {
  var click_type = 'touchstart';
} else {
  var click_type = 'click';
}

var HangmanTrial = function(pars) {
  var self = this;
  self.guesses_made = 0 // max = 10
  self.answer = pars['text']; // a word, e.g.: {id:"radio", text:"radio", audio:"radio", image:"radio"},
  self.audiofile = pars['audio'];
  self.audio = new Audio('audio/'+language+'/'+self.audiofile+'.mp3');
  self.image = pars['image']; // if there's no image, need a default one (circle?)

  //self.doTrial();
  self.doTrial = function(callback) {
    var xpos = screen_width*.75;
    self.drawStimulus();
    self.drawBlanks();
    // play sound for the correct one
    self.audio.play();
    return callback(this); // self.clicked_correct, self.correct, self.clicked_incorrect
  }

  self.handleGuess = function(guess) {
    if(!guess.clicked) {
      self.guesses_made += 1;
      console.log("guessed "+guess.text);
      // select any occurrences of d.text in the blanks
      // if there is one or more, reveal those blanks
      // if there isn't one, reveal a bit more of the stimulus
      var hits = d3.selectAll(".blank")
        .filter(function(d) { return d.letter === guess.text.toLowerCase(); })
        .style("opacity", 0.0);
      console.log(hits);
    }
  }

  self.drawAlphabet = function(letters) {
    var nrows = Math.floor(Math.sqrt(letters.length)) - 1;
    var ncols = Math.ceil(letters.length/nrows);
    console.log("nrows: "+nrows+" ncols: "+ncols);
    var keys = screen.append("svg")
      .append("g")
      .attr("transform", "translate(135,80)");

    self.alphabet = keys.append("g") // .attr("class", "alphabet")
      .selectAll("circle")
      .data(letters).enter()
      .append("g") // Add one g for each data node
      .attr("clicked", false)
      .attr("transform", function(d, i) {
       // i = x + ncols*y
       d.x = (i%ncols)*(button_width+20) + 20,
       d.y = Math.floor(i/ncols)*(button_height+20) + 20;
       return "translate(" + d.x + "," + d.y + ")";
      });

    self.alphabet.append("text") // add text to the g element
      .attr("text-anchor", "middle")
      .attr("style", "font-size: 38; font-family: Helvetica, sans-serif")
      .attr("y", 12)
      .style("opacity", 1.0)
      .text(function(d) {
       return d.text;
      });

    self.alphabet.append("circle") // add circle
      .attr("class", "button")
      .attr("r", button_width/2)
      .attr("fill", "blue")
      .style("opacity", .4);

    d3.selectAll(".button")
      .on(click_type, function(d) {
        d3.select(this)
          .transition()
          .style("opacity",.7)
          .attr("fill", "#222")
          .duration(400);
          //.remove();
        audio = new Audio('audio/'+language+'/'+d.audio+'.mp3');
        audio.play();
        self.handleGuess(d);
      });
  }

  self.drawAlphabet(letters);

  self.drawBlanks = function() {
    var chars = self.answer.split("");
    var chdict = [];
    for (var i = 0; i < chars.length; i++) {
      chdict.push({"letter": chars[i]});
    }
    console.log(chdict)
    self.blanks = screen.append("g")
      .attr("class", "blanks")
      .selectAll("circle")
      .data(chdict)
      .enter()
      .append("g") // Add one g for each data node
      // Position the g element like the circle element used to be.
      .attr("transform", function(d, i) {
       // Set d.x and d.y here so that other elements can use it. d is
       // expected to be an object here.
       d.x = i*100 + stim_diam,
       d.y = screen_height - 100;
       return "translate(" + d.x + "," + d.y + ")";
      });

    self.blanks.append("text") // add text to the g element
      .attr("text-anchor", "middle")
      .attr("style", "font-size: 38; font-family: Helvetica, sans-serif")
      .attr("y", 10)
      .style("opacity", 1.0)
      .text(function(d) {
       return d.letter;
      });

    self.blanks.append("circle")
      .attr("class", "blank")
      .attr("r", 40)
      .attr("fill", "green")
      .style("opacity", 1.0);


      // .attr("style", "font-size: 38; font-family: Helvetica, sans-serif")
      // .attr("fill", "red"); // draw vowels in a different color..

    d3.selectAll(".blank")
      .on(click_type, function(d) {
        console.log("clicked "+d.letter);
        d3.select(this) // selects the circle, not the text..
          .transition()
          .style("opacity",.1)
          .duration(1000);
      });
  }

  self.drawStimulus = function() {

      if(self.image) {
        var myImg = screen.append("image")
              .attr("xlink:href", function(d) { return "svgs/"+ self.image +".svg"; })
              .attr("x", screen_width-imageSize-80) // screen_width/2 - 70
              .attr("y", screen_height*.45) // screen_height*.45)
              .attr("width",imageSize)
              .attr("height",imageSize)
              .style("opacity",1);
      }

    var myLabel = screen.append("g").append("text")
      .attr("x", screen_width+50)
      .attr("y", getRandomInt(50,screen_height-50))
      .attr("style", "font-size: 40; font-family: Helvetica, sans-serif")
      .text(self.text)
      .attr("fill", getRandomColor());
  };
};



var Hangman = function() {
  setup_screen(false); // draw background (but without img)

  // or grab from database
  var trials = animals;

  var known = [];
  var not_known = [];
  var trial_index = 1;

  this.destroy = function() {
    //clearTimeout();
    screen.selectAll("*")
      .transition() // d3.select("#background")
      .each("end",function() {
        d3.select(this)
          .transition()
          .style("opacity",0)
          .delay(0)
          .duration(0)
          .remove();
       });
    screen.select("#background").remove(); // #background
    // .exit().remove() does not work
  }

  var next = function() {
    if(trials.length===0) {
      if(trial_index<20) {
        trial_index += 1;
        trials = animals; // GK: feed in queue
        next();
      } else {
        // either here (or in finish) store summary data of this game
        self.destroy();
        currentview = new Chooser();
      }
      //finish(); // save data?
    } else if(trial_index%5===0) {
      // score recent trials, add more trials?
      trial_index += 1;
      console.log("feedback? (kazi_nzuri.mp3) fun animation?");
      next();
    } else {
      var tr = new HangmanTrial(trials.shift());
      trial_index += 1;
      tr.doTrial(function() {
        if(nextTrial) next();
      });
      //console.log(tr);
    }
  };

  next();
};
