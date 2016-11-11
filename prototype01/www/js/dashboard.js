var Dashboard = function() {
  // simple dashboard to show session lengths and time spent playing each game
  // (maybe also show proportion correct in each game?)

  // also attempts to upload data (or has a button to do so)

  // Set the configuration for your app
  // TODO: Replace with your project's config object
 //  var config = {
 //   apiKey: '<your-api-key>',
 //   authDomain: '<your-auth-domain>',
 //   databaseURL: 'https://egoteach.firebaseio.com/',
 //   storageBucket: 'gs://firebase-egoteach.appspot.com'
 //  };
 //  firebase.initializeApp(config);
 //
 // // Get a reference to the storage service, which is used to create references in your storage bucket
 // var storage = firebase.storage();

  var remoteCouch = 'http://egoteach:selfdirection@egoteach.cloudant.com/egoteach_tz1';

  //var remoteDB = new PouchDB('http://127.0.0.1:5984/egoteach_tz1');
  var remoteDB = new PouchDB('http://egoteach:selfdirection@sever.psych.nyu.edu:5984/egoteach_tz1');

  var doc = {
    "_id": "mittens",
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
    localDB.sync(remoteDB).on('complete', function () {
      console.log("DBs are Nsync!");
    }).on('error', function (err) {
      console.log("DBs failed to sync..");
    });
  }

  this.sync();

  $('#sessions').html(output);
}
