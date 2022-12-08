// GAME SETUP

// List of word pairs
pairs = [['Dog', 'Cat'], ['Tree', 'Flower'], ['Car', 'Bike'], ['Night', 'Day'], ['Sun', 'Moon'], ['Water', 'Fire'], ['Big', 'Small'], ['Up', 'Down'], ['Fast', 'Slow'], ['Happy', 'Sad'], ['Book', 'Movie'], ['Chair', 'Table'], ['Apple', 'Orange'], ['Piano', 'Guitar'], ['Pen', 'Pencil'], ['Jacket', 'Coat'], ['Hat', 'Cap'], ['Carpet', 'Floor'], ['Bed', 'Sofa'], ['Bread', 'Butter'], ['Shoes', 'Boots'], ['Glass', 'Plastic'], ['Paper', 'Cardboard'], ['Door', 'Window'], ['House', 'Building'], ['Shirt', 'Sweater'], ['Fish', 'Bird'], ['Fruit', 'Vegetable'], ['Tree', 'Bush'], ['Tooth', 'Nail'], ['Gold', 'Silver'], ['Winter', 'Summer'], ['Salt', 'Pepper'], ['Paper', 'Plastic'], ['Glass', 'Cup'], ['Car', 'Truck'], ['Fish', 'Shark'], ['Shark', 'Dolphin'], ['Tree', 'Bush'], ['Bread', 'Pasta'], ['Mountain', 'Hill'], ['Snake', 'Lizard'], ['Coffee', 'Tea'], ['Hot', 'Cold'], ['Black', 'White'], ['Loud', 'Quiet'], ['Elephant', 'Tiger'], ['Diamond', 'Emerald'], ['Castle', 'Fortress'], ['King', 'Queen'], ['Astronaut', 'Cosmonaut'], ['Piano', 'Violin'], ['Garden', 'Jungle'], ['Ocean', 'Galaxy'], ['Moon', 'Mars'], ['Robot', 'Alien'], ['Butterfly', 'Dragonfly'], ['Sunflower', 'Daisy'], ['Shark', 'Whale'], ['Forest', 'Desert'], ['Computer', 'Laptop'], ['Baseball', 'Basketball'], ['Glasses', 'Sunglasses'], ['Movie', 'Television'], ['Music', 'Art'], ['Train', 'Airplane'], ['House', 'Mansion'], ['Ship', 'Submarine'], ['Rainbow', 'Unicorn'], ['Dragon', 'Phoenix'], ['Castle', 'Palace'], ['Butterfly', 'Moth'], ['Rose', 'Lily'], ['Ocean', 'Desert'], ['Star', 'Meteor'], ['Ghost', 'Zombie'], ['Gold', 'Platinum'], ['Elephant', 'Giraffe'], ['Castle', 'Tower'], ['King', 'Emperor'], ['Sun', 'Supernova'], ['Piano', 'Harp'], ['Garden', 'Oasis'], ['Ocean', 'Sea'], ['Moon', 'Saturn'], ['Robot', 'Cyborg'], ['Rainbow', 'Pot of Gold'], ['Dragon', 'Kraken'], ['Castle', 'Ice Palace'], ['Butterfly', 'Peacock'], ['Rose', 'Sunflower'], ['Ocean', 'Underwater City'], ['Star', 'Comet'], ['Ghost', 'Poltergeist'], ['Unicorn', 'Centaur'], ['Mermaid', 'Siren'], ['Phoenix', 'Kirin'], ['Chimera', 'Griffin'], ['Crystal Palace', 'Jade Palace'], ['Peacock', 'Swan'], ['Sunflower', 'Lotus'], ['Comet', 'Asteroid'], ['Poltergeist', 'Wraith'], ['Centaur', 'Minotaur'], ['Whale', 'Dolphin'], ['Lighthouse', 'Beacon'], ['Forest', 'Jungle'], ['Night', 'Evening'], ['Waterfall', 'Rapids'], ['Cloud', 'Fog'], ['Sunrise', 'Sunset'], ['Hammer', 'Wrench'], ['Kettle', 'Teapot'], ['Raven', 'Crow'], ['Tree', 'Shrub'], ['Pillow', 'Cushion'], ['Clock', 'Watch'], ['Skyscraper', 'Tower'], ['Sword', 'Dagger'], ['Glass', 'Vase'], ['Mirror', 'Window'], ['Bottle', 'Can'], ['Table', 'Chair'], ['Lamp', 'Light'], ['Key', 'Lock'], ['Book', 'Journal'], ['Television', 'Computer'], ['Cup', 'Mug'], ['Cat', 'Kitten'], ['Dog', 'Puppy'], ['Elephant', 'Giraffe'], ['Horse', 'Donkey'], ['Tiger', 'Lion'], ['Shark', 'Dolphin'], ['Fish', 'Octopus'], ['Bird', 'Owl'], ['Snake', 'Lizard'], ['Frog', 'Toad'], ['Mother', 'Grandmother'], ['Teacher', 'Student'], ['Doctor', 'Nurse'], ['Artist', 'Musician'], ['Chef', 'Baker'], ['Policeman', 'Fireman'], ['King', 'Queen'], ['Doctor', 'Dentist'], ['Teacher', 'Principal'], ['Artist', 'Designer'], ['Chef', 'Waitress'], ['Policeman', 'Security Guard'], ['Pilot', 'Flight Attendant'], ['Writer', 'Editor'], ['Engineer', 'Architect'], ['Heaven', 'Hell'], ['Earth', 'Sky'], ['Mind', 'Soul'], ['Maths', 'Science']];

paused = true;

console.log(players);
console.log(players.length);
console.log("original player array above \n \n");

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function activateGame(numPlayers) {
    // Set the number of players in the game
    game.setNumPlayers(numPlayers);

    // Choose random word pair and choose random secret word from the pair.
    max = pairs.length;
    randomPairIndex = generateRandomNumber(0, max);
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
        // Create an array of roles
        let roles = [];
        if (numPlayers === 3) {
            // In a 3 player game, there will be 2 civilians and 1 mimic
            roles = ["Civilian", "Civilian", "Mimic"];
        } else if (numPlayers === 4 || numPlayers === 5) {
            // In a 4 or 5 player game, there will be 1 or 2 mimics
            roles = ["Civilian"].repeat(numPlayers - 1).concat(["Mimic"].repeat(numPlayers % 2));
        } else {
            // In a game with 6 or more players, there will be 1 or 2 mimics and 0 or 1 blind mimics
            roles = ["Civilian"].repeat(numPlayers - 2).concat(["Mimic", "Mimic"], ["Blind Mimic"].repeat(numPlayers % 2));
        }
        
        // Shuffle the roles to randomize the order
        roles.sort(() => Math.random() - 0.5);
        
        // Assign each player a role
        for (const playerId in players) {
            players[playerId].role = roles.pop();
        }

        console.log(players);
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
        if (this.players.length === 1) {
            console.log("The winner is ${this.players[0].name}!");
        } else {
            console.log("The game ended in a tie.");
        }
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