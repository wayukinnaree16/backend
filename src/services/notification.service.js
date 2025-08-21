const { supabase } = require('../config/supabase.config'); // ปรับ path ตามโครงสร้างของคุณ

/**
 * Get Socket.IO instance from app
 * @param {Object} req - Express request object (optional)
 * @returns {Object|null} Socket.IO instance or null
 */
const getSocketIO = (req = null) => {
  try {
    // Try to get from request object first
    if (req && req.app) {
      return req.app.get('io');
    }
    
    // Fallback: try to get from global app instance
    const app = require('../app');
    return app.get('io');
  } catch (error) {
    console.warn('Could not get Socket.IO instance:', error.message);
    return null;
  }
};

/**
 * Creates a new notification.
 * @param {number} recipientUserId - The ID of the user who will receive the notification.
 * @param {string} notificationType - Type of notification (e.g., 'pledge_status_update').
 * @param {string} messageShort - A short summary of the notification.
 * @param {number} [relatedEntityId] - Optional ID of the related entity (e.g., pledge_id).
 * @param {string} [messageLong] - Optional detailed message.
 * @param {string} [linkUrl] - Optional URL for the notification to link to.
 */
const createNotification = async (
  recipientUserId,
  notificationType,
  messageShort,
  relatedEntityId = null,
  messageLong = null,
  linkUrl = null
) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        recipient_user_id: recipientUserId,
        notification_type: notificationType,
        message_short: messageShort,
        related_entity_id: relatedEntityId,
        message_long: messageLong,
        link_url: linkUrl,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error creating notification for user ${recipientUserId}:`, error);
      // Decide if this error should propagate or just be logged
      return null;
    }
    
    console.log(`Notification created for user ${recipientUserId}: Type ${notificationType}`);
    
    // Send real-time notification via Socket.IO
    try {
      const io = getSocketIO();
      if (io) {
        // Format notification for frontend
        const realtimeNotification = {
          id: data.notification_id,
          title: data.message_short,
          message: data.message_long || data.message_short,
          type: data.notification_type,
          is_read: false,
          related_entity_type: data.notification_type === 'new_foundation_application' ? 'foundation' : 'pledge',
          related_entity_id: data.related_entity_id,
          created_at: data.created_at,
          read_at: null
        };
        
        // Send to user's personal room
        io.to(`user-${recipientUserId}`).emit('new-notification', realtimeNotification);
        console.log(`Real-time notification sent to user ${recipientUserId}`);
      }
    } catch (socketError) {
      console.warn('Failed to send real-time notification:', socketError.message);
      // Don't fail the entire operation if Socket.IO fails
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error in createNotification service:', err);
    return null;
  }
};

// ตัวอย่างการเรียกใช้ (จะอยู่ใน controller อื่นๆ)
/*
if (pledgeApproved) {
    await createNotification(
        pledge.donor_id,
        'pledge_status_update',
        `มูลนิธิ ${foundation.name} ได้อนุมัติการบริจาคของคุณสำหรับ "${pledge.wishlistItem.name}" แล้ว!`,
        pledge.pledge_id,
        `รายละเอียดเพิ่มเติม... กรุณาเตรียมการจัดส่ง`,
        `/donor/donations/${pledge.pledge_id}`
    );
}
*/

module.exports = {
  createNotification,
};