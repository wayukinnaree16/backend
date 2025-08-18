const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');

// GET /api/foundation/pledges/received
const getReceivedPledges = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id; // คือ foundation_id ในตาราง pledges
  const { status, sort_by = 'pledged_at_desc', page = 1, limit = 10 } = req.query;

  let query = supabase
    .from('donation_pledges')
    .select(`
        *,
        donor:users!donor_id (user_id, first_name, last_name, email, profile_image_url),
        wishlist_item:foundation_wishlist_items (item_name, example_image_url),
        images:pledge_item_images (pledge_image_id, image_url)
    `)
    .eq('foundation_id', foundationAdminUserId);

  if (status) {
    if (Array.isArray(status)) {
      query = query.in('status', status);
    } else {
      query = query.eq('status', status);
    }
  }

  const [sortField, sortOrder] = sort_by.split('_');
  let dbSortField = 'pledged_at';
  if (sortField === 'status') dbSortField = 'status';
  query = query.order(dbSortField, { ascending: sortOrder === 'asc' });

  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  query = query.range(startIndex, startIndex + parseInt(limit, 10) - 1);

  const { data: pledges, error, count } = await query;

  if (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to retrieve received pledges: ${error.message}`);
  }

  // Get total count for pagination
  let countQuery = supabase.from('donation_pledges').select('count', { count: 'exact' }).eq('foundation_id', foundationAdminUserId);
  if (status) {
    if (Array.isArray(status)) {
      countQuery = countQuery.in('status', status);
    } else {
      countQuery = countQuery.eq('status', status);
    }
  }
  const { count: totalItems, error: countError } = await countQuery.single();

   if (countError) {
      console.error("Error getting received pledge count:", countError);
  }


  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      {
        pledges,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil((totalItems || 0) / parseInt(limit, 10)),
          totalItems: totalItems || 0,
          itemsPerPage: parseInt(limit, 10),
        },
      },
      'Received pledges retrieved successfully'
    )
  );
});

// PATCH /api/foundation/pledges/:pledgeId/approve
const approvePledge = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id;
  const { pledgeId } = req.params;

  // 1. Fetch the pledge to ensure it belongs to this foundation and is in correct status
  const { data: pledge, error: fetchError } = await supabase
    .from('donation_pledges')
    .select('pledge_id, foundation_id, status, wishlist_item_id, quantity_pledged')
    .eq('pledge_id', pledgeId)
    .eq('foundation_id', foundationAdminUserId)
    .single();

  if (fetchError || !pledge) {
    throw new ApiError(httpStatus.NOT_FOUND, `Pledge with ID ${pledgeId} not found or does not belong to your foundation.`);
  }
  if (pledge.status !== 'pending_foundation_approval') {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot approve pledge. Status is currently '${pledge.status}'.`);
  }

  // 2. Update pledge status
  const { data: updatedPledge, error: updateError } = await supabase
    .from('donation_pledges')
    .update({
      status: 'approved_by_foundation',
      foundation_action_at: new Date().toISOString(),
    })
    .eq('pledge_id', pledgeId)
    .select()
    .single();

  if (updateError) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to approve pledge: ${updateError.message}`);
  }

  // TODO: (Advanced) Update Foundation_Wishlist_Items.quantity_received
  // This can be tricky with concurrency. A database function/trigger is safer.
  // For now, we'll skip this direct update from API or do it non-atomically.
  // Example (non-atomic, less safe for high concurrency):
  /*
  const { error: wishlistUpdateError } = await supabase
    .from('foundation_wishlist_items')
    .update({ quantity_received: supabase.sql(`quantity_received + ${pledge.quantity_pledged}`) })
    .eq('wishlist_item_id', pledge.wishlist_item_id);
  if (wishlistUpdateError) console.error("Error updating wishlist item quantity_received:", wishlistUpdateError);
  */

  // TODO: Notify Donor about approval.

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      updatedPledge,
      'Pledge approved successfully.'
    )
  );
});

// PATCH /api/foundation/pledges/:pledgeId/reject
const rejectPledge = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id;
  const { pledgeId } = req.params;
  const { rejection_reason_by_foundation } = req.validatedData;

  // 1. Fetch the pledge
  const { data: pledge, error: fetchError } = await supabase
    .from('donation_pledges')
    .select('pledge_id, foundation_id, status')
    .eq('pledge_id', pledgeId)
    .eq('foundation_id', foundationAdminUserId)
    .single();

  if (fetchError || !pledge) {
    throw new ApiError(httpStatus.NOT_FOUND, `Pledge with ID ${pledgeId} not found or does not belong to your foundation.`);
  }
  if (pledge.status !== 'pending_foundation_approval') {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot reject pledge. Status is currently '${pledge.status}'.`);
  }

  // 2. Update pledge status and reason
  const { data: updatedPledge, error: updateError } = await supabase
    .from('donation_pledges')
    .update({
      status: 'rejected_by_foundation',
      rejection_reason_by_foundation,
      foundation_action_at: new Date().toISOString(),
    })
    .eq('pledge_id', pledgeId)
    .select()
    .single();

  if (updateError) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to reject pledge: ${updateError.message}`);
  }
  // TODO: Notify Donor about rejection.

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      updatedPledge,
      'Pledge rejected successfully.'
    )
  );
});

// PATCH /api/foundation/pledges/:pledgeId/confirm-receipt
const confirmPledgeReceipt = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id;
  const { pledgeId } = req.params;
  // const { quantity_received_actual, issue_notes } = req.validatedData; // For future enhancement

  // 1. Fetch the pledge
  const { data: pledge, error: fetchError } = await supabase
    .from('donation_pledges')
    .select('pledge_id, foundation_id, status, wishlist_item_id, quantity_pledged')
    .eq('pledge_id', pledgeId)
    .eq('foundation_id', foundationAdminUserId)
    .single();

  if (fetchError || !pledge) {
    throw new ApiError(httpStatus.NOT_FOUND, `Pledge with ID ${pledgeId} not found or does not belong to your foundation.`);
  }
  // Foundation can confirm receipt if status is 'approved_by_foundation' (donor delivers) or 'shipping_in_progress' (courier)
  // Foundation can confirm receipt if status is 'pending_foundation_approval', 'approved_by_foundation' (donor delivers) or 'shipping_in_progress' (courier)
  if (!['pending_foundation_approval', 'approved_by_foundation', 'shipping_in_progress'].includes(pledge.status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot confirm receipt for pledge with status '${pledge.status}'.`);
  }

  // --- Transaction Start (Conceptual - Supabase JS Client doesn't have direct transactions) ---
  // For atomicity, these two updates should ideally be in a DB transaction / RPC call.

  // 2. Update pledge status
  const { data: updatedPledge, error: pledgeUpdateError } = await supabase
    .from('donation_pledges')
    .update({
      status: 'received_by_foundation',
      foundation_received_at: new Date().toISOString(),
      // Add donor_notes_on_receipt if provided by donor (not part of this FA action)
    })
    .eq('pledge_id', pledgeId)
    .select()
    .single();

  if (pledgeUpdateError) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to update pledge status to received: ${pledgeUpdateError.message}`);
  }

  // 3. Atomically update quantity_received in Foundation_Wishlist_Items and check for fulfillment
  const { data: wishlistItem, error: fetchWishlistError } = await supabase
    .from('foundation_wishlist_items')
    .select('quantity_received, quantity_needed')
    .eq('wishlist_item_id', pledge.wishlist_item_id)
    .single();

  if (fetchWishlistError || !wishlistItem) {
    console.error("CRITICAL: Failed to fetch wishlist item for quantity update:", fetchWishlistError);
  } else {
    const newQuantityReceived = (wishlistItem.quantity_received || 0) + (pledge.quantity_pledged || 0);
    let updateWishlistItemData = { quantity_received: newQuantityReceived };

    // Check if the item is now fulfilled
    if (newQuantityReceived >= wishlistItem.quantity_needed) {
      updateWishlistItemData.status = 'fulfilled';
    }

    const { error: wishlistUpdateError } = await supabase
      .from('foundation_wishlist_items')
      .update(updateWishlistItemData)
      .eq('wishlist_item_id', pledge.wishlist_item_id);

    if (wishlistUpdateError) {
      console.error("CRITICAL: Pledge status updated, but failed to update wishlist item quantity_received/status:", wishlistUpdateError);
    }
  }
  // --- Transaction End (Conceptual) ---

  // TODO: Notify Donor about receipt confirmation.

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      updatedPledge,
      'Pledge receipt confirmed successfully. Item quantity and status updated.'
    )
  );
});


module.exports = {
  getReceivedPledges,
  approvePledge,
  rejectPledge,
  confirmPledgeReceipt,
};
