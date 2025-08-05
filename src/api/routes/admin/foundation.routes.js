const express = require('express');
const adminFoundationController = require('../../controllers/admin/foundation.controller');
const { protectRoute, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const adminValidator = require('../../validators/admin.validator');
const documentValidator = require('../../validators/document.validator');


const router = express.Router();
router.use(protectRoute, authorize('system_admin'));

router.get('/pending-verification', adminFoundationController.listPendingVerificationFoundations);
router.patch(
    '/:foundationId/approve-account',
    // validate(adminValidator.verifyFoundationAccountSchema), // Use if body has fields
    adminFoundationController.approveFoundationAccount
);
router.patch(
    '/:foundationId/reject-account',
    validate(adminValidator.rejectFoundationAccountSchema),
    adminFoundationController.rejectFoundationAccount
);

// Routes for admin to manage/review foundation documents
router.get('/:foundationId/documents', adminFoundationController.getFoundationDocumentsForReview);
router.patch(
    '/documents/:documentId/review',
    validate(documentValidator.reviewFoundationDocumentSchema),
    adminFoundationController.reviewFoundationDocument
);

// GET /api/admin/foundations
router.get('/', adminFoundationController.listFoundations);

router.get('/:foundationId', adminFoundationController.getFoundationDetails);

module.exports = router; 