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
      this.round = 1;
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
        this.round++;
      }
  
      // Announce the winner
      this.announceWinner();
    }
  
    // Generate the player roles
    generatePlayerRoles() {
        // Create an array of roles
        var roles = "";
        if (this.numPlayers === 3) {
            // In a 3 player game, there will be 2 civilians and 1 mimic
            roles = ["Civilian", "Civilian", "Mimic"];
        } else if (this.numPlayers === 4 || this.numPlayers === 5) {
            const stringifiedArray = JSON.stringify(['Civilian']);
            // In a 4 or 5 player game, there will be 1 or 2 mimics
            roles = stringifiedArray.repeat(this.numPlayers - 1).concat(["Mimic"].repeat(this.numPlayers % 2));
            roles = JSON.parse(roles);
        } else {
            const stringifiedArray = JSON.stringify(['Civilian']);
            // In a game with 6 or more players, there will be 1 or 2 mimics and 0 or 1 blind mimics
            roles = stringifiedArray.repeat(this.numPlayers - 2).concat("[\"Mimic", "Mimic\"]").concat(", [\"Blind Mimic\"]").repeat(this.numPlayers % 2);
            roles = JSON.parse(roles);
        }
        
        // Shuffle the roles to randomize the order
        roles.sort(() => Math.random() - 0.5);
        
        // Assign each player a role
        for (const playerId in players) {
            players[playerId].role = roles.pop();
        }

        console.log(players);
    }
  
    // Check if the game is over
    gameOver() {
        let mimicInGame = false;
        for (let step = 0; step < this.playersInGame.length; step++) {
            if (players[this.playersInGame[step]]["role"] == "Mimic") {
                mimicInGame = true;
            }
        }
        // The game is over if there is only two players remaining
        return this.players.length <= 2 || mimicInGame == false;
    }
  
    // Give clues
    giveClues() {
        for (playerID in players) {
            while (pasued) {

            }
            paused = true;
        }
    }
    
    // Take a vote to eliminate a player
    takeVote() {
        while (paused) {
            paused = false;
            // Check if all players have voted.
            for (playerID in players) {
                if (players[playerID]["vote"] == "NA") {
                    paused = true;
                }
            }
        }
        paused = true;
    }

    // Announce the winner of the game
    announceWinner() {
        let winners = []
        if (mimicInGame == true) {
            for (playerID in players) {
                if (players[playerID]["role"] == "Mimic") {
                    winners.push(players[playerID]["playerName"]);
                }
            }
        } else {
            for (playerID in players) {
                if (players[playerID]["role"] == "Civilian") {
                    winners.push(players[playerID]["playerName"]);
                }
            }
        }
        return winners;
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