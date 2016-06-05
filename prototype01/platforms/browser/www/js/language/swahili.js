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
  {id:"goodbye", text:"kwaheri", audio:"kwaheri"}
];

var numbers = [
  {id:"0", audio:"0_sifuri", text:"sifuri", seq:[]},
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
  {id:"20", audio:"ishirini", text:"ishirini", seq:[]},
  {id:"30", audio:"thelathini", text:"thelathini", seq:[]}, // some places sound: 'selasini'
  {id:"40", audio:"arobaini", text:"arobaini", seq:[]},
  {id:"50", audio:"hamsini", text:"hamsini", seq:[]},
  {id:"60", audio:"sitini", text:"sitini", seq:[]},
  {id:"70", audio:"sabini", text:"sabini", seq:[]},
  {id:"80", audio:"themanini", text:"themanini", seq:[]},
  {id:"90", audio:"tisini", text:"tisini", seq:[]},
  {id:"100", audio:"mia", text:"mia", seq:[]}, // 500 - mia tano
  {id:"1000", audio:"elfu", text:"elfu", seq:[]}
  ];

//generate_number_name(45)
// 300,000 - laki tatu (laki = 100,000)
// 201 - mia mbili na moja
// 1,000,000 milloni moja

// words for each letter and syllable: https://www.youtube.com/watch?v=IUjpXWPaWE0
  /*
  {id:"", text:"", audio:"", seq:[]},
  {id:"", text:"", audio:"", seq:[]},
  {id:"", text:"", audio:"", seq:[]},
  {id:"", text:"", audio:"", seq:[]}
  */

// for each consonant could record each vowel sound (ba be bi bo bu), or just do alphabet...
var letters = [
  {id:1, text:"A", audio:"ah", seq:[]},
  {id:2, text:"B", audio:"be", seq:[]},
  {id:3, text:"Ch", audio:"che", seq:[]},
  {id:4, text:"D", audio:"de", seq:[]},
  {id:5, text:"E", audio:"eh", seq:[]},
  {id:6, text:"F", audio:"ef", seq:[]},
  {id:7, text:"G", audio:"ge", seq:[]},
  {id:8, text:"H", audio:"he", seq:[]},
  {id:9, text:"I", audio:"i", seq:[]},
  {id:10, text:"J", audio:"je", seq:[]},
  {id:11, text:"K", audio:"ka", seq:[]},
  {id:12, text:"L", audio:"le", seq:[]},
  {id:13, text:"M", audio:"em", seq:[]}, // ToDo: is it 'me'? ('may')
  {id:14, text:"N", audio:"en", seq:[]},
  {id:15, text:"O", audio:"o", seq:[]},
  {id:16, text:"P", audio:"pe", seq:[]},
  {id:18, text:"R", audio:"re", seq:[]},
  {id:19, text:"S", audio:"se", seq:[]},
  {id:20, text:"T", audio:"te", seq:[]},
  {id:21, text:"U", audio:"u", seq:[]},
  {id:22, text:"V", audio:"ve", seq:[]},
  {id:23, text:"W", audio:"we", seq:[]},
  {id:25, text:"Y", audio:"ye", seq:[]}, // missing this one..
  {id:26, text:"Z", audio:"ze", seq:[]}
  ];

// not sure we even need to do these
var phonemes = [
  {id:"a"},
  {id:"e"},
  {id:"i"},
  {id:"o"},
  {id:"u"},
  {id:"ma"},
  {id:"me"},
  {id:"mi"},
  {id:"mo"},
  {id:"mu"},
  {id:"pa"},
  {id:"pe"},
  {id:"pi"},
  {id:"po"},
  {id:"pu"}
  ];

var shapes = [
  {id:"star", text:"nyota", image:"star", audio:"nyota"},
  {id:"semicircle", text:"nusuduara", image:"semicircle", audio:"nusuduara"},
  {id:"circle", text:"duara", image:"circle", audio:"duara"},
  {id:"triangle", text:"pembetatu", image:"triangle", audio:"pembetatu"},
  {id:"square", text:"mraba", image:"square", audio:"mraba"},
  {id:"rectangle", text:"mstatili", image:"rectangle", audio:"mstatili"},
  {id:"pentagon", text:"pembetano", image:"pentagon", audio:"pembetano"},
  {id:"hexagon", text:"pembesita", image:"hexagon", audio:"pembesita"},
  {id:"octagon", text:"pembenane", image:"octagon", audio:"pembenane"}
  ];

