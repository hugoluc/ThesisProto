//
// var test = new Stimulus();
// console.log(test);
// var test2 = new Stimulus({id:"star", text:"star", image:"star", audio:"star"});
// console.log(test2);

// try again! let's go! i'm bored?
// hongera - congratulations
// baadae - see you later
var feedback = [
  {id:"good_job", text:"kazi nzuri", audio:"kazi_nzuri"},
  {id:"welcome", text:"karibu", audio:"karibu"},
  {id:"go", text:"kwenda", audio:"kwenda"},
  {id:"goodbye", text:"kwaheri", audio:"kwaheri"},
  {id:"try_again", text:"jaribu tena", audio:"jaribu_tena_try_again"}
];

var numbers = [
  //{id:"0", audio:"0_sifuri", text:"sifuri", seq:[]},
  {id:"1", audio:"1_moja", text:"moja", seq:[]},
  {id:"2", audio:"2_mbili", text:"mbili", seq:[]},
  {id:"3", audio:"3_tatu", text:"tatu", seq:[]},
  {id:"4", audio:"4_nne", text:"nne", seq:[]},
  {id:"5", audio:"5_tano", text:"tano", seq:[]},
  {id:"6", audio:"6_sita", text:"sita", seq:[]},
  {id:"7", audio:"7_saba", text:"saba", seq:[]},
  {id:"8", audio:"8_nane", text:"nane", seq:[]},
  {id:"9", audio:"9_tisa", text:"tisa", seq:[]},
  {id:"10", audio:"10_kumi", text:"kumi", seq:[]},
  {id:"11", audio:"11_kumi-na-moja", text:"kumi na moja", seq:[]},
  {id:"12", audio:"12", text:"kumi na mbili", seq:[]},
  {id:"13", audio:"13", text:"kumi na tatu", seq:[]},
  {id:"14", audio:"14", text:"kumi na nne", seq:[]},
  {id:"15", audio:"15", text:"kumi na tano", seq:[]},
  {id:"16", audio:"16", text:"kumi na sita", seq:[]},
  {id:"17", audio:"17", text:"kumi na saba", seq:[]},
  {id:"18", audio:"18", text:"kumi na nane", seq:[]},
  {id:"19", audio:"19", text:"kumi na tisa", seq:[]},
  {id:"20", audio:"ishirini", text:"ishirini", seq:[]},
  {id:"21", audio:"21", text:"ishirini na moja", seq:[]},
  {id:"22", audio:"22", text:"ishirini na mbili", seq:[]},
  {id:"23", audio:"23", text:"ishirini na tatu", seq:[]},
  {id:"24", audio:"24", text:"ishirini na nne", seq:[]},
  {id:"25", audio:"25", text:"ishirini na tano", seq:[]},
  {id:"26", audio:"26", text:"ishirini na sita", seq:[]},
  {id:"27", audio:"27", text:"ishirini na saba", seq:[]},
  {id:"28", audio:"28", text:"ishirini na nane", seq:[]},
  {id:"29", audio:"29", text:"ishirini na tisa", seq:[]}, // let's just go up to 30 for add/sub for now
  {id:"30", audio:"thelathini", text:"thelathini", seq:[]} // some places sound: 'selasini'
  // {id:"40", audio:"arobaini", text:"arobaini", seq:[]},
  // {id:"50", audio:"hamsini", text:"hamsini", seq:[]},
  // {id:"60", audio:"sitini", text:"sitini", seq:[]},
  // {id:"70", audio:"sabini", text:"sabini", seq:[]},
  // {id:"80", audio:"themanini", text:"themanini", seq:[]},
  // {id:"90", audio:"tisini", text:"tisini", seq:[]}
  // {id:"100", audio:"mia", text:"mia", seq:[]}, // 500 - mia tano
  // {id:"1000", audio:"elfu", text:"elfu", seq:[]},
  // {id:"100000", audio:"laki", text:"laki", seq:[]},
  // {id:"1000000", audio:"milloni", text:"milloni", seq:[]}
  ];

//generate_number_name(45)
// 300,000 - laki tatu (laki = 100,000)
// 201 - mia mbili na moja
// 1,000,000 milloni moja

function generate_number_audio() {

}

// demo of how to make a howler playlist
var playlist = function(e) {
        // initialisation:
          pCount = 0;
          playlistUrls = [
            "./audio/a.mp3",
            "./audio/b.mp3"
            ], // audio list
          howlerBank = [],
          loop = true;

        // playing i+1 audio (= chaining audio files)
        var onEnd = function(e) {
          if (loop === true ) { pCount = (pCount + 1 !== howlerBank.length)? pCount + 1 : 0; }
          else { pCount = pCount + 1; }
          howlerBank[pCount].play();
        };

        // build up howlerBank:
        playlistUrls.forEach(function(current, i) {
          howlerBank.push(new Howl({ urls: [playlistUrls[i]], onend: onEnd, buffer: true }))
        });

        // initiate the whole :
        howlerBank[0].play();
}



// words for each letter and syllable: https://www.youtube.com/watch?v=IUjpXWPaWE0
  /*
  {id:"", text:"", audio:"", seq:[]},
  {id:"", text:"", audio:"", seq:[]},
  {id:"", text:"", audio:"", seq:[]},
  {id:"", text:"", audio:"", seq:[]}
  */

// for each consonant could record each vowel sound (ba be bi bo bu)
// just do alphabet for now
var letters = [
  {id:1, text:"A", audio:"A", seq:[]},
  {id:2, text:"B", audio:"B", seq:[]},
  {id:3, text:"C", audio:"C", seq:[]}, // use 'Ch' or 'C' ?
  {id:4, text:"D", audio:"D", seq:[]},
  {id:5, text:"E", audio:"E", seq:[]},
  {id:6, text:"F", audio:"F", seq:[]},
  {id:7, text:"G", audio:"G", seq:[]},
  {id:8, text:"H", audio:"H", seq:[]},
  {id:9, text:"I", audio:"I", seq:[]},
  {id:10, text:"J", audio:"J", seq:[]},
  {id:11, text:"K", audio:"K", seq:[]},
  {id:12, text:"L", audio:"L", seq:[]},
  {id:13, text:"M", audio:"M", seq:[]},
  {id:14, text:"N", audio:"N", seq:[]},
  {id:15, text:"O", audio:"O", seq:[]},
  {id:16, text:"P", audio:"P", seq:[]},
  {id:18, text:"R", audio:"R", seq:[]},
  {id:19, text:"S", audio:"S", seq:[]},
  {id:20, text:"T", audio:"T", seq:[]},
  {id:21, text:"U", audio:"U", seq:[]},
  {id:22, text:"V", audio:"V", seq:[]},
  {id:23, text:"W", audio:"W", seq:[]},
  {id:25, text:"Y", audio:"Y", seq:[]},
  {id:26, text:"Z", audio:"Z", seq:[]}
  ];

var shapes = [
  {id:"circle", text:"duara", image:"circle", audio:"duara"},
  {id:"triangle", text:"pembetatu", image:"triangle-eq", audio:"pembetatu"},
  {id:"square", text:"mraba", image:"square", audio:"mraba"},
  {id:"rectangle", text:"mstatili", image:"rectangle", audio:"mstatili"},
  {id:"pentagon", text:"pembetano", image:"pentagon", audio:"pembetano"},
  {id:"hexagon", text:"pembesita", image:"hexagon", audio:"pembesita"},
  {id:"octagon", text:"pembenane", image:"octagon", audio:"pembenane"},
  {id:"star", text:"nyota", image:"star", audio:"nyota"},
  {id:"semicircle", text:"nusuduara", image:"semicircle", audio:"nusuduara"}
  ];


