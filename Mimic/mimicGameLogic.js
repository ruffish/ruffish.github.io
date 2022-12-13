// GAME SETUP

// List of word pairs
pairs = [['Dog', 'Cat'], ['Tree', 'Flower'], ['Car', 'Bike'], ['Night', 'Day'], ['Sun', 'Moon'], ['Water', 'Fire'], ['Big', 'Small'], ['Up', 'Down'], ['Fast', 'Slow'], ['Happy', 'Sad'], ['Book', 'Movie'], ['Chair', 'Table'], ['Apple', 'Orange'], ['Piano', 'Guitar'], ['Pen', 'Pencil'], ['Jacket', 'Coat'], ['Hat', 'Cap'], ['Carpet', 'Floor'], ['Bed', 'Sofa'], ['Bread', 'Butter'], ['Shoes', 'Boots'], ['Glass', 'Plastic'], ['Paper', 'Cardboard'], ['Door', 'Window'], ['House', 'Building'], ['Shirt', 'Sweater'], ['Fish', 'Bird'], ['Fruit', 'Vegetable'], ['Tree', 'Bush'], ['Tooth', 'Nail'], ['Gold', 'Silver'], ['Winter', 'Summer'], ['Salt', 'Pepper'], ['Paper', 'Plastic'], ['Glass', 'Cup'], ['Car', 'Truck'], ['Fish', 'Shark'], ['Shark', 'Dolphin'], ['Tree', 'Bush'], ['Bread', 'Pasta'], ['Mountain', 'Hill'], ['Snake', 'Lizard'], ['Coffee', 'Tea'], ['Hot', 'Cold'], ['Black', 'White'], ['Loud', 'Quiet'], ['Elephant', 'Tiger'], ['Diamond', 'Emerald'], ['Castle', 'Fortress'], ['King', 'Queen'], ['Astronaut', 'Cosmonaut'], ['Piano', 'Violin'], ['Garden', 'Jungle'], ['Ocean', 'Galaxy'], ['Moon', 'Mars'], ['Robot', 'Alien'], ['Butterfly', 'Dragonfly'], ['Sunflower', 'Daisy'], ['Shark', 'Whale'], ['Forest', 'Desert'], ['Computer', 'Laptop'], ['Baseball', 'Basketball'], ['Glasses', 'Sunglasses'], ['Movie', 'Television'], ['Music', 'Art'], ['Train', 'Airplane'], ['House', 'Mansion'], ['Ship', 'Submarine'], ['Rainbow', 'Unicorn'], ['Dragon', 'Phoenix'], ['Castle', 'Palace'], ['Butterfly', 'Moth'], ['Rose', 'Lily'], ['Ocean', 'Desert'], ['Star', 'Meteor'], ['Ghost', 'Zombie'], ['Gold', 'Platinum'], ['Elephant', 'Giraffe'], ['Castle', 'Tower'], ['King', 'Emperor'], ['Sun', 'Supernova'], ['Piano', 'Harp'], ['Garden', 'Oasis'], ['Ocean', 'Sea'], ['Moon', 'Saturn'], ['Robot', 'Cyborg'], ['Rainbow', 'Pot of Gold'], ['Dragon', 'Kraken'], ['Castle', 'Ice Palace'], ['Butterfly', 'Peacock'], ['Rose', 'Sunflower'], ['Ocean', 'Underwater City'], ['Star', 'Comet'], ['Ghost', 'Poltergeist'], ['Unicorn', 'Centaur'], ['Mermaid', 'Siren'], ['Phoenix', 'Kirin'], ['Chimera', 'Griffin'], ['Crystal Palace', 'Jade Palace'], ['Peacock', 'Swan'], ['Sunflower', 'Lotus'], ['Comet', 'Asteroid'], ['Poltergeist', 'Wraith'], ['Centaur', 'Minotaur'], ['Whale', 'Dolphin'], ['Lighthouse', 'Beacon'], ['Forest', 'Jungle'], ['Night', 'Evening'], ['Waterfall', 'Rapids'], ['Cloud', 'Fog'], ['Sunrise', 'Sunset'], ['Hammer', 'Wrench'], ['Kettle', 'Teapot'], ['Raven', 'Crow'], ['Tree', 'Shrub'], ['Pillow', 'Cushion'], ['Clock', 'Watch'], ['Skyscraper', 'Tower'], ['Sword', 'Dagger'], ['Glass', 'Vase'], ['Mirror', 'Window'], ['Bottle', 'Can'], ['Table', 'Chair'], ['Lamp', 'Light'], ['Key', 'Lock'], ['Book', 'Journal'], ['Television', 'Computer'], ['Cup', 'Mug'], ['Cat', 'Kitten'], ['Dog', 'Puppy'], ['Elephant', 'Giraffe'], ['Horse', 'Donkey'], ['Tiger', 'Lion'], ['Shark', 'Dolphin'], ['Fish', 'Octopus'], ['Bird', 'Owl'], ['Snake', 'Lizard'], ['Frog', 'Toad'], ['Mother', 'Grandmother'], ['Teacher', 'Student'], ['Doctor', 'Nurse'], ['Artist', 'Musician'], ['Chef', 'Baker'], ['Policeman', 'Fireman'], ['King', 'Queen'], ['Doctor', 'Dentist'], ['Teacher', 'Principal'], ['Artist', 'Designer'], ['Chef', 'Waitress'], ['Policeman', 'Security Guard'], ['Pilot', 'Flight Attendant'], ['Writer', 'Editor'], ['Engineer', 'Architect'], ['Heaven', 'Hell'], ['Earth', 'Sky'], ['Mind', 'Soul'], ['Maths', 'Science']];

