const app = require('./src/app');
const { supabase } = require('./src/config/supabase.config');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8080"],
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle user joining their personal room for notifications
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their notification room`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available globally
app.set('io', io);

// Start server
server.listen(PORT, '0.0.0.0', async () => {
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