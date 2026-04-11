# Deployment & Migration Checklist

## Pre-Deployment Verification

Use this checklist to ensure all features are properly integrated and ready for deployment.

---

## ✅ Phase 1: Code & Dependencies (Day 1)

### Repository Setup
- [ ] All new files created and committed
- [ ] Dependencies installed (`pnpm install`)
- [ ] No TypeScript errors (`pnpm run build`)
- [ ] Linting passes (`pnpm run lint`)
- [ ] Code reviewed by team

### Environment Configuration
- [ ] `.env.local` created from `.env.example`
- [ ] Supabase URL verified
- [ ] Supabase keys valid
- [ ] Resend API key obtained and set
- [ ] reCAPTCHA keys obtained and set
- [ ] Secret keys are strong and unique

### Dependencies Verification
```bash
pnpm list qrcode papaparse react-google-recaptcha resend sharp
```
- [ ] All packages installed correctly
- [ ] Versions match package.json

---

## ✅ Phase 2: Database Migration (Day 1-2)

### Database Schema
- [ ] Backup existing database
- [ ] Review schema migration script (`scripts/02-enhanced-schema.sql`)
- [ ] Run schema migration in development environment
- [ ] Verify all tables created:
  - [ ] `supporters`
  - [ ] `voter_tracking`
  - [ ] `messaging_campaigns`
  - [ ] `message_delivery`
  - [ ] `ward_statistics`
  - [ ] `audit_logs`

### Table Verification
```sql
-- Run in Supabase SQL editor
\dt  -- List all tables
```

### Indexes Verification
```sql
SELECT indexname FROM pg_indexes WHERE tablename IN 
('supporters', 'voter_tracking', 'messaging_campaigns', 'message_delivery');
```
- [ ] All indexes created successfully

### RLS Policies
```sql
SELECT * FROM pg_policies;
```
- [ ] RLS policies enabled for admin tables
- [ ] Row level security working correctly

### Storage Buckets
- [ ] Create bucket: `supporter-photos`
- [ ] Create bucket: `volunteer-photos`
- [ ] Set appropriate permissions

---

## ✅ Phase 3: Local Testing (Day 2-3)

### Start Development Server
```bash
pnpm dev
```
- [ ] Server starts without errors
- [ ] No console warnings related to new code

### Supporter Registration
- [ ] Access `/supporter` page
- [ ] Fill form with valid data
- [ ] Submit form successfully
- [ ] Unique ID generated
- [ ] QR code generated
- [ ] Confirmation email sent
- [ ] SMS confirmation working (if configured)
- [ ] WhatsApp confirmation working (if configured)

### Admin Dashboard
- [ ] Access `/admin` (with login)
- [ ] Dashboard loads successfully
- [ ] Real-time stats visible
- [ ] Charts render correctly
- [ ] CSV export works

### Volunteer Management
- [ ] Create volunteer record (admin)
- [ ] Assign role successfully
- [ ] Assign LGA/Ward correctly
- [ ] Update status to approved

### Voter Tracking
- [ ] Create voter tracking record
- [ ] Filter by LGA/Ward
- [ ] Filter by support status
- [ ] Statistics calculate correctly

### Messaging
- [ ] Create SMS campaign
- [ ] Create WhatsApp campaign
- [ ] Select target groups
- [ ] Send test campaign
- [ ] Verify delivery (check mock/test mode)

---

## ✅ Phase 4: Integration Testing (Day 3-4)

### API Endpoints
- [ ] Test POST `/api/supporters` with valid data
- [ ] Test GET `/api/supporters?lga=Lagos`
- [ ] Test POST `/api/admin/volunteers`
- [ ] Test GET `/api/admin/volunteers?role=Field Agent`
- [ ] Test POST `/api/admin/voter-tracking`
- [ ] Test GET `/api/admin/voter-tracking?lga=Lagos`
- [ ] Test POST `/api/admin/messaging/campaigns`
- [ ] Test GET `/api/admin/dashboard/stats`

### Error Handling
- [ ] Invalid email rejected
- [ ] Duplicate email handled
- [ ] Missing required fields caught
- [ ] Invalid phone numbers rejected
- [ ] File upload size limits enforced
- [ ] File type validation works

### Security Testing
- [ ] Unauthorized access blocked
- [ ] Admin routes protected
- [ ] Middleware working correctly
- [ ] CORS properly configured
- [ ] Security headers present

---

## ✅ Phase 5: Staging Deployment (Day 4-5)

### Build & Deploy
```bash
pnpm build
```
- [ ] Build completes without errors
- [ ] No critical warnings

### Deploy to Staging
- [ ] Push to staging branch
- [ ] CI/CD pipeline runs successfully
- [ ] All checks pass
- [ ] Deploy to staging environment

### Staging Verification
- [ ] Access staging URL
- [ ] All pages load correctly
- [ ] Database connected
- [ ] External services responding
- [ ] Logs clean

### Staging Testing
- [ ] Full registration flow works
- [ ] Admin dashboard functional
- [ ] Messaging works
- [ ] File uploads work
- [ ] All API endpoints respond

### Load Testing
```bash
# Simple load test
k6 run tests/supporter-registration.js --vus 10 --duration 30s
```
- [ ] System handles load
- [ ] No timeout errors
- [ ] Database performs well
- [ ] Memory usage reasonable

---

## ✅ Phase 6: User Acceptance Testing (Day 5-6)

