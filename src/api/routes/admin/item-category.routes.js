const express = require('express');
const router = express.Router();
const itemCategoryController = require('../../controllers/admin/item-category.controller');

router.get('/', itemCategoryController.getAllItemCategories);
router.get('/:id', itemCategoryController.getItemCategory);
router.post('/', itemCategoryController.addItemCategory);
router.put('/:id', itemCategoryController.editItemCategory);
router.delete('/:id', itemCategoryController.removeItemCategory);

module.exports = router;
