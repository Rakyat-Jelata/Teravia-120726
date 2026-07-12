// teravia/assets/js/utils.js

/**
 * Fungsi untuk menjalankan Countdown Timer Dummy yang realistis
 * @param {string} elementId - ID dari elemen HTML tujuan
 * @param {number} durationHours - Durasi hitung mundur dalam jam
 */
export function initPromoCountdown(elementId, durationHours = 2.75) {
    const timerElement = document.getElementById(elementId);
    
    // Guard 1: Jika elemen tidak ditemukan di halaman ini (misal di halaman pasang-iklan), langsung hentikan fungsi
    if (!timerElement) return;

    // Bersihkan localStorage yang berpotensi rusak dari sesi uji coba sebelumnya
    try {
        localStorage.removeItem('teravia_promo_target');
    } catch (e) {
        console.warn("LocalStorage access denied:", e);
    }

    // Gunakan perhitungan waktu statis berbasis waktu saat ini + durasi jam agar langsung aktif tanpa bug cache
    const targetTime = new Date().getTime() + (durationHours * 60 * 60 * 1000);

    // Fungsi interval pembaruan setiap 1 detik
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        // Jika waktu habis atau perhitungan error, berikan fallback aman
        if (distance <= 0 || isNaN(distance)) {
            clearInterval(interval);
            timerElement.innerHTML = "Sisa waktu: <strong>00:00:00</strong>";
            return;
        }

        // Kalkulasi jam, menit, dan detik
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Format angka agar selalu dua digit (01, 02, dst)
        const formatNumber = (num) => String(num).padStart(2, '0');

        // Suntikkan teks ke HTML
        timerElement.innerHTML = `Sisa waktu: <strong>${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}</strong>`;
    }, 1000);
}
