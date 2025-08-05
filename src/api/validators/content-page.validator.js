const Joi = require('joi');

const systemContentPageSchema = Joi.object({
  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/, 'slug')
    .max(100)
    .required()
    .messages({
      'string.pattern.name': 'Slug must be lowercase, contain only letters, numbers, and hyphens.'
    }), // e.g., about-us, faq-donors
  title: Joi.string().max(255).required(),
  body_content_html: Joi.string().required(),
  meta_description: Joi.string().max(255),
});

const updateSystemContentPageSchema = Joi.object({
  title: Joi.string().max(255),
  body_content_html: Joi.string(),
  meta_description: Joi.string().max(255),
  // Slug typically should not be updatable easily after creation
}).min(1);

module.exports = {
  systemContentPageSchema,
  updateSystemContentPageSchema,
}; 