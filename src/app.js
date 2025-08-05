const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const apiRouter = require('./api/routes');
const { errorHandler } = require('./api/middlewares/errorHandler.middleware');
const ApiError = require('./utils/ApiError');
const httpStatus = require('http-status');

const app = express();

// Middlewares
app.use(helmet()); // Set security HTTP headers

// Request body logging middleware
app.use((req, res, next) => {
  // console.log('Request headers:', req.headers); // <--- คอมเมนต์บรรทัดนี้ ไม่ต้อง log headers
  console.log('Request body:', req.body);
  next();
});

// Standard JSON parsing middleware
app.use(express.json({ limit: '10mb' }));

// Custom middleware to fix malformed JSON (only for POST/PUT/PATCH requests)
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && 
      req.headers['content-type'] === 'application/json' && 
      req.body && 
      typeof req.body === 'string') {
    try {
      let bodyString = req.body;
      
      // Fix double quotes issue
      if (bodyString.includes('""')) {
        console.log('Detected malformed JSON with double quotes, attempting to fix...');
        bodyString = bodyString.replace(/""/g, '"');
      }
      
      // Handle case where body is just a string (not JSON object)
      if (bodyString.startsWith('"') && bodyString.endsWith('"')) {
        console.log('Detected string body, converting to proper JSON format...');
        // If it's just a string, we need to handle it differently
        try {
          req.body = JSON.parse(bodyString);
        } catch (parseError) {
          // If it's just a string, create a proper object structure
          const email = bodyString.replace(/"/g, '');
          req.body = { email };
          console.log('Converted string body to object:', req.body);
        }
      } else {
        // Try to parse the fixed JSON
        req.body = JSON.parse(bodyString);
      }
    } catch (error) {
      console.error('Failed to parse JSON body:', error.message);
      console.error('Original body string:', req.body);
      return res.status(400).json({
        status: 400,
        message: 'Invalid JSON format. Please check your request body.',
        error: 'JSON_PARSE_ERROR',
        details: error.message
      });
    }
  }
  next();
});

app.use(express.urlencoded({ extended: true })); // Parse urlencoded request body

// CORS configuration - อนุญาตทุก origin
const corsOptions = {
  origin: true, // อนุญาตทุก origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Requested-With']
};

app.use(cors(corsOptions)); // Enable cors with specific options
app.options('*', cors(corsOptions)); // Enable pre-flight requests

// Error handling for JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON Parse Error:', err.message);
    return res.status(400).json({
      status: 400,
      message: 'Invalid JSON format. Please check your request body.',
      error: 'JSON_PARSE_ERROR'
    });
  }
  next(err);
});

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev')); // HTTP request logger middleware
}

// Debug middleware to log request paths (placed before API routes)
app.use((req, res, next) => {
  console.log('Request path:', req.path);
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  next();
});

// Test endpoint to verify API is working (public) - placed before API routes
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      public: '/api/public',
      auth: '/api/auth',
      users: '/api/users',
      foundation: '/api/foundation',
      donor: '/api/donor',
      admin: '/api/admin',
      shared: '/api/notifications, /api/messages'
    }
  });
});

// Test endpoint for messages without authentication (for debugging)
app.get('/api/test-messages', (req, res) => {
  res.json({
    status: 'success',
    message: 'Messages endpoint is accessible',
    timestamp: new Date().toISOString(),
    note: 'This is a test endpoint without authentication'
  });
});

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Global error handler
app.use(errorHandler);

module.exports = app; 