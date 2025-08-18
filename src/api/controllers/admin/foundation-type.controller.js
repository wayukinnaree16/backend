const asyncHandler = require('../../../utils/asyncHandler');
const {
  getFoundationTypes,
  getFoundationTypeById,
  createFoundationType,
  updateFoundationType,
  deleteFoundationType,
} = require('../../../services/admin/foundation-type.service');

const getAllFoundationTypes = asyncHandler(async (req, res) => {
  const foundationTypes = await getFoundationTypes();
  res.status(200).json({
    success: true,
    data: foundationTypes,
  });
});

const getFoundationType = asyncHandler(async (req, res) => {
  const foundationType = await getFoundationTypeById(req.params.id);
  if (!foundationType) {
    return res.status(404).json({ success: false, message: 'Foundation type not found' });
  }
  res.status(200).json({
    success: true,
    data: foundationType,
  });
});

const addFoundationType = asyncHandler(async (req, res) => {
  const newFoundationType = await createFoundationType(req.body);
  res.status(201).json({
    success: true,
    data: newFoundationType,
  });
});

const editFoundationType = asyncHandler(async (req, res) => {
  const updatedFoundationType = await updateFoundationType(req.params.id, req.body);
  if (!updatedFoundationType) {
    return res.status(404).json({ success: false, message: 'Foundation type not found' });
  }
  res.status(200).json({
    success: true,
    data: updatedFoundationType,
  });
});

const removeFoundationType = asyncHandler(async (req, res) => {
  const deletedCount = await deleteFoundationType(req.params.id);
  if (deletedCount === 0) {
    return res.status(404).json({ success: false, message: 'Foundation type not found' });
  }
  res.status(204).json({
    success: true,
    data: null,
  });
});

module.exports = {
  getAllFoundationTypes,
  getFoundationType,
  addFoundationType,
  editFoundationType,
  removeFoundationType,
};
