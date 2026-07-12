// teravia/assets/js/membership.js

/**
 * Fungsi pembantu untuk membuat Custom Modal Popup Premium
 */
function showCustomModal(message, redirectUrl) {
    // Buat elemen overlay modal jika belum ada
    const modalHtml = `
        <div id="teravia-custom-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:9999; opacity:0; transition:opacity 0.3s ease;">
            <div style="background:#fff; width:90%; max-width:400px; padding:30px; border-radius:16px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.25); transform:scale(0.8); transition:transform 0.3s ease;" id="modal-box">
                <div style="font-size:50px; margin-bottom:15px;">🔒</div>
                <h3 style="margin:0 0 10px 0; color:#2c3e50; font-family:sans-serif; font-size:20px;">Akses Terbatasi</h3>
                <p style="margin:0 0 25px 0; color:#666; font-family:sans-serif; font-size:14px; line-height:1.5;">${message}</p>
                <button id="modal-redirect-btn" style="background:linear-gradient(135deg, #007bff, #0056b3); color:#fff; border:none; padding:12px 25px; font-weight:bold; border-radius:8px; cursor:pointer; width:100%; font-size:15px; box-shadow:0 4px 12px rgba(0,123,255,0.3);">Daftar Starter Premium</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modalOverlay = document.getElementById('teravia-custom-modal');
    const modalBox = document.getElementById('modal-box');
    
    // Animasi muncul
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalBox.style.transform = 'scale(1)';
    }, 10);

    // Event ketika tombol di klik
    document.getElementById('modal-redirect-btn').addEventListener('click', () => {
        modalOverlay.style.opacity = '0';
        modalBox.style.transform = 'scale(0.8)';
        setTimeout(() => {
            modalOverlay.remove();
            window.location.href = redirectUrl;
        }, 3000);
        window.location.href = redirectUrl;
    });
}

/**
 * Layer 1: Mencegah user non-premium masuk ke halaman pasang iklan lewat tombol navigasi
 */
export function initLayer1Protection() {
    const btnPasangIklan = document.querySelector('.btn-pasang-iklan');
    if (!btnPasangIklan) return;

    btnPasangIklan.addEventListener('click', (e) => {
        const isPremium = localStorage.getItem('isPremiumUser') === 'true';
        if (!isPremium) {
            e.preventDefault(); 
            // Panggil custom modal elegan
            showCustomModal(
                "Anda harus terdaftar dalam keanggotaan premium <strong>TERAVIA STARTER</strong> untuk dapat memasang iklan properti.", 
                'pages/membership.html'
            );
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
            document.body.innerHTML = `
                <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; text-align:center; padding:20px; background:#f4f6f9;">
                    <div style="background:#fff; padding:40px; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,0.05); max-width:450px;">
                        <h1 style="color:#e74c3c; margin-bottom:10px;">🔒 Akses Terkunci</h1>
                        <p style="color:#555; line-height:1.6; margin-bottom:20px;">Halaman form pasang iklan hanya dapat diakses oleh mitra dengan akun TERAVIA STARTER Premium.</p>
                        <p style="color:#888; font-size:13px;">Mengalihkan Anda ke halaman aktivasi...</p>
                    </div>
                </div>
            `;
            setTimeout(() => {
                window.location.href = './membership.html';
            }, 2500);
        } else {
            resolve(true);
        }
    });
}
