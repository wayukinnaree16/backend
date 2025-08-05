const Joi = require('joi');

const updateUserAccountStatusSchema = Joi.object({
  account_status: Joi.string().valid('pending_verification', 'active', 'inactive', 'suspended', 'banned').required(),
  reason: Joi.string().allow(null, ''), // Optional reason, maybe required for suspend/ban
});

const verifyFoundationAccountSchema = Joi.object({
  // No body needed for approve if it's a simple action
  // For reject:
  verification_notes: Joi.string().allow(null, ''), // Optional notes from admin
});

const rejectFoundationAccountSchema = Joi.object({
    verification_notes: Joi.string().required(), // Reason for rejection
});

const banUserSchema = {
    body: {
        ban_reason: Joi.string().required().messages({
            'any.required': 'ban_reason is required',
            'string.empty': 'ban_reason cannot be empty'
        })
    }
};

const unbanUserSchema = {
    body: {
        unban_reason: Joi.string().optional().allow('', null).messages({
            'string.empty': 'unban_reason cannot be empty if provided'
        })
    }
};

module.exports = {
  updateUserAccountStatusSchema,
  verifyFoundationAccountSchema, // Might not be used if approve has no body
  rejectFoundationAccountSchema,
  banUserSchema,
  unbanUserSchema,
}; 