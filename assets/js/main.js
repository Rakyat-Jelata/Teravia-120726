// Data mapping untuk dependent dropdown
const propertiData = {
    hunian: ['Rumah', 'Apartemen', 'Villa', 'Townhouse'],
    komersial: ['Ruko', 'Kantor', 'Gudang'],
    tanah: ['Kavling', 'Sawah', 'Kebun']
};

window.renderDynamicFields = function() {
    const kategori = document.getElementById('kategori').value;
    const jenisSelect = document.getElementById('jenis_properti');
    
    // Reset dropdown
    jenisSelect.innerHTML = '<option value="">Pilih Jenis Properti</option>';
    
    if (propertiData[kategori]) {
        propertiData[kategori].forEach(item => {
            jenisSelect.innerHTML += `<option value="${item.toLowerCase()}">${item}</option>`;
        });
    }
};

