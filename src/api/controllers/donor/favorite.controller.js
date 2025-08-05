const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');

// POST /api/donor/favorites
const addFavoriteFoundation = asyncHandler(async (req, res) => {
  const donorUserId = req.user.user_id;
  const { foundation_id } = req.validatedData;

  // 1. Check if foundation exists and is valid (verified and active)
  const { data: foundation, error: foundationCheckError } = await supabase
    .from('foundations')
    .select('foundation_id, verified_at')
    .eq('foundation_id', foundation_id)
    .single();

  if (foundationCheckError || !foundation) {
    throw new ApiError(httpStatus.NOT_FOUND, `Foundation with ID ${foundation_id} not found.`);
  }
  if (foundation.verified_at === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'This foundation is not currently verified and cannot be favorited.');
  }

  // 2. Add to favorites
  const { data: newFavorite, error: insertError } = await supabase
    .from('donor_favorite_foundations')
    .insert({
      donor_id: donorUserId,
      foundation_id: foundation_id,
    })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') { // Unique constraint violation
      throw new ApiError(httpStatus.CONFLICT, 'You have already favorited this foundation.');
    }
    console.error("Error adding favorite foundation:", insertError);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to add favorite: ${insertError.message}`);
  }

  res.status(httpStatus.CREATED).json(
    new ApiResponse(
      httpStatus.CREATED,
      newFavorite,
      'Foundation added to favorites successfully.'
    )
  );
});

// GET /api/donor/favorites
const getMyFavoriteFoundations = asyncHandler(async (req, res) => {
  const donorUserId = req.user.user_id;

  const { data: favorites, error } = await supabase
    .from('donor_favorite_foundations')
    .select(`
        favorite_id,
        added_at,
        foundation:foundations (
            foundation_id,
            foundation_name,
            logo_url,
            province,
            city,
            foundation_type:foundation_types (name)
        )
    `)
    .eq('donor_id', donorUserId)
    .order('added_at', { ascending: false });

  if (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to retrieve favorite foundations: ${error.message}`);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      favorites,
      'Favorite foundations retrieved successfully.'
    )
  );
});

// DELETE /api/donor/favorites/:foundationId (Using foundation_id in path for RESTfulness)
const removeFavoriteFoundation = asyncHandler(async (req, res) => {
  const donorUserId = req.user.user_id;
  const { foundationId } = req.params; // Note: param name is foundationId

  const { data: deletedFavorite, error } = await supabase
    .from('donor_favorite_foundations')
    .delete()
    .eq('donor_id', donorUserId)
    .eq('foundation_id', foundationId)
    .select() // To check if a row was actually deleted
    .single(); // Expect one row to be deleted

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows, which means it wasn't a favorite
    console.error("Error removing favorite foundation:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to remove favorite: ${error.message}`);
  }

  if (!deletedFavorite && (error && error.code === 'PGRST116')) { // No row found, means it was not a favorite or wrong ID
    throw new ApiError(httpStatus.NOT_FOUND, 'This foundation was not in your favorites or does not exist.');
  }
  // If deletedFavorite is null and no error, it means it was not found.

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      deletedFavorite, // Data of the deleted record
      'Foundation removed from favorites successfully.'
    )
  );
});

module.exports = {
  addFavoriteFoundation,
  getMyFavoriteFoundations,
  removeFavoriteFoundation,
}; 