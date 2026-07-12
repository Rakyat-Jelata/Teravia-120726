function showUpgradeModal() {
    // Cari container modal di index.html atau buat dinamis
    const modal = document.getElementById('membership-modal');
    if (modal) {
        modal.style.display = 'flex'; // Menggunakan flex untuk center overlay
    } else {
        alert("Upgrade ke Premium untuk memasang iklan!");
        // Logika redirect atau show element bisa ditambahkan di sini
    }
}

