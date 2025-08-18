const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');

// POST /api/foundation/wishlist-items
const createWishlistItem = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id; // จาก protectRoute
  const itemData = req.validatedData;

  // ตรวจสอบว่า foundation profile ของ admin คนนี้มีอยู่จริง
  const { data: foundation, error: foundationError } = await supabase
    .from('foundations')
    .select('foundation_id')
    .eq('foundation_id', foundationAdminUserId)
    .single();

  if (foundationError || !foundation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Foundation profile not found for this admin. Please create a foundation profile first.');
  }

  const dataToInsert = {
    ...itemData,
    foundation_id: foundationAdminUserId, // foundation_id ใน wishlist คือ user_id ของ foundation admin
  };

  const { data: newWishlistItem, error: insertError } = await supabase
    .from('foundation_wishlist_items')
    .insert(dataToInsert)
    .select(`
        *,
        category:item_categories (name),
        foundation:foundations (foundation_name)
    `)
    .single();

  if (insertError) {
    console.error("Error creating wishlist item:", insertError);
    if (insertError.code === '23503') { // Foreign key violation (e.g., category_id not exist)
        throw new ApiError(httpStatus.BAD_REQUEST, `Invalid category_id or other reference: ${insertError.details || insertError.message}`);
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to create wishlist item: ${insertError.message}`);
  }

  res.status(httpStatus.CREATED).json(
    new ApiResponse(
      httpStatus.CREATED,
      newWishlistItem,
      'Wishlist item created successfully'
    )
  );
});

// GET /api/foundation/wishlist-items
const getMyWishlistItems = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id;
  // สามารถเพิ่ม query params สำหรับ filter/sort/pagination ของ foundation admin เองได้
  const { status, sort_by = 'posted_date_desc', page = 1, limit = 10 } = req.query;


  let query = supabase
    .from('foundation_wishlist_items')
    .select(`
        *,
        category:item_categories (name),
        foundation:foundations (foundation_name)
    `)
    .eq('foundation_id', foundationAdminUserId);

  if (status) {
    query = query.eq('status', status);
  }

  // Sorting
  const [sortField, sortOrder] = sort_by.split('_');
  let dbSortField = 'posted_date';
  if (sortField === 'itemname') dbSortField = 'item_name';
  // เพิ่มการ sort อื่นๆ ตามต้องการ
  query = query.order(dbSortField, { ascending: sortOrder === 'asc' });

  // Pagination
  const startIndex = (page - 1) * limit;
  query = query.range(startIndex, startIndex + limit - 1);


  const { data: wishlistItems, error, count } = await query;

  if (error) {
    console.error("Error fetching foundation's wishlist items:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to fetch wishlist items: ${error.message}`);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      {
        wishlistItems,
        pagination: { // ควรจะ query count แยกต่างหากเพื่อความแม่นยำ
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil((count || wishlistItems.length) / limit), // ใช้ wishlistItems.length ถ้า count ไม่ได้
            totalItems: count || wishlistItems.length,
            itemsPerPage: parseInt(limit, 10),
        }
      },
      "Foundation's wishlist items retrieved successfully"
    )
  );
});

// GET /api/foundation/wishlist-items/:wishlistItemId
const getMyWishlistItemDetails = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id;
  const { wishlistItemId } = req.params;

  const { data: wishlistItem, error } = await supabase
    .from('foundation_wishlist_items')
    .select(`
        *,
        category:item_categories (name),
        foundation:foundations (foundation_name, logo_url)
    `)
    .eq('wishlist_item_id', wishlistItemId)
    .eq('foundation_id', foundationAdminUserId) // Ensure it belongs to this foundation
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist item not found or does not belong to this foundation.');
    }
    console.error("Error fetching wishlist item details:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to fetch wishlist item: ${error.message}`);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      wishlistItem,
      'Wishlist item details retrieved successfully'
    )
  );
});

// PUT /api/foundation/wishlist-items/:wishlistItemId
const updateMyWishlistItem = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id;
  const { wishlistItemId } = req.params;
  const updateData = req.validatedData;

  // 1. Check if item exists and belongs to the foundation
  const { data: existingItem, error: checkError } = await supabase
    .from('foundation_wishlist_items')
    .select('wishlist_item_id')
    .eq('wishlist_item_id', wishlistItemId)
    .eq('foundation_id', foundationAdminUserId)
    .single();

  if (checkError || !existingItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist item not found or you do not have permission to update it.');
  }

  console.log('Updating wishlist item with data:', updateData); // Added logging

  // 2. Perform update
  const { data: updatedItem, error: updateError } = await supabase
    .from('foundation_wishlist_items')
    .update(updateData)
    .eq('wishlist_item_id', wishlistItemId)
    .eq('foundation_id', foundationAdminUserId) // Double check ownership for safety
    .select(`
        *,
        category:item_categories (name),
        foundation:foundations (foundation_name)
    `)
    .single();
  
  if (updateError) {
    console.error("Error updating wishlist item:", updateError);
     if (updateError.code === '23503') { // Foreign key violation (e.g., category_id not exist)
        throw new ApiError(httpStatus.BAD_REQUEST, `Invalid category_id or other reference: ${updateError.details || updateError.message}`);
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to update wishlist item: ${updateError.message}`);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      updatedItem,
      'Wishlist item updated successfully'
    )
  );
});

// DELETE /api/foundation/wishlist-items/:wishlistItemId
const deleteMyWishlistItem = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id;
  const { wishlistItemId } = req.params;

  // Delete and check if any row was affected (optional, .delete() returns data of deleted rows)
  const { data: deletedItem, error } = await supabase
    .from('foundation_wishlist_items')
    .delete()
    .eq('wishlist_item_id', wishlistItemId)
    .eq('foundation_id', foundationAdminUserId) // Ensure they can only delete their own
    .select() // To get data of the deleted row (or check count)
    .maybeSingle(); // ใช้ maybeSingle แทน single เพื่อป้องกัน error

  if (error) {
    console.error("Error deleting wishlist item:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to delete wishlist item: ${error.message}`);
  }

  if (!deletedItem) { // If no row matched the criteria (e.g., wrong ID or not owner)
      return res.status(httpStatus.OK).json(
        new ApiResponse(
          httpStatus.OK,
          null,
          'Wishlist item not found.'
        )
      );
  }

  res.status(httpStatus.OK).json( // หรือ 204 No Content ถ้าไม่ต้องการส่ง body กลับ
    new ApiResponse(
      httpStatus.OK,
      deletedItem, // หรือ null
      'Wishlist item deleted successfully'
    )
  );
});


module.exports = {
  createWishlistItem,
  getMyWishlistItems,
  getMyWishlistItemDetails,
  updateMyWishlistItem,
  deleteMyWishlistItem,
};
