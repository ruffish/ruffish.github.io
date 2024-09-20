// Constants and Global Variables
const peer = new Peer(null, {
    host: 'juniper-silent-shawl.glitch.me',  // Your Glitch PeerJS server
    path: '/myapp',                          // The path you set in your server code
    secure: true,
    debug: 2,
  });
let connections = [];
let isHost = false;
let playerId = null;
let players = {};
let gameSettings = {
    timeLimit: 60,
    pointsToWin: 10,
};
let currentImage = null;
let captions = {};
let votes = {};
let scores = {};
let isInSuddenDeath = false;

// Debug Console
const debugConsole = document.getElementById('debug-console');
const debugStartNewRoundButton = document.getElementById('debug-start-new-round-button');
debugStartNewRoundButton.addEventListener('click', () => {
    startNewRound();
});

// DOM Elements
const progressBar = document.getElementById('progress-bar');
const lobbyDiv = document.getElementById('lobby');
const gameScreenDiv = document.getElementById('game-screen');
const hostOptionsDiv = document.getElementById('host-options');
const joinInfoDiv = document.getElementById('join-info');
const playersList = document.getElementById('players-list');
const gameLinkInput = document.getElementById('game-link');
const startGameButton = document.getElementById('start-game');

const displayTimeLimit = document.getElementById('display-time-limit');
const displayPointsToWin = document.getElementById('display-points-to-win');

const imageContainer = document.getElementById('image-container');
const currentImageElement = document.getElementById('current-image');
const captionInputContainer = document.getElementById('caption-input-container');
const captionCardsList = document.getElementById('caption-cards');
const customCaptionInput = document.getElementById('custom-caption');
const submitCaptionButton = document.getElementById('submit-caption');

const votingCallToAction = document.getElementById('voting-cta');
const votingContainer = document.getElementById('voting-container');
const captionsList = document.getElementById('captions-list');

const voteWinnersContainer = document.getElementById('vote-winners-container');
const voteWinnersList = document.getElementById('vote-winners-list');

const chatContainer = document.getElementById('chat-container');
const chatMessagesDiv = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');

const scoreboardList = document.getElementById('score-list');

// Initialize PeerJS
peer.on('open', (id) => {
    playerId = id;
    initializeGame();
});

// Handle Incoming Connections
peer.on('connection', (conn) => {
    conn.on('open', () => {
        connections.push(conn);
        conn.on('data', handleData);
    });
});

// Function to Initialize the Game
function initializeGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const hostId = urlParams.get('host');

    if (hostId) {
        // Join as Player
        isHost = false;
        const conn = peer.connect(hostId);
        conn.on('open', () => {
            connections.push(conn);
            conn.on('data', handleData);
            sendData(conn, { type: 'join', playerId, name: `Player ${playerId.substring(0, 5)}` });
        });
        // Do NOT hide the lobby screen for joining players
        // Hide host-specific options
        hostOptionsDiv.classList.add('hidden');
        gameLinkInput.value = `${window.location.origin}${window.location.pathname}?host=${hostId}`;
    } else {
        // Host the Game
        isHost = true;
        gameLinkInput.value = `${window.location.href}?host=${playerId}`;
        players[playerId] = { name: `Host (${playerId.substring(0, 5)})`, score: 0 };
        updatePlayersList();
    }
    updateGameSettingsDisplay();
}

// Update Players List in Lobby
function updatePlayersList() {
    playersList.innerHTML = '';
    for (const id in players) {
        const li = document.createElement('li');
        li.textContent = players[id].name;
        playersList.appendChild(li);
    }
}

// Update Game Settings Display
function updateGameSettingsDisplay() {
    displayTimeLimit.textContent = gameSettings.timeLimit;
    displayPointsToWin.textContent = gameSettings.pointsToWin;
}

// Change Your Name
function changePlayerName(newName) {
    // Update the player's name locally
    players[playerId].name = newName;
    
    // Update the players list in the UI
    updatePlayersList();

    // Broadcast the name change to all other players
    broadcast({
        type: 'nameChange',
        playerId: playerId,
        newName: newName
    });
}

