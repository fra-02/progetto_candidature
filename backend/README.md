## Documentazione API

Questo documento fornisce i dettagli sugli endpoint disponibili per il servizio di gestione delle candidature. Tutti gli endpoint sono preceduti dal prefisso `/api`.

**URL di Base:** `http://localhost:3000/api`

---

### Autenticazione

#### **Login Utente**

Autentica un operatore e restituisce un token JWT (JSON Web Token) per accedere alle rotte protette.

*   **Endpoint:** `POST /auth/login`
*   **Descrizione:** Utilizzare questo endpoint per effettuare il login. L'utente deve esistere nel database (l'utente di default `admin` viene creato tramite lo script di seed).
*   **Autenticazione:** Nessuna.
*   **Corpo della Richiesta (Request Body):**

    ```json
    {
      "username": "admin",
      "password": "password123"
    }
    ```

*   **Risposta di Successo (200 OK):**

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYx..."
    }
    ```

*   **Risposta di Errore (401 Unauthorized):**

    ```json
    {
      "message": "Credenziali non valide"
    }
    ```

---

### Candidati

Endpoint per la gestione dei candidati. Tutte le rotte in questa sezione sono protette e richiedono un token JWT valido passato nell'header `Authorization`.

**Header di Autenticazione per tutte le rotte protette:**
`Authorization: Bearer <il_tuo_token_jwt>`

---

#### **Crea un nuovo Candidato (Solo per il Bot)**

Endpoint utilizzato dal bot di WhatsApp per inviare una nuova candidatura. Questo è l'unico endpoint in questa sezione che utilizza l'autenticazione tramite API Key.

*   **Endpoint:** `POST /candidates`
*   **Autenticazione:** Richiede una API Key nell'header `X-API-KEY`.
*   **Corpo della Richiesta:**

    ```json
    {
      "uuid": "uuid-unico-dal-bot-12345",
      "message_type": "button",
      "message_body": "{\"text\":\"Sent\",\"payload\":\"{\\\"screen_0_TextInput_0\\\":\\\"Mario Rossi\\\",\\\"screen_0_TextInput_1\\\":\\\"mario.rossi@example.com\\\"}\"}",
      "sender": "391234567890",
      "receiver": "390987654321"
    }
    ```
*   **Risposta di Successo (201 Created):**

    ```json
    {
      "status": "success",
      "message": "Dati del candidato salvati con successo",
      "candidateId": 1
    }
    ```

#### **Ottieni tutti i Candidati**

Recupera una lista di tutti i candidati.

*   **Endpoint:** `GET /candidates`
*   **Autenticazione:** JWT Bearer Token.
*   **Risposta di Successo (200 OK):**

    ```json
    [
      {
        "id": 1,
        "uuid": "uuid-unico-dal-bot-12345",
        "sender": "391234567890",
        "status": "pending",
        "fullName": "Mario Rossi",
        "email": "mario.rossi@example.com",
        "githubLink": null,
        "rawAnswers": { ... },
        "createdAt": "2024-05-23T12:00:00.000Z",
        "updatedAt": "2024-05-23T12:00:00.000Z",
        "reviews": []
      }
    ]
    ```

#### **Ottieni un singolo Candidato**

Recupera i dettagli di un candidato specifico tramite il suo ID.

*   **Endpoint:** `GET /candidates/:id`
*   **Autenticazione:** JWT Bearer Token.
*   **Parametri URL:**
    *   `id` (intero): L'ID univoco del candidato.
*   **Risposta di Successo (200 OK):**

    ```json
    {
      "id": 1,
      "uuid": "uuid-unico-dal-bot-12345",
      // ... tutti gli altri campi del candidato
      "reviews": [
        {
          "id": 1,
          "phase": 1,
          "grade": 8.5,
          "notes": "Buon profilo.",
          "candidateId": 1,
          "userId": 1,
          "createdAt": "2024-05-23T13:00:00.000Z"
        }
      ]
    }
    ```
*   **Risposta di Errore (404 Not Found):**
    ```json
    {
      "message": "Candidato non trovato"
    }
    ```

#### **Aggiorna un Candidato**

Aggiorna le informazioni di un candidato esistente.

*   **Endpoint:** `PUT /candidates/:id`
*   **Autenticazione:** JWT Bearer Token.
*   **Corpo della Richiesta:** (Includi solo i campi che vuoi aggiornare)

    ```json
    {
      "status": "reviewed",
      "fullName": "Mario Bianchi"
    }
    ```
*   **Risposta di Successo (200 OK):** Restituisce l'oggetto completo e aggiornato del candidato.
*   **Risposta di Errore (404 Not Found):** Se il candidato con l'ID specificato non esiste.

#### **Cancella un Candidato**

Cancella un candidato e tutte le sue revisioni associate.

*   **Endpoint:** `DELETE /candidates/:id`
*   **Autenticazione:** JWT Bearer Token.
*   **Risposta di Successo (204 No Content):** Restituisce un corpo vuoto, indicando che la cancellazione è avvenuta con successo.
*   **Risposta di Errore (404 Not Found):** Se il candidato con l'ID specificato non esiste.

---

### Revisioni

Endpoint per la gestione delle revisioni dei candidati.

#### **Aggiungi Revisione di Fase 1**

Aggiunge una revisione di fase 1 a un candidato specifico.

*   **Endpoint:** `POST /candidates/:id/phase-one`
*   **Autenticazione:** JWT Bearer Token.
*   **Corpo della Richiesta:**

    ```json
    {
      "grade": 8.5,
      "notes": "Background tecnico molto promettente."
    }
    ```
*   **Risposta di Successo (201 Created):**

    ```json
    {
      "status": "success",
      "message": "Dati della fase uno salvati con successo"
    }
    ```

#### **Aggiungi Revisione di Fase 2**

Aggiunge una revisione di fase 2 a un candidato specifico.

*   **Endpoint:** `POST /candidates/:id/phase-two`
*   **Autenticazione:** JWT Bearer Token.
*   **Corpo della Richiesta:**

    ```json
    {
      "final_grade": 9.0,
      "notes": "Colloquio finale eccellente. Raccomandato per l'assunzione."
    }
    ```
*   **Risposta di Successo (201 Created):**

    ```json
    {
      "status": "success",
      "message": "Dati della fase due salvati con successo"
    }
    ```