// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iuuarglggriqouecetgw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1dWFyZ2xnZ3JpcW91ZWNldGd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDYxMTcyNiwiZXhwIjoyMDYwMTg3NzI2fQ.CJWym7V7Qe5P68ieLgqkKyXmeOGUHfnBqB6d5_X_bTU';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
