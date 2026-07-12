import { supabase } from './supabase-client.js'; // Sesuaikan path file client Anda
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
// Listener untuk memicu munculnya field
document.getElementById('jenis_properti').addEventListener('change', function() {
    const jenis = this.value;
    const container = document.getElementById('dynamic-fields-container');
    container.innerHTML = ''; 

    if (fieldMapping[jenis]) {
        // Tambahkan class grid-container untuk styling CSS
        container.classList.add('grid-container'); 
        
        fieldMapping[jenis].forEach(field => {
            // Tambahkan logika limit digit
            let attributes = `required placeholder="Masukkan ${field.label}"`;
            if (field.id === 'luas_tanah') attributes += ' maxlength="5"';
            if (field.id === 'luas_bangunan') attributes += ' maxlength="4"';

            container.innerHTML += `
                <div class="field-group">
                    <label for="${field.id}">${field.label}</label>
                    <input type="${field.type}" id="${field.id}" name="${field.id}" ${attributes}>
                </div>
            `;
        });
    }
});


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

// Fungsi Submit ke Supabase
document.getElementById('form-pasang-iklan').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Ambil data dari form
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Proses simpan ke Supabase (asumsi supabase sudah di-import di main.js)
    const { error } = await supabase
        .from('listings')
        .insert([{
            judul: data.judul,
            kategori: data.kategori,
            jenis_properti: data.jenis_properti,
            harga: data.harga,
            // JSONB untuk field dinamis
            spesifikasi: data
        }]);

    if (error) {
        alert('Gagal simpan: ' + error.message);
    } else {
        alert('Iklan berhasil dipublikasikan!');
        e.target.reset(); // Reset form setelah sukses
    }
});
