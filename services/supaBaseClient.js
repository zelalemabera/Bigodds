// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

//Db credentials....
const supabaseUrl = "https://svbelnskuufoduhgzovr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YmVsbnNrdXVmb2R1aGd6b3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MjI0NjYsImV4cCI6MjA3MjI5ODQ2Nn0.NVaL2q2RfHix2Ymkfrfy4e6PUmA2aKTj1gwxAvRvAc4";

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Prevents the client from parsing URLs for auth sessions
  },
});

// // Optional: Handle app state changes (foreground/background)
// AppState.addEventListener('change', (state) => {
//   if (state === 'active') {
//     supabase.auth.startAutoRefresh(); // Keeps the client session fresh
//   } else {
//     supabase.auth.stopAutoRefresh();
//   }
// });