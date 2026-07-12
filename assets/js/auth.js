// Fungsi pengecekan membership sebelum akses halaman pasang iklan
async function checkMembershipAccess() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        // Jika belum login, arahkan ke login
        window.location.href = '/login.html';
        return;
    }

    // Ambil data profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('membership_type')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return;
    }

    // Layer 1: Filter Premium
    if (profile.membership_type === 'FREE') {
        // Jangan buka halaman, tampilkan Popup Upgrade
        showUpgradeModal(); 
    } else {
        // Jika Premium, izinkan akses
        window.location.href = '/pages/pasang-iklan.html';
    }
}

