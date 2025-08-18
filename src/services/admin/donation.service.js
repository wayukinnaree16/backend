const { supabase } = require('../../config/supabase.config');

const getDonationStatistics = async () => {
  const { data: pledgesData, error: pledgesError } = await supabase
    .from('donation_pledges')
    .select('quantity_pledged');

  if (pledgesError) throw new Error(pledgesError.message);

  const totalPledges = pledgesData.length;
  const totalAmountDonated = pledgesData.reduce((sum, pledge) => sum + (pledge.quantity_pledged || 0), 0);

  return { totalPledges, totalAmountDonated };
};

const getAllDonatedItems = async (statusFilter) => {
  let query = supabase
    .from('donation_pledges')
    .select(`
      donation_id:pledge_id,
      item_name:donor_item_description,
      quantity:quantity_pledged,
      status,
      donor_id,
      foundation_id,
      created_at:pledged_at,
      donor:users!donor_id(user_id, first_name, last_name, email),
      foundation:foundations!foundation_id(foundation_id, name:foundation_name)
    `);

  const filter = String(statusFilter || '').toLowerCase();

  if (filter === 'pending') {
    query = query.in('status', ['pending_foundation_approval', 'approved_by_foundation', 'shipping_in_progress']);
  } else if (filter === 'delivered') {
    query = query.eq('status', 'received_by_foundation');
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching donated items:', error);
    throw new Error(error.message);
  }

  if (!data) {
    return [];
  }

  const transformedData = data.map(item => {
    const donor = item.donor ? {
      ...item.donor,
      full_name: `${item.donor.first_name || ''} ${item.donor.last_name || ''}`.trim()
    } : null;

    let mappedStatus = item.status;
    if (item.status === 'received_by_foundation') {
      mappedStatus = 'delivered';
    } else if (['pending_foundation_approval', 'approved_by_foundation', 'shipping_in_progress'].includes(item.status)) {
      mappedStatus = 'pending';
    }

    return {
      ...item,
      status: mappedStatus,
      donor
    };
  });

  return transformedData;
};

const updateDonatedItemStatus = async (pledgeId, statusData) => {
  const { data, error } = await supabase
    .from('donation_pledges')
    .update(statusData)
    .eq('pledge_id', pledgeId)
    .select();

  if (error) throw new Error(error.message);
  return data.length > 0 ? data[0] : null;
};

module.exports = {
  getDonationStatistics,
  getAllDonatedItems,
  updateDonatedItemStatus,
};
