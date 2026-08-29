FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --no-audit --no-fund

COPY . .

RUN ./node_modules/.bin/prisma generate

EXPOSE 4000

CMD ["sh", "-c", "echo 'STEP 1: Starting migrations' && ./node_modules/.bin/prisma migrate deploy && echo 'STEP 2: Migrations finished - starting API' && exec node src/server.js"]
