
// queues for stimuli to be studied next:
// a mixture of novel and old (recently correct and incorrect) items

// general principles:
// 1) if wrong, show again soon with known foil (drawn from recent correct)
// 2) stimulus is king: choose stimulus and then randomly choose trial type
// 3) if 3 in a row correct, increase speed or number of foils
// 4) if 3 in a row wrong, decrease speed or number of foils

// dependencies: - dropGame can show alphabet and numbers
// - ladyBug game can show numbers <7 for multiclick trials
// - hangman uses objectstim for now, but could use words once we have non-image version

// define initial sets for each game (to be loaded if no database exists)
var sessionStart;
var user;
var LAST_TRIAL_KEY; // incremented each time a trial is logged
var chunkSize = 7; // number of stimuli to be put in at each priority (i.e., put in one 'round')
// which queues have been modified and need to be re-stored: set true when a game uses the stack
var queuesToUpdate = {
  'alphabetstim':false,
  'numberstim':false,
  'wordstim':false,
  'objectstim':false,
  'mathstim':false
} // true for testing

var stimQueues = {
  'alphabetstim':null,
  'numberstim':null,
  'wordstim':null,
  'objectstim':null,
  'mathstim':null
}

// in each game, track a queue of recent correct (to use as foils) and recent incorrect stimuli

// define lists of stimuli ordered by difficulty: track currentDifficultyLevel

// 1) load queues, in which stim have priority based on
// 2) draw an incorrect one with a correct foil (or novel if no correct)
// 3) if no incorrect ones, grab next-most-difficult (and update index)

// used for both initial loading of stimuli and pulling from storage into PriorityQueues
function loadStimulusQueue(stimuli, chunkSize) {
  console.log(stimuli);
  var pq = new BinaryHeap(function(x){return x.priority;})
  var priority = 0;

  for (var i = 0; i < stimuli.length; i++) {
    if(i%chunkSize==0) priority += 1;
    if(stimuli[i].priority==null) stimuli[i].priority = priority + .01*i;
    pq.push(stimuli[i]);
    //console.log(stimuli[i]);
  }

  return(pq)
}


// update timestamped list of activities (high-level)
// -- might want to log exit timestamps, so we know when they quit vs. turn off
function logTime(activityType) {
  var timestamp = Date.now();
  var activityLog = store.get("activityLog");
  activityLog.push({'time': timestamp, 'activity': activityType});
  console.log({'time': timestamp, 'activity': activityType});
  store.set("activityLog", activityLog);
}

function initStorage() {

  if (!store.enabled) {
    console.log('Local storage is not supported: disable "Private Mode" or upgrade to a modern browser.');
    return(null);
  }

  user = store.get('user');
  //user = null; // for testing defaults

  if(user==null) {
    user = getRandomInt(1,999999999);
    console.log('first time! assigned userID: ' + user);
    store.clear() // clear all keys
    store.set('user', user);
    store.set('score', 0);
    store.set('activityLog', []);
    //store.set('trialLog', []); // if we do a list it must be read back to add to
    store.set('LAST_TRIAL_KEY', 0);
  } else {
    console.log('welcome back user '+user+': loading queues');
  }
  try {
    stimQueues['alphabetstim'] = loadStimulusQueue(store.get('alphabetstim'), chunkSize);
  } catch(err) {
    stimQueues['alphabetstim'] = loadStimulusQueue(letters, chunkSize);
    console.log("alphabetstim missing: resetting queue");
  }
  try {
    stimQueues['numberstim'] = loadStimulusQueue(store.get('numberstim'), chunkSize);
  } catch(err) {
    stimQueues['numberstim'] = loadStimulusQueue(numbers, chunkSize);
    console.log("numberstim missing: resetting queue");
  }
  try {
    stimQueues['wordstim'] = loadStimulusQueue(store.get('wordstim'), chunkSize);
  } catch(err) {
    stimQueues['wordstim'] = loadStimulusQueue(words, chunkSize);
    console.log("wordstim missing: resetting queue");
  }
  try {
    stimQueues['objectstim'] = loadStimulusQueue(store.get('objectstim'), chunkSize);
  } catch(err) {
    stimQueues['objectstim'] = loadStimulusQueue(objects, chunkSize);
    console.log("objectstim missing: resetting queue");
  }
  //stimQueues['mathstim'] = loadStimulusQueue(store.get('mathstim'), chunkSize);

  // other game-specific state variables (e.g., dropSpeed, numFoils, etc) ?
  // maybe load some overall session stats...(duration, total correct/incorrect, games played)


  // I think we need a correct and incorrect, so we can draw an incorrect (targ) + correct foil...
  return(user);
}

// store low-level data:
// {"starttime":, "endtime":, "stimtype":, "stim":, "correct_clicks":, "incorrect_clicks":}
function logTrial(trial_data) {
  var key = store.get('LAST_TRIAL_KEY') + 1;
  store.set('tr'+key, trial_data);
  store.set('LAST_TRIAL_KEY', key);
}

// extracts all of the stored trial data (for visualization or upload to server)
function enumerateLoggedTrials() {
  var trials = []
  for (var i = 1; i < LAST_TRIAL_KEY; i++) {
    var trdat = store.get('tr'+i);
    trdat.user = user;
    trdat.index = i;
    trials.push(trdat);
  }
  console.log(trials);
  return(trials);
}

function storeQueue(queue_name) {
  store.set(queue_name, stimQueues[queue_name].content);
}

// any time they press the back button, store the updated queues -- but don't destroy!
function storeSession() {
  for(var key in queuesToUpdate) {
    if(queuesToUpdate[key]) { // only update modified queues
      store.set(key, stimQueues[key].content);
      //console.log("stored "+key+" in local storage:");
      //console.log(stimuli);
    }
  }
  store.set('lastSession', Date.now());
}

// store.remove('username')
//
// // Store an object literal - store.js uses JSON.stringify under the hood
// store.set('user', { name: 'marcus', likes: 'javascript' })
//
// // Get the stored object - store.js uses JSON.parse under the hood
// var user = store.get('user')
// alert(user.name + ' likes ' + user.likes)
//
// // Get all stored values
// store.getAll().user.name == 'marcus'
//
// // Loop over all stored values
// store.forEach(function(key, val) {
//     console.log(key, '==', val)
// })


////// for internet connectivity: firebase //////
// also load the previous session and choose stimuli from the last stage achieved
// var AUTH_TOKEN = 'CbfMSHpeCpLxCE2HBu3eUycicHONcqBQqopB8Xk1';

// // if no internet an error is thrown: net::ERR_INTERNET_DISCONNECTED
// // (then we should store all the data in a cookie until reconnected)

// // https://www.firebase.com/docs/android/guide/offline-capabilities.html
// // for offline storage on Android:
// Firebase.getDefaultConfig().setPersistenceEnabled(true); // does this persist across app restarts?
// var dbref = new Firebase("https://egoteach.firebaseio.com/");
// dbref.authWithCustomToken(AUTH_TOKEN, function(error, authData) {
//   if (error) {
//     console.log("Login Failed!", error);
//   } else {
//     console.log("Login Succeeded!", authData);
//   }
// });

// var summarydata = dbref.child("summary"); // session times and duration, level achieved in each game?
// var wordsdata = dbref.child("words"); //
// var countdata = dbref.child("count"); // counting game
