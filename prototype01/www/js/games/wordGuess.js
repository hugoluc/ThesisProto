var screen;
var nextTrial = null; // for setTimeout so we can clearTimeout

// stage 1. pop up a word, play the word, and then show the object
// stage 2. pop up a word and show a few objects; let them click. (if wrong, play the word)
var presentTime = 6000;
var imageSize = 200;
var stim_diam = 80

var WordTrial = function(pars) {
  var self = this;

  self.objects = pars['objects'];
  self.correct = pars['correct_index']; // the one that has been correct less frequently, or random
  self.time = pars['time'];
  self.clicked_correct = false; // can click both correct
  self.clicked_incorrect = false; // and incorrect
  //self.doTrial();
  //console.log(self.objects);
  self.doTrial = function(callback) {
    interval = Math.floor(screen_width / self.objects.length);
    var correct = getRandomInt(0, self.objects.length);
    var audio = new Audio('audio/'+language+'/'+self.objects[correct].audio+'.mp3');
    for(var i=0; i<self.objects.length; i++) {
      var xpos = getRandomInt(stim_diam+10 + interval*i, interval*(i+1) - stim_diam-10);
      //console.log(xpos);
      self.drawStimulus(self.objects[i], xpos, self.time, i===correct);
    }
    // play sound for the correct one
    audio.play();
    //return self.clicked_correct;
    return callback(this); // self.clicked_correct, self.correct, self.clicked_incorrect
  }

  self.drawStimulus = function(stim, xpos, time, correct) {
    var feedback_stim;
    if(correct) {
      feedback_stim = "svgs/smiley.svg";
    } else {
      feedback_stim = "svgs/red_x.svg";
    }

    var myStim = screen.append("svg")
      .attr("x", 250)
      .attr("y", screen_height*.85)
      .attr("id", "stimulus")
      .attr("width",300)
      .attr("height",100)
      .on("click", function(d, i){
        if(correct) {
          self.clicked_correct = true;
          correct_sound.play()
          incrScore();
        } else {
          self.clicked_incorrect = true;
          incorrect_sound.play();
          decrScore();
        }
        wordsdata.push({'game':'word','event':'click','time':Date.now(),'stim':stim,'correct':self.clicked_correct});
        var feedback = myStim.append("image")
          .attr("xlink:href", function(d) { return feedback_stim; })
          .attr("x", 0)
          .attr("y", 0)
          .attr("height", stim_diam)
          .attr("width", stim_diam)
          .style("opacity", 1)
          .on("click", function(d) { feedback.remove() });
        feedback.transition()
          .duration(1200)
          .delay(1000)
          .style("opacity", 1e-6);
      });

      if(stim.image) {
        var myImg = screen.append("image")
              .attr("xlink:href", function(d) { return "svgs/"+ stim.image +".svg"; })
              .attr("x", getRandomInt(imageSize/2, screen_width-imageSize/2)) // screen_width/2 - 70
              .attr("y", screen_height*.45) // screen_height*.45)
              .attr("width",imageSize)
              .attr("height",imageSize)
              .style("opacity",1);

        myImg.transition()
            .style("opacity", 1e-6)
            .duration(time) // or just delay(1500) then remove
            .each("end",function() {
              d3.select(this).remove();
            });
      }

    // var myCircle = myStim.append("circle")
    //   .attr("cx", stim_diam/2)
    //   .attr("cy", stim_diam/2)
    //   .attr("r", stim_diam/2);

    var myLabel = screen.append("g").append("text")
      .attr("x", screen_width+50)
      .attr("y", getRandomInt(50,screen_height-50))
      .attr("style", "font-size: 40; font-family: Helvetica, sans-serif")
      .text(stim.text)
      .attr("fill", getRandomColor())
      .transition()
      .duration(time)
      .remove();

    myLabel.transition()
      .attr("x",-50)
      .ease("linear")
      .duration(time)
      .delay(200)
      .each("end",function() {
        d3.select(this)
          .transition()
          .style("opacity",0)
          .duration(1000)
          .remove();
       });

  };
};

var make_word_trials = function(stimuli, stim_per_trial, time) {
  var trials = [];
  while(stimuli.length >= stim_per_trial) {
    var trial_stim = [];
    while(trial_stim.length < stim_per_trial) {
      trial_stim.push(stimuli.shift())
    }
    //if(!trial_stim[0].image) { // undefined...
    trials.push(new WordTrial({'objects':trial_stim, 'time':time}));
  }
  return trials;
};


var WordGame = function() {

  setup_screen();
  //draw_scene(); // somehow check if this already exists, and don't redraw if it does

  // if(first_time) -- present once through counting 1-10
  var trials = make_word_trials(animals.slice(0), 1, 3000);

  var known = [];
  var not_known = [];
  var trial_index = 1;

  this.destroy = function() {
    // svg.transition()
    //   .duration(200)
    //   .style("opacity", 0).remove();
    clearTimeout(nextTrial);
    //d3.selectAll("image").remove();
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
        trials = make_trials(animals.slice(0), 2, presentTime);
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
      var tr = trials.shift();
      trial_index += 1;
      tr.doTrial(function() {
        if(nextTrial) {
          clearTimeout(nextTrial);
          nextTrial = null;
        }
        nextTrial = setTimeout(function(){ next(); }, presentTime);
      });
      //console.log(tr);
    }
  };

  next();
};
