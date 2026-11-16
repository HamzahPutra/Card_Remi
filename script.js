let gameState = {
    players: [],
    currentTurn: 0,
    deck: [],
    boardCards: [],
    playerCount: 4,
    hasDrawn: false,          // Pelacak: Apakah pemain sudah ambil kartu?
    selectedCardIndex: null   // Pelacak: Indeks kartu di tangan yang dipilih untuk dibuang
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
    gameState.selectedCardIndex = null;

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
        statusEl.innerText = "Status: Pilih kartu di tangan, lalu buang ke papan.";
        statusEl.style.color = "#4caf50";
    }

    // Render Tangan dengan dukungan pemilihan kartu (selected)
    const handArea = document.getElementById('playerHandArea');
    handArea.innerHTML = '';
    activePlayer.hand.forEach((card, index) => {
        let isSelected = (gameState.selectedCardIndex === index) ? ' selected' : '';
        handArea.innerHTML += `<div class="card-item${isSelected}" onclick="pilihKartuTangan(${index})">${card.name}</div>`;
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

// Fungsi saat pemain mengetuk kartu di tangannya sendiri
function pilihKartuTangan(index) {
    // Jika diklik dua kali pada kartu yang sama, batalkan pilihan
    if (gameState.selectedCardIndex === index) {
        gameState.selectedCardIndex = null;
    } else {
        gameState.selectedCardIndex = index;
    }
    updateTampilanGame();
}

// Aksi 1: Ambil dari Deck
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
        alert(`Berhasil mengambil kartu: ${drawn.name}`);
    } else {
        alert("Deck sudah habis!");
    }
}

// Aksi 2: Buang Kartu Terpilih ke Papan
function aksiBuangKePapan() {
    if (!gameState.hasDrawn) {
        alert("⚠️ Eits! Kamu harus AMBIL KARTU terlebih dahulu sebelum bisa membuang kartu!");
        return;
    }

    if (gameState.selectedCardIndex === null) {
        alert("⚠️ Silakan sentuh / pilih salah satu kartu di tanganmu terlebih dahulu yang ingin dibuang!");
        return;
    }

    const activePlayer = gameState.players[gameState.currentTurn];
    
    // Ambil kartu persis sesuai indeks yang dipilih pemain
    let discarded = activePlayer.hand.splice(gameState.selectedCardIndex, 1)[0];
    
    const maxLimit = (gameState.playerCount === 3) ? 5 : 7;
    if (gameState.boardCards.length >= maxLimit) {
        gameState.boardCards.shift(); // Buang kartu terlama di papan
    }
    gameState.boardCards.push(discarded);

    // Reset status untuk giliran pemain berikutnya
    gameState.hasDrawn = false;
    gameState.selectedCardIndex = null;
    gameState.currentTurn = (gameState.currentTurn + 1) % gameState.playerCount;
    
    updateTampilanGame();
}

// Aksi 3: Ambil Kartu dari Papan
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
