const express = require('express');
const userController = require('../controllers/user.controller');
const { protectRoute } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const userValidator = require('../validators/user.validator');
const { uploadProfileImage } = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/me', protectRoute, userController.getMyProfile);
router.put('/me', protectRoute, uploadProfileImage, validate(userValidator.updateUserProfile), userController.updateUserProfile);
router.put('/me/change-password', protectRoute, validate(userValidator.changePasswordLoggedIn), userController.changePasswordLoggedInUser);

module.exports = router; 