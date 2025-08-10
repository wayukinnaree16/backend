const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');

// GET /api/public/foundations
const listPublicFoundations = async (req, res) => {
  try {
    console.log('Starting listPublicFoundations...');
    const {
      page = 1,
      limit = 10,
      name,
      province,
      type_id,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Debug: Log query parameters
    console.log('Query parameters:', {
      page,
      limit,
      name,
      province,
      type_id,
      sort_by,
      sort_order
    });

    // Check foundations table first
    const { data: foundationsCheck, error: foundationsError } = await supabase
      .from('foundations')
      .select('*');

    console.log('Foundations check:', {
      count: foundationsCheck?.length || 0,
      error: foundationsError,
      sample: foundationsCheck?.[0]
    });

    // If no foundations exist, create sample data
    if (!foundationsCheck || foundationsCheck.length === 0) {
      console.log('No foundations found, creating sample data...');
      await initializeSampleFoundations();
    }

    // Check users table
    const { data: usersCheck, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('user_type', 'foundation_admin');

    console.log('Users check:', {
      count: usersCheck?.length || 0,
      error: usersError,
      sample: usersCheck?.[0]
    });

    // Build the query
    let query = supabase
      .from('foundations')
      .select(`
        *,
        foundation_types (
          type_id,
          name,
          description
        )
      `, { count: 'exact' })
      .not('verified_at', 'is', null);

    // Apply filters
    if (name) {
      query = query.ilike('foundation_name', `%${name}%`);
    }
    if (province) {
      query = query.ilike('province', `%${province}%`);
    }
    if (type_id) {
      query = query.eq('foundation_type_id', type_id);
    }

    // Add sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Add pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data: foundations, error, count } = await query;

    if (error) {
      console.error('Error fetching foundations:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error fetching foundations',
        error: error.message
      });
    }

    // Debug: Log results
    console.log('Query results:', {
      foundationsCount: count,
      foundationsFound: foundations?.length || 0,
      sample: foundations?.[0]
    });

    return res.status(200).json({
      statusCode: 200,
      data: {
        foundations: foundations.map(foundation => ({
          foundation_id: foundation.foundation_id,
          foundation_name: foundation.foundation_name,
          logo_url: foundation.logo_url,
          city: foundation.city,
          province: foundation.province,
          verified_at: foundation.verified_at,
          foundation_type: {
            type_id: foundation.foundation_types.type_id,
            name: foundation.foundation_types.name
          },
          // Include other fields as needed
          ...foundation
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil((count || 0) / limit),
          totalItems: count || 0,
          itemsPerPage: parseInt(limit)
        }
      },
      message: 'Foundations listed successfully',
      success: true
    });
  } catch (error) {
    console.error('Error in listPublicFoundations:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// GET /api/public/foundations/:foundationId
const getPublicFoundationDetails = asyncHandler(async (req, res) => {
  const { foundationId } = req.params;

  const { data: foundation, error } = await supabase
    .from('foundations')
    .select(`
      *,
      foundation_type:foundation_types (name),
      user:users!foundation_id (email, phone_number, profile_image_url, account_status)
    `)
    .eq('foundation_id', foundationId)
    .not('verified_at', 'is', null)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching foundation details:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to fetch foundation: ${error.message}`);
  }

  if (!foundation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Foundation not found or not publicly available');
  }

  // ตรวจสอบว่า user account ของ foundation นี้ active หรือไม่
  if (foundation.user && foundation.user.account_status !== 'active') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Foundation not found or not publicly available');
  }

  res.status(httpStatus.OK).json(
    new ApiResponse(
      httpStatus.OK,
      foundation,
      'Foundation details retrieved successfully'
    )
  );
});

// GET /api/public/foundation-types
const listFoundationTypes = asyncHandler(async (req, res) => {
    console.log('Fetching foundation types from Supabase...');
    
    const { data: types, error } = await supabase
        .from('foundation_types')
        .select('type_id, name, description')
        .order('name', { ascending: true });

    console.log('Supabase response:', { types, error });

    if (error) {
        console.error("Error listing foundation types:", error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to list foundation types: ${error.message}`);
    }

    res.status(httpStatus.OK).json(
        new ApiResponse(
            httpStatus.OK,
            types,
            'Foundation types listed successfully'
        )
    );
});

// Initialize foundation types if they don't exist
const initializeFoundationTypes = async () => {
  const defaultTypes = [
    { name: 'มูลนิธิเพื่อการศึกษา', description: 'มูลนิธิที่มุ่งเน้นการส่งเสริมและพัฒนาการศึกษา' },
    { name: 'มูลนิธิเพื่อการแพทย์และสาธารณสุข', description: 'มูลนิธิที่มุ่งเน้นการส่งเสริมสุขภาพและการแพทย์' },
    { name: 'มูลนิธิเพื่อเด็กและเยาวชน', description: 'มูลนิธิที่มุ่งเน้นการพัฒนาและช่วยเหลือเด็กและเยาวชน' },
    { name: 'มูลนิธิเพื่อผู้สูงอายุ', description: 'มูลนิธิที่มุ่งเน้นการช่วยเหลือและดูแลผู้สูงอายุ' },
    { name: 'มูลนิธิเพื่อสิ่งแวดล้อม', description: 'มูลนิธิที่มุ่งเน้นการอนุรักษ์และพัฒนาสิ่งแวดล้อม' },
    { name: 'มูลนิธิเพื่อสัตว์', description: 'มูลนิธิที่มุ่งเน้นการช่วยเหลือและคุ้มครองสัตว์' },
    { name: 'มูลนิธิเพื่อผู้ด้อยโอกาส', description: 'มูลนิธิที่มุ่งเน้นการช่วยเหลือผู้ด้อยโอกาสในสังคม' },
    { name: 'มูลนิธิเพื่อการกุศลทั่วไป', description: 'มูลนิธิที่ดำเนินกิจกรรมการกุศลในรูปแบบทั่วไป' }
  ];

  // Check if types exist
  const { data: existingTypes, error: checkError } = await supabase
    .from('foundation_types')
    .select('type_id')
    .limit(1);

  if (checkError) {
    console.error('Error checking foundation types:', checkError);
    return;
  }

  // If no types exist, insert them
  if (!existingTypes || existingTypes.length === 0) {
    const { error: insertError } = await supabase
      .from('foundation_types')
      .insert(defaultTypes);

    if (insertError) {
      console.error('Error inserting foundation types:', insertError);
    } else {
      console.log('Foundation types initialized successfully');
    }
  }
};

// Initialize sample foundation data if none exists
const initializeSampleFoundations = async () => {
  try {
    // For development/testing: Clear existing sample data to ensure fresh start
    console.log('Clearing existing sample foundations and users...');

    // Get IDs of sample users (foundation_admin type)
    const { data: sampleUsersToDelete, error: fetchUsersError } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_type', 'foundation_admin')
      .in('email', ['lovelypets@example.com', 'friendhelp@example.com', 'saveanimals@example.com']); // Use emails to identify sample users

    if (fetchUsersError) {
      console.error('Error fetching sample users to delete:', fetchUsersError);
      // Continue even if fetch fails
    }

    const sampleUserIds = sampleUsersToDelete ? sampleUsersToDelete.map(u => u.user_id) : [];

    if (sampleUserIds.length > 0) {
      // Delete foundations first due to foreign key constraints
      const { error: deleteFoundationsError } = await supabase
        .from('foundations')
        .delete()
        .in('foundation_id', sampleUserIds);

      if (deleteFoundationsError) {
        console.error('Error deleting existing foundations:', deleteFoundationsError);
      }

      // Then delete sample users
      const { error: deleteUsersError } = await supabase
        .from('users')
        .delete()
        .in('user_id', sampleUserIds);

      if (deleteUsersError) {
        console.error('Error deleting existing sample users:', deleteUsersError);
      }
      console.log(`Cleared ${sampleUserIds.length} sample foundations and users.`);
    } else {
      console.log('No sample foundations/users found to clear.');
    }

    // Check if any foundations exist after potential deletion (to decide if we need to re-initialize)
    const { data: existingFoundation, error: foundationCheckError } = await supabase
      .from('foundations')
      .select('*')
      .limit(1)
      .single();

    if (foundationCheckError && foundationCheckError.code !== 'PGRST116') {
      console.error('Error checking foundation after clear attempt:', foundationCheckError);
      return;
    }

    // If we still have foundations (e.g., not sample data, or clear failed), skip initialization
    if (existingFoundation) {
      console.log('Foundations still exist after clear attempt, skipping initialization.');
      return;
    }

    // Create sample users first
    const sampleUsers = [
      {
        email: 'lovelypets@example.com',
        password_hash: '$2b$10$YourHashedPasswordHere',
        first_name: 'มูลนิธิ',
        last_name: 'รักสัตว์มีสุข',
        user_type: 'foundation_admin',
        account_status: 'active',
        phone_number: '080-123-4567',
        agreed_to_terms_at: new Date().toISOString(),
        agreed_to_privacy_at: new Date().toISOString(),
        is_email_verified: true
      },
      {
        email: 'friendhelp@example.com',
        password_hash: '$2b$10$YourHashedPasswordHere',
        first_name: 'มูลนิธิ',
        last_name: 'เพื่อนช่วยเพื่อน',
        user_type: 'foundation_admin',
        account_status: 'active',
        phone_number: '089-123-4567',
        agreed_to_terms_at: new Date().toISOString(),
        agreed_to_privacy_at: new Date().toISOString(),
        is_email_verified: true
      },
      {
        email: 'saveanimals@example.com',
        password_hash: '$2b$10$YourHashedPasswordHere',
        first_name: 'มูลนิธิ',
        last_name: 'รักษ์สัตว์',
        user_type: 'foundation_admin',
        account_status: 'active',
        phone_number: '081-123-4567',
        agreed_to_terms_at: new Date().toISOString(),
        agreed_to_privacy_at: new Date().toISOString(),
        is_email_verified: true
      }
    ];

    console.log('Inserting sample users...');
    const { data: insertedUsers, error: userError } = await supabase
      .from('users')
      .insert(sampleUsers)
      .select('user_id');

    if (userError) {
      console.error('Error inserting sample users:', userError);
      return;
    }

    console.log('Successfully inserted users:', insertedUsers);

    const sampleFoundations = [
      {
        foundation_id: insertedUsers[0].user_id,
        foundation_name: 'มูลนิธิรักสัตว์มีสุข (Test) - อัปเดตแล้ว',
        // logo_url will be handled by actual uploads, or default to placeholder if not set
        history_mission: 'ช่วยเหลือและดูแลสัตว์ทุกประเภท...',
        foundation_type_id: 2, // มูลนิธิเพื่อสัตว์
        address_line1: '123 ถนนนิมมานเหมินทร์',
        city: 'เชียงใหม่',
        province: 'เชียงใหม่',
        postal_code: '50200',
        contact_email: 'contact@lovelypets.org',
        website_url: 'https://lovelypets.org',
        license_number: 'LIC-001',
        accepts_pickup_service: true,
        pickup_service_area: 'ในเขตเชียงใหม่',
        pickup_contact_info: 'ติดต่อคุณสมชาย 080-123-4567',
        verified_at: new Date().toISOString(),
        verified_by_admin_id: 1
      },
      {
        foundation_id: insertedUsers[1].user_id,
        foundation_name: 'มูลนิธิเพื่อนช่วยเพื่อน',
        // logo_url will be handled by actual uploads, or default to placeholder if not set
        history_mission: 'ช่วยเหลือผู้ด้อยโอกาสในสังคม...',
        foundation_type_id: 7,
        address_line1: '456 ถนนเพชรบุรี',
        city: 'กรุงเทพมหานคร',
        province: 'กรุงเทพมหานคร',
        postal_code: '10400',
        contact_email: 'contact@friendhelp.org',
        website_url: 'https://friendhelp.org',
        license_number: 'LIC-002',
        accepts_pickup_service: true,
        pickup_service_area: 'ทั่วกรุงเทพมหานคร',
        pickup_contact_info: 'ติดต่อคุณสมหญิง 089-123-4567',
        verified_at: new Date().toISOString(),
        verified_by_admin_id: 1
      },
      {
        foundation_id: insertedUsers[2].user_id,
        foundation_name: 'มูลนิธิรักษ์สัตว์',
        // logo_url will be handled by actual uploads, or default to placeholder if not set
        history_mission: 'ช่วยเหลือและคุ้มครองสัตว์...',
        foundation_type_id: 6,
        address_line1: '789 ถนนพระราม 9',
        city: 'กรุงเทพมหานคร',
        province: 'กรุงเทพมหานคร',
        postal_code: '10310',
        contact_email: 'contact@saveanimals.org',
        website_url: 'https://saveanimals.org',
        license_number: 'LIC-003',
        accepts_pickup_service: false,
        verified_at: new Date().toISOString(),
        verified_by_admin_id: 1
      }
    ];

    console.log('Inserting sample foundations...');
    const { error: insertError } = await supabase
      .from('foundations')
      .insert(sampleFoundations);

    if (insertError) {
      console.error('Error inserting sample foundations:', insertError);
    } else {
      console.log('Sample foundations initialized successfully');
    }
  } catch (error) {
    console.error('Error in initializeSampleFoundations:', error);
  }
};

// Call both initialization functions when the server starts
const initializeData = async () => {
  try {
    console.log('Starting data initialization...');
    await initializeFoundationTypes();
    await initializeSampleFoundations();
    console.log('Data initialization completed');
  } catch (error) {
    console.error('Error in initializeData:', error);
  }
};

// Call initializeData when the server starts
initializeData();

const getPublicFoundationById = async (req, res) => {
  try {
    const { foundationId } = req.params;

    // Get foundation details with type and user info
    const { data: foundation, error } = await supabase
      .from('foundations')
      .select(`
        foundation_id,
        foundation_name,
        logo_url,
        history_mission,
        province,
        contact_phone,
        contact_email,
        website_url,
        address_line1,
        address_line2,
        city,
        postal_code,
        gmaps_embed_url,
        verified_at,
        foundation_type_id,
        foundation_types!foundation_type_id (
          name
        ),
        users!foundation_id (
          email,
          phone_number,
          account_status
        )
      `)
      .eq('foundation_id', foundationId)
      .not('verified_at', 'is', null)
      .eq('users.account_status', 'active')
      .single();

    if (error) {
      console.error('Error fetching foundation:', error);
      return res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        success: false
      });
    }

    if (!foundation) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Foundation not found or not verified',
        success: false
      });
    }

    // Format the response data with all necessary fields
    const formattedData = {
      foundation_id: foundation.foundation_id,
      foundation_name: foundation.foundation_name,
      logo_url: foundation.logo_url,
      history_mission: foundation.history_mission,
      province: foundation.province,
      contact_phone: foundation.contact_phone,
      contact_email: foundation.contact_email,
      website_url: foundation.website_url,
      address_line1: foundation.address_line1,
      address_line2: foundation.address_line2,
      city: foundation.city,
      postal_code: foundation.postal_code,
      gmaps_embed_url: foundation.gmaps_embed_url,
      verified_at: foundation.verified_at,
      foundation_type: foundation.foundation_types,
      user: foundation.users
    };

    return res.status(200).json({
      statusCode: 200,
      data: formattedData,
      message: 'Foundation details retrieved successfully',
      success: true
    });
  } catch (error) {
    console.error('Error in getPublicFoundationById:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      success: false
    });
  }
};

module.exports = {
  listPublicFoundations,
  getPublicFoundationDetails,
  listFoundationTypes,
  getPublicFoundationById,
};
