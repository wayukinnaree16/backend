require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { serverConfig } = require('./src/config');
const { supabase } = require('./src/config/supabase.config');
const { createClient } = require('@supabase/supabase-js');

const server = http.createServer(app);

const PORT = serverConfig.port || 3001;
const HOST = '0.0.0.0';

const supabaseInstance = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

(async () => {
  const { data, error } = await supabaseInstance.from('item_categories').select('*').limit(1);
  if (error) {
    console.error('Connection/Test Error:', error);
  } else {
    // console.log('Test Success:', data); // <--- ปิด log นี้
  }
})();

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://[your-ip-address]:${PORT}`);
  if (supabase) {
    console.log('Supabase client initialized.');
  } else {
    console.error('Supabase client failed to initialize.');
  }
}); 