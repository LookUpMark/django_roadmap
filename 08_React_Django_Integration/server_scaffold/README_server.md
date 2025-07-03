# Server Scaffolding - Capitolo 8

Questa cartella è un placeholder per il backend Django necessario per gli esercizi del Capitolo 8.

**Azione Richiesta per lo Studente:**

Per completare gli esercizi del Capitolo 8 relativi all'integrazione full-stack e all'autenticazione, è fondamentale avere un backend Django robusto e funzionante.

1.  **Utilizza e Verifica il Backend del Capitolo 6:**
    Il backend Django sviluppato fino al Capitolo 6 è il punto di partenza. Assicurati che includa:
    *   Modelli `Libro` e `Autore`.
    *   Serializer DRF per `Libro`, `Autore`, e `User` (`UserSerializer` per la registrazione).
    *   ViewSet DRF per `Libro` e `Autore` (`LibroViewSet`, `AutoreViewSet`).
    *   **Endpoint di Registrazione Utente:** (es. `/pizzeria/api/auth/register/`) che usa `UserCreateAPIView` e `UserSerializer`.
    *   **Endpoint di Login:** (es. `/pizzeria/api/auth/login/`) che usa `obtain_auth_token` di DRF per restituire un token.
    *   **TokenAuthentication:** Configurato come schema di autenticazione (globalmente o sui ViewSet).
    *   **Permessi:** `IsAuthenticatedOrReadOnly` impostato sui `LibroViewSet` e `AutoreViewSet` per proteggere le operazioni di scrittura (POST, PUT, DELETE).
    *   **CORS Configurato:** `django-cors-headers` deve essere configurato per permettere richieste dal frontend React (es. `http://localhost:5173` o la porta del tuo dev server Vite).

2.  **Nessun Nuovo Codice Backend Specifico da Scrivere per Questo Capitolo (Scaffolding):**
    Non ci sono nuovi file di scaffolding Django specifici da completare *per il backend* in questo capitolo, **a meno che non manchino funzionalità degli esercizi dei capitoli precedenti (1-6)**. Il focus è sull'utilizzo di questi endpoint esistenti dal frontend React.
    La cartella `server_scaffold` è qui per enfatizzare la necessità di un backend completo e funzionante.

**Se il tuo backend dei capitoli precedenti è incompleto:**
Dovrai rivedere e completare gli esercizi dei Capitoli 2, 5 e 6 per assicurarti che tutti gli endpoint API e i meccanismi di autenticazione siano operativi.

**Obiettivo del Capitolo 8 (Frontend):**
L'obiettivo è implementare nel frontend React:
*   Form di login e registrazione che comunicano con gli endpoint API Django.
*   Gestione del token di autenticazione (salvataggio, invio con le richieste).
*   Routing protetto.
*   Form per aggiungere dati (es. un nuovo libro) che invii richieste autenticate.
```
