const express = require('express');
const adminUserController = require('../../controllers/admin/user.controller');
const { protectRoute, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const adminValidator = require('../../validators/admin.validator');

const router = express.Router();

// All admin routes require system_admin role
router.use(protectRoute, authorize('system_admin'));

router.get('/', adminUserController.listUsers);
router.get('/:userId', adminUserController.getUserDetails);
router.patch(
    '/:userId/status',
    validate(adminValidator.updateUserAccountStatusSchema),
    adminUserController.updateUserAccountStatus
);
router.patch(
    '/:userId/ban',
    validate(adminValidator.banUserSchema),
    adminUserController.banUser
);
router.patch(
    '/:userId/unban',
    validate(adminValidator.unbanUserSchema),
    adminUserController.unbanUser
);
router.patch('/:userId/reset-status', adminUserController.resetUserStatus);
// Add other admin user management routes (e.g., create user, reset password trigger) if needed

module.exports = router; 