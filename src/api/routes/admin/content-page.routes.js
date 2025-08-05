const express = require('express');
const contentPageController = require('../../controllers/admin/content-page.controller'); // This is the admin controller
const { protectRoute, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const contentPageValidator = require('../../validators/content-page.validator');

const router = express.Router();
router.use(protectRoute, authorize('system_admin'));

router.post('/', validate(contentPageValidator.systemContentPageSchema), contentPageController.createContentPage);
router.get('/', contentPageController.listContentPagesForAdmin);
router.get('/:pageIdOrSlug', contentPageController.getContentPageForAdmin);
router.put('/:pageIdOrSlug', validate(contentPageValidator.updateSystemContentPageSchema), contentPageController.updateContentPage);
router.delete('/:pageIdOrSlug', contentPageController.deleteContentPage);

module.exports = router; 