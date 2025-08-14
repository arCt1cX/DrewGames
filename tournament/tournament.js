let tournamentState = {
    players: [],
    totalGames: 5,
    currentGame: 0,
    scores: {},
    // Fix casing in game URLs to match directory names
    availableGames: ['impostor', 'colorgrid', 'guessthepic', 'timergame', 'chainreaction', 'BluffMe', 'quizzy']
};

document.addEventListener('DOMContentLoaded', () => {
    initTournament();
    applyTranslations();
});

function initTournament() {
    const playerCountSelect = document.getElementById('playerCount');
    const gamesCountSelect = document.getElementById('gamesCount');
    const startButton = document.getElementById('startTournament');
    
    if (playerCountSelect) playerCountSelect.addEventListener('change', generatePlayerInputs);
    if (gamesCountSelect) gamesCountSelect.addEventListener('change', updateGameCount);
    if (startButton) startButton.addEventListener('click', startTournament);
    
    // Initialize with default values
    tournamentState.totalGames = parseInt(document.getElementById('gamesCount').value) || 5;
    
    // Generate initial player inputs
    generatePlayerInputs();
}

function updateGameCount(event) {
    const newCount = parseInt(event.target.value);
    if (!isNaN(newCount)) {
        tournamentState.totalGames = newCount;
        const totalGamesSpan = document.getElementById('totalGames');
        if (totalGamesSpan) {
            totalGamesSpan.textContent = newCount;
        }
    }
}

function generatePlayerInputs() {
    const count = parseInt(document.getElementById('playerCount').value);
    const container = document.getElementById('playerInputs');
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const input = document.createElement('div');
        input.className = 'player-input';
        input.innerHTML = `
            <input type="text" id="player${i}" placeholder="Player ${i + 1}" required>
        `;
        container.appendChild(input);
    }
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

    setupNextGame();
}

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

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
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
