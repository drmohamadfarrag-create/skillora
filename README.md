# SKILLORA — Integrated Production Release

This package consolidates the five development phases into one runnable monorepo.

## What is included
- Frontend: React/Vite learning platform shell
- Backend: Express API
- PostgreSQL: Prisma schema
- Authentication: registration, verification-token architecture, login, JWT/refresh sessions
- Learning: 17-lesson catalog and reusable lesson engine
- Progress, attempts, hints and completion persistence
- Dashboard competency model
- Achievements
- Certificate issuance and public verification
- Docker development/production examples
- CI workflow
- Environment templates
- Launch checklist

## Local quick start
1. `cp .env.example .env`
2. `docker compose up -d db`
3. `cd backend && npm install && npx prisma generate && npx prisma migrate dev --name init && node prisma/seed.js`
4. `npm run dev`
5. In another terminal: `cd frontend && npm install && npm run dev`

## Important production configuration
Set real SMTP/provider credentials, managed PostgreSQL URL, domain, HTTPS, monitoring DSN and secrets before public launch.
