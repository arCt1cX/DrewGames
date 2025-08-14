let tournamentState = {
    players: [],
    totalGames: 5,
    currentGame: 0,
    scores: {},
    availableGames: ['impostor', 'colorgrid', 'guessthepic', 'timergame', 'chainreaction', 'BluffMe', 'quizzy'],
    gameWeights: {},  // New property to track game weights
    usedGames: [],     // Keep this to track history but not for filtering
    doublePointsGames: [],
    doublePointsUsed: false,
    lastGameWasDouble: false
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
    
    // If showing score entry screen, generate player buttons
    if (screenId === 'score-entry') {
        const scoreInputs = document.getElementById('scoreInputs');
        scoreInputs.innerHTML = tournamentState.players.map(player => `
            <div class="score-input" data-player="${player.name}">
                <div class="player-name">${player.name}</div>
                <div class="score-indicator">🏆</div>
            </div>
        `).join('');

        // Add click handlers to player names
        document.querySelectorAll('.score-input').forEach(el => {
            let hasPoint = false;
            el.addEventListener('click', () => {
                const indicator = el.querySelector('.score-indicator');
                hasPoint = !hasPoint;
                el.classList.toggle('selected', hasPoint);
                indicator.style.opacity = hasPoint ? '1' : '0.2';
            });
        });
    }
}

function setupNextGame() {
    if (tournamentState.currentGame >= tournamentState.totalGames) {
        showFinalResults();
        return;
    }

    // Calculate total weight
    const totalWeight = Object.values(tournamentState.gameWeights).reduce((a, b) => a + b, 0);
    
    // Generate random value between 0 and total weight
    let random = Math.random() * totalWeight;
    let selectedGame = tournamentState.availableGames[0]; // Default fallback
    
    // Select game based on weights
    for (const game of tournamentState.availableGames) {
        random -= tournamentState.gameWeights[game];
        if (random <= 0) {
            selectedGame = game;
            break;
        }
    }

    // Reduce the weight for the selected game
    tournamentState.gameWeights[selectedGame] = Math.max(
        20, // Minimum 20% chance to be picked
        tournamentState.gameWeights[selectedGame] - 30 // Reduce by 30% each time
    );

    tournamentState.usedGames.push(selectedGame); // Keep for history
    
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

    // Initialize game weights
    tournamentState.gameWeights = {};
    tournamentState.availableGames.forEach(game => {
        tournamentState.gameWeights[game] = 100; // Start with 100% chance
    });

    tournamentState.currentGame = 0;

    // Set up double points games based on tournament length
    tournamentState.doublePointsGames = [];
    if (tournamentState.totalGames === 5) {
        // One double points game between 3rd and 5th game
        const doubleGame = Math.floor(Math.random() * 3) + 3;
        tournamentState.doublePointsGames.push(doubleGame);
    } else if (tournamentState.totalGames === 10) {
        // Two double points games after first game
        while (tournamentState.doublePointsGames.length < 2) {
            const game = Math.floor(Math.random() * 9) + 2;
            if (!tournamentState.doublePointsGames.includes(game)) {
                tournamentState.doublePointsGames.push(game);
            }
        }
    } else if (tournamentState.totalGames === 20) {
        // Three double points games anywhere after first game
        while (tournamentState.doublePointsGames.length < 3) {
            const game = Math.floor(Math.random() * 19) + 2;
            if (!tournamentState.doublePointsGames.includes(game)) {
                tournamentState.doublePointsGames.push(game);
            }
        }
    }
    
    setupNextGame();
}

function handleScoreSubmission() {
    const scoreInputs = document.querySelectorAll('.score-input');
    scoreInputs.forEach(input => {
        const playerName = input.getAttribute('data-player');
        const score = input.classList.contains('selected') ? 1 : 0;
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

    if (tournamentState.lastGameWasDouble) {
        const doublePointsAlert = document.createElement('div');
        doublePointsAlert.className = 'double-points-alert';
        doublePointsAlert.innerHTML = `
            <div class="double-points-content">
                <h3>${getTranslation('doublePoints')}</h3>
                <p>${getTranslation('doublePointsMessage')}</p>
            </div>
        `;
        rankingsList.prepend(doublePointsAlert);
    }
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
        gameWeights: {},
        usedGames: [],
        doublePointsGames: [],
        doublePointsUsed: false,
        lastGameWasDouble: false
    };
    showScreen('setup-screen');
    generatePlayerInputs();
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize translations
    applyTranslations();
    
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

function getTranslation(key) {
    const translations = {
        en: {
            points: 'points',
            doublePoints: '🎉 DOUBLE POINTS! 🎉',
            doublePointsMessage: "This round's points were doubled!",
        },
        it: {
            points: 'punti',
            doublePoints: '🎉 PUNTI DOPPI! 🎉',
            doublePointsMessage: 'I punti di questo turno sono stati raddoppiati!',
        },
        // Add other languages here
    };

    const userLang = navigator.language || navigator.userLanguage;
    const lang = userLang.startsWith('it') ? 'it' : 'en'; // Default to English if not Italian

    return translations[lang][key] || translations['en'][key];
}

function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = getTranslation(key);
    });
}
