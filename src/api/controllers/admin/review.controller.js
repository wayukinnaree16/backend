const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');
const { createNotification } = require('../../../services/notification.service');

// GET /api/admin/reviews/pending-approval
const listPendingReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  let query = supabase
    .from('reviews_and_ratings')
    .select(`
        *,
        donor:users!donor_id (user_id, first_name, last_name, email),
        foundation:foundations (foundation_id, foundation_name),
        pledge:donation_pledges (pledge_id, wishlist_item:foundation_wishlist_items(item_name))
    `, {count: 'exact'})
    .eq('is_approved_by_admin', false)
    .order('reviewed_at', { ascending: true });

  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  query = query.range(startIndex, startIndex + parseInt(limit, 10) - 1);

  const { data: reviews, error, count } = await query;

  if (error) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to list pending reviews: ${error.message}`);

  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, {
        reviews,
        pagination: {
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil((count || 0) / parseInt(limit, 10)),
            totalItems: count || 0,
            itemsPerPage: parseInt(limit, 10),
        }
    }, 'Pending reviews listed.')
  );
});

// PATCH /api/admin/reviews/:reviewId/approve
const approveReview = asyncHandler(async (req, res) => {
  const adminUserId = req.user.user_id;
  const { reviewId } = req.params;
  const { admin_review_remarks } = req.body; // Optional from validator

  const { data: updatedReview, error } = await supabase
    .from('reviews_and_ratings')
    .update({
      is_approved_by_admin: true,
      admin_review_remarks: admin_review_remarks || null,
      // admin_approved_by: adminUserId, // Could add this field
      // admin_approved_at: new Date().toISOString(), // Could add this field
    })
    .eq('review_id', reviewId)
    .eq('is_approved_by_admin', false) // Ensure it was pending
    .select('*, donor:users!donor_id(user_id, first_name)')
    .single();

  if (error || !updatedReview) {
    throw new ApiError(httpStatus.NOT_FOUND, `Review with ID ${reviewId} not found, already processed, or update failed.`);
  }

  // TODO: Notify Donor
  await createNotification(
      updatedReview.donor.user_id,
      'review_approved',
      `รีวิวของคุณสำหรับ ${updatedReview.pledge_id} ได้รับการอนุมัติแล้ว`, // Be more specific if pledge data is fetched
      updatedReview.review_id,
      `ความคิดเห็นของคุณจะปรากฏบนหน้าโปรไฟล์ของมูลนิธิ ขอบคุณสำหรับความคิดเห็น!`,
      `/foundations/${updatedReview.foundation_id}/reviews` // Example link
  );

  // TODO: Log admin action

  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, updatedReview, 'Review approved.'));
});

// PATCH /api/admin/reviews/:reviewId/reject
const rejectReview = asyncHandler(async (req, res) => {
  const adminUserId = req.user.user_id;
  const { reviewId } = req.params;
  const { admin_review_remarks } = req.body; // Should be required if rejecting

  if (!admin_review_remarks) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Admin remarks are required when rejecting a review.");
  }

  const { data: updatedReview, error } = await supabase
    .from('reviews_and_ratings')
    .update({
      is_approved_by_admin: false, // Stays false or set to a specific 'rejected' status if needed
      admin_review_remarks: admin_review_remarks,
    })
    .eq('review_id', reviewId)
    .eq('is_approved_by_admin', false) // Ensure it was pending
    .select('*, donor:users!donor_id(user_id, first_name)')
    .single();

  if (error || !updatedReview) {
    throw new ApiError(httpStatus.NOT_FOUND, `Review with ID ${reviewId} not found, already processed, or update failed.`);
  }

  // TODO: Notify Donor about rejection and reason
   await createNotification(
      updatedReview.donor.user_id,
      'review_rejected',
      `รีวิวของคุณสำหรับ ${updatedReview.pledge_id} ไม่ผ่านการอนุมัติ`,
      updatedReview.review_id,
      `เหตุผล: ${admin_review_remarks}. กรุณาติดต่อผู้ดูแลหากมีข้อสงสัย`,
      `/donor/donations/${updatedReview.pledge_id}` // Example link
  );
  // TODO: Log admin action

  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, updatedReview, 'Review rejected.'));
});

module.exports = {
  listPendingReviews,
  approveReview,
  rejectReview,
}; 