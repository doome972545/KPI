FROM node:20-alpine

WORKDIR /app

# Copy package.json ก่อน
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Run migrations แล้ว start server
CMD npx prisma migrate deploy && node dist/server.js
