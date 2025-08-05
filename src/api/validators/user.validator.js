const Joi = require('joi');

const updateUserProfile = {
  body: Joi.object().keys({
    first_name: Joi.string(),
    last_name: Joi.string(),
    phone_number: Joi.string().allow(null, ''),
    profile_image_url: Joi.string().uri().allow(null, ''),
  }).min(1),
};

const changePasswordLoggedIn = {
  body: Joi.object().keys({
    current_password: Joi.string().required(),
    new_password: Joi.string().min(6).required(),
  }),
};

module.exports = {
  updateUserProfile,
  changePasswordLoggedIn
}; 