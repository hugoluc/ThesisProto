var nextTrial = false; // ready to go on

// stage 1. pop up a word, play the word, and then show the object
// stage 2. pop up a word and show a few objects; let them click. (if wrong, play the word)
var max_guesses = 10;

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
  //self.guesses_made = 0
  console.log(pars);
  self.wrong_guesses = 0 // max = 10
  self.answer = pars['text']; // a word, e.g.: {id:"radio", text:"radio", audio:"radio", image:"radio"},
  self.audiofile = pars['audio'];
  self.audio = new Audio('audio/'+language+'/'+self.audiofile+'.mp3');
  self.image = pars['image']; // if there's no image, need a default one (circle?)
  self.unique_letters_remaining = count_unique_elements_in_array(self.answer.split(""));
  // unique letters to guess--decrement when each is clicked

  // end trial (read word)
  self.finish = function(won, callback) {
    verbal_audio_feedback(won); // won: "good job" / "very good" / "". lost: "try again" / ""
    var final_view_time = 3500; // how long they see the word and picture at the end
    self.audio.play()
    self.blanks.transition()
      .style("opacity", 0.0)
      .delay(final_view_time)
      .remove();
    self.veil.transition()
      .style("opacity", 0.0)
      .duration(300)
      .remove();
    nextTrial = true;
    self.alphabet.transition()
      .style("opacity", 0.0)
      .duration(final_view_time/3)
      .remove();
    screend3.selectAll("image")
      .transition()
      .delay(final_view_time)
      .remove();
    var tr_dat = {"word":self.answer, "won":won, "wrong_guesses":self.wrong_guesses};
    setTimeout(function(){ callback(tr_dat) }, final_view_time); // pass data
  }

  self.handleGuess = function(guess, callback) {
    //console.log("unique remaining letters: " + self.unique_letters_remaining);
    if(guess.clicked==1) {
      self.guesses_made += 1;
      // select any occurrences of d.text in the blanks
      // if there is one or more, reveal those blanks
      // if there isn't one, reveal a bit more of the stimulus
      var hits = d3.selectAll(".blank")
        .filter(function(d) { return d.letter === guess.text.toLowerCase(); })
        .style("opacity", 0.0);

      if(hits[0].length<1) {
        self.wrong_guesses += 1;
        var img_vert_shift = self.wrong_guesses * imageSize / max_guesses;
        self.veil.transition()
          .attr("transform", "translate(0,-"+img_vert_shift+")")
          .delay(1000);
        setTimeout(function(){incorrect_sound.play()}, 900);
      } else { // they got a letter!
        self.unique_letters_remaining -= 1;
        setTimeout(function(){correct_sound.play()}, 900);
        self.veil.transition()
          .attr("fill", getRandomColor())
          .duration(1000);
        // did they finish the round?
        if(self.unique_letters_remaining===0) {
          console.log("got all the letters!")
          setTimeout(function(){self.finish(true, callback)}, 1000); // won!
        }
      }
      if(self.wrong_guesses===max_guesses) { // lost..
        setTimeout(function(){self.finish(false, callback)}, 1000);
      }
    }
  }

  self.drawAlphabet = function(letters, callback) {
    for (var i = 0; i < letters.length; i++) {
      letters[i].clicked = 0;
    }
    var nrows = Math.floor(Math.sqrt(letters.length)) - 1;
    var ncols = Math.ceil(letters.length/nrows);
    console.log("nrows: "+nrows+" ncols: "+ncols);
    var keys = screend3.append("svg")
      .append("g")
      .attr("transform", "translate("+ screen_width*.08 +","+ screen_height*.2 +")"); // 135,90

    self.alphabet = keys.append("g") // .attr("class", "alphabet")
      .selectAll("circle")
      .data(letters).enter()
      .append("g") // Add one g for each data node
      .attr("transform", function(d, i) {
       // i = x + ncols*y
       d.x = (i%ncols)*(button_width+20) + 18,
       d.y = Math.floor(i/ncols)*(button_height+20) + 18;
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
      .style("opacity", .3);

    d3.selectAll(".button")
      .on(click_type, function(d) {
        d3.select(this)
          .transition()
          .style("opacity",.7)
          .attr("fill", "#222")
          .duration(400);
          //.remove();
        audio = new Audio('audio/'+language+'/alphabet/'+d.audio+'.mp3');
        d.clicked += 1;
        audio.play();
        self.handleGuess(d, callback);
      });
  }

  self.drawBlanks = function() {
    var chars = self.answer.split("");
    var chdict = [];
    for (var i = 0; i < chars.length; i++) {
      chdict.push({"letter": chars[i]});
    }
    //console.log(chdict)
    self.blanks = screend3.append("g")
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
       d.y = .88*screen_height;
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
  }

  self.drawStimulus = function() {
    var ypos = screen_height*.25;
    var xpos = .95*screen_width-imageSize;
    // GK: replace veil with N leaves that disappear as wrong guesses are made
    if(self.image) {
      var myImg = screend3.append("image")
        .attr("xlink:href", function(d) { return "svgs/"+ self.image +".png"; }) // worked with .svg
        .attr("x", xpos)
        .attr("y", ypos)
        .attr("width",imageSize)
        .attr("height",imageSize)
        .style("opacity",1);

      self.veil = screend3.append("rect")
        .attr("x", xpos)
        .attr("y", ypos)
        .attr("width", imageSize)
        .attr("height", imageSize)
        .attr("fill", getRandomColor());
    }

    screend3.append("svg:image")
       .attr('x',xpos)
       .attr('y',ypos)
       .attr('width', 50)
       .attr('height', 50)
       .attr("xlink:href","sprites/stick/leave.png")
       .attr("transform", "rotate("+getRandomInt(0,180)+")");

    var myLabel = screend3.append("g").append("text")
      .attr("x", screen_width+50)
      .attr("y", getRandomInt(50,screen_height-50))
      .attr("style", "font-size: 40; font-family: Helvetica, sans-serif")
      .text(self.text)
      .attr("fill", getRandomColor());
  };

  self.doTrial = function(callback) {
    var xpos = screen_width*.75;
    self.drawStimulus();
    self.drawBlanks();
    self.drawAlphabet(letters, callback);
    //return callback(tr_data);
  };
};



var Hangman = function() { // doesn't work a second time right now..
  init_screen();
  setup_screen(false); // draw background (but without img)
  document.getElementById("header-exp").style.display = 'block';
  queuesToUpdate['objectstim'] = true;

  var trials = stimQueues['objectstim'];  //animals;

  var known = [];
  var not_known = [];
  var trial_index = 1;

  this.destroy = function() {
    //clearTimeout();
    // screend3.selectAll("*")
    //   .transition() // d3.select("#background")
    //   .each("end",function() {
    //     d3.select(this)
    //       .transition()
    //       .style("opacity",0)
    //       .delay(0)
    //       .duration(0)
    //       .remove();
    //    });
    // selectAll and remove "g", "svg", "circle", "rect" ...?
    screend3.select("#header-exp").transition().style("display : none");
    screend3.select("#background").remove(); // #background
    finishGame = true;
	  session.hide();
    currentview = new MainMenu(assets);
  }

  var storeData = function(tr_dat) {
    console.log("store data");
    // ToDo: finish this!
    if(nextTrial) {
      nextTrial = false;
      setTimeout(function(){ next() }, 2000);
    }
  };

  var next = function() {
    if(trials.length===0) {
      if(trial_index<20) {
        trial_index += 1;
        trials = animals; // GK: feed in queue
        next();
      } else {
        // either here (or in finish) store summary data of this game
        self.destroy();
        currentview = new MainMenu();
      }
      //finish(); // save data?
    } else if(trial_index%5===0) {
      // score recent trials, add more trials?
      trial_index += 1;
      console.log("feedback? (kazi_nzuri.mp3) fun animation?");
      next();
    } else {
      var tr = new HangmanTrial(trials.pop());
      trial_index += 1;
      tr.doTrial(storeData);
    }
  };

  next();
};
