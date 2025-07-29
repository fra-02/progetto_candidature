# Progetto: Tool di Gestione Candidature via WhatsApp

Questo repository contiene il codice sorgente per un'applicazione full-stack progettata per gestire le candidature lavorative ricevute tramite un bot WhatsApp. Il sistema permette agli operatori HR e ai manager di visualizzare, valutare, modificare e gestire i candidati in un'interfaccia web moderna e reattiva.

Il progetto è stato sviluppato seguendo i requisiti di un'applicazione **production-grade**, con un backend sicuro e scalabile, un frontend modulare e un ambiente di sviluppo completamente containerizzato con Docker.

## Indice

1.  [**Architettura e Stack Tecnologico**](#architettura-e-stack-tecnologico)
2.  [**Guida all'Installazione e Avvio**](#guida-allinstallazione-e-avvio)
3.  [**Funzionalità Implementate**](#funzionalità-implementate)
4.  [**Dettagli del Backend**](#dettagli-del-backend)
    -   [Schema del Database](#schema-del-database)
    -   [Struttura delle API](#struttura-delle-api)
    -   [Sicurezza](#sicurezza)
5.  [**Dettagli del Frontend**](#dettagli-del-frontend)
    -   [Architettura e Struttura](#architettura-e-struttura-frontend)
    -   [Gestione dello Stato](#gestione-dello-stato)
6.  [**Flussi di Lavoro dello Sviluppatore**](#flussi-di-lavoro-dello-sviluppatore)
    -   [Gestione delle Migrazioni](#gestione-delle-migrazioni)
    -   [Reset del Database (Seeding)](#reset-del-database-seeding)
7.  [**Analisi e Sfide Affrontate**](#analisi-e-sfide-affrontate)

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

![Schema Architettura](URL_IMMAGINE_SCHEMA) <!-- Potresti creare un semplice diagramma qui -->

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
    Il seed.ts va inserito in backend/prisma/

6.  ## Funzionalità Implementate

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
    -   **Fase 1:** Valutazione basata su una checklist di criteri predefiniti (es. competenze tecniche, comunicazione) con un sistema di punteggio a stelle e note testuali.
    -   **Fase 2:** Assegnazione di un punteggio finale, decisione di assunzione (Sì/No) e un commento conclusivo.
-   **Logging delle Richieste:** Ogni richiesta API al backend viene registrata in un'apposita tabella (`RequestLog`) per scopi di auditing, sicurezza e debugging.
-   **Stato Globale Centralizzato:** Il frontend utilizza uno store (React Context API) per una gestione efficiente e consistente dei dati, migliorando le performance e riducendo le chiamate API ridondanti.

---

7. ## Dettagli del Backend

Il backend è costruito come un'API RESTful modulare, sicura e scalabile.

### Schema del Database

Lo schema è definito in `backend/prisma/schema.prisma` e gestito tramite **Prisma ORM**. Include i seguenti modelli principali:
-   **`User`**: Contiene gli operatori del sistema, con username e password hashata.
-   **`Candidate`**: Rappresenta un singolo candidato, con i suoi dati anagrafici, le risposte grezze dal bot e lo stato attuale.
-   **`Tag`**: Una tabella per le competenze (es. "React", "Docker"), che permette una categorizzazione flessibile.
-   **`Review`**: Contiene i dati strutturati delle revisioni di Fase 1 (`criteriaRatings`) e Fase 2 (`finalScore`, `hireDecision`).
-   **`RequestLog`**: Registra i metadati di ogni richiesta API in entrata.

Le relazioni chiave includono una **Molti-a-Molti** tra `Candidate` e `Tag`, e una **Uno-a-Molti** tra `Candidate` e `Review`.

### Struttura delle API

Le API sono organizzate in modo modulare con una chiara separazione delle responsabilità:
-   **`app.ts`**: Punto di ingresso principale, assembla i middleware globali (CORS, JSON parser, logging) e le rotte.
-   **`routes/`**: Ogni file definisce un gruppo di endpoint (es. `candidateRoutes.ts`, `authRoutes.ts`). Qui vengono applicati i middleware specifici come l'autenticazione e il rate limiting.
-   **`controllers/`**: Contengono la logica di business. Ricevono la richiesta, interagiscono con il database tramite Prisma e formulano la risposta.
-   **`middlewares/`**: Contengono la logica riutilizzabile come `jwtAuth`, `apiKeyAuth` e i `rateLimiter`.

### Sicurezza

Sono state implementate diverse misure di sicurezza:
-   **Autenticazione JWT & API Key:** Accesso differenziato per operatori e bot.
-   **Password Hashing:** Le password degli utenti sono salvate in modo sicuro usando `bcryptjs`.
-   **Rate Limiting Granulare:** Limiti di richieste diversi per il bot (più restrittivi) e per gli utenti (più permissivi), applicati a livello di singola rotta per prevenire abusi.
-   **Validazione dell'Input:** I controller eseguono controlli di base sui parametri e sul corpo delle richieste per prevenire errori e crash.

---

8.  ## Dettagli del Frontend

Il frontend è una Single Page Application (SPA) costruita per essere veloce, reattiva e manutenibile.

### Architettura e Struttura (Frontend)

-   **`pages/`**: Componenti di alto livello che rappresentano una pagina intera (es. `DashboardPage`, `LoginPage`).
-   **`components/`**: "Mattoncini" riutilizzabili che compongono le pagine. Sono suddivisi per contesto (es. `candidates/`, `reviews/`, `ui/`).
-   **`services/`**: Contengono la logica di comunicazione con il backend. `apiService.ts` centralizza la configurazione di Axios, mentre `candidateService.ts` definisce le funzioni specifiche per ogni endpoint.
-   **`store/`**: Contiene tutta la logica per lo state management globale, separata in tipi, reducer e contesto.
-   **`config/`**: File di configurazione statici per l'applicazione (es. `reviewCriteria.ts`).

### Gestione dello Stato

Lo stato globale è gestito tramite **React Context API** e l'hook **`useReducer`**, un pattern moderno che offre i vantaggi di Redux senza librerie esterne.
-   **`state`**: Un unico oggetto contiene i dati condivisi (`candidates`, `availableTags`), lo stato di caricamento e gli errori.
-   **`dispatch`**: I componenti non modificano mai lo stato direttamente. Invece, "spediscono" (dispatch) delle **azioni** (es. `{ type: 'DELETE_CANDIDATE_SUCCESS', payload: { id: 1 } }`).
-   **`reducer`**: Una funzione pura riceve l'azione e calcola il nuovo stato in modo prevedibile.

Questo approccio garantisce un flusso di dati unidirezionale, rende l'applicazione più facile da debuggare e migliora le performance evitando chiamate API ridondanti.

---

## Flussi di Lavoro dello Sviluppatore

### Gestione delle Migrazioni

Il database viene gestito tramite **Prisma Migrate**.
1.  **Modificare lo Schema:** Ogni modifica alla struttura del database deve essere fatta nel file `backend/prisma/schema.prisma`.
2.  **Creare una Nuova Migrazione:** Dopo aver modificato lo schema, creare un nuovo file di migrazione eseguendo (dalla root del progetto):
    ```bash
    docker compose run --rm backend npm run migrate:dev -- --name "nome-descrittivo-migrazione"
    ```
    Questo comando va eseguito **manualmente** e i file generati in `backend/prisma/migrations` **devono essere committati** in Git.
3.  **Applicare le Migrazioni:** Le migrazioni vengono applicate **automaticamente** all'avvio del container `backend`.

### Reset del Database (Seeding)

Per ripopolare il database con dati di test puliti:
1.  Assicurarsi che i container siano in esecuzione.
2.  Eseguire il seguente comando dalla root del progetto:
    ```bash
    docker compose exec backend npm run db:seed
    ```
    Questo comando è **manuale** e non viene eseguito all'avvio per preservare i dati di sviluppo tra una sessione e l'altra.

---

## Analisi e Sfide Affrontate

Durante lo sviluppo sono state affrontate e risolte diverse sfide comuni in ambienti full-stack e containerizzati.

-   **Problemi di Configurazione Docker:** La sfida iniziale è stata creare un `docker-compose.yml` e dei `Dockerfile` che gestissero correttamente un ambiente di sviluppo con hot-reloading. Sono stati risolti problemi di:
    -   **Sincronizzazione dei Volumi:** Assicurando che le modifiche al codice locale fossero riflesse immediatamente nei container.
    -   **Dipendenze tra Servizi:** Utilizzo di `healthcheck` per garantire che il backend si avvii solo dopo che il database è completamente pronto, risolvendo errori di connessione all'avvio.

-   **Errori di Tipo Cross-Environment (TypeScript):**
    -   **Prisma `binaryTargets`:** È stato necessario configurare `binaryTargets` in `schema.prisma` per generare i motori di query sia per l'ambiente di sviluppo locale (Windows/macOS) che per l'ambiente di esecuzione del container (Linux).
    -   **Dipendenze di Sviluppo Mancanti:** Come documentato di seguito, l'ambiente di sviluppo locale (VS Code) a volte richiede l'installazione esplicita di pacchetti `@types` per funzionare correttamente.

-   **Troubleshooting Comune - Errori di Tipo in VS Code:**
    A volte, specialmente dopo aver clonato la repository, l'editor VS Code potrebbe mostrare errori di tipo (es. "Cannot find name 'process'") anche se le dipendenze sono state installate da Docker. Questo è spesso un problema di sincronizzazione del TS Server dell'editor.
    -   **Soluzione:** Eseguire `npm install --save-dev @types/node` nella cartella `backend/` per allineare l'ambiente locale. Se persistono errori su tipi specifici di React/JSX, un `npm install` nella cartella `frontend/react/` può risolvere. Dopodiché, è consigliabile **riavviare il TS Server** in VS Code (Ctrl+Shift+P > `TypeScript: Restart TS Server`).


    Perfetto, concludiamo la documentazione con le ultime sezioni.

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

### Struttura delle API

Le API sono organizzate in modo modulare con una chiara separazione delle responsabilità:
-   **`app.ts`**: Punto di ingresso principale, assembla i middleware globali (CORS, JSON parser, logging) e le rotte.
-   **`routes/`**: Ogni file definisce un gruppo di endpoint (es. `candidateRoutes.ts`, `authRoutes.ts`). Qui vengono applicati i middleware specifici come l'autenticazione e il rate limiting.
-   **`controllers/`**: Contengono la logica di business. Ricevono la richiesta, interagiscono con il database tramite Prisma e formulano la risposta.
-   **`middlewares/`**: Contengono la logica riutilizzabile come `jwtAuth`, `apiKeyAuth` e i `rateLimiter`.

### Sicurezza

Sono state implementate diverse misure di sicurezza:
-   **Autenticazione JWT & API Key:** Accesso differenziato per operatori e bot.
-   **Password Hashing:** Le password degli utenti sono salvate in modo sicuro usando `bcryptjs`.
-   **Rate Limiting Granulare:** Limiti di richieste diversi per il bot (più restrittivi) e per gli utenti (più permissivi), applicati a livello di singola rotta per prevenire abusi.
-   **Validazione dell'Input:** I controller eseguono controlli di base sui parametri e sul corpo delle richieste per prevenire errori e crash.

---

## Dettagli del Frontend

Il frontend è una Single Page Application (SPA) costruita per essere veloce, reattiva e manutenibile.

### Architettura e Struttura (Frontend)

-   **`pages/`**: Componenti di alto livello che rappresentano una pagina intera (es. `DashboardPage`, `LoginPage`).
-   **`components/`**: "Mattoncini" riutilizzabili che compongono le pagine. Sono suddivisi per contesto (es. `candidates/`, `reviews/`, `ui/`).
-   **`services/`**: Contengono la logica di comunicazione con il backend. `apiService.ts` centralizza la configurazione di Axios, mentre `candidateService.ts` definisce le funzioni specifiche per ogni endpoint.
-   **`store/`**: Contiene tutta la logica per lo state management globale, separata in tipi, reducer e contesto.
-   **`config/`**: File di configurazione statici per l'applicazione (es. `reviewCriteria.ts`).

### Gestione dello Stato

Lo stato globale è gestito tramite **React Context API** e l'hook **`useReducer`**, un pattern moderno che offre i vantaggi di Redux senza librerie esterne.
-   **`state`**: Un unico oggetto contiene i dati condivisi (`candidates`, `availableTags`), lo stato di caricamento e gli errori.
-   **`dispatch`**: I componenti non modificano mai lo stato direttamente. Invece, "spediscono" (dispatch) delle **azioni** (es. `{ type: 'DELETE_CANDIDATE_SUCCESS', payload: { id: 1 } }`).
-   **`reducer`**: Una funzione pura riceve l'azione e calcola il nuovo stato in modo prevedibile.

Questo approccio garantisce un flusso di dati unidirezionale, rende l'applicazione più facile da debuggare e migliora le performance evitando chiamate API ridondanti.

---

## Flussi di Lavoro dello Sviluppatore

### Gestione delle Migrazioni

Il database viene gestito tramite **Prisma Migrate**.
1.  **Modificare lo Schema:** Ogni modifica alla struttura del database deve essere fatta nel file `backend/prisma/schema.prisma`.
2.  **Creare una Nuova Migrazione:** Dopo aver modificato lo schema, creare un nuovo file di migrazione eseguendo (dalla root del progetto):
    ```bash
    docker compose run --rm backend npm run migrate:dev -- --name "nome-descrittivo-migrazione"
    ```
    Questo comando va eseguito **manualmente** e i file generati in `backend/prisma/migrations` **devono essere committati** in Git.
3.  **Applicare le Migrazioni:** Le migrazioni vengono applicate **automaticamente** all'avvio del container `backend` grazie allo script di `entrypoint`.

### Reset del Database (Seeding)

Per ripopolare il database con dati di test puliti:
1.  Assicurarsi che i container siano in esecuzione.
2.  Eseguire il seguente comando dalla root del progetto:
    ```bash
    docker compose exec backend npm run db:seed
    ```
    Questo comando è **manuale** e non viene eseguito all'avvio per preservare i dati di sviluppo tra una sessione e l'altra.

---

## Analisi e Sfide Affrontate

Durante lo sviluppo sono state affrontate e risolte diverse sfide comuni in ambienti full-stack e containerizzati.

-   **Problemi di Configurazione Docker:** La sfida iniziale è stata creare un `docker-compose.yml` e dei `Dockerfile` che gestissero correttamente un ambiente di sviluppo con hot-reloading. Sono stati risolti problemi di:
    -   **Sincronizzazione dei Volumi:** Assicurando che le modifiche al codice locale fossero riflesse immediatamente nei container.
    -   **Dipendenze tra Servizi:** Utilizzo di `healthcheck` per garantire che il backend si avvii solo dopo che il database è completamente pronto, risolvendo errori di connessione all'avvio.

-   **Errori di Tipo Cross-Environment (TypeScript):**
    -   **Prisma `binaryTargets`:** È stato necessario configurare `binaryTargets` in `schema.prisma` per generare i motori di query sia per l'ambiente di sviluppo locale (Windows/macOS) che per l'ambiente di esecuzione del container (Linux).
    -   **Dipendenze di Sviluppo Mancanti:** Come documentato di seguito, l'ambiente di sviluppo locale (VS Code) a volte richiede l'installazione esplicita di pacchetti `@types` per funzionare correttamente.

-   **Troubleshooting Comune - Errori di Tipo in VS Code:**
    A volte, specialmente dopo aver clonato la repository, l'editor VS Code potrebbe mostrare errori di tipo (es. "Cannot find name 'process'") anche se le dipendenze sono state installate da Docker. Questo è spesso un problema di sincronizzazione del TS Server dell'editor.
    -   **Soluzione:** Eseguire `npm install --save-dev @types/node` nella cartella `backend/` per allineare l'ambiente locale. Se persistono errori su tipi specifici di React/JSX, un `npm install` nella cartella `frontend/react/` può risolvere. Dopodiché, è consigliabile **riavviare il TS Server** in VS Code (Ctrl+Shift+P > `TypeScript: Restart TS Server`).

---

## Passi Futuri e Miglioramenti Possibili

Questo progetto rappresenta una solida base di partenza. Le aree di miglioramento futuro includono:

-   **Test Automatici:** Implementare una suite di test (unitari, di integrazione, e2e) per garantire l'affidabilità e la manutenibilità del codice, come richiesto dalla traccia.
-   **Configurazione di Produzione con Nginx:** Creare una configurazione Docker Compose per la produzione che includa un reverse proxy Nginx per gestire il traffico, servire il frontend statico e gestire i certificati SSL.
-   **Notifiche:** Aggiungere un sistema di notifiche (es. via email o Slack) per avvisare gli operatori di nuove candidature.
-   **Dashboard con Analytics:** Implementare una dashboard con grafici e statistiche sull'andamento delle candidature (requisito AVANZATO della traccia).
-   **UI/UX Avanzata:** Migliorare l'interfaccia con animazioni, "toast" di notifica per le azioni (salvataggio, errore) e una gestione più raffinata degli stati di caricamento.
-   **CI/CD Pipeline:** Configurare una pipeline di Integrazione e Deploy Continuo (es. con GitHub Actions) per automatizzare i test e il deploy delle nuove versioni.

Certamente. Aggiungo la sezione dettagliata sulla documentazione delle API, integrandola nel `README.md` che stavamo costruendo. Questa sezione è fondamentale per chiunque debba interagire con il tuo backend.

---
... (Continuazione del file `README.md` precedente)
---

### Struttura delle API (Endpoints)

L'API RESTful è il cuore del backend e fornisce tutti i dati necessari al frontend. Tutti gli endpoint sono prefissati con `/api`.

---

#### **Autenticazione (`/api/auth`)**

Gestisce il login degli operatori.

**`POST /auth/login`**
-   **Descrizione:** Autentica un utente tramite username e password.
-   **Autenticazione:** Pubblico, ma protetto da un `rate limiter` per prevenire attacchi brute-force.
-   **Request Body:**
    ```json
    {
      "username": "admin",
      "password": "password123"
    }
    ```
-   **Success Response (`200 OK`):**
    ```json
    {
      "token": "ey..."
    }
    ```
-   **Error Responses:**
    -   `400 Bad Request`: Se `username` o `password` mancano.
    -   `401 Unauthorized`: Se le credenziali non sono valide.
    -   `429 Too Many Requests`: Se il rate limit viene superato.

---

#### **Candidati (`/api/candidates`)**

Gestisce tutte le operazioni relative ai candidati.

**`POST /`**
-   **Descrizione:** Crea un nuovo candidato. Questo endpoint è pensato per essere usato dal bot di WhatsApp.
-   **Autenticazione:** Richiede un header `x-api-key` valido. Protetto da un `rate limiter` restrittivo.
-   **Request Body:**
    ```json
    {
      "uuid": "...",
      "message_body": "{\"text\": \"...\", \"payload\": \"{...}\"}",
      "sender": "391234567890",
      "receiver": "39987654321"
    }
    ```
-   **Success Response (`201 Created`):**
    ```json
    {
      "status": "success",
      "message": "Candidate data saved successfully",
      "candidateId": 123
    }
    ```

**`GET /`**
-   **Descrizione:** Recupera la lista di tutti i candidati.
-   **Autenticazione:** Richiede un token JWT (`Bearer ...`).
-   **Success Response (`200 OK`):** Restituisce un array di oggetti `Candidate`, ognuno dei quali include le relazioni `reviews` e `tags`.
    ```json
    [
      {
        "id": 1,
        "fullName": "Alice Johnson",
        "email": "alice.j@example.com",
        "status": "reviewed",
        "reviews": [...],
        "tags": [{ "id": 1, "name": "React" }, ...]
      }
    ]
    ```

**`GET /:id`**
-   **Descrizione:** Recupera i dettagli di un singolo candidato.
-   **Autenticazione:** Richiede un token JWT.
-   **URL Parameters:**
    -   `id` (integer): L'ID del candidato.
-   **Success Response (`200 OK`):** Restituisce un singolo oggetto `Candidate` completo di `reviews` e `tags`.
-   **Error Responses:**
    -   `404 Not Found`: Se il candidato con l'ID specificato non esiste.

**`PUT /:id`**
-   **Descrizione:** Aggiorna le informazioni di un candidato.
-   **Autenticazione:** Richiede un token JWT.
-   **URL Parameters:**
    -   `id` (integer): L'ID del candidato.
-   **Request Body:** Un oggetto contenente solo i campi da modificare.
    ```json
    {
      "fullName": "Alice Smith",
      "status": "rejected"
    }
    ```
-   **Success Response (`200 OK`):** Restituisce l'oggetto `Candidate` completo e aggiornato.

**`DELETE /:id`**
-   **Descrizione:** Elimina un candidato e tutte le sue revisioni associate.
-   **Autenticazione:** Richiede un token JWT.
-   **URL Parameters:**
    -   `id` (integer): L'ID del candidato.
-   **Success Response (`204 No Content`):** Nessun corpo nella risposta.

---

#### **Revisioni (sotto `/api/candidates`)**

**`POST /:id/phase-one`**
-   **Descrizione:** Crea una nuova revisione di Fase 1 per un candidato.
-   **Autenticazione:** Richiede un token JWT.
-   **URL Parameters:**
    -   `id` (integer): L'ID del candidato da revisionare.
-   **Request Body:**
    ```json
    {
      "criteriaRatings": {
        "technical_skills": 4,
        "problem_solving": 5
      },
      "notes": "Molto preparato tecnicamente."
    }
    ```
-   **Success Response (`201 Created`):** Restituisce il nuovo oggetto `Review` creato.

**`POST /:id/phase-two`**
-   **Descrizione:** Crea una nuova revisione di Fase 2 per un candidato.
-   **Autenticazione:** Richiede un token JWT.
-   **URL Parameters:**
    -   `id` (integer): L'ID del candidato da revisionare.
-   **Request Body:**
    ```json
    {
      "finalScore": 8.5,
      "hireDecision": true,
      "finalComment": "Profilo eccellente, procedere con l'offerta."
    }
    ```
-   **Success Response (`201 Created`):** Restituisce il nuovo oggetto `Review` creato.

---

#### **Tag (`/api/tags`)**

**`GET /`**
-   **Descrizione:** Recupera la lista completa di tutti i tag disponibili nel sistema.
-   **Autenticazione:** Richiede un token JWT.
-   **Success Response (`200 OK`):** Restituisce un array di oggetti `Tag`.
    ```json
    [
      { "id": 1, "name": "React" },
      { "id": 2, "name": "Docker" },
      ...
    ]
    ```

... (Continuazione del file `README.md` con le altre sezioni) ...


Perfetto, completiamo il `README.md` con le sezioni finali.

---
... (Continuazione del file `README.md` precedente)
---

## Dettagli del Frontend

Il frontend è una Single Page Application (SPA) costruita per essere veloce, reattiva e manutenibile.

### Architettura e Struttura (Frontend)

-   **`pages/`**: Componenti di alto livello che rappresentano una pagina intera (es. `DashboardPage`, `LoginPage`).
-   **`components/`**: "Mattoncini" riutilizzabili che compongono le pagine. Sono suddivisi per contesto (es. `candidates/`, `reviews/`, `ui/`).
-   **`services/`**: Contengono la logica di comunicazione con il backend. `apiService.ts` centralizza la configurazione di Axios, mentre `candidateService.ts` definisce le funzioni specifiche per ogni endpoint.
-   **`store/`**: Contiene tutta la logica per lo state management globale, separata in tipi, reducer e contesto.
-   **`config/`**: File di configurazione statici per l'applicazione (es. `reviewCriteria.ts`).

### Gestione dello Stato

Lo stato globale è gestito tramite **React Context API** e l'hook **`useReducer`**, un pattern moderno che offre i vantaggi di Redux senza librerie esterne.
-   **`state`**: Un unico oggetto contiene i dati condivisi (`candidates`, `availableTags`), lo stato di caricamento e gli errori.
-   **`dispatch`**: I componenti non modificano mai lo stato direttamente. Invece, "spediscono" (dispatch) delle **azioni** (es. `{ type: 'DELETE_CANDIDATE_SUCCESS', payload: { id: 1 } }`).
-   **`reducer`**: Una funzione pura riceve l'azione e calcola il nuovo stato in modo prevedibile.

Questo approccio garantisce un flusso di dati unidirezionale, rende l'applicazione più facile da debuggare e migliora le performance evitando chiamate API ridondanti. La pagina di dettaglio del candidato, ad esempio, utilizza una strategia "store-first, API-fallback" per un caricamento quasi istantaneo.

---

## Flussi di Lavoro dello Sviluppatore

Per garantire un'esperienza di sviluppo fluida e coerente, sono stati definiti i seguenti flussi di lavoro basati su Docker.

### Gestione delle Migrazioni

Il database viene gestito tramite **Prisma Migrate**.
1.  **Modificare lo Schema:** Ogni modifica alla struttura del database deve essere fatta nel file `backend/prisma/schema.prisma`.
2.  **Creare una Nuova Migrazione:** Dopo aver modificato lo schema, creare un nuovo file di migrazione eseguendo (dalla root del progetto):
    ```bash
    docker compose run --rm backend npm run migrate:dev -- --name "nome-descrittivo-migrazione"
    ```
    Questo comando va eseguito **manualmente** e i file generati in `backend/prisma/migrations` **devono essere committati** in Git.
3.  **Applicare le Migrazioni:** Le migrazioni vengono applicate **automaticamente** all'avvio del container `backend` grazie allo script di `entrypoint`.

### Reset del Database (Seeding)

Per ripopolare il database con dati di test puliti:
1.  Assicurarsi che i container siano in esecuzione.
2.  Eseguire il seguente comando dalla root del progetto:
    ```bash
    docker compose exec backend npm run db:seed
    ```
    Questo comando è **manuale** e non viene eseguito all'avvio per preservare i dati di sviluppo tra una sessione e l'altra.

---

## Analisi e Sfide Affrontate

Durante lo sviluppo sono state affrontate e risolte diverse sfide comuni in ambienti full-stack e containerizzati.

-   **Problemi di Configurazione Docker:** La sfida iniziale è stata creare un `docker-compose.yml` e dei `Dockerfile` che gestissero correttamente un ambiente di sviluppo con hot-reloading. Sono stati risolti problemi di:
    -   **Sincronizzazione dei Volumi:** Assicurando che le modifiche al codice locale fossero riflesse immediatamente nei container.
    -   **Dipendenze tra Servizi:** Utilizzo di `healthcheck` per garantire che il backend si avvii solo dopo che il database è completamente pronto, risolvendo errori di connessione all'avvio.

-   **Errori di Tipo Cross-Environment (TypeScript):**
    -   **Prisma `binaryTargets`:** È stato necessario configurare `binaryTargets` in `schema.prisma` per generare i motori di query sia per l'ambiente di sviluppo locale (es. Windows) che per l'ambiente di esecuzione del container (Linux), risolvendo i crash del Prisma Client.
    -   **Configurazione `tsconfig.json`:** È stata creata una configurazione robusta per garantire la compatibilità tra i moduli (ESM vs CommonJS) e per permettere al server TypeScript di VS Code di rilevare correttamente tutti i tipi delle dipendenze.

-   **Troubleshooting Comune - Errori di Tipo in VS Code:**
    A volte, specialmente dopo aver clonato la repository, l'editor VS Code potrebbe mostrare errori di tipo (es. "Cannot find name 'process'") anche se le dipendenze sono state installate da Docker. Questo è spesso un problema di sincronizzazione del TS Server dell'editor.
    -   **Soluzione:** Eseguire `npm install --save-dev @types/node` nella cartella `backend/` per allineare l'ambiente locale. Se persistono errori su tipi specifici di React/JSX, un `npm install` nella cartella `frontend/react/` può risolvere. Dopodiché, è consigliabile **riavviare il TS Server** in VS Code (Ctrl+Shift+P > `TypeScript: Restart TS Server`).

---

## Passi Futuri e Miglioramenti Possibili

Questo progetto rappresenta una solida base di partenza. Le aree di miglioramento futuro includono:

-   **Test Automatici:** Implementare una suite di test (unitari, di integrazione, e2e) per garantire l'affidabilità e la manutenibilità del codice, come richiesto dalla traccia.
-   **Configurazione di Produzione con Nginx:** Creare una configurazione Docker Compose per la produzione che includa un reverse proxy Nginx per gestire il traffico, servire il frontend statico e gestire i certificati SSL.
-   **Notifiche:** Aggiungere un sistema di notifiche (es. via email o Slack) per avvisare gli operatori di nuove candidature.
-   **Dashboard con Analytics:** Implementare una dashboard con grafici e statistiche sull'andamento delle candidature (requisito AVANZATO della traccia).
-   **UI/UX Avanzata:** Migliorare l'interfaccia con animazioni, "toast" di notifica per le azioni (salvataggio, errore) e una gestione più raffinata degli stati di caricamento.
-   **CI/CD Pipeline:** Configurare una pipeline di Integrazione e Deploy Continuo (es. con GitHub Actions) per automatizzare i test e il deploy delle nuove versioni.

Certamente. Aggiungo una sezione finale al `README.md` che fa esattamente questo: un confronto diretto e schematico tra i requisiti BASE richiesti dalla traccia per ogni ruolo e lo stato di completamento attuale del progetto.

Questa tabella renderà immediatamente chiaro il lavoro svolto e cosa rimane da fare per completare il livello BASE secondo la traccia.

---
... (Continuazione del file `README.md` precedente)
---

Questo elenco riassume lo stato di avanzamento del progetto rispetto ai requisiti minimi definiti nella traccia.

#### Backend
*   **REST API CRUD per i candidati:** ✅ **Completato e Superato.** È stato implementato un CRUD completo che include anche la gestione di revisioni e tag, andando oltre il minimo richiesto.
*   **Endpoint per il bot (con API-Key):** ✅ **Completato.** L'endpoint `POST /api/candidates` è protetto correttamente da `apiKeyAuth`.
*   **Endpoint autenticato per operatori (JWT):** ✅ **Completato.** Il flusso di login e la protezione delle rotte tramite `jwtAuth` sono pienamente funzionanti.

#### Frontend
*   **Login finto ma persistente:** ✅ **Superato.** È stato implementato un sistema di login reale e persistente che comunica con il backend, superando la richiesta di un semplice mock.
*   **Visualizzazione candidati (stato, tag, paginazione):** ✅ **Completato.** La dashboard mostra tutti gli elementi richiesti, recuperando i dati dall'API.
*   **Filtro avanzato combinato:** ✅ **Completato.** I filtri per nome, stato e tag sono funzionanti e possono essere combinati tra loro.

#### Fullstack & DevOps
*   **Test automatici (1 backend, 1 frontend):** ❌ **MANCANTE.**
    *   **Azione Richiesta:** Scrivere un test di integrazione per un endpoint del backend (es. con Jest/Supertest) e un test di rendering per un componente frontend (es. con Jest/React Testing Library).
*   **Dockerizzazione completa:** 🟠 **Quasi Completato.** Sono stati dockerizzati i servizi `backend`, `frontend` (in modalità sviluppo), `db` e `adminer`.
    *   **Azione Richiesta:** Integrare un servizio Nginx nel `docker-compose.yml`.
*   **Nginx configurato (SSL, routing):** ❌ **MANCANTE.** Nginx non è ancora stato implementato come reverse proxy.
    *   **Azione Richiesta:** Creare un `Dockerfile` di produzione per il frontend e un file `nginx.conf` per gestire il routing da un'unica porta verso i servizi `backend` e `frontend`.


    