const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');

// GET /api/admin/foundations/pending-verification
const listPendingVerificationFoundations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Find foundations with 'pending_verification' status
  // Then join with 'users' table for foundation admin details
  let query = supabase
    .from('foundations')
    .select(`
        *,
        user:users!foundation_id (user_id, email, first_name, last_name, created_at)
    `, { count: 'exact' })
    .eq('user.user_type', 'foundation_admin')
    .eq('foundation_status', 'pending_verification')
    .order('created_at', { ascending: true });

  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  query = query.range(startIndex, startIndex + parseInt(limit, 10) - 1);

  const { data: foundations, error, count } = await query;

  if (error) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to list pending foundations: ${error.message}`);

  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, {
        foundations,
        pagination: {
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil((count || 0) / parseInt(limit, 10)),
            totalItems: count || 0,
            itemsPerPage: parseInt(limit, 10),
        }
    }, 'Foundations pending verification listed.')
  );
});

// GET /api/admin/foundations
const listFoundations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  let query = supabase
    .from('foundations')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  query = query.range(startIndex, startIndex + parseInt(limit, 10) - 1);

  const { data: foundations, error, count } = await query;
  if (error) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to list foundations: ${error.message}`);

  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, {
      foundations,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil((count || 0) / parseInt(limit, 10)),
        totalItems: count || 0,
        itemsPerPage: parseInt(limit, 10),
      }
    }, 'Foundations listed successfully')
  );
});

