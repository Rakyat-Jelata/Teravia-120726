// teravia/assets/js/utils.js

/**
 * Fungsi untuk menjalankan Countdown Timer Dummy yang realistis
 * @param {string} elementId - ID dari elemen HTML tujuan
 * @param {number} durationHours - Durasi hitung mundur dalam jam (jika ingin dinamis tiap sesi)
 */
export function initPromoCountdown(elementId, durationHours = 2.75) {
    const timerElement = document.getElementById(elementId);
    if (!timerElement) return;

    // Memanfaatkan localStorage agar timer tidak langsung reset ke awal secara instan saat refresh dalam waktu dekat
    let targetTime = localStorage.getItem('teravia_promo_target');
    
    if (!targetTime) {
        // Jika belum ada, set target waktu = waktu sekarang + durasi jam
        targetTime = new Date().getTime() + (durationHours * 60 * 60 * 1000);
        localStorage.setItem('teravia_promo_target', targetTime);
    } else {
        targetTime = parseInt(targetTime, 10);
        // Jika waktu target ternyata sudah lewat di masa lalu, reset ulang durasinya demi kebutuhan dummy promo
        if (new Date().getTime() > targetTime) {
            targetTime = new Date().getTime() + (durationHours * 60 * 60 * 1000);
            localStorage.setItem('teravia_promo_target', targetTime);
        }
    }

    // Fungsi interval pembaruan setiap 1 detik
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        // Hitung kalkulasi jam, menit, dan detik
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Format angka agar selalu dua digit (misal: 02:05:09)
        const formatNumber = (num) => String(num).padStart(2, '0');

        // Tampilkan hasil ke dalam elemen HTML
        timerElement.innerHTML = `Sisa waktu: <strong>${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}</strong>`;

        // Jika hitung mundur selesai
        if (distance < 0) {
            clearInterval(interval);
            timerElement.innerHTML = "Promo berakhir hari ini!";
            localStorage.removeItem('teravia_promo_target');
        }
    }, 1000);
}

