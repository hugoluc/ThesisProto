
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o) {
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function getAngle(x,y,_x,_y){

  var oposite = _x - x;
  var adjacent = _y - y;
  var hipotenuse = Math.sqrt((oposite*oposite)+(adjacent*adjacent))
  var sinOfAngleX = oposite / hipotenuse
  return Math.asin(sinOfAngleX)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max-min)) + min;
}

// hides one page and shows the next
function clickStart(hide, show) {

        document.getElementById(hide).style.display="none";
        document.getElementById(show).style.display = "block";
        window.scrollTo(0,0);
}

function getRandomColor() {

    var letters = '0123456789ABCDEF'.split('');
    var color = '#';

    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;

}
