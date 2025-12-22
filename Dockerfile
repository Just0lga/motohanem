FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Production modunda bağımlılıkları yükle
RUN npm install --production

COPY . .

# Uygulamanızın çalıştığı port (Genelde 3000 veya 5000)
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "src/index.js"]