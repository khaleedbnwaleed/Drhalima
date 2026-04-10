-- Sample Data for Development and Testing
-- Run this script ONLY in development/staging environments!
-- WARNING: Do not run in production

-- ==================== SAMPLE ADMIN USERS ====================
-- Password: "password" (hashed with bcryptjs)
-- Change immediately after first login!

INSERT INTO users (email, password_hash, full_name, role) VALUES
  ('admin@drhalimasulaiman.ng', '$2a$12$aQlAqyNPYfwA4krzHRwdD./o2IxUYN3XBxIrpVR53NgNgUXGLwYs.', 'System Administrator', 'admin'),
  ('manager@drhalimasulaiman.ng', '$2a$12$aQlAqyNPYfwA4krzHRwdD./o2IxUYN3XBxIrpVR53NgNgUXGLwYs.', 'Campaign Manager', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ==================== SAMPLE SUPPORTERS ====================

INSERT INTO supporters (
  supporter_id, first_name, last_name, email, phone, state, lga, ward, 
  pvc_number, voter_status, occupation, support_status, address
) VALUES
  ('SUP-2025-001001', 'Chioma', 'Okafor', 'chioma@example.com', '+2348012345678', 'Lagos', 'Alimosho', 'Alimosho Ward A', '12345678901234', 'verified', 'Software Engineer', 'strong_supporter', '123 Main Street, Lagos'),
  ('SUP-2025-001002', 'Emeka', 'Nwosu', 'emeka@example.com', '+2348012345679', 'Lagos', 'Alimosho', 'Alimosho Ward B', '12345678901235', 'verified', 'Business Owner', 'strong_supporter', '456 Commerce Ave, Lagos'),
  ('SUP-2025-001003', 'Zainab', 'Muhammad', 'zainab@example.com', '+2348012345680', 'Kano', 'Fagge', 'Fagge Ward A', null, 'unverified', 'Medical Doctor', 'undecided', '789 Health St, Kano'),
  ('SUP-2025-001004', 'Jamal', 'Ibrahim', 'jamal@example.com', '+2348012345681', 'Kano', 'Fagge', 'Fagge Ward B', '12345678901236', 'verified', 'Teacher', 'undecided', '321 Education Blvd, Kano'),
  ('SUP-2025-001005', 'Tunde', 'Adebayo', 'tunde@example.com', '+2348012345682', 'Lagos', 'Ajeromi-Ifelodun', 'Ajeromi Ward A', '12345678901237', 'verified', 'Farmer', 'opponent', '654 Agricultural Ln, Lagos')
ON CONFLICT (email) DO NOTHING;

-- ==================== SAMPLE VOLUNTEERS ====================

INSERT INTO volunteers (
  first_name, last_name, email, phone, volunteer_role, assigned_lga, assigned_ward,
  availability, skills, status
) VALUES
  ('Aminat', 'Bakare', 'aminat@example.com', '+2348087654321', 'Field Agent', 'Alimosho', 'Alimosho Ward A', 'full_time', 'Community mobilization, Event planning', 'approved'),
  ('David', 'Osei', 'david@example.com', '+2348087654322', 'Polling Unit Agent', 'Alimosho', 'Alimosho Ward B', 'part_time', 'Data entry, Election monitoring', 'active'),
  ('Fatima', 'Hassan', 'fatima@example.com', '+2348087654323', 'Media', 'Fagge', 'Fagge Ward A', 'full_time', 'Photography, Video production, Social media', 'approved'),
  ('Chukwu', 'Uche', 'chukwu@example.com', '+2348087654324', 'Field Agent', 'Fagge', 'Fagge Ward B', 'weekends_only', 'Community organizing, Training', 'active'),
  ('Zara', 'Ahmed', 'zara@example.com', '+2348087654325', 'Media', 'Ajeromi-Ifelodun', 'Ajeromi Ward A', 'full_time', 'Content creation, Public speaking', 'pending')
ON CONFLICT (email) DO NOTHING;

-- ==================== SAMPLE VOTER TRACKING ====================

INSERT INTO voter_tracking (
  supporter_id, lga, ward, support_status, last_contact_date, contact_method,
  contact_notes
)
SELECT
  s.id,
  s.lga,
  s.ward,
  s.support_status,
  CURRENT_DATE - INTERVAL '7 days' as last_contact_date,
  'whatsapp' as contact_method,
  'Initial contact made via WhatsApp' as contact_notes
FROM supporters s
WHERE s.email IN (
  'chioma@example.com',
  'emeka@example.com',
  'zainab@example.com',
  'jamal@example.com',
  'tunde@example.com'
)
ON CONFLICT DO NOTHING;

-- ==================== SAMPLE WARD STATISTICS ====================

UPDATE ward_statistics SET
  total_supporters = 2,
  strong_supporters = 2,
  undecided = 0,
  opponents = 0,
  total_volunteers = 2
WHERE state = 'Lagos' AND lga = 'Alimosho' AND ward = 'Alimosho Ward A'
OR (state = 'Lagos' AND lga = 'Alimosho' AND ward = 'Alimosho Ward A') IS FALSE
  AND NOT EXISTS (SELECT 1 FROM ward_statistics WHERE state = 'Lagos' AND lga = 'Alimosho' AND ward = 'Alimosho Ward A');

INSERT INTO ward_statistics (state, lga, ward, total_supporters, strong_supporters, undecided, opponents, total_volunteers)
SELECT 'Lagos', 'Alimosho', 'Alimosho Ward A', 2, 2, 0, 0, 2
WHERE NOT EXISTS (SELECT 1 FROM ward_statistics WHERE state = 'Lagos' AND lga = 'Alimosho' AND ward = 'Alimosho Ward A')
UNION ALL
SELECT 'Lagos', 'Alimosho', 'Alimosho Ward B', 1, 1, 0, 0, 1
WHERE NOT EXISTS (SELECT 1 FROM ward_statistics WHERE state = 'Lagos' AND lga = 'Alimosho' AND ward = 'Alimosho Ward B')
UNION ALL
SELECT 'Kano', 'Fagge', 'Fagge Ward A', 1, 0, 1, 0, 1
WHERE NOT EXISTS (SELECT 1 FROM ward_statistics WHERE state = 'Kano' AND lga = 'Fagge' AND ward = 'Fagge Ward A')
UNION ALL
SELECT 'Kano', 'Fagge', 'Fagge Ward B', 1, 0, 1, 0, 1
WHERE NOT EXISTS (SELECT 1 FROM ward_statistics WHERE state = 'Kano' AND lga = 'Fagge' AND ward = 'Fagge Ward B')
UNION ALL
SELECT 'Lagos', 'Ajeromi-Ifelodun', 'Ajeromi Ward A', 1, 0, 0, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM ward_statistics WHERE state = 'Lagos' AND lga = 'Ajeromi-Ifelodun' AND ward = 'Ajeromi Ward A');

