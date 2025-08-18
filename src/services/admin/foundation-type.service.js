const { supabase } = require('../../config/supabase.config');

const getFoundationTypes = async () => {
  const { data, error } = await supabase.from('foundation_types').select('type_id, name, description');
  if (error) throw new Error(error.message);
  return data;
};

const getFoundationTypeById = async (type_id) => {
  const { data, error } = await supabase.from('foundation_types').select('type_id, name, description').eq('type_id', type_id).single();
  if (error) {
    // If no row is found, Supabase .single() will return an error with code 'PGRST116'
    // We should not throw an error here, but return null so the controller can handle the 404.
    if (error.code === 'PGRST116') { // No rows found for .single()
      return null;
    }
    throw new Error(error.message);
  }
  return data;
};

const createFoundationType = async (foundationTypeData) => {
  const { data, error } = await supabase.from('foundation_types').insert(foundationTypeData).select('type_id, name, description').single();
  if (error) throw new Error(error.message);
  return data;
};

const updateFoundationType = async (type_id, foundationTypeData) => {
  const { data, error } = await supabase.from('foundation_types').update(foundationTypeData).eq('type_id', type_id).select('type_id, name, description');
  if (error) throw new Error(error.message);
  // If no row was updated, data will be an empty array.
  // Return the first element if it exists, or null otherwise.
  return data.length > 0 ? data[0] : null;
};

const deleteFoundationType = async (type_id) => {
  const { data, error } = await supabase.from('foundation_types').delete().eq('type_id', type_id).select(); // Add .select() to get the deleted rows
  if (error) throw new Error(error.message);
  return data.length; // Return the count of deleted rows
};

module.exports = {
  getFoundationTypes,
  getFoundationTypeById,
  createFoundationType,
  updateFoundationType,
  deleteFoundationType,
};
