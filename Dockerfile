# Mobil Tamircim - Production Dockerfile
FROM node:22-alpine

WORKDIR /app

# Çevre değişkenleri
ENV NODE_ENV=production
ENV PORT=3000

# Kodları ve bağımlılıkları kopyala
COPY package*.json ./
RUN npm install --omit=dev || true

COPY . .

# Kalıcı veriler ve yüklemeler için volume dizinleri
VOLUME ["/app/data", "/app/public/uploads"]

EXPOSE 3000

CMD ["node", "server.js"]
