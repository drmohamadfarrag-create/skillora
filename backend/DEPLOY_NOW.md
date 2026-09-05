# SKILLORA — Deploy Now

## 1. GitHub
1. Create a repository named `skillora`.
2. Extract this package.
3. Upload all files, including `.github`.
4. Do not upload `.env`.

## 2. Railway database
1. Create a Railway project.
2. Add PostgreSQL.
3. Add a new service from the same GitHub repository.
4. Set the service root directory to `backend`.
5. Railway will use `backend/Dockerfile`.
6. Add environment variables:
   - `DATABASE_URL` = reference the Railway PostgreSQL `DATABASE_URL`
   - `JWT_SECRET` = long random secret
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = leave temporary until the frontend is deployed
   - `RESEND_API_KEY` = your Resend key
   - `EMAIL_FROM` = verified sender, e.g. `SKILLORA <noreply@yourdomain.com>`
7. Deploy.
8. Open `https://YOUR-API-DOMAIN/healthz`. It must return `{"status":"ok",...}`.

The Docker startup runs Prisma migrations and the lesson seed automatically.

## 3. Render frontend
1. Create a Static Site from the same GitHub repository.
2. Root directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Add `VITE_API_URL=https://YOUR-RAILWAY-API-DOMAIN/api`
6. Deploy.

## 4. Connect both services
Copy the final Render URL into Railway:
`FRONTEND_URL=https://YOUR-RENDER-DOMAIN`

Redeploy the Railway API.

## 5. Email
1. Create a Resend account and verify your sending domain.
2. Add the two Railway variables: `RESEND_API_KEY`, `EMAIL_FROM`.
3. Register a test user and confirm the verification email arrives.

## 6. Final smoke test
Register → verify email → login → load lessons → save progress → achievements → certificate verification.
