// Add this at the start of your game script
document.addEventListener('DOMContentLoaded', () => {
    // Tournament mode detection
    const urlParams = new URLSearchParams(window.location.search);
    const isTournament = urlParams.get('tournament') === 'true';
    const gameNumber = urlParams.get('gameNumber');
    const totalGames = urlParams.get('totalGames');
    
    if (isTournament) {
        const returnButton = document.getElementById('tournamentReturn');
        returnButton.classList.remove('hidden');
        returnButton.innerHTML += ` (Game ${gameNumber}/${totalGames})`;
        
        returnButton.addEventListener('click', () => {
            window.location.href = '../tournament/index.html?return=true';
        });
    }

    // ...existing code...
});
