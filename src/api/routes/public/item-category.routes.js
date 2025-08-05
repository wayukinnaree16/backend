const express = require('express');
const itemCategoryController = require('../../controllers/public/item-category.controller');
// const validate = require('../../middlewares/validate.middleware'); // For create/update by admin later
// const wishlistValidator = require('../../validators/wishlist.validator'); // For create/update by admin later

const router = express.Router();

router.get('/', itemCategoryController.listItemCategories);
// Admin routes for managing categories will be added later if needed
// router.post('/', validate(wishlistValidator.itemCategorySchema), adminItemCategoryController.createItemCategory);

module.exports = router; 