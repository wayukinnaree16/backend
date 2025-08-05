const express = require('express');
const messageController = require('../../controllers/shared/message.controller');
const validate = require('../../middlewares/validate.middleware');
const messageValidator = require('../../validators/message.validator');

const router = express.Router();

// Debug middleware for message routes
router.use((req, res, next) => {
  console.log('Message routes - Request path:', req.path);
  console.log('Message routes - Request method:', req.method);
  console.log('Message routes - Full URL:', req.url);
  next();
});

// protectRoute is already applied by the parent router (shared/index.js)

// Get all messages for the current user (root path) - use listMyConversations for now
router.get('/', messageController.listMyConversations);
router.post('/', validate(messageValidator.createInternalMessageSchema), messageController.sendInternalMessage);
router.get('/conversations', messageController.listMyConversations); // Simplified
router.get('/conversation/:otherUserId', messageController.getMessagesInConversation);

module.exports = router; 