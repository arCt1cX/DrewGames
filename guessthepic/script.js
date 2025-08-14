document.addEventListener('DOMContentLoaded', () => {
    // Tournament mode detection
    const urlParams = new URLSearchParams(window.location.search);
    const isTournament = urlParams.get('tournament') === 'true';
    const gameNumber = urlParams.get('gameNumber');
    const totalGames = urlParams.get('totalGames');
    
    if (isTournament) {
        const returnButton = document.getElementById('tournamentReturn');
        if (returnButton) {
            returnButton.classList.remove('hidden');
            returnButton.querySelector('span').textContent = `Return to Tournament (Game ${gameNumber}/${totalGames})`;
            
            returnButton.addEventListener('click', () => {
                window.location.href = '../tournament/index.html?return=true';
            });
        }
    }

    // ...existing game code...
});