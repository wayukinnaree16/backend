const Joi = require('joi');

const createDonationPledgeSchema = Joi.object({
  wishlist_item_id: Joi.number().integer().positive().required(),
  // foundation_id will be derived from wishlist_item_id
  quantity_pledged: Joi.number().integer().positive().required(),
  donor_item_description: Joi.string().allow(null, ''),
  delivery_method: Joi.string().valid('self_delivery', 'courier_service', 'foundation_pickup').required(),
  courier_company_name: Joi.string().max(100).when('delivery_method', {
    is: 'courier_service',
    then: Joi.required(),
    otherwise: Joi.allow(null, ''),
  }),
  tracking_number: Joi.string().max(100).when('delivery_method', {
    is: 'courier_service',
    then: Joi.allow(null, ''), // Tracking อาจจะยังไม่มีตอน pledge
    otherwise: Joi.allow(null, ''),
  }),
  pickup_address_details: Joi.string().when('delivery_method', {
    is: 'foundation_pickup',
    then: Joi.required(),
    otherwise: Joi.allow(null, ''),
  }),
  pickup_preferred_datetime: Joi.string().when('delivery_method', {
    is: 'foundation_pickup',
    then: Joi.required(),
    otherwise: Joi.allow(null, ''),
  }),
  // itemImages: Joi.array().items(Joi.string().uri()).optional().max(5), // Array of image URLs, max 5 images
  // status, pledged_at, etc. will be set by the system
});

// สำหรับการอัปเดต tracking number โดย donor
const updatePledgeTrackingSchema = Joi.object({
    courier_company_name: Joi.string().max(100).required(),
    tracking_number: Joi.string().max(100).required(),
});

const rejectPledgeByFoundationSchema = Joi.object({
  rejection_reason_by_foundation: Joi.string().required(),
});

const confirmReceiptByFoundationSchema = Joi.object({
  // quantity_received_actual: Joi.number().integer().positive().allow(null), // อาจจะรับจำนวนจริงที่ได้
  // issue_notes: Joi.string().allow(null, ''), // ถ้ามีปัญหา
  // ตอนนี้ให้ confirm receipt ง่ายๆ ก่อน
});

module.exports = {
  createDonationPledgeSchema,
  updatePledgeTrackingSchema,
  rejectPledgeByFoundationSchema,
  confirmReceiptByFoundationSchema,
}; 