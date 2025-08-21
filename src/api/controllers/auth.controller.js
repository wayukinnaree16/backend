const httpStatus = require('http-status');
const { supabase } = require('../../config/supabase.config');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { createNotification } = require('../../services/notification.service');

const registerUser = asyncHandler(async (req, res) => {
  const { 
    email, 
    password, 
    first_name, 
    last_name, 
    user_type, 
    phone_number,
    profile_image_url
  } = req.validatedData;

  // Hash the password
  const password_hash = await bcrypt.hash(password, 10);
  
  // Set account status based on user type
  const account_status = user_type === 'foundation_admin' ? 'pending_verification' : 'active';

  // Set current timestamp for agreements
  const currentTimestamp = new Date().toISOString();

  // Get the next user_id
  const { data: lastUser, error: lastUserError } = await supabase
    .from('users')
    .select('user_id')
    .order('user_id', { ascending: false })
    .limit(1)
    .single();

  const user_id = lastUser ? lastUser.user_id + 1 : 1;


  // Log the data we're trying to insert
  console.log('Attempting to insert user with data:', {
    user_id,
    email,
    first_name,
    last_name,
    user_type,
    account_status,
    phone_number,
    profile_image_url,
    agreed_to_terms_at: currentTimestamp,
    agreed_to_privacy_at: currentTimestamp
  });

  try {
    // First check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error("Error checking existing user:", checkError);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Error checking existing user: ${checkError.message}`
      );
    }

    if (existingUser) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Email already registered'
      );
    }

    // Insert new user
    const { data: newUser, error: dbError } = await supabase
      .from('users')
      .insert([
        {
          user_id,
          email,
          password_hash,
          first_name,
          last_name,
          phone_number,
          profile_image_url,
          user_type,
          is_email_verified: false,
          account_status,
          agreed_to_terms_at: currentTimestamp,
          agreed_to_privacy_at: currentTimestamp
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database Error Details:", {
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        code: dbError.code,
        error: dbError
      });
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR, 
        `Failed to save user details: ${dbError.message || 'Unknown database error'}`
      );
    }

    if (!newUser) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'User was created but no data was returned'
      );
    }

    const { password_hash: _, ...userResponse } = newUser;

    // Send notification to all system admins if this is a foundation admin registration
    if (user_type === 'foundation_admin') {
      try {
        // Get all system admin users
        const { data: systemAdmins, error: adminError } = await supabase
          .from('users')
          .select('user_id')
          .eq('user_type', 'system_admin')
          .eq('account_status', 'active');

        if (!adminError && systemAdmins && systemAdmins.length > 0) {
          // Send notification to each system admin
          for (const admin of systemAdmins) {
            await createNotification(
              admin.user_id,
              'new_foundation_application',
              `มีการสมัครมูลนิธิใหม่: ${first_name} ${last_name}`,
              newUser.user_id,
              `ผู้สมัคร: ${first_name} ${last_name} (${email}) ได้สมัครเป็นผู้ดูแลมูลนิธิใหม่ กรุณาตรวจสอบและอนุมัติการสมัคร`,
              `/admin/foundation-verification`
            );
          }
          console.log(`Sent new foundation application notifications to ${systemAdmins.length} system admins`);
        }
      } catch (notificationError) {
        console.warn('Failed to send admin notifications for new foundation application:', notificationError.message);
        // Don't fail the registration if notification fails
      }
    }

    res.status(httpStatus.CREATED).json(
      new ApiResponse(
        httpStatus.CREATED,
        { user: userResponse },
        'Registration successful.'
      )
    );
  } catch (error) {
    console.error('Registration Error:', {
      message: error.message,
      stack: error.stack,
      error: error
    });
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Registration failed: ${error.message}`
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData;

  // Find user by email
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (findError || !user) {
    console.error('Login error: User not found or error finding user.', { email, findError });
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid login credentials");
  }

  console.log('User found for login attempt:', {
    user_id: user.user_id,
    email: user.email,
    password_hash_stored: user.password_hash
  });

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  console.log('Password validation result:', { isPasswordValid });
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid login credentials");
  }

  // Update last login time
  const { error: updateError } = await supabase
    .from('users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('user_id', user.user_id);

  if (updateError) {
    console.error("Error updating last login time:", updateError);
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      user_id: user.user_id,
      email: user.email,
      user_type: user.user_type
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  // Remove sensitive data
  const { password_hash, ...userResponse } = user;

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      { 
        user: userResponse,
        token
      },
      'Login successful'
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  let token;
   if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
     return res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'No active session to logout or token not provided.')
    );
  }
  
  const { error } = await supabase.auth.signOut(token);

  if (error) {
    console.error("Supabase signOut error:", error.message);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, null, 'Logout successful')
  );
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.validatedData;
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error("Password reset request error:", error.message);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      null,
      'If an account with this email exists, a password reset link has been sent.'
    )
  );
});

const updateUserPasswordAfterReset = asyncHandler(async (req, res) => {
    const { new_password } = req.validatedData;
    let userAccessToken = req.body.access_token;

    if (!userAccessToken && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      userAccessToken = req.headers.authorization.split(' ')[1];
    }
    
    if (!userAccessToken) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Access token is required to update password.");
    }

    if (!req.user) {
         throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated for password update. Ensure access token is valid.");
    }
    
    const { error } = await supabase.auth.updateUser(
        { password: new_password }
    );

    if (error) {
        console.error("Error updating password:", error);
        throw new ApiError(httpStatus.BAD_REQUEST, `Failed to update password: ${error.message}`);
    }

    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, null, 'Password updated successfully.'));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.validatedData;
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error("Forgot password request error:", error.message);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      null,
      'If an account with this email exists, a password reset link has been sent.'
    )
  );
});

const updatePasswordNoVerify = asyncHandler(async (req, res) => {
  const { email, new_password } = req.body;
  if (!email || !new_password) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Email and new_password are required.',
      success: false
    });
  }
  const password_hash = await bcrypt.hash(new_password, 10);
  const { error } = await supabase
    .from('users')
    .update({ password_hash })
    .eq('email', email);
  if (error) {
    return res.status(500).json({
      statusCode: 500,
      message: 'Failed to update password.',
      success: false
    });
  }
  res.status(200).json({
    statusCode: 200,
    message: 'Password updated successfully.',
    success: true
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  updateUserPasswordAfterReset,
  forgotPassword,
  updatePasswordNoVerify,
};
