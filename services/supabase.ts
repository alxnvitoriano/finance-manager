import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and Anon Key
// It is recommended to put these in a .env file
const supabaseUrl = 'https://mzwxhscnpprqlzwajiyg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
