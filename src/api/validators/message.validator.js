const Joi = require('joi');

const createInternalMessageSchema = Joi.object({
  recipient_id: Joi.number().integer().positive().required(),
  content: Joi.string().required(),
  pledge_id: Joi.number().integer().positive().allow(null), // Optional, if message relates to a pledge
});

module.exports = {
  createInternalMessageSchema,
}; 