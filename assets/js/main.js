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
// Definisi field untuk setiap jenis properti
const fieldMapping = {
    rumah: [
        { label: 'Luas Tanah (m²)', id: 'luas_tanah', type: 'number' },
        { label: 'Luas Bangunan (m²)', id: 'luas_bangunan', type: 'number' },
        { label: 'Kamar Tidur', id: 'kamar_tidur', type: 'number' },
        { label: 'Kamar Mandi', id: 'kamar_mandi', type: 'number' }
    ],
    spbu: [
        { label: 'Jumlah Dispenser', id: 'jml_dispenser', type: 'number' },
        { label: 'Jumlah Tangki', id: 'jml_tangki', type: 'number' },
        { label: 'Merek SPBU', id: 'merek_spbu', type: 'text' }
    ]
    // Anda bisa menambah mapping lainnya di sini
};

// Listener untuk memicu munculnya field
document.getElementById('jenis_properti').addEventListener('change', function() {
    const jenis = this.value;
    const container = document.getElementById('dynamic-fields-container');
    container.innerHTML = ''; // Reset container

    if (fieldMapping[jenis]) {
        fieldMapping[jenis].forEach(field => {
            container.innerHTML += `
                <div class="field-group">
                    <label for="${field.id}">${field.label}</label>
                    <input type="${field.type}" id="${field.id}" name="${field.id}" required placeholder="Masukkan ${field.label}">
                </div>
            `;
        });
    }
});
