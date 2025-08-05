const express = require('express');
const pledgeController = require('../../controllers/donor/pledge.controller');
const { protectRoute, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const pledgeValidator = require('../../validators/pledge.validator');
const reviewDonorController = require('../../controllers/donor/review.controller');
const reviewValidator = require('../../validators/review.validator');
const { uploadPledgeImages } = require('../../middlewares/upload.middleware');

const router = express.Router();

// All routes in this file require user to be logged in and be a 'donor'
router.use(protectRoute, authorize('donor'));

router.post(
    '/',
    uploadPledgeImages,
    validate(pledgeValidator.createDonationPledgeSchema),
    pledgeController.createDonationPledge
);

router.get('/', pledgeController.getMyDonationPledges);
router.get('/:pledgeId', pledgeController.getMyDonationPledgeDetails);
router.patch('/:pledgeId/cancel', pledgeController.cancelMyPledge);
router.patch(
    '/:pledgeId/tracking',
    validate(pledgeValidator.updatePledgeTrackingSchema),
    pledgeController.updatePledgeTrackingInfo
);

router.post(
    '/:pledgeId/reviews',
    validate(reviewValidator.createReviewSchema),
    reviewDonorController.submitReviewForPledge
);

module.exports = router; 