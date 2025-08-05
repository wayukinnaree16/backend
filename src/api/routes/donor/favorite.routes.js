const express = require('express');
const favoriteController = require('../../controllers/donor/favorite.controller');
const { protectRoute, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const favoriteValidator = require('../../validators/favorite.validator');

const router = express.Router();

router.use(protectRoute, authorize('donor'));

router.post(
    '/',
    validate(favoriteValidator.manageFavoriteSchema),
    favoriteController.addFavoriteFoundation
);
router.get('/', favoriteController.getMyFavoriteFoundations);
router.delete('/:foundationId', favoriteController.removeFavoriteFoundation); // Param is foundationId

module.exports = router; 