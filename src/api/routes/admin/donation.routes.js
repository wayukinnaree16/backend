const express = require('express');
const router = express.Router();
const donationController = require('../../controllers/admin/donation.controller');

router.get('/statistics', donationController.getDonationStatistics);
router.get('/items', donationController.getAllDonatedItems);
router.patch('/items/:id/status', donationController.updateDonatedItemStatus);

module.exports = router;
