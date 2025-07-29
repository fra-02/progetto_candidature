
# Progetto: Tool di Gestione Candidature via WhatsApp

Questo repository contiene il codice sorgente per un'applicazione full-stack progettata per gestire le candidature lavorative ricevute tramite un bot WhatsApp. Il sistema permette agli operatori HR e ai manager di visualizzare, valutare, modificare e gestire i candidati in un'interfaccia web moderna e reattiva.

Il progetto è stato sviluppato seguendo i requisiti di un'applicazione **production-grade**, con un backend sicuro e scalabile, un frontend modulare e un ambiente di sviluppo completamente containerizzato con Docker.

## Indice

1.  [**Architettura e Stack Tecnologico**](#architettura-e-stack-tecnologico)
2.  [**Guida all'Installazione e Avvio**](#guida-allinstallazione-e-avvio)
3.  [**Funzionalità Implementate**](#funzionalità-implementate)
4.  [**Dettagli del Backend**](#dettagli-del-backend)
    -   [Schema del Database](#schema-del-database)
    -   [Struttura delle API (Endpoints)](#struttura-delle-api-endpoints)
    -   [Sicurezza](#sicurezza)
5.  [**Dettagli del Frontend**](#dettagli-del-frontend)
    -   [Architettura e Struttura](#architettura-e-struttura-frontend)
    -   [Gestione dello Stato](#gestione-dello-stato)
6.  [**Flussi di Lavoro dello Sviluppatore**](#flussi-di-lavoro-dello-sviluppatore)
    -   [Gestione delle Migrazioni](#gestione-delle-migrazioni)
    -   [Reset del Database (Seeding)](#reset-del-database-seeding)
7.  [**Analisi e Sfide Affrontate**](#analisi-e-sfide-affrontate)
8.  [**Stato di Avanzamento e Passi Futuri**](#stato-di-avanzamento-e-passi-futuri)

---

## Architettura e Stack Tecnologico

Il progetto segue un'architettura a microservizi containerizzati, orchestrati tramite Docker Compose per garantire un ambiente di sviluppo coerente e facilmente riproducibile (Dev/Prod Parity).

-   **Backend:**
    -   **Linguaggio:** TypeScript
    -   **Framework:** Node.js con Express.js
    -   **ORM:** Prisma
    -   **Database:** MariaDB
    -   **Autenticazione:** JWT (JSON Web Tokens) e API Key

-   **Frontend:**
    -   **Linguaggio:** TypeScript
    -   **Framework:** React (con Vite)
    -   **Styling:** Tailwind CSS
    -   **Routing:** React Router
    -   **Chiamate API:** Axios
    -   **State Management:** React Context API + `useReducer`

-   **Infrastruttura e DevOps:**
    -   **Containerizzazione:** Docker & Docker Compose
    -   **Database Management:** Adminer
---

## Guida all'Installazione e Avvio

Per avviare l'ambiente di sviluppo, sono necessari solo **Git** e **Docker Desktop**.

1.  **Clonare il Repository:**
    ```bash
    git clone https://github.com/fra-02/progetto_candidature.git
    cd progetto_candidature
    ```

2.  **Configurare le Variabili d'Ambiente:**
    *   **Backend:** Nella cartella `backend/`, rinominare il file `.env.example` in `.env` e personalizzare le variabili se necessario (i valori di default sono già configurati per funzionare con Docker Compose).
    *   **Frontend:** Nella cartella `frontend/react/`, creare un file `.env.local` e aggiungere la seguente riga:
        ```env
        VITE_API_BASE_URL=http://localhost:3000/api
        ```

3.  **Avviare l'Ambiente Docker:**
    Dalla cartella principale del progetto, eseguire il seguente comando:
    ```bash
    docker compose up --build
    ```
    *   `--build`: È necessario solo la prima volta o dopo aver modificato le dipendenze (`package.json`) o i `Dockerfile`.
    *   Il comando costruirà le immagini, avvierà tutti i container, applicherà le migrazioni del database e avvierà i server.

4.  **Accedere ai Servizi:**
    *   **Frontend Application:** [http://localhost:5173](http://localhost:5173)
    *   **Backend API:** `http://localhost:3000`
    *   **Adminer (Database GUI):** [http://localhost:8080](http://localhost:8080)

5.  **Popolare il Database (Seeding):**
    Il database verrà creato vuoto. Per popolarlo con 25 candidati di test, aprire un **nuovo terminale** e lanciare il comando di seed:
    ```bash
    docker compose exec backend npm run db:seed
    ```
    Il file `seed.ts` va inserito in `backend/prisma/`.

---

## Funzionalità Implementate

L'applicazione soddisfa e supera tutti i requisiti di base, fornendo un ciclo di gestione completo per le candidature.

-   **Autenticazione Sicura:** Login per operatori basato su JWT con password hashate. L'accesso del bot esterno è protetto da API Key.
-   **Dashboard Candidati:** Una vista tabellare, paginata e reattiva che mostra tutti i candidati.
-   **Sistema di Filtri Avanzato:** Funzionalità di ricerca per nome e filtri combinabili per stato e competenze, accessibili tramite un pannello a scomparsa per una UI pulita.
-   **Gestione CRUD Completa:**
    -   **Creazione:** Nuove candidature vengono create tramite l'endpoint del bot.
    -   **Lettura:** Visualizzazione sia della lista completa che della pagina di dettaglio di un singolo candidato.
    -   **Modifica:** Gli operatori possono modificare le informazioni principali di un candidato (nome, email, stato, etc.).
    -   **Cancellazione:** I candidati possono essere eliminati in modo sicuro previa conferma.
-   **Sistema di Revisione in Due Fasi:**
    -   **Fase 1:** Valutazione basata su una checklist di criteri predefiniti con un sistema di punteggio a stelle e note testuali.
    -   **Fase 2:** Assegnazione di un punteggio finale, decisione di assunzione (Sì/No) e un commento conclusivo.
-   **Logging delle Richieste:** Ogni richiesta API al backend viene registrata in un'apposita tabella (`RequestLog`) per scopi di auditing, sicurezza e debugging.
-   **Stato Globale Centralizzato:** Il frontend utilizza uno store (React Context API) per una gestione efficiente e consistente dei dati, migliorando le performance e riducendo le chiamate API ridondanti.

---

## Dettagli del Backend

Il backend è costruito come un'API RESTful modulare, sicura e scalabile.

### Schema del Database

Lo schema è definito in `backend/prisma/schema.prisma` e gestito tramite **Prisma ORM**. Include i seguenti modelli principali:
-   **`User`**: Contiene gli operatori del sistema, con username e password hashata.
-   **`Candidate`**: Rappresenta un singolo candidato, con i suoi dati anagrafici, le risposte grezze dal bot e lo stato attuale.
-   **`Tag`**: Una tabella per le competenze (es. "React", "Docker"), che permette una categorizzazione flessibile.
-   **`Review`**: Contiene i dati strutturati delle revisioni di Fase 1 (`criteriaRatings`) e Fase 2 (`finalScore`, `hireDecision`).
-   **`RequestLog`**: Registra i metadati di ogni richiesta API in entrata.

Le relazioni chiave includono una **Molti-a-Molti** tra `Candidate` e `Tag`, e una **Uno-a-Molti** tra `Candidate` e `Review`.

### Struttura delle API (Endpoints)

L'API RESTful è organizzata in modo modulare con una chiara separazione delle responsabilità (`routes/`, `controllers/`, `middlewares/`). Tutti gli endpoint sono prefissati con `/api`.

#### **Autenticazione (`/api/auth`)**
**`POST /auth/login`**
-   **Descrizione:** Autentica un utente tramite username e password.
-   **Autenticazione:** Pubblico, ma protetto da `rate limiter`.
-   **Success Response (`200 OK`):** Restituisce un token JWT.

#### **Candidati (`/api/candidates`)**
**`POST /`**
-   **Descrizione:** Crea un nuovo candidato (usato dal bot WhatsApp).
-   **Autenticazione:** Richiede un header `x-api-key` valido.
-   **Success Response (`201 Created`):** Restituisce un messaggio di successo e l'ID del candidato creato.

**`GET /`**
-   **Descrizione:** Recupera la lista di tutti i candidati, includendo le relazioni `reviews` e `tags`.
-   **Autenticazione:** Richiede un token JWT (`Bearer ...`).
-   **Success Response (`200 OK`):** Restituisce un array di oggetti `Candidate`.

**`GET /:id`**
-   **Descrizione:** Recupera i dettagli di un singolo candidato.
-   **Autenticazione:** Richiede un token JWT.
-   **Success Response (`200 OK`):** Restituisce un singolo oggetto `Candidate` completo.

**`PUT /:id`**
-   **Descrizione:** Aggiorna le informazioni di un candidato.
-   **Autenticazione:** Richiede un token JWT.
-   **Success Response (`200 OK`):** Restituisce l'oggetto `Candidate` aggiornato.

**`DELETE /:id`**
-   **Descrizione:** Elimina un candidato e le sue revisioni associate.
-   **Autenticazione:** Richiede un token JWT.
-   **Success Response (`204 No Content`):** Nessun corpo nella risposta.

#### **Revisioni (sotto `/api/candidates/:id`)**
**`POST /:id/phase-one`**
-   **Descrizione:** Crea una revisione di Fase 1 per un candidato.
-   **Autenticazione:** Richiede un token JWT.
-   **Success Response (`201 Created`):** Restituisce il nuovo oggetto `Review`.

**`POST /:id/phase-two`**
-   **Descrizione:** Crea una revisione di Fase 2 per un candidato.
-   **Autenticazione:** Richiede un token JWT.
-   **Success Response (`201 Created`):** Restituisce il nuovo oggetto `Review`.

#### **Tag (`/api/tags`)**
**`GET /`**
-   **Descrizione:** Recupera la lista completa di tutti i tag disponibili.
-   **Autenticazione:** Richiede un token JWT.
-   **Success Response (`200 OK`):** Restituisce un array di oggetti `Tag`.

### Sicurezza

Sono state implementate diverse misure di sicurezza:
-   **Autenticazione JWT & API Key:** Accesso differenziato per operatori e bot.
-   **Password Hashing:** Le password degli utenti sono salvate in modo sicuro usando `bcryptjs`.
-   **Rate Limiting Granulare:** Limiti di richieste diversi per bot e utenti per prevenire abusi.
-   **Validazione dell'Input:** Controlli base sui parametri e sul corpo delle richieste.

---

## Dettagli del Frontend

Il frontend è una Single Page Application (SPA) costruita per essere veloce, reattiva e manutenibile.

### Architettura e Struttura (Frontend)

-   **`pages/`**: Componenti di alto livello che rappresentano una pagina intera (es. `DashboardPage`, `LoginPage`).
-   **`components/`**: "Mattoncini" riutilizzabili suddivisi per contesto (es. `candidates/`, `reviews/`, `ui/`).
-   **`services/`**: Logica di comunicazione con il backend, con `apiService.ts` che centralizza la configurazione di Axios.
-   **`store/`**: Logica per lo state management globale (tipi, reducer, contesto).
-   **`config/`**: File di configurazione statici (es. `reviewCriteria.ts`).

### Gestione dello Stato

Lo stato globale è gestito tramite **React Context API** e l'hook **`useReducer`**, un pattern che offre i vantaggi di Redux senza librerie esterne.
-   **`state`**: Un unico oggetto contiene i dati condivisi (`candidates`, `availableTags`), lo stato di caricamento e gli errori.
-   **`dispatch`**: I componenti spediscono **azioni** (es. `{ type: 'DELETE_CANDIDATE_SUCCESS', ... }`) per modificare lo stato.
-   **`reducer`**: Una funzione pura riceve l'azione e calcola il nuovo stato in modo prevedibile.

Questo approccio garantisce un flusso di dati unidirezionale, rende l'applicazione più facile da debuggare e migliora le performance, ad esempio con una strategia "store-first, API-fallback" per caricamenti quasi istantanei.

---

## Flussi di Lavoro dello Sviluppatore

### Gestione delle Migrazioni

Il database viene gestito tramite **Prisma Migrate**.
1.  **Modificare lo Schema:** Le modifiche vanno fatte nel file `backend/prisma/schema.prisma`.
2.  **Creare una Nuova Migrazione:** Eseguire il seguente comando dalla root del progetto:
    ```bash
    docker compose run --rm backend npm run migrate:dev -- --name "nome-descrittivo-migrazione"
    ```
    Questo comando è **manuale** e i file generati in `backend/prisma/migrations` **devono essere committati** in Git.
3.  **Applicare le Migrazioni:** Le migrazioni vengono applicate **automaticamente** all'avvio del container `backend` grazie allo script di `entrypoint`.

### Reset del Database (Seeding)

Per ripopolare il database con dati di test:
1.  Assicurarsi che i container siano in esecuzione.
2.  Eseguire il comando dalla root del progetto:
    ```bash
    docker compose exec backend npm run db:seed
    ```
    Questo comando è **manuale** per preservare i dati tra le sessioni di sviluppo.

---

## Analisi e Sfide Affrontate

-   **Problemi di Configurazione Docker:** La sfida iniziale è stata creare un `docker-compose.yml` e dei `Dockerfile` che gestissero l'hot-reloading. Sono stati risolti problemi di sincronizzazione dei volumi e di dipendenze tra servizi, usando `healthcheck` per garantire che il backend si avvii solo dopo che il database è pronto.

-   **Errori di Tipo Cross-Environment (TypeScript):** È stato necessario configurare `binaryTargets` in `schema.prisma` per generare i motori di query sia per l'ambiente di sviluppo locale (es. macOS/Windows) che per l'ambiente di esecuzione del container (Linux). Inoltre, `tsconfig.json` è stato ottimizzato per garantire la compatibilità dei moduli.

---

## Stato di Avanzamento e Passi Futuri

Questo elenco riassume lo stato del progetto rispetto ai requisiti e delinea i possibili miglioramenti.

### Stato Attuale vs Requisiti Minimi

#### Backend
*   **REST API CRUD per i candidati:** ✅ **Completato e Superato.**
*   **Endpoint per il bot (con API-Key):** ✅ **Completato.**
*   **Endpoint autenticato per operatori (JWT):** ✅ **Completato.**

#### Frontend
*   **Login finto ma persistente:** ✅ **Superato.** Implementato un sistema di login reale e persistente.
*   **Visualizzazione candidati (stato, tag, paginazione):** ✅ **Completato.**
*   **Filtro avanzato combinato:** ✅ **Completato.**

#### Fullstack & DevOps
*   **Dockerizzazione completa:** 🟠 **Quasi Completato.** Servizi `backend`, `frontend` (dev), `db`, `adminer` sono containerizzati.
*   **Test automatici (1 backend, 1 frontend):** ❌ **MANCANTE.**
*   **Nginx configurato (SSL, routing):** ❌ **MANCANTE.**

### Miglioramenti Possibili

-   **Test Automatici:** Implementare una suite di test (unitari, integrazione, e2e).
-   **Configurazione di Produzione con Nginx:** Creare un `docker-compose.prod.yml` che includa un reverse proxy Nginx per gestire il traffico, servire il build statico del frontend e gestire SSL.
-   **Notifiche:** Aggiungere un sistema di notifiche (es. email, Slack) per avvisare di nuove candidature.
-   **Dashboard con Analytics:** Implementare grafici e statistiche sull'andamento delle candidature.
-   **UI/UX Avanzata:** Migliorare l'interfaccia con animazioni, "toast" di notifica e una gestione più raffinata del loading.
-   **CI/CD Pipeline:** Configurare una pipeline (es. con GitHub Actions) per automatizzare test e deploy.