const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');
const { uploadToSupabaseStorage } = require('../../../services/file-upload.service');
const { createNotification } = require('../../../services/notification.service');

// POST /api/donor/pledges
const createDonationPledge = asyncHandler(async (req, res) => {
  const donorUserId = req.user.user_id; // จาก protectRoute (user_type='donor' ถูก authorize แล้ว)
  const {
    wishlist_item_id,
    quantity_pledged,
    donor_item_description,
    delivery_method,
    courier_company_name,
    tracking_number,
    pickup_address_details,
    pickup_preferred_datetime,
    // itemImages // Array of URLs from client-side upload (ถ้าเลือกวิธีนี้)
  } = req.validatedData;

  // 1. Verify the wishlist item exists, is open for donation, and get its foundation_id
  const { data: wishlistItem, error: wishlistError } = await supabase
    .from('foundation_wishlist_items')
    .select('*')
    .eq('wishlist_item_id', wishlist_item_id)
    .single();

  console.log('wishlistItem:', wishlistItem, 'wishlistError:', wishlistError);

  if (wishlistError || !wishlistItem) {
    throw new ApiError(httpStatus.NOT_FOUND, `Wishlist item with ID ${wishlist_item_id} not found.`);
  }
  if (wishlistItem.status !== 'open_for_donation') {
    throw new ApiError(httpStatus.BAD_REQUEST, `Wishlist item "${wishlistItem.item_name}" is not currently open for donation.`);
  }

  // 2. ดึงข้อมูล foundation ที่เกี่ยวข้อง
  const { data: foundation, error: foundationError } = await supabase
    .from('foundations')
    .select('*')
    .eq('foundation_id', wishlistItem.foundation_id)
    .single();

  if (foundationError || !foundation) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The foundation for this wishlist item does not exist.');
  }
  if (foundation.verified_at === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The foundation for this wishlist item is not currently verified.');
  }

  // 3. ดึงข้อมูล user ที่เกี่ยวข้อง (ถ้ามี user_id ใน foundation)
  if (foundation.user_id) {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', foundation.user_id)
      .single();

    if (userError || !user || user.account_status !== 'active') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The foundation for this wishlist item is not currently active.');
    }
  }

  const foundation_id = wishlistItem.foundation_id;

  // 4. Check if quantity_pledged exceeds remaining needed quantity
  const remainingNeeded = wishlistItem.quantity_needed - wishlistItem.quantity_received;
  if (quantity_pledged > remainingNeeded) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Quantity pledged (${quantity_pledged}) exceeds remaining needed quantity (${remainingNeeded}) for item "${wishlistItem.item_name}".`);
  }

  // 5. Start a transaction (if your DB and client library supports it easily, otherwise handle carefully)
  // Supabase JS client doesn't directly support multi-statement transactions easily from client-side.
  // For complex operations, consider a Database Function (RPC).
  // For now, we'll proceed sequentially and handle errors.

  const pledgeToInsert = {
    donor_id: donorUserId,
    wishlist_item_id,
    foundation_id, // Derived from wishlistItem
    quantity_pledged,
    donor_item_description,
    delivery_method,
    courier_company_name: delivery_method === 'courier_service' ? courier_company_name : null,
    tracking_number: delivery_method === 'courier_service' ? tracking_number : null,
    pickup_address_details: delivery_method === 'foundation_pickup' ? pickup_address_details : null,
    pickup_preferred_datetime: delivery_method === 'foundation_pickup' ? pickup_preferred_datetime : null,
    status: 'pending_foundation_approval', // Initial status
  };

  const { data: newPledge, error: pledgeInsertError } = await supabase
    .from('donation_pledges')
    .insert(pledgeToInsert)
    .select('*') // Select all fields of the new pledge
    .single();

  if (pledgeInsertError) {
    console.error("Error creating donation pledge:", pledgeInsertError);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to create donation pledge: ${pledgeInsertError.message}`);
  }

  // 6. Handle Pledge Item Images (from uploaded files or URLs)
  let itemImageURLs = req.body.itemImages || []; // Get URLs from body if provided

  // Handle uploaded files if any
  if (req.files && req.files.length > 0) {
    try {
      const bucketName = 'pledge-images';
      const uploadedUrls = [];
      
      for (const file of req.files) {
        const uploadedImageUrl = await uploadToSupabaseStorage(
          file.buffer,
          file.originalname,
          bucketName,
          `pledge_${newPledge.pledge_id}`
        );
        uploadedUrls.push(uploadedImageUrl);
      }
      
      // Combine uploaded URLs with any existing URLs
      itemImageURLs = [...uploadedUrls, ...itemImageURLs];
    } catch (uploadError) {
      console.error("Error uploading pledge images:", uploadError);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload pledge images');
    }
  }

  if (itemImageURLs && Array.isArray(itemImageURLs) && itemImageURLs.length > 0) {
    const imagesToInsert = itemImageURLs
      .filter(url => typeof url === 'string' && url.startsWith('http')) // Basic validation
      .map(url => ({
        pledge_id: newPledge.pledge_id,
        image_url: url,
      }));

    if (imagesToInsert.length > 0) {
      const { error: imageInsertError } = await supabase
        .from('pledge_item_images')
        .insert(imagesToInsert);

      if (imageInsertError) {
        // Log the error, but don't necessarily fail the whole pledge creation
        // Or, if critical, you might need to delete the created pledge (rollback logic)
        console.error("Error inserting pledge item images:", imageInsertError);
        // For now, we'll let the pledge be created but log the image error.
        // throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Pledge created, but failed to save item images: ${imageInsertError.message}`);
      }
    }
  }

  // Create notification for the foundation about the new pledge
  try {
    await createNotification(
      foundation_id,
      'new_donation',
      `มีการบริจาคใหม่สำหรับ "${wishlistItem.item_name}" จำนวน ${quantity_pledged} รายการ`,
      newPledge.pledge_id,
      `ผู้บริจาค: ${donor_item_description || 'ไม่ระบุรายละเอียด'}\nวิธีการส่ง: ${delivery_method}`,
      `/foundation/pledges`
    );
  } catch (notificationError) {
    console.error('Failed to create notification:', notificationError);
    // Don't fail the pledge creation if notification fails
  }

  res.status(httpStatus.CREATED).json(
    new ApiResponse(
      httpStatus.CREATED,
      newPledge, // Return the created pledge object
      'Donation pledge submitted successfully. Waiting for foundation approval.'
    )
  );
});

