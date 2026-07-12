import { supabase } from './supabase-client.js';

// Mapping data kategori ke jenis properti
const propertiMapping = {
    hunian: ['Rumah', 'Apartemen', 'Villa', 'Townhouse', 'Kontrakan', 'Kost'],
    komersial: ['Ruko', 'Kios', 'Kantor', 'Gedung Perkantoran', 'Gudang', 'Pabrik', 'Hotel', 'Resort', 'Restoran', 'Cafe', 'SPBU', 'Rest Area'],
    tanah: ['Tanah', 'Kavling', 'Tanah Komersial', 'Tanah Industri', 'Sawah', 'Kebun', 'Tambak'],
    institusi: ['Rumah Sakit', 'Klinik', 'Sekolah', 'Kampus']
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
};

window.renderDynamicFields = function() {
    const kategori = document.getElementById('kategori').value;
    const jenisSelect = document.getElementById('jenis_properti');
    
    jenisSelect.innerHTML = '<option value="">Pilih Jenis Properti</option>';
    
    if (propertiMapping[kategori]) {
        propertiMapping[kategori].forEach(item => {
            const option = document.createElement('option');
            option.value = item.toLowerCase().replace(/\s+/g, '_');
            option.textContent = item;
            jenisSelect.appendChild(option);
        });
    }
};

// Listener tunggal untuk memicu munculnya field
document.getElementById('jenis_properti').addEventListener('change', function() {
    const jenis = this.value;
    const container = document.getElementById('dynamic-fields-container');
    
    container.innerHTML = ''; 
    container.className = 'grid-container'; // Set class untuk CSS Grid

    if (fieldMapping[jenis]) {
        fieldMapping[jenis].forEach(field => {
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

// Fungsi Submit ke Supabase
document.getElementById('form-pasang-iklan').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const { error } = await supabase
        .from('listings')
        .insert([{
            judul: data.judul,
            kategori: data.kategori,
            jenis_properti: data.jenis_properti,
            harga: data.harga,
            spesifikasi: data
        }]);

    if (error) {
        alert('Gagal simpan: ' + error.message);
    } else {
        alert('Iklan berhasil dipublikasikan!');
        e.target.reset();
        document.getElementById('dynamic-fields-container').innerHTML = '';
    }
});
