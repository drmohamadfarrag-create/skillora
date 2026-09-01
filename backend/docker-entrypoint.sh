#!/bin/sh
set -e

echo "[skillora] applying database migrations..."
npx prisma migrate deploy

echo "[skillora] seeding lesson catalog..."
node prisma/seed.js

echo "[skillora] starting API..."
exec node src/server.js
