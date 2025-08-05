const express = require('express');
const pledgeRoutes = require('./pledge.routes');
const favoriteRoutes = require('./favorite.routes');
const reviewDonorRoutes = require('./review.routes');

const router = express.Router();

router.use('/pledges', pledgeRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/reviews', reviewDonorRoutes);

module.exports = router; 