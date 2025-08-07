# 🧪 Frontend Test Client - Next.js

Questo è un client di test già pronto per testare le API Django sviluppate durante il corso. **Non è parte del curriculum di apprendimento** - è solo uno strumento per verificare che le API funzionino correttamente.

## 🎯 Scopo

Questo frontend serve esclusivamente per:
- **Testare le API Django** sviluppate nei vari capitoli
- **Verificare l'autenticazione** e le autorizzazioni
- **Visualizzare i dati** restituiti dalle API
- **Testare la validazione** e la gestione errori
- **Debugging** durante lo sviluppo backend

## 🚫 Cosa NON È

- ❌ Non è parte del curriculum di apprendimento
- ❌ Non devi modificare o studiare questo codice
- ❌ Non è necessario capire come funziona React/Next.js
- ❌ Non influisce sulla valutazione del corso Django

## 🛠️ Setup Rapido

### 1. Installa le dipendenze
```bash
cd frontend_test_client
npm install
```

### 2. Configura l'ambiente
```bash
cp .env.example .env.local
```

### 3. Avvia il client
```bash
npm run dev
```

Il client sarà disponibile su `http://localhost:3000`

## 📋 Funzionalità Disponibili

### 🏠 Dashboard
- Panoramica delle API disponibili
- Statistiche generali del sistema
- Status delle connessioni backend

### 📚 Gestione Libri
- Lista libri con pagination
- Filtering per categoria, prezzo, autore
- Search full-text
- Creazione nuovi libri
- Modifica e eliminazione

### 👥 Gestione Autori
- Lista autori
- Creazione nuovi autori
- Visualizzazione libri per autore

### 🔐 Autenticazione
- Login/Logout
- Registrazione nuovi utenti
- Gestione token JWT
- Protezione route private

### 🧪 API Testing
- Interface per testare tutti gli endpoint
- Visualizzazione request/response
- Testing di errori e validazione
- Performance monitoring

## 🔧 Configurazione Backend

Il frontend è configurato per funzionare con Django su:
- **URL:** `http://127.0.0.1:8000`
- **API Base:** `/api/v1/`

### Endpoint Richiesti:
```
GET    /api/v1/libri/           # Lista libri
POST   /api/v1/libri/           # Crea libro
GET    /api/v1/libri/{id}/      # Dettaglio libro
PUT    /api/v1/libri/{id}/      # Aggiorna libro
DELETE /api/v1/libri/{id}/      # Elimina libro

GET    /api/v1/autori/          # Lista autori
POST   /api/v1/autori/          # Crea autore

POST   /api/v1/auth/login/      # Login
POST   /api/v1/auth/register/   # Registrazione
GET    /api/v1/auth/user/       # Profilo utente
```

## 🐛 Troubleshooting

### Errore CORS
Se vedi errori CORS, assicurati che Django abbia:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### API Non Trovate
Verifica che:
- Django sia in esecuzione su porta 8000
- Gli URL delle API siano configurati correttamente
- I ViewSets siano registrati nel router

### Errori di Autenticazione
Controlla che:
- Il sistema di autenticazione Django sia configurato
- I token JWT siano gestiti correttamente
- Le permissions siano impostate sui ViewSets

## 📁 Struttura (Solo per Riferimento)

```
frontend_test_client/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Componenti React
│   ├── lib/                 # Utilities e API client
│   └── utils/               # Helper functions
├── public/                  # Static assets
├── package.json             # Dependencies
└── README.md               # Questo file
```

## 🎯 Come Usarlo Durante il Corso

### Capitolo 2-3: Modelli e Views Base
- Usa la sezione "Libri" per testare CRUD operations
- Verifica che i dati vengano salvati correttamente

### Capitolo 4: Forms
- Testa la validazione dei form
- Verifica gestione errori

### Capitolo 5-6: DRF e API
- Usa l'interface API Testing
- Verifica tutti gli endpoint REST

### Capitolo 7: Autenticazione
- Testa login/logout
- Verifica protezione delle route

### Capitolo 8+: Features Avanzate
- Testa filtering e search
- Verifica performance con grandi dataset

## 🔄 Aggiornamenti

Il frontend viene aggiornato automaticamente per supportare nuove funzionalità man mano che vengono aggiunte al backend Django. Non è necessario modificarlo manualmente.

## 💡 Suggerimenti

1. **Tieni sempre aperto** il frontend durante lo sviluppo Django
2. **Usa la console del browser** per vedere eventuali errori
3. **Controlla la tab Network** per vedere le richieste API
4. **Usa il dashboard** per monitorare lo stato generale

---

**Ricorda: Questo è solo uno strumento di test. Il focus del corso rimane 100% su Django e lo sviluppo backend! 🐍**