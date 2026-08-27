#!/usr/bin/env sh
set -eu

echo "Installing backend dependencies..."
cd backend
npm install
npx prisma generate
echo "Production preparation complete."
