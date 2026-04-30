import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fbisbgxrooxosnpvrdkd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiaXNiZ3hyb294b3NucHZyZGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzkyODksImV4cCI6MjA5MjAxNTI4OX0.TYxuL7C1YvGHCniZrYyCRss33JeVA9j85dYddrFdINI';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