// Handle Data Received from Peers
function handleData(data) {
    switch (data.type) {
        case 'join':
            players[data.playerId] = { name: data.name, score: 0 };
            updatePlayersList();
            broadcast({ type: 'updatePlayers', players });
            break;
        case 'updatePlayers':
            players = data.players;
            updatePlayersList();
            break;
        case 'nameChange':
            // Update the player's name
            players[data.playerId].name = data.newName;
            updatePlayersList();
            if (isHost) {
                broadcast({type: "updatePlayers", players})
            }
            break;
        case 'startGame':
            gameSettings = data.gameSettings;
            updateGameSettingsDisplay();
            startGame();
            break;
        case 'roundTimer':
            if (progressBar) {
                let progressPercentage = (data.time / gameSettings.timeLimit) * 100;
                progressBar.style.width = `${progressPercentage}%`;
            } else {
                console.log("Progress bar element not found.");
            }
            break;
        case 'broadcastChat':
            broadcast({ type: 'chat', message: data.message, sender: data.sender });
            break;
        case 'chat':
            addChatMessage(data.message, data.sender);
            break;
        case 'newRound':
            console.log("RECEIVED BROADCAST newRound")
            currentImage = data.image;
            isInSuddenDeath = data.isInSuddenDeath;
            startNewRound();
            break;
        case 'submitCaption':
            if (isHost) {
                captions[data.playerId] = data.caption;
                if (Object.keys(captions).length === Object.keys(players).length) {
                    broadcast({type: 'startVoting', captions});
                    startVoting();
                }
            }
            break;
        case 'startVoting':
            captions = data.captions
            startVoting()
            break;
        case 'vote':
            if (isHost) {
                votes[data.playerId] = data.vote;
                const expectedVotes = Object.keys(players).length;
                if (Object.keys(votes).length === expectedVotes) {
                    calculateScores();
                }
            }
            break;
        case 'showVoteWinners':
            votingContainer.classList.add('hidden');
            voteWinnersContainer.innerHTML = data.winnersHtml
            voteWinnersContainer.classList.remove("hidden");
            break;
        case 'updateScores':
            scores = data.scores;
            updateScoreboard();
            if (data.winner && isHost == false) {
                alert(`Player ${players[data.winner].name} wins the game!`);
            }
            break;
    }
}

// Send Data to All Connected Peers
function broadcast(data) {
    connections.forEach(conn => {
        sendData(conn, data);
    });
}

// Send Data to a Specific Connection
function sendData(conn, data) {
    conn.send(data);
}

// Start the Game (Host)
startGameButton.addEventListener('click', () => {
    gameSettings.timeLimit = parseInt(document.getElementById('time-limit').value);
    gameSettings.pointsToWin = parseInt(document.getElementById('points-to-win').value);
    updateGameSettingsDisplay();
    broadcast({ type: 'startGame', gameSettings });
    startGame();
});

// Start the Game (All)
function startGame() {
    lobbyDiv.classList.add('hidden');
    gameScreenDiv.classList.remove('hidden');
    scores = {};
    for (const id in players) {
        scores[id] = 0;
    }
    updateScoreboard();
    startNewRound();
}

async function startNewRound() {
    const loadingIcon = document.getElementById('loading-icon');
    const currentImageElement = document.getElementById('current-image');
    // Show the loading icon before loading the image
    currentImageElement.style.display = 'none';

    if (isHost) {
        loadingIcon.style.display = 'block';  // Show the loading icon
        currentImage = await getRandomImage();  // Load the image
        cImage = currentImage;
        isInSuddenDeath = checkSuddenDeath();
        broadcast({ type: 'newRound', image: cImage, isInSuddenDeath });
    }

    loadingIcon.style.display = 'block';
    // Set the image source and hide the loading icon when it finishes loading
    currentImageElement.src = currentImage;
    currentImageElement.onload = () => {
        loadingIcon.style.display = 'none';  // Hide the loading icon once the image is loaded
        currentImageElement.style.display = 'block';
    };

    votingCallToAction.textContent = 'Select the Funniest Caption:';
    voteWinnersContainer.classList.add("hidden");
    voteWinnersList.innerHTML = "";
    captions = {};
    votes = {};
    startRound();
}

