FROM node:20-alpine
WORKDIR /app

COPY package*.json ./

# ติดตั้งทุกอย่าง (รวม devDependencies)
RUN npm install

COPY . .

# run build
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/server.js"]
