// --- SKRIP INTERAKSI TOMBOL & STATE GAME ---

// Jalankan saat halaman pertama kali dimuat untuk membuat input nama default
window.onload = function() {
    generatePlayerInputs();
};

// Fungsi dinamis untuk membuat kolom input nama berdasarkan pilihan dropdown
function generatePlayerInputs() {
    const count = document.getElementById('playerCountSelect').value;
    const container = document.getElementById('dynamicInputs');
    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        container.innerHTML += `
            <input type="text" id="setup_p${i}" placeholder="Nama Pemain ${i}" value="Pemain ${i}">
        `;
    }
}

// Tombol: Mulai Permainan (Pindah dari Layar Setup ke Layar Game)
function mulaiPermainan() {
    const count = document.getElementById('playerCountSelect').value;
    let names = [];
    
    for (let i = 1; i <= count; i++) {
        let nameVal = document.getElementById(`setup_p${i}`).value.trim();
        if(!nameVal) nameVal = `Pemain ${i}`;
        names.push(nameVal);
    }

    // Sembunyikan setup, tampilkan layar game
    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    // Atur batas papan sesuai jumlah pemain
    const limit = (count == 3) ? 5 : 7;
    document.getElementById('maxBoardLimit').innerText = limit;

    alert(`Game dimulai dengan ${count} pemain: ${names.join(', ')}! (File terpisah berhasil dimuat)`);
}

// Tombol: Ambil Kartu (Interaksi dasar)
function aksiAmbilKartu() {
    alert("Tombol Ambil Kartu ditekan! (Logika pengambilan kartu akan kita isi berikutnya).");
}

// Tombol: Buang Kartu (Interaksi dasar)
function aksiBuangKartu() {
    alert("Tombol Buang Kartu ditekan! (Logika pembuangan kartu akan kita isi berikutnya).");
}

// Tombol: Kembali ke Menu Setup
function resetKeMenu() {
    if(confirm("Keluar dari permainan saat ini?")) {
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('setupScreen').classList.remove('hidden');
    }
}

// --- STATE / PENYIMPANAN DATA UTAMA GAME ---
let gameState = {
    players: [],       // Daftar objek pemain (nama, tangan, skor)
    currentTurn: 0,    // Indeks pemain yang sedang jalan (0, 1, 2, dst)
    deck: [],          // Tumpukan kartu sisa di tengah
    boardCards: [],    // Kartu yang ada di papan meja tengah
    playerCount: 4     // Jumlah pemain (3 atau 4)
};

// Daftar Jenis Kartu (Suit) dan Pangkat (Rank)
const suits = ['Hati ♥', 'Wajik ♦', 'Sekop ♠', 'Keriting ♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'As'];

// Jalankan saat halaman pertama kali dimuat
window.onload = function() {
    generatePlayerInputs();
};

// Membuat input nama dinamis berdasarkan pilihan dropdown
function generatePlayerInputs() {
    const count = document.getElementById('playerCountSelect').value;
    const container = document.getElementById('dynamicInputs');
    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        container.innerHTML += `
            <input type="text" id="setup_p${i}" placeholder="Nama Pemain ${i}" value="Pemain ${i}">
        `;
    }
}

// --- 1. FUNGSI PEMBUATAN & PENGCOKAN DECK KARTU ---
function buatDanKocokDeck() {
    let fullDeck = [];

    // Buat kartu standar (52 kartu)
    suits.forEach(suit => {
        ranks.forEach(rank => {
            fullDeck.push({
                name: `${rank} ${suit}`,
                rank: rank,
                suit: suit,
                type: 'standard'
            });
        });
    });

    // Tambahkan 2 Kartu Joker ke dalam deck
    fullDeck.push({ name: 'Joker 🃏', rank: 'Joker', suit: 'Wild', type: 'joker' });
    fullDeck.push({ name: 'Joker 🃏', rank: 'Joker', suit: 'Wild', type: 'joker' });

    // Algoritma Fisher-Yates Shuffle (Mengacak kartu secara acak)
    for (let i = fullDeck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
    }

    return fullDeck;
}

