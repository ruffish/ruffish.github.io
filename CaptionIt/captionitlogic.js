// Caption It Game Logic

const game = {
    state: 'lobby', // Possible states: 'lobby', 'caption', 'vote', 'results'
    pictureURL: '',
    captions: [], // Store submitted captions
    votes: [], // Store votes for captions

    // Add a new player to the game
    addPlayer: function (playerID, playerName) {
        players[playerID] = {
            id: playerID,
            name: playerName,
            score: 0
        };
        // Update the UI with the new player
    },

    // Generate a new picture URL
    generatePicture: function () {
        // Your logic to generate a new picture URL
        this.pictureURL = 'https://example.com/new-picture.jpg';
    },

    // Submit a caption for the current picture
    submitCaption: function (playerID, captionText) {
        this.captions.push({
            playerID: playerID,
            text: captionText
        });
        // Update the UI with the new caption
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
            // Reset each players ready status
            for (let id in players) {
                players[id].ready = false;
            }
            // Move to the next state (e.g., from vote to results)
            this.nextState();
        }
    },

    // Calculate and update scores based on the votes
    updateScores: function () {
        // Your logic to calculate scores based on the votes
        // Update the scores in the players object
        // Update the UI with the new scores
    },

    // Move the game to the next stage (e.g., from caption to vote)
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
                this.state = 'caption';
                this.generatePicture();
                break;
        }
        // Update the UI based on the new game state
    },

    resetGame: function () {
        // Reset the game state
        this.state = 'lobby';
        this.pictureURL = '';
        this.captions = [];
        this.votes = [];

        // Reset the players
        for (let playerID in players) {
            players[playerID].score = 0;
        }

        // Update the UI

    }
};