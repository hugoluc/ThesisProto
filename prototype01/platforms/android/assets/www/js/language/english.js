

// try again! let's go! i'm bored?
var feedback = [
  {id:"good_job", text:"good job", audio:"good_job"},
  {id:"welcome", text:"welcome", audio:"welcome"},
  {id:"go", text:"go", audio:"go"},
  {id:"goodbye", text:"goodbye", audio:"goodbye"}
];

var numbers = [

//  {id:"0", audio:"zero", text:"zero"},
  {id:"1", audio:"1", text:"one"},
  {id:"2", audio:"2", text:"two"},
  {id:"3", audio:"3", text:"three"},
  {id:"4", audio:"4", text:"four"},
  {id:"5", audio:"5", text:"five"},
  {id:"6", audio:"6", text:"six"},
  {id:"7", audio:"7", text:"seven"},
  {id:"8", audio:"8", text:"eight"},
  {id:"9", audio:"9", text:"nine"},
  {id:"10", audio:"10", text:"ten"},
  {id:"11", audio:"11", text:"eleven"},
  {id:"20", audio:"12", text:"twenty"},
  {id:"30", audio:"13", text:"thirty"},
  {id:"40", audio:"14", text:"forty"},
  {id:"50", audio:"15", text:"fifty"},
  {id:"60", audio:"16", text:"sixty"},
  {id:"70", audio:"17", text:"seventy"},
  {id:"80", audio:"18", text:"eighty"},
  {id:"90", audio:"19", text:"ninety"},
  {id:"100", audio:"20", text:"hundred"},
  {id:"1000", audio:"21", text:"thousand"}
  ];

// words for each letter and syllable: https://www.youtube.com/watch?v=IUjpXWPaWE0
  /*
  {id:"", text:"", audio:""},
  {id:"", text:"", audio:""}
  */

var shapes = [];

// when language is selected, load all the stimuli for that language


// ToDo: record English alphabet! (or phonemes, or both?)
var letters = [
  {id:1, text:"A", audio:"A", seq:[]},
  {id:2, text:"B", audio:"B", seq:[]},
  {id:3, text:"C", audio:"C", seq:[]},
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
  {id:17, text:"Q", audio:"Q", seq:[]}, // cue..
  {id:18, text:"R", audio:"R", seq:[]},
  {id:19, text:"S", audio:"S", seq:[]},
  {id:20, text:"T", audio:"T", seq:[]},
  {id:21, text:"U", audio:"U", seq:[]},
  {id:22, text:"V", audio:"V", seq:[]},
  {id:23, text:"W", audio:"W", seq:[]},
  {id:24, text:"X", audio:"X", seq:[]}, // ex
  {id:25, text:"Y", audio:"Y", seq:[]}, // ye? 'why'
  {id:26, text:"Z", audio:"Z", seq:[]}
  ];

var letters_phonemic = [
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
  {id:13, text:"M", audio:"em", seq:[]},
  {id:14, text:"N", audio:"ge", seq:[]},
  {id:15, text:"O", audio:"o", seq:[]},
  {id:16, text:"P", audio:"pe", seq:[]},
  {id:17, text:"Q", audio:"", seq:[]}, // cue..
  {id:18, text:"R", audio:"re", seq:[]},
  {id:19, text:"S", audio:"se", seq:[]},
  {id:20, text:"T", audio:"te", seq:[]},
  {id:21, text:"U", audio:"u", seq:[]},
  {id:22, text:"V", audio:"ve", seq:[]},
  {id:23, text:"W", audio:"we", seq:[]},
  {id:24, text:"X", audio:"", seq:[]}, // ex
  {id:25, text:"Y", audio:"", seq:[]}, // ye? 'why'
  {id:26, text:"Z", audio:"ze", seq:[]}
  ];

var fruit = [
  {id:"pineapple", text:"pineapple", audio:"pineapple", image:"pineapple"},
  {id:"banana", text:"banana", audio:"banana", image:"banana"},
  {id:"egg", text:"egg", audio:"egg", image:"egg"},
  {id:"orange", text:"orange", audio:"orange", image:"orange"},
  {id:"apple", text:"apple", audio:"apple", image:"apple"}, // needs audio
  {id:"mango", text:"mango", audio:"mango"},
  {id:"coconut", text:"coconut", audio:"coconut", image:"coconut"},
  {id:"grape", text:"grape", audio:"grape", image:"grape"}
]; // {id:"", text:"", audio:"", image:""},

