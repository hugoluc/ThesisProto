

var Shapes = function() {
  //document.body.select

  //document.body.appendChild(canvas);
  document.getElementById("shapes-container").style.display = 'block';

  this.destroy = function() {
    mp.stop();
    clickStart('shapes-container','container-chooser');
    currentview = new MainMenu(assets);
  }

  var mp = new MetaPong({ // need to modify metapong.js to make shapes clickable (say the name)
    "image_url": [
      "svgs/shapes/triangle-eq.png",
      "svgs/shapes/square.png",
      "svgs/shapes/circle.png",
      "svgs/shapes/hexagon.png",
      "svgs/shapes/octagon.png",
      //"svgs/shapes/star.svg",
      "svgs/shapes/pentagon.png",
      "svgs/shapes/rectangle.svg"
    ],
    "count": 7,
    "rotate_speed": "6",
    "rotate_range": "5",
    "image_rot": true
  });
  mp.start();

};
