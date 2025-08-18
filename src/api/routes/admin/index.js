const express = require('express');
const adminUserRoutes = require('./user.routes');
const adminFoundationRoutes = require('./foundation.routes');
const adminDonationRoutes = require('./donation.routes');
const adminFoundationTypeRoutes = require('./foundation-type.routes');
const adminItemCategoryRoutes = require('./item-category.routes');

const router = express.Router();

router.use('/users', adminUserRoutes);
router.use('/foundations', adminFoundationRoutes);
router.use('/donations', adminDonationRoutes);
router.use('/foundation-types', adminFoundationTypeRoutes);
router.use('/item-categories', adminItemCategoryRoutes);

module.exports = router;
