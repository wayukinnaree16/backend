const { supabase } = require('./src/config/supabase.config');

async function testRejectFoundation() {
  const foundationId = 900000007;
  const adminUserId = 1; // Mock admin ID
  const verification_notes = 'Test rejection';

  console.log('=== Testing Foundation Rejection Debug ===');

  try {
    // 1. Check current foundation status
    console.log('\n1. Checking current foundation status...');
    const { data: foundationData, error: fetchError } = await supabase
      .from('foundations')
      .select('foundation_id, foundation_status')
      .eq('foundation_id', foundationId)
      .single();

    if (fetchError) {
      console.error('Error fetching foundation:', fetchError);
      return;
    }

    if (!foundationData) {
      console.log('Foundation not found');
      return;
    }

    console.log('Foundation data:', foundationData);

    // 2. Try to update the foundation status
    console.log('\n2. Attempting to update foundation status...');
    const { data: updatedFoundation, error: updateError } = await supabase
      .from('foundations')
      .update({
        foundation_status: 'rejected',
        verified_at: null,
        verified_by_admin_id: adminUserId,
        verification_notes: verification_notes,
      })
      .eq('foundation_id', foundationId)
      .eq('foundation_status', 'pending_verification')
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return;
    }

    if (!updatedFoundation) {
      console.log('No foundation was updated (possibly not in pending_verification status)');
      return;
    }

    console.log('Foundation updated successfully:', updatedFoundation);

    // 3. Reset foundation status back to pending_verification for future tests
    console.log('\n3. Resetting foundation status back to pending_verification...');
    const { data: resetFoundation, error: resetError } = await supabase
      .from('foundations')
      .update({
        foundation_status: 'pending_verification',
        verified_at: null,
        verified_by_admin_id: null,
        verification_notes: null,
      })
      .eq('foundation_id', foundationId)
      .select()
      .single();

    if (resetError) {
      console.error('Reset error:', resetError);
      return;
    }

    console.log('Foundation reset successfully:', resetFoundation);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testRejectFoundation().then(() => {
  console.log('\n=== Test completed ===');
  process.exit(0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});