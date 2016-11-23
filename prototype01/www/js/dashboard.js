var Dashboard = function() {
  // simple dashboard to show session lengths and time spent playing each game
  // (maybe also show proportion correct in each game?)

  // also attempts to upload data (or has a button to do so)

  // Couch/PouchDB's put and get methods are super-easy to store JSON docs
  // the only involved thing is updating, where you need to first retrieve
  // the whole object (with random _rev number), update fields, then put back
  var remoteCouch = 'http://egoteach:selfdirection@egoteach.cloudant.com/egoteach_tz1';

  // GK: for testing use local CouchDB server
  //var remoteDB = new PouchDB('http://127.0.0.1:5984/egoteach_tz1');
  // GK: for pilot study use NYU server
  var remoteDB = new PouchDB('http://egoteach:selfdirection@sever.psych.nyu.edu:5984/egoteach_tz1');

  // primary key (_id) will be user+datetime

  document.getElementById("header-exp").style.display = "inline";
  $("#container-exp").append("<div id='sessions'></div>");
  $("#container-exp").append("<div id='logdetails'></div>");
  $("#container-exp").css("background-color","green");

  this.destroy = function() {

    console.log("-------------------------------")

    //session.hide();
    document.getElementById("header-exp").style.display = "none";
    $("#sessions").remove();
    $("#logdetails").remove();
    currentview = new MainMenu(assets);
  }


  this.outputLocalStorage = function() {
    var output = '';
    // store.js: Loop over all stored values
    store.forEach(function(key, val) {
        output += (key+': '+JSON.stringify(val))+'\n';
        //console.log(key, '==', val);
    })

    $('#sessions').html(output);
  }

  this.gameUsageSummary = function() {
    console.log("getting sumary")
    var activityLog = store.get("activityLog");
    // iterate over activityLog tallying up time (stop-start) for each activity
    var data = [];
    for (var i = 0; i < activityLog.length; i++) {
      activityLog[i]
    }
  }

  this.gameUsageSummary();

  // bubble graph showing time spent per app
  this.graphGameUsage = function() {
    screend3 = d3.select("#container-exp").append("svg")
      .attr({
        width: screen_width/2,
        height: screen_height/3,
        x: 0,
        y: 0
      })
      .attr("id", "screen");

    var svg = d3.select("svg"),
      width = +svg.attr("width");
    var format = d3.format(",d");
    var color = d3.scaleOrdinal(d3.schemeCategory20c);
    var pack = d3.pack()
        .size([width, width])
        .padding(1.5);

    // need to replace with a list of each game and total time spent (or times played in each)
    d3.csv("flare.csv", function(d) {
      d.value = +d.value;
      if (d.value) return d;
    }, function(error, classes) {
      if (error) throw error;

      var root = d3.hierarchy({children: classes})
          .sum(function(d) { return d.value; })
          .each(function(d) {
            if (id = d.data.id) {
              var id, i = id.lastIndexOf(".");
              d.id = id;
              d.package = id.slice(0, i);
              d.class = id.slice(i + 1);
            }
          });

      var node = svg.selectAll(".node")
        .data(pack(root).leaves())
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      node.append("circle")
          .attr("id", function(d) { return d.id; })
          .attr("r", function(d) { return d.r; })
          .style("fill", function(d) { return color(d.package); });

      node.append("clipPath")
          .attr("id", function(d) { return "clip-" + d.id; })
        .append("use")
          .attr("xlink:href", function(d) { return "#" + d.id; });

      node.append("text")
          .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
        .selectAll("tspan")
        .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
        .enter().append("tspan")
          .attr("x", 0)
          .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
          .text(function(d) { return d; });

      node.append("title")
          .text(function(d) { return d.id + "\n" + format(d.value); });
    });

  }
  // this.uploadTrialData = function() {
  //   var data = enumerateLoggedTrials();
  //   $.ajax({
  //     url: url, // what URL?
  //     type: "POST",
  //     data: JSON.stringify(data),
  //     contentType: "application/json",
  //     complete: callback
  //   });
  // }

  var _this = this

  this.sync = function() {
    console.log("syncing.......")
    // one-way: localDB.replicate.to(remoteDB);
    localDB.sync(remoteDB).on('complete', function () {
      alert("DBs are Nsync!");
    }).on('error', function (err) {
     alert("DBs failed to sync.." + err.message);
     _this.destroy()
    });
  }

  this.sync();

}
