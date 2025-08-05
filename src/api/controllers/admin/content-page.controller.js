const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');

// POST /api/admin/content-pages
const createContentPage = asyncHandler(async (req, res) => {
  const adminUserId = req.user.user_id;
  const { slug, title, body_content_html, meta_description } = req.validatedData;

  // Check if slug already exists
  const { data: existingPage, error: checkError } = await supabase
    .from('system_content_pages')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle(); // Use maybeSingle to get null if not found, instead of error

  if (checkError && checkError.code !== 'PGRST116') {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error checking slug: ${checkError.message}`);
  }
  if (existingPage) {
    throw new ApiError(httpStatus.CONFLICT, `Content page with slug '${slug}' already exists.`);
  }

  const pageToInsert = {
    slug,
    title,
    body_content_html,
    meta_description,
    last_updated_by_admin_id: adminUserId,
  };

  const { data: newPage, error: insertError } = await supabase
    .from('system_content_pages')
    .insert(pageToInsert)
    .select()
    .single();

  if (insertError) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to create content page: ${insertError.message}`);
  }

  res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, newPage, 'Content page created.'));
});

// GET /api/admin/content-pages (List all for admin)
const listContentPagesForAdmin = asyncHandler(async (req, res) => {
    const { data: pages, error } = await supabase
        .from('system_content_pages')
        .select('page_id, slug, title, updated_at, last_updated_by_admin_id') // Select summary
        .order('updated_at', { ascending: false });

    if (error) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to list content pages: ${error.message}`);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, pages, 'Content pages listed.'));
});


// GET /api/admin/content-pages/:pageIdOrSlug (Admin get specific page by ID or Slug)
const getContentPageForAdmin = asyncHandler(async (req, res) => {
  const { pageIdOrSlug } = req.params;
  let query = supabase.from('system_content_pages').select('*');

  if (isNaN(parseInt(pageIdOrSlug, 10))) { // If it's not a number, assume it's a slug
    query = query.eq('slug', pageIdOrSlug);
  } else {
    query = query.eq('page_id', parseInt(pageIdOrSlug, 10));
  }

  const { data: page, error } = await query.single();

  if (error || !page) throw new ApiError(httpStatus.NOT_FOUND, 'Content page not found.');
  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, page, 'Content page retrieved.'));
});

// PUT /api/admin/content-pages/:pageIdOrSlug
const updateContentPage = asyncHandler(async (req, res) => {
  const adminUserId = req.user.user_id;
  const { pageIdOrSlug } = req.params;
  const updateData = req.validatedData;

  if (Object.keys(updateData).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json(new ApiError(httpStatus.BAD_REQUEST, "No data provided for update."));
  }

  const dataToUpdate = {
    ...updateData,
    last_updated_by_admin_id: adminUserId,
    updated_at: new Date().toISOString(), // ใช้ updated_at ให้ตรงกับฐานข้อมูล
  };

  let query = supabase.from('system_content_pages').update(dataToUpdate);
  if (isNaN(parseInt(pageIdOrSlug, 10))) {
    query = query.eq('slug', pageIdOrSlug);
  } else {
    query = query.eq('page_id', parseInt(pageIdOrSlug, 10));
  }

  const { error } = await query;
  if (error) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to update content page: ${error.message}`);

  // ดึงข้อมูลล่าสุดหลังอัปเดต
  let getQuery = supabase.from('system_content_pages').select('*');
  if (isNaN(parseInt(pageIdOrSlug, 10))) {
    getQuery = getQuery.eq('slug', pageIdOrSlug);
  } else {
    getQuery = getQuery.eq('page_id', parseInt(pageIdOrSlug, 10));
  }
  const { data: updatedPage, error: getError } = await getQuery.single();
  if (getError || !updatedPage) throw new ApiError(httpStatus.NOT_FOUND, 'Content page not found after update.');

  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, updatedPage, 'Content page updated.'));
});

// DELETE /api/admin/content-pages/:pageIdOrSlug
const deleteContentPage = asyncHandler(async (req, res) => {
  const { pageIdOrSlug } = req.params;
  let query = supabase.from('system_content_pages').delete();

  if (isNaN(parseInt(pageIdOrSlug, 10))) {
    query = query.eq('slug', pageIdOrSlug);
  } else {
    query = query.eq('page_id', parseInt(pageIdOrSlug, 10));
  }

  const { data: deletedPage, error } = await query.select().single(); // Check if a row was deleted

  if (error && error.code !== 'PGRST116') throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to delete content page: ${error.message}`);
  if (!deletedPage && (error && error.code === 'PGRST116')) throw new ApiError(httpStatus.NOT_FOUND, 'Content page not found.');

  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, deletedPage, 'Content page deleted.'));
});

// --- PUBLIC ACCESS ---
// GET /api/public/content-pages/:slugOrId (Public view)
const getPublicContentPage = asyncHandler(async (req, res) => {
    const { slug: slugOrId } = req.params;
    let query = supabase.from('system_content_pages').select('slug, title, body_content_html, updated_at, meta_description');
    if (isNaN(parseInt(slugOrId, 10))) {
        query = query.eq('slug', slugOrId);
    } else {
        query = query.eq('page_id', parseInt(slugOrId, 10));
    }
    const { data: page, error } = await query.single();
    if (error || !page) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Content page not found.');
    }
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, page, 'Content page retrieved.'));
});


module.exports = {
  createContentPage,
  listContentPagesForAdmin,
  getContentPageForAdmin,
  updateContentPage,
  deleteContentPage,
  getPublicContentPage, // Export for public route
}; 