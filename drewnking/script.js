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
    ruleEndQueue: [], // Queue of rule endings to show
    customPercentages: false, // Track if custom percentages are enabled
    categoryWeights: {} // Store custom weights
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
const customPercentagesToggle = document.getElementById('custom-percentages-toggle');
const percentagesControls = document.getElementById('percentages-controls');
const normalPercentageInput = document.getElementById('normal-percentage');
const challengePercentageInput = document.getElementById('challenge-percentage');
const votePercentageInput = document.getElementById('vote-percentage');
const rulePercentageInput = document.getElementById('rule-percentage');
const percentageTotalSpan = document.getElementById('percentage-total');
const percentageWarning = document.getElementById('percentage-warning');

// Load phrases from JSON
async function loadPhrases() {
    try {
        const response = await fetch('phrases.json');
        gameState.phrases = await response.json();
        
        // Determine weights to use
        let categoryWeights = {};
        if (gameState.customPercentages) {
            // Use custom percentages
            categoryWeights = gameState.categoryWeights;
        } else {
            // Use default weights from JSON
            for (const [category, data] of Object.entries(gameState.phrases)) {
                categoryWeights[category] = data.weight || 10;
            }
        }
        
        // Create a weighted array of all phrases
        gameState.allPhrases = [];
        for (const [category, data] of Object.entries(gameState.phrases)) {
            const weight = categoryWeights[category] || 10;
            
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
    
    // For rules, we need to replace placeholders in both start and end with the SAME players
    let finalText;
    let finalEndText;
    
    if (phraseObj.isRule && (phraseObj.text.includes('{player}') || phraseObj.endText.includes('{player}'))) {
        // Count how many {player} placeholders we need
        const startMatches = (phraseObj.text.match(/{player}/g) || []).length;
        const endMatches = (phraseObj.endText.match(/{player}/g) || []).length;
        const totalMatches = Math.max(startMatches, endMatches);
        
        // Generate the same players for both start and end
        const selectedPlayers = [];
        for (let i = 0; i < totalMatches; i++) {
            const player = getWeightedRandomPlayer(selectedPlayers);
            selectedPlayers.push(player);
        }
        
        // Replace placeholders in start text
        finalText = phraseObj.text;
        selectedPlayers.forEach(player => {
            finalText = finalText.replace('{player}', player);
        });
        
        // Replace placeholders in end text (reuse same players)
        finalEndText = phraseObj.endText;
        selectedPlayers.forEach(player => {
            finalEndText = finalEndText.replace('{player}', player);
        });
    } else {
        // Normal phrase or rule without placeholders
        finalText = replacePlaceholder(phraseObj.text);
        if (phraseObj.isRule) {
            finalEndText = phraseObj.endText; // No placeholders to replace
        }
    }
    
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
            endText: finalEndText
        });
        console.log(`Regola attivata, finirà al round ${endRound}`);
    }
    
    // Update phrase text with animation
    phraseText.classList.remove('phrase-animate');
    void phraseText.offsetWidth; // Trigger reflow
    
    // Hide text while calculating size
    phraseText.style.opacity = '0';
    phraseText.textContent = finalText;
    
    // Auto-scale text if needed
    autoScaleText();
    
    // Show text with animation after sizing is done
    setTimeout(() => {
        phraseText.style.opacity = '1';
        phraseText.classList.add('phrase-animate');
    }, 10);
    
    // Update background color based on category
    phraseContainer.className = 'phrase-container ' + phraseObj.category;
}

// Auto-scale text to fit container
function autoScaleText() {
    const container = phraseContainer;
    const text = phraseText;
    
    // Determine initial font size based on screen width
    const isMobile = window.innerWidth <= 480;
    const defaultFontSize = isMobile ? 1.1 : 1.5;
    const minFontSize = isMobile ? 0.75 : 0.9;
    
    // Reset to default size
    text.style.fontSize = defaultFontSize + 'rem';
    
    // Get available height (container height minus padding and label)
    const containerHeight = container.clientHeight;
    const typeLabel = phraseTypeLabel;
    const labelHeight = typeLabel.classList.contains('visible') ? typeLabel.offsetHeight + 24 : 0; // 24px margin
    const paddingVertical = isMobile ? 48 : 96; // Total vertical padding (24px or 48px each side)
    const availableHeight = containerHeight - paddingVertical - labelHeight;
    
    // Check if text overflows and scale down if needed
    let fontSize = defaultFontSize;
    
    while (text.scrollHeight > availableHeight && fontSize > minFontSize) {
        fontSize -= 0.05;
        text.style.fontSize = fontSize + 'rem';
    }
}

