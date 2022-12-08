// GAME SETUP

// List of word pairs
pairs = [['Dog', 'Cat'], ['Tree', 'Flower'], ['Car', 'Bike'], ['Night', 'Day'], ['Sun', 'Moon'], ['Water', 'Fire'], ['Big', 'Small'], ['Up', 'Down'], ['Fast', 'Slow'], ['Happy', 'Sad'], ['Book', 'Movie'], ['Chair', 'Table'], ['Apple', 'Orange'], ['Piano', 'Guitar'], ['Pen', 'Pencil'], ['Jacket', 'Coat'], ['Hat', 'Cap'], ['Carpet', 'Floor'], ['Bed', 'Sofa'], ['Bread', 'Butter'], ['Shoes', 'Boots'], ['Glass', 'Plastic'], ['Paper', 'Cardboard'], ['Door', 'Window'], ['House', 'Building'], ['Shirt', 'Sweater'], ['Fish', 'Bird'], ['Fruit', 'Vegetable'], ['Tree', 'Bush'], ['Tooth', 'Nail'], ['Gold', 'Silver'], ['Winter', 'Summer'], ['Salt', 'Pepper'], ['Paper', 'Plastic'], ['Glass', 'Cup'], ['Car', 'Truck'], ['Fish', 'Shark'], ['Shark', 'Dolphin'], ['Tree', 'Bush'], ['Bread', 'Pasta'], ['Mountain', 'Hill'], ['Snake', 'Lizard'], ['Coffee', 'Tea'], ['Hot', 'Cold'], ['Black', 'White'], ['Loud', 'Quiet'], ['Elephant', 'Tiger'], ['Diamond', 'Emerald'], ['Castle', 'Fortress'], ['King', 'Queen'], ['Astronaut', 'Cosmonaut'], ['Piano', 'Violin'], ['Garden', 'Jungle'], ['Ocean', 'Galaxy'], ['Moon', 'Mars'], ['Robot', 'Alien'], ['Butterfly', 'Dragonfly'], ['Sunflower', 'Daisy'], ['Shark', 'Whale'], ['Forest', 'Desert'], ['Computer', 'Laptop'], ['Baseball', 'Basketball'], ['Glasses', 'Sunglasses'], ['Movie', 'Television'], ['Music', 'Art'], ['Train', 'Airplane'], ['House', 'Mansion'], ['Ship', 'Submarine'], ['Rainbow', 'Unicorn'], ['Dragon', 'Phoenix'], ['Castle', 'Palace'], ['Butterfly', 'Moth'], ['Rose', 'Lily'], ['Ocean', 'Desert'], ['Star', 'Meteor'], ['Ghost', 'Zombie'], ['Gold', 'Platinum'], ['Elephant', 'Giraffe'], ['Castle', 'Tower'], ['King', 'Emperor'], ['Sun', 'Supernova'], ['Piano', 'Harp'], ['Garden', 'Oasis'], ['Ocean', 'Sea'], ['Moon', 'Saturn'], ['Robot', 'Cyborg'], ['Rainbow', 'Pot of Gold'], ['Dragon', 'Kraken'], ['Castle', 'Ice Palace'], ['Butterfly', 'Peacock'], ['Rose', 'Sunflower'], ['Ocean', 'Underwater City'], ['Star', 'Comet'], ['Ghost', 'Poltergeist'], ['Unicorn', 'Centaur'], ['Mermaid', 'Siren'], ['Phoenix', 'Kirin'], ['Chimera', 'Griffin'], ['Crystal Palace', 'Jade Palace'], ['Peacock', 'Swan'], ['Sunflower', 'Lotus'], ['Comet', 'Asteroid'], ['Poltergeist', 'Wraith'], ['Centaur', 'Minotaur'], ['Whale', 'Dolphin'], ['Lighthouse', 'Beacon'], ['Forest', 'Jungle'], ['Night', 'Evening'], ['Waterfall', 'Rapids'], ['Cloud', 'Fog'], ['Sunrise', 'Sunset'], ['Hammer', 'Wrench'], ['Kettle', 'Teapot'], ['Raven', 'Crow'], ['Tree', 'Shrub'], ['Pillow', 'Cushion'], ['Clock', 'Watch'], ['Skyscraper', 'Tower'], ['Sword', 'Dagger'], ['Glass', 'Vase'], ['Mirror', 'Window'], ['Bottle', 'Can'], ['Table', 'Chair'], ['Lamp', 'Light'], ['Key', 'Lock'], ['Book', 'Journal'], ['Television', 'Computer'], ['Cup', 'Mug'], ['Cat', 'Kitten'], ['Dog', 'Puppy'], ['Elephant', 'Giraffe'], ['Horse', 'Donkey'], ['Tiger', 'Lion'], ['Shark', 'Dolphin'], ['Fish', 'Octopus'], ['Bird', 'Owl'], ['Snake', 'Lizard'], ['Frog', 'Toad'], ['Mother', 'Grandmother'], ['Teacher', 'Student'], ['Doctor', 'Nurse'], ['Artist', 'Musician'], ['Chef', 'Baker'], ['Policeman', 'Fireman'], ['King', 'Queen'], ['Doctor', 'Dentist'], ['Teacher', 'Principal'], ['Artist', 'Designer'], ['Chef', 'Waitress'], ['Policeman', 'Security Guard'], ['Pilot', 'Flight Attendant'], ['Writer', 'Editor'], ['Engineer', 'Architect'], ['Heaven', 'Hell'], ['Earth', 'Sky'], ['Mind', 'Soul'], ['Maths', 'Science']];