// need to record: tembo (elephant)
var animals = [
  {id:"octopus", text:"pwesa", audio:"pwesa", image:"octopus"},
  {id:"shark", text:"papa", audio:"papa", image:"shark"},
  {id:"anchovy", text:"kombo", audio:"kombo"},
  {id:"squid", text:"mzia", audio:"mzia"},
  {id:"fish", text:"samaki", audio:"samaki", image:"fish"},
  {id:"elephant", text:"tembo", audio:"tembo", image:"elephant"},
  {id:"baboon", text:"nyani", audio:"nyani"},
  {id:"cheetah", text:"duma", audio:"duma", image:"cheetah"},
  {id:"buffalo", text:"nyati", audio:"nyati", image:"buffalo"},
  {id:"bird", text:"ndege", audio:"ndege", image:"bird"},
  {id:"cat", text:"paka", audio:"paka", image:"cat"},
  {id:"dog", text:"mbwa", audio:"mbwa", image:"dog"},
  {id:"monkey", text:"kima", audio:"kima", image:"monkey"},
  {id:"rhinoceros", text:"kifaru", audio:"kifaru", image:"rhinoceros"},
  {id:"sheep", text:"kondoo", audio:"kondoo", image:"sheep"},
  {id:"zebra", text:"punda-milia", audio:"punda-milia", image:"zebra"},
  {id:"snake", text:"nyoka", audio:"nyoka", image:"snake"},
  {id:"pig", text:"nguruwe", audio:"nguruwe", image:"pig"},
  {id:"ostrich", text:"mbuni", audio:"mbuni", image:"ostrich"},
  {id:"lion", text:"simba", audio:"simba", image:"lion"},
  {id:"hippopotamus", text:"kiboko", audio:"kiboko", image:"hippo"},
  {id:"leopard", text:"chui", audio:"chui", image:"leopard"},
  {id:"goat", text:"mbuzi", audio:"mbuzi", image:"goat"},
  {id:"deer", text:"paa", audio:"paa", image:"deer"},
  {id:"cow", text:"ng'ombe", audio:"ngombe", image:"cow"},
  {id:"horse", text:"farasi", audio:"farasi", image:"horse"},
  {id:"chicken", text:"kuku", audio:"kuku", image:"chicken"}, // jogoo? (rooster?)
  {id:"crab", text:"kaa", audio:"kaa", image:"crab"}
//  {id:"alligator", text:"aligeta", audio:"aligeta", image:"alligator"},
//  {id:"crocodile", text:"mamba", audio:"mamba", image:"crocodile"},
//  {id:"duck", text:"bata", audio:"bata", image:"duck"},
//  {id:"frog", text:"chura", audio:"chura", image:"frog"},
//  {id:"bear", text:"dubu", audio:"dubu", image:"bear"},
//  {id:"emu", text:"emu", audio:"emu", image:"emu"},
//  {id:"warthog", text:"gwasi", audio:"gwasi", image:"gwasi"}, // pig? hog? warthog?
//  {id:"flamingo", text:"heroe", audio:"heroe", image:"flamingo"}, // heron??
//  {id:"fly", text:"inzi", audio:"inzi", image:"fly"},
//  {id:"chameleon", text:"lumbwi", audio:"lumbwi", image:"chameleon"}, // lizard?
//  {id:"pigeon", text:"ninga", audio:"ninga", image:"pigeon"}, // ..bird?
//  {id:"orangutan", text:"orangutangu", audio:"orangutangu", image:"orangutan"},
//  {id:"giraffe", text:"twiga", audio:"twiga", image:"giraffe"},
//  {id:"lobster", text:"uduvi", audio:"uduvi", image:"lobster"},
//  {id:"bee", text:"wembembe", audio:"wembembe", image:"bee"},
//  {id:"jellyfish", text:"yavuyavu", audio:"yavuyavu", image:"jellyfish"},
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
  {id:"cheese", text:"chizi", audio:"chizi", image:"cheese"},
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
  {id:"hot", text:"moto", audio:"moto"},
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
  {id:"when", text:"wakati gani", audio:"wakati_gani"},
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
  {id:"dream", text:"njozi", audio:"njozi"},
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
