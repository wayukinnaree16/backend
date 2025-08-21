-- SQL script to add 'extremely_urgent' to existing item_urgency_level enum type in Supabase
-- This script should be run in Supabase SQL Editor
-- Note: Run each section separately or ensure proper transaction handling

-- Check current enum values
SELECT unnest(enum_range(NULL::item_urgency_level)) AS current_urgency_levels;

-- Add 'extremely_urgent' to the existing enum type
-- This must be run in a separate transaction
BEGIN;
ALTER TYPE item_urgency_level ADD VALUE 'extremely_urgent';
COMMIT;

-- Verify the enum was updated successfully (run this after the above is committed)
SELECT unnest(enum_range(NULL::item_urgency_level)) AS updated_urgency_levels;

-- If you need to add this enum to an existing table column, use:
-- ALTER TABLE foundation_wishlist_items 
-- ALTER COLUMN urgency_level TYPE item_urgency_level 
-- USING urgency_level::text::item_urgency_level;

-- Or if the column doesn't exist yet, add it:
-- ALTER TABLE foundation_wishlist_items 
-- ADD COLUMN urgency_level item_urgency_level DEFAULT 'normal';

-- Set default values for existing records if needed:
-- UPDATE foundation_wishlist_items SET urgency_level = 'normal' WHERE urgency_level IS NULL;