const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');
const { uploadToSupabaseStorage } = require('../../../services/file-upload.service');

// POST /api/foundation/documents
const uploadFoundationDocument = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id;
  const { document_name, document_type } = req.validatedData;

  // Check if foundation profile exists
  const { data: foundation, error: foundationCheckError } = await supabase
    .from('foundations')
    .select('foundation_id')
    .eq('foundation_id', foundationAdminUserId)
    .single();

  if (foundationCheckError || !foundation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Foundation profile not found. Please create a profile before uploading documents.');
  }

  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Document file is required.');
  }

  let finalDocumentUrl;
  try {
    const bucketName = 'foundation-documents';
    const uploadedDocumentUrl = await uploadToSupabaseStorage(
      req.file.buffer,
      req.file.originalname,
      bucketName,
      `foundation_${foundationAdminUserId}`
    );
    finalDocumentUrl = uploadedDocumentUrl;
  } catch (uploadError) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to upload document: ${uploadError.message}`);
  }

  // Save document record to database
  const { data: newDocument, error: insertError } = await supabase
    .from('foundation_documents')
    .insert({
        foundation_id: foundationAdminUserId,
        document_name,
        document_type,
        document_url: finalDocumentUrl,
        verification_status_by_admin: 'pending_review'
      })
    .select()
    .single();

  if (insertError) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to save document record: ${insertError.message}`);
  }

  res.status(httpStatus.CREATED).json(
    new ApiResponse(
      httpStatus.CREATED,
      newDocument,
      'Foundation document uploaded successfully and awaiting review.'
    )
  );
});

// GET /api/foundation/documents
const getMyFoundationDocuments = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id;

  const { data: documents, error } = await supabase
    .from('foundation_documents')
    .select('*')
    .eq('foundation_id', foundationAdminUserId)
    .order('upload_date', { ascending: false });

  if (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to retrieve documents: ${error.message}`);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      documents,
      'Foundation documents retrieved successfully.'
    )
  );
});

// DELETE /api/foundation/documents/:documentId
const deleteMyFoundationDocument = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id;
  const { documentId } = req.params;

  const { data: deletedDocument, error } = await supabase
    .from('foundation_documents')
    .delete()
    .eq('document_id', documentId)
    .eq('foundation_id', foundationAdminUserId)
    .select()
    .single();

  if (error || !deletedDocument) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document not found or you do not have permission to delete it.');
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      deletedDocument,
      'Foundation document deleted successfully.'
    )
  );
});

module.exports = {
  uploadFoundationDocument,
  getMyFoundationDocuments,
  deleteMyFoundationDocument,
};
