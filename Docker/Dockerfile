FROM node:18-alpine

WORKDIR /app

COPY application/package*.json ./
RUN npm ci

COPY application/ .

EXPOSE 3000

CMD ["node", "app.js"]

