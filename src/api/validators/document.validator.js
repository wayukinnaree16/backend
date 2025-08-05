const Joi = require('joi');

const createFoundationDocumentSchema = Joi.object({
  document_name: Joi.string().max(255).required(),
  document_url: Joi.string().uri().max(255).required(), // URL ที่ได้จากการอัปโหลดไฟล์
});

// สำหรับ Admin review (อาจจะไม่ต้องมี validator ถ้า action ง่ายๆ)
const reviewFoundationDocumentSchema = Joi.object({
    verification_status_by_admin: Joi.string().valid('approved', 'rejected').required(),
    admin_remarks: Joi.string().allow(null, '').when('verification_status_by_admin', {
        is: 'rejected',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
});


module.exports = {
  createFoundationDocumentSchema,
  reviewFoundationDocumentSchema,
}; 