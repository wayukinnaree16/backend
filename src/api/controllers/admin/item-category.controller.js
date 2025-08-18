const asyncHandler = require('../../../utils/asyncHandler');
const {
  getItemCategories,
  getItemCategoryById,
  createItemCategory,
  updateItemCategory,
  deleteItemCategory,
} = require('../../../services/admin/item-category.service');

const getAllItemCategories = asyncHandler(async (req, res) => {
  const itemCategories = await getItemCategories();
  res.status(200).json({
    success: true,
    data: itemCategories,
  });
});

const getItemCategory = asyncHandler(async (req, res) => {
  const itemCategory = await getItemCategoryById(req.params.id);
  if (!itemCategory) {
    return res.status(404).json({ success: false, message: 'Item category not found' });
  }
  res.status(200).json({
    success: true,
    data: itemCategory,
  });
});

const addItemCategory = asyncHandler(async (req, res) => {
  const newItemCategory = await createItemCategory(req.body);
  res.status(201).json({
    success: true,
    data: newItemCategory,
  });
});

const editItemCategory = asyncHandler(async (req, res) => {
  const updatedItemCategory = await updateItemCategory(req.params.id, req.body);
  if (!updatedItemCategory) {
    return res.status(404).json({ success: false, message: 'Item category not found' });
  }
  res.status(200).json({
    success: true,
    data: updatedItemCategory,
  });
});

const removeItemCategory = asyncHandler(async (req, res) => {
  const deletedCount = await deleteItemCategory(req.params.id);
  if (deletedCount === 0) {
    return res.status(404).json({ success: false, message: 'Item category not found' });
  }
  res.status(204).json({
    success: true,
    data: null,
  });
});

module.exports = {
  getAllItemCategories,
  getItemCategory,
  addItemCategory,
  editItemCategory,
  removeItemCategory,
};
