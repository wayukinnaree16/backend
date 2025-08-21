const asyncHandler = require('../../../utils/asyncHandler');
const { supabase } = require('../../../config/supabase.config');
const { createNotification } = require('../../../services/notification.service');
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
  const { status } = req.body;
  
  // Get pledge details before updating
  const { data: pledgeData, error: fetchError } = await supabase
    .from('donation_pledges')
    .select(`
      pledge_id,
      donor_id,
      foundation_id,
      donor_item_description,
      quantity_pledged,
      status,
      donor:users!donor_id(first_name, last_name),
      foundation:foundations!foundation_id(foundation_name)
    `)
    .eq('pledge_id', id)
    .single();
    
  if (fetchError || !pledgeData) {
    return res.status(404).json({ success: false, message: 'Donated item not found' });
  }
  
  const updatedItem = await updateDonatedItemStatus(id, req.body);
  if (!updatedItem) {
    return res.status(404).json({ success: false, message: 'Failed to update donated item' });
  }
  
  // Send notification to donor about status change
  if (status && status !== pledgeData.status) {
    try {
      const statusMessages = {
        'pending_foundation_approval': 'รอการอนุมัติจากมูลนิธิ',
        'approved_by_foundation': 'ได้รับการอนุมัติจากมูลนิธิแล้ว',
        'shipping_in_progress': 'อยู่ระหว่างการจัดส่ง',
        'received_by_foundation': 'มูลนิธิได้รับของบริจาคแล้ว',
        'cancelled': 'ถูกยกเลิก'
      };
      
      const shortMessage = `สถานะการบริจาค: ${statusMessages[status] || status}`;
      const longMessage = `สถานะการบริจาค "${pledgeData.donor_item_description}" ของคุณได้เปลี่ยนเป็น ${statusMessages[status] || status}`;
      
      await createNotification(
        pledgeData.donor_id,
        'donation_status_updated',
        shortMessage,
        pledgeData.pledge_id,
        longMessage,
        `/donor/donations/${pledgeData.pledge_id}`
      );
    } catch (notificationError) {
      console.error('Failed to send donation status update notification:', notificationError);
    }
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
