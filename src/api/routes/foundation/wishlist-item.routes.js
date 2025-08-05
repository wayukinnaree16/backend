const express = require('express');
const wishlistItemController = require('../../controllers/foundation/wishlist-item.controller');
const { protectRoute, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const wishlistValidator = require('../../validators/wishlist.validator');

const router = express.Router();

// All routes in this file require user to be logged in and be a 'foundation_admin'
router.use(protectRoute, authorize('foundation_admin'));

router.post(
    '/',
    validate(wishlistValidator.foundationWishlistItemSchema),
    wishlistItemController.createWishlistItem
);
router.get('/', wishlistItemController.getMyWishlistItems); // Add query validation if needed
router.get('/:wishlistItemId', wishlistItemController.getMyWishlistItemDetails);
router.put(
    '/:wishlistItemId',
    validate(wishlistValidator.updateFoundationWishlistItemSchema),
    wishlistItemController.updateMyWishlistItem
);
router.delete('/:wishlistItemId', wishlistItemController.deleteMyWishlistItem);

module.exports = router; 