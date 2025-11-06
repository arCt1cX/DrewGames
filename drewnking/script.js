// Game state
let gameState = {
    players: [],
    totalRounds: 20,
    currentRound: 0,
    phrases: {},
    usedPhrases: [],
    allPhrases: []
};

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const playerCountSelect = document.getElementById('player-count');
const playerNamesContainer = document.getElementById('player-names-container');
const roundsCountSelect = document.getElementById('rounds-count');
const startGameBtn = document.getElementById('start-game');
const phraseContainer = document.getElementById('phrase-container');
const phraseText = document.getElementById('phrase-text');
const nextPhraseBtn = document.getElementById('next-phrase');
const currentRoundSpan = document.getElementById('current-round');
const totalRoundsSpan = document.getElementById('total-rounds');
const playAgainBtn = document.getElementById('play-again');

// Load phrases from JSON
async function loadPhrases() {
    try {
        const response = await fetch('phrases.json');
        gameState.phrases = await response.json();
        
        // Create a flat array of all phrases with their categories
        gameState.allPhrases = [];
        for (const [category, data] of Object.entries(gameState.phrases)) {
            data.phrases.forEach(phrase => {
                gameState.allPhrases.push({
                    text: phrase,
                    category: category,
                    color: data.color
                });
            });
        }
        
        console.log('Frasi caricate:', gameState.allPhrases.length);
    } catch (error) {
        console.error('Errore nel caricamento delle frasi:', error);
        alert('Errore nel caricamento del gioco. Ricarica la pagina.');
    }
}

// Generate player name inputs
function generatePlayerInputs() {
    const count = parseInt(playerCountSelect.value);
    playerNamesContainer.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'player-input';
        div.innerHTML = `
            <div class="form-group">
                <label for="player-${i}">Giocatore ${i}:</label>
                <input type="text" id="player-${i}" placeholder="Nome giocatore ${i}" maxlength="20">
            </div>
        `;
        playerNamesContainer.appendChild(div);
    }
}

// Start game
function startGame() {
    // Get player names
    const count = parseInt(playerCountSelect.value);
    gameState.players = [];
    
    for (let i = 1; i <= count; i++) {
        const input = document.getElementById(`player-${i}`);
        const name = input.value.trim() || `Giocatore ${i}`;
        gameState.players.push(name);
    }
    
    // Get total rounds
    gameState.totalRounds = parseInt(roundsCountSelect.value);
    gameState.currentRound = 0;
    gameState.usedPhrases = [];
    
    // Update UI
    totalRoundsSpan.textContent = gameState.totalRounds;
    
    // Show game screen
    showScreen('game-screen');
    
    // Show first phrase
    showNextPhrase();
}

// Get random phrase
function getRandomPhrase() {
    // Filter out already used phrases
    const availablePhrases = gameState.allPhrases.filter(
        phrase => !gameState.usedPhrases.includes(phrase.text)
    );
    
    // If all phrases used, reset
    if (availablePhrases.length === 0) {
        gameState.usedPhrases = [];
        return getRandomPhrase();
    }
    
    // Get random phrase
    const randomIndex = Math.floor(Math.random() * availablePhrases.length);
    const selectedPhrase = availablePhrases[randomIndex];
    
    // Mark as used
    gameState.usedPhrases.push(selectedPhrase.text);
    
    return selectedPhrase;
}

// Replace {player} with random player name
function replacePlaceholder(text) {
    if (text.includes('{player}')) {
        const randomPlayer = gameState.players[Math.floor(Math.random() * gameState.players.length)];
        return text.replace('{player}', randomPlayer);
    }
    return text;
}

// Show next phrase
function showNextPhrase() {
    gameState.currentRound++;
    
    // Check if game is over
    if (gameState.currentRound > gameState.totalRounds) {
        showScreen('end-screen');
        return;
    }
    
    // Update round counter
    currentRoundSpan.textContent = gameState.currentRound;
    
    // Get random phrase
    const phraseObj = getRandomPhrase();
    const finalText = replacePlaceholder(phraseObj.text);
    
    // Update phrase text with animation
    phraseText.classList.remove('phrase-animate');
    void phraseText.offsetWidth; // Trigger reflow
    phraseText.classList.add('phrase-animate');
    phraseText.textContent = finalText;
    
    // Update background color based on category
    phraseContainer.className = 'phrase-container ' + phraseObj.category;
}

// Show screen
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the selected screen
    document.getElementById(screenId).classList.add('active');
    
    // Add/remove game-active class to body based on screen
    if (screenId === 'game-screen') {
        document.body.classList.add('game-active');
    } else {
        document.body.classList.remove('game-active');
    }
}

// Reset game
function resetGame() {
    gameState.currentRound = 0;
    gameState.usedPhrases = [];
    showScreen('setup-screen');
    generatePlayerInputs();
}

// Event listeners
playerCountSelect.addEventListener('change', generatePlayerInputs);
startGameBtn.addEventListener('click', startGame);
nextPhraseBtn.addEventListener('click', showNextPhrase);
playAgainBtn.addEventListener('click', resetGame);

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadPhrases();
    generatePlayerInputs();
});
