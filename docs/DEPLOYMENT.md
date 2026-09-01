# Deployment Runbook

1. Provision managed PostgreSQL and set DATABASE_URL.
2. Generate and store a strong JWT_SECRET in a secret manager.
3. Configure production FRONTEND_URL and VITE_API_URL.
4. Set `RESEND_API_KEY` and `EMAIL_FROM` so verification and password-reset emails send for real (the API already sends them via Resend when these are set; without them it falls back to logging the link instead of emailing it — fine for local dev, not for production).
5. Run `npx prisma migrate deploy`.
6. Deploy API behind HTTPS with a reverse proxy/load balancer.
7. Deploy static frontend.
8. Restrict CORS to the production domain.
9. Configure monitoring, backups and alerts.
10. Run smoke tests: register, verify, login, resume lesson, complete lesson, certificate verify.
