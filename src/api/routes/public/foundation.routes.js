const express = require('express');
const foundationPublicController = require('../../controllers/public/foundation.controller');
const validate = require('../../middlewares/validate.middleware'); // อาจจะใช้สำหรับ query params
const foundationValidator = require('../../validators/foundation.validator');

const router = express.Router();

// ต้องใส่ /types ก่อน /:foundationId เพื่อไม่ให้ /types ถูกเข้าใจว่าเป็น foundationId
router.get('/types', foundationPublicController.listFoundationTypes);

router.get(
    '/',
    // validate({ query: foundationValidator.publicFoundationQuery }), // << เพิ่ม validation สำหรับ query params
    foundationPublicController.listPublicFoundations
);

router.get('/:foundationId', foundationPublicController.getPublicFoundationById);

module.exports = router; 