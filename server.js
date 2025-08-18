const app = require('./src/app');
const { supabase } = require('./src/config/supabase.config');

const PORT = process.env.PORT || 3001;

// Start server
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://[your-ip-address]:${PORT}`);
  
  console.log('Supabase client initialized.');
  
  // Test database connection
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('Database connection test failed:', error.message);
    } else {
      console.log('Database connection test successful');
    }
  } catch (err) {
    console.error('Database connection test error:', err.message);
  }
});

module.exports = app;