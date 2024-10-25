// GAME SETUP

// List of word pairs
pairs = [
    ['Dog', 'Cat'],
    ['Tree', 'Flower'],
    ['Car', 'Bike'],
    ['Night', 'Day'],
    ['Sun', 'Moon'],
    ['Water', 'Fire'],
    ['Big', 'Small'],
    ['Up', 'Down'],
    ['Fast', 'Slow'],
    ['Happy', 'Sad'],
    ['Book', 'Movie'],
    ['Chair', 'Table'],
    ['Apple', 'Orange'],
    ['Piano', 'Guitar'],
    ['Pen', 'Pencil'],
    ['Jacket', 'Coat'],
    ['Hat', 'Cap'],
    ['Carpet', 'Floor'],
    ['Bed', 'Sofa'],
    ['Bread', 'Butter'],
    ['Shoes', 'Boots'],
    ['Glass', 'Plastic'],
    ['Paper', 'Cardboard'],
    ['Door', 'Window'],
    ['House', 'Building'],
    ['Shirt', 'Sweater'],
    ['Fish', 'Bird'],
    ['Fruit', 'Vegetable'],
    ['Tree', 'Bush'],
    ['Tooth', 'Nail'],
    ['Gold', 'Silver'],
    ['Winter', 'Summer'],
    ['Salt', 'Pepper'],
    ['Paper', 'Plastic'],
    ['Glass', 'Cup'],
    ['Car', 'Truck'],
    ['Fish', 'Shark'],
    ['Shark', 'Dolphin'],
    ['Tree', 'Bush'],
    ['Bread', 'Pasta'],
    ['Mountain', 'Hill'],
    ['Snake', 'Lizard'],
    ['Coffee', 'Tea'],
    ['Hot', 'Cold'],
    ['Black', 'White'],
    ['Loud', 'Quiet'],
    ['Elephant', 'Tiger'],
    ['Diamond', 'Emerald'],
    ['Castle', 'Fortress'],
    ['King', 'Queen'],
    ['Astronaut', 'Cosmonaut'],
    ['Piano', 'Violin'],
    ['Garden', 'Jungle'],
    ['Ocean', 'Galaxy'],
    ['Moon', 'Mars'],
    ['Robot', 'Alien'],
    ['Butterfly', 'Dragonfly'],
    ['Sunflower', 'Daisy'],
    ['Shark', 'Whale'],
    ['Forest', 'Desert'],
    ['Computer', 'Laptop'],
    ['Baseball', 'Basketball'],
    ['Glasses', 'Sunglasses'],
    ['Movie', 'Television'],
    ['Music', 'Art'],
    ['Train', 'Airplane'],
    ['House', 'Mansion'],
    ['Ship', 'Submarine'],
    ['Rainbow', 'Unicorn'],
    ['Dragon', 'Phoenix'],
    ['Castle', 'Palace'],
    ['Butterfly', 'Moth'],
    ['Rose', 'Lily'],
    ['Ocean', 'Desert'],
    ['Star', 'Meteor'],
    ['Ghost', 'Zombie'],
    ['Gold', 'Platinum'],
    ['Elephant', 'Giraffe'],
    ['Castle', 'Tower'],
    ['King', 'Emperor'],
    ['Sun', 'Supernova'],
    ['Piano', 'Harp'],
    ['Garden', 'Oasis'],
    ['Ocean', 'Sea'],
    ['Moon', 'Saturn'],
    ['Robot', 'Cyborg'],
    ['Rainbow', 'Pot of Gold'],
    ['Dragon', 'Kraken'],
    ['Castle', 'Ice Palace'],
    ['Butterfly', 'Peacock'],
    ['Rose', 'Sunflower'],
    ['Ocean', 'Underwater City'],
    ['Star', 'Comet'],
    ['Ghost', 'Poltergeist'],
    ['Unicorn', 'Centaur'],
    ['Mermaid', 'Siren'],
    ['Phoenix', 'Kirin'],
    ['Chimera', 'Griffin'],
    ['Peacock', 'Swan'],
    ['Sunflower', 'Lotus'],
    ['Comet', 'Asteroid'],
    ['Poltergeist', 'Wraith'],
    ['Centaur', 'Minotaur'],
    ['Whale', 'Dolphin'],
    ['Lighthouse', 'Beacon'],
    ['Forest', 'Jungle'],
    ['Night', 'Evening'],
    ['Waterfall', 'Rapids'],
    ['Cloud', 'Fog'],
    ['Sunrise', 'Sunset'],
    ['Hammer', 'Wrench'],
    ['Kettle', 'Teapot'],
    ['Raven', 'Crow'],
    ['Tree', 'Shrub'],
    ['Pillow', 'Cushion'],
    ['Clock', 'Watch'],
    ['Skyscraper', 'Tower'],
    ['Sword', 'Dagger'],
    ['Glass', 'Vase'],
    ['Mirror', 'Window'],
    ['Bottle', 'Can'],
    ['Table', 'Chair'],
    ['Lamp', 'Light'],
    ['Key', 'Lock'],
    ['Book', 'Journal'],
    ['Television', 'Computer'],
    ['Cup', 'Mug'],
    ['Cat', 'Kitten'],
    ['Dog', 'Puppy'],
    ['Elephant', 'Giraffe'],
    ['Horse', 'Donkey'],
    ['Tiger', 'Lion'],
    ['Shark', 'Dolphin'],
    ['Fish', 'Octopus'],
    ['Bird', 'Owl'],
    ['Snake', 'Lizard'],
    ['Frog', 'Toad'],
    ['Mother', 'Grandmother'],
    ['Teacher', 'Student'],
    ['Doctor', 'Nurse'],
    ['Artist', 'Musician'],
    ['Chef', 'Baker'],
    ['Policeman', 'Fireman'],
    ['King', 'Queen'],
    ['Doctor', 'Dentist'],
    ['Teacher', 'Principal'],
    ['Artist', 'Designer'],
    ['Chef', 'Waitress'],
    ['Policeman', 'Security Guard'],
    ['Pilot', 'Flight Attendant'],
    ['Writer', 'Editor'],
    ['Engineer', 'Architect'],
    ['Heaven', 'Hell'],
    ['Earth', 'Sky'],
    ['Mind', 'Soul'],
    ['Maths', 'Science']
];

