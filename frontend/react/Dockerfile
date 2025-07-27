FROM node:20

# Impostiamo la directory di lavoro all'interno del container.
WORKDIR /app


COPY package*.json ./

# Installiamo le dipendenze.
RUN npm install


COPY . .

# Esponiamo la porta 5173, che è quella di default per Vite.
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]