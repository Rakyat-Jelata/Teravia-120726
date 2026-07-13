// teravia/assets/js/iklan-handler.js
import { applyLayer2Protection } from './membership.js';
import fallbackProxy, { categoriesMap } from './spec-templates.js';

let webpImagesStorage = []; 

applyLayer2Protection().then((isCleared) => {
    if (!isCleared) return;
    initFormEngine();
});

function initFormEngine() {
    tampilkanPetaAwal();
    const rStatus = document.getElementById('status-listing');
    const rKategori = document.getElementById('kategori-properti');
    const rJenis = document.getElementById('jenis-properti');
    const specContainer = document.getElementById('dynamic-spec-container');
    const rentContainer = document.getElementById('rent-spec-container');

    // 1. Logika Dinamis Status Sewa (Dropdown Masa Sewa & Checkbox Include Biaya)
    rStatus.addEventListener('change', () => {
        const status = rStatus.value;
        if (status === 'Disewakan' || status === 'Dijual & Disewakan') {
            rentContainer.innerHTML = `
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px dashed #cbd5e1; margin-top: 15px;">
                    <div class="grid-main">
                        <div class="form-group col-12">
                            <label for="rent-period">Masa Sewa Minimal</label>
                            <select id="rent-period" class="form-control" required>
                                <option value="Per Bulan">Per Bulan</option>
                                <option value="Per Tahun">Per Tahun</option>
                                <option value="Fleksibel (Bulan/Tahun)">Fleksibel (Bisa Bulanan / Tahunan)</option>
                                <option value="Harian / Mingguan">Harian / Mingguan (Khusus Villa/Hotel)</option>
                            </select>
                        </div>
                        <div class="form-group col-12" style="margin-bottom: 0;">
                            <label>Biaya Sewa Sudah Termasuk (Include):</label>
                            <div class="checkbox-grid">
                                <label class="checkbox-item"><input type="checkbox" name="rent-include" value="Listrik">⚡ Listrik</label>
                                <label class="checkbox-item"><input type="checkbox" name="rent-include" value="Air">💧 Air (PDAM/Sumur)</label>
                                <label class="checkbox-item"><input type="checkbox" name="rent-include" value="Gas">🔥 Gas Alam/Tabung</label>
                                <label class="checkbox-item"><input type="checkbox" name="rent-include" value="Kebersihan">🧹 Kebersihan / Sampah</label>
                                <label class="checkbox-item"><input type="checkbox" name="rent-include" value="Keamanan">🛡️ Keamanan / IPL</label>
                                <label class="checkbox-item"><input type="checkbox" name="rent-include" value="Wifi">🌐 Internet / Wifi</label>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            rentContainer.style.opacity = '1';
        } else {
            rentContainer.innerHTML = '';
        }
    });

    // 2. Logika Dropdown Kategori -> Jenis Properti
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

    // 3. Logika Perubahan Jenis Properti
    rJenis.addEventListener('change', () => {
        const selectedType = rJenis.value;
        const htmlTemplate = fallbackProxy[selectedType];
        animateSpecTransition(specContainer, htmlTemplate);

        const autoTitleTypes = ['RUMAH', 'APARTEMEN', 'TOWNHOUSE / CLUSTER', 'PENTHOUSE'];
        if (autoTitleTypes.includes(selectedType)) {
            toggleJudulFieldVisibility(true);
        } else {
            toggleJudulFieldVisibility(false);
        }
    });

    initApiWilayah();
    initImageCompressorEngine();
    initFormSubmission();
    iniAiGenerator();
}

function animateSpecTransition(container, newHtml) {
    container.classList.add('spec-hidden');
    setTimeout(() => {
        container.innerHTML = newHtml;
        container.classList.remove('spec-hidden');
    }, 200);
}

function toggleJudulFieldVisibility(isAuto) {
    const judulInput = document.getElementById('judul');
    if (!judulInput) return;

    // 🚀 PAKSA LEBAR DAN TAMPILAN AGAR TETAP LEBAR DI DESKTOP MAUPUN MOBILE
    judulInput.removeAttribute('style'); // Bersihkan sisa inline style yang rusak
    judulInput.style.setProperty('width', '100%', 'important');
    judulInput.style.setProperty('display', 'block', 'important');

    if (isAuto) {
        // Tetap biarkan user mengetik manual (sesuai permintaan sebelumnya)
        judulInput.placeholder = "✨ Ketik judul di sini, atau biarkan sistem membuatkannya otomatis saat dikirim...";
        judulInput.readOnly = false; 
        judulInput.style.backgroundColor = "#f8fafc"; 
    } else {
        judulInput.placeholder = "Contoh: Rumah Minimalis 2 Lantai Cluster Hoek Dekat Stasiun";
        judulInput.readOnly = false;
        judulInput.style.backgroundColor = "#fff";
        judulInput.value = "";
    }
}

/**
 * Engine Integrasi API Wilayah Indonesia
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

                // ==========================================
    // PAKET EVENT LISTENER WILAYAH & PETA (AKURAT)
    // ==========================================
    provSel.addEventListener('change', () => {
        handleDropdownCascade(provSel.value, kabSel, 'regencies', '-- Pilih Kabupaten/Kota --');
    });

    kabSel.addEventListener('change', () => {
        handleDropdownCascade(kabSel.value, kecSel, 'districts', '-- Pilih Kecamatan --');
    });

    // Pemicu 1: Saat Kecamatan Dipilih (Peta bergeser ke area Kecamatan)
    kecSel.addEventListener('change', async () => {
        handleDropdownCascade(kecSel.value, kelSel, 'villages', '-- Pilih Kelurahan/Desa --');
        
        const namaProvinsi = provSel.options[provSel.selectedIndex].text;
        const namaKabupaten = kabSel.options[kabSel.selectedIndex].text;
        const namaKecamatan = kecSel.options[kecSel.selectedIndex].text;
        
        const queryAlamat = `${namaKecamatan}, ${namaKabupaten}, ${namaProvinsi}, Indonesia`;
        
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryAlamat)}`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                map.setView([lat, lon], 13); // Zoom tingkat kecamatan
                marker.setLatLng([lat, lon]);
                document.getElementById('latitude').value = lat.toFixed(6);
                document.getElementById('longitude').value = lon.toFixed(6);
            }
        } catch (error) {
            console.error("Gagal memindahkan peta ke kecamatan:", error);
        }
    });

    // Pemicu 2: Saat Kelurahan Dipilih (Peta otomatis zoom-in lebih dekat ke Kelurahan/Desa)
    kelSel.addEventListener('change', async () => {
        // Validasi: pastikan bukan teks panduan kosong yang dipilih
        if (!kelSel.value) return;

        const namaProvinsi = provSel.options[provSel.selectedIndex].text;
        const namaKabupaten = kabSel.options[kabSel.selectedIndex].text;
        const namaKecamatan = kecSel.options[kecSel.selectedIndex].text;
        const namaKelurahan = kelSel.options[kelSel.selectedIndex].text; // Sekarang data kelurahan sudah tersedia!
        
        // Gabungkan seluruh wilayah dari terkecil hingga terbesar agar pencarian sangat akurat
        const queryAlamatLengkap = `${namaKelurahan}, ${namaKecamatan}, ${namaKabupaten}, ${namaProvinsi}, Indonesia`;
        
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryAlamatLengkap)}`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                
                // Pindahkan kamera peta dengan level zoom 15 (sangat dekat, setingkat kelurahan/desa) 🗺️
                map.setView([lat, lon], 15);
                marker.setLatLng([lat, lon]);
                
                document.getElementById('latitude').value = lat.toFixed(6);
                document.getElementById('longitude').value = lon.toFixed(6);
            }
        } catch (error) {
            console.error("Gagal memindahkan peta ke kelurahan:", error);
        }
    });
}

    // === AKHIR POTONGAN KODE REVISI ===

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

        const statusListing = document.getElementById('status-listing').value;
        const jenisProperti = document.getElementById('jenis-properti').value;
        const kecDropdown = document.getElementById('reg-kecamatan');
        const namaKecamatan = kecDropdown.options[kecDropdown.selectedIndex]?.getAttribute('data-name') || '';
        
        const namaProyekInput = document.getElementById('spec-nama-proyek');
        let judulFinal = document.getElementById('judul').value;

        // Auto Title Generator
        const autoTitleTypes = ['RUMAH', 'APARTEMEN', 'TOWNHOUSE / CLUSTER', 'PENTHOUSE'];
        if (autoTitleTypes.includes(jenisProperti) && namaProyekInput) {
            const namaProyek = namaProyekInput.value.trim();
            const formattedJenis = jenisProperti === 'TOWNHOUSE / CLUSTER' ? 'Cluster' : jenisProperti;
            judulFinal = `${statusListing} ${formattedJenis} ${namaProyek}, ${namaKecamatan}`;
            document.getElementById('judul').value = judulFinal; 
        }

        // Kumpulkan data include sewa jika status sewa
        let dataSewa = {};
        if (statusListing === 'Disewakan' || statusListing === 'Dijual & Disewakan') {
            const checkboxes = document.querySelectorAll('input[name="rent-include"]:checked');
            let includes = Array.from(checkboxes).map(cb => cb.value);
            dataSewa = {
                periode: document.getElementById('rent-period').value,
                includeBiaya: includes
            };
        }

        console.log("=== DATA READY TO DB ===");
        console.log("Generated Title Target:", judulFinal);
        console.log("Data Sewa Ekstra:", dataSewa);

        alert(`🎉 Berhasil Diterbitkan!\n\nListing Anda resmi terdaftar dengan judul otomatis:\n"${judulFinal}"`);
        window.location.href = '../index.html';
    });
}

// Letakkan di bagian paling atas file iklan-handler.js
let map;
let marker;

// Fungsi untuk memuat peta pertama kali (VERSI LENGKAP DENGAN GEOLOCATION)
function tampilkanPetaAwal() {
    const posisiPusat = [-0.7893, 113.9213]; 
    
    map = L.map('map').setView(posisiPusat, 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker(posisiPusat, { draggable: true }).addTo(map);

    updateKoordinatInput(posisiPusat[0], posisiPusat[1]);

    // 1. Deteksi saat pin digeser manual
    marker.on('dragend', async function (e) {
        const posisiBaru = marker.getLatLng();
        updateKoordinatInput(posisiBaru.lat, posisiBaru.lng);
        await ambilAlamatFisik(posisiBaru.lat, posisiBaru.lng);
    });

    // 2. Logika Tombol "Gunakan Lokasi Saya" 🎯
    const btnGeo = document.getElementById('btn-geolocation');
    if (btnGeo) {
        btnGeo.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert("❌ Browser Anda tidak mendukung fitur deteksi lokasi (Geolocation).");
                return;
            }

            btnGeo.innerText = "🔄 Mencari lokasi...";
            btnGeo.disabled = true;
            btnGeo.style.background = "#94a3b8";

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Pindahkan peta & pin ke lokasi GPS pengguna saat ini (Zoom level 17 sangat dekat)
                    map.setView([lat, lon], 17);
                    marker.setLatLng([lat, lon]);
                    
                    // Update input koordinat
                    updateKoordinatInput(lat, lon);

                    // Isi otomatis kolom alamat detail
                    await ambilAlamatFisik(lat, lon);

                    // Kembalikan status tombol
                    btnGeo.innerText = "🎯 Gunakan Lokasi Saya";
                    btnGeo.disabled = false;
                    btnGeo.style.background = "#2563eb";
                },
                (error) => {
                    console.error("Gagal mendapatkan GPS:", error);
                    alert("⚠️ Gagal mengakses lokasi Anda. Pastikan Anda telah memberikan izin akses GPS di browser.");
                    btnGeo.innerText = "🎯 Gunakan Lokasi Saya";
                    btnGeo.disabled = false;
                    btnGeo.style.background = "#2563eb";
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    }
}

// Fungsi pembantu terpisah untuk mengambil teks alamat agar kode lebih rapi 📝
async function ambilAlamatFisik(lat, lng) {
    const alamatInput = document.getElementById('alamat-detail');
    if (!alamatInput) return;

    alamatInput.placeholder = "🔄 Sedang mengambil alamat titik lokasi...";
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        if (data && data.display_name) {
            alamatInput.value = data.display_name;
        }
    } catch (error) {
        console.error("Gagal mengambil teks alamat fisik:", error);
        alamatInput.placeholder = "Gagal memuat alamat otomatis, silakan ketik manual.";
    }
}
// ==========================================
// 💰 SEMATKAN ENGINE FORMAT RUPIAH DI SINI
// ==========================================
const inputHarga = document.getElementById('harga');
const labelTerbilang = document.getElementById('harga-terbilang');

if (inputHarga && labelTerbilang) {
    inputHarga.addEventListener('input', (e) => {
        let nilaiMentah = e.target.value.replace(/[^,\d]/g, '').toString();
        if (!nilaiMentah) {
            e.target.value = '';
            labelTerbilang.innerText = 'Ketik nominal untuk melihat format teks...';
            return;
        }
        let nilaiFormat = formatRibuan(nilaiMentah);
        e.target.value = nilaiFormat;

        let angkaAngka = parseInt(nilaiMentah, 10);
        labelTerbilang.innerText = `✨ Terbaca: ${singkatTeksHarga(angkaAngka)} Rupiah`;
    });
}

function formatRibuan(angka) {
    let number_string = angka.replace(/[^,\d]/g, '').toString(),
        split   = number_string.split(','),
        sisa     = split[0].length % 3,
        rupiah   = split[0].substr(0, sisa),
        ribuan   = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    return split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
}

function singkatTeksHarga(nominal) {
    if (nominal >= 1000000000000) return `${(nominal / 1000000000000).toFixed(2).replace('.00', '')} Triliun`;
    if (nominal >= 1000000000) return `${(nominal / 1000000000).toFixed(2).replace('.00', '')} Miliar`;
    if (nominal >= 1000000) return `${(nominal / 1000000).toFixed(2).replace('.00', '')} Juta`;
    if (nominal >= 1000) return `${(nominal / 1000).toFixed(2).replace('.00', '')} Ribu`;
    return nominal.toString();
}

// Tambahkan baris pemanggilan ini di dalam function initFormEngine() paling bawah:
// initFormSubmission();
// initAiGenerator(); // <-- Sematkan di bawah initFormSubmission

function initAiGenerator() {
    const btnAI = document.getElementById('btn-ai-deskripsi');
    const inputDeskripsi = document.getElementById('deskripsi');

    if (btnAI && inputDeskripsi) {
        btnAI.addEventListener('click', function() {
            // 1. Ambil nilai judul dan harga untuk validasi awal
            const judulIklan = document.getElementById('judul').value.trim();
            const hargaMentah = document.getElementById('harga').value.trim();

            // Validasi: Jika judul atau harga kosong, hentikan proses
            if (!judulIklan || !hargaMentah || hargaMentah === '0') {
                alert('Silakan isi "Judul Iklan" dan "Harga" terlebih dahulu sebelum menggunakan fitur AI! ⚠️');
                return; 
            }

            // 2. Ambil data dasar lainnya dari form
            const jenisProperti = document.getElementById('jenis-properti').value || 'Properti';
            const statusListing = document.getElementById('status-listing').value;
            
            // 3. LOGIKA RADIO BUTTON: Mengambil tipe pengiklan (persona) yang aktif
            const tipePengiklan = document.querySelector('input[name="persona"]:checked')?.value;
            
            // 4. Ambil data lokasi (Kecamatan & Kabupaten)
            const kecamatanSelect = document.getElementById('reg-kecamatan');
            const kabupatenSelect = document.getElementById('reg-kabupaten');
            
            const namaKecamatan = kecamatanSelect.options[kecamatanSelect.selectedIndex]?.text || '';
            const namaKabupaten = kabupatenSelect.options[kabupatenSelect.selectedIndex]?.text || '';
            
            let lokasiText = 'lokasi strategis';
            if (namaKecamatan && !kecamatanSelect.disabled && !namaKecamatan.includes('--')) {
                lokasiText = `kawasan ${namaKecamatan}, ${namaKabupaten}`;
            }

            // 5. Logika Kondisional: Status Listing (Dijual / Disewakan)
            let kataAksi = 'memiliki'; 
            let kataHubung = 'Harga';

            if (statusListing === 'Disewakan') {
                kataAksi = 'menyewa';
                kataHubung = 'Harga Sewa';
            } else if (statusListing === 'Oper Alih') {
                kataAksi = 'mengambil alih';
                kataHubung = 'Nilai Oper Alih';
            }

            // 6. Logika Kondisional: Tipe Pengiklan (Berdasarkan value huruf kecil di HTML)
            let sebutanKontak = 'kami'; 
            if (tipePengiklan === 'owner') {
                sebutanKontak = 'pemilik langsung';
            } else if (tipePengiklan === 'broker' || tipePengiklan === 'developer') {
                sebutanKontak = 'tim agen kami';
            }

            // 7. Rangkai template teks deskripsi otomatis berbasis AI
            const teksDeskripsiAI = `Kesempatan emas untuk ${kataAksi} ${jenisProperti.toLowerCase()} berkualitas di ${lokasiText}.\n\nProperti bertajuk '${judulIklan}' ini menawarkan nilai investasi luar biasa dengan ${kataHubung} Rp ${hargaMentah}.\n\nUnit ini dirancang dengan tata ruang efisien yang sangat cocok untuk mendukung kenyamanan aktivitas Anda. Jangan lewatkan peluang berharga ini, segera hubungi ${sebutanKontak} untuk informasi lebih lanjut dan jadwalkan kunjungan lokasi!`;

            // 8. Tampilkan hasil ke dalam textarea deskripsi
            inputDeskripsi.value = teksDeskripsiAI;
        });
    }
}

// Fungsi bantu untuk memasukkan angka koordinat ke input hidden HTML
function updateKoordinatInput(lat, lng) {
    document.getElementById('latitude').value = lat.toFixed(6);
    document.getElementById('longitude').value = lng.toFixed(6);
}
