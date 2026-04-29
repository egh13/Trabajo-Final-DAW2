FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ENV DATABASE_URL="mysql://placeholder:placeholder@localhost:3306/placeholder"

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
