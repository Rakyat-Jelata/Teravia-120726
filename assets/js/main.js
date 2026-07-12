// teravia/assets/js/main.js

import { initLayer1Protection, applyLayer2Protection } from './membership.js';
import { initPromoCountdown } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Jalankan Timer Promo terlebih dahulu (Mandiri & Tanpa Await)
    initPromoCountdown('promo-countdown', 2.75); 

    // 2. Jalankan Proteksi Layer 1 secara Global
    initLayer1Protection();

    // 3. Jalankan Proteksi Layer 2 khusus di halaman pasang-iklan
    if (window.location.pathname.includes('pasang-iklan.html')) {
        try {
            await applyLayer2Protection();
        } catch (error) {
            console.error("Layer 2 Protection Error:", error);
        }
    }

    console.log("TERAVIA Core Engine & Premium Utilities initialized successfully.");
});
