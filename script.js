let gameState = {
    players: [],
    currentTurn: 0,
    deck: [],
    boardCards: [],
    playerCount: 4,
    hasDrawn: false // Pelacak: Apakah pemain sudah mengambil kartu di ronde ini?
};

const suits = ['Hati ♥', 'Wajik ♦', 'Sekop ♠', 'Keriting ♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'As'];

window.onload = function() {
    generatePlayerInputs();
};

function generatePlayerInputs() {
    const count = document.getElementById('playerCountSelect').value;
    const container = document.getElementById('dynamicInputs');
    container.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        container.innerHTML += `<input type="text" id="setup_p${i}" value="Pemain ${i}">`;
    }
}

function buatDanKocokDeck() {
    let fullDeck = [];
    suits.forEach(suit => {
        ranks.forEach(rank => {
            fullDeck.push({ name: `${rank} ${suit}`, rank: rank, suit: suit });
        });
    });
    // 2 Joker
    fullDeck.push({ name: 'Joker 🃏', rank: 'Joker', suit: 'Wild' });
    fullDeck.push({ name: 'Joker 🃏', rank: 'Joker', suit: 'Wild' });

    // Shuffle Fisher-Yates
    for (let i = fullDeck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
    }
    return fullDeck;
}

function mulaiPermainan() {
    const count = parseInt(document.getElementById('playerCountSelect').value);
    gameState.playerCount = count;
    gameState.players = [];
    
    for (let i = 1; i <= count; i++) {
        let nameVal = document.getElementById(`setup_p${i}`).value.trim() || `Pemain ${i}`;
        gameState.players.push({ name: nameVal, hand: [], score: 0 });
    }

    gameState.deck = buatDanKocokDeck();
    gameState.boardCards = [];
    gameState.currentTurn = 0;
    gameState.hasDrawn = false;

    const cardsPerPlayer = (count === 3) ? 10 : 7;
    gameState.players.forEach(player => {
        player.hand = gameState.deck.splice(0, cardsPerPlayer);
    });

    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    document.getElementById('maxBoardLimit').innerText = (count === 3) ? 5 : 7;

    updateTampilanGame();
}

function updateTampilanGame() {
    const activePlayer = gameState.players[gameState.currentTurn];

    document.getElementById('turnInfo').innerText = `Giliran: ${activePlayer.name}`;
    document.getElementById('activePlayerName').innerText = `Kartu di Tangan: ${activePlayer.name}`;

    const statusEl = document.getElementById('gameStatus');
    if (!gameState.hasDrawn) {
        statusEl.innerText = "Status: Wajib ambil kartu dari deck atau papan dulu!";
        statusEl.style.color = "#ff9800";
    } else {
        statusEl.innerText = "Status: Silakan buang kartu ke papan untuk mengakhiri giliran.";
        statusEl.style.color = "#4caf50";
    }

    // Render Tangan
    const handArea = document.getElementById('playerHandArea');
    handArea.innerHTML = '';
    activePlayer.hand.forEach((card, index) => {
        handArea.innerHTML += `<div class="card-item" onclick="pilihKartuTangan(${index})">${card.name}</div>`;
    });

    // Render Papan
    const boardArea = document.getElementById('boardCardsArea');
    if (gameState.boardCards.length === 0) {
        boardArea.innerHTML = `<span style="color: #666; font-size: 13px;">Belum ada kartu di papan</span>`;
    } else {
        boardArea.innerHTML = '';
        gameState.boardCards.forEach((card, index) => {
            boardArea.innerHTML += `<div class="card-item" style="border-color: #4caf50;" onclick="cobaAmbilKartuPapan(${index})">${card.name} (Ambil)</div>`;
        });
    }
}

function pilihKartuTangan(index) {
    const activePlayer = gameState.players[gameState.currentTurn];
    alert(`Kamu memilih kartu di tangan: ${activePlayer.hand[index].name}`);
}

function aksiAmbilDariDeck() {
    if (gameState.hasDrawn) {
        alert("Kamu sudah mengambil kartu pada giliran ini!");
        return;
    }

    if (gameState.deck.length > 0) {
        let drawn = gameState.deck.pop();
        gameState.players[gameState.currentTurn].hand.push(drawn);
        gameState.hasDrawn = true;
        updateTampilanGame();
        alert(`Berhasil mengambil kartu dari deck: ${drawn.name}`);
    } else {
        alert("Deck sudah habis!");
    }
}

function aksiBuangKePapan() {
    if (!gameState.hasDrawn) {
        alert("⚠️ Eits! Kamu harus AMBIL KARTU terlebih dahulu sebelum bisa membuang kartu!");
        return;
    }

    const activePlayer = gameState.players[gameState.currentTurn];
    if (activePlayer.hand.length === 0) return;

    let discarded = activePlayer.hand.shift();
    const maxLimit = (gameState.playerCount === 3) ? 5 : 7;
    
    if (gameState.boardCards.length >= maxLimit) {
        gameState.boardCards.shift();
    }
    gameState.boardCards.push(discarded);

    gameState.hasDrawn = false; 
    gameState.currentTurn = (gameState.currentTurn + 1) % gameState.playerCount;
    
    updateTampilanGame();
}

function cobaAmbilKartuPapan(boardIndex) {
    if (gameState.hasDrawn) {
        alert("Kamu sudah mengambil kartu pada giliran ini!");
        return;
    }

    let targetCard = gameState.boardCards[boardIndex];
    gameState.boardCards.splice(boardIndex, 1);
    gameState.players[gameState.currentTurn].hand.push(targetCard);
    gameState.hasDrawn = true;

    updateTampilanGame();
    alert(`Berhasil mengambil kartu ${targetCard.name} dari papan!`);
}

function resetKeMenu() {
    if(confirm("Keluar game?")) {
        location.reload();
    }
}
