# 📚 LibraryHub Frontend - Next.js + TypeScript

Questo è il frontend Next.js per il sistema di gestione libreria del **Capitolo 7** del corso Django + React.

## 🚀 Tecnologie Utilizzate

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Type safety e migliore DX
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client per API calls
- **ESLint + Prettier** - Code quality e formatting

## 📋 Prerequisiti

- Node.js 18+ installato
- npm o yarn package manager
- Backend Django in esecuzione su `http://127.0.0.1:8000`

## 🛠️ Setup e Installazione

### 1. Installa le dipendenze

```bash
cd 07_React_Frontend_Setup/nextjs_scaffold
npm install
```

### 2. Configura le variabili d'ambiente

```bash
cp .env.example .env.local
```

Modifica `.env.local` se necessario:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 3. Avvia il server di sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

## 📁 Struttura del Progetto

```
src/
├── app/                    # App Router di Next.js
│   ├── layout.tsx         # Layout principale
│   ├── page.tsx           # Homepage
│   └── globals.css        # Stili globali
├── components/            # Componenti React
│   ├── ui/               # Componenti UI riutilizzabili
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── LibroCard.tsx     # Card per visualizzare libri
│   └── ListaLibri.tsx    # Componente principale lista libri
└── types/                # Definizioni TypeScript
    └── api.ts            # Tipi per API Django
```

## 🎯 Obiettivi dell'Esercizio

### ✅ Completati
- [x] Setup progetto Next.js con TypeScript
- [x] Configurazione Tailwind CSS
- [x] Struttura componenti base
- [x] Tipi TypeScript per API Django

### 📝 Da Completare (TODO)

1. **Configura il Backend Django**
   - Assicurati che Django sia in esecuzione su `http://127.0.0.1:8000`
   - Configura CORS per permettere richieste da `http://localhost:3000`
   - Verifica che gli endpoint API siano accessibili

2. **Completa il Componente ListaLibri**
   - Apri `src/components/ListaLibri.tsx`
   - Implementa la logica per recuperare dati dall'API
   - Gestisci stati di caricamento ed errore
   - Testa la connessione con il backend

3. **Testa l'Integrazione**
   - Avvia entrambi i server (Django + Next.js)
   - Verifica che non ci siano errori CORS
   - Controlla che i dati vengano visualizzati correttamente

## 🔧 Comandi Disponibili

```bash
# Sviluppo
npm run dev          # Avvia server di sviluppo

# Build e produzione
npm run build        # Crea build di produzione
npm run start        # Avvia server di produzione

# Code quality
npm run lint         # Esegue ESLint
npm run type-check   # Verifica tipi TypeScript
```

## 🌐 Configurazione CORS (Backend Django)

Per permettere le richieste dal frontend Next.js, configura CORS nel backend Django:

### 1. Installa django-cors-headers

```bash
pip install django-cors-headers
```

### 2. Aggiungi a INSTALLED_APPS (settings.py)

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]
```

### 3. Aggiungi middleware (settings.py)

```python
MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]
```

### 4. Configura origini permesse (settings.py)

```python
# Per sviluppo
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Oppure per sviluppo (meno sicuro)
CORS_ALLOW_ALL_ORIGINS = True
```

## 🐛 Troubleshooting

### Errore CORS
- Verifica che CORS sia configurato correttamente nel backend Django
- Controlla che l'URL dell'API sia corretto in `.env.local`
- Riavvia entrambi i server dopo le modifiche

### Errore di connessione
- Assicurati che Django sia in esecuzione su `http://127.0.0.1:8000`
- Verifica che gli endpoint API esistano (`/pizzeria/api/libri/`)
- Controlla i log del server Django per errori

### Errori TypeScript
- Esegui `npm run type-check` per verificare i tipi
- Assicurati che tutti i tipi in `src/types/api.ts` corrispondano ai serializers Django

## 📚 Prossimi Passi

Dopo aver completato questo capitolo:

1. **Capitolo 8** - Autenticazione e integrazione avanzata
2. **Capitolo 9** - Deployment e produzione
3. **Progetti avanzati** - Features aggiuntive

## 🤝 Supporto

Se incontri problemi:
1. Controlla la console del browser per errori JavaScript
2. Verifica i log del server Django
3. Assicurati che tutte le dipendenze siano installate
4. Consulta la documentazione ufficiale di Next.js e Django

---

**Buon coding! 🚀**