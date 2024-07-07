// Caption It Game Logic

const game = {
    state: 'lobby', // Possible states: 'lobby', 'caption', 'vote', 'results'
    pictureURL: '',
    captions: [], // Store submitted captions
    votes: {}, // Store votes for captions

    // Add a new player to the game
    addPlayer: function (playerID, playerName) {
        players[playerID] = {
            id: playerID,
            name: playerName,
            score: 0,
            inPlay: true,
            ready: false
        };
        updatePlayerList(); // Function to update the UI with the new player
    },

    // Generate a new picture URL
    generatePicture: function () {
        const pictures = [
            'https://example.com/pic1.jpg',
            'https://example.com/pic2.jpg',
            'https://example.com/pic3.jpg'
        ];
        this.pictureURL = pictures[Math.floor(Math.random() * pictures.length)];
    },

    // Submit a caption for the current picture
    submitCaption: function (playerID, captionText) {
        this.captions.push({
            playerID: playerID,
            text: captionText
        });
        updatePlayerList(); // Function to update the UI with the new caption
    },

    // Submit a vote for a specific caption
    submitVote: function (playerID, votedCaptionIndex) {
        this.votes[playerID] = votedCaptionIndex;

        // Check if all players have voted and update the game state
        let allPlayersVoted = true;
        for (let id in players) {
            if (players[id].inPlay && !this.votes.hasOwnProperty(id)) {
                allPlayersVoted = false;
                break;
            }
        }

        if (allPlayersVoted) {
            for (let id in players) {
                players[id].ready = false;
            }
            this.nextState();
        }
    },

    // Calculate and update scores based on the votes
    updateScores: function () {
        const voteCounts = {};

        for (let playerID in this.votes) {
            const votedIndex = this.votes[playerID];
            if (!voteCounts[votedIndex]) {
                voteCounts[votedIndex] = 0;
            }
            voteCounts[votedIndex]++;
        }

        let maxVotes = 0;
        for (let index in voteCounts) {
            if (voteCounts[index] > maxVotes) {
                maxVotes = voteCounts[index];
            }
        }

        for (let index in voteCounts) {
            if (voteCounts[index] === maxVotes) {
                const winningCaption = this.captions[index];
                players[winningCaption.playerID].score++;
            }
        }

        updateScoreBoard(); // Function to update the UI with the new scores
    },

    // Move the game to the next stage
    nextState: function () {
        switch (this.state) {
            case 'lobby':
                this.state = 'caption';
                this.generatePicture();
                break;
            case 'caption':
                this.state = 'vote';
                break;
            case 'vote':
                this.state = 'results';
                this.updateScores();
                break;
            case 'results':
                if (this.checkForWinner()) {
                    this.endGame();
                } else {
                    this.state = 'caption';
                    this.generatePicture();
                    this.captions = [];
                    this.votes = {};
                }
                break;
        }
        updateGameUI(); // Function to update the UI based on the new game state
    },

    checkForWinner: function () {
        // Define the winning score
        const winningScore = 5;
        for (let id in players) {
            if (players[id].score >= winningScore) {
                return true;
            }
        }
        return false;
    },

    endGame: function () {
        // Handle end of the game, e.g., display winner
        this.state = 'gameOver';
        updateGameUI();
    },

    resetGame: function () {
        this.state = 'lobby';
        this.pictureURL = '';
        this.captions = [];
        this.votes = {};

        for (let playerID in players) {
            players[playerID].score = 0;
        }

        updatePlayerList();
        updateScoreBoard();
        updateGameUI();
    }
};

// Additional functions to update the UI
function updateGameUI() {
    switch (game.state) {
        case 'lobby':
            document.getElementById('lobby-slide').classList.remove('no-display');
            document.getElementById('captionSlide').classList.add('no-display');
            document.getElementById('takeVote').classList.add('no-display');
            document.getElementById('announceWinner').classList.add('no-display');
            document.getElementById('gameOver').classList.add('no-display');
            break;
        case 'caption':
            document.getElementById('lobby-slide').classList.add('no-display');
            document.getElementById('captionSlide').classList.remove('no-display');
            document.getElementById('takeVote').classList.add('no-display');
            document.getElementById('announceWinner').classList.add('no-display');
            document.getElementById('gameOver').classList.add('no-display');
            displayRandomPicture();
            break;
        case 'vote':
            document.getElementById('lobby-slide').classList.add('no-display');
            document.getElementById('captionSlide').classList.add('no-display');
            document.getElementById('takeVote').classList.remove('no-display');
            document.getElementById('announceWinner').classList.add('no-display');
            document.getElementById('gameOver').classList.add('no-display');
            displayCaptionsForVoting();
            break;
        case 'results':
            document.getElementById('lobby-slide').classList.add('no-display');
            document.getElementById('captionSlide').classList.add('no-display');
            document.getElementById('takeVote').classList.add('no-display');
            document.getElementById('announceWinner').classList.remove('no-display');
            document.getElementById('gameOver').classList.add('no-display');
            updateScoreBoard();
            break;
        case 'gameOver':
            document.getElementById('lobby-slide').classList.add('no-display');
            document.getElementById('captionSlide').classList.add('no-display');
            document.getElementById('takeVote').classList.add('no-display');
            document.getElementById('announceWinner').classList.add('no-display');
            document.getElementById('gameOver').classList.remove('no-display');
            displayWinner();
            break;
    }
}

function displayWinner() {
    let winner = null;
    let maxScore = 0;
    for (let id in players) {
        if (players[id].score > maxScore) {
            maxScore = players[id].score;
            winner = players[id];
        }
    }
    const winnerContainer = document.getElementById('gameOver');
    winnerContainer.innerHTML = `<h1>Winner: ${winner.name}</h1><p>Score: ${winner.score}</p>`;
}