### Admin Training
- [ ] Admins trained on new features
- [ ] Documentation reviewed
- [ ] Questions answered

### UAT Scenarios
- [ ] Register multiple supporters
- [ ] Create volunteer team
- [ ] Track voter interactions
- [ ] Send messaging campaign
- [ ] View dashboard analytics
- [ ] Export data to CSV

### Feedback Collection
- [ ] Gather admin feedback
- [ ] Track any issues
- [ ] Document improvements

---

## ✅ Phase 7: Production Deployment (Day 7)

### Pre-Production Checklist
- [ ] All staging tests passed
- [ ] No critical bugs identified
- [ ] Performance acceptable
- [ ] Security audit passed
- [ ] Stakeholder sign-off obtained

### Backup & Rollback Plan
- [ ] Database backup created
- [ ] Previous version deployed and tested
- [ ] Rollback procedure documented
- [ ] Team knows how to rollback

### Production Deployment
- [ ] Scheduled maintenance window
- [ ] Notification sent to users (if needed)
- [ ] Deploy to production
- [ ] Verify all systems operational

### Post-Deployment Monitoring
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review audit logs
- [ ] Monitor database usage
- [ ] Check API response times

---

## ✅ Phase 8: Post-Production (Ongoing)

### Initial Hours
- [ ] Monitor system closely
- [ ] Check error logs
- [ ] Respond to any issues
- [ ] Keep team on standby for rollback

### First Week
- [ ] Monitor key metrics
- [ ] Address any bugs
- [ ] Collect user feedback
- [ ] Optimize performance if needed

### Ongoing Maintenance
- [ ] Weekly security checks
- [ ] Monthly backup verification
- [ ] Quarterly code review
- [ ] Regular dependency updates

---

## 🔐 Security Checklist

Before going live, verify:

- [ ] All passwords changed from defaults
- [ ] Database backups encrypted
- [ ] API keys rotated
- [ ] SSL/TLS certificates valid
- [ ] CORS properly configured
- [ ] HTTPS enforced in production
- [ ] Security headers in place
- [ ] Input validation working
- [ ] Output encoding enabled
- [ ] SQL injection prevention active
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Rate limiting configured
- [ ] Admin routes authenticated
- [ ] Audit logging working

---

## 📊 Critical Metrics to Monitor

Post-deployment monitoring:

```
Performance Metrics:
- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] Database query time < 100ms

Availability:
- [ ] Uptime > 99.9%
- [ ] Error rate < 0.1%
- [ ] Failed requests < 1%

Security:
- [ ] No 403/401 errors from legitimate users
- [ ] No SQL errors in logs
- [ ] Audit logs complete
- [ ] No sensitive data in logs

Feature Adoption:
- [ ] Registration conversion rate
- [ ] Volunteer signup rate
- [ ] Messaging campaign effectiveness
- [ ] Dashboard usage frequency
```

---

## 🚨 Emergency Procedures

### If Critical Bug Found

1. **Assess Severity**
   - Critical (users blocked): Immediate action
   - Major (feature broken): Urgent fix
   - Minor (cosmetic): Schedule fix

2. **Document Issue**
   - Create bug report
   - Include error logs
   - Note reproduction steps

3. **Implement Fix**
   - Fix in development
   - Test thoroughly
   - Deploy to production

4. **Rollback if Necessary**
   ```bash
   git revert [commit-hash]
   pnpm deploy production
   ```

5. **Post-Incident**
   - Root cause analysis
   - Preventive measures
   - Update documentation

### If Database Issue

1. **Stop new data writes** (if critical)
2. **Restore from backup**
3. **Verify data integrity**
4. **Resume operations**
5. **Investigate cause**

---

## 📋 Handoff Checklist

When handing off to operations team:

- [ ] All documentation reviewed
- [ ] Contact information provided
- [ ] Emergency procedures explained
- [ ] Escalation path defined
- [ ] Training completed
- [ ] Support tickets configured
- [ ] Monitoring dashboards set up
- [ ] Backup procedures documented

---

## ✨ Success Criteria

Project considered successfully deployed when:

- ✅ All features working in production
- ✅ No critical bugs remaining
- ✅ Performance meets targets
- ✅ Security audit passed
- ✅ Team trained and confident
- ✅ Documentation complete
- ✅ Monitoring in place
- ✅ Rollback procedure verified
- ✅ User feedback positive
- ✅ Metrics tracking

---

## 📞 Support Contacts

- **Technical Lead**: [Name & Contact]
- **Database Admin**: [Name & Contact]
- **Security Officer**: [Name & Contact]
- **Project Manager**: [Name & Contact]
- **Emergency Contact**: [Name & Contact]

---

## 📝 Sign-Off

### Development Team
- [ ] Code review completed
- [ ] Testing completed
- [ ] Approved for staging

**Signed**: ___________________  Date: _____

### QA Team
- [ ] All tests passed
- [ ] No critical issues
- [ ] Approved for production

**Signed**: ___________________  Date: _____

### Project Manager
- [ ] Stakeholder approval obtained
- [ ] Timeline met
- [ ] Approved for production

**Signed**: ___________________  Date: _____

### Operations Team
- [ ] Deployment procedure reviewed
- [ ] Emergency plan understood
- [ ] Ready to support

**Signed**: ___________________  Date: _____

---

*Checklist Created: April 8, 2025*  
*Last Updated: [Date]*  
*Next Review: [Date]*
