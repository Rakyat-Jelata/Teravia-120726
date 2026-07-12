// teravia/assets/js/iklan-handler.js
import { applyLayer2Protection } from './membership.js';
import fallbackProxy, { categoriesMap } from './spec-templates.js';

let webpImagesStorage = []; 

applyLayer2Protection().then((isCleared) => {
    if (!isCleared) return;
    initFormEngine();
});

function initFormEngine() {
    const rKategori = document.getElementById('kategori-properti');
    const rJenis = document.getElementById('jenis-properti');
    const specContainer = document.getElementById('dynamic-spec-container');
    const judulInput = document.getElementById('judul');

    // 1. Logika Dropdown Kategori -> Jenis Properti
    rKategori.addEventListener('change', () => {
        rJenis.innerHTML = '<option value="" disabled selected>-- Pilih Jenis --</option>';
        const selectedCat = rKategori.value;
        if (categoriesMap[selectedCat]) {
            categoriesMap[selectedCat].forEach(item => {
                rJenis.insertAdjacentHTML('beforeend', `<option value="${item}">${item}</option>`);
            });
        }
        animateSpecTransition(specContainer, '<p style="color: #94a3b8; font-style: italic;">Silakan pilih jenis properti untuk memuat formulir spesifikasi khusus...</p>');
        toggleJudulFieldVisibility(false);
    });

    // 2. Logika Perubahan Jenis Properti
    rJenis.addEventListener('change', () => {
        const selectedType = rJenis.value;
        const htmlTemplate = fallbackProxy[selectedType];
        animateSpecTransition(specContainer, htmlTemplate);

        // Jika tipe properti masuk ke dalam 4 tipe khusus, sembunyikan input Judul manual karena akan di-generate otomatis
        const autoTitleTypes = ['RUMAH', 'APARTEMEN', 'TOWNHOUSE / CLUSTER', 'PENTHOUSE'];
        if (autoTitleTypes.includes(selectedType)) {
            toggleJudulFieldVisibility(true); // Sembunyikan atau kunci inputan judul manual
        } else {
            toggleJudulFieldVisibility(false); // Biarkan ketik manual untuk jenis lain (Tanah, Sawah, Gudang, dll)
        }
    });

    initApiWilayah();
    initImageCompressorEngine();
    initFormSubmission();
}

function animateSpecTransition(container, newHtml) {
    container.classList.add('spec-hidden');
    setTimeout(() => {
        container.innerHTML = newHtml;
        container.classList.remove('spec-hidden');
    }, 200);
}

// Mengatur visibilitas / status field Judul agar user tahu judul terisi otomatis
function toggleJudulFieldVisibility(isAuto) {
    const judulInput = document.getElementById('judul');
    if (isAuto) {
        judulInput.placeholder = "✨ Judul akan dibuat otomatis berdasarkan spesifikasi Anda...";
        judulInput.readOnly = true;
        judulInput.style.backgroundColor = "#f1f5f9";
    } else {
        judulInput.placeholder = "Contoh: Rumah Minimalis 2 Lantai Cluster Hoek Dekat Stasiun";
        judulInput.readOnly = false;
        judulInput.style.backgroundColor = "#fff";
        judulInput.value = "";
    }
}

/**
 * Engine Integrasi API Wilayah Indonesia Bertingkat
 */
async function initApiWilayah() {
    const provSel = document.getElementById('reg-provinsi');
    const kabSel = document.getElementById('reg-kabupaten');
    const kecSel = document.getElementById('reg-kecamatan');
    const kelSel = document.getElementById('reg-kelurahan');

    try {
        const res = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
        const provinces = await res.json();
        provSel.innerHTML = '<option value="" disabled selected>-- Pilih Provinsi --</option>';
        provinces.forEach(p => provSel.insertAdjacentHTML('beforeend', `<option value="${p.id}" data-name="${p.name}">${p.name}</option>`));
    } catch {
        provSel.innerHTML = '<option value="" disabled>Gagal memuat data wilayah</option>';
    }

    provSel.addEventListener('change', () => handleDropdownCascade(provSel.value, kabSel, 'regencies', '-- Pilih Kabupaten/Kota --'));
    kabSel.addEventListener('change', () => handleDropdownCascade(kabSel.value, kecSel, 'districts', '-- Pilih Kecamatan --'));
    kecSel.addEventListener('change', () => handleDropdownCascade(kecSel.value, kelSel, 'villages', '-- Pilih Kelurahan/Desa --'));
}

