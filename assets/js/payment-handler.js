// teravia/assets/js/payment-handler.js

document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    const payButton = document.getElementById('pay-button');
    const loadingStatus = document.getElementById('loading-status');

    if (!paymentForm) return;

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Kunci tombol agar tidak di-klik dua kali
        payButton.disabled = true;
        loadingStatus.style.display = 'block';

        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        try {
            // JANGKA PANJANG: Jika Payment Gateway (Midtrans/Xendit) sudah siap, 
            // Anda tinggal mengganti fungsi di bawah ini dengan fungsi pemicu API asli Anda.
            await jalankanSimulasiPembayaran(selectedMethod);
            
        } catch (error) {
            alert("Terjadi kesalahan sistem pembayaran: " + error.message);
            payButton.disabled = false;
            loadingStatus.style.display = 'none';
        }
    });
});

/**
 * FUNGSI SIMULASI (MOCK API)
 * Dibuat seolah-olah menunggu respon server selama 2 detik agar transisinya realistis
 */
function jalankanSimulasiPembayaran(metode) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 1. Ubah status user di LocalStorage menjadi Premium secara instan
            localStorage.setItem('isPremiumUser', 'true');

            // 2. Tampilkan notifikasi sukses simulasi
            alert(`🎉 Pembayaran Sukses via ${metode.toUpperCase()}!\nAkun TERAVIA STARTER Anda kini telah aktif.`);

            // 3. Alihkan user langsung ke halaman pasang iklan karena proteksi sudah terbuka
            window.location.href = 'pasang-iklan.html';
            
            resolve(true);
        }, 2000); // Delay simulasi jaringan selama 2 detik
    });
}
