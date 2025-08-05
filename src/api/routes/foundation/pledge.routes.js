const express = require('express');
const pledgeFoundationController = require('../../controllers/foundation/pledge.controller');
const { protectRoute, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const pledgeValidator = require('../../validators/pledge.validator');

const router = express.Router();

// All routes for foundation managing pledges
router.use(protectRoute, authorize('foundation_admin'));

router.get('/received', pledgeFoundationController.getReceivedPledges);
router.patch('/:pledgeId/approve', pledgeFoundationController.approvePledge);
router.patch(
    '/:pledgeId/reject',
    validate(pledgeValidator.rejectPledgeByFoundationSchema),
    pledgeFoundationController.rejectPledge
);
router.patch(
    '/:pledgeId/confirm-receipt',
    // validate(pledgeValidator.confirmReceiptByFoundationSchema), // Add if schema has fields
    pledgeFoundationController.confirmPledgeReceipt
);

module.exports = router; 