// teravia/assets/js/supabase-config.js

// Pastikan menggunakan CDN Supabase yang ringan untuk Vanilla JS
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://junramfhdgabmytoaazh.supabase.co/rest/v1/"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1bnJhbWZoZGdhYm15dG9hYXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NDY2NDgsImV4cCI6MjA5OTQyMjY0OH0.DmK6iYsTGCRyfeSRDVs94CB_qN_Mymkywm8ib5IcU7w";

// Inisialisasi client Supabase secara Singleton (Satu koneksi global)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
