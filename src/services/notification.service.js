const { supabase } = require('../config/supabase.config'); // ปรับ path ตามโครงสร้างของคุณ

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