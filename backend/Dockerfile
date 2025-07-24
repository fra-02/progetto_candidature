# Usa un'immagine di base completa per evitare problemi
FROM node:18-bullseye-slim


# Imposta la directory di lavoro
WORKDIR /app

# Copia prima package.json per la cache di Docker
COPY package*.json ./

# Installa TUTTE le dipendenze, incluse le devDependencies
# Questo risolve il problema di 'ts-node' mancante per il seed
RUN npm install

# Copia tutto il resto del codice
COPY . .

# Esegui i comandi di build
RUN npx prisma generate
RUN npm run build

# Esponi la porta dell'applicazione
EXPOSE 3000

# Comando di avvio: migra, fai il seed, e avvia il server
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/server.js"]