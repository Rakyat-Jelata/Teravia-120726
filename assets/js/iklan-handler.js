// teravia/assets/js/iklan-handler.js
import { applyLayer2Protection } from './membership.js';

// Jalankan sistem proteksi URL secara instan sebelum form dirender sepenuhnya
applyLayer2Protection().then((isCleared) => {
    if (!isCleared) return; // Jika ditendang ke halaman membership, stop eksekusi kode di bawah ini

    // Jika lolos proteksi, inisialisasi penanganan form iklan
    initIklanFormHandler();
});

function initIklanFormHandler() {
    const iklanForm = document.getElementById('iklan-form');
    if (!iklanForm) return;

    iklanForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Ambil nilai data input dari form
        const persona = document.querySelector('input[name="persona"]:checked').value;
        const judul = document.getElementById('judul').value;
        const harga = document.getElementById('harga').value;
        const lokasi = document.getElementById('lokasi').value;
        const kamarTidur = document.getElementById('kamar-tidur').value;
        const kamarMandi = document.getElementById('kamar-mandi').value;
        const luas = document.getElementById('luas-tanah').value;
        const deskripsi = document.getElementById('deskripsi').value;

        // Satukan ke dalam objek data properti baru
        const propertiBaru = {
            id: Date.now(), // Generate ID unik berbasis timestamp
            persona: persona.toUpperCase(),
            judul: judul,
            harga: parseFloat(harga),
            lokasi: lokasi,
            spesifikasi: { kamarTidur, kamarMandi, luas },
            deskripsi: deskripsi
        };

        // SIMULASI ARSITEKTUR: Simpan ke LocalStorage agar nantinya bisa dibaca otomatis oleh index.html (Beranda)
        const daftarListing = JSON.getJSON(localStorage.getItem('teravia_listings')) || [];
        daftarListing.unshift(propertiBaru); // Masukkan di urutan paling atas (terbaru)
        localStorage.setItem('teravia_listings', JSON.stringify(daftarListing));

        // Tampilkan konfirmasi sukses
        alert(`🎉 Iklan Berhasil Ditayangkan!\nSebagai member premium, iklan Anda otomatis berlabel VERIFIED ${persona.toUpperCase()}.`);

        // Kembalikan ke beranda utama untuk melihat hasilnya
        window.location.href = '../index.html';
    });
}