// Declare roundTimer and roundTimeout globally (only once)
let roundTimer = null;  // Store the interval ID for the round timer
let roundTimeout = null;  // Store the timeout ID for the auto-submit

// Start Round for All Players
function startRound() {
    captionInputContainer.classList.remove('hidden');
    votingContainer.classList.add('hidden');
    captionCardsList.innerHTML = ''; // Clear previous captions
    customCaptionInput.value = '';   // Clear the caption input field

    let timeLeft = gameSettings.timeLimit;
    let totalTime = gameSettings.timeLimit;

    // Clear previous interval and timeout to avoid conflicts
    if (roundTimer) {
        clearInterval(roundTimer);  // Clear the interval timer
    }

    if (roundTimeout) {
        clearTimeout(roundTimeout);  // Clear the timeout for submitting captions
    }

    // Update the progress bar every second
    if (isHost) {
        roundTimer = setInterval(() => {
            timeLeft--;

            const progressPercentage = (timeLeft / totalTime) * 100;
            progressBar.style.width = `${progressPercentage}%`;

            // Broadcast the remaining time to clients
            broadcast({ type: 'roundTimer', time: timeLeft });

            // If time is up, clear the interval
            if (timeLeft <= 0) {
                clearInterval(roundTimer);
            }
        }, 1000);

        // Automatically submit an empty caption if time runs out
        roundTimeout = setTimeout(() => {
                startVoting();
                broadcast({type: "startVoting", captions});
        }, gameSettings.timeLimit * 1000); // Set timeout to match the game time limit
    }
}

// Submit Caption
customCaptionInput.addEventListener('keydown', (event) => {
    // Check if the pressed key is "Enter"
    if (event.key === 'Enter') {
        const caption = customCaptionInput.value.trim();
        if (caption) {
            submitCaption(caption);
        } else {
            alert('Please enter a caption.');
        }
    }
});

submitCaptionButton.addEventListener('click', () => {
    const caption = customCaptionInput.value.trim();
    if (caption) {
        submitCaption(caption);
    } else {
        alert('Please enter a caption.');
    }
});

function submitCaption(caption) {
    captions[playerId] = caption;
    if (isHost) {
        handleData({ type: 'submitCaption', playerId, caption });
    } else {
        sendData(connections[0], { type: 'submitCaption', playerId, caption });
    }
    captionInputContainer.classList.add('hidden');
}

// Start Voting Phase
function startVoting() {
    if (roundTimer) {
        clearTimeout(roundTimer);
        clearTimeout(roundTimeout); 
        const progressPercentage = 0;
        progressBar.style.width = `${progressPercentage}%`;
    }
    votingContainer.classList.remove('hidden');
    captionsList.innerHTML = '';
    captionInputContainer.classList.add('hidden');

    let captionsLength = Object.keys(captions).length

    if (captionsLength == 1) {
        if (isHost) {
            handleData({ type: 'vote', playerId: '0000', vote: Object.keys(captions)[0]});
            calculateScores()
        }
        return
    } else if (captionsLength == 0 ) {
        // Add no caption submitted handling. Just show a no winners card and start a new round.
    }

    // Count how many captions are available for the user to vote on (excluding their own)
    let visibleCaptions = 0;
    for (const id in captions) {
        if (id !== playerId) {  // Exclude the current player's caption
            visibleCaptions++;
            const li = document.createElement('li');
            li.textContent = captions[id];
            li.dataset.playerId = id;
            li.classList.add('caption-item');
            li.addEventListener('click', () => {
                submitVote(li.dataset.playerId, li);
            });
            captionsList.appendChild(li);
        }
    }

    // If there are no captions to vote on, show a waiting message
    if (visibleCaptions === 0) {
        votingCallToAction.textContent = 'Waiting for others to finish voting...';
    }
}

