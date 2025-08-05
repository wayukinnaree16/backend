const express = require('express');
const documentController = require('../../controllers/foundation/document.controller');
const { protectRoute, authorize } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
documentValidator = require('../../validators/document.validator');
const { uploadFoundationDocument } = require('../../middlewares/upload.middleware');

const router = express.Router();

router.use(protectRoute, authorize('foundation_admin'));

router.post(
    '/',
    uploadFoundationDocument,
    validate(documentValidator.createFoundationDocumentSchema),
    documentController.uploadFoundationDocument
);
router.get('/', documentController.getMyFoundationDocuments);
router.delete('/:documentId', documentController.deleteMyFoundationDocument);

module.exports = router; 