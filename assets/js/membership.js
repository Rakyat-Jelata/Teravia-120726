import { getCurrentUser } from './auth.js';

/**
 * KAMUS DATA PAKET MEMBERSHIP (Client-side Data Source)
 */
export const MEMBERSHIP_PACKETS = {
    FREE: { name: 'FREE', price: 'Rp 0', maxListing: 0, boost: '❌ Tidak dapat memasang iklan', badge: 'FREE' },
    STARTER: { name: 'STARTER', price: 'Rp 50.000', maxListing: 10, boost: '10x / bulan', badge: '⭐ STARTER' },
    PRO: { name: 'PRO', price: 'Rp 150.000', maxListing: 100, boost: '100x / bulan', badge: '⭐⭐ PRO' },
    BUSINESS: { name: 'BUSINESS', price: 'Rp 500.000', maxListing: 500, boost: 'Unlimited Sundul', badge: '⭐⭐⭐ BUSINESS' },
    ENTERPRISE: { name: 'ENTERPRISE', price: 'Hubungi Admin', maxListing: 'Unlimited', boost: 'Unlimited Sundul', badge: '🏢 ENTERPRISE' }
};

/**
 * LAYER 1: Proteksi Navigasi Global / Klik Tombol "Pasang Iklan"
 * Mencegah user FREE melompat ke halaman pasang iklan secara tidak sengaja.
 */
export function initLayer1Protection() {
    document.addEventListener('click', async (e) => {
        // Cari elemen link atau tombol pasang iklan berdasarkan atribut href atau class
        const target = e.target.closest('a[href*="pasang-iklan.html"], .btn-pasang-iklan');
        if (!target) return;

        e.preventDefault(); // Hentikan navigasi bawaan dahulu

        const userData = await getCurrentUser();
        
        // Jika belum login, arahkan ke login
        if (!userData) {
            window.location.href = '/login.html';
            return;
        }

        const memberType = userData.profile?.membership_type || 'FREE';

        if (memberType === 'FREE') {
            showUpgradePopup();
        } else {
            // Jika Premium (STARTER, PRO, dll), izinkan masuk ke halaman iklan
            window.location.href = target.getAttribute('href') || '../pages/pasang-iklan.html';
        }
    });
}

/**
 * LAYER 2: Proteksi Halaman pasang-iklan.html (Lock Form & Overlay)
 */
export async function applyLayer2Protection() {
    // Pastikan fungsi ini hanya berjalan di halaman pasang-iklan.html
    if (!window.location.pathname.includes('pasang-iklan.html')) return;

    const userData = await getCurrentUser();
    const memberType = userData?.profile?.membership_type || 'FREE';

    // Jika user mengakses URL langsung dan statusnya masih FREE
    if (memberType === 'FREE') {
        lockListingForm();
        renderPremiumCardAndPackages();
    } else {
        // Jika dia member premium, render Dashboard Mini Membership di bagian atas form
        renderMiniDashboard(userData.profile);
    }
}

/**
 * FUNGSI PEMBANTU LAYER 1: Tampilkan Popup Rekomendasi Upgrade (Modal)
 */
function showUpgradePopup() {
    alert("👑 Upgrade ke TERAVIA Premium\n\nSaat ini akun Anda masih menggunakan paket FREE. Upgrade Membership untuk mulai memasang listing properti.");
    // Catatan: Di tahap berikutnya, fungsi ini akan memicu modal HTML premium secara mulus.
}

/**
 * FUNGSI PEMBANTU LAYER 2: Kunci Semua Elemen Form Iklan
 */