// GET /api/donor/pledges
const getMyDonationPledges = asyncHandler(async (req, res) => {
  const donorUserId = req.user.user_id;
  const { status, sort_by = 'pledged_at_desc', page = 1, limit = 10 } = req.query;

  let query = supabase
    .from('donation_pledges')
    .select(`
        *,
        wishlist_item:foundation_wishlist_items (item_name, example_image_url),
        foundation:foundations (foundation_name, logo_url),
        images:pledge_item_images (pledge_image_id, image_url)
    `)
    .eq('donor_id', donorUserId);

  if (status) {
    query = query.eq('status', status);
  }

  const [sortField, sortOrder] = sort_by.split('_');
  let dbSortField = 'pledged_at';
  if (sortField === 'status') dbSortField = 'status'; // Add more as needed
  query = query.order(dbSortField, { ascending: sortOrder === 'asc' });

  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  query = query.range(startIndex, startIndex + parseInt(limit, 10) - 1);

  const { data: pledges, error, count } = await query; // count might be null if range is used

  if (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to retrieve your pledges: ${error.message}`);
  }
  
  // Get total count for pagination
  let countQuery = supabase.from('donation_pledges').select('count', { count: 'exact' }).eq('donor_id', donorUserId);
  if (status) countQuery = countQuery.eq('status', status);
  const { count: totalItems, error: countError } = await countQuery.single();

  if (countError) {
      console.error("Error getting pledge count:", countError);
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
      'Your donation pledges retrieved successfully'
    )
  );
});

// GET /api/donor/pledges/:pledgeId
const getMyDonationPledgeDetails = asyncHandler(async (req, res) => {
  const donorUserId = req.user.user_id;
  const { pledgeId } = req.params;

  const { data: pledge, error } = await supabase
    .from('donation_pledges')
    .select(`
        *,
        wishlist_item:foundation_wishlist_items (*, category:item_categories(name)),
        foundation:foundations (*),
        images:pledge_item_images (pledge_image_id, image_url)
    `)
    .eq('pledge_id', pledgeId)
    .eq('donor_id', donorUserId)
    .single();

  if (error || !pledge) {
    throw new ApiError(httpStatus.NOT_FOUND, `Pledge with ID ${pledgeId} not found or does not belong to you.`);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      pledge,
      'Pledge details retrieved successfully'
    )
  );
});

// PATCH /api/donor/pledges/:pledgeId/cancel
const cancelMyPledge = asyncHandler(async (req, res) => {
    const donorUserId = req.user.user_id;
    const { pledgeId } = req.params;

    // 1. Fetch the pledge to check its current status and ownership
    const { data: existingPledge, error: fetchError } = await supabase
        .from('donation_pledges')
        .select('status, donor_id')
        .eq('pledge_id', pledgeId)
        .single();

    if (fetchError || !existingPledge) {
        throw new ApiError(httpStatus.NOT_FOUND, `Pledge with ID ${pledgeId} not found.`);
    }
    if (existingPledge.donor_id !== donorUserId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to cancel this pledge.');
    }
    if (existingPledge.status !== 'pending_foundation_approval') {
        throw new ApiError(httpStatus.BAD_REQUEST, `Cannot cancel pledge. Status is currently '${existingPledge.status}'. Only pending pledges can be cancelled.`);
    }

    // 2. Update status to 'cancelled_by_donor'
    const { data: updatedPledge, error: updateError } = await supabase
        .from('donation_pledges')
        .update({ status: 'cancelled_by_donor' })
        .eq('pledge_id', pledgeId)
        .eq('donor_id', donorUserId) // Ensure owner
        .select()
        .single();

    if (updateError) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to cancel pledge: ${updateError.message}`);
    }

    res.status(httpStatus.OK).json(
        new ApiResponse(
            httpStatus.OK,
            updatedPledge,
            'Pledge cancelled successfully.'
        )
    );
});

