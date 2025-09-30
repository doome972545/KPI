# เลือก Node version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json และ package-lock.json ก่อน
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# Copy source code ทั้งหมด
COPY . .

# สร้าง Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port ที่ app จะรัน
EXPOSE 3000

# คำสั่งรัน backend
CMD ["node", "dist/server.js"]
