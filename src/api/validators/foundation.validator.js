const Joi = require('joi');

const createOrUpdateFoundationProfile = Joi.object({
  foundation_name: Joi.string().max(255).required().messages({
    'string.empty': 'Foundation name cannot be empty',
    'any.required': 'Foundation name is required',
    'string.max': 'Foundation name cannot be longer than 255 characters'
  }),
  // อนุญาตให้ส่ง logo_url กรณีอัปโหลดไฟล์แยกแล้วส่ง URL มาพร้อมกับการบันทึกโปรไฟล์
  logo_url: Joi.string().max(1000).allow(null, ''), // ไม่บังคับเป็น uri() เผื่อกรณีเป็น signed URL/temporary URL
  history_mission: Joi.string().allow(null, ''),
  foundation_type_id: Joi.number().integer().positive().allow(null), // FK
  address_line1: Joi.string().max(255).allow(null, ''),
  address_line2: Joi.string().max(255).allow(null, ''),
  city: Joi.string().max(100).allow(null, ''),
  province: Joi.string().max(100).allow(null, ''),
  postal_code: Joi.string().max(10).allow(null, ''),
  country: Joi.string().max(50).default('Thailand'),
  gmaps_embed_url: Joi.string().uri().max(500).allow(null, ''),
  contact_phone: Joi.string().max(100).allow(null, ''), // Consider JSON or separate table for multiple
  contact_email: Joi.string().email().max(255).allow(null, ''),
  website_url: Joi.string().uri().max(255).allow(null, ''),
  social_media_links: Joi.object().pattern(Joi.string(), Joi.string().uri()).allow(null), // e.g., {"facebook": "url"}
  license_number: Joi.string().max(100).allow(null, ''),
  accepts_pickup_service: Joi.boolean().default(false),
  pickup_service_area: Joi.string().when('accepts_pickup_service', { is: true, then: Joi.required(), otherwise: Joi.allow(null, '') }),
  pickup_contact_info: Joi.string().when('accepts_pickup_service', { is: true, then: Joi.required(), otherwise: Joi.allow(null, '') }),
  // verified_by_admin_id, verified_at, verification_notes will be handled by System Admin
});

const publicFoundationQuery = Joi.object({
  name: Joi.string().max(255),
  type_id: Joi.number().integer().positive(),
  province: Joi.string().max(100),
  sort_by: Joi.string().valid('name_asc', 'name_desc', 'created_at_asc', 'created_at_desc').default('name_asc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
  createOrUpdateFoundationProfile,
  publicFoundationQuery,
};
