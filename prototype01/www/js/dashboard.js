var Dashboard = function() {
  // simple dashboard to show session lengths and time spent playing each game
  // (maybe also show proportion correct in each game?)

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
      output += (key+': '+val)+'\n';
      //console.log(key, '==', val);
  })

  $('#sessions').html(output);
}
