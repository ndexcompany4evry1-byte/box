// supabase-client.js
// Use this file to connect your app to Supabase.
// Replace SUPABASE_URL and SUPABASE_ANON_KEY with your project values.

// If you are using this in a browser environment, include this file with type="module".
// Example in HTML:
// <script type="module" src="database/supabase-client.js"></script>

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://uzlfpxudqeagnytcxuix.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_E1DJjf3';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;

// Example usage:
// import supabase from './database/supabase-client.js';
// const { data, error } = await supabase.from('your_table').select('*');
