const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');

// GET /api/notifications (For logged-in user)
const getMyNotifications = asyncHandler(async (req, res) => {
  const recipientUserId = req.user.user_id;
  const { page = 1, limit = 15, unread_only = false } = req.query;

  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('recipient_user_id', recipientUserId);

  if (unread_only === 'true' || unread_only === true) {
    query = query.eq('is_read', false);
  }

  query = query.order('created_at', { ascending: false }); // Latest first

  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  query = query.range(startIndex, startIndex + parseInt(limit, 10) - 1);

  const { data: notifications, error, count } = await query;

  if (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to retrieve notifications: ${error.message}`);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      {
        notifications,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil((count || 0) / parseInt(limit, 10)),
          totalItems: count || 0,
          itemsPerPage: parseInt(limit, 10),
        },
      },
      'Notifications retrieved successfully.'
    )
  );
});

// PATCH /api/notifications/:notificationId/read
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const recipientUserId = req.user.user_id;
  const { notificationId } = req.params;

  const { data: updatedNotification, error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('notification_id', notificationId)
    .eq('recipient_user_id', recipientUserId) // Ensure user owns the notification
    .eq('is_read', false) // Only update if not already read
    .select()
    .single();

  if (error && error.code !== 'PGRST116' /* No rows if already read or not owner */) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to mark notification as read: ${error.message}`);
  }
  if (!updatedNotification && (error && error.code === 'PGRST116')) {
      // This can happen if it's already read or doesn't belong to the user
      // We can choose to return success or a specific message
      const {data: existingNotification, error: fetchError} = await supabase.from('notifications').select('is_read').eq('notification_id', notificationId).eq('recipient_user_id', recipientUserId).single();
      if (existingNotification && existingNotification.is_read) {
          return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, existingNotification, 'Notification was already marked as read.'));
      }
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found or you do not have permission.');
  }


  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      updatedNotification,
      'Notification marked as read.'
    )
  );
});

// PATCH /api/notifications/mark-all-as-read
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
    const recipientUserId = req.user.user_id;

    const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('recipient_user_id', recipientUserId)
        .eq('is_read', false) // Only update unread ones
        .select(); // Returns array of updated notifications

    if (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to mark all notifications as read: ${error.message}`);
    }

    res.status(httpStatus.OK).json(
        new ApiResponse(
            httpStatus.OK,
            { count: data ? data.length : 0 },
            'All unread notifications marked as read.'
        )
    );
});


module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
}; 