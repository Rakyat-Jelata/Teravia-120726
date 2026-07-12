// teravia/assets/js/main.js

import { initLayer1Protection, applyLayer2Protection } from './membership.js';
// Import fungsi timer dari file utils
import { initPromoCountdown } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Jalankan Proteksi Layer 1 secara Global
    initLayer1Protection();

    // 2. Jalankan Proteksi Layer 2 khusus jika user berada di halaman pasang-iklan.html
    if (window.location.pathname.includes('pasang-iklan.html')) {
        await applyLayer2Protection();
    }

    // 3. Jalankan Timer Promo Countdown jika elemennya ada di halaman (seperti di index.html)
    initPromoCountdown('promo-countdown', 2.75); // Target durasi 2 jam 45 menit

    console.log("TERAVIA Core Engine & Premium Utilities initialized successfully.");
});
