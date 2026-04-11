# Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. **Environment Variables Setup**
In your Vercel dashboard, go to your project settings and add these environment variables:

```
# Required Variables
NEXT_PUBLIC_SUPABASE_URL=https://lbhfxmuyzisctobviulo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiaGZ4bXV5emlzY3RvYnZpdWxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc2MDUwMiwiZXhwIjoyMDkxMzM2NTAyfQ.3PCV6-p0su5ZJyz_rb-pJnmwxCiLczHmkU02YNBp_fM
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiaGZ4bXV5emlzY3RvYnZpdWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NjA1MDIsImV4cCI6MjA5MTMzNjUwMn0.b6_OI-ps_b8eTSuBEZypW6RZ0Q8NAO1Hu0xKi0H7XHc

# Optional (for email functionality)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=campaign@drhalimasulaiman.ng

# Security (Generate a new one for production)
JWT_SECRET=your-production-jwt-secret

# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

# Storage Bucket Names
STORAGE_BUCKET_SUPPORTER_PHOTOS=supporter-photos
STORAGE_BUCKET_VOLUNTEER_PHOTOS=volunteer-photos
STORAGE_BUCKET_GALLERY_IMAGES=gallery-images
```

### 2. **Deploy Steps**
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically detect Next.js and deploy
4. The build should now work with npm instead of pnpm

### 3. **Post-Deployment Setup**
After deployment, visit your live site and:
1. Go to `/admin/setup` to create the admin account
2. Use the admin credentials to log in

## 🔧 Troubleshooting

### If you still get pnpm errors:
1. Make sure `pnpm-lock.yaml` is deleted from your repo
2. Ensure `package-lock.json` exists and is up-to-date
3. The `vercel.json` forces npm usage

### If you get build errors:
1. Check that all environment variables are set in Vercel
2. Make sure your Supabase URL and keys are correct
3. Check the Vercel build logs for specific error messages

### Database Setup:
Run these SQL scripts in your Supabase dashboard in order:
1. `scripts/01-create-schema.sql`
2. `scripts/02-enhanced-schema.sql`
3. `scripts/04-create-supporters-table.sql`
4. `scripts/03-sample-data.sql`
5. `scripts/create-admin.sql` (optional - creates default admin account)

## 📝 Notes
- The app uses Next.js 16 with React 19
- Database is Supabase (PostgreSQL)
- Authentication uses bcryptjs for password hashing
- File uploads use Supabase Storage