var mimicInGame = true;
var paused = true;
var numIterations = 0;
var playersInGame = {};
let game;

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function activateGame() {
    // Create a new game
    game = new MimicGame();
    mimicInGame = true;
    paused = true;
    numIterations = 0;
    playersInGame = {};

    // Assign players that want to play to the game.
    for (let playerId in players) {
        let player = players[playerId];
        if (player.inPlay) {
            playersInGame[playerId] = player;
        }
    }

    // Set the number of playersInGame in the game
    game.setNumplayersInGame(Object.keys(playersInGame).length);

    // Choose random word pair and choose random secret word from the pair.
    let mimicWord = 0;
    max = pairs.length;
    randomPairIndex = generateRandomNumber(0, max);
    randomSecretWordIndex = generateRandomNumber(0, 1);
    if (randomSecretWordIndex == 1) {
        mimicWordIndex = 0;
    } else {
        mimicWordIndex = 1;
    }

    // Set the secret word for the civilians
    game.setSecretWord(pairs[randomPairIndex][randomSecretWordIndex]);
    // Set the mimic word for the mimics
    game.setMimicWord(pairs[randomPairIndex][mimicWordIndex]);
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
        } else {
            // Add the appropriate number of Civilian roles
            for (let i = 0; i < this.numplayersInGame - 1; i++) {
                roles.push('Civilian');
            }

            // Add 1 or 2 Mimic roles, depending on the number of playersInGame
            if (this.numplayersInGame >= 5) {
                roles.push('Mimic');
                roles.push('Mimic');
            } else {
                roles.push('Mimic');
            }

            if (this.numplayersInGame >= 6) {
                // Randomly decide whether to add a Blind Mimic role
                if (generateRandomNumber(0, 1) === 1) {
                    roles.push('Blind Mimic');
                }
            }
        }

        // Shuffle the roles to randomize the order using Fisher-Yates Shuffle
        shuffle(roles);

        // Assign each player a role and set their word
        for (var playerId in playersInGame) {
            playersInGame[playerId]['votes'] = 0;
            playersInGame[playerId]['ready'] = false;
            playersInGame[playerId]['role'] = roles.pop();
            players[playerId]['role'] = playersInGame[playerId]['role']
            if (playersInGame[playerId]['role'] == "Civilian") {
                playersInGame[playerId]["word"] = this.secretWord;
            } else if (playersInGame[playerId]['role'] == "Mimic") {
                playersInGame[playerId]["word"] = this.mimicWord;
            } else if (playersInGame[playerId]['role'] == "Blind Mimic") {
                playersInGame[playerId]["word"] = "NA";
            }
        }
    }

    sendGameData() {
        // Send the words to the playersInGame
        for (let step = 0; step < conn.length; step++) {
            conn[step].send(["playersInGameData", playersInGame]);
            conn[step].send(["playersData", players]);
        }
    }

    triggerRound() {
        // Trigger the current round
        triggerCurrentRound();
        for (let step = 0; step < conn.length; step++) {
            conn[step].send(["triggerRound", this.round]);
        }

        // Set an interval to check the value of the paused variable every 1000 milliseconds (1 second)
        const checkReady = setInterval(() => {
            // Check if all playersInGame are ready
            for (let player in playersInGame) {
                if (playersInGame[player]["ready"] == false) {
                    // If not, set paused to true and break out of the for loop
                    paused = true;
                    break;
                } else {
                    // If so, set paused to fakse
                    paused = false;
                }
            }

            // Check the value of the paused variable
            if (!paused) {
                // Clear the interval
                clearInterval(checkReady);

                for (let player in playersInGame) {
                    playersInGame[player]["ready"] = false;
                }

                this.giveClues();
            }
        }, 200);
    }

    // Give clues
    giveClues() {
        // Use Object.keys() to get an array of the keys in the dictionary
        let playersInGameArray = Object.keys(playersInGame);
        // Use Array.sort() to sort the array of keys and shuffle the order.
        playersInGameArray.sort(() => Math.random() - 0.5);
        // Set variable to count interations
        let signalSent = false;
        paused = true;

        // Set an interval to check the value of the paused variable every 1000 milliseconds (1 second)
        const interval = setInterval(() => {
            // Send Signal to others playersInGame on who turn it is to give a clue
            if (!signalSent) {
                console.log("giveCluse activated");
                triggerGiveClue(playersInGameArray[numIterations]);
                for (let step = 0; step < conn.length; step++) {
                    conn[step].send(["giveClue", {
                        "playerID": playersInGameArray[numIterations],
                        "iteration": numIterations
                    }]);
                }
                signalSent = true;
            }
            // Check if current playing giving clue is done
            if (playersInGame[playersInGameArray[numIterations]]["ready"]) {
                numIterations++;
                signalSent = false;
                for (let player in playersInGame) {
                    if (!playersInGame[player].ready) {
                        // If not, set paused to true and break out of the for loop
                        paused = true;
                        break;
                    } else {
                        // If so, set paused to fakse
                        paused = false;
                    }
                }
            }
            // Move on to next stage if all playersInGame are done giving clues (paused = false)
            if (!paused) {
                numIterations = 0;
                // Clear the interval
                clearInterval(interval);
                for (let player in playersInGame) {
                    playersInGame[player]["ready"] = false;
                }
                this.takeVote();
            }
        }, 200);
    }

    // Take a vote to eliminate a player
    takeVote() {
        let signalSent = false;
        paused = true;
        let mostVotedPlayer = [];
        let mostVotes = 0;

        const interval = setInterval(() => {
            // Send Signal to others playersInGame that its time to vote
            if (!signalSent) {
                console.log("takeVote activated");
                triggerTakeVote();
                for (let step = 0; step < conn.length; step++) {
                    conn[step].send(["takeVote"]);
                }
                signalSent = true;
            }
            // Check if all playersInGame are done voting
            for (let player in playersInGame) {
                if (!playersInGame[player].ready) {
                    // If not, set paused to true and break out of the for loop
                    paused = true;
                    break;
                } else {
                    // If so, set paused to fakse
                    paused = false;
                }
            }

            // Move on to next stage if all playersInGame are done voting (paused = false)
            if (!paused) {
                // Clear the interval
                clearInterval(interval);
                // Work out who has the most votes
                for (let player in playersInGame) {
                    playersInGame[player]["ready"] = false;
                    if (playersInGame[player]["votes"] > mostVotes) {
                        mostVotedPlayer = [];
                        mostVotedPlayer.push(player);
                        mostVotes = playersInGame[player]["votes"];
                    } else if (playersInGame[player]["votes"] == mostVotes) {
                        mostVotedPlayer.push(player);
                    }
                    playersInGame[player]["votes"] = 0;
                }

                // If there is a tie, make the other playersInGame vote again
                if (mostVotedPlayer.length > 1) {
                    // Randomly select a player from the mostVotedPlayer array
                    let randomPlayer = mostVotedPlayer[Math.floor(Math.random() * mostVotedPlayer.length)];
                    // Eliminate the randomly selected player
                    this.eliminatePlayer(randomPlayer);
                } else {
                    // If not, eliminate the player with the most votes
                    this.eliminatePlayer(mostVotedPlayer[0]);
                }
            }
        }, 200);
    }

    // Eliminate a player
    eliminatePlayer(playerID) {
        // Remove the player from the playersInGame dictionary
        delete playersInGame[playerID];
        // Announce the elimination of the player
        triggerAnnounceElimination(playerID);
        for (let step = 0; step < conn.length; step++) {
            conn[step].send(["announceElimination", playerID]);
        }

        // Check if the game is over and proceed to the next stage
        if (this.gameOver()) {
            setTimeout(() => {
                this.announceWinner();
            }, 6000);
        } else {
            setTimeout(() => {
                this.giveClues();
            }, 6000);
        }
    }

    // Check if the game is over
    gameOver() {
        for (let playerId in playersInGame) {
            if (playersInGame[playerId]["role"] == "Mimic") {
                mimicInGame = true;
                break;
            } else {
                mimicInGame = false;
            }
        }
        // The game is over if there is only two playersInGame remaining
        return Object.keys(playersInGame).length <= 2 || mimicInGame == false;
    }

    // Announce the winner of the game
    announceWinner() {
        let winners = []
        if (mimicInGame == true) {
            for (let playerID in players) {
                if (players[playerID]["role"] == "Mimic" && players[playerID]["inPlay"] == true) {
                    winners.push(players[playerID]["playerID"]);
                }
            }
        } else {
            for (let playerID in players) {
                if (players[playerID]["role"] == "Civilian" && players[playerID]["inPlay"] == true) {
                    winners.push(players[playerID]["playerID"]);
                }
            }
        }
        for (let step = 0; step < conn.length; step++) {
            conn[step].send(["announceWinner", {
                "winners": winners,
                "mimicsWon": mimicInGame
            }]);
        }
        triggerAnnounceWinner(winners, mimicInGame);
    }
}

// In this code, the `MimicGame` class represents the game and contains the main game loop. It has methods for setting the number of playersInGame, secret and mimic words, starting the game, and announcing the winner.

// The `Player` class is the base class for the different player types (civilians, mimics, and blind mimics). It contains a `name` property and default implementations of the `giveClue()` and `choosePlayerToVoteFor()` methods.

// The `CivilianPlayer` class extends the `Player` class and overrides the `giveClue()` and `choosePlayerToVoteFor()` methods to provide appropriate behavior for a civilian player. It also has a `secretWord` property to store the secret word for that player.

// The `MimicPlayer` class is similar to the `CivilianPlayer` class, but it uses the mimic word instead of the secret word.

// The `BlindMimicPlayer` class is similar to the `MimicPlayer` class, but it doesn't have a secret or mimic word, and it has an additional `guessSecretWord()` method that allows the player to guess the secret word.

// I hope this helps! Let me know if you have any questions.