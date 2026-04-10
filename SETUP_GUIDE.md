# Dr. Halima Suleiman Zakari Campaign Website - Setup Guide

## Project Overview

This is a comprehensive political campaign website built with Next.js 16, featuring:
- Bilingual support (English & Hausa)
- Campaign information pages
- Volunteer registration system
- Donation tracking
- Admin dashboard
- Supabase database backend

## Completed Setup

### Database
- Supabase PostgreSQL with 8 tables: users, volunteers, donations, news, newsletter_subscribers, contact_submissions, gallery
- Row Level Security (RLS) policies enabled
- Ready for data persistence

### Frontend Pages
- Homepage with campaign pillars and stats
- About page with candidate biography
- Platform page with detailed policy areas
- Vision page with roadmap
- Gallery with image management
- News/Blog section
- Contact form
- Volunteer registration form
- Donation page

### Admin Dashboard
- Protected login page
- Admin dashboard with statistics
- Volunteers management
- Donation tracking
- Contact message management

## Integration Setup Instructions

### 1. Email Integration (Resend)

To enable email notifications:

1. Install Resend package:
```bash
npm install resend
```

2. Add to package.json dependencies:
```json
"resend": "^2.0.0"
```

3. Set environment variable:
```
RESEND_API_KEY=your_resend_api_key
```

4. Update email routes:
- `/app/api/contact/route.ts` - Add email confirmation for contact submissions
- `/app/api/volunteers/route.ts` - Add confirmation for volunteer signups
- `/app/api/donations/route.ts` - Add donation receipt emails

Example implementation:
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'campaign@halima2025.ng',
  to: email,
  subject: 'Thank you for joining us',
  html: '<p>Your message has been received</p>'
});
```

### 2. Stripe Payment Integration

To enable donations:

1. Install Stripe packages:
```bash
npm install stripe @stripe/stripe-js
```

2. Set environment variables:
```
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_public_key
```

3. Create payment intent route at `/app/api/payments/route.ts`:
```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { amount, email } = await request.json();
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'ngn',
    receipt_email: email,
  });
  
  return Response.json({ clientSecret: paymentIntent.client_secret });
}
```

4. Update donate page with Stripe checkout integration

### 3. Admin Account Setup

To create your first admin account:

1. Run a script or use the database directly to insert:
```sql
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('admin@halima2025.ng', '$2a$12$...hashed_password...', 'Admin User', 'admin');
```

2. Use the password hashing utility in `/lib/auth.ts`

3. Access admin panel at `/admin/login`

### 4. Newsletter Integration

To enable email newsletter:

1. Integrate with Mailchimp, Brevo, or similar service
2. Update newsletter subscription API
3. Add newsletter form to footer

## Environment Variables Required

```
# Supabase (auto-configured)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email (Resend)
RESEND_API_KEY=

# Payments (Stripe)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Optional
NEXT_PUBLIC_SITE_URL=https://halima2025.ng
NODE_ENV=production
```

## Features to Complete

### High Priority
- [ ] Email confirmations for forms (Resend integration)
- [ ] Stripe payment processing for donations
- [ ] Admin authentication middleware protection
- [ ] WhatsApp integration for floating button
- [ ] Countdown timer to election day

### Medium Priority
- [ ] Newsletter signup automation
- [ ] SMS notifications for volunteers
- [ ] Analytics dashboard (Google Analytics)
- [ ] Testimonials/reviews section
- [ ] Event calendar integration

### Future Enhancements
- [ ] Mobile app version
- [ ] Live polling feature
- [ ] Video testimonials section
- [ ] Real-time donation ticker
- [ ] Social media feed integration
- [ ] Merchandise store

## Deployment

### Vercel Deployment
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel deploy
```

### Custom Domain
1. Add domain in Vercel project settings
2. Update DNS records
3. Enable HTTPS auto-renewal

## Database Backups

Supabase provides:
- Automatic daily backups
- Point-in-time recovery
- Manual backup/restore via dashboard

## Monitoring & Analytics

To add monitoring:
1. Enable Vercel Analytics (already included)
2. Set up Sentry for error tracking
3. Configure Google Analytics
4. Monitor database usage in Supabase dashboard

## Support & Troubleshooting

### Common Issues

1. **Donations not processing**: Check Stripe API keys in environment
2. **Emails not sending**: Verify Resend API key and email address
3. **Volunteers not appearing**: Check Supabase RLS policies
4. **Admin login fails**: Verify password hash in database

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Resend Documentation](https://resend.com/docs)
