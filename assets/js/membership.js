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
            alert("⚠️ Akses Ditolak: Anda harus mendaftar ke Membership Premium (TERAVIA STARTER) terlebih dahulu untuk dapat memasang iklan!");
            // Opsional: Alihkan ke halaman registrasi/login jika sudah ada nanti
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
            // Jika memaksa masuk lewat URL, kosongkan layar dan tendang kembali ke beranda
            document.body.innerHTML = `
                <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; text-align:center; padding:20px;">
                    <h1 style="color:#e74c3c;">🔒 Akses Terkunci</h1>
                    <p>Halaman ini hanya dapat diakses oleh akun TERAVIA STARTER Premium.</p>
                    <p>Mengalihkan Anda kembali ke Beranda...</p>
                </div>
            `;
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 3000);
        } else {
            resolve(true);
        }
    });
}
