import { supabase } from './supabase-config.js';

/**
 * Fungsi untuk Registrasi User Baru dengan Pilihan Persona
 * @param {string} email - Email pengguna
 * @param {string} password - Password minimal 6 karakter
 * @param {string} fullName - Nama Lengkap pengguna
 * @param {string} phoneWhatsapp - Nomor WhatsApp aktif
 * @param {string} personaType - 'Owner', 'Broker / Agen', 'Developer', 'Investor'
 */
export async function registerUser(email, password, fullName, phoneWhatsapp, personaType) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // Metadata ini otomatis dibaca oleh Trigger Database Supabase untuk tabel profiles
                data: {
                    full_name: fullName,
                    phone_whatsapp: phoneWhatsapp,
                    persona_type: personaType
                }
            }
        });

        if (error) throw error;
        return { success: true, user: data.user };
    } catch (error) {
        console.error("Registration Error:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Fungsi Login User
 */
export async function loginUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return { success: true, session: data.session };
    } catch (error) {
        console.error("Login Error:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Fungsi Mendapatkan Sesi & Profil User Aktif (Termasuk Status Membership)
 */
export async function getCurrentUser() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Ambil data profil dari tabel public.profiles (Aman karena terproteksi RLS)
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return { ...user, profile };
    } catch (error) {
        console.error("Get User Profile Error:", error.message);
        return null;
    }
}

/**
 * Fungsi Logout
 */
export async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = '../login.html';
    }
}

