/**
 * Tournament utility functions to handle auto-filling player settings
 * when games are launched from tournament mode
 */

/**
 * Check if the current game is running in tournament mode
 * @returns {boolean} True if in tournament mode
 */
function isTournamentMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('mode') === 'tournament';
}

/**
 * Get tournament state from localStorage
 * @returns {Object|null} Tournament state object or null if not found
 */
function getTournamentState() {
    try {
        const savedState = localStorage.getItem('tournamentState');
        return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
        console.error('Error loading tournament state:', error);
        return null;
    }
}

/**
 * Get tournament players for auto-filling player inputs
 * @returns {Array} Array of player objects with name and score properties
 */
function getTournamentPlayers() {
    const tournamentState = getTournamentState();
    return tournamentState ? tournamentState.players : [];
}

/**
 * Auto-fill player count input if in tournament mode
 * @param {HTMLElement} playerCountElement - The player count input element
 */
function autoFillPlayerCount(playerCountElement) {
    if (!isTournamentMode() || !playerCountElement) return;
    
    const tournamentPlayers = getTournamentPlayers();
    if (tournamentPlayers.length > 0) {
        playerCountElement.value = tournamentPlayers.length;
        // Trigger change event to update UI
        const event = new Event('change', { bubbles: true });
        playerCountElement.dispatchEvent(event);
    }
}

/**
 * Auto-fill player name inputs if in tournament mode
 * @param {string} inputIdPrefix - Prefix for player input IDs (e.g., 'player' for 'player1Name', 'player2Name')
 * @param {string} inputIdSuffix - Suffix for player input IDs (e.g., 'Name' for 'player1Name')
 * @param {number} maxPlayers - Maximum number of players to fill (optional)
 */
function autoFillPlayerNames(inputIdPrefix = 'player', inputIdSuffix = 'Name', maxPlayers = null) {
    if (!isTournamentMode()) return;
    
    const tournamentPlayers = getTournamentPlayers();
    if (tournamentPlayers.length === 0) return;
    
    const playersToFill = maxPlayers ? Math.min(tournamentPlayers.length, maxPlayers) : tournamentPlayers.length;
    
    for (let i = 0; i < playersToFill; i++) {
        const inputId = `${inputIdPrefix}${i + 1}${inputIdSuffix}`;
        const inputElement = document.getElementById(inputId);
        
        if (inputElement && tournamentPlayers[i]) {
            inputElement.value = tournamentPlayers[i].name;
            // Trigger input/blur events to save the name if the game has such handlers
            const inputEvent = new Event('input', { bubbles: true });
            const blurEvent = new Event('blur', { bubbles: true });
            inputElement.dispatchEvent(inputEvent);
            inputElement.dispatchEvent(blurEvent);
        }
    }
}

/**
 * Auto-fill player inputs with alternative selector approach
 * @param {string} containerSelector - CSS selector for the container holding player inputs
 * @param {string} inputSelector - CSS selector for individual player name inputs within the container
 */
function autoFillPlayerNamesBySelector(containerSelector, inputSelector) {
    if (!isTournamentMode()) return;
    
    const tournamentPlayers = getTournamentPlayers();
    if (tournamentPlayers.length === 0) return;
    
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const inputs = container.querySelectorAll(inputSelector);
    
    inputs.forEach((input, index) => {
        if (index < tournamentPlayers.length && tournamentPlayers[index]) {
            input.value = tournamentPlayers[index].name;
            // Trigger events
            const inputEvent = new Event('input', { bubbles: true });
            const blurEvent = new Event('blur', { bubbles: true });
            input.dispatchEvent(inputEvent);
            input.dispatchEvent(blurEvent);
        }
    });
}

/**
 * Generic function to auto-fill tournament data
 * Call this after player inputs are generated/updated
 * @param {Object} options - Configuration options
 * @param {string} options.playerCountId - ID of player count input
 * @param {string} options.playerNamePrefix - Prefix for player name inputs
 * @param {string} options.playerNameSuffix - Suffix for player name inputs
 * @param {string} options.containerSelector - Alternative: container selector for player inputs
 * @param {string} options.inputSelector - Alternative: input selector within container
 * @param {number} options.maxPlayers - Maximum players to fill
 */
function autoFillTournamentData(options = {}) {
    if (!isTournamentMode()) return;
    
    const {
        playerCountId,
        playerNamePrefix = 'player',
        playerNameSuffix = 'Name',
        containerSelector,
        inputSelector,
        maxPlayers
    } = options;
    
    // Auto-fill player count if specified
    if (playerCountId) {
        const playerCountElement = document.getElementById(playerCountId);
        autoFillPlayerCount(playerCountElement);
    }
    
    // Auto-fill player names using either approach
    if (containerSelector && inputSelector) {
        autoFillPlayerNamesBySelector(containerSelector, inputSelector);
    } else {
        autoFillPlayerNames(playerNamePrefix, playerNameSuffix, maxPlayers);
    }
}

/**
 * Add visual indicator that the game is in tournament mode
 * @param {string} targetSelector - CSS selector for where to add the indicator
 */
function addTournamentModeIndicator(targetSelector = 'body') {
    if (!isTournamentMode()) return;
    
    const target = document.querySelector(targetSelector);
    if (!target) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'tournament-mode-indicator';
    indicator.innerHTML = `
        <div class="tournament-badge">
            <span class="tournament-icon">🏆</span>
            <span class="tournament-text">Tournament Mode</span>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .tournament-mode-indicator {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
        }
        
        .tournament-badge {
            background: linear-gradient(45deg, #ff6b35, #f7931e);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: tournamentPulse 2s infinite;
        }
        
        .tournament-icon {
            font-size: 14px;
        }
        
        @keyframes tournamentPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    
    document.head.appendChild(style);
    target.appendChild(indicator);
}

// Export functions for use in other scripts
window.tournamentUtils = {
    isTournamentMode,
    getTournamentState,
    getTournamentPlayers,
    autoFillPlayerCount,
    autoFillPlayerNames,
    autoFillPlayerNamesBySelector,
    autoFillTournamentData,
    addTournamentModeIndicator
};
