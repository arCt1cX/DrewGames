function initTournamentButton() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'tournament') {
        const button = document.createElement('button');
        button.id = 'tournamentReturn';
        button.className = 'tournament-return-button';
        button.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Return to Tournament</span>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .tournament-return-button {
                position: fixed;
                top: 10px;
                right: 10px;
                background-color: rgba(123, 104, 238, 0.2);
                color: white;
                border: none;
                border-radius: 5px;
                padding: 8px 12px;
                cursor: pointer;
                font-size: 14px;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: all 0.3s ease;
            }

            .tournament-return-button:hover {
                background-color: rgba(123, 104, 238, 0.4);
                transform: translateY(-2px);
            }

            .tournament-return-button .btn-icon {
                width: 18px;
                height: 18px;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);

        // Add click handler
        button.onclick = () => {
            window.location.href = '../tournament/index.html?return=true';
        };

        // Add to document
        document.body.appendChild(button);
    }
}

document.addEventListener('DOMContentLoaded', initTournamentButton);
