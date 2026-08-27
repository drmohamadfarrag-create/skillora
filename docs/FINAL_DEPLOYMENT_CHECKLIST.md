# Final Deployment Checklist

## Before GitHub
- [ ] `.env` is not committed
- [ ] `.gitignore` is present
- [ ] Repository is private until launch

## Railway
- [ ] PostgreSQL created
- [ ] Backend service root is `backend`
- [ ] DATABASE_URL linked
- [ ] JWT_SECRET set
- [ ] NODE_ENV=production
- [ ] Health endpoint returns OK

## Render
- [ ] Root directory is `frontend`
- [ ] Build command succeeds
- [ ] VITE_API_URL points to Railway API

## Email
- [ ] Resend sender domain verified
- [ ] RESEND_API_KEY set
- [ ] EMAIL_FROM set
- [ ] Verification email tested

## Production
- [ ] FRONTEND_URL updated to final domain
- [ ] CORS tested
- [ ] Registration tested
- [ ] Login tested
- [ ] Progress persistence tested
- [ ] Certificate verification tested
