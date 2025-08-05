const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');
const { createNotification } = require('../../../services/notification.service');


// POST /api/messages
const sendInternalMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.user_id;
  const { recipient_id, content, pledge_id } = req.validatedData;

  // 1. Verify recipient_id exists
  const { data: recipientUser, error: recipientError } = await supabase
    .from('users')
    .select('user_id, email, first_name') // Select minimal needed for notification
    .eq('user_id', recipient_id)
    .single();

  if (recipientError || !recipientUser) {
    throw new ApiError(httpStatus.NOT_FOUND, `Recipient user with ID ${recipient_id} not found.`);
  }

  // (Optional) Verify pledge_id exists if provided
  if (pledge_id) {
    const { data: pledge, error: pledgeCheckError } = await supabase
        .from('donation_pledges')
        .select('pledge_id')
        .eq('pledge_id', pledge_id)
        .maybeSingle();
    if (pledgeCheckError || !pledge) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Associated pledge ID ${pledge_id} not found.`);
    }
    // Further check if sender/recipient are related to this pledge (donor or foundation_admin)
  }


  const messageToInsert = {
    sender_id: senderId,
    recipient_id,
    content,
    pledge_id, // Can be null
  };

  const { data: newMessage, error: insertError } = await supabase
    .from('internal_messages')
    .insert(messageToInsert)
    .select()
    .single();

  if (insertError) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to send message: ${insertError.message}`);
  }

  // Create a notification for the recipient
  await createNotification(
      recipient_id,
      'new_message',
      `คุณได้รับข้อความใหม่จาก ${req.user.first_name}`,
      newMessage.message_id, // related_entity_id is the message_id
      content.substring(0, 100) + (content.length > 100 ? '...' : ''), // Short preview
      `/messages/conversation/${senderId}` // Link to conversation with sender (example)
      // or /messages/pledge/PLEDGE_ID if pledge_id is present
  );


  res.status(httpStatus.CREATED).json(
    new ApiResponse(
      httpStatus.CREATED,
      newMessage,
      'Message sent successfully.'
    )
  );
});

// GET /api/messages/conversations
const listMyConversations = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  // This is complex: needs to group messages by other participant and get latest message.
  // Often done with a database view or a more complex query.
  // Simplified version: Get all messages where user is sender or recipient, then group in app (not ideal for pagination)

  // A better approach would be a distinct list of users the current user has messaged with.
  // Example using a raw SQL query via rpc (if needed for complexity) or a view.
  // For now, a simple list of recent messages (not grouped into conversations yet)
  const { data, error } = await supabase
    .from('internal_messages')
    .select(`
        *,
        sender:users!sender_id(user_id, first_name, last_name, profile_image_url),
        recipient:users!recipient_id(user_id, first_name, last_name, profile_image_url)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('sent_at', { ascending: false })
    .limit(50); // Example limit

  if (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to retrieve conversations: ${error.message}`);
  }

  // TODO: Process `data` to group into actual conversations list
  // For each conversation, show the other user and the last message snippet.

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      data, // This is a flat list of messages, needs processing for a "conversations" view
      'Message list retrieved (needs client-side grouping for conversations).'
    )
  );
});

// GET /api/messages/conversation/:otherUserId
const getMessagesInConversation = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  const { otherUserId } = req.params;
  const { pledge_id } = req.query; // Optional filter by pledge

  let query = supabase
    .from('internal_messages')
    .select(`
        *,
        sender:users!sender_id(user_id, first_name, last_name, profile_image_url)
    `)
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`
    );

  if (pledge_id) {
      query = query.eq('pledge_id', pledge_id);
  }

  query = query.order('sent_at', { ascending: true }); // Show oldest first in a conversation

  const { data: messages, error } = await query;

  if (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to retrieve messages: ${error.message}`);
  }

  // TODO: Mark messages as read for `userId` where `recipient_id` is `userId` in this conversation
  // await supabase.from('internal_messages').update({ is_read_by_recipient: true, read_at: new Date() })
  //  .eq('recipient_id', userId).eq('sender_id', otherUserId).eq('is_read_by_recipient', false);

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      messages,
      'Conversation messages retrieved.'
    )
  );
});


module.exports = {
  sendInternalMessage,
  listMyConversations, // This is a simplified version
  getMessagesInConversation,
}; 