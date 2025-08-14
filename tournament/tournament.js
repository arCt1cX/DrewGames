let tournamentState = {
    players: [],
    totalGames: 5,
    currentGame: 0,
    scores: {},
    availableGames: ['impostor', 'colorgrid', 'guessthepic', 'timergame', 'chainreaction', 'BluffMe', 'quizzy'],
    usedGames: []
};

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
    
    // If showing score entry screen, generate score inputs
    if (screenId === 'score-entry') {
        const scoreInputs = document.getElementById('scoreInputs');
        scoreInputs.innerHTML = tournamentState.players.map(player => `
            <div class="score-input">
                <label>${player.name}:</label>
                <input type="number" data-player="${player.name}" min="0" value="0">
            </div>
        `).join('');
    }
}

function setupNextGame() {
    if (tournamentState.currentGame >= tournamentState.totalGames) {
        showFinalResults();
        return;
    }

    let availableGames = tournamentState.availableGames.filter(g => !tournamentState.usedGames.includes(g));
    if (availableGames.length === 0) {
        tournamentState.usedGames = [];
        availableGames = [...tournamentState.availableGames];
    }
    
    const randomIndex = Math.floor(Math.random() * availableGames.length);
    const selectedGame = availableGames[randomIndex];
    tournamentState.usedGames.push(selectedGame);

    document.getElementById('currentGame').textContent = tournamentState.currentGame + 1;
    document.getElementById('selectedGame').textContent = selectedGame;
    
    localStorage.setItem('tournamentState', JSON.stringify(tournamentState));
    
    showScreen('game-select');
    
    // Setup play button
    document.getElementById('playGame').onclick = () => {
        localStorage.setItem('tournamentState', JSON.stringify(tournamentState));
        window.location.href = `../${selectedGame}/index.html?mode=tournament`;
    };
}

function startTournament() {
    const playerInputs = document.querySelectorAll('.player-input input');
    const playerCount = playerInputs.length;
    
    // Update available games based on player count
    tournamentState.availableGames = ['impostor', 'colorgrid', 'guessthepic', 'timergame', 'BluffMe', 'quizzy'];
    // Only add Chain Reaction if player count is 3 or 6
    if (playerCount === 3 || playerCount === 6) {
        tournamentState.availableGames.push('chainreaction');
    }

    tournamentState.players = Array.from(playerInputs).map(input => ({
        name: input.value || input.placeholder,
        score: 0
    }));

    tournamentState.players.forEach(player => {
        tournamentState.scores[player.name] = 0;
    });

    setupNextGame();
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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('playerCount').addEventListener('change', generatePlayerInputs);
    document.getElementById('gamesCount').addEventListener('change', updateGameCount);
    document.getElementById('startTournament').addEventListener('click', startTournament);
    document.getElementById('submitScores').addEventListener('click', handleScoreSubmission);
    document.getElementById('nextGame').addEventListener('click', setupNextGame);
    document.getElementById('newTournament').addEventListener('click', resetTournament);
    
    generatePlayerInputs();
    updateGameCount();

    // Handle return from game
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('return') === 'true') {
        const savedState = localStorage.getItem('tournamentState');
        if (savedState) {
            tournamentState = JSON.parse(savedState);
            showScreen('score-entry');
        }
    }
});
