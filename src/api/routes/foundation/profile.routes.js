const express = require('express');
const profileController = require('../../controllers/foundation/profile.controller');
const { protectRoute, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { uploadGeneralImage } = require('../../middlewares/upload.middleware');
const foundationValidator = require('../../validators/foundation.validator');

const router = express.Router();

// Middleware: ต้อง login และเป็น foundation_admin เท่านั้น
router.use(protectRoute, authorize('foundation_admin'));

router.get('/me', profileController.getMyFoundationProfile);

// ส่ง schema โดยตรง ไม่ต้องครอบด้วย object
router.put(
    '/me',
    uploadGeneralImage, // Add this middleware to handle file uploads
    validate(foundationValidator.createOrUpdateFoundationProfile),
    profileController.upsertMyFoundationProfile
);

module.exports = router;