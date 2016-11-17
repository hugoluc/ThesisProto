function Hangman() {

  var screend3;
  score.stage = screend3; // ? doesn't work..
  var scoreIncrease = 1;
  queuesToUpdate['objectstim'] = true;
  logTime('hangman','start');

  var stimQ = stimQueues['objectstim'];
  var nextTrial = false; // ready to go on
  var current_stim = null;
  // stage 1. pop up a word, play the word, and then show the object
  // stage 2. pop up a word and show a few objects; let them click. (if wrong, play the word)
  var max_guesses = store.get("max_hangman_guesses");
  if(!max_guesses) max_guesses = 10;

  var imageSize = 240;
  var stim_diam;
  var button_width = 60;
  var button_height = 60;

  var p = navigator.platform;
  //console.log(p); // laptop = 'MacIntel'
  if(p==='iPad' || p==='iPhone' || p==='iPod') {
    var click_type = 'touchstart';
  } else {
    var click_type = 'click';
  }

  function HangmanTrial (pars) {

    document.getElementById("header-exp").style.display = 'block';

    stim_diam = window.innerWidth;
    var self = this;
    self.starttime = Date.now();
    self.origstim = pars;
    self.image = "svgs/"+ pars['image'] +".png";
    self.guesses_made = 0;
    self.wrong_guesses = 0 // max = 10
    self.answer = pars['text']; // a word, e.g.: {id:"radio", text:"radio", audio:"radio", image:"radio"},
    self.audiofile = pars['audio'];
    self.audio = new Audio('audio/'+language+'/'+self.audiofile+'.mp3');
    //self.image = pars['image']; // if there's no image, need a default one (circle?)

    console.log(self.image); // undefined the second time!
    self.unique_letters_remaining = count_unique_elements_in_array(self.answer.split("")); // unique letters to guess--decrement when each is clicked

    self.init_screen = function() {

      screend3 = d3.select("#container-exp").append("svg")
      .attr({
        width: screen_width,
        height: screen_height,
        x: 0,
        y: 0
      })
      .attr("id", "screen");

    };

    self.setup_screen = function(drawBGimage) {

        var bg_image_fname = background_image_files[getRandomInt(0,background_image_files.length-1)];
        screend3.selectAll("*").remove(); // clear remnants of previous round...(not sure why they stick around)

        var background = screend3.append("g")
          .attr({
            width: screen_width,
            height: screen_height
          })
          .attr("id", "background");

        console.log(screen_width)

        if(drawBGimage) {

          background.append("svg:image")
            .attr("xlink:href", "sprites/hangman/background_hangman.png")
            .attr({
              x: 0,
              y: 0,
              width: window.innerWidth,
              height: window.innerHeight,
              preserveAspectRatio : "none"
            })
            .attr("id", "background")

            var paperWidth = window.innerWidth * 0.5

            background.append("svg:image")
              .attr("xlink:href", "sprites/hangman/paper.png")
              .attr({
                x: window.innerWidth - paperWidth,
                y: window.innerHeight - 650,
                width: paperWidth,
                height: 700
              })
              .attr("id", "paper")
              .attr( "preserveAspectRatio" , "none")
        }

        return background;

      };

    self.init_screen();
    self.setup_screen();

    // end trial (read word)
    self.finish = function(won, callback) {

      verbal_audio_feedback(won);

      var randAdjust = Math.random() * .1 - .05;

      if(won) {

        self.origstim.priority += .5 + randAdjust;

        if(max_guesses>3) {
          max_guesses -= 1; // adjust difficulty: one fewer guess allowed
        }

        // help, Hugo! can't get score to work..what should score.stage be?
        // var pos = [];
        // for (var i=0; i<scoreIncrease; i++) {
        //   pos.push([300,300]); // GK ToDo: set to letter positions of word
        // }
        // score.addScore(pos, scoreIncrease, 1000, true);
        // score.setExplosion([300,300], 100,1000);

      } else {

        self.origstim.priority -= .1 + randAdjust;
        max_guesses += 1;
      }

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
      // log trial and return the orig stim with modified priority
      logTrial({"starttime":self.starttime, "endtime":Date.now(), "stimtype":'word', "stim":self.answer, "total_clicks":self.guesses_made, "incorrect_clicks":self.wrong_guesses});
      setTimeout(function(){ callback(self.origstim) }, final_view_time); // pass data

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

          for(var i = 0; i < hits[0].length/2; i++){

            var xpos = hits[0][i*2].getBoundingClientRect().left + ( hits[0][i*2].getBoundingClientRect().width/2 )
            var ypos = hits[0][i*2].getBoundingClientRect().bottom - ( hits[0][i*2].getBoundingClientRect().width/2 )

            score.addScore(
              [{x:xpos,y:ypos}],// _starsPos : (array) [{x:,y:}]
              1,// _value : (int) value to be added to score for each star;
              1000,// _duration : length of animation
              true,// _svg : (bool) false for canvas
              100// _index : z-index of sprite
            )

          }

          setTimeout(function(){correct_sound.play()}, 200);
          self.veil.transition()
            .attr("fill", getRandomColor())
            .duration(1000);
          // did they finish the round?

          if(self.unique_letters_remaining === 0) {
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
      var nrows = 4
      var ncols = Math.ceil(letters.length/nrows);
      console.log("nrows: "+nrows+" ncols: "+ncols);
      var keys = screend3.append("svg")
        .attr("id", "trialCanvas")
        .append("g")
        .attr("transform", "translate("+ screen_width*.08 +","+ screen_height*.2 +")"); // 135,90

      self.alphabet = keys.append("g") // .attr("class", "alphabet")
        .selectAll("circle")
        .data(letters).enter()
        .append("g") // Add one g for each data node
        .attr("transform", function(d, i) {
         // i = x + ncols*y
         d.x = (i%ncols)*(button_width + 25) + 30,
         d.y = Math.floor(i/ncols)*(button_height + 25) + 18;
         return "translate(" + d.x + "," + d.y + ")";
        });

      self.alphabet.append("svg:image")
        .attr("xlink:href", "sprites/hangman/rock.png")
        .attr({
          x: -50,
          y: -40,
          width: 100,
          height: 100
        })
        .attr("id", "background");

      self.alphabet.append("text") // add text to the g element
        .attr("text-anchor", "middle")
        .attr("style", "font-size: 38; font-family: Helvetica, sans-serif")
        .attr("y", 12)
        .style("opacity", 1.0)
        .attr("fill", "#2d2420")
        .text(function(d) {
         return d.text;
        });

      self.alphabet.append("circle") // transparent circle (button)
        .attr("class", "button")
        .attr("r", button_width/2)
        .style("opacity", 0.0);

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
          chdict.push({"letter": chars[i], "leaf" : getRandomInt(1,4) });
          stim_diam -= 80
        }

      //console.log(chdict)
      self.blanks = screend3.append("g")
        .attr("class", "blanks")
        .selectAll("circle") //FIXME
        .data(chdict)
        .enter()
        .append("g") // Add one g for each data node
        // Position the g element like the circle element used to be.
        .attr("transform", function(d, i) {
         // Set d.x and d.y here so that other elements can use it. d is
         // expected to be an object here.
         d.x = i*80 + stim_diam,
         d.y = .88*screen_height;
         return "translate(" + d.x + "," + d.y + ")";
        });

      self.blanks.append("circle") // start FIXME
        .attr("class", "blank")
        .attr("r", 40)
        .attr("fill", "green")
        .style("opacity", 0.0);

      self.blanks.append("text") // add text to the g element
        .attr("text-anchor", "middle")
        .attr("style", "font-size: 38; font-family: Helvetica, sans-serif")
        .attr("y", 10)
        .style("opacity", 1.0)
        .text(function(d) {
         return d.letter;
        });

      var radius = 90

      self.blanks.append("svg:image")
        .attr("xlink:href", function(d){ return "sprites/hangman/leaf-0" + d.leaf + ".png"})
        .attr("class", "blank")
        .attr({
          "x" : -radius/2,
          "y" : -radius/2,
          "width" : radius,
          "height" : radius
        })
        .attr("fill", "green")
        .style("opacity", 1.0);

        // .attr("style", "font-size: 38; font-family: Helvetica, sans-serif")
        // .attr("fill", "red"); // draw vowels in a different color..
    }

    self.drawStimulus = function() {

      var ypos = screen_height*.25;
      var xpos = .95*screen_width-imageSize;
      // GK: replace veil with N leaves that disappear as wrong guesses are made
      console.log("self.image: "+self.image);

       var defs = screend3.append("defs")
       var mask = defs.append("mask").append("rect")
         .attr("x", xpos)
         .attr("y", ypos)
         .attr("width", imageSize * 1.2)
         .attr("height", imageSize * 1.2)
         .attr("id", "mask")

      var myImg = screend3.append("svg:image")
        .attr("xlink:href", function(d) { return self.image; }) // .svg
        .attr("x", xpos)
        .attr("y", ypos)
        .attr("width",imageSize)
        .attr("height",imageSize)
        .style("opacity",1);

      self.veil = screend3.append("svg:image")
        .attr("xlink:href", "sprites/hangman/vail.png")
        .attr("x", xpos)
        .attr("y", ypos)
        .attr("width", imageSize * 1.2)
        .attr("height", imageSize * 1.2)
        .attr("preserveAspectRatio","none")
        // .attr("mask", "url(#mask)" )

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


  document.getElementById("header-exp").style.display = 'block';
  //queuesToUpdate['objectstim'] = true;

  //var trials = stimQueues['objectstim'];  //animals;

  var known = [];
  var not_known = [];
  var trial_index = 1;

  this.destroy = function() {

    logTime("hangman",'stop');
    //storeSession();
    //queuesToUpdate["objectstim"] = false;
    console.log(self);
    console.log(this);
    stimQueues['objectstim'].push(current_stim);
    storeQueue('objectstim');
    //clearTimeout();
    d3.select("#screen").selectAll("*")
      .transition() // d3.select("#background")
      .each("end",function() {

        if(this.id == "header-exp") return

        d3.select(this)
          .transition()
          .style("opacity",0)
          .delay(0)
          .duration(0)
          .remove();
       })

    console.log("--------------------------------------")
    document.getElementById("container-exp").removeChild(document.getElementById("screen"))

    //screend3.select("#background").remove(); // #background
    finishGame = true;
	  session.hide();
    currentview = new MainMenu(assets);

  }

  var storeData = function(tr_dat) {
    //console.log("store:");
    //console.log(tr_dat);
    stimQ.push(tr_dat);

    if(nextTrial) {
      nextTrial = false;
      setTimeout(function(){ next() }, 2000);
    }
  };

  var _that = this;

  var next = function() {

    console.log(d3.select("#screen"))

    if(d3.select("#screen")[0][0]){
      d3.select("#screen").selectAll("*")
        .transition() // d3.select("#background")
        .each("end",function() {

          if(this.id == "header-exp") return

          d3.select(this)
            .transition()
            .style("opacity",0)
            .delay(0)
            .duration(0)
            .remove();
         })

      console.log("--------------------------------------")
      document.getElementById("container-exp").removeChild(document.getElementById("screen"))
    }

      current_stim = stimQ.pop();
      var tr = new HangmanTrial(current_stim);
      tr.setup_screen(true);
      trial_index += 1;
      tr.doTrial(storeData);


  };

  next();
};