var animals = [
  {id:"buffalo", text:"buffalo", audio:"buffalo", image:"buffalo"},
  {id:"chicken", text:"chicken", audio:"chicken", image:"chicken"},
  {id:"octopus", text:"octopus", audio:"octopus", image:"octopus"},
  {id:"cheetah", text:"cheetah", audio:"cheetah", image:"cheetah"},
  {id:"bird", text:"bird", audio:"bird", image:"bird"},
  {id:"cat", text:"cat", audio:"cat", image:"cat"},
  {id:"shark", text:"shark", audio:"shark", image:"shark"},
  {id:"anchovy", text:"anchovy", audio:"anchovy"},
  {id:"squid", text:"squid", audio:"squid"},
  {id:"fish", text:"fish", audio:"fish", image:"fish"},
  {id:"elephant", text:"elephant", image:"elephant"},
  {id:"baboon", text:"baboon", audio:"baboon"},
  {id:"crab", text:"crab", audio:"crab", image:"crab"},
  {id:"dog", text:"dog", audio:"dog", image:"dog"},
  {id:"monkey", text:"monkey", audio:"monkey", image:"monkey"},
  {id:"rhinoceros", text:"rhinoceros", audio:"rhinoceros", image:"rhinoceros"},
  {id:"sheep", text:"sheep", audio:"sheep", image:"sheep"},
  {id:"zebra", text:"zebra", audio:"zebra", image:"zebra"},
  {id:"snake", text:"snake", audio:"snake", image:"snake"},
  {id:"pig", text:"pig", audio:"pig", image:"pig"},
  {id:"ostrich", text:"ostrich", audio:"ostrich", image:"ostrich"},
  {id:"lion", text:"lion", audio:"lion", image:"lion"},
  {id:"hippopotamus", text:"hippopotamus", audio:"hippopotamus", image:"hippo"},
  {id:"leopard", text:"leopard", audio:"leopard", image:"leopard"},
  {id:"goat", text:"goat", audio:"goat", image:"goat"},
  {id:"deer", text:"deer", audio:"deer", image:"deer"},
  {id:"cow", text:"cow", audio:"cow", image:"cow"},
  {id:"horse", text:"horse", audio:"horse", image:"horse"},
  {id:"seagull", text:"seagull", audio:"seagull"}
  ];



var objects = animals.concat(fruit).concat([
  {id:"bicycle", text:"bicycle", audio:"bicycle", image:"bicycle"},
  {id:"motorcycle", text:"motorcycle", audio:"motorcycle", image:"motorcycle"},
  {id:"silver", text:"silver", audio:"silver", image:"silver"}, // also means money
  {id:"kidney", text:"kidney", audio:"kidney"},
  {id:"meat", text:"meat", audio:"meat"},
  {id:"chest", text:"chest", audio:"chest"},
  {id:"almond", text:"almond", audio:"almond"},
  {id:"cheese", text:"cheese", audio:"cheese", image:"cheese"},
  {id:"underwear", text:"underwear", audio:"underwear"},
  {id:"radio", text:"radio", audio:"radio", image:"radio"},
  {id:"tree", text:"tree", audio:"tree"},
  {id:"plant", text:"plant", audio:"plant"},
  {id:"neck", text:"neck", audio:"neck"},
  {id:"armpit", text:"armpit", audio:"armpit"},
  {id:"diamond", text:"diamond", audio:"diamond", image:"diamond"},
  {id:"mouth", text:"mouth", audio:"mouth", image:"mouth"},
  {id:"eye", text:"eye", audio:"eye", image:"eye"},
  {id:"beard", text:"beard", audio:"beard"},
  {id:"bush", text:"bush", audio:"bush"},
  {id:"medicine", text:"medicine", audio:"medicine"},
  {id:"heart", text:"heart", audio:"heart"},
  {id:"lung", text:"lung", audio:"lung"},
  {id:"stomach", text:"stomach", audio:"stomach"},
  {id:"potato", text:"potato", audio:"potato"},
  {id:"car", text:"car", audio:"car", image:"car"},
  {id:"danger", text:"danger", audio:"danger", image:"danger"},
  {id:"drink", text:"drink", audio:"drink", image:"drink"},
  {id:"school", text:"school", audio:"school"},
  {id:"earth", text:"earth", audio:"earth", image:"earth"},
  {id:"sword", text:"sword", audio:"sword"},
  {id:"fruit", text:"fruit", audio:"fruit"},
  {id:"flour", text:"flour", audio:"flour"},
  {id:"oil", text:"oil", audio:"oil"},
  {id:"mountain", text:"mountain", audio:"mountain"}
]);

