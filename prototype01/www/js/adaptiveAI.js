
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
