const Joi = require('joi');

const register = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  phone_number: Joi.string().max(20).allow(null, ''),
  profile_image_url: Joi.string().max(255).allow(null, ''),
  user_type: Joi.string().valid('donor', 'foundation_admin', 'system_admin').required()
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const requestPasswordReset = Joi.object({
  email: Joi.string().email().required()
});

const updatePassword = Joi.object({
  new_password: Joi.string().min(6).required()
});

const updateProfile = Joi.object({
  first_name: Joi.string().max(100),
  last_name: Joi.string().max(100),
  phone_number: Joi.string().max(20).allow(null, ''),
  profile_image_url: Joi.string().max(255).allow(null, '')
});

module.exports = {
  register,
  login,
  requestPasswordReset,
  updatePassword,
  updateProfile
}; 