const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');


// POST /api/donor/pledges/:pledgeId/reviews
const submitReviewForPledge = asyncHandler(async (req, res) => {
  const donorUserId = req.user.user_id;
  const { pledgeId } = req.params;
  const { rating_score, comment_text } = req.validatedData;

  // 1. Fetch the pledge to verify donor, status, and get foundation_id
  const { data: pledge, error: pledgeError } = await supabase
    .from('donation_pledges')
    .select('pledge_id, donor_id, foundation_id, status, wishlist_item_id, foundation_wishlist_items(item_name)')
    .eq('pledge_id', pledgeId)
    .single();

  if (pledgeError || !pledge) {
    throw new ApiError(httpStatus.NOT_FOUND, `Pledge with ID ${pledgeId} not found.`);
  }
  if (pledge.donor_id !== donorUserId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only review pledges you made.');
  }
  // Allow review if received or completed
  if (!['received_by_foundation', 'completed'].includes(pledge.status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `You can only review a pledge once it's marked as 'received' or 'completed'. Current status: ${pledge.status}`);
  }

  // 2. Check if a review for this pledge already exists (due to UNIQUE constraint on pledge_id)
  const { data: existingReview, error: checkReviewError } = await supabase
    .from('reviews_and_ratings')
    .select('review_id')
    .eq('pledge_id', pledgeId)
    .maybeSingle();

  if (checkReviewError && checkReviewError.code !== 'PGRST116') {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error checking existing review: ${checkReviewError.message}`);
  }
  if (existingReview) {
    throw new ApiError(httpStatus.CONFLICT, 'A review for this pledge has already been submitted.');
  }

  // 3. Create the review
  const reviewToInsert = {
    pledge_id: pledge.pledge_id,
    donor_id: donorUserId,
    foundation_id: pledge.foundation_id,
    rating_score,
    comment_text,
    is_approved_by_admin: false, // Default, admin needs to approve
  };

  const { data: newReview, error: insertError } = await supabase
    .from('reviews_and_ratings')
    .insert(reviewToInsert)
    .select()
    .single();

  if (insertError) {
    console.error("Error submitting review:", insertError);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to submit review: ${insertError.message}`);
  }




  res.status(httpStatus.CREATED).json(
    new ApiResponse(
      httpStatus.CREATED,
      newReview,
      'Review submitted successfully. It will be visible after admin approval.'
    )
  );
});

module.exports = {
  submitReviewForPledge,
};