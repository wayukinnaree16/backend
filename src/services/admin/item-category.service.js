const { supabase } = require('../../config/supabase.config');

const getItemCategories = async () => {
  const { data, error } = await supabase.from('item_categories').select('category_id, name, description');
  if (error) throw new Error(error.message);
  return data;
};

const getItemCategoryById = async (category_id) => {
  const { data, error } = await supabase.from('item_categories').select('category_id, name, description').eq('category_id', category_id).single();
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }
  return data;
};

const createItemCategory = async (itemCategoryData) => {
  const { data, error } = await supabase.from('item_categories').insert(itemCategoryData).select('category_id, name, description').single();
  if (error) throw new Error(error.message);
  return data;
};

const updateItemCategory = async (category_id, itemCategoryData) => {
  const { data, error } = await supabase.from('item_categories').update(itemCategoryData).eq('category_id', category_id).select('category_id, name, description');
  if (error) throw new Error(error.message);
  return data.length > 0 ? data[0] : null;
};

const deleteItemCategory = async (category_id) => {
  const { data, error } = await supabase.from('item_categories').delete().eq('category_id', category_id).select();
  if (error) throw new Error(error.message);
  return data.length;
};

module.exports = {
  getItemCategories,
  getItemCategoryById,
  createItemCategory,
  updateItemCategory,
  deleteItemCategory,
};
