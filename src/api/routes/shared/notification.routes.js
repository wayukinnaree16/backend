const express = require('express');
const notificationController = require('../../controllers/shared/notification.controller');
// No specific validator needed for these GET/PATCH routes if params are simple

const router = express.Router();

// Debug middleware for notification routes
router.use((req, res, next) => {
  console.log('Notification routes - Request path:', req.path);
  console.log('Notification routes - Request method:', req.method);
  next();
});

// protectRoute is already applied by the parent router (shared/index.js)

router.get('/', notificationController.getMyNotifications);
router.patch('/:notificationId/read', notificationController.markNotificationAsRead);
router.patch('/mark-all-as-read', notificationController.markAllNotificationsAsRead);


module.exports = router; 