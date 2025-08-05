const Joi = require('joi');

const createReviewSchema = Joi.object({
  // pledge_id will come from URL param
  // donor_id, foundation_id will be derived
  rating_score: Joi.number().integer().min(1).max(5).required(),
  comment_text: Joi.string().allow(null, ''),
});

const adminReviewActionSchema = Joi.object({
    // is_approved_by_admin: Joi.boolean().required(), // This will be part of the route path usually (approve/reject)
    admin_review_remarks: Joi.string().allow(null, ''), // Remarks for approve/reject
});


module.exports = {
  createReviewSchema,
  adminReviewActionSchema,
}; 