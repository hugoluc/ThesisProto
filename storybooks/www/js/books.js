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

var books = {"english":[], 
		 "swahili":[]};

books.english.push({"text":"hyena_and_raven",images:"hyena_and_raven"});
books.english.push({"text":"adhabu",images:"adhabu"});

function loadBook(book) {
  // get listing of images in imgdir, load the text and split into pages, and show the first page (title?)
  $.ajax({
  url: imgdir+book.images, //"http://yoursite.com/images/",
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

// books.append({title: "Where is my bat?", directory: "where_is_my_bat",
// 	images: ["bat00.jpg", "bat01.jpg", "bat02.jpg", "bat03.jpg", "bat04.jpg", 
// 			 "bat05.jpg", "bat06.jpg", "bat07.jpg", "bat08.jpg"], 
// 	english: ["Where is my bat?",
// 		"I have lost my bat, and I cannot find it.",
// 		"I looked behind the door. It was not there.",
// 		"I looked for it on the shelf. I could not find it there.",
// 		"I looked for it under the bed. Not there either.",
// 		"I searched inside the box. There was no sign of it.",
// 		"I searched the attic. It was not there.",
// 		"I looked here, there and everywhere. I could not find it anywhere.",
// 		""], 
// 	attribution: {author: "Meera Tendolkar and Madhav Chavan", 
// 	illustrator: "Rijuta Ghate", 
// 	organization: "Pratham Books"} 
//  });


// books.append({title: "What are you doing?", 
// 	images: [], 
// 	english: [], 
// 	attribution: {author: "Nina Orange", illustrator: "Wiehan de Jager"}
// });


// books.append({title: {english: "Hyena and Raven", swahili: "Fisi na kunguru"}, directory: "hyena_and_raven",
// 	images: ["hr00.jpg", "hr00.jpg", "hr02.jpg", "hr03.jpg", "hr04.jpg", "hr05.jpg", "hr06.jpg", "hr07.jpg", "hr08.jpg", "hr09.jpg", "hr10.jpg"], 
// 	english: ["Hyena and Raven were once great friends, even though they were quite different in some ways. Raven could fly but Hyena was only able to walk.", // change pic
// 		'One day Hyena, curious to know something about his friend, asked Raven, "What is this white thing which is always below your neck?"', 
// 		'Raven answered, "It is the fatty meat which I usually eat in the sky. I have been eating it for so long now it is stuck on my neck."',
// 		"On hearing about meat, saliva started pouring out of Hyena's mouth, for he was greedy and he loved meat very much.",
// 		"Hyena really wanted to eat that meat. But how could he reach the meat in the sky if he had no wings to fly?",
// 		'"Please my friend," he asked Raven, "lend me some feathers so that I can make myself some wings. I really want to be able to fly like you."', // change
// 		"Raven was not mean, so he gave him some feathers. Hyena sewed them together into wings.",
// 		"He fastened them to his body and tried to take off into the sky.",
// 		"But he was far too heavy for the few feathers to carry him, so he had to think of another plan.", // change
// 		'"Please, my friend," he asked Raven, "could I hold onto your tail as you fly up into the sky?"', 
// 		'"All right," said Raven. "I know how much you want to fly. Let us do it tomorrow morning."',
// 		"When day came, Hyena took hold of Raven's tail and Raven flew up into the sky.", // change
// 		'Raven flew and flew and flew until he was exhausted. But Hyena said, "Just a little further, my friend!"',
// 		"He could see the white and fatty meat just above them, and his mouth was watering.", // change
// 		"When they reached the first piece of fatty meat, Hyena felt a jerk. One of Raven's tail feathers came off in his hand!",
// 		"Then there was another jerk, and another. Raven felt much lighter, and the ache in his tail was going.",
// 		"He sang: Raven's feathers, unpluck yourselves. Raven's feathers, unpluck yourselves.",
// 		"In response, Hyena sang the opposite: Raven's feathers hold on, don't unpluck yourselves. Raven's feather's hold on, don't unpluck yourselves.", // change
// 		"Finally, the feathers could not hold Hyena anymore. He was in the middle of nowhere in the sky.",
// 		"He jumped onto the fatty meat thinking that as he ate, the fatty meat would hold him.",
// 		"But as he tried to hold and eat the 'meat', all he felt was moist cloud!", // change
// 		'By now he was falling fast. "Help, help!" he shouted. But no one could hear him. Raven was lost in the clouds.', //change
// 		"Hyena fell on the ground with a crash and lay silent for some minutes.",
// 		"He woke up howling in pain, with a broken leg and dark scars all over his body.", // change
// 		"From that day to now, Hyena limps and he has many scars on his body.",
// 		"He has never been able to fly. And he and Raven are no longer friends."
// 	], 
// 	swahili: ["Fisi na kunguru walikuwa marafiki sana hapo awali ingawaje tabia zao zilikuwa tofauti sana kwa njia nyingine. Kunguru aliweza kuruka lakini fisi hakuweza isipokuwa kutembea tu.",
// 	'Siku moja fisi alikuwa na hamu kumfahamu zaidi rafiki yake. Alimwuliza kunguru, "kitu hiki cheupe kilichopo nyuma ya shingo lako ni kitu gani?"',
// 	'"Ni nyama nono ambayo kawaida inaliwa wakati ninaporuka angani. Nimekuwa ninaila tangu muda mrefu hadi sasa imenibandika shingoni."',
// 	"Aliposikia juu ya nyama fisi alitokwa na udenda katika tamaa yake ya kula nyama.",
// 	"Fisi alitamani sana kula nyama hiyo. Lakini ataipataje ikiwa juu angani hali hana mbawa ya kuirukia?",
// 	'"Tafadhali rafiki yangu, naomba kukopesha manyoya ili niweze kujitengenezea mbawa. Nina hamu sana kuruka kama wewe." Alimwomba kunguru.', // change
// 	"Kunguru kwa ukarimu wake alimpa si manyoya. Fisi aliyashona yawe mbawa.",
// 	"Akayaunganisha na mwili wake akajaribu kuruka.",
// 	"Lakini uzito wake ulimshinda. Sasa ilibidi a kirie mpango mpya.", // change
// 	'"Tafadhali rafiki yangu, naomba nikushike kwa mkia wako utakaporuka angani?" Alimwomba kunguru. "Sawa sawa,” akakubali kunguru. "Najua una hamu kuruka. Hebu tufanye kesho asubuhi."',
// 	"Ilipokucha kesho yake, fisi alimshika kunguru kwa mkia wake naye kunguru akaruka angani.",
// 	'Fisi alikuwa akitamani nyama iliyokuwa juu mbele kidogo akatokwa na udenda tena. Kunguru aliruka na kuruka mpaka akachoka kabisa. Lakini fisi akamwomba, "endelea kidogo tu rafiki yangu!"',
// 	"Walipo ka kipande cha kwanza cha nyama nono, fisi alisikia mshtuko. Unyoya mmoja alioushika ukatoka mkia wa kunguru!",
// 	"Kisha mshtuko mwingine na wa tatu. Kunguru alijisikia ameondolewa na mzigo na mkia wake ukapona.",
// 	"Aliimba, manyoya ya kunguru jinyonyoe. Manyoya ya kunguru jinyonyoe.",
// 	"Katika kuitikia, fisi aliimba kinyume, manyoya ya kunguru shikane yasijinyonyoe. Manyoya ya kunguru shikane yasijinyonyoe.", // change
// 	"Hatimaye manyoya yakamwachilia fisi. Alikuwa peke yake angani.",
// 	"Alirukia nyama nono aki kiri anapokula nyama nono itampa msingi wa kukalia.",
// 	"Lakini alipojaribu kushika 'nyama' alichoshika kilikuwa mawingu ya majimaji tu!", // change
// 	'Sasa ameshaanza kuanguka upesi upesi. "Nisaidie, nisaidie!" Akafoka. Lakini hapakuwa na yeyote wa kumsikiliza. Kunguru alikwisha potea mawinguni.', // change
// 	"Fisi akaanguka kwa kishindo akalala kimya muda.",
// 	"Akaamka akipiga yowe ya maumivu mguu umevunjika kovu nyingi mwilini.", // change
// 	"Hajaweza kuruka kamwe. Na ura ki baina yake na kunguru hakuwepo tena."
// 	],
// 	attribution: {author: "Ann Nduku", illustrator: "Wiehan de Jager"}
// });

