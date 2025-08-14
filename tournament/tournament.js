let tournamentState = {
    players: [],
    totalGames: 5,
    currentGame: 0,
    scores: {},
    availableGames: ['impostor', 'colorgrid', 'guessthepic', 'timergame', 'chainreaction', 'BluffMe', 'quizzy'],
    usedGames: []
};

// Define core functions first
function updateGameCount() {
    tournamentState.totalGames = parseInt(document.getElementById('gamesCount').value);
    document.getElementById('totalGames').textContent = tournamentState.totalGames;
}

function generatePlayerInputs() {
    const count = parseInt(document.getElementById('playerCount').value);
    const container = document.getElementById('playerInputs');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const input = document.createElement('div');
        input.className = 'player-input';
        input.innerHTML = `
            <input type="text" id="player${i}" placeholder="Player ${i + 1}">
        `;
        container.appendChild(input);
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startTournament() {
    // Collect player names
    const playerInputs = document.querySelectorAll('.player-input input');
    tournamentState.players = Array.from(playerInputs).map(input => ({
        name: input.value || input.placeholder,
        score: 0
    }));

    // Initialize scores
    tournamentState.players.forEach(player => {
        tournamentState.scores[player.name] = 0;
    });

    // Generate score input fields
    const scoreInputs = document.getElementById('scoreInputs');
    scoreInputs.innerHTML = tournamentState.players.map(player => `
        <div class="score-input">
            <label>${player.name}</label>
            <input type="number" data-player="${player.name}" min="0" value="0">
        </div>
    `).join('');

    // Start first game
    tournamentState.currentGame = 0;
    setupNextGame();
}

// Initialize tournament when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Setup initial event listeners
    document.getElementById('playerCount').addEventListener('change', generatePlayerInputs);
    document.getElementById('gamesCount').addEventListener('change', updateGameCount);
    document.getElementById('startTournament').addEventListener('click', startTournament);
    document.getElementById('submitScores').addEventListener('click', handleScoreSubmission);
    document.getElementById('nextGame').addEventListener('click', setupNextGame);
    document.getElementById('newTournament').addEventListener('click', resetTournament);
    
    // Initialize with default values
    generatePlayerInputs();
    updateGameCount();
});

function setupNextGame() {
    if (tournamentState.currentGame >= tournamentState.totalGames) {
        showFinalResults();
        return;
    }

    // Select random game
    let availableGames = tournamentState.availableGames.filter(g => !tournamentState.usedGames.includes(g));
    if (availableGames.length === 0) {
        tournamentState.usedGames = []; // Reset used games if all have been played
        availableGames = [...tournamentState.availableGames];
    }
    
    const randomIndex = Math.floor(Math.random() * availableGames.length);
    const selectedGame = availableGames[randomIndex];
    tournamentState.usedGames.push(selectedGame);

    // Update UI
    document.getElementById('currentGame').textContent = tournamentState.currentGame + 1;
    document.getElementById('selectedGame').textContent = selectedGame;
    
    // Save state and prepare for game
    localStorage.setItem('tournamentState', JSON.stringify(tournamentState));
    
    showScreen('game-select');
}

function handleScoreSubmission() {
    const scoreInputs = document.querySelectorAll('.score-input input');
    scoreInputs.forEach(input => {
        const playerName = input.getAttribute('data-player');
        const score = parseInt(input.value) || 0;
        tournamentState.scores[playerName] += score;
    });

    tournamentState.currentGame++;
    updateRankings();
    
    if (tournamentState.currentGame >= tournamentState.totalGames) {
        showFinalResults();
    } else {
        showScreen('rankings');
    }
}

function updateRankings() {
    const rankings = tournamentState.players
        .map(player => ({
            name: player.name,
            score: tournamentState.scores[player.name]
        }))
        .sort((a, b) => b.score - a.score);

    const rankingsList = document.getElementById('rankingsList');
    rankingsList.innerHTML = rankings.map((player, index) => `
        <div class="ranking-item ${index === 0 ? 'winner' : ''}">
            <span>${index + 1}. ${player.name}</span>
            <span>${player.score} ${getTranslation('points')}</span>
        </div>
    `).join('');
}

function showFinalResults() {
    showScreen('final-results');
    updateRankings();
}

function resetTournament() {
    tournamentState = {
        players: [],
        totalGames: 5,
        currentGame: 0,
        scores: {},
        availableGames: ['impostor', 'colorgrid', 'guessthepic', 'timergame', 'chainreaction', 'BluffMe', 'quizzy'],
        usedGames: []
    };
    showScreen('setup-screen');
    generatePlayerInputs();
}

// Handle game return
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('return') === 'true') {
        const savedState = localStorage.getItem('tournamentState');
        if (savedState) {
            tournamentState = JSON.parse(savedState);
            showScreen('score-entry');
        }
    }
});
});
