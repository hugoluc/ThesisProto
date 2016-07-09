
var WorldMap = function() {
  var self = this;
  d3.select(window).on("resize", throttle);

  var zoom = d3.behavior.zoom()
      .scaleExtent([1, 9])
      .on("zoom", move);


  self.width = screen_width - 50; //document.getElementById('container-exp').offsetWidth;
  self.height = screen_height - 50 ; //self.width / 2;
  console.log(self.width)
  console.log(self.height)

  this.topo;
  this.projection;
  this.path;
  this.svg;
  this.g;

  this.graticule = d3.geo.graticule();
  d3.select("#container-exp").attr("background-color", "lightblue");
  var tooltip = d3.select("#container-exp").append("div").attr("class", "tooltip hidden");

  var draw = function(topo) {
    this.svg.append("path")
       .datum(this.graticule)
       .attr("class", "graticule")
       .attr("d", this.path); // path or this.path?

    this.g.append("path")
     .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
     .attr("class", "equator")
     .attr("d", path);

    var country = this.g.selectAll(".country").data(topo);

    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.properties.name; })
        .style("fill", function(d, i) { return d.properties.color; });

    //offsets for tooltips
    var offsetL = document.getElementById('container-exp').offsetLeft+20;
    var offsetT = document.getElementById('container-exp').offsetTop+10;

    // tooltips
    country
      .on("mousedown", function(d,i) { // mousemove
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

        tooltip.classed("hidden", false)
               .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
               .html(d.properties.name);
        })
        .on("mouseup",  function(d,i) { // mousout
          tooltip.classed("hidden", true);
        });

    //EXAMPLE: adding some capitals from external CSV file
    d3.csv("mapdata/country-capitals.csv", function(err, capitals) {
      capitals.forEach(function(i){
        addpoint(i.CapitalLongitude, i.CapitalLatitude, i.CapitalName );
        console.log(i.CapitalName)
      });
    });

  }


  var setup = function(width,height) {
    this.projection = d3.geo.mercator()
      .translate([(width/2), (height/2)])
      .scale( width / 2 / Math.PI);

    this.path = d3.geo.path().projection(this.projection);

    this.svg = d3.select("#container-exp").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)
        .on("click", click)
        .append("g");

    this.g = this.svg.append("g");
  }

  d3.json("mapdata/world-topo-min.json", function(error, world) {
    var countries = topojson.feature(world, world.objects.countries).features;
    this.topo = countries;
    draw(this.topo);
  });

  var redraw = function() {
    self.width = document.getElementById('container-exp').offsetWidth;
    self.height = self.width / 2;
    d3.select('svg').remove();
    setup(self.width,self.height);
    draw(self.topo);
  }

  var throttleTimer;
  var throttle = function() {
    window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
        redraw();
      }, 200);
  }

  //geo translation on mouse click in map
  var click = function() {
    var latlon = projection.invert(d3.mouse(this));
    console.log(latlon);
  }

  //function to add points and text to the map (used in plotting capitals)
  function addpoint(lat,lon,text) {
    var gpoint = this.g.append("g").attr("class", "gpoint");
    var x = this.projection([lat,lon])[0];
    var y = this.projection([lat,lon])[1];

    gpoint.append("svg:circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("class","point")
          .attr("r", 1.5);

    //conditional in case a point has no associated text
    if(text.length>0){
      gpoint.append("text")
            .attr("x", x+2)
            .attr("y", y+2)
            .attr("class","text")
            .text(text);
    }
  }

  var move = function() {
    var t = d3.event.translate;
    var s = d3.event.scale;
    zscale = s;
    var h = self.height/4;

    t[0] = Math.min(
      (self.width/self.height)  * (s - 1),
      Math.max( self.width * (1 - s), t[0] )
    );

    t[1] = Math.min(
      h * (s - 1) + h * s,
      Math.max(self.height  * (1 - s) - h * s, t[1])
    );

    zoom.translate(t);
    this.g.attr("transform", "translate(" + t + ")scale(" + s + ")");

    //adjust the country hover stroke width based on zoom level
    d3.selectAll(".country").style("stroke-width", 1.5 / s);

  }


  setup(self.width,self.height);

}
