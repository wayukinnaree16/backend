const express = require('express');
const profileRoutes = require('./profile.routes');
const wishlistItemRoutes = require('./wishlist-item.routes');
const pledgeFoundationRoutes = require('./pledge.routes');
const documentFoundationRoutes = require('./document.routes');

const router = express.Router();

router.use('/profile', profileRoutes);
router.use('/wishlist-items', wishlistItemRoutes);
router.use('/pledges', pledgeFoundationRoutes);
router.use('/documents', documentFoundationRoutes);
// เพิ่ม routes อื่นๆ ของ foundation admin ที่นี่ในอนาคต

module.exports = router; 