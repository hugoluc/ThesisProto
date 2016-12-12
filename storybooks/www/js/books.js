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

var slideIndex;

var playing = false; // audio playing now?
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
books.swahili.push({id:4, title:"Fisi na Kunguru", text:"fisi_na_kunguru", images:"hyena_and_raven"}); // get audio!
books.swahili.push({id:5, title:"Nozibele", text:"nozibele_sw", images:"nozibele", audio:"nozibele_sw"});
books.swahili.push({id:6, title:"Mulongo na Fisi", text:"mulongo_sw", images:"mulongo", audio:"mulongo_na_fisi"});
books.swahili.push({id:7, title:"Kisirusiru", text:"kisirusiru_sw", images:"kisirusiru", audio:"kisirusiru_sw"});
books.swahili.push({id:8, title:"Mwezi na Kofia", text:"mwezi_na_kofia", images:"mwezi_na_kofia"});
books.swahili.push({id:9, title:"Ndovu na Vyura", text:"ndovu_na_vyura", images:"ndovu_na_vyura"});
books.swahili.push({id:10, title:"Ngombe Wetu", text:"ngombe_wetu", images:"ngombe_wetu"});
books.swahili.push({id:11, title:"Mfuko Uzungumzao", text:"mfuko_uzungumzao", images:"mfuko"});
books.swahili.push({id:12, title:"Rafiki Ninaye Mkosa", text:"rafiki_ninaye_mkosa", images:"rafiki"});
books.swahili.push({id:13, title:"Shati la Hamisi la Kijani Kibichi", text:"shati_la_hamisi_la_kijani_kibichi", images:"shati"});

//books.english.push({id:0, title:"Adhabu", text:"adhabu", images:"adhabu", audio:"adhabu"});
books.english.push({id:0, title:"No Pigs Allowed", text:"no_pigs_allowed", images:"no_pigs_allowed", audio:"no_pigs_allowed"});
books.english.push({id:1, title:"Anansi and Turtle", text:"anansi_and_turtle", images:"anansi_and_turtle", audio:"anansi_and_turtle"});
books.english.push({id:2, title:"Anansi and Vulture", text:"anansi_and_vulture", images:"anansi_and_vulture", audio:"anansi_and_vulture"});
books.english.push({id:3, title:"Anansi and Wisdom", text:"anansi_and_wisdom", images:"anansi_and_wisdom", audio:"anansi_and_wisdom"});
books.english.push({id:4, title:"Anansi, the Crows, and the Crocodiles", text:"anansi_crows_crocodiles", images:"anansi_the_crows", audio:"anansi_crows_crocodiles"});
books.english.push({id:5, title:"Hyena and Raven", text:"hyena_and_raven", images:"hyena_and_raven", audio:"hyena_and_raven"});
books.english.push({id:6, title:"Mulongo and the Hyenas", text:"mulongo_en", images:"mulongo", audio:"mulongo_en"});
books.english.push({id:7, title:"Nozibele and the Three Hairs", text:"nozibele_en", images:"nozibele", audio:"nozibele_en"});

