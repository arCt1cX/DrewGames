let tournamentState = {
    players: [],
    totalGames: 5,
    currentGame: 0,
    scores: {},
    availableGames: ['impostor', 'colorgrid', 'guessthepic', 'timergame', 'chainreaction', 'bluffme', 'quizzy']
};

document.addEventListener('DOMContentLoaded', () => {
    initTournament();
});

function initTournament() {
    // Setup player count listener
    document.getElementById('playerCount').addEventListener('change', generatePlayerInputs);
    document.getElementById('gamesCount').addEventListener('change', updateGameCount);
    document.getElementById('startTournament').addEventListener('click', startTournament);
    
    // Generate initial player inputs
    generatePlayerInputs();
}

function generatePlayerInputs() {
    const count = parseInt(document.getElementById('playerCount').value);
    const container = document.getElementById('playerInputs');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const input = document.createElement('div');
        input.className = 'player-input';
        input.innerHTML = `
            <input type="text" id="player${i}" placeholder="Player ${i + 1} name">
        `;
        container.appendChild(input);
    }
}

function updateGameCount() {
    tournamentState.totalGames = parseInt(document.getElementById('gamesCount').value);
    document.getElementById('totalGames').textContent = tournamentState.totalGames;
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

    // Start first game
    showScreen('game-select');
    selectRandomGame();
}

function selectRandomGame() {
    const randomIndex = Math.floor(Math.random() * tournamentState.availableGames.length);
    const selectedGame = tournamentState.availableGames[randomIndex];
    document.getElementById('selectedGame').textContent = selectedGame;
    document.getElementById('currentGame').textContent = tournamentState.currentGame + 1;

    // Setup play button
    document.getElementById('playGame').onclick = () => {
        // Store current tournament state
        localStorage.setItem('tournamentState', JSON.stringify(tournamentState));
        // Navigate to the game
        window.location.href = `../${selectedGame}/index.html?tournament=true`;
    };
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Add score entry functionality
document.getElementById('submitScores').addEventListener('click', () => {
    const scoreInputs = document.querySelectorAll('.score-input input');
    scoreInputs.forEach(input => {
        const playerName = input.getAttribute('data-player');
        const score = parseInt(input.value) || 0;
        tournamentState.scores[playerName] += score;
    });

    updateRankings();
    tournamentState.currentGame++;

    if (tournamentState.currentGame >= tournamentState.totalGames) {
        showFinalResults();
    } else {
        showScreen('rankings');
    }
});

function updateRankings() {
    const rankings = tournamentState.players
        .map(player => ({
            name: player.name,
            score: tournamentState.scores[player.name]
        }))
        .sort((a, b) => b.score - a.score);

    const rankingsList = document.getElementById('rankingsList');
    rankingsList.innerHTML = rankings.map((player, index) => `
        <div class="ranking-item">
            <span>${index + 1}. ${player.name}</span>
            <span>${player.score} points</span>
        </div>
    `).join('');
}

function showFinalResults() {
    showScreen('final-results');
    const finalRankings = document.getElementById('finalRankings');
    const sortedPlayers = tournamentState.players
        .map(player => ({
            name: player.name,
            score: tournamentState.scores[player.name]
        }))
        .sort((a, b) => b.score - a.score);

    finalRankings.innerHTML = sortedPlayers.map((player, index) => `
        <div class="ranking-item ${index === 0 ? 'winner' : ''}">
            <span>${index + 1}. ${player.name}</span>
            <span>${player.score} points</span>
        </div>
    `).join('');
}

// Navigation handlers
document.getElementById('nextGame').addEventListener('click', () => {
    showScreen('game-select');
    selectRandomGame();
});

document.getElementById('newTournament').addEventListener('click', () => {
    tournamentState = {
        players: [],
        totalGames: 5,
        currentGame: 0,
        scores: {},
        availableGames: ['impostor', 'colorgrid', 'guessthepic', 'timergame', 'chainreaction', 'bluffme', 'quizzy']
    };
    showScreen('setup-screen');
});
