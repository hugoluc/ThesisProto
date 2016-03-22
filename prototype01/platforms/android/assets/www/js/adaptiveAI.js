
// queues for stimuli to be studied next:
// a mixture of novel and old (recently correct and incorrect) items

// general principles: 1) if wrong, show again soon with known foil

// stimulus is king: choose stimulus and then randomly choose trial type

// dependencies: - dropGame can show alphabet and numbers
//  - ladyBug game can show numbers <7 for multiclick trials

// define initial sets for each game (to be loaded if no database exists)

// track a queue of recent correct and recent incorrect stimuli

// define lists of stimuli ordered by difficulty: track currentDifficultyLevel


// 1) load recent correct/incorrect queues:
// 2) draw an incorrect one with a correct foil (or novel if no correct)
// 3) if no incorrect ones, grab next-most-difficult (and update index)

function initStorage() {
  if (!store.enabled) {
    console.log('Local storage is not supported: disable "Private Mode" or upgrade to a modern browser.');
    return(null);
  }
  var user = store.get('user');
  console.log(user);
  if(user==null) {
    console.log('first time? ;)');
    user = getRandomInt(1,999999999);
    var AlphabetStim = new PriorityQueue();
    var NumberStim = new PriorityQueue();
    var WordStim = new PriorityQueue();
    var MathStim = new PriorityQueue();
    // shapes don't need their own...not enough of them
  } else {
    console.log('welcome back: loading queues')
    var AlphabetStim = store.get('alphabetstim');
    var NumberStim = store.get('numberstim');
    var WordStim = store.get('wordstim');
    var MathStim = store.get('mathstim');
    // could have a few game-specific state variables stored (e.g., dropSpeed)
  }

  // I think we need a correct and incorrect, so we can draw an incorrect (targ) + correct foil...
  return(user);
}

// any time they press the back button, store the current queues
function storeSession() {

}

// store.set('username', 'marcus')
// store.get('username')
// store.remove('username')
// store.clear() // Clear all keys
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
