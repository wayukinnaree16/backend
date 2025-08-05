const httpStatus = require('http-status');
const { supabase } = require('../../../config/supabase.config');
const ApiError = require('../../../utils/ApiError');
const ApiResponse = require('../../../utils/ApiResponse');
const asyncHandler = require('../../../utils/asyncHandler');

// Initialize default item categories if table is empty
const initializeDefaultCategories = async () => {
  const defaultCategories = [
    { name: 'เสื้อผ้า', description: 'เสื้อผ้าและเครื่องแต่งกาย', sort_order: 1 },
    { name: 'อาหาร', description: 'อาหารและเครื่องดื่ม', sort_order: 2 },
    { name: 'เครื่องใช้ในบ้าน', description: 'เครื่องใช้ไฟฟ้าและเฟอร์นิเจอร์', sort_order: 3 },
    { name: 'ของเล่น', description: 'ของเล่นและอุปกรณ์การศึกษา', sort_order: 4 },
    { name: 'เครื่องเขียน', description: 'เครื่องเขียนและอุปกรณ์การเรียน', sort_order: 5 },
    { name: 'อุปกรณ์การแพทย์', description: 'อุปกรณ์และเวชภัณฑ์ทางการแพทย์', sort_order: 6 },
    { name: 'อื่นๆ', description: 'หมวดหมู่อื่นๆ', sort_order: 7 }
  ];

  // Check if categories exist
  const { data: existingCategories, error: checkError } = await supabase
    .from('item_categories')
    .select('category_id')
    .limit(1);

  if (checkError) {
    console.error('Error checking item categories:', checkError);
    return;
  }

  // If no categories exist, insert them
  if (!existingCategories || existingCategories.length === 0) {
    const { error: insertError } = await supabase
      .from('item_categories')
      .insert(defaultCategories);

    if (insertError) {
      console.error('Error inserting item categories:', insertError);
    } else {
      console.log('Item categories initialized successfully');
    }
  }
};

// Call initialize function when module loads
initializeDefaultCategories();

// GET /api/public/item-categories
const listItemCategories = asyncHandler(async (req, res) => {
  // Function to recursively fetch categories and their children
  const fetchCategoriesRecursive = async (parentId = null) => {
    let query = supabase
      .from('item_categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (parentId === null) {
      query = query.is('parent_category_id', null);
    } else {
      query = query.eq('parent_category_id', parentId);
    }

    const { data: categories, error } = await query;

    if (error) {
      console.error(`Error fetching categories for parent ${parentId}:`, error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch item categories.');
    }

    if (!categories || categories.length === 0) {
      return [];
    }

    // For each category, fetch its children
    for (const category of categories) {
      category.children = await fetchCategoriesRecursive(category.category_id);
    }
    return categories;
  };

  try {
    const categoryTree = await fetchCategoriesRecursive(); // Start with root categories (parent_id IS NULL)
    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        categoryTree,
        'Item categories listed successfully'
      )
    );
  } catch (error) {
    // If error is already ApiError, rethrow it, otherwise wrap it
    if (error instanceof ApiError) throw error;
    console.error("Error in listItemCategories:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Failed to list item categories.');
  }
});

module.exports = {
  listItemCategories,
}; 