// teravia/assets/js/spec-templates.js

export const categoriesMap = {
    'Hunian': ['RUMAH', 'APARTEMEN', 'VILLA', 'TOWNHOUSE / CLUSTER', 'PENTHOUSE', 'KONTRAKAN', 'KOST'],
    'Komersial': ['RUKO', 'KIOS', 'KANTOR / GEDUNG PERKANTORAN', 'GUDANG', 'PABRIK', 'HOTEL', 'RESORT', 'RESTORAN / CAFE', 'SPBU', 'REST AREA'],
    'Tanah': ['TANAH', 'KAVLING', 'TANAH KOMERSIAL', 'TANAH INDUSTRI', 'SAWAH', 'KEBUN', 'TAMBAK'],
    'Institusi': ['RUMAH SAKIT', 'KLINIK', 'SEKOLAH', 'KAMPUS', 'LAINNYA']
};

export const specTemplates = {
    'RUMAH': `
        <div class="grid-main">
            <div class="form-group col-12"><label>Nama Komplek / Cluster Pemukiman</label><input type="text" id="spec-nama-proyek" class="form-control" placeholder="Contoh: Cluster Heliconia, Grand Galaxy" required></div>
            <div class="form-group col-3"><label>Luas Tanah</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-3"><label>Panjang</label><div class="input-unit-box"><input type="number" class="form-control"><span class="unit-tag">m</span></div></div>
            <div class="form-group col-3"><label>Lebar</label><div class="input-unit-box"><input type="number" class="form-control"><span class="unit-tag">m</span></div></div>
            <div class="form-group col-3"><label>Luas Bangunan</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-3"><label>Kamar Tidur</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Kamar Mandi</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Garasi</label><input type="number" class="form-control"></div>
            <div class="form-group col-3"><label>Carport</label><input type="number" class="form-control"></div>
            <div class="form-group col-4"><label>Daya Listrik</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">VA</span></div></div>
            <div class="form-group col-4"><label>Kondisi Bangunan</label><select class="form-control"><option>Baru</option><option>Bekas</option><option>Renovasi</option></select></div>
            <div class="form-group col-4"><label>Sertifikat</label><input type="text" class="form-control" placeholder="SHM / HGB" required></div>
        </div>
    `,
    'APARTEMEN': `
        <div class="grid-main">
            <div class="form-group col-12"><label>Nama Gedung / Kondominium / Apartemen</label><input type="text" id="spec-nama-proyek" class="form-control" placeholder="Contoh: Anandamaya Residence / Mediteraan Palace" required></div>
            <div class="form-group col-4"><label>Tipe Unit</label><input type="text" class="form-control" placeholder="Studio / 2BR" required></div>
            <div class="form-group col-4"><label>Luas Unit</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-2"><label>Bedroom</label><input type="number" class="form-control" required></div>
            <div class="form-group col-2"><label>Bathroom</label><input type="number" class="form-control" required></div>
            <div class="form-group col-4"><label>Lantai & Tower</label><input type="text" class="form-control" placeholder="Contoh: Lantai 12 Tower A" required></div>
            <div class="form-group col-4"><label>Furnished</label><select class="form-control"><option>Fully Furnished</option><option>Semi Furnished</option><option>Unfurnished</option></select></div>
            <div class="form-group col-4"><label>Daya Listrik</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">VA</span></div></div>
        </div>
    `,
    'TOWNHOUSE / CLUSTER': `
        <div class="grid-main">
            <div class="form-group col-12"><label>Nama Perumahan / Townhouse / Cluster</label><input type="text" id="spec-nama-proyek" class="form-control" placeholder="Contoh: Pasadena Heritage, Green Residence" required></div>
            <div class="form-group col-3"><label>Luas Tanah</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-3"><label>Luas Bangunan</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-3"><label>Kamar Tidur</label><input type="number" class="form-control" required></div>
            <div class="form-group col-3"><label>Kamar Mandi</label><input type="number" class="form-control" required></div>
        </div>
    `,
    'PENTHOUSE': `
        <div class="grid-main">
            <div class="form-group col-12"><label>Nama Gedung Luxury Penthouse</label><input type="text" id="spec-nama-proyek" class="form-control" placeholder="Contoh: Langham Residences, Keraton At The Plaza" required></div>
            <div class="form-group col-4"><label>Luas Unit</label><div class="input-unit-box"><input type="number" class="form-control" required><span class="unit-tag">m²</span></div></div>
            <div class="form-group col-4"><label>Kamar Tidur</label><input type="number" class="form-control" required></div>
            <div class="form-group col-4"><label>Kamar Mandi</label><input type="number" class="form-control" required></div>
        </div>
    `,
    'LAINNYA': `
        <div class="grid-main">
            <div class="form-group col-12"><label>Sebutkan Jenis Properti</label><input type="text" class="form-control" placeholder="Masukkan jenis properti institusi/lainnya secara mendetail" required></div>
            <div class="form-group col-6"><label>Luas Tanah (m²)</label><input type="number" class="form-control"></div>
            <div class="form-group col-6"><label>Luas Bangunan (m²)</label><input type="number" class="form-control"></div>
        </div>
    `
};

const fallbackProxy = new Proxy(specTemplates, {
    get: (target, name) => name in target ? target[name] : target['LAINNYA']
});

export default fallbackProxy;
