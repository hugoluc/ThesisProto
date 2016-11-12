var Dashboard = function() {
  // simple dashboard to show session lengths and time spent playing each game
  // (maybe also show proportion correct in each game?)

  // also attempts to upload data (or has a button to do so)

  // Couch/PouchDB's put and get methods are super-easy to store JSON docs
  // the only involved thing is updating, where you need to first retrieve
  // the whole object (with random _rev number), update fields, then put back
  var remoteCouch = 'http://egoteach:selfdirection@egoteach.cloudant.com/egoteach_tz1';

  //var remoteDB = new PouchDB('http://127.0.0.1:5984/egoteach_tz1');
  var remoteDB = new PouchDB('http://egoteach:selfdirection@sever.psych.nyu.edu:5984/egoteach_tz1');

  // primary key (_id) will be user+"tr"+trial_index

  var doc = {
    "_id": "mittens", // primary key
    "name": "Mittens",
    "occupation": "kitten",
    "age": 3,
    "hobbies": [
      "playing with balls of yarn",
      "chasing laser pointers",
      "lookin' hella cute"
    ]
  };
  localDB.put(doc);

  document.getElementById("header-exp").style.display = "inline";
  $("#container-exp").append("<div id='sessions'></div>");
  $("#container-exp").append("<div id='logdetails'></div>");
  $("#container-exp").css("background-color","green");

  this.destroy = function() {
    //session.hide();
    document.getElementById("header-exp").style.display = "none";
    $("#sessions").remove();
    $("#logdetails").remove();
    currentview = new MainMenu(assets);
  }

  var output = '';

  // for (var key in localStorage) {
  //   output = output+(key + ':' +localStorage[key])+'\n';
  // }

  // store.js: Loop over all stored values
  store.forEach(function(key, val) {
      output += (key+': '+JSON.stringify(val))+'\n';
      //console.log(key, '==', val);
  })

  this.uploadTrialData = function() {
    var data = enumerateLoggedTrials();
    $.ajax({
      url: url, // what URL?
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      complete: callback
    });
  }

  this.sync = function() {
    // one-way: localDB.replicate.to(remoteDB);
    localDB.sync(remoteDB).on('complete', function () {
      console.log("DBs are Nsync!");
    }).on('error', function (err) {
      console.log("DBs failed to sync..");
    });
  }

  this.sync();

  $('#sessions').html(output);
}
