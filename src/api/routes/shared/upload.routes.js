const express = require('express');
const { protectRoute } = require('../../middlewares/auth.middleware');
const { uploadGeneralImage } = require('../../middlewares/upload.middleware');
const { uploadToSupabaseStorage } = require('../../../services/file-upload.service');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');
const httpStatus = require('http-status');

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// POST /api/upload/image - General image upload endpoint
const uploadImage = asyncHandler(async (req, res) => {
  console.log('Upload request body:', req.body);
  console.log('Upload request files:', req.files);
  console.log('Upload request file:', req.file);
  
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No image file uploaded');
  }

  try {
    const bucketName = 'general-images';
    const uploadedImageUrl = await uploadToSupabaseStorage(
      req.file.buffer,
      req.file.originalname,
      bucketName,
      `user_${req.user.user_id}`
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        {
          imageUrl: uploadedImageUrl,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        },
        'Image uploaded successfully'
      )
    );
  } catch (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload image');
  }
});

router.post('/image', uploadGeneralImage, uploadImage);

module.exports = router; 