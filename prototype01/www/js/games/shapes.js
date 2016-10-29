

var Shapes = function() {
  //document.body.select

  //document.body.appendChild(canvas);
  document.getElementById("shapes-container").style.display = 'block';

  this.destroy = function() {
    mp.stop();
    clickStart('shapes-container','container-chooser');
    currentview = new MainMenu(assets);
  }

  stim = [];

  // for (var i = 0; i < shapes.length; i++) {
  //   if(shapes[i].id=="star" | shapes[i].id=="semicircle") continue;
  //
  //   stim.push("svgs/shapes/"+shapes[i].image+".png");
  //   var mp = new MetaPong({ // need to modify metapong.js to make shapes clickable (say the name)
  //     "image_url": stim,
  //     "count": stim.length,
  //     "rotate_speed": "6",
  //     "rotate_range": "5",
  //     "image_rot": true
  //   });
  //   mp.start();
  //
  //   var shape_name = new Howl({
  //     src: ['audio/'+language+'/'+shapes[i].audio+'.mp3'],
  //     autoplay: true,
  //     onend: function() {
  //       console.log('Print name: '+ shapes[i].text);
  //     }
  //   });
  //
  // }

  (function myLoop (i) {

    stim.push("svgs/shapes/"+shapes[i].image+".png");
    var mp = new MetaPong({ // need to modify metapong.js to make shapes clickable (say the name)
      "image_url": stim,
      "count": stim.length,
      "rotate_speed": "6",
      "rotate_range": "5",
      "image_rot": true
    });
    mp.start();

    var shape_name = new Howl({
      src: ['audio/'+language+'/'+shapes[i].audio+'.mp3'],
      autoplay: true,
      onend: function() {
        console.log('Print name: '+ shapes[i].text);
      }
    });

    setTimeout(function () {
      mp.stop();
      if (i<shapes.length-1) myLoop(i+1);      //  decrement i and call myLoop again if i > 0
   }, 3000)
 })(0);


  // var mp = new MetaPong({ // need to modify metapong.js to make shapes clickable (say the name)
  //   "image_url": [
  //     "svgs/shapes/triangle-eq.png",
  //     "svgs/shapes/square.png",
  //     "svgs/shapes/circle.png",
  //     "svgs/shapes/hexagon.png",
  //     "svgs/shapes/octagon.png",
  //     //"svgs/shapes/star.svg",
  //     "svgs/shapes/pentagon.png",
  //     "svgs/shapes/rectangle.svg"
  //   ],
  //   "count": 7,
  //   "rotate_speed": "6",
  //   "rotate_range": "5",
  //   "image_rot": true
  // });
  //
  // mp.start();

};