// GET /api/admin/foundations/:foundationId/documents (Admin views documents for a specific foundation)
const getFoundationDocumentsForReview = asyncHandler(async (req, res) => {
    const { foundationId } = req.params; // This is user_id of the foundation admin

    const { data: documents, error } = await supabase
        .from('foundation_documents')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('upload_date', { ascending: false });

    if (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to retrieve documents for foundation ${foundationId}: ${error.message}`);
    }

    res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, documents, `Documents for foundation ${foundationId} retrieved.`)
    );
});

// PATCH /api/admin/foundations/:foundationId/approve-account
const approveFoundationAccount = asyncHandler(async (req, res) => {
  const adminUserId = req.user.user_id;
  const { foundationId } = req.params; // This is the foundation_id from the URL

  // 1. Get the foundation details to check current status
  const { data: foundationData, error: fetchFoundationError } = await supabase
    .from('foundations')
    .select(`
      foundation_id,
      foundation_status,
      user:users!foundation_id (user_id, user_type)
    `)
    .eq('foundation_id', foundationId)
    .single();

  if (fetchFoundationError || !foundationData || !foundationData.user || foundationData.user.user_type !== 'foundation_admin') {
    throw new ApiError(httpStatus.NOT_FOUND, `Foundation with ID ${foundationId} not found or associated user is not a foundation admin.`);
  }

  console.log(`Foundation ${foundationId} current status: ${foundationData.foundation_status}`); // Debug log

  // 2. Update Foundation's status to 'active'
  const { data: updatedFoundation, error: foundationUpdateError } = await supabase
    .from('foundations')
    .update({
      foundation_status: 'active',
      verified_at: new Date().toISOString(),
      verified_by_admin_id: adminUserId,
      verification_notes: req.body.verification_notes || null,
    })
    .eq('foundation_id', foundationId)
    .eq('foundation_status', 'pending_verification') // Only update if currently pending
    .select()
    .single();

  if (foundationUpdateError || !updatedFoundation) {
    throw new ApiError(httpStatus.NOT_FOUND, `Foundation ${foundationId} not found, not pending verification, or failed to update status.`);
  }

  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { updatedFoundation }, 'Foundation account approved and verified.'));
});

// PATCH /api/admin/foundations/:foundationId/reject-account
const rejectFoundationAccount = asyncHandler(async (req, res) => {
  const adminUserId = req.user.user_id;
  const { foundationId } = req.params;
  const { rejection_reason } = req.body;

  // 1. Get the foundation details to check current status
  const { data: foundationData, error: fetchFoundationError } = await supabase
    .from('foundations')
    .select(`
      foundation_id,
      foundation_status,
      user:users!foundation_id (user_id, user_type)
    `)
    .eq('foundation_id', foundationId)
    .single();

  if (fetchFoundationError || !foundationData || !foundationData.user || foundationData.user.user_type !== 'foundation_admin') {
    throw new ApiError(httpStatus.NOT_FOUND, `Foundation with ID ${foundationId} not found or associated user is not a foundation admin.`);
  }

  console.log(`Foundation ${foundationId} current status: ${foundationData.foundation_status}`); // Debug log

  // 2. Update Foundation's status to 'rejected'
  const { data: updatedFoundation, error: foundationUpdateError } = await supabase
    .from('foundations')
    .update({
      foundation_status: 'rejected',
      verified_at: null, // Ensure not verified
      rejected_at: new Date().toISOString(), // Set rejection timestamp
      verified_by_admin_id: adminUserId,
      rejection_reason: rejection_reason, // Use the provided rejection reason
    })
    .eq('foundation_id', foundationId)
    .eq('foundation_status', 'pending_verification') // Only update if currently pending
    .select()
    .single();

  if (foundationUpdateError || !updatedFoundation) {
    throw new ApiError(httpStatus.NOT_FOUND, `Foundation ${foundationId} not found, not pending verification, or failed to update status.`);
  }

  // TODO: Log admin action
  // TODO: Notify Foundation Admin about rejection and reason

  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { updatedFoundation }, 'Foundation account registration rejected.'));
});

// PATCH /api/admin/foundations/documents/:documentId/review (Admin reviews a specific document)
const reviewFoundationDocument = asyncHandler(async (req, res) => {
    const { documentId } = req.params;
    const { verification_status_by_admin, admin_remarks } = req.validatedData;
    const adminUserId = req.user.user_id;

    const { data: updatedDocument, error } = await supabase
        .from('foundation_documents')
        .update({
            verification_status_by_admin,
            admin_remarks,
            // admin_reviewed_at: new Date().toISOString(), // Could add a field for this
        })
        .eq('document_id', documentId)
        .select()
        .single();

    if (error || !updatedDocument) {
        throw new ApiError(httpStatus.NOT_FOUND, `Document with ID ${documentId} not found or failed to update.`);
    }

    // TODO: Notify foundation admin about document review status
    // TODO: Log admin action

    res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, updatedDocument, `Document ${documentId} status updated to ${verification_status_by_admin}.`)
    );
});

// GET /api/admin/foundations/:foundationId
const getFoundationDetails = asyncHandler(async (req, res) => {
  const { foundationId } = req.params;
  // Select foundation details and join with the users table to get the associated user_id
  const { data: foundation, error } = await supabase
    .from('foundations')
    .select(`
      *,
      user:users!foundation_id (user_id, email)
    `) // Select all foundation fields and the user_id from the linked user
    .eq('foundation_id', foundationId)
    .single();

  console.log('Foundation ID:', foundationId);
  console.log('Supabase Error:', error);
  console.log('Foundation Data:', foundation);

  if (error || !foundation) {
    throw new ApiError(httpStatus.NOT_FOUND, `Foundation with ID ${foundationId} not found.`);
  }

  // The user object will be nested, extract user_id if available
  const foundationWithUserId = {
    ...foundation,
    user_id: foundation.user ? foundation.user.user_id : null,
    admin_user_id: foundation.user ? foundation.user.user_id : null, // For backward compatibility if frontend uses admin_user_id
  };

  // Remove the nested user object to flatten the structure if desired, or keep it
  delete foundationWithUserId.user;

  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, foundationWithUserId, 'Foundation details retrieved successfully')
  );
});

module.exports = {
  listPendingVerificationFoundations,
  getFoundationDocumentsForReview,
  approveFoundationAccount,
  rejectFoundationAccount,
  reviewFoundationDocument,
  listFoundations,
  getFoundationDetails,
};
