const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');

// GET /api/admin/foundations/pending-verification
const listPendingVerificationFoundations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Find users who are 'foundation_admin' and 'pending_verification'
  // Then join with 'foundations' table
  let query = supabase
    .from('foundations')
    .select(`
        *,
        user:users!foundation_id (user_id, email, first_name, last_name, account_status, created_at)
    `, { count: 'exact' })
    .eq('user.user_type', 'foundation_admin')
    .eq('user.account_status', 'pending_verification')
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
  const adminUserId = req.user.user_id; // System Admin performing the action
  const { foundationId } = req.params; // This is the user_id of the foundation admin
  // const { verification_notes } = req.validatedData; // Optional notes

  // 1. Update User's account_status
  const { data: updatedUser, error: userUpdateError } = await supabase
    .from('users')
    .update({ account_status: 'active' })
    .eq('user_id', foundationId)
    .eq('user_type', 'foundation_admin') // Ensure it's a foundation admin
    .eq('account_status', 'pending_verification') // Ensure it was pending
    .select('user_id, account_status')
    .single();

  if (userUpdateError || !updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, `Foundation account ${foundationId} not found, not pending, or failed to update user status.`);
  }

  // 2. Update Foundation's verification details
  const { data: updatedFoundation, error: foundationUpdateError } = await supabase
    .from('foundations')
    .update({
      verified_at: new Date().toISOString(),
      verified_by_admin_id: adminUserId,
      verification_notes: req.body.verification_notes || null, // Get notes from raw body if not using validator for this
    })
    .eq('foundation_id', foundationId) // foundation_id is user_id
    .select()
    .single();

  if (foundationUpdateError || !updatedFoundation) {
    // Rollback user status update if possible, or log inconsistency
    console.error(`CRITICAL: User ${foundationId} status set to active, but foundation verification details failed to update.`);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User status updated, but failed to finalize foundation verification details.');
  }

  // TODO: Log admin action
  // TODO: Notify Foundation Admin

  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { updatedUser, updatedFoundation }, 'Foundation account approved and verified.'));
});

// PATCH /api/admin/foundations/:foundationId/reject-account
const rejectFoundationAccount = asyncHandler(async (req, res) => {
  const adminUserId = req.user.user_id;
  const { foundationId } = req.params;
  const { verification_notes } = req.validatedData; // Reason for rejection

   // 1. Update User's account_status to 'inactive' or 'rejected_verification' (if you add such status)
  const { data: updatedUser, error: userUpdateError } = await supabase
    .from('users')
    .update({ account_status: 'inactive' }) // Or a specific 'rejected' status
    .eq('user_id', foundationId)
    .eq('user_type', 'foundation_admin')
    .eq('account_status', 'pending_verification')
    .select('user_id, account_status')
    .single();

  if (userUpdateError || !updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, `Foundation account ${foundationId} not found, not pending, or failed to update user status for rejection.`);
  }

  // 2. Update Foundation's verification_notes
  const { data: updatedFoundation, error: foundationUpdateError } = await supabase
    .from('foundations')
    .update({
      verified_at: null, // Ensure not verified
      verified_by_admin_id: adminUserId,
      verification_notes: verification_notes,
    })
    .eq('foundation_id', foundationId)
    .select()
    .single();

  if (foundationUpdateError && !updatedFoundation) { // If no foundation profile exists yet, that's okay for rejection of user
      console.warn(`User ${foundationId} rejected, but no existing foundation profile to update notes on. This might be normal if profile is created after verification.`);
  } else if (foundationUpdateError) {
      console.error(`User ${foundationId} rejected, but failed to update foundation verification notes.`);
  }


  // TODO: Log admin action
  // TODO: Notify Foundation Admin about rejection and reason

  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { updatedUser }, 'Foundation account registration rejected.'));
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
  const { data: foundation, error } = await supabase
    .from('foundations')
    .select('*')
    .eq('foundation_id', foundationId)
    .single();

  if (error || !foundation) {
    throw new ApiError(httpStatus.NOT_FOUND, `Foundation with ID ${foundationId} not found.`);
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, foundation, 'Foundation details retrieved successfully')
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