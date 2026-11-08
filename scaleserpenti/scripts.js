document.addEventListener('DOMContentLoaded', () => {
    // ===================================================================
    // Config
    // ===================================================================
    const COLS = 10;
    const MAX_ITEMS = 3;
    const TRAP_BACK = 5;
    const PLAYER_COLORS = ['#ff5d73', '#3ec7ff', '#ffd23f', '#7bd88f', '#c08bff', '#ff9f43', '#ff7eb6', '#4de1c1'];
    const SNAKE_COLORS = [
        ['#3fbf5f', '#b4f57a'], ['#e94b5b', '#ffc0a8'], ['#8f5cf0', '#dcc4ff'],
        ['#f0a020', '#ffe59a'], ['#2fb5c9', '#b2f4ff'], ['#e0569b', '#ffc4e1']
    ];

    // Items obtained on power-up squares (weight = how often they show up)
    const ITEM_WEIGHTS = { boost: 18, remote: 16, double: 14, shield: 12, missile: 10, trap: 10, loaded: 9, freeze: 9 };
    // Surprise cards: kind = good / bad / chaos
    const EVENTS = {
        wind:       { kind: 'good',  w: 10, x: [2, 5], icon: 'up' },
        banana:     { kind: 'bad',   w: 10, x: [2, 5], icon: 'down' },
        skip:       { kind: 'bad',   w: 6,  icon: 'clock' },
        extra:      { kind: 'good',  w: 7,  icon: 'dice' },
        gift:       { kind: 'good',  w: 8,  icon: 'gift' },
        bonus:      { kind: 'good',  w: 7,  x: [2, 3], icon: 'plus' },
        halve:      { kind: 'bad',   w: 5,  icon: 'half' },
        reverse:    { kind: 'bad',   w: 5,  icon: 'reverse' },
        othersBack: { kind: 'good',  w: 5,  x: [2, 4], icon: 'quake' },
        othersFwd:  { kind: 'bad',   w: 4,  x: [2, 3], icon: 'up' },
        party:      { kind: 'chaos', w: 4,  x: [3, 3], icon: 'party' },
        slipstream: { kind: 'good',  w: 5,  icon: 'wind' },
        thief:      { kind: 'bad',   w: 5,  icon: 'hand' },
        robin:      { kind: 'good',  w: 5,  icon: 'hand' },
        shuffle:    { kind: 'chaos', w: 2,  icon: 'shuffle' },
        lastUp:     { kind: 'chaos', w: 4,  x: [6, 6], icon: 'up' },
        snakeCall:  { kind: 'bad',   w: 3,  icon: 'snake' },
        ladderCall: { kind: 'good',  w: 4,  icon: 'ladder' }
    };

    // ===================================================================
    // Icons (24x24 SVG, coloured with currentColor)
    // ===================================================================
    const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
    const ICONS = {
        power: '<path d="M13.5 2 4.5 13.5h6.5L9.5 22l10-12.5h-6.8z" fill="currentColor"/>',
        event: `<circle cx="12" cy="12" r="9.5" ${S} stroke-width="2.2"/><path d="M9.3 9.2a2.8 2.8 0 1 1 4 2.5c-.9.4-1.3 1-1.3 1.9v.5" ${S} stroke-width="2.3"/><circle cx="12" cy="17.4" r="1.4" fill="currentColor"/>`,
        swap: `<path d="M4 8h14.5M15 4.5 18.5 8 15 11.5M20 16H5.5M9 12.5 5.5 16 9 19.5" ${S} stroke-width="2.4"/>`,
        teleport: `<circle cx="12" cy="12" r="9.5" ${S} stroke-width="1.8" stroke-dasharray="3 2.4"/><circle cx="12" cy="12" r="5.8" ${S} stroke-width="2"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/>`,
        cliff: `<ellipse cx="12" cy="17.5" rx="9" ry="3.6" fill="currentColor"/><path d="M12 2.5v9.5M8.2 8.4 12 12.2l3.8-3.8" ${S} stroke-width="2.4"/>`,
        trap: `<path d="M2.5 20h19" ${S} stroke-width="2"/><path d="M4 20 6.8 11 9.6 20M9.2 20 12 7.5 14.8 20M14.4 20l2.8-9 2.8 9" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>`,
        flag: `<path d="M5 22V3" ${S} stroke-width="2.2"/><path d="M5.5 4h14v9h-14z" fill="#fff"/><path d="M5.5 4h3.5v3H5.5zM12.5 4H16v3h-3.5zM9 7h3.5v3H9zM16 7h3.5v3H16zM5.5 10H9v3H5.5zM12.5 10H16v3h-3.5z" fill="#15101f"/>`,
        missile: `<path d="M2.5 12c2.4-2.6 7-3.6 11.5-3.1l4 1.2 3.5 1.9-3.5 1.9-4 1.2c-4.5.5-9.1-.5-11.5-3.1z" fill="currentColor"/><path d="M6 9.2 4 5.5h3.3l3 3.4M6 14.8 4 18.5h3.3l3-3.4" fill="currentColor" stroke="currentColor" stroke-width=".8" stroke-linejoin="round"/><circle cx="14.6" cy="12" r="1.3" fill="#15101f"/>`,
        boost: `<path d="M3 13.5 9.5 7v4h7V7l4.5 6.5-4.5 6.5v-4h-7v4z" fill="currentColor"/>`,
        plus: `<circle cx="12" cy="12" r="9.5" ${S} stroke-width="2"/><path d="M12 7v10M7 12h10" ${S} stroke-width="2.8"/>`,
        double: `<rect x="2.5" y="7.5" width="11" height="11" rx="2.5" ${S} stroke-width="2"/><rect x="10.5" y="3" width="11" height="11" rx="2.5" fill="currentColor"/><circle cx="5.6" cy="10.6" r="1.1" fill="currentColor"/><circle cx="10.4" cy="15.4" r="1.1" fill="currentColor"/><circle cx="13.6" cy="6.1" r="1.1" fill="#15101f"/><circle cx="16" cy="8.5" r="1.1" fill="#15101f"/><circle cx="18.4" cy="10.9" r="1.1" fill="#15101f"/>`,
        shield: `<path d="M12 2.2 4 5.2v6c0 5 3.4 9 8 10.6 4.6-1.6 8-5.6 8-10.6v-6z" fill="currentColor"/><path d="m8.4 12 2.6 2.6 4.8-5" fill="none" stroke="#15101f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
        remote: `<rect x="7" y="7" width="10" height="15" rx="2.5" fill="currentColor"/><path d="M12 7V2.8M8.6 3.6 12 2.4l3.4 1.2" ${S} stroke-width="1.8"/><circle cx="12" cy="11.2" r="1.7" fill="#15101f"/><path d="M9.6 15.6h4.8M9.6 18.4h4.8" stroke="#15101f" stroke-width="1.5" stroke-linecap="round"/>`,
        loaded: `<rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor"/><path d="m12 6.5 1.7 3.4 3.8.5-2.8 2.6.7 3.7L12 15l-3.4 1.7.7-3.7-2.8-2.6 3.8-.5z" fill="#15101f"/>`,
        freeze: `<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5M3.6 10.6l3.4-.9-.9-3.4M20.4 13.4l-3.4.9.9 3.4M6.1 17.7l.9-3.4-3.4-.9M17.9 6.3l-.9 3.4 3.4.9" ${S} stroke-width="1.8"/>`,
        up: `<path d="M12 21V4M5 10.5 12 3.5l7 7" ${S} stroke-width="2.8"/>`,
        down: `<path d="M12 3v17M5 13.5l7 7 7-7" ${S} stroke-width="2.8"/>`,
        clock: `<circle cx="12" cy="12" r="9.5" ${S} stroke-width="2.2"/><path d="M12 6.5V12l3.8 2.4" ${S} stroke-width="2.4"/>`,
        dice: `<rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor"/><circle cx="8" cy="8" r="1.6" fill="#15101f"/><circle cx="16" cy="8" r="1.6" fill="#15101f"/><circle cx="12" cy="12" r="1.6" fill="#15101f"/><circle cx="8" cy="16" r="1.6" fill="#15101f"/><circle cx="16" cy="16" r="1.6" fill="#15101f"/>`,
        gift: `<rect x="3" y="9" width="18" height="12" rx="1.5" fill="currentColor"/><rect x="2" y="6.5" width="20" height="4" rx="1" fill="currentColor"/><path d="M12 6.5V21" stroke="#15101f" stroke-width="2"/><path d="M12 6.5C10 2.5 6 3 7 5.5c.6 1.3 3 1 5 1zM12 6.5c2-4 6-3.5 5-1-.6 1.3-3 1-5 1z" ${S} stroke-width="1.8"/>`,
        half: `<circle cx="12" cy="12" r="9.5" ${S} stroke-width="2.2"/><path d="M12 2.5a9.5 9.5 0 0 1 0 19z" fill="currentColor"/>`,
        reverse: `<path d="M9 5 4 10l5 5" ${S} stroke-width="2.6"/><path d="M4.5 10H14a6 6 0 0 1 0 12h-3" ${S} stroke-width="2.6"/>`,
        quake: `<path d="M2 12h3l2-5 3 10 3-12 3 11 2-4h4" ${S} stroke-width="2.3"/>`,
        party: `<path d="M3 21 8.5 6.5l9 9z" fill="currentColor"/><path d="M13 4.5c1-1.2 2.6-1.4 3.4-.4M18.5 8.5c1.6-.3 2.9.6 2.9 1.9M15.5 2.5v.1M21 5.5v.1M19.5 13.5v.1" ${S} stroke-width="2"/>`,
        wind: `<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8" ${S} stroke-width="2.3"/>`,
        hand: `<path d="M7 12V6.5a1.5 1.5 0 0 1 3 0V11V4.5a1.5 1.5 0 0 1 3 0V11V5.5a1.5 1.5 0 0 1 3 0V12V8.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.6-2.8L3 15.5a1.6 1.6 0 0 1 2.5-2z" fill="currentColor"/>`,
        shuffle: `<path d="M3 7h3.5c5 0 6 10 11 10H21M3 17h3.5c2 0 3.3-1.6 4.3-3.6M21 7h-3.5c-2 0-3.3 1.6-4.3 3.6M18 4l3 3-3 3M18 14l3 3-3 3" ${S} stroke-width="2.2"/>`,
        snake: `<path d="M5 20c-2 0-2.5-2.5-.5-3.5S10 15 10 12 4 9.5 6 6.5 13 6 15 4.5" ${S} stroke-width="2.6"/><circle cx="17.5" cy="4" r="2.6" fill="currentColor"/>`,
        ladder: `<path d="M7 2v20M17 2v20M7 6h10M7 10.5h10M7 15h10M7 19.5h10" ${S} stroke-width="2.2"/>`
    };
    const icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

    // Die face SVG
    const PIPS = {
        1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[26, 26], [50, 50], [74, 74]],
        4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[27, 27], [73, 27], [50, 50], [27, 73], [73, 73]],
        6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]]
    };
    const dieSvg = v => `<svg viewBox="0 0 100 100">${(PIPS[v] || []).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9.5" fill="currentColor"/>`).join('')}</svg>`;

    // ===================================================================
    // Helpers
    // ===================================================================
    const T = () => getGameTranslations();
    const fmt = (s, o = {}) => String(s).replace(/\{(\w+)\}/g, (_, k) => (o[k] !== undefined ? o[k] : ''));
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    function weighted(map) {
        const entries = Object.entries(map).map(([k, v]) => [k, typeof v === 'number' ? v : v.w]);
        let r = Math.random() * entries.reduce((a, [, w]) => a + w, 0);
        for (const [k, w] of entries) { if ((r -= w) < 0) return k; }
        return entries[0][0];
    }
    function shuffleArr(a) {
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
    }

    // ===================================================================
    // DOM
    // ===================================================================
    const $ = id => document.getElementById(id);
    const screens = { setup: $('setup-screen'), play: $('play-screen'), gameover: $('gameover-screen') };
    const playerCountSelect = $('player-count');
    const playerNamesContainer = $('player-names-container');
    const startGameBtn = $('start-game');
    const boardWrap = $('board-wrap');
    const boardEl = $('board');
    const gridEl = $('board-grid');
    const artEl = $('board-art');
    const tokensEl = $('tokens');
    const stripEl = $('player-strip');
    const turnNameEl = $('turn-name');
    const statusTagsEl = $('status-tags');
    const itemsRowEl = $('items-row');
    const logEl = $('log');
    const diceBox = $('dice-box');
    const rollBtn = $('roll-btn');
    const toastEl = $('toast');
    const modalEl = $('modal');
    const modalCard = $('modal-card');
    const viewBtn = $('view-btn');

    // Tournament mode detection (self-contained, read-only)
    const __isTournament = new URLSearchParams(location.search).get('mode') === 'tournament';
    let __tPlayers = [];
    if (__isTournament) { try { __tPlayers = (JSON.parse(localStorage.getItem('tournamentState')) || {}).players || []; } catch (e) { } }
    const __tNames = __tPlayers.map(p => p.name);

    if (typeof applyGameTranslations === 'function') applyGameTranslations();

    // ===================================================================
    // State
    // ===================================================================
    let N = 200, ROWS = 20, bounce = true, density = 'normal', missileBack = 10;
    let cells = [];          // index 1..N → { type }
    let jumps = {};          // from → to (ladders & snakes)
    let ladders = [], snakes = [];
    let traps = {};          // cell → owner index
    let players = [];        // { name, color, pos, items, nextBonus, skip, halve, reverse, extra }
    let current = 0;
    let busy = false;
    let winner = null;
    let fitMode = false;
    let turn = { itemUsed: false, double: false, loaded: null };
    let itemUid = 0;

    // ===================================================================
    // Setup
    // ===================================================================
    function generatePlayerInputs() {
        const t = T();
        const count = parseInt(playerCountSelect.value);
        const existing = {};
        playerNamesContainer.querySelectorAll('input').forEach((inp, i) => existing[i] = inp.value);
        playerNamesContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const wrap = document.createElement('div');
            wrap.className = 'name-field';
            wrap.style.setProperty('--pc', PLAYER_COLORS[i]);
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player-name-${i}`;
            input.maxLength = 16;
            input.autocomplete = 'off';
            input.placeholder = fmt(t.playerNamePlaceholder, { n: i + 1 });
            if (existing[i]) input.value = existing[i];
            wrap.appendChild(input);
            playerNamesContainer.appendChild(wrap);
        }
    }
    playerCountSelect.addEventListener('change', generatePlayerInputs);
    generatePlayerInputs();

    $('rules-btn').addEventListener('click', showLegend);
    $('legend-btn').addEventListener('click', () => { if (!modalOpen) showLegend(); });
    viewBtn.addEventListener('click', () => { fitMode = !fitMode; layoutBoard(); followToken(current, false); });

    startGameBtn.addEventListener('click', () => {
        const t = T();
        const count = parseInt(playerCountSelect.value);
        N = parseInt($('board-size').value) || 200;
        density = $('density').value || 'normal';
        bounce = $('bounce').value !== 'off';
        players = [];
        for (let i = 0; i < count; i++) {
            const input = $(`player-name-${i}`);
            const name = (input && input.value.trim()) ? input.value.trim() : `${t.player} ${i + 1}`;
            players.push({ name, color: PLAYER_COLORS[i], pos: 1, items: [], nextBonus: 0, skip: 0, halve: false, reverse: false, extra: false });
        }
        startGame();
    });

    $('play-again').addEventListener('click', () => {
        players.forEach(p => Object.assign(p, { pos: 1, items: [], nextBonus: 0, skip: 0, halve: false, reverse: false, extra: false }));
        startGame();
    });

    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
        document.body.classList.toggle('playing', name === 'play');
    }

    // Tournament mode: pre-fill the roster and auto-start
    if (__isTournament && __tNames.length > 0) {
        const c = Math.min(Math.max(__tNames.length, 2), 8);
        playerCountSelect.value = String(c);
        generatePlayerInputs();
        __tNames.slice(0, c).forEach((n, i) => {
            const inp = $(`player-name-${i}`);
            if (inp && n) inp.value = n;
        });
        setTimeout(() => startGameBtn.click(), 0);
    }

    // ===================================================================
    // Board generation (different every game)
    // ===================================================================
    const rowOf = c => Math.floor((c - 1) / COLS);

    // Minimum distance between segments p1-p2 and q1-q2 (0 if they cross)
    function segDist(p1, p2, q1, q2) {
        const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
        const d1 = cross(q1, q2, p1), d2 = cross(q1, q2, p2), d3 = cross(p1, p2, q1), d4 = cross(p1, p2, q2);
        if (((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0))) return 0;
        const ptSeg = (p, a, b) => {
            const vx = b.x - a.x, vy = b.y - a.y;
            const len2 = vx * vx + vy * vy || 1;
            const t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2));
            return Math.hypot(p.x - (a.x + vx * t), p.y - (a.y + vy * t));
        };
        return Math.min(ptSeg(p1, q1, q2), ptSeg(p2, q1, q2), ptSeg(q1, p1, p2), ptSeg(q2, p1, p2));
    }

    function generateBoard() {
        ROWS = N / COLS;
        missileBack = Math.max(6, Math.round(N / 20));
        const scale = N / 200;
        const used = new Set([1, N]);
        cells = Array.from({ length: N + 1 }, () => ({ type: 'normal' }));
        jumps = {}; ladders = []; snakes = []; traps = {};

        const nL = Math.max(5, Math.round(10 * scale));
        const nS = Math.max(5, Math.round(10 * scale));
        const maxLen = Math.max(16, Math.round(N * 0.19));

        const place = (count, isLadder) => {
            const segLo = isLadder ? 2 : 12;
            const segHi = isLadder ? N - 12 : N - 1;
            const span = (segHi - segLo) / count;
            for (let i = 0; i < count; i++) {
                for (let tries = 0; tries < 500; tries++) {
                    const strict = tries < 250;
                    const lo = strict ? Math.floor(segLo + i * span) : segLo;
                    const hi = strict ? Math.floor(segLo + (i + 1) * span) : segHi;
                    const a = rnd(lo, Math.max(lo, hi));
                    const len = rnd(8, maxLen);
                    const b = isLadder ? a + len : a - len;
                    if (b < 2 || b > N - 1 || used.has(a) || used.has(b)) continue;
                    if (rowOf(a) === rowOf(b)) continue;
                    // keep endpoints from touching other endpoints (clearer drawing)
                    if (used.has(a + 1) && used.has(a - 1)) continue;
                    // prefer mostly-vertical pieces that don't cross each other
                    const pa = cellXY(a), pb = cellXY(b);
                    const colDiff = Math.abs(pa.col - pb.col);
                    if (colDiff > (tries < 300 ? 4 : 6)) continue;
                    const sameMin = tries < 300 ? 6 : 1.5;
                    const otherMin = tries < 200 ? 3 : 0;
                    const clash = ladders.concat(snakes).some(o => {
                        const d = segDist(pa, pb, cellXY(o.from), cellXY(o.to));
                        const same = (ladders.includes(o)) === isLadder;
                        return d < (same ? sameMin : otherMin);
                    });
                    if (clash) continue;
                    used.add(a); used.add(b);
                    (isLadder ? ladders : snakes).push({ from: a, to: b, color: pick(SNAKE_COLORS) });
                    jumps[a] = b;
                    break;
                }
            }
        };
        place(nL, true);
        place(nS, false);

        const mult = { few: 0.55, normal: 1, many: 1.7 }[density] || 1;
        const nPower = Math.max(3, Math.round(12 * scale * mult));
        const nEvent = Math.max(3, Math.round(12 * scale * mult));
        const nSwap = N >= 150 ? 2 : 1;
        const nTele = N >= 150 ? 2 : 1;

        const putRandom = (type, count, lo, hi) => {
            for (let i = 0; i < count; i++) {
                let opts = [];
                for (let c = lo; c <= hi; c++) {
                    if (used.has(c)) continue;
                    let near = false;
                    for (let d = -2; d <= 2; d++) if (cells[c + d] && cells[c + d].type === type) near = true;
                    if (!near) opts.push(c);
                }
                if (!opts.length) for (let c = lo; c <= hi; c++) if (!used.has(c)) opts.push(c);
                if (!opts.length) return;
                const c = pick(opts);
                used.add(c);
                cells[c].type = type;
            }
        };
        putRandom('cliff', 1, Math.round(N * 0.45), N - 8);
        putRandom('teleport', nTele, 10, N - 10);
        putRandom('swap', nSwap, 12, N - 5);
        putRandom('power', nPower, 3, N - 2);
        putRandom('event', nEvent, 3, N - 2);
    }

    // ===================================================================
    // Board rendering
    // ===================================================================
    function cellXY(c) {
        const idx = c - 1;
        const rb = Math.floor(idx / COLS);
        let col = idx % COLS;
        if (rb % 2 === 1) col = COLS - 1 - col;
        const row = ROWS - 1 - rb;
        return { col, row, x: (col + 0.5) * 10, y: (row + 0.5) * 10 };
    }

    function renderBoard() {
        const t = T();
        boardEl.style.aspectRatio = `${COLS} / ${ROWS}`;
        gridEl.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
        let html = '';
        for (let c = 1; c <= N; c++) {
            const { col, row } = cellXY(c);
            const rb = rowOf(c);
            const hue = (265 + rb * 23) % 360;
            const light = (col + row) % 2 === 0 ? 24 : 29;
            let type = cells[c].type;
            if (c === N) type = 'finish';
            if (c === 1) type = 'start';
            let inner = `<span class="num">${c}</span>`;
            if (type === 'finish') inner += icon('flag', 'cell-ic');
            else if (type === 'start') inner += `<span class="start-lbl">${t.startLabel}</span>`;
            else if (type !== 'normal') inner += icon(type, 'cell-ic');
            if (traps[c] !== undefined) inner += `<span class="trap-mark" style="--pc:${players[traps[c]].color}">${icon('trap')}</span>`;
            html += `<div class="cell t-${type}" data-c="${c}" style="grid-column:${col + 1};grid-row:${row + 1};--h:${hue};--l:${light}%">${inner}</div>`;
        }
        gridEl.innerHTML = html;
    }

    function renderArt() {
        const H = ROWS * 10;
        artEl.setAttribute('viewBox', `0 0 100 ${H}`);
        let out = '';
        // Ladders
        ladders.forEach(l => {
            const a = cellXY(l.from), b = cellXY(l.to);
            const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy);
            const ux = dx / L, uy = dy / L, px = -uy, py = ux, w = 2.1;
            const ax = a.x - ux * 1.5, ay = a.y - uy * 1.5, bx = b.x + ux * 1.5, by = b.y + uy * 1.5;
            const rails = [-1, 1].map(s => `M${(ax + px * w * s).toFixed(2)} ${(ay + py * w * s).toFixed(2)} L${(bx + px * w * s).toFixed(2)} ${(by + py * w * s).toFixed(2)}`).join(' ');
            const n = Math.max(2, Math.floor((L + 3) / 3.6));
            let rungs = '';
            for (let k = 1; k <= n; k++) {
                const s = k / (n + 1);
                const cx = ax + (bx - ax) * s, cy = ay + (by - ay) * s;
                rungs += `M${(cx - px * w).toFixed(2)} ${(cy - py * w).toFixed(2)} L${(cx + px * w).toFixed(2)} ${(cy + py * w).toFixed(2)} `;
            }
            out += `<g class="ladder"><path d="${rails} ${rungs}" stroke="rgba(8,5,14,.75)" stroke-width="2" fill="none" stroke-linecap="round"/>` +
                `<path d="${rungs}" stroke="#f2c37c" stroke-width="0.9" fill="none" stroke-linecap="round"/>` +
                `<path d="${rails}" stroke="#c9843f" stroke-width="1.15" fill="none" stroke-linecap="round"/></g>`;
        });
        // Snakes
        snakes.forEach(s => {
            const a = cellXY(s.from), b = cellXY(s.to);
            const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy);
            const ux = dx / L, uy = dy / L, px = -uy, py = ux;
            const waves = Math.max(1.5, L / 15);
            const amp = Math.min(3.6, 1.6 + L / 35);
            const ph = s.from % 2 ? 1 : -1;
            const pts = [];
            const NP = 56;
            for (let i = 0; i <= NP; i++) {
                const t = i / NP;
                const env = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05 + 0.04)), 0.6);
                const off = amp * env * Math.sin(t * waves * 2 * Math.PI) * ph;
                pts.push([a.x + dx * t + px * off, a.y + dy * t + py * off]);
            }
            const seg = (from, to) => 'M' + pts.slice(from, to + 1).map(p => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' L');
            let outline = '', body = '';
            const CH = 7;
            for (let i = 0; i < NP; i += CH) {
                const t = i / NP;
                const w = 3.1 * (1 - t * 0.72);
                const d = seg(i, Math.min(NP, i + CH));
                outline += `<path d="${d}" stroke="rgba(8,5,14,.7)" stroke-width="${(w + 0.9).toFixed(2)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
                body += `<path d="${d}" stroke="${s.color[0]}" stroke-width="${w.toFixed(2)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
            }
            const pattern = `<path d="${seg(3, Math.round(NP * 0.8))}" stroke="${s.color[1]}" stroke-width="0.85" stroke-dasharray="0.4 2.6" fill="none" stroke-linecap="round"/>`;
            const ang = Math.atan2(pts[0][1] - pts[2][1], pts[0][0] - pts[2][0]) * 180 / Math.PI;
            const head = `<g transform="translate(${a.x.toFixed(2)} ${a.y.toFixed(2)}) rotate(${ang.toFixed(1)})">` +
                `<path d="M3.6 0 L5.4 0 M5.4 0 L6.3 -0.8 M5.4 0 L6.3 0.8" stroke="#ff3b4d" stroke-width="0.45" stroke-linecap="round" fill="none"/>` +
                `<ellipse cx="0.6" cy="0" rx="3.4" ry="2.6" fill="rgba(8,5,14,.7)"/>` +
                `<ellipse cx="0.6" cy="0" rx="3" ry="2.2" fill="${s.color[0]}"/>` +
                `<circle cx="1.6" cy="-1.05" r="0.75" fill="#fff"/><circle cx="1.6" cy="1.05" r="0.75" fill="#fff"/>` +
                `<circle cx="1.85" cy="-1.05" r="0.38" fill="#111"/><circle cx="1.85" cy="1.05" r="0.38" fill="#111"/></g>`;
            out += `<g class="snake">${outline}${body}${pattern}${head}</g>`;
        });
        artEl.innerHTML = out;
    }

    function layoutBoard() {
        const t = T();
        viewBtn.textContent = fitMode ? t.viewZoom : t.viewAll;
        boardWrap.classList.toggle('fit', fitMode);
        if (fitMode) {
            const w = Math.min(boardWrap.clientWidth - 4, (boardWrap.clientHeight - 4) * COLS / ROWS);
            boardEl.style.width = Math.max(120, w) + 'px';
        } else {
            boardEl.style.width = '';
        }
        boardEl.style.setProperty('--cell', (boardEl.clientWidth / COLS) + 'px');
    }
    window.addEventListener('resize', () => { if (screens.play.classList.contains('active')) layoutBoard(); });

    // ===================================================================
    // Tokens
    // ===================================================================
    function renderTokens(highlight) {
        const H = ROWS * 10;
        const groups = {};
        players.forEach((p, i) => (groups[p.pos] = groups[p.pos] || []).push(i));
        if (tokensEl.children.length !== players.length) {
            tokensEl.innerHTML = players.map((p, i) =>
                `<div class="token" data-i="${i}" style="--pc:${p.color}"><span>${esc(tokenLabel(i))}</span></div>`).join('');
        }
        players.forEach((p, i) => {
            const el = tokensEl.children[i];
            const g = groups[p.pos];
            const k = g.length, idx = g.indexOf(i);
            const { x, y } = cellXY(p.pos);
            let ox = 0, oy = 0;
            if (k > 1) {
                const ang = (idx / k) * Math.PI * 2 - Math.PI / 2;
                const r = k > 3 ? 2.6 : 2.2;
                ox = Math.cos(ang) * r; oy = Math.sin(ang) * r;
            }
            el.style.left = ((x + ox) / 100 * 100) + '%';
            el.style.top = ((y + oy) / H * 100) + '%';
            el.classList.toggle('crowd', k > 2);
            el.classList.toggle('current', i === current);
            if (highlight === i) { el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop'); }
        });
    }

    function tokenEl(i) { return tokensEl.children[i]; }

    // Initial of the name, or the player number when two players share it
    function tokenLabel(i) {
        const ini = n => n.trim().charAt(0).toUpperCase();
        const mine = ini(players[i].name);
        const dup = players.some((q, j) => j !== i && ini(q.name) === mine);
        return dup ? String(i + 1) : mine;
    }

    function followToken(i, smooth = true) {
        if (fitMode || !players[i]) return;
        const { y } = cellXY(players[i].pos);
        const ty = boardEl.offsetTop + (y / (ROWS * 10)) * boardEl.clientHeight;
        const mid = boardWrap.scrollTop + boardWrap.clientHeight / 2;
        if (!smooth || Math.abs(ty - mid) > boardWrap.clientHeight * 0.18) {
            boardWrap.scrollTo({ top: ty - boardWrap.clientHeight / 2, behavior: smooth ? 'smooth' : 'auto' });
        }
    }

    // ===================================================================
    // Movement
    // ===================================================================
    async function walk(pi, delta) {
        const p = players[pi];
        if (!delta) return;
        const path = [];
        let pos = p.pos, dir = Math.sign(delta), remaining = Math.abs(delta), bounced = false;
        while (remaining > 0) {
            let nxt = pos + dir;
            if (nxt > N) {
                if (!bounce) break;
                dir = -1; nxt = pos - 1; bounced = true;
            }
            if (nxt < 1) break;
            pos = nxt; path.push(pos); remaining--;
        }
        const stepMs = Math.max(75, Math.min(175, 1900 / Math.max(1, path.length)));
        for (const c of path) {
            p.pos = c;
            renderTokens(pi);
            followToken(pi);
            await sleep(stepMs);
        }
        if (bounced) log(fmt(T().bounceLog, { n: N }));
        if (p.pos === N && winner === null) winner = pi;
        renderStrip();
    }

    async function slideTo(pi, to, kind) {
        const p = players[pi];
        const el = tokenEl(pi);
        el.classList.add('slide', kind || '');
        p.pos = to;
        renderTokens();
        followToken(pi);
        await sleep(kind === 'snake' ? 900 : 800);
        el.classList.remove('slide', 'snake', 'ladder');
        if (p.pos === N && winner === null) winner = pi;
        renderStrip();
    }

    async function teleportTo(pi, to) {
        const el = tokenEl(pi);
        el.classList.add('vanish');
        await sleep(380);
        el.classList.add('notrans');
        players[pi].pos = to;
        renderTokens();
        followToken(pi, false);
        void el.offsetWidth;
        el.classList.remove('notrans');
        el.classList.remove('vanish');
        el.classList.add('appear');
        await sleep(450);
        el.classList.remove('appear');
        renderStrip();
    }

    async function fallTo(pi, to) {
        const el = tokenEl(pi);
        el.classList.add('fall');
        await sleep(650);
        el.classList.add('notrans');
        players[pi].pos = to;
        renderTokens();
        followToken(pi, false);
        void el.offsetWidth;
        el.classList.remove('notrans', 'fall');
        el.classList.add('appear');
        await sleep(450);
        el.classList.remove('appear');
        renderStrip();
    }

    function flash(pi, cls) {
        const el = tokenEl(pi);
        if (!el) return;
        el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
        setTimeout(() => el.classList.remove(cls), 900);
    }

    // Shield: consumed automatically on the next bad thing
    async function tryShield(pi) {
        const p = players[pi];
        const idx = p.items.findIndex(it => it.type === 'shield');
        if (idx < 0) return false;
        p.items.splice(idx, 1);
        flash(pi, 'shielded');
        toast(fmt(T().shieldLog, { name: p.name }), 'good');
        log(fmt(T().shieldLog, { name: p.name }));
        renderPanel();
        await sleep(1000);
        return true;
    }

    // ===================================================================
    // Landing resolution
    // ===================================================================
    async function resolveLanding(pi, depth = 0, own = true) {
        if (winner !== null || depth > 6) return;
        const t = T();
        const p = players[pi];
        const c = p.pos;
        if (c >= N) { if (winner === null) winner = pi; return; }

        // Trap placed by a player
        if (traps[c] !== undefined) {
            delete traps[c];
            renderBoard();
            toast(fmt(t.trapLog, { name: p.name, x: TRAP_BACK }), 'bad');
            log(fmt(t.trapLog, { name: p.name, x: TRAP_BACK }));
            flash(pi, 'hit');
            await sleep(700);
            if (!(await tryShield(pi))) {
                await walk(pi, -TRAP_BACK);
                return resolveLanding(pi, depth + 1, own);
            }
            return;
        }

        // Ladder or snake
        if (jumps[c] !== undefined) {
            const to = jumps[c];
            const isSnake = to < c;
            const msg = fmt(isSnake ? t.snakeLog : t.ladderLog, { name: p.name, from: c, to });
            if (isSnake) {
                toast(msg, 'bad');
                flash(pi, 'hit');
                await sleep(450);
                if (await tryShield(pi)) return;
            } else {
                toast(msg, 'good');
            }
            log(msg);
            await slideTo(pi, to, isSnake ? 'snake' : 'ladder');
            return resolveLanding(pi, depth + 1, own);
        }

        const type = cells[c].type;
        if (type === 'cliff') {
            await showCard({ icon: 'cliff', kind: 'bad', tag: t.tagDanger, title: t.cliffTitle, text: fmt(t.cliffText, { name: p.name }) });
            if (!(await tryShield(pi))) {
                log(fmt(t.cliffLog, { name: p.name }));
                await fallTo(pi, 1);
            }
            return;
        }
        if (type === 'teleport') {
            await showCard({ icon: 'teleport', kind: 'magic', tag: t.tagMagic, title: t.teleportTitle, text: fmt(t.teleportText, { name: p.name }) });
            let dest;
            do { dest = rnd(2, N - 1); } while (dest === c);
            await teleportTo(pi, dest);
            const msg = fmt(t.teleportLog, { name: p.name, to: dest });
            toast(msg, 'magic'); log(msg);
            await sleep(500);
            return resolveLanding(pi, depth + 1, own);
        }
        if (!own) return;
        if (type === 'power') return gainItem(pi);
        if (type === 'event') return drawEvent(pi, depth);
        if (type === 'swap') return doSwap(pi);
    }

    // ===================================================================
    // Items
    // ===================================================================
    function itemName(it) { return fmt(T().items[it.type].name, { x: it.v }); }
    function itemDesc(it) {
        const x = it.type === 'missile' ? missileBack : it.type === 'trap' ? TRAP_BACK : it.v;
        return fmt(T().items[it.type].desc, { x });
    }

    async function gainItem(pi) {
        const t = T();
        const p = players[pi];
        const type = weighted(ITEM_WEIGHTS);
        const it = { type, v: (type === 'boost' || type === 'remote') ? rnd(1, 3) : 0, id: ++itemUid };
        if (p.items.length < MAX_ITEMS) {
            await showCard({ icon: type, kind: 'power', tag: t.tagPower, title: itemName(it), text: itemDesc(it) });
            p.items.push(it);
            log(fmt(t.itemGot, { name: p.name, item: itemName(it) }));
        } else {
            const buttons = p.items.map((old, i) => ({ label: fmt(t.discard, { item: itemName(old) }), value: i, icon: old.type }));
            buttons.push({ label: t.keepOld, value: -1, cls: 'ghost' });
            const choice = await showCard({
                icon: type, kind: 'power', tag: t.tagPower, title: itemName(it),
                text: itemDesc(it) + '<br><br><b>' + esc(fmt(t.bagFullText, { item: itemName(it) })) + '</b>', html: true, buttons
            });
            if (choice >= 0) {
                p.items[choice] = it;
                log(fmt(t.itemGot, { name: p.name, item: itemName(it) }));
            } else {
                log(fmt(t.bagFull, { item: itemName(it) }));
            }
        }
        renderPanel();
    }

    async function onItemTap(i) {
        if (busy || modalOpen || winner !== null) return;
        const t = T();
        const p = players[current];
        const it = p.items[i];
        if (!it) return;
        if (it.type === 'shield') {
            await showCard({ icon: 'shield', kind: 'power', title: itemName(it), text: itemDesc(it) + '<br><br>' + esc(t.shieldPassive), html: true, buttons: [{ label: t.gotIt, value: true }] });
            return;
        }
        if (turn.itemUsed) { toast(t.oneItem, 'bad'); return; }
        const go = await showCard({
            icon: it.type, kind: 'power', title: itemName(it), text: itemDesc(it),
            buttons: [{ label: t.use, value: true }, { label: t.cancel, value: false, cls: 'ghost' }]
        });
        if (!go) return;
        busy = true; renderPanel();
        const done = await useItem(current, it);
        if (done) {
            p.items = p.items.filter(x => x !== it);
            turn.itemUsed = true;
        }
        busy = false;
        renderAll();
        if (winner !== null) return endGame();
    }

    async function useItem(pi, it) {
        const t = T();
        const p = players[pi];
        const others = players.map((_, i) => i).filter(i => i !== pi);
        switch (it.type) {
            case 'boost':
                p.nextBonus += it.v;
                log(fmt(t.boostLog, { name: p.name, x: it.v }));
                return true;
            case 'double':
                turn.double = true;
                log(fmt(t.doubleLog, { name: p.name }));
                return true;
            case 'loaded': {
                const v = await showCard({
                    icon: 'loaded', kind: 'power', title: t.faceTitle, text: '',
                    dice: true, buttons: [{ label: t.cancel, value: null, cls: 'ghost' }]
                });
                if (!v) return false;
                turn.loaded = v;
                log(fmt(t.loadedLog, { name: p.name, x: v }));
                return true;
            }
            case 'missile': {
                const max = Math.max(...players.map(q => q.pos));
                const targets = players.map((_, i) => i).filter(i => players[i].pos === max);
                const msg = fmt(t.missileLog, { names: targets.map(i => players[i].name).join(', ') });
                toast(msg, 'bad'); log(msg);
                await fireMissile(pi, targets[0]);
                for (const ti of targets) {
                    flash(ti, 'hit');
                    if (await tryShield(ti)) continue;
                    await walk(ti, -missileBack);
                    await resolveLanding(ti, 0, false);
                    if (winner !== null) break;
                }
                return true;
            }
            case 'remote': {
                const ti = await choosePlayer(t.remoteTitle, others, true);
                if (ti === null) return false;
                const dir = await showCard({
                    icon: 'remote', kind: 'power', title: t.directionTitle, text: players[ti].name,
                    buttons: [{ label: fmt(t.fwd, { x: it.v }), value: 1, icon: 'up' }, { label: fmt(t.back, { x: it.v }), value: -1, icon: 'down' }, { label: t.cancel, value: 0, cls: 'ghost' }]
                });
                if (!dir) return false;
                log(fmt(t.remoteLog, { name: p.name, target: players[ti].name, x: it.v, dir: dir > 0 ? t.dirFwd : t.dirBack }));
                if (dir < 0 && await tryShield(ti)) return true;
                await walk(ti, dir * it.v);
                await resolveLanding(ti, 0, false);
                return true;
            }
            case 'trap': {
                const c = p.pos;
                if (c <= 1 || c >= N || cells[c].type !== 'normal' || jumps[c] !== undefined || traps[c] !== undefined) {
                    toast(t.trapInvalid, 'bad');
                    return false;
                }
                traps[c] = pi;
                renderBoard();
                log(fmt(t.trapPlaced, { c }));
                return true;
            }
            case 'freeze': {
                const ti = await choosePlayer(t.freezeTitle, others, true);
                if (ti === null) return false;
                if (await tryShield(ti)) return true;
                players[ti].skip++;
                flash(ti, 'frozen');
                const msg = fmt(t.frozenLog, { name: players[ti].name });
                toast(msg, 'bad'); log(msg);
                return true;
            }
        }
        return false;
    }

    async function fireMissile(from, to) {
        const a = tokenEl(from), b = tokenEl(to);
        if (!a || !b) return;
        const m = document.createElement('div');
        m.className = 'missile-fx';
        m.innerHTML = icon('missile');
        boardEl.appendChild(m);
        const ax = parseFloat(a.style.left), ay = parseFloat(a.style.top);
        const bx = parseFloat(b.style.left), by = parseFloat(b.style.top);
        const ang = Math.atan2((by - ay) * ROWS / COLS, bx - ax) * 180 / Math.PI;
        m.style.left = ax + '%'; m.style.top = ay + '%';
        m.style.transform = `translate(-50%,-50%) rotate(${ang}deg)`;
        followToken(to);
        void m.offsetWidth;
        m.style.transition = 'left .9s cubic-bezier(.5,0,.8,.6), top .9s cubic-bezier(.5,0,.8,.6)';
        m.style.left = bx + '%'; m.style.top = by + '%';
        await sleep(900);
        m.classList.add('boom');
        await sleep(350);
        m.remove();
    }

    // ===================================================================
    // Surprise cards
    // ===================================================================
    async function drawEvent(pi, depth) {
        const t = T();
        const p = players[pi];
        const key = weighted(EVENTS);
        const ev = EVENTS[key];
        const x = ev.x ? rnd(ev.x[0], ev.x[1]) : 0;
        const tag = ev.kind === 'good' ? t.tagEventGood : ev.kind === 'bad' ? t.tagEventBad : t.tagEventChaos;
        await showCard({ icon: ev.icon, kind: ev.kind, tag, title: t.events[key].title, text: fmt(t.events[key].text, { x }) });
        log(`${p.name}: ${t.events[key].title}`);
        const others = players.map((_, i) => i).filter(i => i !== pi);

        switch (key) {
            case 'wind':
                await walk(pi, x);
                return resolveLanding(pi, depth + 1, true);
            case 'banana':
                if (await tryShield(pi)) return;
                await walk(pi, -x);
                return resolveLanding(pi, depth + 1, true);
            case 'skip':
                if (await tryShield(pi)) return;
                p.skip++;
                flash(pi, 'frozen');
                break;
            case 'extra':
                p.extra = true;
                break;
            case 'gift':
                return gainItem(pi);
            case 'bonus':
                p.nextBonus += x;
                break;
            case 'halve':
                if (await tryShield(pi)) return;
                p.halve = true;
                break;
            case 'reverse':
                if (await tryShield(pi)) return;
                p.reverse = true;
                break;
            case 'othersBack':
                for (const o of others) {
                    flash(o, 'hit');
                    if (await tryShield(o)) continue;
                    await walk(o, -x);
                    await resolveLanding(o, 0, false);
                }
                break;
            case 'othersFwd':
                for (const o of others) {
                    await walk(o, x);
                    await resolveLanding(o, 0, false);
                    if (winner !== null) break;
                }
                break;
            case 'party':
                for (let i = 0; i < players.length; i++) {
                    const o = (pi + i) % players.length;
                    await walk(o, x);
                    await resolveLanding(o, 0, false);
                    if (winner !== null) break;
                }
                break;
            case 'slipstream': {
                const ahead = others.filter(o => players[o].pos > p.pos).sort((a, b) => players[a].pos - players[b].pos);
                if (!ahead.length) {
                    toast(t.noOneAhead, 'good');
                    await walk(pi, 2);
                    return resolveLanding(pi, depth + 1, true);
                }
                await slideTo(pi, players[ahead[0]].pos, 'ladder');
                return resolveLanding(pi, depth + 1, false);
            }
            case 'thief': {
                if (!p.items.length) { toast(t.thiefNothing, 'good'); break; }
                if (await tryShield(pi)) return;
                const k = Math.floor(Math.random() * p.items.length);
                const lost = p.items.splice(k, 1)[0];
                const msg = fmt(t.stolen, { name: p.name, item: itemName(lost) });
                toast(msg, 'bad'); log(msg);
                break;
            }
            case 'robin': {
                const victims = others.filter(o => players[o].items.length > 0);
                if (!victims.length) {
                    toast(t.robinNobody, 'good');
                    await sleep(600);
                    return gainItem(pi);
                }
                const ti = await choosePlayer(t.robinPick, victims, false, o => players[o].items.map(it => icon(it.type)).join(''));
                const k = Math.floor(Math.random() * players[ti].items.length);
                const stolen = players[ti].items.splice(k, 1)[0];
                const msg = fmt(t.stoleFrom, { name: p.name, item: itemName(stolen), target: players[ti].name });
                if (p.items.length < MAX_ITEMS) p.items.push(stolen);
                else log(fmt(t.bagFull, { item: itemName(stolen) }));
                toast(msg, 'good'); log(msg);
                break;
            }
            case 'shuffle': {
                const positions = players.map(q => q.pos);
                let perm;
                let tries = 0;
                do { perm = shuffleArr(positions.slice()); tries++; } while (tries < 20 && perm.every((v, i) => v === positions[i]) && new Set(positions).size > 1);
                players.forEach((q, i) => tokenEl(i).classList.add('vanish'));
                await sleep(400);
                players.forEach((q, i) => { tokenEl(i).classList.add('notrans'); q.pos = perm[i]; });
                renderTokens();
                players.forEach((q, i) => { const el = tokenEl(i); void el.offsetWidth; el.classList.remove('notrans', 'vanish'); el.classList.add('appear'); });
                await sleep(500);
                players.forEach((q, i) => tokenEl(i).classList.remove('appear'));
                followToken(pi);
                log(t.shuffleLog);
                renderStrip();
                break;
            }
            case 'lastUp': {
                const min = Math.min(...players.map(q => q.pos));
                const last = players.findIndex(q => q.pos === min);
                await walk(last, x);
                await resolveLanding(last, 0, false);
                break;
            }
            case 'snakeCall': {
                const behind = snakes.filter(s => s.from < p.pos).sort((a, b) => b.from - a.from);
                if (!behind.length) {
                    toast(t.noSnakeBehind, 'bad');
                    if (await tryShield(pi)) return;
                    await walk(pi, -3);
                    return resolveLanding(pi, depth + 1, true);
                }
                await slideTo(pi, behind[0].from, 'snake');
                return resolveLanding(pi, depth + 1, false);
            }
            case 'ladderCall': {
                const ahead = ladders.filter(l => l.from > p.pos).sort((a, b) => a.from - b.from);
                if (!ahead.length) {
                    toast(t.noLadderAhead, 'good');
                    await walk(pi, 3);
                    return resolveLanding(pi, depth + 1, true);
                }
                await slideTo(pi, ahead[0].from, 'ladder');
                return resolveLanding(pi, depth + 1, false);
            }
        }
        renderPanel();
    }

    async function doSwap(pi) {
        const t = T();
        const p = players[pi];
        const others = players.map((_, i) => i).filter(i => i !== pi);
        const ti = await choosePlayer(t.swapTitle, others, true, null, t.swapText, 'swap', t.none);
        if (ti === null) return;
        if (await tryShield(ti)) return;
        const a = p.pos, b = players[ti].pos;
        tokenEl(pi).classList.add('slide');
        tokenEl(ti).classList.add('slide');
        p.pos = b; players[ti].pos = a;
        renderTokens();
        followToken(pi);
        await sleep(850);
        tokenEl(pi).classList.remove('slide');
        tokenEl(ti).classList.remove('slide');
        const msg = fmt(t.swapLog, { a: p.name, b: players[ti].name });
        toast(msg, 'magic'); log(msg);
        renderStrip();
    }

    // ===================================================================
    // Modal / cards
    // ===================================================================
    let modalOpen = false;
    function showCard(o) {
        const t = T();
        return new Promise(resolve => {
            modalOpen = true;
            const kind = o.kind || 'power';
            let html = '';
            if (o.icon) html += `<div class="card-icon k-${kind}">${icon(o.icon)}</div>`;
            if (o.tag) html += `<div class="card-tag k-${kind}">${esc(o.tag)}</div>`;
            if (o.title) html += `<h3 class="card-title">${esc(o.title)}</h3>`;
            if (o.text) html += `<p class="card-text">${o.html ? o.text : esc(o.text)}</p>`;
            if (o.body) html += o.body;
            if (o.dice) html += `<div class="face-grid">${[1, 2, 3, 4, 5, 6].map(v => `<button class="face-btn" data-v="${v}">${dieSvg(v)}</button>`).join('')}</div>`;
            const buttons = o.buttons || [{ label: t.ok, value: true }];
            html += `<div class="card-buttons ${buttons.length > 2 ? 'stack' : ''}">` + buttons.map((b, i) =>
                `<button class="btn ${b.cls === 'ghost' ? 'ghost-btn' : b.cls === 'player' ? 'player-btn' : 'primary-btn'} card-btn" data-b="${i}" ${b.color ? `style="--pc:${b.color}"` : ''}>${b.icon ? icon(b.icon) : ''}${b.dot ? `<i class="dot" style="background:${b.color}"></i>` : ''}<span>${esc(b.label)}</span>${b.extra ? `<em>${b.extra}</em>` : ''}</button>`).join('') + '</div>';
            modalCard.innerHTML = html;
            modalCard.className = 'modal-card' + (o.wide ? ' wide' : '');
            modalEl.classList.add('open');
            const close = v => {
                modalEl.classList.remove('open');
                modalOpen = false;
                setTimeout(() => resolve(v), 160);
            };
            modalCard.querySelectorAll('.card-btn').forEach(btn => btn.addEventListener('click', () => close(buttons[+btn.dataset.b].value), { once: true }));
            modalCard.querySelectorAll('.face-btn').forEach(btn => btn.addEventListener('click', () => close(+btn.dataset.v), { once: true }));
        });
    }

    function choosePlayer(title, list, cancellable, extraFn, text, iconName, cancelLabel) {
        const t = T();
        const buttons = list.map(i => ({
            label: players[i].name, value: i, color: players[i].color, dot: true, cls: 'player',
            extra: (extraFn ? extraFn(i) : '') + `<b>${players[i].pos}</b>`
        }));
        if (cancellable) buttons.push({ label: cancelLabel || t.cancel, value: null, cls: 'ghost' });
        return showCard({ icon: iconName || null, kind: 'magic', title, text: text || '', buttons });
    }

    function showLegend() {
        const t = T();
        const tiles = ['ladder', 'snake', 'power', 'event', 'swap', 'teleport', 'cliff', 'trap', 'finish'];
        const tileIcon = { ladder: 'ladder', snake: 'snake', finish: 'flag' };
        const row = (ic, name, desc, cls) => `<div class="lg-row"><div class="lg-ic ${cls}">${icon(ic)}</div><div><b>${esc(name)}</b><span>${esc(desc)}</span></div></div>`;
        let body = `<div class="legend">`;
        body += `<h4>${esc(t.legendRules)}</h4><ul class="lg-rules">${t.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul>`;
        body += `<h4>${esc(t.legendTiles)}</h4>`;
        tiles.forEach(k => body += row(tileIcon[k] || k, t.tiles[k].name, fmt(t.tiles[k].desc, { x: TRAP_BACK }), 'tile-' + k));
        body += `<h4>${esc(t.legendItems)}</h4>`;
        Object.keys(ITEM_WEIGHTS).forEach(k => {
            const it = { type: k, v: 'X' };
            body += row(k, itemName(it), itemDesc(Object.assign(it, { v: 'X' })), 'tile-power');
        });
        body += `</div>`;
        showCard({ title: t.legendTitle, body, wide: true, buttons: [{ label: t.gotIt, value: true }] });
    }

    // Tap a square to know what it does
    gridEl.addEventListener('click', e => {
        const cellDiv = e.target.closest('.cell');
        if (!cellDiv || modalOpen) return;
        const t = T();
        const c = +cellDiv.dataset.c;
        let msg = fmt(t.cellLabel, { c }) + ': ';
        if (traps[c] !== undefined) msg += t.tiles.trap.name + ' — ' + fmt(t.tiles.trap.desc, { x: TRAP_BACK });
        else if (jumps[c] !== undefined) {
            const k = jumps[c] > c ? 'ladder' : 'snake';
            msg += `${t.tiles[k].name} → ${jumps[c]}`;
        } else if (c === N) msg += t.tiles.finish.desc;
        else if (cells[c].type !== 'normal') msg += t.tiles[cells[c].type].name + ' — ' + t.tiles[cells[c].type].desc;
        else return;
        toast(msg, 'info');
    });

    // ===================================================================
    // UI rendering
    // ===================================================================
    let toastTimer = null;
    function toast(msg, kind = 'info') {
        toastEl.textContent = msg;
        toastEl.className = 'toast show k-' + kind;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
    }
    function log(msg) {
        logEl.textContent = msg;
        logEl.classList.remove('pop'); void logEl.offsetWidth; logEl.classList.add('pop');
    }

    function renderStrip() {
        const ranking = players.map((p, i) => i).sort((a, b) => players[b].pos - players[a].pos);
        stripEl.innerHTML = players.map((p, i) => `
            <div class="chip ${i === current ? 'current' : ''}" style="--pc:${p.color}">
                <span class="chip-dot">${esc(tokenLabel(i))}</span>
                <span class="chip-name">${esc(p.name)}</span>
                <span class="chip-pos">${p.pos}</span>
                ${ranking[0] === i && p.pos > 1 ? '<span class="chip-crown"></span>' : ''}
                ${p.skip ? `<span class="chip-flag">${icon('freeze')}</span>` : ''}
            </div>`).join('');
        const cur = stripEl.children[current];
        if (cur) cur.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    }

    function renderPanel() {
        const t = T();
        const p = players[current];
        if (!p) return;
        turnNameEl.innerHTML = `<i class="dot" style="background:${p.color}"></i>${esc(fmt(t.turnOf, { name: p.name }))}`;
        turnNameEl.style.setProperty('--pc', p.color);
        const tags = [];
        if (p.nextBonus > 0) tags.push(['good', fmt(t.tagBonus, { x: p.nextBonus })]);
        if (p.nextBonus < 0) tags.push(['bad', fmt(t.tagMalus, { x: p.nextBonus })]);
        if (turn.double) tags.push(['good', t.tagDouble]);
        if (turn.loaded) tags.push(['good', fmt(t.tagLoaded, { x: turn.loaded })]);
        if (p.halve) tags.push(['bad', t.tagHalve]);
        if (p.reverse) tags.push(['bad', t.tagReverse]);
        statusTagsEl.innerHTML = tags.map(([k, s]) => `<span class="stag k-${k}">${esc(s)}</span>`).join('');

        if (!p.items.length) {
            itemsRowEl.innerHTML = `<div class="no-items">${esc(t.noItems)}</div>`;
        } else {
            let html = '';
            for (let i = 0; i < MAX_ITEMS; i++) {
                const it = p.items[i];
                if (it) {
                    const disabled = busy || (turn.itemUsed && it.type !== 'shield');
                    html += `<button class="item ${it.type === 'shield' ? 'passive' : ''} ${disabled ? 'disabled' : ''}" data-i="${i}">${icon(it.type)}<span>${esc(itemName(it))}</span></button>`;
                } else {
                    html += `<div class="item empty"></div>`;
                }
            }
            itemsRowEl.innerHTML = html;
            itemsRowEl.querySelectorAll('button.item').forEach(b => b.addEventListener('click', () => onItemTap(+b.dataset.i)));
        }
        rollBtn.disabled = busy || winner !== null;
        rollBtn.textContent = (turn.double ? t.rollBtnDouble : t.rollBtn);
        rollBtn.style.setProperty('--pc', p.color);
    }

    function renderDice(values, rolling) {
        diceBox.innerHTML = values.map(v => `<div class="die ${rolling ? 'rolling' : ''}">${dieSvg(v)}</div>`).join('');
    }

    function renderAll() {
        renderStrip();
        renderTokens();
        renderPanel();
    }

    // ===================================================================
    // Game flow
    // ===================================================================
    function startGame() {
        winner = null;
        current = 0;
        fitMode = false;
        generateBoard();
        showScreen('play');
        tokensEl.innerHTML = '';
        renderBoard();
        renderArt();
        layoutBoard();
        renderDice([1]);
        logEl.textContent = '';
        renderAll();
        requestAnimationFrame(() => { layoutBoard(); renderTokens(); boardWrap.scrollTop = boardWrap.scrollHeight; beginTurn(); });
    }

    async function beginTurn() {
        if (winner !== null) return endGame();
        const t = T();
        const p = players[current];
        turn = { itemUsed: false, double: false, loaded: null };
        renderAll();
        followToken(current);
        if (p.skip > 0) {
            p.skip--;
            busy = true; renderPanel();
            await showCard({ icon: 'clock', kind: 'bad', tag: t.tagTurn, title: t.skipTitle, text: fmt(t.skipText, { name: p.name }) });
            log(fmt(t.skipLog, { name: p.name }));
            busy = false;
            return nextPlayer();
        }
        log(t.rollHint);
    }

    function nextPlayer() {
        current = (current + 1) % players.length;
        beginTurn();
    }

    rollBtn.addEventListener('click', async () => {
        if (busy || modalOpen || winner !== null) return;
        const t = T();
        const p = players[current];
        busy = true;
        renderPanel();

        // Roll animation
        const nDice = turn.double ? 2 : 1;
        for (let f = 0; f < 9; f++) {
            renderDice(Array.from({ length: nDice }, () => rnd(1, 6)), true);
            await sleep(60);
        }
        const values = turn.loaded ? [turn.loaded] : Array.from({ length: nDice }, () => rnd(1, 6));
        renderDice(values, false);
        const roll = values.reduce((a, b) => a + b, 0);
        let total = roll + p.nextBonus;
        p.nextBonus = 0;
        if (p.halve) { total = Math.ceil(total / 2); p.halve = false; }
        total = Math.max(0, total);
        let dir = 1;
        if (p.reverse) { dir = -1; p.reverse = false; }
        turn.double = false; turn.loaded = null;
        renderPanel();

        const rollTxt = values.join(' + ');
        if (dir < 0) log(fmt(t.rollBack, { name: p.name, total }));
        else if (total !== roll || values.length > 1) log(fmt(t.rollLogMod, { name: p.name, roll: rollTxt, total }));
        else log(fmt(t.rollLog, { name: p.name, roll: rollTxt }));
        await sleep(350);

        await walk(current, total * dir);
        await resolveLanding(current, 0, true);
        renderAll();

        if (winner !== null) { busy = false; return endGame(); }
        busy = false;
        if (p.extra) {
            p.extra = false;
            toast(fmt(t.extraLog, { name: p.name }), 'good');
            log(fmt(t.extraLog, { name: p.name }));
            await sleep(500);
            return beginTurn();
        }
        await sleep(250);
        nextPlayer();
    });

    async function endGame() {
        const t = T();
        const w = players[winner];
        busy = true;
        renderAll();
        flash(winner, 'winner');
        toast(fmt(t.winLog, { name: w.name }), 'good');
        log(fmt(t.winLog, { name: w.name }));
        await sleep(1600);
        busy = false;
        $('winner-name').textContent = w.name;
        const order = players.map((p, i) => i).sort((a, b) => (b === winner) - (a === winner) || players[b].pos - players[a].pos);
        $('final-standings').innerHTML = order.map((i, r) => `
            <div class="standings-row ${i === winner ? 'leader' : ''}" style="--pc:${players[i].color}">
                <span class="rank-name"><i class="dot" style="background:${players[i].color}"></i>${r + 1}. ${esc(players[i].name)}</span>
                <span class="rank-score">${esc(fmt(t.cellShort, { c: players[i].pos }))}</span>
            </div>`).join('');
        showScreen('gameover');
        window.scrollTo(0, 0);
    }
});
