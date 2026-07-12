// teravia/assets/js/iklan-handler.js
import { applyLayer2Protection } from './membership.js';

// Kumpulan skema data spesifikasi dinamis yang diminta dalam brief
import { specTemplates, categoriesMap } from './spec-templates.js';

let webpImagesStorage = []; // Array memori penampung file biner terkompresi .webp

// Jalankan Proteksi URL Terlebih Dahulu
applyLayer2Protection().then((isCleared) => {
    if (!isCleared) return;
    initFormEngine();
});

function initFormEngine() {
    const rKategori = document.getElementById('kategori-properti');
    const rJenis = document.getElementById('jenis-properti');
    const specContainer = document.getElementById('dynamic-spec-container');

    // 1. Logika Pemetaan Dropdown Kategori -> Jenis Properti
    rKategori.addEventListener('change', () => {
        rJenis.innerHTML = '<option value="" disabled selected>-- Pilih Jenis --</option>';
        const selectedCat = rKategori.value;
        if (categoriesMap[selectedCat]) {
            categoriesMap[selectedCat].forEach(item => {
                rJenis.insertAdjacentHTML('beforeend', `<option value="${item}">${item}</option>`);
            });
        }
        animateSpecTransition(specContainer, '<p style="color: #94a3b8; font-style: italic;">Silakan pilih jenis properti untuk memuat formulir spesifikasi khusus...</p>');
    });

    // 2. Logika Perubahan Spesifikasi Properti dengan Efek Animasi Transisi
    rJenis.addEventListener('change', () => {
        const selectedType = rJenis.value;
        const htmlTemplate = specTemplates[selectedType] || specTemplates['LAINNYA'];
        animateSpecTransition(specContainer, htmlTemplate);
    });

    // Inisialisasi API Wilayah & Sistem Upload Gambar
    initApiWilayah();
    initImageCompressorEngine();
    initFormSubmission();
}

/**
 * Efek transisi halus perubahan spesifikasi properti
 */
function animateSpecTransition(container, newHtml) {
    container.classList.add('spec-hidden');
    setTimeout(() => {
        container.innerHTML = newHtml;
        container.classList.remove('spec-hidden');
    }, 200);
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
        provinces.forEach(p => provSel.insertAdjacentHTML('beforeend', `<option value="${p.id}">${p.name}</option>`));
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
        data.forEach(item => targetDropdown.insertAdjacentHTML('beforeend', `<option value="${item.id}">${item.name}</option>`));
    } catch {
        targetDropdown.innerHTML = '<option value="" disabled>Gagal memuat</option>';
    }
}

/**
 * Logika Upload Gambar & Konverter Otomatis ke Format .WebP (Klien-Side)
 */
function initImageCompressorEngine() {
    const dropzone = document.getElementById('dropzone');
    const picker = document.getElementById('image-picker');
    const previewContainer = document.getElementById('preview-container');

    dropzone.addEventListener('click', () => picker.click());
    picker.addEventListener('change', () => processSelectedFiles(picker.files));

    // Support Drag and Drop
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = '#3b82f6'; });
    dropzone.addEventListener('dragleave', () => dropzone.style.borderColor = '#cbd5e1');
    dropzone.addEventListener('drop', (e) => { e.preventDefault(); dropzone.style.borderColor = '#cbd5e1'; processSelectedFiles(e.dataTransfer.files); });

    function processSelectedFiles(files) {
        for (let file of files) {
            if (!file.type.startsWith('image/')) continue;
            
            // Validasi batas maksimal 20 gambar
            if (webpImagesStorage.length >= 20) {
                alert("gambar yg anda upload sudah maksimal");
                break;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    // Konversi Canvas ke WebP
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width > 1200 ? 1200 : img.width; // Resize lebar maks 1200px agar hemat memori
                    canvas.height = (img.height / img.width) * canvas.width;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    canvas.toBlob((blob) => {
                        const webpFile = new File([blob], `${Date.now()}.webp`, { type: 'image/webp' });
                        webpImagesStorage.push(webpFile);
                        renderPreviews();
                    }, 'image/webp', 0.8); // Kompresi kualitas 80%
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
            const itemHtml = `
                <div class="preview-item">
                    <img src="${url}" alt="Preview">
                    <button type="button" class="remove-btn" data-index="${index}">×</button>
                </div>
            `;
            previewContainer.insertAdjacentHTML('beforeend', itemHtml);
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
 * Akhir Pemrosesan Pengiriman Formulir
 */
function initFormSubmission() {
    document.getElementById('iklan-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // Validasi minimal 5 gambar
        if (webpImagesStorage.length < 5) {
            alert("⚠️ Gagal Publikasi: Harap unggah minimal 5 foto properti sebagai kelayakan listing premium!");
            return;
        }

        alert("🎉 Luar Biasa! Listing properti Anda telah berhasil terkompresi ke WebP dan resmi diterbitkan di portal TERAVIA!");
        window.location.href = '../index.html';
    });
                                 }
            