// --- 2. MULAI PERMAINAN & BAGI KARTU ---
function mulaiPermainan() {
    const count = parseInt(document.getElementById('playerCountSelect').value);
    gameState.playerCount = count;
    gameState.players = [];
    
    // Ambil nama dari input
    for (let i = 1; i <= count; i++) {
        let nameVal = document.getElementById(`setup_p${i}`).value.trim();
        if(!nameVal) nameVal = `Pemain ${i}`;
        
        gameState.players.push({
            name: nameVal,
            hand: [],
            score: 0
        });
    }

    // Buat dan kocok deck baru
    gameState.deck = buatDanKocokDeck();
    gameState.boardCards = [];
    gameState.currentTurn = 0;

    // Tentukan jumlah kartu berdasarkan aturanmu: 10 kartu (3 pemain), 7 kartu (4 pemain)
    const cardsPerPlayer = (count === 3) ? 10 : 7;

    // Bagikan kartu ke tangan masing-masing pemain
    gameState.players.forEach(player => {
        player.hand = gameState.deck.splice(0, cardsPerPlayer);
    });

    // Pindah tampilan dari Setup ke Layar Game
    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    // Atur batas papan di HTML
    const limit = (count === 3) ? 5 : 7;
    document.getElementById('maxBoardLimit').innerText = limit;

    // Render tampilan pertama game
    updateTampilanGame();
}

// --- 3. RENDER / PERBARUI TAMPILAN LAYAR GAME ---
function updateTampilanGame() {
    const activePlayer = gameState.players[gameState.currentTurn];

    // Update info giliran
    document.getElementById('turnInfo').innerText = `Giliran: ${activePlayer.name}`;
    document.getElementById('gameStatus').innerText = `Status: Silakan ambil atau buang kartu`;
    document.getElementById('activePlayerName').innerText = `Kartu di Tangan: ${activePlayer.name}`;

    // Tampilkan kartu di tangan pemain aktif
    const handArea = document.getElementById('playerHandArea');
    handArea.innerHTML = '';
    
    activePlayer.hand.forEach((card, index) => {
        handArea.innerHTML += `<div class="card-item" onclick="pilihKartuTangan(${index})">${card.name}</div>`;
    });

    // Tampilkan kartu di papan meja tengah
    const boardArea = document.getElementById('boardCardsArea');
    if (gameState.boardCards.length === 0) {
        boardArea.innerHTML = `<span style="color: #666; font-size: 13px;">Belum ada kartu di papan</span>`;
    } else {
        boardArea.innerHTML = '';
        gameState.boardCards.forEach((card, index) => {
            boardArea.innerHTML += `<div class="card-item" style="border-color: #4caf50;" onclick="pilihKartuPapan(${index})">${card.name}</div>`;
        });
    }
}

// --- 4. FUNGSI INTERAKSI SEMENTARA ---
function pilihKartuTangan(index) {
    const activePlayer = gameState.players[gameState.currentTurn];
    alert(`Kamu mengklik kartu: ${activePlayer.hand[index].name}`);
}

function pilihKartuPapan(index) {
    alert(`Kamu mengklik kartu di papan: ${gameState.boardCards[index].name}`);
}

function aksiAmbilKartu() {
    // Ambil 1 kartu teratas dari deck sisa di tengah (kalau ada)
    if (gameState.deck.length > 0) {
        let drawnCard = gameState.deck.pop();
        gameState.players[gameState.currentTurn].hand.push(drawnCard);
        updateTampilanGame();
        alert(`Berhasil mengambil kartu: ${drawnCard.name}`);
    } else {
        alert("Tumpukan kartu di tengah sudah habis!");
    }
}

function aksiBuangKartu() {
    const activePlayer = gameState.players[gameState.currentTurn];
    if (activePlayer.hand.length === 0) return;

    // Untuk uji coba sementara: buang kartu pertama di tangan ke papan meja
    let discardedCard = activePlayer.hand.shift();
    
    // Cek batas maksimal kartu di papan (3 pemain = 5, 4 pemain = 7)
    const maxLimit = (gameState.playerCount === 3) ? 5 : 7;
    if (gameState.boardCards.length >= maxLimit) {
        // Hapus kartu paling lama di papan jika melebihi batas
        gameState.boardCards.shift();
    }

    gameState.boardCards.push(discardedCard);

    // Pindah giliran ke pemain berikutnya secara berputar (0 -> 1 -> 2 -> 3 -> 0)
    gameState.currentTurn = (gameState.currentTurn + 1) % gameState.playerCount;

    updateTampilanGame();
}

// Kembali ke Menu Setup
function resetKeMenu() {
    if(confirm("Keluar dari permainan saat ini?")) {
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('setupScreen').classList.add('hidden'); // safety
        document.getElementById('setupScreen').classList.remove('hidden');
    }
}