// Submit Vote
function submitVote(votedPlayerId, selectedElement) {
    votes[playerId] = votedPlayerId;
    votingCallToAction.textContent = 'Waiting for others to finish voting...';

    // Highlight the selected caption with a green border
    highlightSelectedCaption(selectedElement);

    if (isHost) {
        // Host processes the vote
        handleData({ type: 'vote', playerId, vote: votedPlayerId });
    } else {
        // Send vote to host
        sendData(connections[0], { type: 'vote', playerId, vote: votedPlayerId });
    }
}

// Function to highlight the selected caption
function highlightSelectedCaption(selectedElement) {
    // Remove highlight from all other captions
    const allCaptions = document.querySelectorAll('.caption-item');
    allCaptions.forEach(caption => {
        caption.style.border = 'none';  // Remove any existing border
    });

    // Add green border to the selected caption
    selectedElement.style.border = '2px solid green';
}

// Calculate Scores (Host)
function calculateScores() {
    console.log("Votes: ", votes)
    const voteCounts = {};
    for (const voterId in votes) {
        const votedId = votes[voterId];
        if (!voteCounts[votedId]) {
            voteCounts[votedId] = 0;
        }
        voteCounts[votedId]++;
    }

    let maxVotes = 0;
    let winners = [];
    for (const id in voteCounts) {
        if (voteCounts[id] > maxVotes) {
            maxVotes = voteCounts[id];
            winners = [id];
        } else if (voteCounts[id] === maxVotes) {
            winners.push(id);
        }
    }

    console.log("Winners: ", winners)

    winners.forEach(id => {
        scores[id]++;

        const li = document.createElement('li');
        li.innerHTML = `<h4>${id}</h4><p>${captions[id]}</p>`
        li.classList.add('vote-winners-item');
        voteWinnersList.appendChild(li);
    });

    broadcast({type: "showVoteWinners", winnersHtml: voteWinnersContainer.innerHTML})
    votingContainer.classList.add('hidden');
    voteWinnersContainer.classList.remove("hidden");

    let gameWinner = null;
    for (const id in scores) {
        if (scores[id] >= gameSettings.pointsToWin) {
            gameWinner = id;
            break;
        }
    }

    // Broadcast updated scores and check for game winner
    handleData({ type: 'updateScores', scores, winner: gameWinner });
    broadcast({ type: 'updateScores', scores, winner: gameWinner });

    if (gameWinner) {
        alert(`Player ${players[gameWinner].name} wins the game!`);
    } else {
        // Start a new round after a short delay
        setTimeout(startNewRound, 6000);
    }
}

// Update Scoreboard
function updateScoreboard() {
    scoreboardList.innerHTML = '';
    for (const id in scores) {
        const li = document.createElement('li');
        li.textContent = `${players[id].name}: ${scores[id]} points`;
        scoreboardList.appendChild(li);
    }
}

// Check for Sudden Death
function checkSuddenDeath() {
    let playersOnMatchPoint = 0;
    for (const id in scores) {
        if (scores[id] === gameSettings.pointsToWin - 1) {
            playersOnMatchPoint++;
        }
    }
    return playersOnMatchPoint >= 2;
}

// Add Chat Message
function addChatMessage(message, sender) {
    const p = document.createElement('p');
    let senderName = "";
    if (sender == "SYS") {
        senderName = ""
        p.style.color = "red";
    } else {
        senderName = players[sender].name + ":";
    }
    p.innerHTML = `<strong>${senderName}</strong> ${message}`;
    chatMessagesDiv.appendChild(p);
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

chatInput.addEventListener('keydown', (event) => {
    // Check if the pressed key is "Enter"
    if (event.key === 'Enter') {
        const message = chatInput.value.trim();
    
        if (message) {
            // If it's a regular chat message, broadcast it
            if (isHost) {
                addChatMessage(message, playerId);
                broadcast({ type: 'chat', message, sender: playerId });

                // Check if the message starts with "/"
                if (message.startsWith('/')) {
                    // Extract the command from the message (everything after the "/")
                    const command = message.substring(1).toLowerCase(); // Make it case-insensitive
                    executeDebugCommand(command);
                }
            } else {
                sendData(connections[0], { type: 'broadcastChat', message, sender: playerId });
            }
            
            // Clear the chat input after sending the message
            chatInput.value = '';
        }
    }
})

// Send Chat Message
sendChatButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    
    if (message) {
        // If it's a regular chat message, broadcast it
        if (isHost) {
            addChatMessage(message, playerId);
            broadcast({ type: 'chat', message, sender: playerId });

            // Check if the message starts with "/"
            if (message.startsWith('/')) {
                // Extract the command from the message (everything after the "/")
                const command = message.substring(1).toLowerCase(); // Make it case-insensitive
                executeDebugCommand(command);
            }
        } else {
            sendData(connections[0], { type: 'broadcastChat', message, sender: playerId });
        }
        
        // Clear the chat input after sending the message
        chatInput.value = '';
    }
});

