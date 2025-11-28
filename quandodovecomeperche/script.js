document.addEventListener('DOMContentLoaded', () => {
    // Game State
    const state = {
        currentQuestion: null,
        currentRound: 0,
        score: 0,
        revealedClues: {
            quando: false,
            dove: false,
            come: false,
            perche: false
        },
        clueOrder: ['quando', 'dove', 'come', 'perche'],
        currentClueIndex: 0,
        timer: null,
        timeLeft: 0,
        timePerClue: 15, // Seconds per clue
        isGameOver: false,
        isLoading: false
    };

    // API Key (User provided)
    const API_KEY = 'AIzaSyDyu6SGakr-3fXvdSlni65BavGky1LX8As';

    // DOM Elements
    const screens = {
        start: document.getElementById('start-screen'),
        game: document.getElementById('game-screen'),
        result: document.getElementById('result-screen')
    };

    const ui = {
        score: document.getElementById('score'),
        currentQuestionNum: document.getElementById('current-question'),
        clues: {
            quando: document.getElementById('clue-quando'),
            dove: document.getElementById('clue-dove'),
            come: document.getElementById('clue-come'),
            perche: document.getElementById('clue-perche')
        },
        guessInput: document.getElementById('guess-input'),
        submitBtn: document.getElementById('submit-guess-btn'),
        timerBar: document.getElementById('timer-bar'),
        statusMessage: document.getElementById('status-message'),
        skipBtn: document.getElementById('skip-btn'),
        finalScore: document.getElementById('final-score-display'),
        feedbackText: document.getElementById('feedback-text'),
        solutionModal: document.getElementById('solution-modal'),
        solutionText: document.getElementById('solution-text')
    };

    // Start Game
    document.getElementById('start-btn').addEventListener('click', () => {
        state.score = 0;
        state.currentRound = 0;
        ui.score.textContent = '0';
        showScreen('game');
        startNewRound();
    });

    // Show Screen Utility
    function showScreen(screenName) {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenName].classList.add('active');
    }

    // Generate AI Question
    async function generateAIQuestion() {
        state.isLoading = true;
        // ui.statusMessage.textContent = "Generazione domanda in corso..."; // Removed as requested

        const examples = `
            Esempi dello stile richiesto (enigmistico, metaforico, arguto):
            1. QUANDO: fa la matta, DOVE: sul tavolo, COME: in crisi di identita, PERCHÉ: a "7 e mezzo" puo avere qualunque valore!, RISPOSTA: re di denari
            2. QUANDO: sta seduto, DOVE: stesa davanti a me, COME: sbiadita dagli anni, PERCHÉ: per apparecchiare uso sempre la stessa!, RISPOSTA: tovaglia
            3. QUANDO: un pomeriggio di maggio, DOVE: a casa, COME: trasparente come sempre, PERCHÉ: un ottuso moscone continua a sbattecri contro, RISPOSTA: vetro
            4. QUANDO: dopo un lungo viaggio da parigi, DOVE: a new york, COME: con le mani entrambe occupate, PERCHÉ: per reggere la fiaccola piu famosa del mondo, RISPOSTA: statua della liberta
            5. QUANDO: dopo una grande nevicata, DOVE: in mezzo a due bottoni, COME: arancione, PERCHÉ: per fare da naso al pupazo di neve!, RISPOSTA: carota
            6. QUANDO: dieci ore al giorno, DOVE: seduto in cabina, COME: con un braccio abbronzato, PERCHÉ: per trasportare il cemento da roma a milano, RISPOSTA: camionista
            7. QUANDO: appena mangiato, DOVE: al bar del paese, COME: tutto d'oro, PERCHÉ: nonno ha fatto scopa con quello piu "bello", RISPOSTA: sette
        `;

        const prompt = `
            Sei un autore di "Reazione a Catena". Il tuo compito è creare un indovinello PERFETTO basato su una STORIA COERENTE.
            
            **METODO DI CREAZIONE (OBBLIGATORIO):**
            1. Scegli una PAROLA DA INDOVINARE (Oggetto, Mestiere, Luogo).
            2. Costruisci una **STORIA UNICA** seguendo RIGOROSAMENTE questa struttura sequenziale:
               "[QUANDO succede] + [DOVE succede] + [COME succede/descrizione fisica] + [PERCHÉ succede/scopo]"
            3. Spezza la frase esattamente in questi 4 componenti.
            
            **ESEMPIO PERFETTO (TOMBOLA):**
            - Frase: "La notte di Natale (QUANDO), attorno a un tavolo (DOVE), con dei fagioli in mano (COME), per fare cinquina (PERCHÉ)!"
            - RISPOSTA: Tombola
            
            **ESEMPIO PERFETTO (CAMIONISTA):**
            - Frase: "Dieci ore al giorno (QUANDO), seduto in cabina (DOVE), con un braccio abbronzato (COME), per trasportare il cemento (PERCHÉ)."
            - RISPOSTA: Camionista
            
            **ANTI-ESEMPI (SE SCRIVI COSE COSÌ BANALI SEI BOCCIATO):**
            - ❌ "Ogni mattina (QUANDO), nel panificio (DOVE), con farina ovunque (COME), per preparare la colazione (PERCHÉ) -> Fornaio"
              *PERCHÉ È SBAGLIATO:* "Preparare la colazione" è generico! Il fornaio fa il PANE. E "ogni mattina" è noioso.
              *CORRETTO:* "Mentre la città dorme ancora (QUANDO), davanti al forno ardente (DOVE), sporco di farina fino ai gomiti (COME), per darci il nostro pane quotidiano (PERCHÉ)!"
            
            - ❌ "Davanti allo specchio (DOVE)... per iniziare la giornata (PERCHÉ) -> Parrucchiere"
              *PERCHÉ È SBAGLIATO:* Chiunque sta davanti allo specchio! Il parrucchiere sta DIETRO la poltrona.
              *CORRETTO:* "Con le forbici in mano (COME)... per darci un taglio netto col passato (PERCHÉ)!"

            **REGOLE D'ORO PER NON SBAGLIARE:**
            1. **SPECIFICITÀ ASSOLUTA**: Il "PERCHÉ" deve essere l'indizio che toglie ogni dubbio. Non dire "per lavorare", dì "per aggiustare il lavandino" (Idraulico).
            2. **NIENTE BANALITÀ**: Evita "Ogni mattina", "A casa", "Al lavoro". Usa "All'alba", "Tra le mura domestiche", "In ufficio tra mille scartoffie".
            3. **LA RISPOSTA DEVE ESSERE L'UNICA POSSIBILE**: Se leggo la tua storia, non devo poter rispondere "Mamma" se la risposta è "Parrucchiere".
            
            Formatta la risposta SOLO come JSON valido:
            {
                "quando": "...",
                "dove": "...",
                "come": "...",
                "perche": "...",
                "answer": "...",
                "accepted_answers": ["sinonimo1", "sinonimo2"]
            }
        `;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;

            // Clean markdown if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error('AI Error:', error);
            ui.statusMessage.textContent = "Errore generazione. Riprovo...";
            // Simple retry or fallback could be added here
            return null;
        } finally {
            state.isLoading = false;
        }
    }

    // Start New Round
    async function startNewRound() {
        // Increment round counter
        state.currentRound++;
        ui.currentQuestionNum.textContent = state.currentRound;

        resetUI();

        const question = await generateAIQuestion();
        if (!question) {
            alert("Errore di connessione con l'IA. Riprova.");
            return;
        }

        state.currentQuestion = question;
        state.currentClueIndex = 0;
        state.isGameOver = false;

        // Normalize accepted answers
        if (!state.currentQuestion.accepted_answers) {
            state.currentQuestion.accepted_answers = [];
        }
        state.currentQuestion.accepted_answers.push(state.currentQuestion.answer);

        revealNextClue();
    }

    function resetUI() {
        // Reset clues
        Object.keys(ui.clues).forEach(key => {
            const card = ui.clues[key];
            card.classList.remove('revealed');
            card.querySelector('.clue-content').textContent = '???';
        });

        ui.guessInput.value = '';
        ui.guessInput.disabled = false;
        ui.submitBtn.disabled = false;
        ui.statusMessage.textContent = '';
        ui.timerBar.style.width = '100%';
        ui.timerBar.parentElement.style.display = 'block'; // Show timer bar
        ui.skipBtn.textContent = "Salta Indizio"; // Reset button text
        ui.skipBtn.classList.remove('danger-btn');
        ui.skipBtn.classList.add('secondary-btn');

        clearInterval(state.timer);
    }

    function revealNextClue() {
        if (state.currentClueIndex >= 4) {
            // All clues revealed
            ui.timerBar.parentElement.style.display = 'none'; // Hide timer bar
            ui.skipBtn.textContent = "Rinuncia"; // Change button text
            ui.skipBtn.classList.remove('secondary-btn');
            ui.skipBtn.classList.add('danger-btn');
            return;
        }

        const clueType = state.clueOrder[state.currentClueIndex];
        const card = ui.clues[clueType];
        const content = card.querySelector('.clue-content');

        content.textContent = state.currentQuestion[clueType];
        card.classList.add('revealed');

        state.currentClueIndex++;

        // Don't start timer if it's the last clue (Perché)
        // currentClueIndex is incremented AFTER revealing.
        // So if we just revealed the 4th clue (index 3 -> 4), we stop.
        if (state.currentClueIndex < 4) {
            startTimer();
        } else {
            ui.timerBar.parentElement.style.display = 'none';
            ui.skipBtn.textContent = "Rinuncia";
            ui.skipBtn.classList.remove('secondary-btn');
            ui.skipBtn.classList.add('danger-btn');
        }
    }

    function startTimer() {
        clearInterval(state.timer);
        state.timeLeft = state.timePerClue;
        updateTimerBar();

        state.timer = setInterval(() => {
            state.timeLeft--;
            updateTimerBar();

            if (state.timeLeft <= 0) {
                clearInterval(state.timer);
                revealNextClue();
            }
        }, 1000);
    }

    function updateTimerBar() {
        const percentage = (state.timeLeft / state.timePerClue) * 100;
        ui.timerBar.style.width = `${percentage}%`;
    }

    // Check Answer
    function checkAnswer() {
        if (state.isGameOver) return;

        const userGuess = ui.guessInput.value.trim().toLowerCase();
        if (!userGuess) return;

        // Clear input immediately
        ui.guessInput.value = '';
        ui.guessInput.focus(); // Keep focus

        const correctAnswers = state.currentQuestion.accepted_answers.map(a => a.toLowerCase());

        // Fuzzy matching could be improved, but simple includes/equals for now
        const isCorrect = correctAnswers.some(ans => userGuess === ans || userGuess.includes(ans) && ans.length > 3);

        if (isCorrect) {
            endRound(true);
        } else {
            ui.statusMessage.textContent = "Non è corretto, riprova!";

            // Reset timer on WRONG GUESS (as requested: "quando invio la parola")
            if (state.currentClueIndex < 4) {
                state.timeLeft = state.timePerClue;
                updateTimerBar();
                startTimer();
            }
        }
    }

    ui.submitBtn.addEventListener('click', checkAnswer);
    ui.guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    // Skip/Give Up Clue
    ui.skipBtn.addEventListener('click', () => {
        if (state.isGameOver) return;

        if (state.currentClueIndex >= 4) {
            // "Rinuncia" behavior
            endRound(false);
        } else {
            // "Salta Indizio" behavior
            clearInterval(state.timer);
            revealNextClue();
        }
    });

    // End Round
    function endRound(won) {
        clearInterval(state.timer);
        state.isGameOver = true;
        ui.guessInput.disabled = true;
        ui.submitBtn.disabled = true;

        const modalTitle = document.querySelector('#solution-modal h2');
        const modalContent = document.querySelector('.modal-content');

        if (won) {
            // Calculate score based on clues used
            // 0 clues revealed (impossible) -> 0
            // 1 clue revealed -> 10 pts
            // 2 clues -> 6 pts
            // 3 clues -> 3 pts
            // 4 clues -> 1 pt
            const points = [10, 6, 3, 1][state.currentClueIndex - 1] || 0;
            state.score += points;
            ui.score.textContent = state.score;
            ui.statusMessage.textContent = `ESATTO! +${points} punti`;
            ui.statusMessage.style.color = '#4caf50';

            // Success Modal Style
            modalTitle.textContent = "GRANDIOSO! 🎉";
            modalTitle.style.color = "#4caf50";
            ui.solutionText.innerHTML = `Hai indovinato:<br><strong style="font-size: 1.5em; color: #fff;">${state.currentQuestion.answer}</strong>`;

            // Reveal all clues
            state.clueOrder.forEach(type => {
                ui.clues[type].querySelector('.clue-content').textContent = state.currentQuestion[type];
                ui.clues[type].classList.add('revealed');
            });

        } else {
            ui.statusMessage.textContent = `Tempo scaduto!`;
            ui.statusMessage.style.color = '#f44336';

            // Failure Modal Style
            modalTitle.textContent = "PECCATO! 😔";
            modalTitle.style.color = "#f44336";
            ui.solutionText.innerHTML = `La risposta era:<br><strong style="font-size: 1.5em; color: #fff;">${state.currentQuestion.answer}</strong>`;
        }

        // Show solution modal immediately (reduced delay from 1500 to 500ms)
        setTimeout(() => {
            ui.solutionModal.classList.remove('hidden');
        }, 500);
    }

    // Modal Actions
    document.getElementById('correct-btn').addEventListener('click', () => {
        // Already handled score if won, but this button is "Next Round" essentially
        ui.solutionModal.classList.add('hidden');
        startNewRound();
    });

    document.getElementById('wrong-btn').addEventListener('click', () => {
        // This button acts as "End Game" or "Next Round" depending on design
        // Let's make it "Next Round" for endless play, or "End Game"
        ui.solutionModal.classList.add('hidden');
        startNewRound();
    });

    // Modify modal buttons for this flow
    const modalActions = document.querySelector('.modal-actions');
    modalActions.innerHTML = `
        <button id="next-round-btn" class="btn primary-btn">Prossimo Round</button>
        <button id="end-game-btn" class="btn secondary-btn">Termina Partita</button>
    `;

    document.getElementById('next-round-btn').addEventListener('click', () => {
        ui.solutionModal.classList.add('hidden');
        startNewRound();
    });

    document.getElementById('end-game-btn').addEventListener('click', () => {
        ui.solutionModal.classList.add('hidden');
        ui.finalScore.textContent = state.score;
        showScreen('result');
    });

    // Restart Game
    document.getElementById('restart-btn').addEventListener('click', () => {
        state.score = 0;
        ui.score.textContent = '0';
        showScreen('game');
        startNewRound();
    });
});