function lockListingForm() {
    const form = document.querySelector('form') || document.getElementById('form-pasang-iklan');
    if (!form) return;

    // Disabled & Readonly semua input didalam form
    const elements = form.querySelectorAll('input, select, textarea, button');
    elements.forEach(el => {
        el.disabled = true;
        el.setAttribute('readonly', 'true');
    });

    // Buat Container Form memiliki posisi relatif untuk menampung Overlay
    form.style.position = 'relative';

    // Inject Overlay Transparan & Card Premium di tengah form
    const overlay = document.createElement('div');
    overlay.id = 'premium-overlay';
    overlay.className = 'premium-overlay-style'; // Di-styling via component.css nanti
    overlay.innerHTML = `
        <div class="premium-card">
            <h2>👑 Upgrade ke TERAVIA Premium</h2>
            <p>Saat ini akun Anda masih menggunakan paket FREE. Upgrade Membership untuk mulai memasang listing properti.</p>
            <div class="premium-benefits">
                <ul>
                    <li>✔ Pasang Listing Properti</li>
                    <li>✔ Upload Foto & Video</li>
                    <li>✔ Fitur Virtual Tour</li>
                    <li>✔ Prioritas Search Listing</li>
                    <li>✔ Badge Premium Resmi</li>
                </ul>
            </div>
            <button id="btn-upgrade-now" class="btn-premium-trigger">Upgrade Membership</button>
        </div>
        
        <div class="preview-paket-container">
            <h3>Pilih Paket Terbaik Anda</h3>
            <div class="paket-grid" id="paket-comparison-grid"></div>
            <button id="btn-compare-all" class="btn-secondary">Lihat Perbandingan Paket</button>
        </div>
    `;

    form.appendChild(overlay);
}

/**
 * FUNGSI PEMBANTU LAYER 2: Render List Card Paket Membership
 */
function renderPremiumCardAndPackages() {
    const gridContainer = document.getElementById('paket-comparison-grid');
    if (!gridContainer) return;

    let htmlContent = '';
    // Loop kamus data untuk menampilkan opsi paket STARTER keatas
    Object.keys(MEMBERSHIP_PACKETS).forEach(key => {
        if (key === 'FREE') return; // Lewati paket FREE
        const pkt = MEMBERSHIP_PACKETS[key];
        htmlContent += `
            <div class="card-paket-item">
                <h4>${pkt.badge}</h4>
                <p class="paket-price">${pkt.price}</p>
                <p>Max Listing: <strong>${pkt.maxListing}</strong></p>
                <p>Sundul: <strong>${pkt.boost}</strong></p>
                <button class="btn-pilih-paket" data-paket="${key}">Pilih Paket</button>
            </div>
        `;
    });
    gridContainer.innerHTML = htmlContent;
}

/**
 * RENDERING WIDGET DASHBOARD USER (Untuk Member STARTER / PRO / BUSINESS / ENTERPRISE)
 */
function renderMiniDashboard(profile) {
    const dashboardContainer = document.getElementById('membership-dashboard-widget');
    if (!dashboardContainer) return;

    const { membership_type, listing_limit, listing_used, boost_limit, boost_used } = profile;
    const progressPercent = listing_limit > 0 ? (listing_used / listing_limit) * 100 : 0;
    
    // Generate representasi bar kotak hitam-putih sesuai instruksi konsep (████░░░░░░)
    const totalBlocks = 10;
    const filledBlocks = Math.min(Math.round(progressPercent / 10), totalBlocks);
    const progressBarString = '█'.repeat(filledBlocks) + '░'.repeat(totalBlocks - filledBlocks);

    dashboardContainer.innerHTML = `
        <div class="widget-membership-box">
            <h3>Membership Saat Ini: <strong>${MEMBERSHIP_PACKETS[membership_type]?.badge || membership_type}</strong></h3>
            <div class="widget-stats-grid">
                <div>
                    <p>Listing Terpakai: <strong>${listing_used} / ${listing_limit}</strong></p>
                    <p class="progress-bar-text">${progressBarString} ${Math.round(progressPercent)}%</p>
                </div>
                <div>
                    <p>Sisa Kuota Listing: <strong>${listing_limit - listing_used}</strong></p>
                    <p>Sundul Bulan Ini: <strong>${boost_used} / ${boost_limit === 999999 ? '∞' : boost_limit}</strong></p>
                </div>
            </div>
        </div>
    `;
      }

