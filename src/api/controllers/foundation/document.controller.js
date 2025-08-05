const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');
const { uploadToSupabaseStorage } = require('../../../services/file-upload.service');

// POST /api/foundation/documents
const uploadFoundationDocument = asyncHandler(async (req, res) => {
  const foundationAdminUserId = req.user.user_id; // foundation_id
  const { document_name, document_url } = req.validatedData; // URL can come from client or server upload

  // Verify foundation profile exists for this admin
  const { data: foundation, error: foundationCheckError } = await supabase
    .from('foundations')
    .select('foundation_id')
    .eq('foundation_id', foundationAdminUserId)
    .single();

  if (foundationCheckError || !foundation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Foundation profile not found. Please create a profile before uploading documents.');
  }

  // Handle document file upload if file is provided
  let finalDocumentUrl = document_url;
  if (req.file) {
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
      console.error('Error uploading foundation document:', uploadError);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload document file');
    }
  }

  // Validate that either file is uploaded or URL is provided
  if (!req.file && !document_url) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Either upload a document file or provide a document URL');
  }

  const documentToInsert = {
    foundation_id: foundationAdminUserId,
    document_name,
    document_url: finalDocumentUrl, // Use the URL from server upload or client
    verification_status_by_admin: 'pending_review', // Default status
  };

  const { data: newDocument, error: insertError } = await supabase
    .from('foundation_documents')
    .insert(documentToInsert)
    .select()
    .single();

  if (insertError) {
    console.error("Error uploading foundation document record:", insertError);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to record document: ${insertError.message}`);
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

  // Optional: Delete file from Supabase Storage first if you manage it server-side.
  // For now, we only delete the DB record. Client should manage storage deletion if they uploaded.

  const { data: deletedDoc, error } = await supabase
    .from('foundation_documents')
    .delete()
    .eq('document_id', documentId)
    .eq('foundation_id', foundationAdminUserId) // Ensure they only delete their own
    .select()
    .single();

  if (error && error.code !== 'PGRST116' /* No rows found */) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to delete document: ${error.message}`);
  }
  if (!deletedDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Document not found or you do not have permission to delete it.');
  }


  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      deletedDoc, // or null
      'Foundation document deleted successfully.'
    )
  );
});

module.exports = {
  uploadFoundationDocument,
  getMyFoundationDocuments,
  deleteMyFoundationDocument,
}; 