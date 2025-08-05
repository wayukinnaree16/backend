const Joi = require('joi');

const manageFavoriteSchema = Joi.object({
  foundation_id: Joi.number().integer().positive().required(),
});

module.exports = {
  manageFavoriteSchema,
}; 