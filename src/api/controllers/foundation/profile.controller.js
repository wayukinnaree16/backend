const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');
const { uploadGeneralImage } = require('../../middlewares/upload.middleware');
const { uploadToSupabaseStorage } = require('../../../services/file-upload.service');

// GET /api/foundation/profile/me
const getMyFoundationProfile = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id; // จาก protectRoute และ authorize middleware

  // ดึงข้อมูลโปรไฟล์มูลนิธิจากตาราง Foundations
  // โดย foundation_id ในตาราง Foundations คือ user_id ของ foundation_admin
  const { data: foundationProfile, error } = await supabase
    .from('foundations') // ชื่อตาราง Foundations
    .select(`
      *,
      foundation_type:foundation_types (name) 
    `) // Join กับ foundation_types เพื่อเอาชื่อประเภทมาด้วย (ถ้าต้องการ)
    .eq('foundation_id', foundationAdminUserId)
    .maybeSingle(); // ใช้ maybeSingle เผื่อกรณีที่ยังไม่มีโปรไฟล์ (จะคืน null แทน error)

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found, ซึ่งไม่ใช่ error ในกรณีนี้
    console.error("Error fetching foundation profile:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to fetch foundation profile: ${error.message}`);
  }

  if (!foundationProfile) {
    // ถ้ายังไม่มีโปรไฟล์ อาจจะคืน 404 หรือ object ว่างๆ หรือข้อความให้ไปสร้างโปรไฟล์
    // ในที่นี้ คืน 200 พร้อม data เป็น null เพื่อให้ frontend จัดการได้
    return res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        null,
        'Foundation profile not yet created. Please create one.'
      )
    );
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      foundationProfile,
      'Foundation profile retrieved successfully'
    )
  );
});

// PUT /api/foundation/profile/me (Create or Update)
const upsertMyFoundationProfile = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id;
  const profileData = req.validatedData; // จาก validate middleware
  const logoFile = req.file; // The uploaded file, if any

  // Debug logging: Check if file is received by controller
  console.log('Profile Controller - req.file:', logoFile);
  if (logoFile) {
    console.log('Profile Controller - logoFile details:', {
      originalname: logoFile.originalname,
      mimetype: logoFile.mimetype,
      size: logoFile.size,
      bufferLength: logoFile.buffer ? logoFile.buffer.length : 0
    });
  }
  console.log('Profile Controller - req.body:', req.body);

  let logoUrl = profileData.logo_url; // Keep existing URL if no new file

  // If a new file is uploaded, upload it to Supabase Storage
  if (logoFile) {
    try {
      const publicUrl = await uploadToSupabaseStorage(logoFile.buffer, logoFile.originalname, 'foundation-logos', logoFile.mimetype, `foundation_logos/${foundationAdminUserId}`);
      logoUrl = publicUrl;
    } catch (uploadError) {
      console.error("Exception during logo upload:", uploadError);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to process logo upload: ${uploadError.message}`);
    }
  }

  // ข้อมูลที่จะ insert/update
  // foundation_id จะเป็น user_id ของ foundation admin
  const dataToUpsert = {
    foundation_id: foundationAdminUserId, // PK และ FK to users.user_id
    ...profileData,
    logo_url: logoUrl, // Update logo_url with new URL or keep old
    // created_at, updated_at จะถูกจัดการโดย DB (DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP)
    // verified_by_admin_id, verified_at, verification_notes จะถูกจัดการโดย System Admin
  };

  // Check if this is a new profile creation (not an update)
  const { data: existingProfile, error: checkError } = await supabase
    .from('foundations')
    .select('foundation_id')
    .eq('foundation_id', foundationAdminUserId)
    .maybeSingle();

  const isNewProfile = !existingProfile;

  // Debug logging
  console.log('Data to upsert:', dataToUpsert);

  // ใช้ .upsert() เพื่อสร้างถ้ายังไม่มี หรืออัปเดตถ้ามีอยู่แล้ว
  // onConflict: 'foundation_id' หมายถึงถ้ามี record ที่ foundation_id ซ้ำกัน ให้ทำการ update
  const { data: upsertedProfile, error } = await supabase
    .from('foundations')
    .upsert(dataToUpsert, { onConflict: 'foundation_id' })
    .select(`
      *,
      foundation_type:foundation_types (name)
    `)
    .single();

  if (error) {
    console.error("Error upserting foundation profile:", error);
    // ตรวจสอบ specific errors, เช่น FK constraint ถ้า foundation_type_id ไม่ถูกต้อง
    if (error.code === '23503') { // Foreign key violation
        throw new ApiError(httpStatus.BAD_REQUEST, `Invalid foundation_type_id or other foreign key constraint failed: ${error.details || error.message}`);
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to save foundation profile: ${error.message}`);
  }

  if (!upsertedProfile) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to save or retrieve foundation profile after operation.');
  }

  // If this is a new profile creation, set user account status to pending_verification
  if (isNewProfile) {
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ account_status: 'pending_verification' })
      .eq('user_id', foundationAdminUserId)
      .eq('user_type', 'foundation_admin');

    if (userUpdateError) {
      console.error('Error updating user account status to pending_verification:', userUpdateError);
      // Don't throw error here as the profile was created successfully
      // Just log the error for debugging
    }
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      upsertedProfile,
      'Foundation profile saved successfully'
    )
  );
});

module.exports = {
  getMyFoundationProfile,
  upsertMyFoundationProfile,
};
