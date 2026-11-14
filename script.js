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
