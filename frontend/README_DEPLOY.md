# Frontend deployment settings

## Render
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variable: `VITE_API_URL=https://YOUR-RAILWAY-API-DOMAIN/api`

After changing `VITE_API_URL`, trigger a new frontend deploy because Vite embeds this value during the build.
