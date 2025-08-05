const httpStatus = require('http-status');
const { supabase } = require('../../config/supabase.config');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { uploadToSupabaseStorage } = require('../../services/file-upload.service');
const bcrypt = require('bcrypt');

const getMyProfile = asyncHandler(async (req, res) => {
  const userProfile = req.user;
  const { password_hash, ...safeUserProfile } = userProfile;

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      safeUserProfile,
      'User profile retrieved successfully'
    )
  );
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;
  
  // Log the raw request body
  console.log('Raw request body:', req.body);
  
  // Extract fields from request body
  const { first_name, last_name, phone_number, profile_image_url } = req.body;

  // Handle profile image upload if file is provided
  let finalProfileImageUrl = profile_image_url;
  if (req.file) {
    try {
      const bucketName = 'user-profile-images';
      const uploadedImageUrl = await uploadToSupabaseStorage(
        req.file.buffer,
        req.file.originalname,
        bucketName,
        `user_${userId}`
      );
      finalProfileImageUrl = uploadedImageUrl;
    } catch (uploadError) {
      console.error('Error uploading profile image:', uploadError);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload profile image');
    }
  }

  // Validate that at least one field is provided
  if (!first_name && !last_name && !phone_number && !finalProfileImageUrl) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'At least one field must be provided for update');
  }

  // Log the extracted fields
  console.log('Extracted fields:', {
    first_name,
    last_name,
    phone_number,
    profile_image_url
  });

  // First verify the user exists
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (checkError || !existingUser) {
    console.error("Error checking existing user:", checkError);
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  console.log('Existing user data:', existingUser);

  // Prepare update data with only provided fields
  const updateData = {};
  if (first_name) updateData.first_name = first_name;
  if (last_name) updateData.last_name = last_name;
  if (phone_number) updateData.phone_number = phone_number;
  if (finalProfileImageUrl) updateData.profile_image_url = finalProfileImageUrl;
  updateData.updated_at = new Date().toISOString();

  console.log('Applying updates:', updateData);

  // Perform the update
  const { error: updateError } = await supabase
    .from('users')
    .update(updateData)
    .eq('user_id', userId);

  if (updateError) {
    console.error("Error updating user profile:", updateError);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to update profile: ${updateError.message}`);
  }

  // Verify the update
  const { data: updatedUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError || !updatedUser) {
    console.error("Error fetching updated user:", fetchError);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch updated user data');
  }

  // Log the update results
  console.log('Update results:', {
    before: existingUser,
    after: updatedUser,
    changes: updateData,
    differences: {
      first_name: existingUser.first_name !== updatedUser.first_name,
      last_name: existingUser.last_name !== updatedUser.last_name,
      phone_number: existingUser.phone_number !== updatedUser.phone_number,
      profile_image_url: existingUser.profile_image_url !== updatedUser.profile_image_url
    }
  });

  const { password_hash: _, ...userResponse } = updatedUser;

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      { user: userResponse },
      'Profile updated successfully'
    )
  );
});

const changePasswordLoggedInUser = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;
  const userId = req.user.user_id;

  // Get user data including password hash
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (userError || !user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(current_password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect current password');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(new_password, salt);

  // Update password in database
  const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash: hashedPassword })
    .eq('user_id', userId);

  if (updateError) {
    console.error("Error updating password:", updateError);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update password');
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, null, 'Password changed successfully')
  );
});

module.exports = {
  getMyProfile,
  updateUserProfile,
  changePasswordLoggedInUser,
}; 