const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const asyncHandler = require('../../utils/asyncHandler');
const Joi = require('joi');

const validate = (schema) => asyncHandler(async (req, res, next) => {
  try {
    // console.log('Validation middleware - Received schema:', schema); // <--- คอมเมนต์ log schema
    console.log('Validation middleware - Request body:', req.body);

    // ตรวจสอบและแก้ไข request body ถ้าเป็น string
    let requestBody = req.body;
    if (typeof req.body === 'string') {
      console.log('Validation middleware - Body is string, attempting to parse...');
      try {
        // ลอง parse เป็น JSON
        requestBody = JSON.parse(req.body);
      } catch (parseError) {
        // ถ้า parse ไม่ได้ ให้สร้าง object จาก string
        console.log('Validation middleware - Failed to parse JSON, creating object from string...');
        const email = req.body.replace(/"/g, '');
        requestBody = { email };
        console.log('Validation middleware - Created object:', requestBody);
      }
    }

    // ตรวจสอบว่า schema มี body property หรือไม่
    const validationSchema = schema.body || schema;
    
    const { error, value } = Joi.compile(validationSchema)
      .prefs({ 
        errors: { label: 'key' }, 
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true
      })
      .validate(requestBody);

    if (error) {
      console.log('Validation middleware - Validation error:', error.details);
      // หา field ที่ขาด ("any.required")
      const missingFields = error.details
        .filter((details) => details.type === 'any.required')
        .map((details) => details.context.key);
      const errorMessage = 'กรุณาระบุข้อมูลที่จำเป็นให้ครบถ้วน';
      // ส่ง response พร้อม missing_fields
      return res.status(httpStatus.BAD_REQUEST).json({
        code: httpStatus.BAD_REQUEST,
        message: errorMessage,
        missing_fields: missingFields.length > 0 ? missingFields : undefined
      });
    }

    console.log('Validation middleware - Validated data:', value);
    req.validatedData = value;
    return next();
  } catch (error) {
    console.error('Validation middleware - Unexpected error:', error);
    return next(error);
  }
});

module.exports = validate; 