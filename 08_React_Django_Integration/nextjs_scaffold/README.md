# 🚀 LibraryHub Full-Stack - Next.js + Django Integration

Sistema completo di gestione libreria per il **Capitolo 8** del corso Django + React, ora potenziato con Next.js, TypeScript e tecnologie moderne.

## 🎯 Obiettivi del Capitolo 8

Questo progetto dimostra l'integrazione completa tra:
- **Backend Django** con API REST autenticate
- **Frontend Next.js** con TypeScript e state management moderno
- **Autenticazione sicura** con JWT tokens
- **UI/UX professionale** con Tailwind CSS

## 🛠️ Stack Tecnologico

### Frontend
- **Next.js 14** - React framework con App Router
- **TypeScript** - Type safety e migliore developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management leggero e performante
- **React Query** - Data fetching e caching intelligente
- **React Hook Form + Zod** - Form validation robusta
- **Axios** - HTTP client per API calls

### Backend (Django)
- **Django 5.2+** - Web framework Python
- **Django REST Framework** - API development
- **Token Authentication** - Sistema di autenticazione
- **CORS Headers** - Cross-origin resource sharing

## 📋 Prerequisiti

- Node.js 18+ installato
- npm o yarn package manager
- Backend Django configurato e in esecuzione
- Database con modelli Autore e Libro

## 🚀 Setup e Installazione

### 1. Installa le dipendenze

```bash
cd 08_React_Django_Integration/nextjs_scaffold
npm install
```

### 2. Configura le variabili d'ambiente

```bash
cp .env.example .env.local
```

Modifica `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NODE_ENV=development
```

### 3. Configura il backend Django

Assicurati che il backend Django abbia:

#### CORS configurato (settings.py):
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
]

MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}
```

#### Endpoint API richiesti:
- `GET/POST /pizzeria/api/libri/` - Lista e creazione libri
- `GET /pizzeria/api/autori/` - Lista autori
- `POST /pizzeria/api/auth/login/` - Login utente
- `POST /pizzeria/api/auth/register/` - Registrazione utente
- `GET /pizzeria/api/auth/user/` - Dati utente corrente

### 4. Avvia i server

#### Backend Django:
```bash
cd django_react_corso_esercizi
python manage.py runserver
```

#### Frontend Next.js:
```bash
cd 08_React_Django_Integration/nextjs_scaffold
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

## 📁 Struttura del Progetto

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout principale
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Stili globali
│   └── auth/                    # Pagine autenticazione
│       ├── login/page.tsx
│       └── register/page.tsx
├── components/                   # Componenti React
│   ├── auth/                    # Componenti autenticazione
│   │   ├── AuthChecker.tsx      # Verifica auth all'avvio
│   │   ├── LoginForm.tsx        # Form di login
│   │   └── RegisterForm.tsx     # Form di registrazione
│   ├── books/                   # Componenti libri
│   │   ├── AggiungiLibroForm.tsx # Form aggiunta libro
│   │   ├── LibroCard.tsx        # Card singolo libro
│   │   └── RecentBooks.tsx      # Libri recenti
│   ├── layout/                  # Componenti layout
│   │   └── Navbar.tsx           # Barra di navigazione
│   ├── providers/               # Provider globali
│   │   └── Providers.tsx        # React Query provider
│   └── ui/                      # Componenti UI base
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
├── stores/                      # Zustand stores
│   └── authStore.ts            # Store autenticazione
└── types/                      # Definizioni TypeScript
    └── api.ts                  # Tipi per API Django
```

## 🎯 Funzionalità Implementate

### ✅ Autenticazione
- [x] Login con username/password
- [x] Registrazione nuovi utenti
- [x] Logout sicuro
- [x] Persistenza sessione con cookies
- [x] Protezione route private
- [x] Validazione form avanzata

### ✅ Gestione Libri
- [x] Visualizzazione catalogo libri
- [x] Aggiunta nuovi libri (utenti autenticati)
- [x] Validazione dati con Zod
- [x] Upload con gestione errori
- [x] Cache intelligente con React Query

### ✅ UI/UX
- [x] Design responsive
- [x] Dark/light mode ready
- [x] Loading states
- [x] Error handling
- [x] Navigazione intuitiva
- [x] Componenti riutilizzabili

### ✅ Performance
- [x] State management ottimizzato
- [x] Caching automatico
- [x] Code splitting
- [x] TypeScript per type safety
- [x] Bundle optimization

## 🔧 Comandi Disponibili

```bash
# Sviluppo
npm run dev          # Server di sviluppo
npm run build        # Build produzione
npm run start        # Server produzione
npm run lint         # ESLint
npm run type-check   # Verifica TypeScript
```

## 🧪 Testing e Debug

### React Query Devtools
In modalità sviluppo, sono disponibili i React Query Devtools per monitorare:
- Cache delle query
- Stato delle mutations
- Network requests
- Performance metrics

### Debug Store Zustand
Lo store di autenticazione include logging dettagliato in console per:
- Login/logout events
- Token management
- Error handling
- State changes

## 🔐 Sicurezza

### Autenticazione
- Token JWT sicuri
- Cookies httpOnly per persistenza
- Validazione lato client e server
- Protezione CSRF

### Validazione
- Schema Zod per type safety
- Sanitizzazione input utente
- Gestione errori robusta
- Rate limiting ready

## 🚀 Deployment

### Build di Produzione
```bash
npm run build
npm run start
```

### Variabili d'Ambiente Produzione
```env
NEXT_PUBLIC_API_URL=https://your-django-api.com
NODE_ENV=production
```

### Ottimizzazioni
- Bundle splitting automatico
- Image optimization
- Static generation dove possibile
- Performance monitoring ready

## 🐛 Troubleshooting

### Errori Comuni

#### CORS Error
```
Access to fetch at 'http://127.0.0.1:8000' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Soluzione:** Verifica configurazione CORS in Django settings.py

#### Token Authentication Error
```
Authentication credentials were not provided
```
**Soluzione:** Verifica che il token sia incluso negli header delle richieste

#### TypeScript Errors
```
Property 'xyz' does not exist on type
```
**Soluzione:** Aggiorna i tipi in `src/types/api.ts`

### Debug Steps
1. Verifica che Django sia in esecuzione su porta 8000
2. Controlla console browser per errori JavaScript
3. Verifica network tab per richieste API
4. Controlla logs Django per errori backend

## 📚 Risorse e Documentazione

- [Next.js Documentation](https://nextjs.org/docs)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Query Documentation](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎉 Prossimi Passi

Dopo aver completato questo capitolo:

1. **Capitolo 9: Deployment**
   - Configurazione produzione
   - Deploy su Vercel/Railway
   - Monitoring e analytics

2. **Features Avanzate**
   - Search e filtering
   - Upload immagini
   - Notifiche real-time
   - PWA capabilities

3. **Testing**
   - Unit tests con Jest
   - Integration tests
   - E2E tests con Cypress

---

**Congratulazioni! 🎊 Hai completato l'integrazione full-stack Django + Next.js!**

Per supporto o domande, consulta la documentazione o apri un issue nel repository del corso.