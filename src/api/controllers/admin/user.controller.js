const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');

// GET /api/admin/users
const listUsers = asyncHandler(async (req, res) => {
  const { user_type, account_status, search_term, sort_by = 'created_at_desc', page = 1, limit = 20 } = req.query;

  let query = supabase
    .from('users')
    .select('*', { count: 'exact' }); // Get total count

  if (user_type) query = query.eq('user_type', user_type);
  if (account_status) query = query.eq('account_status', account_status);
  if (search_term) {
    query = query.or(`email.ilike.%${search_term}%,first_name.ilike.%${search_term}%,last_name.ilike.%${search_term}%`);
  }

  const [sortFieldDb, sortOrderDb] = sort_by.split('_');
  const validSortField = (sortFieldDb === 'created') ? 'created_at' : (sortFieldDb || 'created_at');
  query = query.order(validSortField, { ascending: (sortOrderDb || 'desc') === 'asc' });

  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  query = query.range(startIndex, startIndex + parseInt(limit, 10) - 1);

  const { data: users, error, count } = await query;

  if (error) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to list users: ${error.message}`);

  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, {
      users,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil((count || 0) / parseInt(limit, 10)),
        totalItems: count || 0,
        itemsPerPage: parseInt(limit, 10),
      }
    }, 'Users listed successfully')
  );
});

// GET /api/admin/users/:userId
const getUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { data: user, error } = await supabase
    .from('users')
    .select('*') // Consider joining related data like foundation profile if needed
    .eq('user_id', userId)
    .single();

  if (error || !user) throw new ApiError(httpStatus.NOT_FOUND, `User with ID ${userId} not found.`);

  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, user, 'User details retrieved.'));
});

// PATCH /api/admin/users/:userId/status
const updateUserAccountStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { account_status, reason } = req.validatedData; // 'reason' might be for logging or notification

  const { data: updatedUser, error } = await supabase
    .from('users')
    .update({ account_status: account_status, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !updatedUser) throw new ApiError(httpStatus.NOT_FOUND, `Failed to update status for user ${userId}: User not found or update failed.`);

  // TODO: Log this action in Admin_Action_Logs
  // TODO: Send notification to the user if status changes significantly (e.g., suspended, banned)

  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, updatedUser, `User account status updated to ${account_status}.`));
});

// PATCH /api/admin/users/:userId/ban
const banUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { ban_reason } = req.body;

    // Update user status to 'banned' and save ban_reason (if column exists)
    const updates = { account_status: 'banned' };
    if ('ban_reason' in (await supabase.from('users').select('*').limit(1).single()).data) {
        updates.ban_reason = ban_reason;
    }

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('user_id', userId)
        .select('*')
        .single();

    if (error) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to ban user: ${error.message}`);
    if (!data) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { user: data }, 'User banned successfully'));
});

// PATCH /api/admin/users/:userId/unban
const unbanUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { unban_reason } = req.body;

    // Update user status to 'active' and clear ban_reason (if column exists)
    const updates = { account_status: 'active' };
    
    // Check if ban_reason column exists and clear it
    try {
        const { data: userCheck } = await supabase.from('users').select('ban_reason').eq('user_id', userId).single();
        if (userCheck && 'ban_reason' in userCheck) {
            updates.ban_reason = null;
        }
    } catch (error) {
        // If ban_reason column doesn't exist, just continue
        console.log('ban_reason column might not exist, continuing without clearing it');
    }

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('user_id', userId)
        .select('*')
        .single();

    if (error) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to unban user: ${error.message}`);
    if (!data) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { user: data }, 'User unbanned successfully'));
});

// PATCH /api/admin/users/:userId/reset-status
const resetUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // เปลี่ยนสถานะกลับเป็น pending_verification
  const { data, error } = await supabase
    .from('users')
    .update({ account_status: 'pending_verification' })
    .eq('user_id', userId)
    .eq('user_type', 'foundation_admin')
    .select('*')
    .single();

  if (error || !data) throw new ApiError(httpStatus.NOT_FOUND, 'User not found or update failed');
  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, data, 'User status reset to pending_verification'));
});

module.exports = {
  listUsers,
  getUserDetails,
  updateUserAccountStatus,
  banUser,
  unbanUser,
  resetUserStatus,
}; 