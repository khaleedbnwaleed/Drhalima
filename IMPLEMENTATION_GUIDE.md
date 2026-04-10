# Dr. Halima Campaign - Enhanced Features Integration Guide

## Overview

This document provides complete implementation details for the new features integrated into the campaign management system.

---

## Table of Contents

1. [Database Schema Updates](#database-schema-updates)
2. [Supporter Registration Enhancement](#supporter-registration-enhancement)
3. [Volunteer Management Module](#volunteer-management-module)
4. [Voter Mobilization Tracking](#voter-mobilization-tracking)
5. [Admin Dashboard Upgrade](#admin-dashboard-upgrade)
6. [Bulk Messaging Feature](#bulk-messaging-feature)
7. [Security Improvements](#security-improvements)
8. [Environment Configuration](#environment-configuration)
9. [API Endpoints Reference](#api-endpoints-reference)
10. [Deployment Instructions](#deployment-instructions)

---

## Database Schema Updates

### New Tables Created

#### 1. **supporters** Table
Enhanced supporter registration with voter card verification and support tracking.

```sql
CREATE TABLE supporters (
  id UUID PRIMARY KEY,
  supporter_id TEXT UNIQUE NOT NULL,  -- SUP-YYYY-XXXXXX
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  
  -- Location
  state TEXT NOT NULL,
  lga TEXT NOT NULL,
  ward TEXT NOT NULL,
  address TEXT,
  
  -- Voter Info
  pvc_number TEXT,
  voter_status TEXT,
  
  -- Additional
  occupation TEXT,
  profile_photo_url TEXT,
  support_status TEXT,  -- strong_supporter, undecided, opponent
  qr_code_url TEXT,
  
  registered_date TIMESTAMP,
  status TEXT
);
```

#### 2. **voter_tracking** Table
Track voter interactions and support level changes.

```sql
CREATE TABLE voter_tracking (
  id UUID PRIMARY KEY,
  supporter_id UUID REFERENCES supporters,
  lga TEXT,
  ward TEXT,
  support_status TEXT,
  
  last_contact_date TIMESTAMP,
  contact_method TEXT,
  contact_notes TEXT,
  volunteer_id UUID REFERENCES volunteers,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### 3. **messaging_campaigns** Table
Store bulk messaging campaign records.

```sql
CREATE TABLE messaging_campaigns (
  id UUID PRIMARY KEY,
  campaign_name TEXT NOT NULL,
  message_text TEXT NOT NULL,
  channel TEXT,  -- sms, whatsapp, both
  target_group TEXT,
  target_filter JSONB,
  
  status TEXT,  -- draft, scheduled, sending, completed, failed
  total_recipients INTEGER,
  successfully_sent INTEGER,
  failed_count INTEGER,
  
  created_by UUID REFERENCES users,
  created_at TIMESTAMP
);
```

#### 4. **message_delivery** Table
Track individual message deliveries.

```sql
CREATE TABLE message_delivery (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES messaging_campaigns,
  supporter_id UUID REFERENCES supporters,
  phone_number TEXT,
  message_text TEXT,
  channel TEXT,
  
  status TEXT,  -- pending, sent, delivered, failed
  delivery_timestamp TIMESTAMP,
  error_message TEXT
);
```

Execute the schema update:
```bash
psql -h your-db-host -U postgres -d campaign_db -f scripts/02-enhanced-schema.sql
```

---

## Supporter Registration Enhancement

### Features

- ✅ Multi-step registration form
- ✅ Unique Supporter ID generation (SUP-2025-XXXXXX)
- ✅ QR code generation and download
- ✅ Profile photo upload to Supabase storage
- ✅ PVC verification
- ✅ Auto SMS/WhatsApp confirmation
- ✅ Server-side and client-side validation

### API Endpoint

**POST** `/api/supporters`

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+2348012345678",
  "dateOfBirth": "1990-01-15",
  "state": "Lagos",
  "lga": "Alimosho",
  "ward": "Alimosho Ward A",
  "address": "123 Main Street",
  "pvcNumber": "12345678901234",
  "occupation": "Engineer",
  "profilePhoto": "data:image/jpeg;base64,...",
  "sendConfirmation": true,
  "confirmationMethod": "both"
}
```

#### Response
```json
{
  "success": true,
  "supporter": {
    "id": "uuid",
    "supporterId": "SUP-2025-001234",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "confirmationStatus": {
    "email": true,
    "sms": true,
    "whatsapp": true
  },
  "qrCodeUrl": "data:image/png;base64,...",
  "message": "Supporter registered successfully!"
}
```

### Usage Example

```typescript
// Client-side registration
const registerSupporter = async (data) => {
  const response = await fetch('/api/supporters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Download QR code
    downloadQRCode(result.qrCodeUrl);
  }
};
```

---

## Volunteer Management Module

### Features

- ✅ Enhanced volunteer registration
- ✅ Role assignment (Field Agent, Media, Polling Unit Agent)
- ✅ LGA/Ward assignment
- ✅ Availability tracking
- ✅ Status management (pending, approved, active, rejected)

### API Endpoint

**POST** `/api/admin/volunteers`

#### Request Body
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+2348012345679",
  "volunteerRole": "Field Agent",
  "assignedLga": "Alimosho",
  "assignedWard": "Alimosho Ward A",
  "availability": "full_time",
  "availabilityHours": {
    "monday": ["09:00", "17:00"],
    "saturday": ["10:00", "14:00"]
  },
  "emergencyContact": "0803456789",
  "passportPhoto": "data:image/jpeg;base64,...",
  "skills": "Community mobilization, event planning"
}
```

**GET** `/api/admin/volunteers?role=Field Agent&lga=Alimosho&status=pending`

**PUT** `/api/admin/volunteers/[id]`

---

## Voter Mobilization Tracking

### Features

- ✅ Support status tracking (Strong Supporter, Undecided, Opponent)
- ✅ Ward-level tracking
- ✅ Volunteer assignment to voters
- ✅ Contact history logging
- ✅ Real-time statistics

### API Endpoints

**POST** `/api/admin/voter-tracking`

#### Request Body
```json
{
  "supporterId": "uuid",
  "supportStatus": "strong_supporter",
  "lastContactDate": "2025-04-08",
  "contactMethod": "whatsapp",
  "contactNotes": "Confirmed attendance at rally",
  "volunteerId": "uuid"
}
```

**GET** `/api/admin/voter-tracking?lga=Alimosho&ward=Ward A&support_status=undecided`

**GET** `/api/admin/voter-tracking/stats?lga=Alimosho`

---

## Admin Dashboard Upgrade

### Features

- ✅ Real-time statistics (supporters, volunteers, donations)
- ✅ Interactive charts and graphs
- ✅ LGA performance ranking
- ✅ Campaign status tracking
- ✅ CSV export functionality

### Components

1. **Analytics Dashboard** (`components/analytics-dashboard.tsx`)
   - Summary cards
   - Pie charts for supporter distribution
   - Bar charts for volunteer roles
   - Top LGAs performance table
   - Recent campaigns list

### Integration

```typescript
// pages/admin/analytics.tsx
import AnalyticsDashboard from '@/components/analytics-dashboard';

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
```

---

## Bulk Messaging Feature

### Features

- ✅ SMS/WhatsApp messaging
- ✅ Target group filtering
- ✅ Campaign scheduling
- ✅ Delivery tracking

### API Endpoint

**POST** `/api/admin/messaging/campaigns`

#### Request Body
```json
{
  "campaignName": "Q3 Mobilization",
  "messageText": "Hello! Join us for the community meeting",
  "channel": "both",
  "targetGroup": "by_lga",
  "targetFilter": {
    "lga": "Alimosho",
    "support_status": "strong_supporter"
  },
  "sendImmediately": true,
  "userId": "admin-uuid"
}
```

**GET** `/api/admin/messaging/campaigns?status=completed&page=1&limit=50`

---

## Security Improvements

### 1. Password Hashing
Already implemented with `bcryptjs`:

```typescript
import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### 2. Input Validation
All inputs validated server-side with `zod`:

```typescript
const supporterSchema = z.object({
  firstName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^(\+234|0)[789]\d{9}$/),
  pvcNumber: z.string().regex(/^\d{14}$/).optional(),
});
```

### 3. CAPTCHA Integration

```typescript
// Before submitting form
<ReCAPTCHA
  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
  onChange={onCaptchaChange}
/>
```

### 4. Role-Based Access Control

```typescript
// Middleware
export function withAdminAuth(handler: Function) {
  return async (request: Request) => {
    const role = getUserRole(); // From session
    if (role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return handler(request);
  };
}
```

### 5. SQL Injection Prevention
Using parameterized Supabase queries:

```typescript
// SAFE - parameterized
await supabase
  .from('supporters')
  .select('*')
  .eq('email', email)  // Parameter binding

// NOT safe (don't do this)
// `.where('email = ' + email)`
```

### 6. HTTPS Only Cookies
```typescript
cookieStore.set('adminToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60,
});
```

---

## Environment Configuration

### Required Environment Variables

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (Resend)
RESEND_API_KEY=your-resend-key

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key

# Storage (Supabase)
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage
```

### .env.local
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

---

## API Endpoints Reference

### Supporters
- `POST /api/supporters` - Register new supporter
- `GET /api/supporters?lga=X&ward=Y&support_status=Z` - Get supporters
- `GET /api/supporters/[id]` - Get supporter details
- `PUT /api/supporters/[id]` - Update supporter

### Volunteers
- `POST /api/admin/volunteers` - Register volunteer
- `GET /api/admin/volunteers?role=X&status=Y` - List volunteers
- `PUT /api/admin/volunteers/[id]` - Update volunteer status

### Voter Tracking
- `POST /api/admin/voter-tracking` - Create tracking record
- `GET /api/admin/voter-tracking?lga=X&ward=Y` - Get tracking records
- `GET /api/admin/voter-tracking/stats` - Get ward statistics

### Messaging
- `POST /api/admin/messaging/campaigns` - Create campaign
- `GET /api/admin/messaging/campaigns?status=X` - List campaigns
- `GET /api/admin/messaging/history` - Get delivery history

### Dashboard
- `GET /api/admin/dashboard/stats` - Get real-time statistics
- `GET /api/admin/dashboard/export?format=csv` - Export data

---

## Deployment Instructions

### 1. Database Migration

```bash
# Connect to your Supabase database
psql postgresql://postgres:password@db.supabase.co:5432/postgres

# Run schema migration
\i scripts/02-enhanced-schema.sql

# Verify tables created
\dt
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Setup

```bash
# Copy template
cp .env.example .env.local

# Add your credentials
# - Supabase keys
# - Resend API key
# - reCAPTCHA keys
```

### 4. Test Locally

```bash
pnpm dev
# Visit http://localhost:3000
```

### 5. Build for Production

```bash
pnpm build
pnpm start
```

### 6. Deploy to Vercel

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... add other env vars

vercel deploy --prod
```

---

## File Structure

```
app/
├── api/
│   ├── admin/
│   │   ├── volunteers/route.ts
│   │   ├── voter-tracking/route.ts
│   │   ├── messaging/campaigns/route.ts
│   │   └── dashboard/stats/route.ts
│   └── supporters/route.ts
├── supporter/
│   └── page.tsx
└── admin/
    ├── volunteers/
    │   └── page.tsx
    ├── messages/
    │   └── page.tsx
    ├── analytics/
    │   └── page.tsx
    └── dashboard/
        └── page.tsx

components/
├── supporter-registration-form.tsx
├── analytics-dashboard.tsx
├── volunteer-management.tsx
└── messaging-center.tsx

lib/
├── validation.ts
├── qrcode-service.ts
├── messaging-service.ts
└── auth.ts

scripts/
├── 01-create-schema.sql
└── 02-enhanced-schema.sql
```

---

## Testing

### Load Testing
```bash
# Test supporter registration
k6 run tests/supporter-registration.js

# Test messaging campaigns
k6 run tests/messaging.js
```

### Unit Tests
```bash
pnpm test

# With coverage
pnpm test --coverage
```

### Integration Tests
```bash
pnpm test:integration
```

---

## Troubleshooting

### Issue: QR Code Not Generating
**Solution**: Ensure `qrcode` package is installed:
```bash
pnpm add qrcode
```

### Issue: Storage Upload Failing
**Solution**: Verify Supabase storage buckets exist:
```bash
# Create buckets in Supabase console
- supporter-photos
- volunteer-photos
```

### Issue: Database Connection Error
**Solution**: Check Supabase URL and keys
```bash
# Verify connection
psql $NEXT_PUBLIC_SUPABASE_URL
```

---

## Performance Optimization

### Database Queries
- ✅ Indexed on: `state`, `lga`, `ward`, `support_status`, `volunteer_role`
- ✅ Pagination implemented (default 50 records)
- ✅ RLS policies for row-level security

### Caching
```typescript
// Cache dashboard stats for 5 minutes
const stats = await redis.get('dashboard:stats');
if (!stats) {
  const fresh = await fetchStats();
  await redis.setex('dashboard:stats', 300, fresh);
}
```

### Image Optimization
```typescript
// Use Sharp for image processing
const resized = await sharp(buffer)
  .resize(300, 300)
  .toBuffer();
```

---

## Support & Maintenance

### Regular Tasks
- Monitor message delivery rates
- Review voter tracking accuracy
- Validate supporter data quality
- Backup database daily

### Contact
- Support Email: support@drhalimasulaiman.ng
- Issues: GitHub Issues
- Documentation: /docs

---

*Last Updated: April 8, 2025*
*Version: 2.0*
