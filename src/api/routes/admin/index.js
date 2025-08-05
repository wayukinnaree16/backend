const express = require('express');
const adminUserRoutes = require('./user.routes');
const adminFoundationRoutes = require('./foundation.routes');
const adminContentPageRoutes = require('./content-page.routes');
const adminReviewRoutes = require('./review.routes');
// const adminItemCategoryRoutes = require('./item-category.routes'); // For later
// const adminFoundationTypeRoutes = require('./foundation-type.routes'); // For later

const router = express.Router();

router.use('/users', adminUserRoutes);
router.use('/foundations', adminFoundationRoutes);
router.use('/content-pages', adminContentPageRoutes);
router.use('/reviews', adminReviewRoutes);
// router.use('/item-categories', adminItemCategoryRoutes);
// router.use('/foundation-types', adminFoundationTypeRoutes);

module.exports = router; 