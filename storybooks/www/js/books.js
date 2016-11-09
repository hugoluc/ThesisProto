// 'use strict';
// function getFiles(dir){
//     var fileList = [];
//     var files = fs.readdirSync(dir);
//     for(var i in files){
//         if (!files.hasOwnProperty(i)) continue;
//         var name = dir+'/'+files[i];
//         if (!fs.statSync(name).isDirectory()){
//             fileList.push(name);
//         }
//     }
//     return fileList;
// }

// console.log(getFiles("book_images/hyena_and_raven"));

// directory with flat text (.txt) files, one sentence per line,
// and pages separated by a number on its own line
var textdir = "book_text/";
// directory with book images, alphabetically (one per page)
var imgdir = "book_images/";
// directory with book audio: 0.mp3 is the title,
// and 1.mp3 through N.mp3 are audio corresponding to the lines of text
var audiodir = "book_audio/";

var books = {"english":[], "swahili":[]};

books.swahili.push({id:0, title:"Adhabu", text:"adhabu", images:"adhabu", audio:"adhabu"})
books.swahili.push({id:1, title:"Anansi, Kunguru na Mamba", text:"anansi_kunguru", images:"anansi_the_crows", audio:"anansi_kunguru"});
books.swahili.push({id:2, title:"Anansi na Hekima", text:"anansi_na_hekima", images:"anansi_and_wisdom", audio:"anansi_na_hekima"});
books.swahili.push({id:3, title:"Anansi na Kasa", text:"anansi_na_kasa", images:"anansi_and_turtle", audio:"anansi_na_hekima"});
//books.swahili.push({title:, text:"anansi_na_tai", images:"anansi_and_vulture"});
books.swahili.push({id:4, title:"Fisi na Kunguru", text:"fisi_na_kunguru", images:"hyena_and_raven"});

books.english.push({id:0, title:"Adhabu", text:"adhabu", images:"adhabu", audio:"adhabu"});
books.english.push({id:4, title:"Hyena and Raven", text:"hyena_and_raven", images:"hyena_and_raven", audio:"hyena_and_raven"});

function loadBook(book_id) {
	$("#menu").hide();
	var book = books[language][book_id];
  // get listing of images in imgdir, load the text and split into pages, and show the first page (title?)
	console.log(imgdir+book.images);
  $.ajax({
  url: imgdir+book.images+'/', //"http://yoursite.com/images/",
    success: function(data){
      $(data).find("td > a").each(function(){
        console.log("file: " + $(this).attr("href"));
      });
    }
  });

  $.get(textdir+book.text+".txt", function (raw) {
    pages = LoadFile(raw);
    showPage(slideIndex);
  });
}

var pages;

function preload(arrayOfImages) {
    $(arrayOfImages).each(function () {
        $('<img />').attr('src',this).appendTo('body').css('display','none');
    });
}

function LoadFile(strRawContents) {
    //var oFrame = document.getElementById("frmFile");
    //var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    var pages = [];
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");
    //console.log("File " + oFrame.src + " has " + arrLines.length + " lines");
    var title = arrLines[0]; // title
    var sentences = [];
    for (var i = 1; i < arrLines.length; i++) {
        var curLine = arrLines[i];
        if( curLine.length<3 ) {
            // blank line or number
            if(!isNaN(parseInt(curLine))) { // new page number!
                pages.push(sentences);
                sentences = [];
            }
        } else { // line of text: add it
            sentences.push(curLine);
        }
        //console.log("Line #" + (i + 1) + " is: '" + curLine + "'");
    }
    //console.log(pages);
    return(pages);
}

var slideIndex = 1;

function plusDivs(n) {
  showPage(slideIndex += n);
}

function currentDiv(n) {
  showPage(slideIndex = n);
}

function showPage(n) {
	var i;
	var x = document.getElementsByClassName("mySlides");
	var dots = document.getElementsByClassName("pg-btn");
	if (n > x.length) {slideIndex = 1}
	if (n < 1) {slideIndex = x.length} ;
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(" w3-red", "");
	}
	x[slideIndex-1].style.display = "block";
	dots[slideIndex-1].className += " w3-red";

	document.getElementById("book-text").innerHTML = "";
	for(i = 0; i < pages[slideIndex-1].length; i++) {
	document.getElementById("book-text").innerHTML+='<p>'+pages[slideIndex-1][i]+'</p>';
	}
}
