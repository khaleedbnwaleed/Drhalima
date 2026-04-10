# Dr. Halima Suleiman Zakari Campaign Website

A comprehensive, multilingual political campaign website built with Next.js 16, featuring campaign information, volunteer coordination, donation management, voter tracking, and an advanced admin dashboard.

**Version 2.0 - Enhanced with new supporter management, analytics, and messaging capabilities**

## ✨ New Features (v2.0)

### 🎯 Supporter Registration Enhancement
- ✅ Unique Supporter ID generation (SUP-YYYY-XXXXXX)
- ✅ QR code generation for easy sharing and verification
- ✅ Profile photo upload with cloud storage
- ✅ PVC (Voter Card) verification
- ✅ Auto SMS/WhatsApp confirmation
- ✅ Multi-step registration form

### 👥 Volunteer Management
- ✅ Enhanced volunteer registration with role assignment
- ✅ Role types: Field Agent, Media, Polling Unit Agent
- ✅ LGA/Ward assignment and tracking
- ✅ Availability scheduling
- ✅ Status management (pending, approved, active, rejected)
- ✅ Passport photo upload

### 📊 Voter Mobilization Tracking
- ✅ Support status tracking (Strong Supporter, Undecided, Opponent)
- ✅ Ward-level tracking and statistics
- ✅ Volunteer to voter assignment
- ✅ Contact history and interaction logs
- ✅ Real-time ward performance dashboard

### 📈 Admin Dashboard Upgrade
- ✅ Real-time statistics (supporters, volunteers, donations)
- ✅ Interactive charts and graphs (Recharts)
- ✅ Top performing LGAs ranking
- ✅ Recent messaging campaigns list
- ✅ CSV/Excel export functionality
- ✅ 5-minute auto-refresh

### 💬 Bulk Messaging Feature
- ✅ Email notifications (Resend)
- ✅ Campaign creation and scheduling
- ✅ Target group filtering (LGA, Ward, Support Level)
- ✅ Delivery tracking and statistics
- ✅ Campaign history and performance

### 🔒 Security Improvements
- ✅ Password hashing with bcryptjs
- ✅ Input validation (Zod) - server-side and client-side
- ✅ reCAPTCHA support
- ✅ Role-based access control (RBAC)
- ✅ Audit logging for all admin actions
- ✅ Security headers (HTTPS, XSS, CSRF protection)
- ✅ SQL injection prevention
- ✅ Row Level Security (RLS) policies

### 📱 UI/UX Enhancements
- ✅ Mobile-first responsive design
- ✅ Multi-step forms for complex flows
- ✅ Loading states and error handling
- ✅ Success notifications
- ✅ Clean Bootstrap-based design
- ✅ Accessibility improvements

## Core Features

### Public Pages
- **Homepage**: Campaign hero with key pillars and statistics
- **About**: Candidate biography and background
- **Platform**: Detailed policy areas and initiatives
- **Vision**: Campaign roadmap and success metrics
- **Gallery**: Photo gallery with categories
- **News**: Blog/news section with updates
- **Contact**: Contact form with validation
- **Supporter**: Enhanced supporter registration with QR code
- **Volunteer**: Enhanced volunteer registration
- **Donate**: Donation page with payment options

### Admin Features
- **Authentication**: Secure admin login with bcrypt password hashing
- **Dashboard**: Real-time overview with interactive charts
- **Analytics**: Campaign analytics with trend analysis
- **Supporter Management**: Manage supporters and track status
- **Volunteer Management**: Manage volunteers and assignments
- **Voter Tracking**: Track voter interactions and support levels
- **Messaging Center**: Send bulk SMS/WhatsApp campaigns
- **Donation Tracking**: Monitor donations and fundraising progress
- **Message Management**: View and respond to contact submissions
- **News Management**: Create and publish campaign updates
- **Audit Logs**: Track all admin actions for security

### Technical Features
- **Bilingual Support**: Full English and Hausa language support
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Database**: Supabase PostgreSQL with Row Level Security
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Real-time charts with Recharts
- **Messaging**: Email notifications via Resend
- **Storage**: Cloud storage for photos via Supabase
- **Email**: Resend API for email notifications
- **SEO**: Metadata and Open Graph tags

## Technology Stack

