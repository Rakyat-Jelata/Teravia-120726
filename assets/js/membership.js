// teravia/assets/js/membership.js

/**
 * Layer 1: Mencegah user non-premium masuk ke halaman pasang iklan lewat tombol navigasi
 */
export function initLayer1Protection() {
    const btnPasangIklan = document.querySelector('.btn-pasang-iklan');
    
    // Guard: Jika tombol tidak ditemukan di halaman ini, hentikan fungsi dengan aman
    if (!btnPasangIklan) return;

    btnPasangIklan.addEventListener('click', (e) => {
        const isPremium = localStorage.getItem('isPremiumUser') === 'true';
        
        if (!isPremium) {
            e.preventDefault(); // Batalkan navigasi asli
            alert("⚠️ Akses Ditolak: Anda harus mendaftar ke Membership Premium (TERAVIA STARTER) terlebih dahulu!");
            
            // KORELASI: Alihkan langsung ke halaman pembayaran membership
            // Karena tombol ini ditekan dari index.html (root), jalurnya masuk ke folder pages
            window.location.href = 'pages/membership.html';
        }
    });
}

/**
 * Layer 2: Proteksi injeksi URL langsung ke halaman pasang-iklan.html
 */
export function applyLayer2Protection() {
    return new Promise((resolve) => {
        const isPremium = localStorage.getItem('isPremiumUser') === 'true';
        
        if (!isPremium) {
            // Jika memaksa masuk lewat URL pasang-iklan.html, kosongkan layar dan arahkan ke pendaftaran
            document.body.innerHTML = `
                <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; text-align:center; padding:20px;">
                    <h1 style="color:#e74c3c;">🔒 Akses Terkunci</h1>
                    <p>Halaman ini hanya dapat diakses oleh akun TERAVIA STARTER Premium.</p>
                    <p>Mengalihkan Anda ke halaman aktivasi Membership...</p>
                </div>
            `;
            setTimeout(() => {
                // KORELASI: Karena posisi pasang-iklan.html ada di dalam folder pages, 
                // untuk ke membership.html kita cukup panggil nama filenya langsung (sesama folder pages)
                window.location.href = './membership.html';
            }, 2500);
        } else {
            resolve(true);
        }
    });
}
