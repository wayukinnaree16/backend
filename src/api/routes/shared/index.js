const express = require('express');
const notificationRoutes = require('./notification.routes');
const messageRoutes = require('./message.routes');
const uploadRoutes = require('./upload.routes');
const { protectRoute } = require('../../middlewares/auth.middleware'); // For protecting these shared routes

const router = express.Router();

// Debug middleware for shared routes
router.use((req, res, next) => {
  console.log('Shared routes - Request path:', req.path);
  console.log('Shared routes - Request method:', req.method);
  next();
});

// All shared routes require login
router.use(protectRoute);

// Debug middleware to check if routes are being mounted
router.use((req, res, next) => {
  console.log('Shared routes - After protectRoute - Request path:', req.path);
  console.log('Shared routes - After protectRoute - Request method:', req.method);
  next();
});

router.use('/notifications', notificationRoutes);
router.use('/messages', messageRoutes);
router.use('/upload', uploadRoutes);

module.exports = router; 