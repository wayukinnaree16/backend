const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const publicApiRoutes = require('./public');
const foundationAdminRoutes = require('./foundation');
const donorRoutes = require('./donor');
const adminRoutes = require('./admin');
const sharedRoutes = require('./shared');

const router = express.Router();

// Public routes (no auth needed, or handled by RLS for read)
router.use('/public', publicApiRoutes);

// Authenticated user routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Foundation Admin specific routes
router.use('/foundation', foundationAdminRoutes);
router.use('/donor', donorRoutes);

// Admin (System Admin) specific routes (จะเพิ่มในอนาคต)
router.use('/admin', adminRoutes);

// Shared authenticated routes (notifications, messages for all logged-in users)
// Mount shared routes at root level to match /api/notifications and /api/messages
router.use('/', sharedRoutes);

module.exports = router; 