-- Check Database Setup for Dr. Halima Campaign
-- Run this to verify your database is ready for the application

-- Check if users table exists and has admin user
SELECT 'Users table exists' as check_name,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')
            THEN '✅ PASS' ELSE '❌ FAIL' END as status,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')
            THEN (SELECT COUNT(*) FROM users WHERE role = 'admin')::text || ' admin users found'
            ELSE 'Table does not exist' END as details;

-- Check if other essential tables exist
SELECT 'Essential tables exist' as check_name,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name IN ('volunteers', 'donations', 'news', 'contact_submissions'))
            THEN '✅ PASS' ELSE '❌ FAIL' END as status,
       CASE WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('volunteers', 'donations', 'news', 'contact_submissions')) = 4
            THEN 'All base tables present'
            ELSE (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('volunteers', 'donations', 'news', 'contact_submissions'))::text || '/4 tables found' END as details;

-- Show admin user details if exists
SELECT 'Admin user ready' as check_name,
       CASE WHEN EXISTS (SELECT 1 FROM users WHERE email = 'admin@drhalimasulaiman.ng')
            THEN '✅ PASS' ELSE '❌ FAIL' END as status,
       CASE WHEN EXISTS (SELECT 1 FROM users WHERE email = 'admin@drhalimasulaiman.ng')
            THEN 'Ready to login at /admin/login'
            ELSE 'Run create-admin.sql first' END as details;