const express = require('express');
const router = express.Router();
const foundationTypeController = require('../../controllers/admin/foundation-type.controller');

router.get('/', foundationTypeController.getAllFoundationTypes);
router.get('/:id', foundationTypeController.getFoundationType);
router.post('/', foundationTypeController.addFoundationType);
router.put('/:id', foundationTypeController.editFoundationType);
router.delete('/:id', foundationTypeController.removeFoundationType);

module.exports = router;