paused = true;

console.log(players);
console.log("original player array above \n \n");

function activateGame(numPlayers) {
    // Set the number of players in the game
    game.setNumPlayers(numPlayers);

    // Choose random word pair and choose random secret word from the pair.
    min = 0;
    max = pairs.length;
    randomPairIndex = Math.floor(Math.random() * (max - min + 1) + min);
    randomSecretWordIndex = generateRandomNumber(0, 1);
    if (randomSecretWordIndex = 1) {
        mimicWord = 1;
    } else {
        mimicWord = 0;
    }

    // Set the secret word for the civilians
    game.setSecretWord(pairs[randomPairIndex][randomSecretWordIndex]);
    // Set the mimic word for the mimics
    game.setMimicWord(pairs[randomPairIndex][mimicWord]);
    // Start the game
    game.start();
}

// The game will now run until a player wins or all players have been eliminated.
class MimicGame {
    constructor() {
      this.numPlayers = 0;
      this.secretWord = "";
      this.mimicWord = "";
      this.players = [];
    }
  
    // Set the number of players in the game
    setNumPlayers(num) {
      this.numPlayers = num;
    }
  
    // Set the secret word for the civilians
    setSecretWord(word) {
      this.secretWord = word;
    }
  
    // Set the mimic word for the mimics
    setMimicWord(word) {
      this.mimicWord = word;
    }
  
    // Start the game
    start() {
      // Generate the player roles
      this.generatePlayerRoles();
  
      // Start the game loop
      while (!this.gameOver()) {
        // Take turns giving clues
        this.giveClues();
  
        // Take a vote to eliminate a player
        this.takeVote();
      }
  
      // Announce the winner
      this.announceWinner();
    }
  
    // Generate the player roles
    generatePlayerRoles() {
      // Calculate the number of mimics and civilians
      const numMimics = Math.floor(this.numPlayers / 2);
      const numCivilians = this.numPlayers - numMimics;
  
      // Create the players array
      for (let i = 0; i < numCivilians; i++) {
        this.players.push(new CivilianPlayer());
      }
      for (let i = 0; i < numMimics; i++) {
        this.players.push(new MimicPlayer());
      }
  
      // If there are more than 6 players, add a blind mimic
      if (this.numPlayers > 6) {
        this.players.push(new BlindMimicPlayer());
      }
  
      // Shuffle the players array to randomize the roles
      this.players = this.shuffleArray(this.players);

      console.log(this.players);


    }
  
    // Shuffle an array in place
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    // Check if the game is over
    gameOver() {
      // The game is over if there is only two players remaining
      return this.players.length <= 2;
    }
  
    // Give clues
    giveClues() {
        // Loop through the players and have them give a clue
        for (const player of this.players) {
            player.giveClue();
        }
    }
    
