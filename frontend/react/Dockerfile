# Dockerfile per lo SVILUPPO del frontend

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Avvia il server di sviluppo di Vite, rendendolo accessibile dall'esterno del container
CMD ["npm", "run", "dev", "--", "--host"]