-- ==================== SAMPLE MESSAGING CAMPAIGNS ====================

INSERT INTO messaging_campaigns (
  campaign_name, message_text, channel, target_group, target_filter,
  status, total_recipients, successfully_sent, failed_count
)
SELECT
  'Q2 Mobilization Drive',
  'Hello! Join us for our campaign rally this Saturday. Help spread the message of change!',
  'sms',
  'by_lga',
  jsonb_build_object('lga', 'Lagos'),
  'completed',
  2,
  2,
  0
WHERE NOT EXISTS (SELECT 1 FROM messaging_campaigns WHERE campaign_name = 'Q2 Mobilization Drive');

INSERT INTO messaging_campaigns (
  campaign_name, message_text, channel, target_group, target_filter,
  status, total_recipients, successfully_sent, failed_count
)
SELECT
  'Strong Supporter Follow-up',
  'Thank you for your continued support! Your commitment inspires us. 🙏',
  'whatsapp',
  'by_support_level',
  jsonb_build_object('support_status', 'strong_supporter'),
  'completed',
  3,
  3,
  0
WHERE NOT EXISTS (SELECT 1 FROM messaging_campaigns WHERE campaign_name = 'Strong Supporter Follow-up');

-- ==================== SAMPLE MESSAGE DELIVERY ====================

INSERT INTO message_delivery (
  campaign_id, supporter_id, phone_number, message_text, channel, status
)
SELECT
  mc.id,
  s.id,
  s.phone,
  mc.message_text,
  mc.channel,
  'delivered'
FROM messaging_campaigns mc
CROSS JOIN supporters s
WHERE mc.campaign_name = 'Q2 Mobilization Drive'
  OR mc.campaign_name = 'Strong Supporter Follow-up'
LIMIT 5;

-- ==================== SAMPLE DONATIONS ====================

INSERT INTO donations (
  donor_name, donor_email, amount, currency, payment_method,
  payment_status, message, anonymous
) VALUES
  ('Chioma Okafor', 'chioma@example.com', 50000, 'NGN', 'card', 'completed', 'Keep up the good work!', false),
  ('Emeka Nwosu', 'emeka@example.com', 100000, 'NGN', 'bank_transfer', 'completed', null, false),
  ('Anonymous', 'anonymous@example.com', 25000, 'NGN', 'card', 'completed', null, true),
  ('Zainab Muhammad', 'zainab@example.com', 30000, 'NGN', 'ussd', 'pending', 'Happy to support', false)
ON CONFLICT DO NOTHING;

-- ==================== SAMPLE CONTACT SUBMISSIONS ====================

INSERT INTO contact_submissions (
  name, email, phone, subject, message, read
) VALUES
  ('Ade Johnson', 'ade@example.com', '+2348012345678', 'Volunteer Inquiry', 'I would like to volunteer for the campaign. Can you provide more information?', false),
  ('Blessing Okoro', 'blessing@example.com', '+2348012345679', 'Media Request', 'I am a journalist interested in interviewing the candidate.', false),
  ('Kolade Adekunle', 'kolade@example.com', '+2348012345680', 'Event Schedule', 'When is the next community meeting?', true)
ON CONFLICT DO NOTHING;

-- ==================== SAMPLE AUDIT LOGS ====================

INSERT INTO audit_logs (
  action, table_name, record_id, new_values
)
SELECT
  'sample_data_inserted',
  'audit_logs',
  'SAMPLE_001',
  jsonb_build_object('note', 'Sample data inserted for testing')
WHERE NOT EXISTS (SELECT 1 FROM audit_logs WHERE action = 'sample_data_inserted');


-- ==================== SUMMARY ====================

SELECT '✅ Sample data inserted successfully!' as result;

-- Count sample records
SELECT 
  (SELECT COUNT(*) FROM supporters) as total_supporters,
  (SELECT COUNT(*) FROM volunteers) as total_volunteers,
  (SELECT COUNT(*) FROM donations) as total_donations,
  (SELECT COUNT(*) FROM messaging_campaigns) as total_campaigns,
  (SELECT COUNT(*) FROM voter_tracking) as total_tracked_voters