    // Take a vote to eliminate a player
    takeVote() {
        // Create a map of players to their vote count
        const votes = new Map();
        for (const player of this.players) {
            votes.set(player, 0);
        }
        // Loop through the players and have them vote
        for (const voter of this.players) {
            // Have the player choose another player to vote for
            const vote = voter.choosePlayerToVoteFor(this.players);

            // Increment the vote count for the chosen player
            votes.set(vote, votes.get(vote) + 1);
        }
        // Find the player with the most votes
        let mostVotes = 0;
        let eliminatedPlayer = null;
        for (const [player, voteCount] of votes.entries()) {
            if (voteCount > mostVotes) {
                mostVotes = voteCount;
                eliminatedPlayer = player;
            }
        }

        // If a player was chosen to be eliminated, remove them from the game
        if (eliminatedPlayer) {
            const index = this.players.indexOf(eliminatedPlayer);
            this.players.splice(index, 1);
        }
    }

    // Announce the winner of the game
    announceWinner() {
        mimicInGame = false;

        if (this.players.length === 1) {
            console.log("The winner is ${this.players[0].name}!");
        } else {
            console.log("The game ended in a tie.");
        }
    }
}

// Base player class
class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    // Give a clue
    giveClue() {
        console.log("${this.name}: I can\'t give a clue.")
    }

    // Choose a player to vote for
    choosePlayerToVoteFor() {
        console.log("${this.name}: I can't vote.");
    }
}

// Civilian player class
class CivilianPlayer extends Player {
    constructor(secretWord) {
        super("Civilian");
    }

    // Give a clue
    giveClue() {
        console.log("${this.name}: My secret word is a type of ${this.secretWord}.");
    }

    // Choose a player to vote for
    choosePlayerToVoteFor(players) {
        // Choose a random player to vote for
        const index = Math.floor(Math.random() * players.length);
        return players[index];
    }
}

// Mimic player class
class MimicPlayer extends Player {
    constructor(mimicWord) {
        super("Mimic");
    }

    // Give a clue
    giveClue() {
        // Use a while loop to pause the code until the button is clicked
        while (paused) {
            
        }
        paused = true;
    }

    // Choose a player to vote for
    choosePlayerToVoteFor(players) {
        // Choose a random player to vote for, except for another mimic
        let index = Math.floor(Math.random() * players.length);
        while (players[index] instanceof MimicPlayer) {
            index = Math.floor(Math.random() * players.length);
        }
        return players[index];
    }
}

// Blind mimic player class
class BlindMimicPlayer extends Player {
    constructor() {
        super("Blind Mimic");
    }

    // Give a clue
    giveClue(guess) {
        // Guess the secret word and win the game.
        
    }

    // Choose a player to vote for
    choosePlayerToVoteFor(players) {
        // Choose a random player to vote for, except for another mimic
        let index = Math.floor(Math.random() * players.length);
        while (players[index] instanceof MimicPlayer) {
            index = Math.floor(Math.random() * players.length);
        }
        return players[index];
    }

    // Guess the secret word
    guessSecretWord(secretWord) {
    if (this.secretWord === secretWord) {
        return true;
    }
        return false;
    }
}

// Create a new game
const game = new MimicGame();

// In this code, the `MimicGame` class represents the game and contains the main game loop. It has methods for setting the number of players, secret and mimic words, starting the game, and announcing the winner.

// The `Player` class is the base class for the different player types (civilians, mimics, and blind mimics). It contains a `name` property and default implementations of the `giveClue()` and `choosePlayerToVoteFor()` methods.

// The `CivilianPlayer` class extends the `Player` class and overrides the `giveClue()` and `choosePlayerToVoteFor()` methods to provide appropriate behavior for a civilian player. It also has a `secretWord` property to store the secret word for that player.

// The `MimicPlayer` class is similar to the `CivilianPlayer` class, but it uses the mimic word instead of the secret word.

// The `BlindMimicPlayer` class is similar to the `MimicPlayer` class, but it doesn't have a secret or mimic word, and it has an additional `guessSecretWord()` method that allows the player to guess the secret word.

// I hope this helps! Let me know if you have any questions.