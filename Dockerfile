FROM node:18.17

WORKDIR /usr/app

# Copy dependency definitions
COPY package.json ./
COPY package-lock.json ./package-lock.json
COPY prisma ./prisma/
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3333

CMD ["npm", "run", "start:dev-swc"]