// Show rule ending
function showRuleEnd(endText) {
    phraseText.classList.remove('phrase-animate');
    void phraseText.offsetWidth;
    
    // Hide text while calculating size
    phraseText.style.opacity = '0';
    phraseText.textContent = endText;
    
    // Auto-scale text if needed
    autoScaleText();
    
    // Show text with animation after sizing is done
    setTimeout(() => {
        phraseText.style.opacity = '1';
        phraseText.classList.add('phrase-animate');
    }, 10);
    
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
    // Save current players
    const savedPlayers = [...gameState.players];
    
    gameState.currentRound = 0;
    gameState.usedPhrases = [];
    gameState.activeRules = [];
    gameState.ruleEndQueue = [];
    gameState.playerSelectionCount = {};
    
    showScreen('setup-screen');
    
    // Restore player count
    playerCountSelect.value = savedPlayers.length;
    generatePlayerInputs();
    
    // Restore player names
    savedPlayers.forEach((name, index) => {
        const input = document.getElementById(`player-${index + 1}`);
        if (input) {
            input.value = name;
        }
    });
}

// Toggle custom percentages
function toggleCustomPercentages() {
    const isChecked = customPercentagesToggle.checked;
    percentagesControls.style.display = isChecked ? 'block' : 'none';
    
    if (isChecked) {
        updatePercentageTotal();
    }
}

// Update percentage total and validate
function updatePercentageTotal() {
    const normal = parseInt(normalPercentageInput.value) || 0;
    const challenge = parseInt(challengePercentageInput.value) || 0;
    const vote = parseInt(votePercentageInput.value) || 0;
    const rule = parseInt(rulePercentageInput.value) || 0;
    
    const total = normal + challenge + vote + rule;
    percentageTotalSpan.textContent = total;
    
    // Show warning if not 100%
    if (total !== 100) {
        percentageWarning.style.display = 'inline-block';
        percentageTotalSpan.style.color = '#ff6b6b';
        startGameBtn.disabled = true;
        startGameBtn.style.opacity = '0.5';
        startGameBtn.style.cursor = 'not-allowed';
    } else {
        percentageWarning.style.display = 'none';
        percentageTotalSpan.style.color = '#2ecc71';
        startGameBtn.disabled = false;
        startGameBtn.style.opacity = '1';
        startGameBtn.style.cursor = 'pointer';
    }
}

// Save custom percentages
function saveCustomPercentages() {
    if (customPercentagesToggle.checked) {
        gameState.customPercentages = true;
        gameState.categoryWeights = {
            normal: parseInt(normalPercentageInput.value) || 0,
            challenge: parseInt(challengePercentageInput.value) || 0,
            vote: parseInt(votePercentageInput.value) || 0,
            rule: parseInt(rulePercentageInput.value) || 0
        };
    } else {
        gameState.customPercentages = false;
        gameState.categoryWeights = {};
    }
}

// Event listeners
playerCountSelect.addEventListener('change', generatePlayerInputs);
startGameBtn.addEventListener('click', () => {
    saveCustomPercentages();
    startGame();
});
nextPhraseBtn.addEventListener('click', showNextPhrase);
playAgainBtn.addEventListener('click', resetGame);
customPercentagesToggle.addEventListener('change', toggleCustomPercentages);
normalPercentageInput.addEventListener('input', updatePercentageTotal);
challengePercentageInput.addEventListener('input', updatePercentageTotal);
votePercentageInput.addEventListener('input', updatePercentageTotal);
rulePercentageInput.addEventListener('input', updatePercentageTotal);

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadPhrases();
    generatePlayerInputs();
});