// {id:"", text:"", audio:""},
var words = [
  {id:"I", text:"I", audio:"I"},
  {id:"we", text:"we", audio:"we"},
  {id:"you", text:"you", audio:"you"},
  {id:"you_all", text:"you all", audio:"you_all"},
  {id:"he", text:"he", audio:"he"},
  {id:"she", text:"she", audio:"she"},
  {id:"they", text:"they", audio:"they"},
  {id:"and", text:"and", audio:"and"},
  {id:"bad", text:"bad", audio:"bad"},
  {id:"bitter", text:"bitter", audio:"bitter"},
  {id:"cold", text:"cold", audio:"cold"},
  {id:"good", text:"good", audio:"good"},
  {id:"friend", text:"friend", audio:"friend"},
  {id:"goodbye", text:"goodbye", audio:"goodbye"},
  {id:"hot", text:"hot", audio:"hot"},
  {id:"food", text:"food", audio:"food"},
  {id:"here", text:"here", audio:"here"},
  {id:"how", text:"how", audio:"how"},
  {id:"no", text:"no", audio:"no"},
  {id:"okay", text:"okay", audio:"okay"},
  {id:"sweet", text:"sweet", audio:"sweet"},
  {id:"there", text:"there", audio:"there"},
  {id:"thank_you", text:"thank you", audio:"thank_you"},
  {id:"please", text:"please", audio:"please"},
  {id:"very", text:"very", audio:"very"},
  {id:"water", text:"water", audio:"water"},
  {id:"apologize", text:"apologize", audio:"apologize"},
  {id:"sorry", text:"sorry", audio:"sorry"},
  {id:"yes", text:"yes", audio:"yes"},
  {id:"what", text:"what", audio:"what"},
  {id:"which", text:"which", audio:"which"},
  {id:"where", text:"where", audio:"where"},
  {id:"when", text:"when", audio:"when"},
  {id:"Saturday", text:"Saturday", audio:"Saturday"},
  {id:"Sunday", text:"Sunday", audio:"Sunday"},
  {id:"Monday", text:"Monday", audio:"Monday"},
  {id:"Tuesday", text:"Tuesday", audio:"Tuesday"},
  {id:"Wednesday", text:"Wednesday", audio:"Wednesday"},
  {id:"Thursday", text:"Thursday", audio:"Thursday"},
  {id:"Friday", text:"Friday", audio:"Friday"},
  {id:"time", text:"time", audio:"time"},
  {id:"hour", text:"hour", audio:"hour"},
  {id:"morning", text:"morning", audio:"morning"},
  {id:"evening", text:"evening", audio:"evening"},
  {id:"night", text:"night", audio:"night"},
  {id:"now", text:"now", audio:"now"},
  {id:"today", text:"today", audio:"today"},
  {id:"yesterday", text:"yesterday", audio:"yesterday"},
  {id:"tomorrow", text:"tomorrow", audio:"tomorrow"},
  {id:"day", text:"day", audio:"day"},
  {id:"week", text:"week", audio:"week"},
  {id:"month", text:"month", audio:"month"},
  {id:"year", text:"year", audio:"year"},
  {id:"century", text:"century", audio:"century"},
  {id:"air", text:"air", audio:"air"},
  {id:"secret", text:"secret", audio:"secret"},
  {id:"half", text:"half", audio:"half"},
  {id:"who", text:"who", audio:"who"},
  {id:"lake", text:"lake", audio:"lake"},
  {id:"journey", text:"journey", audio:"journey"},
  {id:"fear", text:"fear", audio:"fear"},
  {id:"people", text:"people", audio:"people"},
  {id:"sister", text:"sister", audio:"sister"},
  {id:"dust", text:"dust", audio:"dust"},
  {id:"veil", text:"veil", audio:"veil"},
  {id:"war", text:"war", audio:"war"},
  {id:"language", text:"language", audio:"language"},
  {id:"father", text:"father", audio:"father"},
  {id:"color", text:"color", audio:"color"},
  {id:"news", text:"news", audio:"news"},
  {id:"pilot", text:"pilot", audio:"pilot"},
  {id:"expensive", text:"expensive", audio:"expensive"},
  {id:"far", text:"far", audio:"far"},
  {id:"seed", text:"seed", audio:"seed"},
  {id:"quiet", text:"quiet", audio:"quiet"},
  {id:"vegetable", text:"vegetable", audio:"vegetable"},
  {id:"calf", text:"calf", audio:"calf", image:"calf"},
  {id:"cheek", text:"cheek", audio:"cheek"},
  {id:"hunger", text:"hunger", audio:"hunger"},
  {id:"dream", text:"dream", audio:"dream"},
  {id:"true", text:"true", audio:"true"},
  {id:"coastal", text:"coastal", audio:"coastal"},
  {id:"of", text:"of", audio:"of"},
  {id:"sky", text:"sky", audio:"sky"},
  {id:"darkness", text:"darkness", audio:"darkness"},
  {id:"shadows", text:"shadows", audio:"shadows"},
  {id:"dew", text:"dew", audio:"dew"},
  {id:"wind", text:"wind", audio:"wind"},
  {id:"cloud", text:"cloud", audio:"cloud"},
  {id:"fog", text:"fog", audio:"fog"},
  {id:"rain", text:"rain", audio:"rain"},
  {id:"fire", text:"fire", audio:"fire"},
  {id:"smoke", text:"smoke", audio:"smoke"},
  {id:"snow", text:"snow", audio:"snow"},
  {id:"light", text:"light", audio:"light"},
  {id:"storm", text:"storm", audio:"storm"},
  {id:"wing", text:"wing", audio:"wing"},
  {id:"healthy", text:"healthy", audio:"healthy"},
  {id:"country", text:"country", audio:"country"},
  {id:"word", text:"word", audio:"word"},
  {id:"name", text:"name", audio:"name"},
  {id:"money", text:"money", audio:"money"}, // also pesa
  {id:"river", text:"river", audio:"river"},
  {id:"house", text:"house", audio:"house"},
  {id:"room", text:"room", audio:"room"},
  {id:"quick", text:"quick", audio:"quick"},
  {id:"music", text:"music", audio:"music"},
  {id:"sea", text:"sea", audio:"sea"},
  {id:"forest", text:"forest", audio:"forest"},
  {id:"animal", text:"animal", audio:"animal"},
  {id:"picture", text:"picture", audio:"picture"},
  {id:"weak", text:"weak", audio:"weak"},
  {id:"strong", text:"strong", audio:"strong"}
  ];


  //shapes.push(new Stimulus({id:"", text:"", image:"", audio:""}));
  shapes.push(new Stimulus({id:"star", text:"star", image:"star", audio:"star"}));
  shapes.push(new Stimulus({id:"semicircle", text:"semicircle", image:"semicircle", audio:"semicircle"}));
  shapes.push(new Stimulus({id:"circle", text:"circle", image:"circle", audio:"circle"}));
  shapes.push(new Stimulus({id:"triangle", text:"triangle", image:"triangle", audio:"triangle"}));
  shapes.push(new Stimulus({id:"square", text:"square", image:"square", audio:"square"}));
  shapes.push(new Stimulus({id:"rectangle", text:"rectangle", image:"rectangle", audio:"rectangle"}));
  shapes.push(new Stimulus({id:"pentagon", text:"pentagon", image:"pentagon", audio:"pentagon"}));
  shapes.push(new Stimulus({id:"hexagon", text:"hexagon", image:"hexagon", audio:"hexagon"}));
  shapes.push(new Stimulus({id:"octagon", text:"octagon", image:"octagon", audio:"octagon"}));
