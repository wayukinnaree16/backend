const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const authValidator = require('../validators/auth.validator');
const { protectRoute } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', validate(authValidator.register), authController.registerUser);
router.post('/login', validate(authValidator.login), authController.loginUser);
router.post('/logout', protectRoute, authController.logoutUser);
router.post('/request-password-reset', validate(authValidator.requestPasswordReset), authController.requestPasswordReset);
router.post('/update-password', validate(authValidator.updatePassword), protectRoute, authController.updateUserPasswordAfterReset);
router.post('/forgot-password', validate(authValidator.requestPasswordReset), authController.forgotPassword);
router.post('/force-reset-password', authController.updatePasswordNoVerify);

module.exports = router; 