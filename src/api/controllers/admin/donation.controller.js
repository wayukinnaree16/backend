const asyncHandler = require('../../../utils/asyncHandler');
const {
  getDonationStatistics,
  getAllDonatedItems,
  updateDonatedItemStatus,
} = require('../../../services/admin/donation.service');

const getDonationStatisticsController = asyncHandler(async (req, res) => {
  const stats = await getDonationStatistics();
  res.status(200).json({
    success: true,
    data: stats,
  });
});

const getAllDonatedItemsController = asyncHandler(async (req, res) => {
  const { status } = req.query; // Extract status from query parameters
  const donatedItems = await getAllDonatedItems(status); // Pass status to the service function
  res.status(200).json({
    success: true,
    data: donatedItems,
  });
});

const updateDonatedItemStatusController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedItem = await updateDonatedItemStatus(id, req.body);
  if (!updatedItem) {
    return res.status(404).json({ success: false, message: 'Donated item not found' });
  }
  res.status(200).json({
    success: true,
    data: updatedItem,
  });
});

module.exports = {
  getDonationStatistics: getDonationStatisticsController,
  getAllDonatedItems: getAllDonatedItemsController,
  updateDonatedItemStatus: updateDonatedItemStatusController,
};
