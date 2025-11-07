// Game state
let gameState = {
    players: [],
    playerSelectionCount: {}, // Track how many times each player has been selected
    totalRounds: 20,
    currentRound: 0,
    phrases: {},
    usedPhrases: [],
    allPhrases: [],
    activeRules: [], // Track active rules with their end round
    ruleEndQueue: [] // Queue of rule endings to show
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
const phraseTypeLabel = document.getElementById('phrase-type-label');

// Load phrases from JSON
async function loadPhrases() {
    try {
        const response = await fetch('phrases.json');
        gameState.phrases = await response.json();
        
        // Create a weighted array of all phrases
        gameState.allPhrases = [];
        for (const [category, data] of Object.entries(gameState.phrases)) {
            const weight = data.weight || 10; // Default weight if not specified
            
            if (category === 'rule' && data.rules) {
                // Handle rules separately (they have start/end)
                data.rules.forEach((rule, index) => {
                    // Add the rule multiple times based on weight
                    for (let i = 0; i < weight; i++) {
                        gameState.allPhrases.push({
                            text: rule.start,
                            endText: rule.end,
                            category: category,
                            color: data.color,
                            isRule: true,
                            uniqueId: `rule-${index}` // Unique identifier for tracking
                        });
                    }
                });
            } else if (data.phrases) {
                // Regular phrases
                data.phrases.forEach((phrase, index) => {
                    // Add the phrase multiple times based on weight
                    for (let i = 0; i < weight; i++) {
                        gameState.allPhrases.push({
                            text: phrase,
                            category: category,
                            color: data.color,
                            isRule: false,
                            uniqueId: `${category}-${index}` // Unique identifier for tracking
                        });
                    }
                });
            }
        }
        
        console.log('Frasi caricate:', gameState.allPhrases.length, 'entries (weighted)');
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
    gameState.playerSelectionCount = {};
    
    for (let i = 1; i <= count; i++) {
        const input = document.getElementById(`player-${i}`);
        const name = input.value.trim() || `Giocatore ${i}`;
        gameState.players.push(name);
        gameState.playerSelectionCount[name] = 0; // Initialize counter
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
    // Filter out already used phrases by unique ID
    const availablePhrases = gameState.allPhrases.filter(
        phrase => !gameState.usedPhrases.includes(phrase.uniqueId)
    );
    
    // If all phrases used, reset
    if (availablePhrases.length === 0) {
        gameState.usedPhrases = [];
        console.log('Tutte le frasi usate, reset dell\'array!');
        return getRandomPhrase();
    }
    
    // Get random phrase
    const randomIndex = Math.floor(Math.random() * availablePhrases.length);
    const selectedPhrase = availablePhrases[randomIndex];
    
    // Mark as used by unique ID
    gameState.usedPhrases.push(selectedPhrase.uniqueId);
    
    return selectedPhrase;
}

// Get a weighted random player (favors less-selected players)
function getWeightedRandomPlayer(excludePlayers = []) {
    // Get available players (not in exclude list)
    const availablePlayers = gameState.players.filter(p => !excludePlayers.includes(p));
    
    if (availablePlayers.length === 0) {
        // If all players excluded, use all players
        return gameState.players[Math.floor(Math.random() * gameState.players.length)];
    }
    
    // Find the minimum selection count among available players
    const minCount = Math.min(...availablePlayers.map(p => gameState.playerSelectionCount[p]));
    
    // Players with the minimum count have higher weight
    // Create a weighted pool where less-selected players appear more times
    const weightedPool = [];
    availablePlayers.forEach(player => {
        const count = gameState.playerSelectionCount[player];
        // Weight formula: players with minCount get 3x weight, others get decreasing weight
        const weight = Math.max(1, 4 - (count - minCount));
        for (let i = 0; i < weight; i++) {
            weightedPool.push(player);
        }
    });
    
    // Select random from weighted pool
    const selectedPlayer = weightedPool[Math.floor(Math.random() * weightedPool.length)];
    gameState.playerSelectionCount[selectedPlayer]++;
    
    return selectedPlayer;
}

// Replace {player} with random player name
function replacePlaceholder(text) {
    if (text.includes('{player}')) {
        // Replace each {player} with a different random player
        let result = text;
        const usedPlayers = [];
        
        while (result.includes('{player}')) {
            // Get a weighted random player not used yet in this phrase
            const randomPlayer = getWeightedRandomPlayer(usedPlayers);
            usedPlayers.push(randomPlayer);
            
            // Replace only the first occurrence
            result = result.replace('{player}', randomPlayer);
        }
        
        return result;
    }
    return text;
}

// Show next phrase
function showNextPhrase() {
    // Check if we need to show a rule ending first (without incrementing round)
    if (gameState.ruleEndQueue.length > 0) {
        const ruleEnd = gameState.ruleEndQueue.shift();
        showRuleEnd(ruleEnd);
        return;
    }
    
    // Now increment the round
    gameState.currentRound++;
    
    // Check if game is over
    if (gameState.currentRound > gameState.totalRounds) {
        // Before showing end screen, check if there are active rules to end
        if (gameState.activeRules.length > 0) {
            // Queue all remaining active rule endings
            gameState.activeRules.forEach(rule => {
                gameState.ruleEndQueue.push(rule.endText);
            });
            gameState.activeRules = [];
            
            // Show the first rule ending
            if (gameState.ruleEndQueue.length > 0) {
                const ruleEnd = gameState.ruleEndQueue.shift();
                showRuleEnd(ruleEnd);
                return;
            }
        }
        
        // No more rules to end, show end screen
        showScreen('end-screen');
        return;
    }
    
    // Update round counter
    currentRoundSpan.textContent = gameState.currentRound;
    
    // Check for expired rules and queue their endings
    gameState.activeRules = gameState.activeRules.filter(rule => {
        if (rule.endRound === gameState.currentRound) {
            gameState.ruleEndQueue.push(rule.endText);
            return false; // Remove from active rules
        }
        return true;
    });
    
    // If we just queued a rule ending, show it (without consuming the round)
    if (gameState.ruleEndQueue.length > 0) {
        const ruleEnd = gameState.ruleEndQueue.shift();
        // Decrement round since we're showing an end, not a new phrase
        gameState.currentRound--;
        currentRoundSpan.textContent = gameState.currentRound;
        showRuleEnd(ruleEnd);
        return;
    }
    
    // Get random phrase
    const phraseObj = getRandomPhrase();
    const finalText = replacePlaceholder(phraseObj.text);
    
    // Set the type label based on category
    let typeLabel = '';
    if (phraseObj.category === 'challenge') {
        typeLabel = 'CHALLENGE!';
    } else if (phraseObj.category === 'vote') {
        typeLabel = 'VOTA!';
    } else if (phraseObj.category === 'rule' && phraseObj.isRule) {
        typeLabel = 'NUOVA REGOLA!';
    }
    
    // Update type label
    if (typeLabel) {
        phraseTypeLabel.textContent = typeLabel;
        phraseTypeLabel.classList.add('visible');
    } else {
        phraseTypeLabel.textContent = '';
        phraseTypeLabel.classList.remove('visible');
    }
    
    // If it's a rule, schedule its ending
    if (phraseObj.isRule) {
        const duration = Math.floor(Math.random() * 8) + 5; // Random 5-12 rounds
        const endRound = gameState.currentRound + duration;
        gameState.activeRules.push({
            endRound: endRound,
            endText: replacePlaceholder(phraseObj.endText)
        });
        console.log(`Regola attivata, finirà al round ${endRound}`);
    }
    
    // Update phrase text with animation
    phraseText.classList.remove('phrase-animate');
    void phraseText.offsetWidth; // Trigger reflow
    phraseText.classList.add('phrase-animate');
    phraseText.textContent = finalText;
    
    // Update background color based on category
    phraseContainer.className = 'phrase-container ' + phraseObj.category;
}

// Show rule ending
function showRuleEnd(endText) {
    phraseText.classList.remove('phrase-animate');
    void phraseText.offsetWidth;
    phraseText.classList.add('phrase-animate');
    phraseText.textContent = endText;
    
    // Hide type label for rule endings
    phraseTypeLabel.textContent = '';
    phraseTypeLabel.classList.remove('visible');
    
    // Use rule color but slightly different
    phraseContainer.className = 'phrase-container rule';
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
    gameState.activeRules = [];
    gameState.ruleEndQueue = [];
    gameState.playerSelectionCount = {};
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
