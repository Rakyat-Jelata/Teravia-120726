// Mapping data kategori ke jenis properti
// Menggunakan object agar lebih rapi dan mudah di-maintenance
const propertiMapping = {
    hunian: ['Rumah', 'Apartemen', 'Villa', 'Townhouse', 'Kontrakan', 'Kost'],
    komersial: ['Ruko', 'Kios', 'Kantor', 'Gedung Perkantoran', 'Gudang', 'Pabrik', 'Hotel', 'Resort', 'Restoran', 'Cafe', 'SPBU', 'Rest Area'],
    tanah: ['Tanah', 'Kavling', 'Tanah Komersial', 'Tanah Industri', 'Sawah', 'Kebun', 'Tambak'],
    institusi: ['Rumah Sakit', 'Klinik', 'Sekolah', 'Kampus']
};

window.renderDynamicFields = function() {
    const kategori = document.getElementById('kategori').value;
    const jenisSelect = document.getElementById('jenis_properti');
    
    // Reset dropdown jenis
    jenisSelect.innerHTML = '<option value="">Pilih Jenis Properti</option>';
    
    // Isi dropdown berdasarkan kategori
    if (propertiMapping[kategori]) {
        propertiMapping[kategori].forEach(item => {
            const option = document.createElement('option');
            // Membuat value yang aman untuk database (lowercase & underscore)
            option.value = item.toLowerCase().replace(/\s+/g, '_');
            option.textContent = item;
            jenisSelect.appendChild(option);
        });
    }
};
