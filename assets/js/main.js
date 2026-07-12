// teravia/assets/js/main.js

// 1. Import modul keamanan proteksi membership
import { initLayer1Protection, applyLayer2Protection } from './membership.js';

/**
 * Global Initializer untuk TERAVIA
 * Berjalan otomatis di setiap halaman yang memanggil main.js
 */
document.addEventListener('DOMContentLoaded', async () => {
    
    // Jalankan Proteksi Layer 1 secara Global (Intersepsi klik tombol Pasang Iklan)
    initLayer1Protection();

    // Jalankan Proteksi Layer 2 khusus jika user berada di halaman pasang-iklan.html
    if (window.location.pathname.includes('pasang-iklan.html')) {
        await applyLayer2Protection();
    }

    console.log("TERAVIA Core Engine & Membership Protection initialized successfully.");
});
