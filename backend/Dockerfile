# Dockerfile per lo SVILUPPO del backend

FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./

# Installa tutte le dipendenze, incluse quelle di sviluppo (nodemon, ts-node)
RUN npm install

COPY . .

# Esponi la porta del backend
EXPOSE 3000


CMD ["npm", "run", "dev"]