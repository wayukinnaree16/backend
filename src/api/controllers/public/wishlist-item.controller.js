const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');

// GET /api/public/wishlist-items
const listPublicWishlistItems = asyncHandler(async (req, res) => {
  const {
    keyword,
    category_id,
    foundation_id,
    province, // Foundation's province
    urgency_level,
    status = 'open_for_donation', // Default to open for donation
    sort_by = 'posted_date_desc',
    page = 1,
    limit = 10,
  } = req.query; // ควร validate query params ด้วย Joi (publicWishlistQuerySchema)

  let query = supabase
    .from('foundation_wishlist_items')
    .select(`
        wishlist_item_id,
        item_name,
        description_detail,
        quantity_needed,
        quantity_unit,
        quantity_received,
        urgency_level,
        status,
        example_image_url,
        posted_date,
        category:item_categories (category_id, name),
        foundation_id,
        foundation:foundations!inner (
            foundation_id,
            foundation_name,
            logo_url,
            province,
            city,
            user_account:users!fk_foundation_user (account_status) 
        )
    `)
    .eq('status', status) // Filter by status (e.g., 'open_for_donation')
    .eq('foundation.user_account.account_status', 'active') // Foundation's user account must be active
    .not('foundation.verified_at', 'is', null);      // Foundation must be verified

  // Filters
  if (keyword) {
    query = query.or(`item_name.ilike.%${keyword}%,description_detail.ilike.%${keyword}%`);
  }
  if (category_id) {
    // If category has children, might need to search in children categories too
    // For now, direct match:
    query = query.eq('category_id', category_id);
  }
  if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
  }
  if (province) {
    query = query.ilike('foundation.province', `%${province}%`);
  }
  if (urgency_level) {
    query = query.eq('urgency_level', urgency_level);
  }

  // Sorting (urgency_level might need mapping to a numeric value for proper sorting if it's ENUM)
  // For simplicity, direct sort for now.
  const [sortField, sortOrder] = sort_by.split('_');
  let dbSortField = 'posted_date';
  if (sortField === 'itemname') dbSortField = 'item_name';
  else if (sortField === 'urgency') dbSortField = 'urgency_level'; // ENUM sort order is alphabetical by default

  query = query.order(dbSortField, { ascending: sortOrder === 'asc' });

  // Pagination
  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  query = query.range(startIndex, startIndex + parseInt(limit, 10) - 1);

  // Get total count for pagination (execute separately for accuracy)
  let countQuery = supabase
    .from('foundation_wishlist_items')
    .select('count', { count: 'exact' })
    .eq('status', status);

  if (keyword) countQuery = countQuery.or(`item_name.ilike.%${keyword}%,description_detail.ilike.%${keyword}%`);
  if (category_id) countQuery = countQuery.eq('category_id', category_id);
  if (foundation_id) countQuery = countQuery.eq('foundation_id', foundation_id);
  if (province) countQuery = countQuery.ilike('province', `%${province}%`);
  if (urgency_level) countQuery = countQuery.eq('urgency_level', urgency_level);

  const { data: wishlistItems, error } = await query;
  const { count, error: countError } = await countQuery.single();

  console.log('Query results for wishlist items:', {
    wishlistItemsCount: count,
    wishlistItemsFound: wishlistItems?.length || 0,
    sample: wishlistItems?.[0]
  });

  if (error || countError) {
    console.error("Error listing public wishlist items:", error || countError);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to list wishlist items: ${(error || countError).message}`);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      {
        wishlistItems,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil((count || 0) / parseInt(limit, 10)),
          totalItems: count || 0,
          itemsPerPage: parseInt(limit, 10),
        }
      },
      'Public wishlist items listed successfully'
    )
  );
});

// GET /api/public/wishlist-items/:wishlistItemId
const getPublicWishlistItemDetails = asyncHandler(async (req, res) => {
  const { wishlistItemId } = req.params;

  const { data: wishlistItem, error } = await supabase
    .from('foundation_wishlist_items')
    .select(`
        *,
        category:item_categories (category_id, name, description),
        foundation:foundations!inner (
            foundation_id,
            foundation_name,
            logo_url,
            province,
            city,
            contact_email,
            website_url,
            user_account:users!fk_foundation_user (account_status)
        )
    `)
    .eq('wishlist_item_id', wishlistItemId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error("Error fetching public wishlist item details:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to fetch wishlist item: ${error.message}`);
  }

  if (!wishlistItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist item not found or not available for public viewing.');
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      wishlistItem,
      'Wishlist item details retrieved successfully'
    )
  );
});

module.exports = {
  listPublicWishlistItems,
  getPublicWishlistItemDetails,
};