async function handleDropdownCascade(id, targetDropdown, endpointName, defaultText) {
    targetDropdown.disabled = false;
    targetDropdown.innerHTML = '<option value="" disabled selected>Memuat data...</option>';
    try {
        const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/${endpointName}/${id}.json`);
        const data = await res.json();
        targetDropdown.innerHTML = `<option value="" disabled selected>${defaultText}</option>`;
        data.forEach(item => targetDropdown.insertAdjacentHTML('beforeend', `<option value="${item.id}" data-name="${item.name}">${item.name}</option>`));
    } catch {
        targetDropdown.innerHTML = '<option value="" disabled>Gagal memuat</option>';
    }
}

/**
 * Logika Upload Gambar & Konverter Otomatis ke Format .WebP
 */
function initImageCompressorEngine() {
    const dropzone = document.getElementById('dropzone');
    const picker = document.getElementById('image-picker');
    const previewContainer = document.getElementById('preview-container');

    dropzone.addEventListener('click', () => picker.click());
    picker.addEventListener('change', () => processSelectedFiles(picker.files));

    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = '#3b82f6'; });
    dropzone.addEventListener('dragleave', () => dropzone.style.borderColor = '#cbd5e1');
    dropzone.addEventListener('drop', (e) => { e.preventDefault(); dropzone.style.borderColor = '#cbd5e1'; processSelectedFiles(e.dataTransfer.files); });

    function processSelectedFiles(files) {
        for (let file of files) {
            if (!file.type.startsWith('image/')) continue;
            if (webpImagesStorage.length >= 20) {
                alert("gambar yg anda upload sudah maksimal");
                break;
            }
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width > 1200 ? 1200 : img.width;
                    canvas.height = (img.height / img.width) * canvas.width;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        const webpFile = new File([blob], `${Date.now()}.webp`, { type: 'image/webp' });
                        webpImagesStorage.push(webpFile);
                        renderPreviews();
                    }, 'image/webp', 0.8);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    function renderPreviews() {
        previewContainer.innerHTML = '';
        webpImagesStorage.forEach((file, index) => {
            const url = URL.createObjectURL(file);
            previewContainer.insertAdjacentHTML('beforeend', `
                <div class="preview-item">
                    <img src="${url}" alt="Preview">
                    <button type="button" class="remove-btn" data-index="${index}">×</button>
                </div>
            `);
        });
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                webpImagesStorage.splice(idx, 1);
                renderPreviews();
            });
        });
    }
}

/**
 * Akhir Pemrosesan Pengiriman Formulir & Pembuatan Judul Otomatis
 */
function initFormSubmission() {
    const form = document.getElementById('iklan-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (webpImagesStorage.length < 5) {
            alert("⚠️ Gagal Publikasi: Harap unggah minimal 5 foto properti sebagai kelayakan listing premium!");
            return;
        }

        // AMBIL INPUT UNTUK FORMULASI RUMUS JUDUL OTOMATIS
        const statusListing = document.getElementById('status-listing').value;
        const jenisProperti = document.getElementById('jenis-properti').value;
        const kecDropdown = document.getElementById('reg-kecamatan');
        const namaKecamatan = kecDropdown.options[kecDropdown.selectedIndex]?.getAttribute('data-name') || '';
        
        const namaProyekInput = document.getElementById('spec-nama-proyek');
        let judulFinal = document.getElementById('judul').value;

        // Eksekusi Logika Gabungan jika jenisnya Apartemen, Rumah, Cluster, atau Penthouse
        const autoTitleTypes = ['RUMAH', 'APARTEMEN', 'TOWNHOUSE / CLUSTER', 'PENTHOUSE'];
        if (autoTitleTypes.includes(jenisProperti) && namaProyekInput) {
            const namaProyek = namaProyekInput.value.trim();
            
            // Format Kapitalisasi Standar Profesional (Contoh: "Tanah Abang" -> "TANAH ABANG")
            const formattedJenis = jenisProperti === 'TOWNHOUSE / CLUSTER' ? 'Cluster' : jenisProperti;
            
            // Rumus Emas: [Status Listing] [Jenis Properti] [Nama Gedung/Cluster], [Kecamatan]
            judulFinal = `${statusListing} ${formattedJenis} ${namaProyek}, ${namaKecamatan}`;
            document.getElementById('judul').value = judulFinal; 
        }

        // Simulasi Payload Data Siap Kirim Ke Database Backend Anda
        console.log("=== DATA READY TO DB ===");
        console.log("Generated Title Target:", judulFinal);
        console.log("Total Files Binaries (.webp):", webpImagesStorage.length);

        alert(`🎉 Berhasil Diterbitkan!\n\nListing Anda resmi terdaftar dengan judul otomatis:\n"${judulFinal}"`);
        window.location.href = '../index.html';
    });
}
