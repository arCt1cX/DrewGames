// Translations for Scale & Serpenti Party
const gameTranslations = {
    'it': {
        'gameTitle': 'Scale & Serpenti Party',
        'pageTitleDesc': 'Scale & Serpenti Party - Il gioco da tavolo pazzo | DrewGames',
        'metaDescription': 'Scale e Serpenti con 200 caselle, tabellone sempre diverso, potenziamenti, imprevisti, portali, burroni e missili! Il gioco da tavolo pazzo da fare con gli amici.',
        'home': 'Home',

        // Setup
        'setupTitle': 'Impostazioni del Gioco',
        'playerCountLabel': 'Numero di Giocatori:',
        'players': 'Giocatori',
        'player': 'Giocatore',
        'playerNamePlaceholder': 'Nome Giocatore {n}',
        'boardSizeLabel': 'Lunghezza del tabellone:',
        'cells': 'caselle',
        'densityLabel': 'Caselle speciali:',
        'densityFew': 'Poche',
        'densityNormal': 'Normali',
        'densityMany': 'Tante (caos totale!)',
        'bounceLabel': 'Arrivo esatto (se sfori rimbalzi):',
        'bounceOn': 'Sì',
        'bounceOff': 'No',
        'startGame': 'Inizia Gioco',
        'rulesBtn': 'Regole e caselle',

        // Play
        'rollBtn': 'Tira il dado',
        'rollBtnDouble': 'Tira i dadi',
        'turnOf': 'Turno di {name}',
        'noItems': 'Nessun oggetto: finisci su un potenziamento per averne uno!',
        'rollHint': 'Tocca un oggetto per usarlo, poi tira',
        'oneItem': 'Puoi usare un solo oggetto per turno.',
        'viewAll': 'Tutto',
        'viewZoom': 'Zoom',
        'cellLabel': 'Casella {c}',
        'startLabel': 'VIA',
        'tagBonus': '+{x} al tiro',
        'tagMalus': '{x} al tiro',
        'tagDouble': 'Doppio dado',
        'tagLoaded': 'Dado truccato: {x}',
        'tagHalve': 'Tiro dimezzato',
        'tagReverse': 'Retromarcia',
        'tagSkip': 'Salta il turno',

        // Buttons
        'ok': 'OK',
        'use': 'Usa',
        'cancel': 'Annulla',
        'gotIt': 'Ho capito',
        'fwd': 'Avanti di {x}',
        'back': 'Indietro di {x}',
        'none': 'Nessuno',
        'discard': 'Scarta {item}',
        'keepOld': 'Lascia perdere',

        // Choices
        'remoteTitle': 'Chi vuoi spostare?',
        'directionTitle': 'In che direzione?',
        'freezeTitle': 'Chi vuoi congelare?',
        'swapTitle': 'Scambio!',
        'swapText': 'Puoi scambiare la tua posizione con un altro giocatore. Con chi?',
        'robinPick': 'A chi vuoi rubare un oggetto?',
        'faceTitle': 'Che numero vuoi?',
        'bagFullTitle': 'Zaino pieno!',
        'bagFullText': 'Hai già 3 oggetti. Vuoi scartarne uno per tenere {item}?',
        'shieldPassive': 'Lo scudo non si usa: si attiva da solo appena ti succede qualcosa di brutto.',

        // Log / toasts
        'rollLog': '{name} tira {roll}',
        'rollLogMod': '{name} tira {roll} → si muove di {total}',
        'rollBack': '{name} va in retromarcia di {total}!',
        'ladderLog': 'Scala! {name} sale da {from} a {to}',
        'snakeLog': 'Serpente! {name} scivola da {from} a {to}',
        'bounceLog': 'Rimbalzo! Serve il numero esatto per arrivare a {n}.',
        'shieldLog': 'Lo scudo protegge {name}!',
        'trapLog': '{name} cade in una trappola! Indietro di {x}.',
        'missileLog': 'Missile in arrivo su {names}!',
        'cliffLog': '{name} precipita nel burrone!',
        'teleportLog': '{name} viene teletrasportato alla casella {to}!',
        'swapLog': '{a} e {b} si scambiano di posto!',
        'skipLog': '{name} salta il turno.',
        'extraLog': '{name} tira di nuovo!',
        'itemGot': '{name} ottiene: {item}',
        'frozenLog': '{name} è congelato: salterà il prossimo turno!',
        'trapPlaced': 'Trappola piazzata sulla casella {c}.',
        'trapInvalid': 'Qui non puoi piazzare una trappola: serve una casella normale (non la 1).',
        'thiefNothing': 'Non avevi niente da rubare… ti è andata bene!',
        'stolen': 'Il ladro ruba a {name}: {item}',
        'stoleFrom': '{name} ruba {item} a {target}!',
        'robinNobody': 'Nessuno ha oggetti da rubare: ricevi un potenziamento!',
        'bagFull': 'Zaino pieno: {item} va perso.',
        'noOneAhead': 'Sei già in testa: avanzi di 2!',
        'noLadderAhead': 'Non ci sono scale davanti a te: avanzi di 3!',
        'noSnakeBehind': 'Nessun serpente dietro di te: indietro di 3!',
        'remoteLog': '{name} sposta {target} di {x} caselle {dir}',
        'dirFwd': 'in avanti',
        'dirBack': 'indietro',
        'shuffleLog': 'Tutte le pedine sono state mescolate!',
        'loadedLog': '{name} trucca il dado: uscirà {x}',
        'boostLog': '{name} attiva il turbo: +{x} al tiro',
        'doubleLog': '{name} tirerà due dadi!',
        'winLog': '{name} arriva al traguardo!',

        // Card tags
        'tagPower': 'Potenziamento!',
        'tagEventGood': 'Imprevisto positivo',
        'tagEventBad': 'Imprevisto negativo',
        'tagEventChaos': 'Imprevisto caotico',
        'tagDanger': 'Attenzione!',
        'tagMagic': 'Magia!',
        'tagTurn': 'Turno saltato',

        // Tiles
        'tiles': {
            'ladder': { 'name': 'Scala', 'desc': 'Se ti fermi alla base, sali fino in cima.' },
            'snake': { 'name': 'Serpente', 'desc': 'Se ti fermi sulla testa, scivoli giù fino alla coda.' },
            'power': { 'name': 'Potenziamento', 'desc': 'Ricevi un oggetto a caso da usare prima di un tuo tiro (massimo 3).' },
            'event': { 'name': 'Imprevisto', 'desc': 'Pesca una carta a sorpresa: può andarti benissimo… o malissimo!' },
            'swap': { 'name': 'Scambio', 'desc': 'Puoi scambiare la tua posizione con quella di un altro giocatore.' },
            'teleport': { 'name': 'Portale', 'desc': 'Vieni teletrasportato in una casella a caso del tabellone.' },
            'cliff': { 'name': 'Burrone', 'desc': 'Precipiti e riparti dalla casella 1!' },
            'trap': { 'name': 'Trappola', 'desc': 'Piazzata da un giocatore: chi ci finisce sopra torna indietro di {x}.' },
            'finish': { 'name': 'Traguardo', 'desc': 'Il primo che arriva qui vince!' }
        },
        'cliffTitle': 'Burrone!',
        'cliffText': '{name} mette un piede in fallo e precipita… si riparte dalla casella 1!',
        'teleportTitle': 'Portale!',
        'teleportText': '{name} entra nel portale… dove finirà?',
        'skipTitle': 'Turno saltato',
        'skipText': '{name} deve saltare questo turno.',

        // Items
        'items': {
            'missile': { 'name': 'Missile Cercaprimo', 'desc': 'Colpisce chi è in testa e lo rispedisce indietro di {x} caselle. Occhio: se il primo sei tu… colpisce te!' },
            'boost': { 'name': 'Turbo +{x}', 'desc': 'Aggiunge +{x} al tiro di questo turno.' },
            'double': { 'name': 'Doppio Dado', 'desc': 'In questo turno tiri due dadi invece di uno.' },
            'shield': { 'name': 'Scudo', 'desc': 'Si attiva da solo e ti protegge dal prossimo guaio: serpente, burrone, missile, trappola, spinta o imprevisto negativo.' },
            'remote': { 'name': 'Telecomando {x}', 'desc': 'Scegli un giocatore e fallo avanzare o indietreggiare di {x} caselle. Se lo mandi su un serpente…' },
            'trap': { 'name': 'Trappola', 'desc': 'Piazza una trappola sulla casella dove sei: il prossimo che ci finisce sopra torna indietro di {x} (anche tu!).' },
            'loaded': { 'name': 'Dado Truccato', 'desc': 'Scegli tu il numero che esce dal dado in questo turno.' },
            'freeze': { 'name': 'Congelatore', 'desc': 'Scegli un giocatore: salterà il suo prossimo turno.' }
        },

        // Events
        'events': {
            'wind': { 'title': 'Vento in poppa!', 'text': 'Una folata ti spinge avanti di {x} caselle.' },
            'banana': { 'title': 'Buccia di banana!', 'text': 'Scivoli all\'indietro di {x} caselle.' },
            'skip': { 'title': 'Pisolino', 'text': 'Ti addormenti sul tabellone: salti il prossimo turno.' },
            'extra': { 'title': 'Che fortuna!', 'text': 'Finito questo turno, tiri di nuovo!' },
            'gift': { 'title': 'Pacco regalo', 'text': 'Ricevi un potenziamento gratis!' },
            'bonus': { 'title': 'Carica!', 'text': 'Il tuo prossimo tiro avrà +{x}.' },
            'halve': { 'title': 'Gambe molli', 'text': 'Il tuo prossimo tiro vale la metà.' },
            'reverse': { 'title': 'Retromarcia', 'text': 'Il tuo prossimo tiro va all\'indietro!' },
            'othersBack': { 'title': 'Terremoto', 'text': 'Trema tutto: gli altri giocatori tornano indietro di {x} caselle.' },
            'othersFwd': { 'title': 'Generosità forzata', 'text': 'Tutti gli altri giocatori avanzano di {x} caselle.' },
            'party': { 'title': 'Festa!', 'text': 'Si balla: tutti i giocatori avanzano di {x} caselle.' },
            'slipstream': { 'title': 'Scia', 'text': 'Ti attacchi alla scia del giocatore davanti a te e lo raggiungi!' },
            'thief': { 'title': 'Borseggiatore', 'text': 'Un ladro ti ruba un oggetto a caso.' },
            'robin': { 'title': 'Mano lesta', 'text': 'Ruba un oggetto a un giocatore a tua scelta.' },
            'shuffle': { 'title': 'Rimescolone!', 'text': 'Tutte le pedine vengono mescolate tra loro a caso!' },
            'lastUp': { 'title': 'Aiutino', 'text': 'Chi è ultimo in classifica avanza di {x} caselle.' },
            'snakeCall': { 'title': 'Richiamo del serpente', 'text': 'Torni sulla testa del serpente più vicino dietro di te…' },
            'ladderCall': { 'title': 'Scorciatoia', 'text': 'Corri alla base della prossima scala davanti a te e salila!' }
        },

        // Legend
        'legendTitle': 'Come si gioca',
        'legendTiles': 'Caselle',
        'legendItems': 'Oggetti (potenziamenti)',
        'legendRules': 'Regole',
        'rules': [
            'Il tabellone è diverso a ogni partita. Si parte dalla casella 1: vince chi arriva per primo all\'ultima casella.',
            'A turno tira il dado e avanza. Scale e serpenti funzionano come nel classico.',
            'Prima di tirare puoi usare UN oggetto del tuo zaino (ne puoi tenere al massimo 3).',
            'Scale, serpenti, portali, trappole e burrone scattano sempre, anche se ci vieni spinto da un altro giocatore. Potenziamenti, imprevisti e scambi si attivano solo se ci arrivi tu col tuo turno.',
            'Con l\'arrivo esatto attivo, se il tiro supera il traguardo rimbalzi indietro.',
            'Tocca una casella del tabellone per vedere cosa fa.'
        ],

        // Game over
        'gameOverTitle': 'Partita Finita!',
        'winnerTitle': 'Vince...',
        'finalStandingsTitle': 'Classifica Finale',
        'playAgainBtn': 'Nuova partita',
        'cellShort': 'casella {c}'
    },
    'en': {
        'gameTitle': 'Snakes & Ladders Party',
        'pageTitleDesc': 'Snakes & Ladders Party - The crazy board game | DrewGames',
        'metaDescription': 'Snakes and Ladders with 200 squares, a new board every game, power-ups, surprises, portals, cliffs and missiles! The crazy board game to play with friends.',
        'home': 'Home',

        // Setup
        'setupTitle': 'Game Settings',
        'playerCountLabel': 'Number of Players:',
        'players': 'Players',
        'player': 'Player',
        'playerNamePlaceholder': 'Player {n} Name',
        'boardSizeLabel': 'Board length:',
        'cells': 'squares',
        'densityLabel': 'Special squares:',
        'densityFew': 'Few',
        'densityNormal': 'Normal',
        'densityMany': 'Lots (total chaos!)',
        'bounceLabel': 'Exact finish (overshoot bounces back):',
        'bounceOn': 'Yes',
        'bounceOff': 'No',
        'startGame': 'Start Game',
        'rulesBtn': 'Rules & squares',

        // Play
        'rollBtn': 'Roll the die',
        'rollBtnDouble': 'Roll the dice',
        'turnOf': '{name}\'s turn',
        'noItems': 'No items: land on a power-up to get one!',
        'rollHint': 'Tap an item to use it, then roll',
        'oneItem': 'You can only use one item per turn.',
        'viewAll': 'All',
        'viewZoom': 'Zoom',
        'cellLabel': 'Square {c}',
        'startLabel': 'GO',
        'tagBonus': '+{x} to roll',
        'tagMalus': '{x} to roll',
        'tagDouble': 'Double die',
        'tagLoaded': 'Loaded die: {x}',
        'tagHalve': 'Half roll',
        'tagReverse': 'Reverse',
        'tagSkip': 'Skips turn',

        // Buttons
        'ok': 'OK',
        'use': 'Use',
        'cancel': 'Cancel',
        'gotIt': 'Got it',
        'fwd': 'Forward {x}',
        'back': 'Back {x}',
        'none': 'Nobody',
        'discard': 'Discard {item}',
        'keepOld': 'Never mind',

        // Choices
        'remoteTitle': 'Who do you want to move?',
        'directionTitle': 'Which direction?',
        'freezeTitle': 'Who do you want to freeze?',
        'swapTitle': 'Swap!',
        'swapText': 'You can swap places with another player. Who?',
        'robinPick': 'Who do you want to steal an item from?',
        'faceTitle': 'Which number do you want?',
        'bagFullTitle': 'Bag full!',
        'bagFullText': 'You already have 3 items. Discard one to keep {item}?',
        'shieldPassive': 'You don\'t use the shield: it kicks in by itself as soon as something bad happens to you.',

        // Log / toasts
        'rollLog': '{name} rolls {roll}',
        'rollLogMod': '{name} rolls {roll} → moves {total}',
        'rollBack': '{name} goes {total} in reverse!',
        'ladderLog': 'Ladder! {name} climbs from {from} to {to}',
        'snakeLog': 'Snake! {name} slides from {from} to {to}',
        'bounceLog': 'Bounce! You need the exact number to reach {n}.',
        'shieldLog': 'The shield protects {name}!',
        'trapLog': '{name} falls into a trap! Back {x}.',
        'missileLog': 'Missile incoming on {names}!',
        'cliffLog': '{name} falls off the cliff!',
        'teleportLog': '{name} is teleported to square {to}!',
        'swapLog': '{a} and {b} swap places!',
        'skipLog': '{name} skips the turn.',
        'extraLog': '{name} rolls again!',
        'itemGot': '{name} gets: {item}',
        'frozenLog': '{name} is frozen and will skip the next turn!',
        'trapPlaced': 'Trap placed on square {c}.',
        'trapInvalid': 'You can\'t place a trap here: you need a normal square (not square 1).',
        'thiefNothing': 'You had nothing to steal… lucky you!',
        'stolen': 'The thief steals from {name}: {item}',
        'stoleFrom': '{name} steals {item} from {target}!',
        'robinNobody': 'Nobody has items to steal: you get a power-up instead!',
        'bagFull': 'Bag full: {item} is lost.',
        'noOneAhead': 'You are already in the lead: move forward 2!',
        'noLadderAhead': 'No ladders ahead of you: move forward 3!',
        'noSnakeBehind': 'No snakes behind you: move back 3!',
        'remoteLog': '{name} moves {target} {x} squares {dir}',
        'dirFwd': 'forward',
        'dirBack': 'back',
        'shuffleLog': 'All the pawns have been shuffled!',
        'loadedLog': '{name} loads the die: it will be {x}',
        'boostLog': '{name} turns on the turbo: +{x} to the roll',
        'doubleLog': '{name} will roll two dice!',
        'winLog': '{name} reaches the finish!',

        // Card tags
        'tagPower': 'Power-up!',
        'tagEventGood': 'Good surprise',
        'tagEventBad': 'Bad surprise',
        'tagEventChaos': 'Chaos surprise',
        'tagDanger': 'Watch out!',
        'tagMagic': 'Magic!',
        'tagTurn': 'Turn skipped',

        // Tiles
        'tiles': {
            'ladder': { 'name': 'Ladder', 'desc': 'Stop at the bottom and you climb to the top.' },
            'snake': { 'name': 'Snake', 'desc': 'Stop on its head and you slide down to the tail.' },
            'power': { 'name': 'Power-up', 'desc': 'Get a random item to use before one of your rolls (max 3).' },
            'event': { 'name': 'Surprise', 'desc': 'Draw a surprise card: it might go great… or terribly!' },
            'swap': { 'name': 'Swap', 'desc': 'You can swap places with another player.' },
            'teleport': { 'name': 'Portal', 'desc': 'You get teleported to a random square on the board.' },
            'cliff': { 'name': 'Cliff', 'desc': 'You fall and start again from square 1!' },
            'trap': { 'name': 'Trap', 'desc': 'Placed by a player: whoever lands on it goes back {x}.' },
            'finish': { 'name': 'Finish', 'desc': 'First one to get here wins!' }
        },
        'cliffTitle': 'Cliff!',
        'cliffText': '{name} takes a wrong step and falls… back to square 1!',
        'teleportTitle': 'Portal!',
        'teleportText': '{name} steps into the portal… where will they end up?',
        'skipTitle': 'Turn skipped',
        'skipText': '{name} has to skip this turn.',

        // Items
        'items': {
            'missile': { 'name': 'Leader Missile', 'desc': 'Hits whoever is in the lead and sends them back {x} squares. Careful: if you are first… it hits you!' },
            'boost': { 'name': 'Turbo +{x}', 'desc': 'Adds +{x} to this turn\'s roll.' },
            'double': { 'name': 'Double Die', 'desc': 'This turn you roll two dice instead of one.' },
            'shield': { 'name': 'Shield', 'desc': 'Kicks in by itself and protects you from the next trouble: snake, cliff, missile, trap, push or bad surprise.' },
            'remote': { 'name': 'Remote {x}', 'desc': 'Pick a player and move them forward or back {x} squares. If you send them onto a snake…' },
            'trap': { 'name': 'Trap', 'desc': 'Place a trap on your square: the next one to land on it goes back {x} (you too!).' },
            'loaded': { 'name': 'Loaded Die', 'desc': 'You choose the number the die shows this turn.' },
            'freeze': { 'name': 'Freezer', 'desc': 'Pick a player: they will skip their next turn.' }
        },

        // Events
        'events': {
            'wind': { 'title': 'Tailwind!', 'text': 'A gust pushes you forward {x} squares.' },
            'banana': { 'title': 'Banana peel!', 'text': 'You slip back {x} squares.' },
            'skip': { 'title': 'Nap time', 'text': 'You fall asleep on the board: skip your next turn.' },
            'extra': { 'title': 'Lucky you!', 'text': 'After this turn, you roll again!' },
            'gift': { 'title': 'Gift box', 'text': 'You get a free power-up!' },
            'bonus': { 'title': 'Charge!', 'text': 'Your next roll gets +{x}.' },
            'halve': { 'title': 'Jelly legs', 'text': 'Your next roll is halved.' },
            'reverse': { 'title': 'Reverse gear', 'text': 'Your next roll goes backwards!' },
            'othersBack': { 'title': 'Earthquake', 'text': 'Everything shakes: the other players go back {x} squares.' },
            'othersFwd': { 'title': 'Forced generosity', 'text': 'All the other players move forward {x} squares.' },
            'party': { 'title': 'Party!', 'text': 'Let\'s dance: every player moves forward {x} squares.' },
            'slipstream': { 'title': 'Slipstream', 'text': 'You catch the slipstream of the player ahead of you and reach them!' },
            'thief': { 'title': 'Pickpocket', 'text': 'A thief steals a random item from you.' },
            'robin': { 'title': 'Quick hands', 'text': 'Steal an item from a player of your choice.' },
            'shuffle': { 'title': 'Big shuffle!', 'text': 'All the pawns get shuffled at random!' },
            'lastUp': { 'title': 'Helping hand', 'text': 'Whoever is last moves forward {x} squares.' },
            'snakeCall': { 'title': 'Call of the snake', 'text': 'You go back to the head of the nearest snake behind you…' },
            'ladderCall': { 'title': 'Shortcut', 'text': 'Run to the bottom of the next ladder ahead and climb it!' }
        },

        // Legend
        'legendTitle': 'How to play',
        'legendTiles': 'Squares',
        'legendItems': 'Items (power-ups)',
        'legendRules': 'Rules',
        'rules': [
            'The board is different every game. Everyone starts on square 1: first to reach the last square wins.',
            'On your turn roll the die and move. Snakes and ladders work like the classic.',
            'Before rolling you can use ONE item from your bag (you can hold up to 3).',
            'Ladders, snakes, portals, traps and the cliff always trigger, even if another player pushes you there. Power-ups, surprises and swaps only trigger when you land there on your own turn.',
            'With exact finish on, if your roll overshoots the finish you bounce back.',
            'Tap a square on the board to see what it does.'
        ],

        // Game over
        'gameOverTitle': 'Game Over!',
        'winnerTitle': 'The winner is...',
        'finalStandingsTitle': 'Final Standings',
        'playAgainBtn': 'New game',
        'cellShort': 'square {c}'
    }
};

