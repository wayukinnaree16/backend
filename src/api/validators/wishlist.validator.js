const Joi = require('joi');

const itemCategorySchema = Joi.object({
  name: Joi.string().max(100).required(),
  parent_category_id: Joi.number().integer().positive().allow(null),
  description: Joi.string().allow(null, ''),
  sort_order: Joi.number().integer().default(0),
});

const foundationWishlistItemSchema = Joi.object({
  item_name: Joi.string().max(255).required(),
  category_id: Joi.number().integer().positive().required(),
  description_detail: Joi.string().required(),
  quantity_needed: Joi.number().integer().positive().required(),
  quantity_unit: Joi.string().max(50).required(),
  // quantity_received is managed by system, not direct input
  urgency_level: Joi.string().valid('normal', 'urgent', 'very_urgent').default('normal'),
  status: Joi.string().valid('open_for_donation', 'temporarily_closed', 'fulfilled', 'archived').default('open_for_donation'),
  example_image_url: Joi.string().uri().max(255).allow(null, ''),
  // posted_date, last_updated_date are managed by DB
});

const updateFoundationWishlistItemSchema = Joi.object({
  item_name: Joi.string().max(255),
  category_id: Joi.number().integer().positive(),
  description_detail: Joi.string(),
  quantity_needed: Joi.number().integer().positive(),
  quantity_unit: Joi.string().max(50),
  urgency_level: Joi.string().valid('normal', 'urgent', 'very_urgent'),
  status: Joi.string().valid('open_for_donation', 'temporarily_closed', 'fulfilled', 'archived'),
  example_image_url: Joi.string().uri().max(255).allow(null, ''),
}).min(1); // ต้องมีอย่างน้อย 1 field ที่จะ update

const publicWishlistQuerySchema = Joi.object({
  keyword: Joi.string().allow(null, ''),
  category_id: Joi.number().integer().positive().allow(null),
  foundation_id: Joi.number().integer().positive().allow(null), // Filter by specific foundation
  province: Joi.string().max(100).allow(null, ''), // Filter by foundation's province
  urgency_level: Joi.string().valid('normal', 'urgent', 'very_urgent').allow(null),
  status: Joi.string().valid('open_for_donation').default('open_for_donation'), // Default to only open items for public
  sort_by: Joi.string().valid(
    'posted_date_desc', 'posted_date_asc',
    'urgency_level_desc', 'urgency_level_asc', // อาจจะต้อง map urgency level เป็นตัวเลขเพื่อ sort
    'item_name_asc', 'item_name_desc'
  ).default('posted_date_desc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
  itemCategorySchema, // ถ้าจะให้ Admin จัดการ Category (อาจจะทำในวันหลัง)
  foundationWishlistItemSchema,
  updateFoundationWishlistItemSchema,
  publicWishlistQuerySchema,
}; 