var animals = [
  {id:"crab", text:"kaa", audio:"kaa", image:"crab"},
  {id:"leopard", text:"chui", audio:"chui", image:"leopard"},
  {id:"chicken", text:"kuku", audio:"kuku", image:"chicken"},
  {id:"cheetah", text:"duma", audio:"duma", image:"cheetah"},
  {id:"cat", text:"paka", audio:"paka", image:"cat"},
  {id:"squid", text:"mzia", audio:"mzia"}
  {id:"lion", text:"simba", audio:"simba", image:"lion"},
  {id:"elephant", text:"tembo", audio:"tembo", image:"elephant"},
  {id:"bird", text:"ndege", audio:"ndege", image:"bird"},
  {id:"baboon", text:"nyani", audio:"nyani", image:"baboon"},
  {id:"buffalo", text:"nyati", audio:"nyati", image:"buffalo"},
  {id:"dog", text:"mbwa", audio:"mbwa", image:"dog"},
  {id:"pig", text:"nguruwe", audio:"nguruwe", image:"pig"},
  {id:"sheep", text:"kondoo", audio:"kondoo", image:"sheep"},
  {id:"snake", text:"nyoka", audio:"nyoka", image:"snake"},
  {id:"octopus", text:"pweza", audio:"pwesa", image:"octopus"}, // pwesa sometimes
  {id:"shark", text:"papa", audio:"papa", image:"shark"},
  {id:"anchovy", text:"kombo", audio:"kombo", image:"fish"},
  {id:"fish", text:"samaki", audio:"samaki", image:"fish"},
  {id:"monkey", text:"kima", audio:"kima", image:"monkey"},
  {id:"duck", text:"bata", audio:"bata", image:"duck"},
  {id:"frog", text:"chura", audio:"chura", image:"frog"},
  {id:"rhinoceros", text:"kifaru", audio:"kifaru", image:"rhinoceros"},
  {id:"ostrich", text:"mbuni", audio:"mbuni", image:"ostrich"},
  {id:"hippopotamus", text:"kiboko", audio:"kiboko", image:"hippo"},
  {id:"goat", text:"mbuzi", audio:"mbuzi", image:"goat"},
  {id:"deer", text:"paa", audio:"paa", image:"deer"},
  {id:"horse", text:"farasi", audio:"farasi", image:"horse"},
  {id:"cow", text:"ng'ombe", audio:"ngombe", image:"cow"},
  {id:"zebra", text:"punda-milia", audio:"punda-milia", image:"zebra"},
  {id:"alligator", text:"aligeta", audio:"aligeta", image:"alligator"},
  {id:"crocodile", text:"mamba", audio:"mamba", image:"crocodile"},
  {id:"bear", text:"dubu", audio:"dubu", image:"bear"},
  {id:"emu", text:"emu", audio:"emu", image:"emu"},
///  {id:"flamingo", text:"heroe", audio:"heroe", image:"flamingo"}, // heron??
  {id:"fly", text:"nzi", audio:"inzi", image:"fly"}, // should be nzi -- re-record
  {id:"chameleon", text:"lumbwi", audio:"lumbwi", image:"chameleon"}, // lizard?
 {id:"pigeon", text:"ninga", audio:"ninga", image:"pigeon"}, // ..bird?
 //{id:"orangutan", text:"orangutangu", audio:"orangutangu", image:"orangutan"},
 {id:"giraffe", text:"twiga", audio:"twiga", image:"giraffe"},
 {id:"lobster", text:"uduvi", audio:"uduvi", image:"lobster"},
// {id:"bee", text:"wembembe", audio:"wembembe", image:"bee"}, // dondola ? // nyuki
 {id:"jellyfish", text:"yavuyavu", audio:"yavuyavu", image:"jellyfish"}
 //{id:"warthog", text:"gwasi", audio:"gwasi"}, // pig? hog? warthog?
// praying mantis = vunjajungu ? (or insect?)
// robin = robini , swallow?? = zawaridi
  ];

// image-able things (ideally with an image!), e.g. for hangman
var objects = animals.concat([
  {id:"bicycle", text:"baiskeli", audio:"baiskeli", image:"bicycle"},
  {id:"car", text:"gari", audio:"gari", image:"car"},
  {id:"motorcycle", text:"pikipiki", audio:"pikipiki", image:"motorcycle"},
  {id:"tree", text:"mti", audio:"mti"},
  {id:"plant", text:"mmea", audio:"mmea"},
  {id:"meat", text:"nyama", audio:"nyama"},
  {id:"seagull", text:"shakwe", audio:"shakwe"},
  {id:"sword", text:"upanga", audio:"upanga"},
  {id:"medicine", text:"dawa", audio:"dawa"},
  {id:"potato", text:"kiazi", audio:"kiazi"},
  {id:"oil", text:"mafuta", audio:"mafuta"},
  {id:"mountain", text:"kilima", audio:"kilima"},
  {id:"river", text:"mto", audio:"mto"},
  {id:"water", text:"maji", audio:"maji"},
  {id:"silver", text:"fedha", audio:"fedha", image:"silver"},
  {id:"kidney", text:"figo", audio:"figo"},
  {id:"chest", text:"kifua", audio:"kifua"},
  {id:"coconut", text:"nazi", audio:"nazi", image:"coconut"},
  {id:"grape", text:"zabibu", audio:"zabibu", image:"grape"},
//  {id:"cheese", text:"chizi", audio:"chizi", image:"cheese"}, // crazy person
  {id:"beard", text:"ndevu", audio:"ndevu"},
  {id:"bush", text:"nyika", audio:"nyika"},
  {id:"vegetable", text:"mboga", audio:"mboga"},
  {id:"calf", text:"ndama", audio:"ndama", image:"calf"},
  {id:"cheek", text:"shavu", audio:"shavu"},
  {id:"heart", text:"moyo", audio:"moyo"},
  {id:"lung", text:"mapafu", audio:"mapafu"},
  {id:"stomach", text:"tumbo", audio:"tumbo"},
  {id:"almond", text:"lozi", audio:"lozi"},
  {id:"radio", text:"redio", audio:"redio", image:"radio"},
  {id:"orange", text:"chungwa", audio:"chungwa", image:"orange"},
  {id:"diamond", text:"almasi", audio:"almasi", image:"diamond"},
  {id:"mango", text:"embe", audio:"embe"},
  {id:"mouth", text:"mdomo", audio:"mdomo", image:"mouth"},
  {id:"eye", text:"jicho", audio:"jicho", image:"eye"},
  {id:"pineapple", text:"nanasi", audio:"nanasi", image:"pineapple"},
  {id:"banana", text:"ndizi", audio:"ndizi", image:"Banana"},
  {id:"egg", text:"yai", audio:"yai", image:"egg"},
  {id:"earth", text:"udongo", audio:"udongo", image:"earth"},
  {id:"house", text:"nyumba", audio:"nyumba"},
  {id:"school", text:"shule", audio:"shule"},
  {id:"neck", text:"shingo", audio:"shingo"},
  {id:"armpit", text:"kwapa", audio:"kwapa"},
  {id:"danger", text:"hatari", audio:"hatari", image:"danger"},
  {id:"drink", text:"kunywa", audio:"kunywa", image:"drink"},
  {id:"wind", text:"upepo", audio:"upepo"},
  {id:"cloud", text:"wingu", audio:"wingu"}, // re-record
  {id:"rain", text:"mvua", audio:"mvua"},
  {id:"fire", text:"moto", audio:"moto"},
  {id:"smoke", text:"moshi", audio:"moshi"},
  {id:"snow", text:"theluji", audio:"theluji"},
  {id:"storm", text:"dharuba", audio:"dharuba"},
  {id:"light", text:"nuru", audio:"nuru"},
  {id:"wing", text:"bawa", audio:"bawa"}
]);

// {id:"", text:"", audio:""},

var words = [
  {id:"I", text:"mimi", audio:"mimi"},
  {id:"we", text:"sisi", audio:"sisi"},
  {id:"you", text:"wewe", audio:"wewe"},
  {id:"you_all", text:"nyinyi", audio:"nyinyi"},
  {id:"he", text:"yeye", audio:"yeye"},
  {id:"she", text:"yeye", audio:"yeye"},
  {id:"they", text:"wao", audio:"wao"},
  {id:"and", text:"na", audio:"na"},
  {id:"bad", text:"mbaya", audio:"mbaya"},
  {id:"bitter", text:"chungu", audio:"chungu"},
  {id:"cold", text:"baridi", audio:"baridi"},
  {id:"good", text:"nzuri", audio:"nzuri"},
  {id:"friend", text:"rafiki", audio:"rafiki"},
  {id:"goodbye", text:"kwaheri", audio:"kwaheri"},
  {id:"hot", text:"moto", audio:"moto"}, // fire/spicy -- joto = feeling hot
  {id:"food", text:"chakula", audio:"chakula"},
  {id:"here", text:"hapa", audio:"hapa"},
  {id:"how", text:"vipi", audio:"vipi"},
  {id:"no", text:"hapana", audio:"hapana"},
  {id:"okay", text:"sawa", audio:"sawa"},
  {id:"sweet", text:"tamu", audio:"tamu"},
  {id:"there", text:"pale", audio:"pale"},
  {id:"thank_you", text:"asante", audio:"asante"},
  {id:"please", text:"tafadhali", audio:"tafadhali"},
  {id:"very", text:"sana", audio:"sana"},
  {id:"apologize", text:"samahani", audio:"samahani"},
  {id:"sorry", text:"pole", audio:"pole"},
  {id:"yes", text:"ndio", audio:"ndio"},
  {id:"what", text:"nini", audio:"nini"},
  {id:"which", text:"ipi", audio:"ipi"},
  {id:"where", text:"wapi", audio:"wapi"},
  {id:"when", text:"wakati gani", audio:"wakati_gani"}, // lini
  {id:"Saturday", text:"jumamosi", audio:"jumamosi"},
  {id:"Sunday", text:"jumapili", audio:"jumapili"},
  {id:"Monday", text:"jumatatu", audio:"jumatatu"},
  {id:"Tuesday", text:"jumanne", audio:"jumanne"},
  {id:"Wednesday", text:"jumatano", audio:"jumatano"},
  {id:"Thursday", text:"alhamisi", audio:"alhamisi"},
  {id:"Friday", text:"ijumaa", audio:"ijumaa"},
  {id:"time", text:"saa", audio:"saa"},
  {id:"hour", text:"saa", audio:"saa"},
  {id:"morning", text:"asubuhi", audio:"asubuhi"},
  {id:"evening", text:"jioni", audio:"jioni"},
  {id:"night", text:"usiku", audio:"usiku"},
  {id:"now", text:"sasa", audio:"sasa"},
  {id:"today", text:"leo", audio:"leo"},
  {id:"yesterday", text:"jana", audio:"jana"},
  {id:"tomorrow", text:"kesho", audio:"kesho"},
  {id:"day", text:"siku", audio:"siku"},
  {id:"week", text:"wiki", audio:"wiki"},
  {id:"month", text:"mwezi", audio:"mwezi"},
  {id:"year", text:"mwaka", audio:"mwaka"},
  {id:"century", text:"karne", audio:"karne"},
  {id:"air", text:"hewa", audio:"hewa"},
  {id:"secret", text:"siri", audio:"siri"},
  {id:"half", text:"nusu", audio:"nusu"},
  {id:"who", text:"nani", audio:"nani"},
  {id:"lake", text:"ziwa", audio:"ziwa"},
  {id:"journey", text:"safari", audio:"safari"},
  {id:"fear", text:"woga", audio:"woga"},
  {id:"people", text:"watu", audio:"watu"},
  {id:"sister", text:"dada", audio:"dada"},
  {id:"dust", text:"vumbi", audio:"vumbi"},
  {id:"veil", text:"veli", audio:"veli"},
  {id:"war", text:"vita", audio:"vita"},
  {id:"language", text:"lugha", audio:"lugha"},
  {id:"father", text:"baba", audio:"baba"},
  {id:"color", text:"rangi", audio:"rangi"},
  {id:"news", text:"habari", audio:"habari"},
  {id:"pilot", text:"rubani", audio:"rubani"},
  {id:"underwear", text:"chupi", audio:"chupi"},
  {id:"expensive", text:"ghali", audio:"ghali"},
  {id:"far", text:"mbali", audio:"mbali"},
  {id:"seed", text:"mbegu", audio:"mbegu"},
  {id:"quiet", text:"kimya", audio:"kimya"},
  {id:"hunger", text:"njaa", audio:"njaa"},
  {id:"dream", text:"njozi", audio:"njozi"}, //ndoto
  {id:"true", text:"kweli", audio:"kweli"},
  {id:"coastal", text:"pwani", audio:"pwani"},
  {id:"of", text:"ya", audio:"ya"},
  {id:"sky", text:"samawati", audio:"samawati"},
  {id:"darkness", text:"giza", audio:"giza"}, // sometimes kiza...
  {id:"shade", text:"kivuli", audio:"kivuli"}, // also means shadows..
  {id:"dew", text:"umande", audio:"umande"},
  {id:"fog", text:"ukungu", audio:"ukungu"},
  {id:"healthy", text:"afya", audio:"afya"},
  {id:"fruit", text:"tunda", audio:"tunda"},
  {id:"flour", text:"unga", audio:"unga"},
  {id:"country", text:"nchi", audio:"nchi"},
  {id:"word", text:"neno", audio:"neno"},
  {id:"name", text:"jina", audio:"jina"},
  {id:"money", text:"fedha", audio:"fedha"}, // also pesa
  {id:"room", text:"chumba", audio:"chumba"},
  {id:"quick", text:"upesi", audio:"upesi"},
  {id:"music", text:"muziki", audio:"muziki"},
  {id:"sea", text:"bahari", audio:"bahari"},
  {id:"forest", text:"mwitu", audio:"mwitu"},
  {id:"picture", text:"picha", audio:"picha"},
  {id:"weak", text:"dhaifu", audio:"dhaifu"},
  {id:"animal", text:"mnyama", audio:"mnyama"},
  {id:"strong", text:"nguvu", audio:"nguvu"}
  ];

