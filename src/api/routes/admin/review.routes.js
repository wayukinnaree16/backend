const express = require('express');
const adminReviewController = require('../../controllers/admin/review.controller');
const { protectRoute, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const reviewValidator = require('../../validators/review.validator');

const router = express.Router();
router.use(protectRoute, authorize('system_admin'));

router.get('/pending-approval', adminReviewController.listPendingReviews);
router.patch(
    '/:reviewId/approve',
    validate(reviewValidator.adminReviewActionSchema), // Or no validation if no body needed
    adminReviewController.approveReview
);
router.patch(
    '/:reviewId/reject',
    validate(reviewValidator.adminReviewActionSchema), // Body should contain admin_review_remarks
    adminReviewController.rejectReview
);

module.exports = router; 