// PATCH /api/donor/pledges/:pledgeId/tracking (สำหรับ Donor อัปเดตข้อมูลการส่งของ)
const updatePledgeTrackingInfo = asyncHandler(async (req, res) => {
    const donorUserId = req.user.user_id;
    const { pledgeId } = req.params;
    const { courier_company_name, tracking_number } = req.validatedData;

    // 1. Fetch the pledge to check status and ownership
    const { data: pledge, error: fetchError } = await supabase
        .from('donation_pledges')
        .select('status, donor_id, delivery_method')
        .eq('pledge_id', pledgeId)
        .single();

    if (fetchError || !pledge) {
        throw new ApiError(httpStatus.NOT_FOUND, `Pledge with ID ${pledgeId} not found.`);
    }
    if (pledge.donor_id !== donorUserId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this pledge.');
    }
    if (pledge.delivery_method !== 'courier_service') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Tracking information can only be updated for courier service delivery method.');
    }
    // อนุญาตให้อัปเดต tracking ถ้าสถานะเป็น approved หรือ shipping_in_progress
    if (!['approved_by_foundation', 'shipping_in_progress'].includes(pledge.status)) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Tracking information cannot be updated when pledge status is '${pledge.status}'.`);
    }

    // 2. Update tracking info and status to 'shipping_in_progress'
    const updatePayload = {
        courier_company_name,
        tracking_number,
        status: 'shipping_in_progress'
    };

    const { data: updatedPledge, error: updateError } = await supabase
        .from('donation_pledges')
        .update(updatePayload)
        .eq('pledge_id', pledgeId)
        .select()
        .single();

    if (updateError) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to update tracking information: ${updateError.message}`);
    }

    // TODO: Notify foundation about tracking update

    res.status(httpStatus.OK).json(
        new ApiResponse(
            httpStatus.OK,
            updatedPledge,
            'Pledge tracking information updated successfully.'
        )
    );
});


module.exports = {
  createDonationPledge,
  getMyDonationPledges,
  getMyDonationPledgeDetails,
  cancelMyPledge,
  updatePledgeTrackingInfo,
};