var Book = function(book_id) {
	var self = this;

	$("#menu").hide();
	slideIndex = 1;

	self.id = book_id;
	self.info = books[language][self.id];
	self.pages = [];
	self.audio = [];
	self.playIndex = -1;

	self.load = function() {
		// should draw a back button that hides content and shows menu
	  // get listing of images in imgdir, load the text and split into pages, and show the first page (title?)
		console.log(imgdir+self.info.images);
	  $.ajax({
	  url: imgdir+self.info.images+'/', //"http://yoursite.com/images/",
	    success: function(data){
	      // $(data).find("td > a").each(function(){
	      //   console.log("file: " + $(this).attr("href"));
	      // });
				$(data).find("a:contains(.jpg)").each(function (index, value) {
					var fname = $(this).attr("href");
					//console.log(fname);
					if(fname!="0.jpg") {
						var fileloc = imgdir + self.info.images + '/' + $(this).attr("href");
	        	$("#book-image").append("<img class='mySlides' src='" + fileloc + "'>");
						//$("#page-btns").append("<button class='w3-btn pg-btn' onclick='curBook.currentDiv(" + index + ")'>" + index + "</button>");
						$("#page-btns").append("<button class='w3-btn pg-btn'>" + index + "</button>");
					}
	      });
	    }
	  });

		// load audio if defined
		if(self.info.audio) {
			$.ajax({
		  url: audiodir+self.info.audio+'/',
		    success: function(data){
					$(data).find("a:contains(.mp3)").each(function (index, value) {
						var fname = $(this).attr("href");
						var fileloc = audiodir + self.info.audio + '/' + $(this).attr("href");
						console.log(fname);
						var ind = fname.split(".")[0];
						self.audio[parseInt(ind)] = new Howl({
				      src: [fileloc], // book_audio/adhabu/6.mp3
				      autoplay: false,
				      buffer: true,
							onend: function() {
						    playing = false;
								$("#aud"+self.playIndex).css({ 'color':'black', 'font-size':'100%' });
						  }
				    });
					});
		    }
		  });
		}

	  $.get(textdir+self.info.text+".txt", function (raw) {
	    self.pages = self.loadFile(raw);
			//console.log(self.pages);
			setTimeout(function(){ self.showPage(slideIndex); }, 500);
	  });

		$("#content").show();
	}

	// fix: add back button that calls this and returns to main menu
	this.destroy = function() {
		//logTime("book",'stop');
		//mp.stop();
		clickStart('shapes-container','container-chooser');
		currentview = new MainMenu(assets);
	}

	this.preload = function(arrayOfImages) {
    $(arrayOfImages).each(function () {
        $('<img />').attr('src',this).appendTo('body').css('display','none');
    });
	}

	// self.loadAudioFiles = function(nlines, bookdir) {
	// 	var book_audio = [];
	//   for (var i = 0; i < nlines; i++) {
	//     book_audio[i] = new Howl({
	//       src: [audiodir+bookdir+'/'+i+'.mp3'],
	//       autoplay: false,
	//       buffer: true
	//     });
	//   }
	// 	return(book_audio);
	// }

 	self.loadFile = function(strRawContents) {
    //var oFrame = document.getElementById("frmFile");
    //var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");
    //console.log("File " + oFrame.src + " has " + arrLines.length + " lines");
    var title = arrLines[0]; // title
		var pages = [[title]];
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

	self.plusDivs = function(n) {
	  self.showPage(slideIndex += n);
	}

	self.currentDiv = function(n) {
	  self.showPage(slideIndex = n);
	}

	self.playAudio = function(ind) {
		//if(ind<self.audio.length)
		if(!playing) {
			playing = true;
			self.playIndex = ind;
			$("#aud"+ind).css({ 'color': 'red', 'font-size': '125%' });
			self.audio[ind].play();
			// setTimeout(function(){
			// 	$("#aud"+ind).css({ 'color': 'black', 'font-size': '100%' });
			// }, self.audio[ind]._duration);
			// if it's in range, and if it's not already playing
			console.log("playing: "+ind);
		}
	}

	self.showPage = function(n) {
		var aud_index = self.aud_index;
		if(n==1) aud_index = 0;

		var i;
		var x = document.getElementsByClassName("mySlides");
		var dots = document.getElementsByClassName("pg-btn");
		if (n > x.length) {slideIndex = 1}
		if (n < 1) {slideIndex = 1}; // x.length (wrap around? nah)
		for (i = 0; i < x.length; i++) {
			x[i].style.display = "none";
		}
		for (i = 0; i < dots.length; i++) {
			dots[i].className = dots[i].className.replace(" w3-red", "");
		}
		x[slideIndex-1].style.display = "block";
		dots[slideIndex-1].className += " w3-red";

		document.getElementById("book-text").innerHTML = "";
		for(i = 0; i < self.pages[slideIndex-1].length; i++) {
			document.getElementById("book-text").innerHTML+='<p id="aud'+ aud_index +'" onclick="curBook.playAudio('+aud_index+')">'+self.pages[slideIndex-1][i]+'</p>';
			//$("#id"+aud_index).click(self.audio[aud_index].play());
			aud_index++;
		}
		self.aud_index = aud_index;
	}

	//self.loadAudioFiles(self.info.audio);
	self.load();
	// console.log(self.audio);
	// self.audio[0].once('load', function(){
	// 	self.audio[0].play();
	// });
}