words = words.concat([{"text": "ya", "audio": "ya", "id": 1}, {"text": "ni", "audio": "ni", "id": 2},
  {"text": "wa", "audio": "wa", "id": 3}, {"text": "la", "audio": "la", "id": 4}, {"text": "na", "audio": "na", "id": 5},
  {"text": "au", "audio": "au", "id": 6}, {"text": "si", "audio": "si", "id": 7}, {"text": "tu", "audio": "tu", "id": 8},
  {"text": "me", "audio": "me", "id": 9}, {"text": "cha", "audio": "cha", "id": 10}, {"text": "doa", "audio": "doa", "id": 11},
  {"text": "ana", "audio": "ana", "id": 12}, {"text": "ona", "audio": "ona", "id": 13}, {"text": "ama", "audio": "ama", "id": 14},
  {"text": "leo", "audio": "leo", "id": 15}, {"text": "kwa", "audio": "kwa", "id": 16}, {"text": "wao", "audio": "wao", "id": 17},
  {"text": "cui", "audio": "cui", "id": 18}, {"text": "jua", "audio": "jua", "id": 19}, {"text": "nne", "audio": "nne", "id": 20},
  {"text": "ile", "audio": "ile", "id": 21}, {"text": "uso", "audio": "uso", "id": 22}, {"text": "hii", "audio": "hii", "id": 23},
  {"text": "mto", "audio": "mto", "id": 24}, {"text": "mji", "audio": "mji", "id": 25}, {"text": "mti", "audio": "mti", "id": 26},
  {"text": "kuu", "audio": "kuu", "id": 27}, {"text": "juu", "audio": "juu", "id": 28}, {"text": "yao", "audio": "yao", "id": 29},
  {"text": "aya", "audio": "aya", "id": 30}, {"text": "ina", "audio": "ina", "id": 31}, {"text": "huu", "audio": "huu", "id": 32},
  {"text": "nje", "audio": "nje", "id": 33}, {"text": "pia", "audio": "pia", "id": 34}, {"text": "ili", "audio": "ili", "id": 35},
  {"text": "saa", "audio": "saa", "id": 36}, {"text": "mia", "audio": "mia", "id": 37}, {"text": "vya", "audio": "vya", "id": 38},
  {"text": "pua", "audio": "pua", "id": 39}, {"text": "bara", "audio": "bara", "id": 40}, {"text": "wake", "audio": "wake", "id": 41},
  {"text": "pili", "audio": "pili", "id": 42}, {"text": "tele", "audio": "tele", "id": 43}, {"text": "teua", "audio": "teua", "id": 44},
  {"text": "gani", "audio": "gani", "id": 45}, {"text": "mali", "audio": "mali", "id": 46}, {"text": "safu", "audio": "safu", "id": 47},
  {"text": "tisa", "audio": "tisa", "id": 48}, {"text": "lori", "audio": "lori", "id": 49}, {"text": "cini", "audio": "cini", "id": 50},
  {"text": "wali", "audio": "wali", "id": 51}, {"text": "wazi", "audio": "wazi", "id": 52}, {"text": "dawa", "audio": "dawa", "id": 53},
  {"text": "tano", "audio": "tano", "id": 54}, {"text": "moto", "audio": "moto", "id": 55}, {"text": "joto", "audio": "joto", "id": 56},
  {"text": "bado", "audio": "bado", "id": 57}, {"text": "moyo", "audio": "moyo", "id": 58}, {"text": "bora", "audio": "bora", "id": 59},
  {"text": "meli", "audio": "meli", "id": 60}, {"text": "pana", "audio": "pana", "id": 61}, {"text": "juma", "audio": "juma", "id": 62},
  {"text": "eneo", "audio": "eneo", "id": 63}, {"text": "nusu", "audio": "nusu", "id": 64}, {"text": "mvua", "audio": "mvua", "id": 65}, {"text": "huyu", "audio": "huyu", "id": 66}, {"text": "pale", "audio": "pale", "id": 67}, {"text": "bibi", "audio": "bibi", "id": 68},
  {"text": "tabu", "audio": "tabu", "id": 69}, {"text": "kima", "audio": "kima", "id": 70}, {"text": "kali", "audio": "kali", "id": 71}, {"text": "hoja", "audio": "hoja", "id": 72}, {"text": "jana", "audio": "jana", "id": 73}, {"text": "haki", "audio": "haki", "id": 74}, {"text": "homa", "audio": "homa", "id": 75},
  {"text": "umri", "audio": "umri", "id": 76}, {"text": "fomu", "audio": "fomu", "id": 77}, {"text": "yetu", "audio": "yetu", "id": 78}, {"text": "hivi", "audio": "hivi", "id": 79}, {"text": "zake", "audio": "zake", "id": 80}, {"text": "jina", "audio": "jina", "id": 81},
  {"text": "sana", "audio": "sana", "id": 82}, {"text": "seti", "audio": "seti", "id": 83}, {"text": "tatu", "audio": "tatu", "id": 84}, {"text": "hewa", "audio": "hewa", "id": 85}, {"text": "hana", "audio": "hana", "id": 86}, {"text": "aina", "audio": "aina", "id": 87},
  {"text": "hata", "audio": "hata", "id": 88}, {"text": "nchi", "audio": "nchi", "id": 89}, {"text": "hapa", "audio": "hapa", "id": 90}, {"text": "haja", "audio": "haja", "id": 91}, {"text": "basi", "audio": "basi", "id": 92}, {"text": "wiki", "audio": "wiki", "id": 93},
  {"text": "maua", "audio": "maua", "id": 94}, {"text": "nane", "audio": "nane", "id": 95}, {"text": "nani", "audio": "nani", "id": 96}, {"text": "nguo", "audio": "nguo", "id": 97}, {"text": "mkia", "audio": "mkia", "id": 98}, {"text": "gari", "audio": "gari", "id": 99},
  {"text": "kama", "audio": "kama", "id": 100}, {"text": "hizi", "audio": "hizi", "id": 101}, {"text": "muda", "audio": "muda", "id": 102}, {"text": "naye", "audio": "naye", "id": 103}, {"text": "kuja", "audio": "kuja", "id": 104}, {"text": "watu", "audio": "watu", "id": 105},
  {"text": "sasa", "audio": "sasa", "id": 106}, {"text": "yote", "audio": "yote", "id": 107}, {"text": "njaa", "audio": "njaa", "id": 108}, {"text": "wito", "audio": "wito", "id": 109}, {"text": "saba", "audio": "saba", "id": 110}, {"text": "paka", "audio": "paka", "id": 111}, {"text": "ziwa", "audio": "ziwa", "id": 112},
  {"text": "kesi", "audio": "kesi", "id": 113}, {"text": "hapo", "audio": "hapo", "id": 114}, {"text": "wale", "audio": "wale", "id": 115}, {"text": "wote", "audio": "wote", "id": 116}, {"text": "mara", "audio": "mara", "id": 117}, {"text": "kula", "audio": "kula", "id": 118}, {"text": "wazo", "audio": "wazo", "id": 119}, {"text": "kuni", "audio": "kuni", "id": 120},
  {"text": "baba", "audio": "baba", "id": 121}, {"text": "sisi", "audio": "sisi", "id": 122}, {"text": "tena", "audio": "tena", "id": 123}, {"text": "mama", "audio": "mama", "id": 124}, {"text": "jibu", "audio": "jibu", "id": 125}, {"text": "kati", "audio": "kati", "id": 126}, {"text": "hali", "audio": "hali", "id": 127}, {"text": "kuku", "audio": "kuku", "id": 128},
  {"text": "popo", "audio": "popo", "id": 129}, {"text": "wewe", "audio": "wewe", "id": 130}, {"text": "yeye", "audio": "yeye", "id": 131}, {"text": "lini", "audio": "lini", "id": 132}, {"text": "mimi", "audio": "mimi", "id": 133}, {"text": "yake", "audio": "yake", "id": 134}, {"text": "kuwa", "audio": "kuwa", "id": 135}, {"text": "kila", "audio": "kila", "id": 136}, {"text": "moja", "audio": "moja", "id": 137},
  {"text": "wema", "audio": "wema", "id": 138}, {"text": "zote", "audio": "zote", "id": 139}, {"text": "kuna", "audio": "kuna", "id": 140}, {"text": "neno", "audio": "neno", "id": 141}, {"text": "yako", "audio": "yako", "id": 142},
  {"text": "wafu", "audio": "wafu", "id": 143}, {"text": "dutu", "audio": "dutu", "id": 144}, {"text": "hawa", "audio": "hawa", "id": 145}, {"text": "wala", "audio": "wala", "id": 146}, {"text": "kiti", "audio": "kiti", "id": 147}, {"text": "kadi", "audio": "kadi", "id": 148}, {"text": "lami", "audio": "lami", "id": 149}, {"text": "bata", "audio": "bata", "id": 150}, {"text": "papo", "audio": "papo", "id": 151}, {"text": "soko", "audio": "soko", "id": 152}, {"text": "nene", "audio": "nene", "id": 153}, {"text": "mkuu", "audio": "mkuu", "id": 154}, {"text": "kona", "audio": "kona", "id": 155}, {"text": "nini", "audio": "nini", "id": 156}, {"text": "njia", "audio": "njia", "id": 157}, {"text": "sita", "audio": "sita", "id": 158}, {"text": "meza", "audio": "meza", "id": 159}, {"text": "mpya", "audio": "mpya", "id": 160}, {"text": "kazi", "audio": "kazi", "id": 161}, {"text": "maji", "audio": "maji", "id": 162}, {"text": "vita", "audio": "vita", "id": 163}, {"text": "kumi", "audio": "kumi", "id": 164}, {"text": "dada", "audio": "dada", "id": 165}, {"text": "adui", "audio": "adui", "id": 166}, {"text": "meno", "audio": "meno", "id": 167}, {"text": "sawa", "audio": "sawa", "id": 168}, {"text": "hofu", "audio": "hofu", "id": 169}, {"text": "hasa", "audio": "hasa", "id": 170}, {"text": "tawi", "audio": "tawi", "id": 171}, {"text": "lake", "audio": "lake", "id": 172}, {"text": "yule", "audio": "yule", "id": 173}, {"text": "siku", "audio": "siku", "id": 174}, {"text": "miwa", "audio": "miwa", "id": 175}, {"text": "kwani", "audio": "kwani", "id": 176}, {"text": "wingi", "audio": "wingi", "id": 177}, {"text": "kweli", "audio": "kweli", "id": 178}, {"text": "sababu", "audio": "sababu", "id": 179}, {"text": "madini", "audio": "madini", "id": 180}, {"text": "mawili", "audio": "mawili", "id": 181}, {"text": "ndevu", "audio": "ndevu", "id": 182}, {"text": "kiboko", "audio": "kiboko", "id": 183}, {"text": "katika", "audio": "katika", "id": 184}, {"text": "kwamba", "audio": "kwamba", "id": 185}, {"text": "walimaji", "audio": "walimaji", "id": 186}, {"text": "mayayi", "audio": "mayayi", "id": 187}, {"text": "ilikuwa", "audio": "ilikuwa", "id": 188}, {"text": "kutoka", "audio": "kutoka", "id": 189}, {"text": "nyuta", "audio": "nyuta", "id": 190}, {"text": "alikuwa", "audio": "alikuwa", "id": 191}, {"text": "lakini", "audio": "lakini", "id": 192}, {"text": "baadhi", "audio": "baadhi", "id": 193}, {"text": "kinini", "audio": "kinini", "id": 194}, {"text": "unaweza", "audio": "unaweza", "id": 195}, {"text": "mengine", "audio": "mengine", "id": 196}, {"text": "wazazi", "audio": "wazazi", "id": 197}, {"text": "zainatu", "audio": "zainatu", "id": 198}, {"text": "matumizi", "audio": "matumizi", "id": 199}, {"text": "babake", "audio": "babake", "id": 200}, {"text": "jinsi", "audio": "jinsi", "id": 201}, {"text": "alisema", "audio": "alisema", "id": 202}, {"text": "wawili", "audio": "wawili", "id": 203}, {"text": "ambayo", "audio": "ambayo", "id": 204}, {"text": "kufanya", "audio": "kufanya", "id": 205}, {"text": "mimea", "audio": "mimea", "id": 206}, {"text": "wakati", "audio": "wakati", "id": 207}, {"text": "mapenzi", "audio": "mapenzi", "id": 208}, {"text": "kuhusu", "audio": "kuhusu", "id": 209}, {"text": "wengi", "audio": "wengi", "id": 210}, {"text": "mboga", "audio": "mboga", "id": 211}, {"text": "kisha", "audio": "kisha", "id": 212}, {"text": "kuandika", "audio": "kuandika", "id": 213}, {"text": "ingekuwa", "audio": "ingekuwa", "id": 214}, {"text": "hivyo", "audio": "hivyo", "id": 215}, {"text": "angalia", "audio": "angalia", "id": 216}, {"text": "mbili", "audio": "mbili", "id": 217}, {"text": "kuangalia", "audio": "kuangalia", "id": 218}, {"text": "zaidi", "audio": "zaidi", "id": 219}, {"text": "naweza", "audio": "naweza", "id": 220}, {"text": "kwenda", "audio": "kwenda", "id": 221}, {"text": "alifanya", "audio": "alifanya", "id": 222}, {"text": "idadi", "audio": "idadi", "id": 223}, {"text": "sauti", "audio": "sauti", "id": 224}, {"text": "hakuna", "audio": "hakuna", "id": 225}, {"text": "yangu", "audio": "yangu", "id": 226}, {"text": "kujua", "audio": "kujua", "id": 227}, {"text": "kuliko", "audio": "kuliko", "id": 228}, {"text": "kwanza", "audio": "kwanza", "id": 229}, {"text": "ambao", "audio": "ambao", "id": 230}, {"text": "chini", "audio": "chini", "id": 231}, {"text": "upande", "audio": "upande", "id": 232}, {"text": "vile", "audio": "vile", "id": 233}, {"text": "bila", "audio": "bila", "id": 234}, {"text": "shaka", "audio": "shaka", "id": 235}, {"text": "wamekuwa", "audio": "wamekuwa", "id": 236}, {"text": "kupata", "audio": "kupata", "id": 237}, {"text": "kuchukua", "audio": "kuchukua", "id": 238}, {"text": "mahali", "audio": "mahali", "id": 239}, {"text": "kuishi", "audio": "kuishi", "id": 240}, {"text": "ambapo", "audio": "ambapo", "id": 241}, {"text": "baada", "audio": "baada", "id": 242}, {"text": "nyuma", "audio": "nyuma", "id": 243}, {"text": "kidogo", "audio": "kidogo", "id": 244}, {"text": "mtu", "audio": "mtu", "id": 245}, {"text": "mwaka", "audio": "mwaka", "id": 246}, {"text": "alikuja", "audio": "alikuja", "id": 247}, {"text": "nzuri", "audio": "nzuri", "id": 248}, {"text": "kutoa", "audio": "kutoa", "id": 249}, {"text": "kupitia", "audio": "kupitia", "id": 250}, {"text": "hukumu", "audio": "hukumu", "id": 251}, {"text": "kubwa", "audio": "kubwa", "id": 252}, {"text": "kufikiri", "audio": "kufikiri", "id": 253}, {"text": "kusema", "audio": "kusema", "id": 254}, {"text": "kusaidia", "audio": "kusaidia", "id": 255}, {"text": "asili", "audio": "asili", "id": 256}, {"text": "line", "audio": "line", "id": 257}, {"text": "tofauti", "audio": "tofauti", "id": 258}, {"text": "pande", "audio": "pande", "id": 259}, {"text": "kiasi", "audio": "kiasi", "id": 260}, {"text": "maana", "audio": "maana", "id": 261}, {"text": "kabla", "audio": "kabla", "id": 262}, {"text": "anita", "audio": "anita", "id": 263}, {"text": "mvulana", "audio": "mvulana", "id": 264}, {"text": "kuwaambia", "audio": "kuwaambia", "id": 265}, {"text": "anafanya", "audio": "anafanya", "id": 266}, {"text": "wanataka", "audio": "wanataka", "id": 267}, {"text": "vizuri", "audio": "vizuri", "id": 268}, {"text": "kucheza", "audio": "kucheza", "id": 269}, {"text": "ndogo", "audio": "ndogo", "id": 270}, {"text": "kuweka", "audio": "kuweka", "id": 271}, {"text": "nyumbani", "audio": "nyumbani", "id": 272}, {"text": "kusoma", "audio": "kusoma", "id": 273}, {"text": "mkono", "audio": "mkono", "id": 274}, {"text": "bandari", "audio": "bandari", "id": 275}, {"text": "kuongeza", "audio": "kuongeza", "id": 276}, {"text": "lazima", "audio": "lazima", "id": 277}, {"text": "kufuata", "audio": "kufuata", "id": 278}, {"text": "kitendo", "audio": "kitendo", "id": 279}, {"text": "kuuliza", "audio": "kuuliza", "id": 280}, {"text": "wanaume", "audio": "wanaume", "id": 281}, {"text": "mabadiliko", "audio": "mabadiliko", "id": 282}, {"text": "akaenda", "audio": "akaenda", "id": 283}, {"text": "mwanga", "audio": "mwanga", "id": 284}, {"text": "nyumba", "audio": "nyumba", "id": 285}, {"text": "picha", "audio": "picha", "id": 286}, {"text": "kujaribu", "audio": "kujaribu", "id": 287}, {"text": "wanyama", "audio": "wanyama", "id": 288}, {"text": "hatua", "audio": "hatua", "id": 289}, {"text": "dunia", "audio": "dunia", "id": 290}, {"text": "karibu", "audio": "karibu", "id": 291}, {"text": "kujenga", "audio": "kujenga", "id": 292}, {"text": "binafsi", "audio": "binafsi", "id": 293}, {"text": "kichwa", "audio": "kichwa", "id": 294}, {"text": "kusimama", "audio": "kusimama", "id": 295}, {"text": "mwenyewe", "audio": "mwenyewe", "id": 296}, {"text": "ukurasa", "audio": "ukurasa", "id": 297}, {"text": "kupatikana", "audio": "kupatikana", "id": 298}, {"text": "shule", "audio": "shule", "id": 299}, {"text": "kukua", "audio": "kukua", "id": 300}, {"text": "utafiti", "audio": "utafiti", "id": 301}, {"text": "kujifunza", "audio": "kujifunza", "id": 302}, {"text": "kupanda", "audio": "kupanda", "id": 303}, {"text": "chakula", "audio": "chakula", "id": 304}, {"text": "jicho", "audio": "jicho", "id": 305}, {"text": "kamwe", "audio": "kamwe", "id": 306}, {"text": "mwisho", "audio": "mwisho", "id": 307}, {"text": "walidhani", "audio": "walidhani", "id": 308}, {"text": "kuvuka", "audio": "kuvuka", "id": 309}, {"text": "shamba", "audio": "shamba", "id": 310}, {"text": "ngumu", "audio": "ngumu", "id": 311}, {"text": "kuanza", "audio": "kuanza", "id": 312}, {"text": "nguvu", "audio": "nguvu", "id": 313}, {"text": "hadithi", "audio": "hadithi", "id": 314}, {"text": "msumeno", "audio": "msumeno", "id": 315}, {"text": "mbali", "audio": "mbali", "id": 316}, {"text": "bahari", "audio": "bahari", "id": 317}, {"text": "kuteka", "audio": "kuteka", "id": 318}, {"text": "kushoto", "audio": "kushoto", "id": 319}, {"text": "marehemu", "audio": "marehemu", "id": 320}, {"text": "kukimbia", "audio": "kukimbia", "id": 321}, {"text": "hawana", "audio": "hawana", "id": 322}, {"text": "vyombo", "audio": "vyombo", "id": 323}, {"text": "habari", "audio": "habari", "id": 324}, {"text": "usiku", "audio": "usiku", "id": 325}, {"text": "halisi", "audio": "halisi", "id": 326}, {"text": "maisha", "audio": "maisha", "id": 327}, {"text": "chache", "audio": "chache", "id": 328}, {"text": "kaskazini", "audio": "kaskazini", "id": 329},
  {"text": "kuonekana", "audio": "kuonekana", "id": 330}, {"text": "pamoja", "audio": "pamoja", "id": 331}, {"text": "ijayo", "audio": "ijayo", "id": 332}, {"text": "nyeupe", "audio": "nyeupe", "id": 333}, {"text": "watoto", "audio": "watoto", "id": 334}, {"text": "kutembea", "audio": "kutembea", "id": 335}, {"text": "mfano", "audio": "mfano", "id": 336}, {"text": "kupunguza", "audio": "kupunguza", "id": 337}, {"text": "karatasi", "audio": "karatasi", "id": 338}, {"text": "kundi", "audio": "kundi", "id": 339}, {"text": "daima", "audio": "daima", "id": 340}, {"text": "muziki", "audio": "muziki", "id": 341}, {"text": "alama", "audio": "alama", "id": 342}, {"text": "nyingi", "audio": "nyingi", "id": 343}, {"text": "barua", "audio": "barua", "id": 344}, {"text": "mpaka", "audio": "mpaka", "id": 345}, {"text": "maili", "audio": "maili", "id": 346}, {"text": "miguu", "audio": "miguu", "id": 347}, {"text": "huduma", "audio": "huduma", "id": 348}, {"text": "kitabu", "audio": "kitabu", "id": 349}, {"text": "alichukua", "audio": "alichukua", "id": 350}, {"text": "sayansi", "audio": "sayansi", "id": 351}, {"text": "chumba", "audio": "chumba", "id": 352}, {"text": "rafiki", "audio": "rafiki", "id": 353}, {"text": "alianza", "audio": "alianza", "id": 354}, {"text": "samaki", "audio": "samaki", "id": 355}, {"text": "kuacha", "audio": "kuacha", "id": 356}, {"text": "kusikia", "audio": "kusikia", "id": 357}, {"text": "farasi", "audio": "farasi", "id": 358}, {"text": "kukata", "audio": "kukata", "id": 359}, {"text": "hakika", "audio": "hakika", "id": 360}, {"text": "rangi", "audio": "rangi", "id": 361}, {"text": "kutosha", "audio": "kutosha", "id": 362}, {"text": "msichana", "audio": "msichana", "id": 363}, {"text": "vijana", "audio": "vijana", "id": 364}, {"text": "tayari", "audio": "tayari", "id": 365}, {"text": "milele", "audio": "milele", "id": 366}, {"text": "nyekundu", "audio": "nyekundu", "id": 367}, {"text": "orodha", "audio": "orodha", "id": 368}, {"text": "ingawa", "audio": "ingawa", "id": 369}, {"text": "kujisikia", "audio": "kujisikia", "id": 370}, {"text": "majadiliano", "audio": "majadiliano", "id": 371}, {"text": "ndege", "audio": "ndege", "id": 372}, {"text": "haraka", "audio": "haraka", "id": 373}, {"text": "mwili", "audio": "mwili", "id": 374}, {"text": "mbwa", "audio": "mbwa", "id": 375}, {"text": "familia", "audio": "familia", "id": 376}, {"text": "kuondoka", "audio": "kuondoka", "id": 377}, {"text": "wimbo", "audio": "wimbo", "id": 378}, {"text": "kupima", "audio": "kupima", "id": 379}, {"text": "mlango", "audio": "mlango", "id": 380}, {"text": "bidhaa", "audio": "bidhaa", "id": 381}, {"text": "nyeusi", "audio": "nyeusi", "id": 382}, {"text": "asani", "audio": "asani", "id": 383}, {"text": "darasani", "audio": "darasani", "id": 384}, {"text": "upepo", "audio": "upepo", "id": 385}, {"text": "swali", "audio": "swali", "id": 386}, {"text": "kutokea", "audio": "kutokea", "id": 387}, {"text": "kamili", "audio": "kamili", "id": 388}, {"text": "mwamba", "audio": "mwamba", "id": 389}, {"text": "kusini", "audio": "kusini", "id": 390}, {"text": "tatizo", "audio": "tatizo", "id": 391}, {"text": "kipande", "audio": "kipande", "id": 392}, {"text": "aliiambia", "audio": "aliiambia", "id": 393}, {"text": "alijua", "audio": "alijua", "id": 394}, {"text": "kupita", "audio": "kupita", "id": 395}, {"text": "tangu", "audio": "tangu", "id": 396}, {"text": "nzima", "audio": "nzima", "id": 397}, {"text": "mfalme", "audio": "mfalme", "id": 398}, {"text": "nafasi", "audio": "nafasi", "id": 399}, {"text": "kumbuka", "audio": "kumbuka", "id": 400}, {"text": "mapema", "audio": "mapema", "id": 401}, {"text": "kushikilia", "audio": "kushikilia", "id": 402}, {"text": "magharibi", "audio": "magharibi", "id": 403}, {"text": "ardhi", "audio": "ardhi", "id": 404}, {"text": "maslahi", "audio": "maslahi", "id": 405}, {"text": "kufikia", "audio": "kufikia", "id": 406}, {"text": "kuimba", "audio": "kuimba", "id": 407}, {"text": "kusikiliza", "audio": "kusikiliza", "id": 408}, {"text": "kusafiri", "audio": "kusafiri", "id": 409}, {"text": "asubui", "audio": "asubui", "id": 410}, {"text": "rahisi", "audio": "rahisi", "id": 411}, {"text": "kadhaa", "audio": "kadhaa", "id": 412}, {"text": "kuelekea", "audio": "kuelekea", "id": 413}, {"text": "dhidi", "audio": "dhidi", "id": 414}, {"text": "polepole", "audio": "polepole", "id": 415}, {"text": "upendo", "audio": "upendo", "id": 416}, {"text": "fedha", "audio": "fedha", "id": 417}, {"text": "kuwatumikia", "audio": "kuwatumikia", "id": 418}, {"text": "itaonekana", "audio": "itaonekana", "id": 419}, {"text": "barabara", "audio": "barabara", "id": 420}, {"text": "ramani", "audio": "ramani", "id": 421}, {"text": "utawala", "audio": "utawala", "id": 422}, {"text": "zinazoongoza", "audio": "zinazoongoza", "id": 423}, {"text": "kuvuta", "audio": "kuvuta", "id": 424}, {"text": "baridi", "audio": "baridi", "id": 425}, {"text": "ilani", "audio": "ilani", "id": 426}, {"text": "kitengo", "audio": "kitengo", "id": 427}, {"text": "faini", "audio": "faini", "id": 428}, {"text": "kuruka", "audio": "kuruka", "id": 429}, {"text": "kuanguka", "audio": "kuanguka", "id": 430}, {"text": "kusababisha", "audio": "kusababisha", "id": 431}, {"text": "kilio", "audio": "kilio", "id": 432}, {"text": "giza", "audio": "giza", "id": 433}, {"text": "mashine", "audio": "mashine", "id": 434}, {"text": "kusubiri", "audio": "kusubiri", "id": 435}, {"text": "mpango", "audio": "mpango", "id": 436}, {"text": "takwimu", "audio": "takwimu", "id": 437}, {"text": "nyota", "audio": "nyota", "id": 438}, {"text": "nyoka", "audio": "nyoka", "id": 439}, {"text": "sanduku", "audio": "sanduku", "id": 440}, {"text": "uwanja", "audio": "uwanja", "id": 441}, {"text": "wengine", "audio": "wengine", "id": 442}, {"text": "sahihi", "audio": "sahihi", "id": 443}, {"text": "uwezo", "audio": "uwezo", "id": 444}, {"text": "uzuri", "audio": "uzuri", "id": 445}, {"text": "alisimama", "audio": "alisimama", "id": 446}, {"text": "vyenye", "audio": "vyenye", "id": 447}, {"text": "mbele", "audio": "mbele", "id": 448}, {"text": "kufundisha", "audio": "kufundisha", "id": 449}, {"text": "alitoa", "audio": "alitoa", "id": 450}, {"text": "kijani", "audio": "kijani", "id": 451}, {"text": "kuendeleza", "audio": "kuendeleza", "id": 452}, {"text": "bure", "audio": "bure", "id": 453}, {"text": "dakika", "audio": "dakika", "id": 454}, {"text": "maalum", "audio": "maalum", "id": 455},
  {"text": "akili", "audio": "akili", "id": 456}, {"text": "kuzalisha", "audio": "kuzalisha", "id": 457}, {"text": "ukweli", "audio": "ukweli", "id": 458}, {"text": "mitaani", "audio": "mitaani", "id": 459}, {"text": "kuzidisha", "audio": "kuzidisha", "id": 460},
  {"text": "kitu", "audio": "kitu", "id": 461}, {"text": "kukaa", "audio": "kukaa", "id": 462}, {"text": "gurudumu", "audio": "gurudumu", "id": 463}, {"text": "bluu", "audio": "bluu", "id": 464}, {"text": "kuamua", "audio": "kuamua", "id": 465}, {"text": "kina", "audio": "kina", "id": 466},
  {"text": "kisiwa", "audio": "kisiwa", "id": 467}, {"text": "mguu", "audio": "mguu", "id": 468}, {"text": "mfumo", "audio": "mfumo", "id": 469}, {"text": "mtihani", "audio": "mtihani", "id": 470}, {"text": "rekodi", "audio": "rekodi", "id": 471}, {"text": "mashua", "audio": "mashua", "id": 472}, {"text": "kawaida", "audio": "kawaida", "id": 473}, {"text": "dhahabu", "audio": "dhahabu", "id": 474}, {"text": "inawezekana", "audio": "inawezekana", "id": 475}, {"text": "badala", "audio": "badala", "id": 476}, {"text": "kavu", "audio": "kavu", "id": 477}, {"text": "ajabu", "audio": "ajabu", "id": 478}, {"text": "elfu", "audio": "elfu", "id": 479}, {"text": "iliyopita", "audio": "iliyopita", "id": 480}, {"text": "mbio", "audio": "mbio", "id": 481}, {"text": "mchezo", "audio": "mchezo", "id": 482}, {"text": "sura", "audio": "sura", "id": 483}, {"text": "equate", "audio": "equate", "id": 484}, {"text": "jimbo", "audio": "jimbo", "id": 485}, {"text": "kuletwa", "audio": "kuletwa", "id": 486}, {"text": "theluji", "audio": "theluji", "id": 487}, {"text": "tairi", "audio": "tairi", "id": 488}, {"text": "kuleta", "audio": "kuleta", "id": 489}, {"text": "ndiyo", "audio": "ndiyo", "id": 490}, {"text": "twiga", "audio": "twiga", "id": 491}, {"text": "kujaza", "audio": "kujaza", "id": 492}, {"text": "mashariki", "audio": "mashariki", "id": 493}, {"text": "lugha", "audio": "lugha", "id": 494}, {"text": "miongoni", "audio": "miongoni", "id": 495}, {"text": "mpira", "audio": "mpira", "id": 496}, {"text": "wimbi", "audio": "wimbi", "id": 497}, {"text": "kushuka", "audio": "kushuka", "id": 498}, {"text": "nzito", "audio": "nzito", "id": 499}, {"text": "ngoma", "audio": "ngoma", "id": 500}, {"text": "injini", "audio": "injini", "id": 501}, {"text": "vifaa", "audio": "vifaa", "id": 502}, {"text": "ukubwa", "audio": "ukubwa", "id": 503}, {"text": "kutofautiana", "audio": "kutofautiana", "id": 504}, {"text": "kutulia", "audio": "kutulia", "id": 505}, {"text": "uzito", "audio": "uzito", "id": 506}, {"text": "ujumla", "audio": "ujumla", "id": 507}, {"text": "barafu", "audio": "barafu", "id": 508}, {"text": "jambo", "audio": "jambo", "id": 509}, {"text": "mduara", "audio": "mduara", "id": 510}, {"text": "jozi", "audio": "jozi", "id": 511}, {"text": "silabi", "audio": "silabi", "id": 512}, {"text": "waliona", "audio": "waliona", "id": 513}, {"text": "labda", "audio": "labda", "id": 514}, {"text": "ghafla", "audio": "ghafla", "id": 515}, {"text": "kuhesabu", "audio": "kuhesabu", "id": 516}, {"text": "mraba", "audio": "mraba", "id": 517}, {"text": "urefu", "audio": "urefu", "id": 518}, {"text": "kuwakilisha", "audio": "kuwakilisha", "id": 519}, {"text": "sanaa", "audio": "sanaa", "id": 520}, {"text": "somo", "audio": "somo", "id": 521}, {"text": "mkoa", "audio": "mkoa", "id": 522}, {"text": "nishati", "audio": "nishati", "id": 523}, {"text": "kuwinda", "audio": "kuwinda", "id": 524}, {"text": "kinachowezekana", "audio": "kinachowezekana", "id": 525}, {"text": "kitanda", "audio": "kitanda", "id": 526}, {"text": "kaka", "audio": "kaka", "id": 527}, {"text": "yai", "audio": "yai", "id": 528}, {"text": "safari", "audio": "safari", "id": 529}, {"text": "kiini", "audio": "kiini", "id": 530}, {"text": "kiisha", "audio": "kiisha", "id": 531}, {"text": "kuamini", "audio": "kuamini", "id": 532}, {"text": "sehemu", "audio": "sehemu", "id": 533}, {"text": "msitu", "audio": "msitu", "id": 534}, {"text": "dirisha", "audio": "dirisha", "id": 535}, {"text": "duka", "audio": "duka", "id": 536}, {"text": "majira", "audio": "majira", "id": 537}, {"text": "treni", "audio": "treni", "id": 538}, {"text": "usingizi", "audio": "usingizi", "id": 539}, {"text": "kuthibitisha", "audio": "kuthibitisha", "id": 540}, {"text": "zoezi", "audio": "zoezi", "id": 541}, {"text": "ukuta", "audio": "ukuta", "id": 542}, {"text": "mlima", "audio": "mlima", "id": 543}, {"text": "unataka", "audio": "unataka", "id": 544}, {"text": "anga", "audio": "anga", "id": 545}, {"text": "bodi", "audio": "bodi", "id": 546}, {"text": "furaha", "audio": "furaha", "id": 547}, {"text": "ameketi", "audio": "ameketi", "id": 548}, {"text": "imeandikwa", "audio": "imeandikwa", "id": 549}, {"text": "porini", "audio": "porini", "id": 550}, {"text": "chombo", "audio": "chombo", "id": 551}, {"text": "agizo", "audio": "agizo", "id": 552}, {"text": "kioo", "audio": "kioo", "id": 553}, {"text": "nyasi", "audio": "nyasi", "id": 554}, {"text": "makali", "audio": "makali", "id": 555}, {"text": "ishara", "audio": "ishara", "id": 556}, {"text": "ziara", "audio": "ziara", "id": 557}, {"text": "laini", "audio": "laini", "id": 558}, {"text": "mkali", "audio": "mkali", "id": 559}, {"text": "gesi", "audio": "gesi", "id": 560}, {"text": "mwezi", "audio": "mwezi", "id": 561}, {"text": "milioni", "audio": "milioni", "id": 562}, {"text": "kubeba", "audio": "kubeba", "id": 563}, {"text": "kumaliza", "audio": "kumaliza", "id": 564}, {"text": "matumaini", "audio": "matumaini", "id": 565}, {"text": "gone", "audio": "gone", "id": 566}, {"text": "mtoto", "audio": "mtoto", "id": 567}, {"text": "kijiji", "audio": "kijiji", "id": 568}, {"text": "kukutana", "audio": "kukutana", "id": 569}, {"text": "mizizi", "audio": "mizizi", "id": 570}, {"text": "kununua", "audio": "kununua", "id": 571}, {"text": "kutatua", "audio": "kutatua", "id": 572}, {"text": "iwapo", "audio": "iwapo", "id": 573}, {"text": "kushinikiza", "audio": "kushinikiza", "id": 574}, {"text": "ataona", "audio": "ataona", "id": 575}, {"text": "uliofanyika", "audio": "uliofanyika", "id": 576}, {"text": "nywele", "audio": "nywele", "id": 577}, {"text": "kuelezea", "audio": "kuelezea", "id": 578}, {"text": "mpishi", "audio": "mpishi", "id": 579}, {"text": "sakafu", "audio": "sakafu", "id": 580}, {"text": "matokeo", "audio": "matokeo", "id": 581}, {"text": "kuchoma", "audio": "kuchoma", "id": 582}, {"text": "kilima", "audio": "kilima", "id": 583}, {"text": "salama", "audio": "salama", "id": 584}, {"text": "karne", "audio": "karne", "id": 585}, {"text": "kufikiria", "audio": "kufikiria", "id": 586}, {"text": "sheria", "audio": "sheria", "id": 587}, {"text": "pwani", "audio": "pwani", "id": 588}, {"text": "nakala", "audio": "nakala", "id": 589}, {"text": "maneno", "audio": "maneno", "id": 590}, {"text": "kimya", "audio": "kimya", "id": 591}, {"text": "mchanga", "audio": "mchanga", "id": 592}, {"text": "udongo", "audio": "udongo", "id": 593}, {"text": "kidole", "audio": "kidole", "id": 594}, {"text": "sekta", "audio": "sekta", "id": 595}, {"text": "uvuvi", "audio": "uvuvi", "id": 596}, {"text": "thamani", "audio": "thamani", "id": 597}, {"text": "mapambano", "audio": "mapambano", "id": 598}, {"text": "mane", "audio": "mane", "id": 599}, {"text": "uongo", "audio": "uongo", "id": 600}, {"text": "kuwapiga", "audio": "kuwapiga", "id": 601}, {"text": "mtazamo", "audio": "mtazamo", "id": 602}, {"text": "sikio", "audio": "sikio", "id": 603}, {"text": "kingine", "audio": "kingine", "id": 604}, {"text": "kabisa", "audio": "kabisa", "id": 605}, {"text": "kuvunja", "audio": "kuvunja", "id": 606}, {"text": "katikati", "audio": "katikati", "id": 607}, {"text": "kuua", "audio": "kuua", "id": 608}, {"text": "mwana", "audio": "mwana", "id": 609}, {"text": "wadogo", "audio": "wadogo", "id": 610}, {"text": "kuchunguza", "audio": "kuchunguza", "id": 611}, {"text": "taifa", "audio": "taifa", "id": 612}, {"text": "kamusi", "audio": "kamusi", "id": 613}, {"text": "maziwa", "audio": "maziwa", "id": 614}, {"text": "kasi", "audio": "kasi", "id": 615}, {"text": "kiungo", "audio": "kiungo", "id": 616}, {"text": "kulipa", "audio": "kulipa", "id": 617}, {"text": "kifungu", "audio": "kifungu", "id": 618}, {"text": "mavazi", "audio": "mavazi", "id": 619}, {"text": "wingu", "audio": "wingu", "id": 620}, {"text": "mshangao", "audio": "mshangao", "id": 621}, {"text": "utulivu", "audio": "utulivu", "id": 622}, {"text": "jiwe", "audio": "jiwe", "id": 623}, {"text": "vidogo", "audio": "vidogo", "id": 624}, {"text": "kubuni", "audio": "kubuni", "id": 625}, {"text": "maskini", "audio": "maskini", "id": 626}, {"text": "mengi", "audio": "mengi", "id": 627}, {"text": "majaribio", "audio": "majaribio", "id": 628}, {"text": "ufunguo", "audio": "ufunguo", "id": 629}, {"text": "chuma", "audio": "chuma", "id": 630}, {"text": "fimbo", "audio": "fimbo", "id": 631}, {"text": "gorofa", "audio": "gorofa", "id": 632}, {"text": "ishirini", "audio": "ishirini", "id": 633}, {"text": "ngozi", "audio": "ngozi", "id": 634}, {"text": "tabasamu", "audio": "tabasamu", "id": 635}, {"text": "shimo", "audio": "shimo", "id": 636}, {"text": "biashara", "audio": "biashara", "id": 637}, {"text": "safari", "audio": "safari", "id": 638}, {"text": "ofisi", "audio": "ofisi", "id": 639}, {"text": "kupokea", "audio": "kupokea", "id": 640}, {"text": "mstari", "audio": "mstari", "id": 641}, {"text": "kinywa", "audio": "kinywa", "id": 642}, {"text": "ishara", "audio": "ishara", "id": 643}, {"text": "mchana", "audio": "mchana", "id": 644}, {"text": "kufa", "audio": "kufa", "id": 645}, {"text": "angalau", "audio": "angalau", "id": 646}, {"text": "shida", "audio": "shida", "id": 647}, {"text": "kelele", "audio": "kelele", "id": 648}, {"text": "isipokuwa", "audio": "isipokuwa", "id": 649}, {"text": "aliandika", "audio": "aliandika", "id": 650},
  {"text": "mbegu", "audio": "mbegu", "id": 651}, {"text": "kujiunga", "audio": "kujiunga", "id": 652}, {"text": "kupendekeza", "audio": "kupendekeza", "id": 653}, {"text": "safi", "audio": "safi", "id": 654}, {"text": "mapumziko", "audio": "mapumziko", "id": 655}, {"text": "yadi", "audio": "yadi", "id": 656}, {"text": "mbaya", "audio": "mbaya", "id": 657}, {"text": "mafuta", "audio": "mafuta", "id": 658}, {"text": "pigo", "audio": "pigo", "id": 659}, {"text": "damu", "audio": "damu", "id": 660}, {"text": "timu", "audio": "timu", "id": 661}, {"text": "waya", "audio": "waya", "id": 662}, {"text": "kugusa", "audio": "kugusa", "id": 663}, {"text": "ilikua", "audio": "ilikua", "id": 664}, {"text": "kuchanganya", "audio": "kuchanganya", "id": 665}, {"text": "gharama", "audio": "gharama", "id": 666}, {"text": "waliopotea", "audio": "waliopotea", "id": 667}, {"text": "kuvaa", "audio": "kuvaa", "id": 668}, {"text": "bustani", "audio": "bustani", "id": 669}, {"text": "alimtuma", "audio": "alimtuma", "id": 670}, {"text": "kuchagua", "audio": "kuchagua", "id": 671}, {"text": "akaanguka", "audio": "akaanguka", "id": 672}, {"text": "benki", "audio": "benki", "id": 673}, {"text": "kuokoa", "audio": "kuokoa", "id": 674}, {"text": "kudhibiti", "audio": "kudhibiti", "id": 675}, {"text": "mpole", "audio": "mpole", "id": 676}, {"text": "mwanamke", "audio": "mwanamke", "id": 677}, {"text": "nahodha", "audio": "nahodha", "id": 678}, {"text": "mazoezi", "audio": "mazoezi", "id": 679}, {"text": "daktari", "audio": "daktari", "id": 680}, {"text": "tafadhali", "audio": "tafadhali", "id": 681}, {"text": "kulinda", "audio": "kulinda", "id": 682}, {"text": "mbao", "audio": "mbao", "id": 683}, {"text": "machapisho", "audio": "machapisho", "id": 684}, {"text": "pete", "audio": "pete", "id": 685}, {"text": "tabia", "audio": "tabia", "id": 686}, {"text": "hawezi", "audio": "hawezi", "id": 687}, {"text": "wadudu", "audio": "wadudu", "id": 688}, {"text": "hawakupata", "audio": "hawakupata", "id": 689}, {"text": "kipindi", "audio": "kipindi", "id": 690}, {"text": "zinaonyesha", "audio": "zinaonyesha", "id": 691}, {"text": "alizungumza", "audio": "alizungumza", "id": 692}, {"text": "chembe", "audio": "chembe", "id": 693}, {"text": "binadamu", "audio": "binadamu", "id": 694}, {"text": "historia", "audio": "historia", "id": 695}, {"text": "athari", "audio": "athari", "id": 696}, {"text": "umeme", "audio": "umeme", "id": 697}, {"text": "kutarajia", "audio": "kutarajia", "id": 698}, {"text": "mazao", "audio": "mazao", "id": 699}, {"text": "kisasa", "audio": "kisasa", "id": 700}, {"text": "kipengele", "audio": "kipengele", "id": 701}, {"text": "kugonga", "audio": "kugonga", "id": 702}, {"text": "mwanafunzi", "audio": "mwanafunzi", "id": 703}, {"text": "chama", "audio": "chama", "id": 704}, {"text": "usambazaji", "audio": "usambazaji", "id": 705}, {"text": "mfupa", "audio": "mfupa", "id": 706}, {"text": "reli", "audio": "reli", "id": 707}, {"text": "kukubaliana", "audio": "kukubaliana", "id": 708}, {"text": "hatari", "audio": "hatari", "id": 709}, {"text": "matunda", "audio": "matunda", "id": 710}, {"text": "tajiri", "audio": "tajiri", "id": 711}, {"text": "askari", "audio": "askari", "id": 712}, {"text": "mchakato", "audio": "mchakato", "id": 713}, {"text": "nadhani", "audio": "nadhani", "id": 714}, {"text": "muhimu", "audio": "muhimu", "id": 715}, {"text": "mrengo", "audio": "mrengo", "id": 716}, {"text": "jirani", "audio": "jirani", "id": 717}, {"text": "safisha", "audio": "safisha", "id": 718}, {"text": "umati", "audio": "umati", "id": 719}, {"text": "jembe", "audio": "jembe", "id": 720}, {"text": "mahindi", "audio": "mahindi", "id": 721}, {"text": "kulinganisha", "audio": "kulinganisha", "id": 722}, {"text": "shairi", "audio": "shairi", "id": 723}, {"text": "kamba", "audio": "kamba", "id": 724}, {"text": "kengele", "audio": "kengele", "id": 725}, {"text": "wanategemea", "audio": "wanategemea", "id": 726}, {"text": "nyama", "audio": "nyama", "id": 727}, {"text": "maarufu", "audio": "maarufu", "id": 728}, {"text": "dola", "audio": "dola", "id": 729}, {"text": "mkondo", "audio": "mkondo", "id": 730}, {"text": "nyembamba", "audio": "nyembamba", "id": 731}, {"text": "pembetatu", "audio": "pembetatu", "id": 732}, {"text": "sayari", "audio": "sayari", "id": 733}, {"text": "koloni", "audio": "koloni", "id": 734}, {"text": "sungura", "audio": "sungura", "id": 735}, {"text": "sokoni", "audio": "sokoni", "id": 736}, {"text": "kutuma", "audio": "kutuma", "id": 737}, {"text": "njano", "audio": "njano", "id": 738}, {"text": "kuruhusu", "audio": "kuruhusu", "id": 739}, {"text": "magazeti", "audio": "magazeti", "id": 740}, {"text": "jangwa", "audio": "jangwa", "id": 741}, {"text": "suti", "audio": "suti", "id": 742}, {"text": "kuinua", "audio": "kuinua", "id": 743}, {"text": "kufufuka", "audio": "kufufuka", "id": 744}, {"text": "kuendelea", "audio": "kuendelea", "id": 745}, {"text": "kuzuia", "audio": "kuzuia", "id": 746}, {"text": "chati", "audio": "chati", "id": 747}, {"text": "kofia", "audio": "kofia", "id": 748}, {"text": "kuuza", "audio": "kuuza", "id": 749}, {"text": "mafanikio", "audio": "mafanikio", "id": 750}, {"text": "kampuni", "audio": "kampuni", "id": 751}, {"text": "ondoa", "audio": "ondoa", "id": 752}, {"text": "tukio", "audio": "tukio", "id": 753}, {"text": "kuogelea", "audio": "kuogelea", "id": 754}, {"text": "mrefu", "audio": "mrefu", "id": 755}, {"text": "kinyume", "audio": "kinyume", "id": 756}, {"text": "mke", "audio": "mke", "id": 757}, {"text": "kiatu", "audio": "kiatu", "id": 758}, {"text": "bega", "audio": "bega", "id": 759}, {"text": "kuenea", "audio": "kuenea", "id": 760}, {"text": "kupanga", "audio": "kupanga", "id": 761}, {"text": "kambi", "audio": "kambi", "id": 762}, {"text": "mzulia", "audio": "mzulia", "id": 763}, {"text": "pamba", "audio": "pamba", "id": 764}, {"text": "aliyezaliwa", "audio": "aliyezaliwa", "id": 765}, {"text": "kiwango", "audio": "kiwango", "id": 766}, {"text": "kukusanya", "audio": "kukusanya", "id": 767}, {"text": "kunyoosha", "audio": "kunyoosha", "id": 768}, {"text": "kutupa", "audio": "kutupa", "id": 769}, {"text": "uangaze", "audio": "uangaze", "id": 770}, {"text": "molekuli", "audio": "molekuli", "id": 771}, {"text": "vibaya", "audio": "vibaya", "id": 772}, {"text": "kurudia", "audio": "kurudia", "id": 773}, {"text": "zinahitaji", "audio": "zinahitaji", "id": 774}, {"text": "kuandaa", "audio": "kuandaa", "id": 775}, {"text": "chumvi", "audio": "chumvi", "id": 776}, {"text": "hasira", "audio": "hasira", "id": 777}, {"text": "madai", "audio": "madai", "id": 778}, {"text": "oksijeni", "audio": "oksijeni", "id": 779}, {"text": "sukari", "audio": "sukari", "id": 780}, {"text": "kifo", "audio": "kifo", "id": 781}, {"text": "ujuzi", "audio": "ujuzi", "id": 782}, {"text": "wanawake", "audio": "wanawake", "id": 783}, {"text": "msimu", "audio": "msimu", "id": 784}, {"text": "ufumbuzi", "audio": "ufumbuzi", "id": 785}, {"text": "sumaku", "audio": "sumaku", "id": 786}, {"text": "kuwashukuru", "audio": "kuwashukuru", "id": 787}, {"text": "mechi", "audio": "mechi", "id": 788}, {"text": "mitini", "audio": "mitini", "id": 789}, {"text": "mkubwa", "audio": "mkubwa", "id": 790}, {"text": "kujadili", "audio": "kujadili", "id": 791}, {"text": "kuongoza", "audio": "kuongoza", "id": 792}, {"text": "uzoefu", "audio": "uzoefu", "id": 793}, {"text": "kununuliwa", "audio": "kununuliwa", "id": 794}, {"text": "aliongoza", "audio": "aliongoza", "id": 795}, {"text": "kanzu", "audio": "kanzu", "id": 796}, {"text": "kuingizwa", "audio": "kuingizwa", "id": 797}, {"text": "kushinda", "audio": "kushinda", "id": 798}, {"text": "ndoto", "audio": "ndoto", "id": 799}, {"text": "muwa", "audio": "muwa", "id": 800}, {"text": "jioni", "audio": "jioni", "id": 801}, {"text": "kulisha", "audio": "kulisha", "id": 802}, {"text": "jumla", "audio": "jumla", "id": 803}, {"text": "msingi", "audio": "msingi", "id": 804},
  {"text": "harufu", "audio": "harufu", "id": 805}, {"text": "bonde", "audio": "bonde", "id": 806}, {"text": "kuwasili", "audio": "kuwasili", "id": 807}, {"text": "bwana", "audio": "bwana", "id": 808}, {"text": "kufuatilia", "audio": "kufuatilia", "id": 809}, {"text": "mzazi", "audio": "mzazi", "id": 810}, {"text": "mgini", "audio": "mgini", "id": 811}, {"text": "mgawanyiko", "audio": "mgawanyiko", "id": 812}, {"text": "neema", "audio": "neema", "id": 813}, {"text": "randa", "audio": "randa", "id": 814}, {"text": "kuungana", "audio": "kuungana", "id": 815}, {"text": "kutumia", "audio": "kutumia", "id": 816}, {"text": "awali", "audio": "awali", "id": 817}, {"text": "kushiriki", "audio": "kushiriki", "id": 818}, {"text": "kituo", "audio": "kituo", "id": 819}, {"text": "mkate", "audio": "mkate", "id": 820}, {"text": "malipo", "audio": "malipo", "id": 821}, {"text": "alipofika", "audio": "alipofika", "id": 822}, {"text": "mtumwa", "audio": "mtumwa", "id": 823}, {"text": "shahada", "audio": "shahada", "id": 824}, {"text": "kifaranga", "audio": "kifaranga", "id": 825}, {"text": "wapenzi", "audio": "wapenzi", "id": 826}, {"text": "kujibu", "audio": "kujibu", "id": 827}, {"text": "kunywa", "audio": "kunywa", "id": 828}, {"text": "msaada", "audio": "msaada", "id": 829}, {"text": "hotuba", "audio": "hotuba", "id": 830}, {"text": "mvuke", "audio": "mvuke", "id": 831}, {"text": "mwendo", "audio": "mwendo", "id": 832}, {"text": "kioevu", "audio": "kioevu", "id": 833}, {"text": "kuingia", "audio": "kuingia", "id": 834}, {"text": "ganda", "audio": "ganda", "id": 835}, {"text": "shingo", "audio": "shingo", "id": 836}])