var mimicInGame = false;
paused = true;
let playerInGame = {};

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function activateGame() {
    // Assign players that want to play to the game.
    for (let playerId in players) {
        let player = players[playerId];
        if (player.inPlay) {
            playerInGame[playerId] = player;
        }
    }

    // Set the number of playersInGame in the game
    game.setNumplayersInGame(Object.keys(playersInGame).length);

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

// The game will now run until a player wins or all playersInGame have been eliminated.
class MimicGame {
    constructor() {
      this.numplayersInGame = 0;
      this.secretWord = "";
      this.mimicWord = "";
      this.round = 1;
    }
  
    // Set the number of playersInGame in the game
    setNumplayersInGame(num) {
      this.numplayersInGame = num;
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

        // Send the game data to the connected players
        this.sendGameData();

        // Trigger the first round
        this.triggerRound();
    }
  
    // Generate the player roles
    generatePlayerRoles() {
        // Create an array of roles
        var roles = [];


        if (this.numplayersInGame === 3) {
            // In a 3 player game, there will be 2 civilians and 1 mimic
            roles = ["Civilian", "Civilian", "Mimic"];
        } else if (this.numplayersInGame === 4 || this.numplayersInGame === 5) {
            const stringifiedArray = JSON.stringify(['Civilian']);
            // In a 4 or 5 player game, there will be 1 or 2 mimics
            roles = roles.concat(JSON.parse(stringifiedArray.repeat(this.numplayersInGame - 1))).concat(["Mimic"].repeat(this.numplayersInGame % 2));
        } else {
            // Add the appropriate number of Civilian roles
            for (let i = 0; i < this.numplayersInGame - 2; i++) {
                roles.push('Civilian');
            }

            // Add 1 or 2 Mimic roles, depending on the number of playersInGame
            if (this.numplayersInGame >= 6) {
                roles.push('Mimic');
                roles.push('Mimic');
            }

            // Add a Blind Mimic role if there are an odd number of playersInGame
            if (this.numplayersInGame % 2 === 1) {
                roles.push('Blind Mimic');
            }
        }

        // Shuffle the roles to randomize the order
        roles.sort(() => Math.random() - 0.5);

        // Assign each player a role and set their word
        for (let playerId in playersInGame) {
            playersInGame[playerId]['role'] = roles.pop();
            if (playersInGame[playerId]['role'] == "Civilian") {
                playersInGame[playerId]["word"] = this.secretWord;
            } else if (playersInGame[playerId]['role'] == "Mimic") {
                playersInGame[playerId]["word"] = this.mimicWord;
            } else if (playersInGame[playerId]['role'] == "Blind Mimic") {
                playersInGame[playerId]["word"] = "NA";
            }
        }

        console.log(playersInGame);
    }

    sendGameData() {
        // Send the words to the playersInGame
        for (let step = 0; step < conn.length; step++) {
            conn[step].send(["playersInGameData", playersInGame]);
        }
    }

    triggerRound() {
        // Trigger the current round
        triggerCurrentRound();
        for (let step = 0; step < conn.length; step++) {
            conn[step].send(["triggerRound", this.round]);
        }

        setTimeout(this.giveClues(), 5000);
    }
  
    // Give clues
    giveClues() {
        // Use Object.keys() to get an array of the keys in the dictionary
        let playersInGameArray = Object.keys(playersInGame);
        // Use Array.sort() to sort the array of keys and shuffle the order.
        playersInGameArray.sort(() => Math.random() - 0.5);
        // Set variable to count interations
        let numIterations = 0;
        let signalSent = false;

        // Set an interval to check the value of the paused variable every 1000 milliseconds (1 second)
        const interval = setInterval(() => {
            // Send Signal to others playersInGame on who turn it is to give a clue
            if (!signalSent) {
                for (let step = 0; step < conn.length; step++) {
                    conn[step].send(["giveClue", {"playerID": playersInGameArray[numIterations]}]);
                }
                signalSent = true;
            }
            // Check the value of the paused variable
            if (!paused) {
                numIterations++;
                signalSent = false;

                // Clear the interval
                clearInterval(interval);
            }
        }, 1000);
    }
    
    // Take a vote to eliminate a player
    takeVote() {
        // while (paused) {
        //     paused = false;
        //     console.log("Game is paused in takeVote");
        //     // Check if all playersInGame have voted.
        //     for (let playerID in playersInGame) {
        //         if (playersInGame[playerID]["vote"] == "NA") {
        //             paused = true;
        //         }
        //     }
        // }
        // paused = true;
    }

    // Check if the game is over
    gameOver() {
        for (let playerId in playersInGame) {
            if (playersInGame[playerId]["role"] == "Mimic") {
                mimicInGame = true;
            }
        }
        // The game is over if there is only two playersInGame remaining
        return Object.keys(playersInGame).length <= 2 || mimicInGame == false;
    }

    // Announce the winner of the game
    announceWinner() {
        let winners = []
        if (mimicInGame == true) {
            for (let playerID in playersInGame) {
                if (playersInGame[playerID]["role"] == "Mimic") {
                    winners.push(playersInGame[playerID]["playerName"]);
                }
            }
        } else {
            for (let playerID in playersInGame) {
                if (playersInGame[playerID]["role"] == "Civilian") {
                    winners.push(playersInGame[playerID]["playerName"]);
                }
            }
        }
        return winners;
    }
}

// Create a new game
const game = new MimicGame();

// In this code, the `MimicGame` class represents the game and contains the main game loop. It has methods for setting the number of playersInGame, secret and mimic words, starting the game, and announcing the winner.

// The `Player` class is the base class for the different player types (civilians, mimics, and blind mimics). It contains a `name` property and default implementations of the `giveClue()` and `choosePlayerToVoteFor()` methods.

// The `CivilianPlayer` class extends the `Player` class and overrides the `giveClue()` and `choosePlayerToVoteFor()` methods to provide appropriate behavior for a civilian player. It also has a `secretWord` property to store the secret word for that player.

// The `MimicPlayer` class is similar to the `CivilianPlayer` class, but it uses the mimic word instead of the secret word.

// The `BlindMimicPlayer` class is similar to the `MimicPlayer` class, but it doesn't have a secret or mimic word, and it has an additional `guessSecretWord()` method that allows the player to guess the secret word.

// I hope this helps! Let me know if you have any questions.