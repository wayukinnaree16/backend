const express = require('express');
const wishlistItemPublicController = require('../../controllers/public/wishlist-item.controller');
const validate = require('../../middlewares/validate.middleware');
const wishlistValidator = require('../../validators/wishlist.validator');


const router = express.Router();

router.get(
    '/',
    // validate({ query: wishlistValidator.publicWishlistQuerySchema }), // Validate query params
    wishlistItemPublicController.listPublicWishlistItems
);
router.get('/:wishlistItemId', wishlistItemPublicController.getPublicWishlistItemDetails);

module.exports = router; 