// Function to get random people images from Pexels
async function getRandomImage(randomPictureModeEnabled = true) {
    if (randomPictureModeEnabled) {
        const searchPrompts = [
            'people',
            'miserable people',
            'wtf people'
        ]
        let searchPromptIndex = Math.floor(Math.random() * searchPrompts.length)
        let page = Math.floor(Math.random() * 50)
        console.log("PROMPT: ", searchPrompts[searchPromptIndex])
        try {
            const apiKey = 'sFusXGDCXZBtZX33bkn7gprxn7JU1GrStIjnZ38xcRJOQEb8BE5XXKod';  // Your Pexels API Key
            const response = await fetch(`https://api.pexels.com/v1/search?query=${searchPrompts[searchPromptIndex]}&page=${page}&per_page=80`, {
                headers: {
                    Authorization: apiKey
                }
            });
            // Log the rate limit headers
            const rateLimit = response.headers.get('X-Ratelimit-Limit');
            const rateRemaining = response.headers.get('X-Ratelimit-Remaining');
            const rateReset = response.headers.get('X-Ratelimit-Reset');

            console.log(`Rate Limit: ${rateLimit}`);
            console.log(`Requests Remaining: ${rateRemaining}`);
            console.log(`Rate Limit Reset Time (UNIX timestamp): ${rateReset}`);

            const data = await response.json();

            if (data.photos.length > 0) {
                const imageUrl = data.photos[Math.floor(Math.random() * data.photos.length)].src.large;  
                return `${imageUrl}`;
            } else {
                console.error('No images found for the query.');
                return 'https://via.placeholder.com/600x400?text=No+Images+Found';
            }
        } catch (error) {
            console.error('Failed to fetch random image:', error);
            // Fallback in case of an error
            return 'https://via.placeholder.com/600x400?text=Error+Loading+Image';
        }
    } else {
        // Fallback to the predefined image list
        const images = [
            'https://via.placeholder.com/600x400?text=Funny+Image+1',
            'https://via.placeholder.com/600x400?text=Funny+Image+2',
            'https://via.placeholder.com/600x400?text=Funny+Image+3',
        ];
        return images[Math.floor(Math.random() * images.length)];
    }
}

// Extra Options

// Handle Name Change
const changeNameButton = document.getElementById('change-name-button');
const newPlayerNameInput = document.getElementById('new-player-name');

changeNameButton.addEventListener('click', () => {
    const newName = newPlayerNameInput.value.trim();
    if (newName) {
        changePlayerName(newName);
    } else {
        alert('Please enter a valid name.');
    }
});

// Debug Commands

function executeDebugCommand(command) {
    // Handle specific commands
    switch (command) {
        case 'debug':
            // Open the debug console or perform debug actions
            if (debugConsole.classList.contains('hidden')) {
                debugConsole.classList.remove("hidden");
                addChatMessage('Debug mode enabled', "SYS");
            } else {
                debugConsole.classList.add("hidden");
                addChatMessage('Debug mode disabled', "SYS");
            }
            break;
        case 'help':
            // Example of a help command that shows available commands
            addChatMessage('Available commands: /debug, /help');
            break;
        case 'clear':
            // Clear the chat messages
            chatMessagesDiv.innerHTML = '';
            addChatMessage('Chat cleared', playerId);
            break;
        default:
            // If the command is not recognized
            addChatMessage(`Unknown command: ${command}`, playerId);
            break;
    }
}