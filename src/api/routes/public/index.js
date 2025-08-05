const express = require('express');
const foundationPublicRoutes = require('./foundation.routes');
const itemCategoryPublicRoutes = require('./item-category.routes');
const wishlistItemPublicRoutes = require('./wishlist-item.routes');
const contentPagePublicRoutes = require('./content-page.routes');
// const announcementRoutes = require('./announcement.routes'); // ตัวอย่างถ้ามี
// const contentPageRoutes = require('./content-page.routes.js'); // ตัวอย่างถ้ามี

const router = express.Router();

router.use('/foundations', foundationPublicRoutes);
router.use('/item-categories', itemCategoryPublicRoutes);
router.use('/wishlist-items', wishlistItemPublicRoutes);
router.use('/content-pages', contentPagePublicRoutes);
// router.use('/announcements', announcementRoutes);
// router.use('/content-pages', contentPageRoutes);

module.exports = router; 