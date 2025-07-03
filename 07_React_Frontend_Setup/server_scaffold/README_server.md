# Server Scaffolding - Capitolo 7

Questa cartella è un placeholder per il backend Django necessario per gli esercizi del Capitolo 7.

**Azione Richiesta per lo Studente:**

Per completare gli esercizi del Capitolo 7 relativi al frontend React, è necessario avere un backend Django funzionante che esponga le API per i libri (e autori, se usati da `ListaLibri.jsx`).

1.  **Utilizza il Backend del Capitolo 6:**
    Idealmente, dovresti avere il backend Django sviluppato fino al Capitolo 6 (con DRF, API per Libri e Autori, e autenticazione configurata ma non ancora usata dal frontend per GET pubblici) in esecuzione.
    Assicurati che:
    *   Il server Django sia avviabile (`python manage.py runserver`).
    *   Gli endpoint API (es. `/pizzeria/api/libri/` e `/pizzeria/api/autori/`) siano accessibili.
    *   **CORS sia configurato correttamente** in `settings.py` per permettere richieste dal dominio del server di sviluppo React (es. `http://localhost:5173` o la porta usata da Vite). Fai riferimento all'Esercizio 2 del `README.md` del Capitolo 7 per le istruzioni su `django-cors-headers`.

2.  **Nessun Nuovo Codice Backend Specifico per Questo Capitolo (Scaffolding):**
    Non ci sono nuovi file di scaffolding Django specifici da completare *per il backend* in questo capitolo. Il focus è sul frontend React.
    La cartella `server_scaffold` è qui per ricordarti che un server backend è necessario.

**Se non hai il backend dei capitoli precedenti:**
Potresti dover rapidamente implementare un semplice backend DRF con i modelli `Libro` e `Autore` e i relativi `ModelViewSet` e `Serializer` come descritto nei Capitoli 2 e 5, e configurare CORS.

**Obiettivo del Capitolo 7 (Frontend):**
L'obiettivo è far sì che il componente React `ListaLibri.jsx` (in `client_scaffold`) possa effettuare una chiamata GET all'endpoint `/api/libri/` del tuo backend Django e visualizzare i dati.
```