function getGameTranslations() {
    const lang = (typeof getUserLanguage === 'function') ? getUserLanguage() : 'it';
    return gameTranslations[lang] || gameTranslations['en'];
}

function applyGameTranslations() {
    const t = getGameTranslations();
    const lang = (typeof getUserLanguage === 'function') ? getUserLanguage() : 'it';

    document.title = t.pageTitleDesc;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', t.metaDescription);
    document.documentElement.lang = lang;

    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) languageToggle.style.display = 'none';

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    set('homeText', t.home);
    set('gameTitle', t.gameTitle);
    set('setupTitle', t.setupTitle);
    set('playerCountLabel', t.playerCountLabel);
    set('boardSizeLabel', t.boardSizeLabel);
    set('densityLabel', t.densityLabel);
    set('densityFew', t.densityFew);
    set('densityNormal', t.densityNormal);
    set('densityMany', t.densityMany);
    set('bounceLabel', t.bounceLabel);
    set('bounceOn', t.bounceOn);
    set('bounceOff', t.bounceOff);
    set('start-game', t.startGame);
    set('rules-btn', t.rulesBtn);
    set('gameOverTitle', t.gameOverTitle);
    set('winnerTitle', t.winnerTitle);
    set('finalStandingsTitle', t.finalStandingsTitle);
    set('play-again', t.playAgainBtn);

    const playerSelect = document.getElementById('player-count');
    if (playerSelect) {
        playerSelect.querySelectorAll('option').forEach(option => {
            option.textContent = `${option.value} ${t.players}`;
        });
    }
    const sizeSelect = document.getElementById('board-size');
    if (sizeSelect) {
        sizeSelect.querySelectorAll('option').forEach(option => {
            option.textContent = `${option.value} ${t.cells}`;
        });
    }
}

document.addEventListener('DOMContentLoaded', applyGameTranslations);
