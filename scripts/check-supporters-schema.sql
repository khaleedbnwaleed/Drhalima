-- Check Supporters Table Schema
-- Run this to verify the supporters table has the correct structure for individual registration

-- Check if supporters table exists
SELECT 'Supporters table exists' as check_name,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'supporters')
            THEN '✅ PASS' ELSE '❌ FAIL' END as status,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'supporters')
            THEN (SELECT COUNT(*) FROM supporters)::text || ' records found'
            ELSE 'Table does not exist' END as details;

-- Check if supporters table has individual supporter fields (enhanced schema)
SELECT 'Individual supporter fields exist' as check_name,
       CASE WHEN EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_name = 'supporters'
         AND column_name IN ('supporter_id', 'first_name', 'last_name', 'phone', 'state', 'lga', 'ward')
       )
       THEN '✅ PASS' ELSE '❌ FAIL' END as status,
       CASE WHEN EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_name = 'supporters'
         AND column_name IN ('supporter_id', 'first_name', 'last_name', 'phone', 'state', 'lga', 'ward')
       )
       THEN 'Enhanced schema detected'
       ELSE 'Old organization schema - run 02-enhanced-schema.sql' END as details;

-- Show current supporters table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'supporters'
ORDER BY ordinal_position;