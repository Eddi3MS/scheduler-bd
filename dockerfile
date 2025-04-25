FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g typescript
RUN tsc

EXPOSE 3000

CMD ["node", "dist/app.js"]
