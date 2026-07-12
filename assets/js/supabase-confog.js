// teravia/assets/js/supabase-config.js

// Pastikan menggunakan CDN Supabase yang ringan untuk Vanilla JS
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://junramfhdgabmytoaazh.supabase.co/rest/v1/"; 
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Inisialisasi client Supabase secara Singleton (Satu koneksi global)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
