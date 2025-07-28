# Dockerfile per lo SVILUPPO del backend

FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./

# Installa tutte le dipendenze, incluse quelle di sviluppo (nodemon, ts-node)
RUN npm install

COPY . .

# Esponi la porta del backend
EXPOSE 3000

# Comando di avvio per lo SVILUPPO
# 1. Attende che il DB sia pronto
# 2. Applica le migrazioni
# 3. Fa il seed del DB
# 4. Avvia nodemon per l'hot-reloading
CMD ["npm", "run", "dev"]