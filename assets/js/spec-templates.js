// teravia/assets/js/spec-templates.js

export const categoriesMap = {
    'Hunian': ['RUMAH', 'APARTEMEN', 'VILLA', 'TOWNHOUSE / CLUSTER', 'KONTRAKAN', 'KOST'],
    'Komersial': ['RUKO', 'KIOS', 'KANTOR / GEDUNG PERKANTORAN', 'GUDANG', 'PABRIK', 'HOTEL', 'RESORT', 'RESTORAN / CAFE', 'SPBU', 'REST AREA'],
    'Tanah': ['TANAH', 'KAVLING', 'TANAH KOMERSIAL', 'TANAH INDUSTRI', 'SAWAH', 'KEBUN', 'TAMBAK'],
    'Institusi': ['RUMAH SAKIT', 'KLINIK', 'SEKOLAH', 'KAMPUS', 'LAINNYA']
};

export const specTemplates = {
    'RUMAH': `
        <div class="grid-main">
            <div class="form-group col-3"><label>Luas Tanah</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-3"><label>Panjang</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m</span></div></div>
            <div class="form-group col-3"><label>Lebar</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m</span></div></div>
            <div class="form-group col-3"><label>Luas Bangunan</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-3"><label>Kamar Tidur</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">Kamar</span></div></div>
            <div class="form-group col-3"><label>Kamar Mandi</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">Kamar</span></div></div>
            <div class="form-group col-3"><label>Garasi</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">Mobil</span></div></div>
            <div class="form-group col-3"><label>Carport</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">Mobil</span></div></div>
            <div class="form-group col-3"><label>Jumlah Lantai</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">Lantai</span></div></div>
            <div class="form-group col-3"><label>Daya Listrik</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">VA</span></div></div>
            <div class="form-group col-3"><label>Sumber Air</label><input type="text" class="form-control" placeholder="PDAM / Sumur Bor" required></div>
            <div class="form-group col-3"><label>Menghadap</label><input type="text" class="form-control" placeholder="Utara/Selatan" required></div>
            <div class="form-group col-4"><label>Kondisi Bangunan</label><select class="form-control"><option>Baru</option><option>Bekas</option><option>Renovasi</option></select></div>
            <div class="form-group col-4"><label>Tahun Dibangun</label><input type="number" class="form-control" placeholder="Contoh: 2022" required></div>
            <div class="form-group col-4"><label>Sertifikat</label><input type="text" class="form-control" placeholder="SHM / HGB" required></div>
        </div>
    `,
    'APARTEMEN': `
        <div class="grid-main">
            <div class="form-group col-4"><label>Tipe Unit</label><input type="text" class="form-control" placeholder="Studio / 2BR / Penthouse" required></div>
            <div class="form-group col-4"><label>Luas Unit</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-2"><label>Bedroom</label><input type="number" class="form-control" required></div>
            <div class="form-group col-2"><label>Bathroom</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Lantai</label><input type="number" class="form-control" placeholder="Contoh: Lantai 12" required></div>
            <div class="form-group col-3"><label>Tower</label><input type="text" class="form-control" placeholder="Nama Tower" required></div>
            <div class="form-group col-3"><label>Furnished</label><select class="form-control"><option>Fully Furnished</option><option>Semi Furnished</option><option>Unfurnished</option></select></div>
            <div class="form-group col-3"><label>Balkon</label><select class="form-control"><option>Ada</option><option>Tidak Ada</option></select></div>
            <div class="form-group col-4"><label>IPL / Service Charge</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">/Bulan</span></div></div>
            <div class="form-group col-4"><label>Daya Listrik</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">VA</span></div></div>
            <div class="form-group col-4"><label>View</label><input type="text" class="form-control" placeholder="City View / Pool View" required></div>
            <div class="form-group col-12"><label>Fasilitas Terintegrasi</label><input type="text" class="form-control" placeholder="Security system, Parkir, Playground, Lapangan Tenis, Kolam Renang, dll."></div>
        </div>
    `,
    'VILLA': `
        <div class="grid-main">
            <div class="form-group col-3"><label>Luas Tanah</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-3"><label>Luas Bangunan</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-3"><label>Jumlah Kamar</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Kamar Mandi</label><input type="number" class="form-control" required></div>
            <div class="form-group col-4"><label>Kolam Renang</label><select class="form-control"><option>Privat</option><option>Sharing</option><option>Tidak Ada</option></select></div>
            <div class="form-group col-4"><label>Taman</label><select class="form-control"><option>Ada</option><option>Tidak Ada</option></select></div>
            <div class="form-group col-4"><label>View Utama</label><input type="text" class="form-control" placeholder="Mountain / Ocean View" required></div>
        </div>
    `,
    'TOWNHOUSE / CLUSTER': `
        <div class="grid-main">
            <div class="form-group col-3"><label>Luas Tanah</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-3"><label>Luas Bangunan</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-3"><label>Kamar Tidur</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Kamar Mandi</label><input type="number" class="form-control" required></div>
            <div class="form-group col-4"><label>Security 24 Jam</label><select class="form-control"><option>One Gate System</option><option>Regular Security</option></select></div>
            <div class="form-group col-4"><label>IPL</label><input type="number" class="form-control" placeholder="Biaya IPL"></div>
            <div class="form-group col-4"><label>Tahun Dibangun</label><input type="number" class="form-control"></div>
        </div>
    `,
    'KONTRAKAN': `
        <div class="grid-main">
            <div class="form-group col-4"><label>Jumlah Pintu</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">Pintu</span></div></div>
            <div class="form-group col-4"><label>Luas Tanah</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-4"><label>Luas Bangunan</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-4"><label>Pendapatan/Bulan</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">Rp</span></div></div>
            <div class="form-group col-4"><label>Tingkat Hunian</label><div class="input-unit-box"><input type="number" class="form-control" placeholder="90" required><span class="unit-tag">%</span></div></div>
        </div>
    `,
    'KOST': `
        <div class="grid-main">
            <div class="form-group col-3"><label>Total Kamar</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Kamar Terisi</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Kamar Kosong</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Pendapatan/Bulan</label><input type="number" class="form-control" required></div>
            <div class="form-group col-12"><label>Fasilitas Kost</label><input type="text" class="form-control" placeholder="AC, Kamar Mandi Dalam, Wifi, Kasur, dll."></div>
        </div>
    `,
    'RUKO': `
        <div class="grid-main">
            <div class="form-group col-3"><label>Luas Tanah</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Luas Bangunan</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Jumlah Lantai</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Lebar Muka</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m</span></div></div>
        </div>
    `,
    'KIOS': `<div class="grid-main"><div class="form-group col-4"><label>Luas Kios</label><input type="number" class="form-control" required></div><div class="form-group col-4"><label>Lantai Ke-</label><input type="number" class="form-control" required></div><div class="form-group col-4"><label>Listrik</label><input type="number" class="form-control" required></div></div>`,
    'KANTOR / GEDUNG PERKANTORAN': `<div class="grid-main"><div class="form-group col-3"><label>Luas Tanah</label><input type="number" class="form-control" required></div><div class="form-group col-3"><label>Luas Bangunan</label><input type="number" class="form-control" required></div><div class="form-group col-3"><label>Jumlah Lantai</label><input type="number" class="form-control" required></div><div class="form-group col-3"><label>Fasilitas Lift</label><input type="number" class="form-control" placeholder="Jumlah Lift"></div></div>`,
    'GUDANG': `<div class="grid-main"><div class="form-group col-4"><label>Luas Tanah</label><input type="number" class="form-control" required></div><div class="form-group col-4"><label>Luas Gudang</label><input type="number" class="form-control" required></div><div class="form-group col-4"><label>Akses Kontainer</label><select class="form-control"><option>Masuk Fuso/40ft</option><option>Tidak Masuk Kontainer</option></select></div></div>`,
    'PABRIK': `<div class="grid-main"><div class="form-group col-4"><label>Luas Kawasan</label><input type="number" class="form-control" required></div><div class="form-group col-4"><label>Daya Listrik</label><input type="number" class="form-control" required></div><div class="form-group col-4"><label>Izin Industri</label><input type="text" class="form-control" placeholder="IUI / IPPR" required></div></div>`,
    'TANAH': `<div class="grid-main"><div class="form-group col-3"><label>Luas Total</label><input type="number" class="form-control" required></div><div class="form-group col-3"><label>Lebar Depan</label><input type="number" class="form-control" required></div><div class="form-group col-3"><label>Zonasi</label><input type="text" class="form-control" placeholder="Kuning / Hijau / Merah" required></div><div class="form-group col-3"><label>Akses Jalan</label><input type="text" class="form-control" placeholder="Aspal / Cor" required></div></div>`,
    'LAINNYA': `
        <div class="grid-main">
            <div class="form-group col-12"><label>Sebutkan Jenis Properti</label><input type="text" class="form-control" placeholder="Masukkan jenis properti institusi/lainnya secara mendetail" required></div>
            <div class="form-group col-6"><label>Luas Tanah (m²)</label><input type="number" class="form-control"></div>
            <div class="form-group col-6"><label>Luas Bangunan (m²)</label><input type="number" class="form-control"></div>
            <div class="form-group col-12"><label>Keterangan Tambahan Spesifikasi</label><textarea class="form-control" rows="3" placeholder="Tulis rincian fasilitas penunjang lainnya disini..."></textarea></div>
        </div>
    `
};

// Pasang pengaman fallback jika jenis properti komersial/tanah spesifik belum didefinisikan template khusus, otomatis panggil default LAINNYA
const fallbackProxy = new Proxy(specTemplates, {
    get: (target, name) => name in target ? target[name] : target['LAINNYA']
});

export default fallbackProxy;