- **Frontend**: React 19.2, Next.js 16
- **Styling**: Tailwind CSS 4.2, shadcn/ui
- **Database**: Supabase PostgreSQL
- **Authentication**: Custom bcryptjs-based auth
- **Forms**: React Hook Form + Zod
- **Analytics**: Vercel Analytics

## Project Structure

```
├── app/
│   ├── page.tsx                 # Homepage
│   ├── about/page.tsx           # About page
│   ├── platform/page.tsx        # Platform page
│   ├── vision/page.tsx          # Vision page
│   ├── gallery/page.tsx         # Gallery page
│   ├── news/page.tsx            # News page
│   ├── contact/page.tsx         # Contact page
│   ├── volunteer/page.tsx       # Volunteer registration
│   ├── donate/page.tsx          # Donation page
│   ├── admin/
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── login/page.tsx       # Admin login
│   │   ├── volunteers/page.tsx  # Volunteer management
│   │   ├── donations/page.tsx   # Donation management
│   │   ├── messages/page.tsx    # Message management
│   │   └── news/page.tsx        # News management
│   ├── api/
│   │   ├── auth/login/route.ts  # Login endpoint
│   │   ├── volunteers/route.ts  # Volunteer API
│   │   ├── donations/route.ts   # Donation API
│   │   ├── contact/route.ts     # Contact form API
│   │   ├── payments/route.ts    # Payment processing
│   │   └── contact/get/route.ts # Get messages API
│   └── layout.tsx               # Root layout
├── components/
│   ├── header.tsx               # Navigation header
│   ├── footer.tsx               # Footer
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── auth.ts                  # Authentication utilities
│   ├── i18n.ts                  # Internationalization
│   └── utils.ts                 # Utility functions
├── scripts/
│   └── 01-create-schema.sql     # Database schema
├── public/                      # Static assets
└── SETUP_GUIDE.md              # Setup instructions
```

## Database Schema

### Tables
- **users**: Admin accounts
- **volunteers**: Volunteer registrations
- **donations**: Donation records
- **news**: News/blog posts
- **newsletter_subscribers**: Email subscribers
- **contact_submissions**: Contact form submissions
- **gallery**: Gallery images
- **news**: Campaign news

All tables include:
- Automatic timestamps (created_at, updated_at)
- Row Level Security (RLS) policies
- Proper indexes for performance

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account with PostgreSQL database
- (Optional) Stripe account for payments
- (Optional) Resend account for emails

### Installation

1. Clone the repository and install dependencies:
```bash
pnpm install
```

2. Set up environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3. The database schema is automatically created. If needed, run manually:
```bash
npx supabase db push
```

4. Create your first admin user (use Supabase console or API)

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Admin Access

1. Navigate to `/admin/login`
2. Use your admin credentials
3. Manage campaign from the dashboard at `/admin`

## Integration Checklist

- [ ] Email confirmations (Resend integration)
- [ ] Stripe payment processing
- [ ] WhatsApp integration
- [ ] SMS notifications
- [ ] Newsletter automation
- [ ] Google Analytics
- [ ] Social media integration

See `SETUP_GUIDE.md` for detailed integration instructions.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel deploy
```

### Custom Domain
- Add domain in Vercel settings
- Update DNS records
- Enable auto-renewal for HTTPS

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Security

- Passwords are hashed with bcryptjs
- All sensitive data is stored server-side
- HTTP-only cookies for session management
- Environment variables for API keys
- SQL injection prevention with parameterized queries
- CORS protection

## Performance

- Static site generation where possible
- Image optimization with Next.js Image component
- CSS minification with Tailwind
- Database indexing for fast queries
- Caching headers configured

## Troubleshooting

### Database Issues
- Verify Supabase credentials
- Check RLS policies
- Ensure tables are created

### Form Submission Issues
- Check API endpoint availability
- Verify environment variables
- Review browser console for errors

### Authentication Issues
- Clear browser cookies
- Verify password hash format
- Check database user records

## Support

For issues or questions:
1. Check SETUP_GUIDE.md
2. Review documentation links
3. Create an issue on GitHub

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## License

This project is proprietary and confidential for Dr. Halima Suleiman Zakari's 2025 campaign.

## Contact

- Email: campaign@halima2025.ng
- Phone: +234 (0) 801 234 5678
- Website: https://halima2025.ng

---

Built with care for Dr. Halima Suleiman Zakari's 2025 Gubernatorial Campaign
