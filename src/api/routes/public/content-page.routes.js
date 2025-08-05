const express = require('express');
const router = express.Router();
const contentPageController = require('../../controllers/admin/content-page.controller');

// Public route: ไม่ต้องใช้ protectRoute หรือ authorize
router.get('/:slug', contentPageController.getPublicContentPage);

module.exports = router; 