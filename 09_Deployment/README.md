# Capitolo 9: Portare l'Applicazione in Produzione (Deployment)

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Comprendere i concetti chiave e le sfide del deployment di un'applicazione full-stack Django + React.
*   Preparare l'applicazione Django per la produzione:
    *   Utilizzare un server WSGI come Gunicorn.
    *   Gestire le variabili d'ambiente per configurazioni sensibili (es. `SECRET_KEY`, database).
    *   Configurare e raccogliere i file statici (`collectstatic`).
    *   Disabilitare la modalità DEBUG.
*   Preparare l'applicazione React per la produzione:
    *   Comprendere il processo di "build" di React (`npm run build`).
*   Conoscere le principali strategie di deployment:
    *   Servire il frontend React buildato tramite Django.
    *   Deployare backend e frontend separatamente su piattaforme PaaS (Platform as a Service).
*   Avere una panoramica dei file di configurazione comuni per il deployment (es. `requirements.txt`, `Procfile`, `runtime.txt`).

## Lezione Teorica

Il deployment è il processo di rendere la tua applicazione web accessibile agli utenti su Internet. È un passaggio cruciale che presenta sfide diverse rispetto allo sviluppo locale.

### Concetti Chiave del Deployment

*   **Server Web vs. Application Server (WSGI/ASGI):**
    *   Il server di sviluppo di Django (`manage.py runserver`) NON è adatto alla produzione. È lento, insicuro e non scala bene.
    *   In produzione, hai bisogno di:
        *   Un **Application Server** che implementi l'interfaccia WSGI (Web Server Gateway Interface) o ASGI (Asynchronous Server Gateway Interface) per Django. Esempi popolari sono **Gunicorn** (per WSGI, sincrono) e **Uvicorn** o **Daphne** (per ASGI, asincrono, necessario se usi Django Channels).
        *   Spesso, un **Server Web** "reverse proxy" come **Nginx** o **Apache** viene posto davanti all'application server. Questo server web gestisce le connessioni HTTP in entrata, serve i file statici, può terminare SSL (HTTPS), gestire il load balancing, e inoltrare le richieste dinamiche all'application server.
*   **Database di Produzione:**
    *   SQLite è ottimo per lo sviluppo, ma per la produzione PostgreSQL, MySQL o altri database robusti sono preferibili. Assicurati che la tua configurazione `DATABASES` in `settings.py` punti al database di produzione (spesso tramite variabili d'ambiente).
*   **File Statici:**
    *   In sviluppo, Django serve automaticamente i file statici (CSS, JavaScript, immagini) delle tue app e quelli definiti in `STATICFILES_DIRS`.
    *   In produzione, devi "raccogliere" tutti questi file statici in un'unica directory (`STATIC_ROOT`) usando il comando `python manage.py collectstatic`. Il server web (Nginx) è poi configurato per servire i file da questa `STATIC_ROOT`.
*   **Variabili d'Ambiente:**
    *   Configurazioni sensibili (come `SECRET_KEY`, password del database, chiavi API) o specifiche dell'ambiente (DEBUG, host consentiti) non dovrebbero mai essere hardcoded nel codice sorgente versionato. Vanno gestite tramite **variabili d'ambiente**. Librerie come `python-decouple` o `django-environ` possono aiutare a gestirle.
*   **Sicurezza:**
    *   `DEBUG = False` in produzione è fondamentale.
    *   Configura `ALLOWED_HOSTS` in `settings.py` con i domini effettivi della tua applicazione.
    *   Usa HTTPS.
    *   Mantieni Django e tutte le dipendenze aggiornate.
    *   Implementa tutte le best practice di sicurezza di Django (CSRF, XSS, ecc.).

### Preparare Django per la Produzione

1.  **`requirements.txt`:**
    Assicurati di avere un file `requirements.txt` che elenchi tutte le dipendenze Python del tuo progetto. Puoi generarlo con:
    ```bash
    pip freeze > requirements.txt
    ```
    È buona pratica creare questo file dall'ambiente virtuale attivo per includere solo le dipendenze necessarie. Aggiungi `gunicorn` (o il tuo server WSGI/ASGI) a questo file.

2.  **Installare Gunicorn (o un altro server WSGI):**
    ```bash
    pip install gunicorn
    # Non dimenticare di aggiungerlo a requirements.txt
    ```

3.  **Configurazioni in `settings.py` per la Produzione:**

    ```python
    # myproject/settings.py
    import os
    from pathlib import Path
    # Per le variabili d'ambiente, potresti usare os.environ.get() o una libreria come python-decouple
    # from decouple import config # Esempio con python-decouple

    BASE_DIR = Path(__file__).resolve().parent.parent

    # NON METTERE LA CHIAVE SEGRETA QUI IN PRODUZIONE! Usa variabili d'ambiente.
    SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'la_tua_chiave_segreta_di_default_per_sviluppo')
    # SECRET_KEY = config('DJANGO_SECRET_KEY') # Con python-decouple

    # DEBUG = False IN PRODUZIONE!
    DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True' # Default a True per sviluppo
    # DEBUG = config('DJANGO_DEBUG', default=False, cast=bool) # Con python-decouple

    ALLOWED_HOSTS = [] # Inizialmente vuoto
    # In produzione, imposta questo con i tuoi domini:
    # ALLOWED_HOSTS = ['www.iltuosito.com', 'api.iltuosito.com']
    # Per alcune piattaforme PaaS, potresti dover aggiungere '.nomedellapiattaforma.com'
    # o configurarlo tramite le variabili d'ambiente della piattaforma.
    # Se DEBUG è False e ALLOWED_HOSTS è vuoto, Django non funzionerà.
    DJANGO_ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS')
    if DJANGO_ALLOWED_HOSTS:
        ALLOWED_HOSTS = DJANGO_ALLOWED_HOSTS.split(',')


    # ... altre impostazioni ...

    # Configurazione Database (esempio con PostgreSQL, usando variabili d'ambiente)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME'),
            'USER': os.environ.get('DB_USER'),
            'PASSWORD': os.environ.get('DB_PASSWORD'),
            'HOST': os.environ.get('DB_HOST', 'localhost'),
            'PORT': os.environ.get('DB_PORT', '5432'),
        }
    }

    # File Statici (per il deployment)
    STATIC_URL = '/static/'
    # Directory da cui `collectstatic` raccoglierà i file statici delle app
    # e quelli definiti in STATICFILES_DIRS.
    STATIC_ROOT = BASE_DIR / 'staticfiles' # O os.path.join(BASE_DIR, 'staticfiles')

    # Opzionale: se hai file statici non legati a specifiche app
    # STATICFILES_DIRS = [
    #     BASE_DIR / "static", # O os.path.join(BASE_DIR, "static"),
    # ]

    # Media files (file caricati dagli utenti)
    MEDIA_URL = '/media/'
    MEDIA_ROOT = BASE_DIR / 'mediafiles'

    # CORS (assicurati che sia configurato per il tuo dominio di produzione frontend)
    CORS_ALLOWED_ORIGINS = [
        # "http://localhost:3000", # Per sviluppo locale React
        # "https://www.iltuofrontend.com", # Per produzione
    ]
    CORS_ALLOWED_ORIGINS_STRING = os.environ.get('CORS_ALLOWED_ORIGINS')
    if CORS_ALLOWED_ORIGINS_STRING:
        CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS_STRING.split(',')


    # CSRF (per produzione su HTTPS)
    CSRF_COOKIE_SECURE = os.environ.get('DJANGO_CSRF_COOKIE_SECURE', 'False') == 'True'
    SESSION_COOKIE_SECURE = os.environ.get('DJANGO_SESSION_COOKIE_SECURE', 'False') == 'True'
    # CSRF_TRUSTED_ORIGINS = ['https://*.iltuosito.com'] # Se necessario
    ```
    *   **`SECRET_KEY`**: Deve essere unica e segreta. Mai commetterla nel controllo versione se è la chiave di produzione.
    *   **`DEBUG = False`**: Fondamentale. Con `DEBUG = True`, Django mostra pagine di errore dettagliate che possono esporre informazioni sensibili.
    *   **`ALLOWED_HOSTS`**: Una lista dei nomi host/domini che la tua app Django può servire.
    *   **`STATIC_ROOT`**: La directory assoluta dove `collectstatic` copierà tutti i file statici. Questa directory deve essere servita dal tuo web server (Nginx).
    *   **`CSRF_COOKIE_SECURE = True`** e **`SESSION_COOKIE_SECURE = True`**: Impostali a `True` se il tuo sito è servito su HTTPS (altamente raccomandato). Questo assicura che i cookie CSRF e di sessione vengano inviati solo su connessioni sicure.

4.  **Raccogliere i File Statici:**
    Prima di deployare, esegui:
    ```bash
    python manage.py collectstatic --noinput
    ```
    Questo copierà tutti i file statici (dalle tue app, dall'admin di Django, e da `STATICFILES_DIRS`) nella directory specificata da `STATIC_ROOT`.

5.  **Verificare la Configurazione WSGI:**
    Assicurati che il tuo progetto abbia un file `wsgi.py` (es. `myproject/wsgi.py`) correttamente configurato. Gunicorn lo userà come entry point.
    ```python
    # myproject/wsgi.py
    import os
    from django.core.wsgi import get_wsgi_application

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
    application = get_wsgi_application()
    ```

### Preparare React per la Produzione

1.  **Processo di Build:**
    Il codice React che scrivi (con JSX, ES6+, ecc.) non è ottimizzato per la produzione e non è direttamente eseguibile da tutti i browser. Devi "buildare" la tua applicazione React. `create-react-app` gestisce questo con `npm run build`.
    Nella directory della tua app React (es. `frontend_react/`):
    ```bash
    npm run build
    ```
    Questo comando fa diverse cose:
    *   Trascompila JSX e JavaScript moderno in JavaScript compatibile con la maggior parte dei browser.
    *   Minifica il codice (CSS, JS, HTML) per ridurne le dimensioni.
    *   Ottimizza le immagini.
    *   Raggruppa il codice in "bundle" efficienti.
    *   Crea una cartella `build/` con tutti i file statici pronti per essere serviti.

    La cartella `build/` conterrà un `index.html` e sottocartelle `static/css/`, `static/js/`, ecc. Questi sono i file che devi deployare per il tuo frontend.

2.  **Variabili d'Ambiente in React:**
    Se la tua app React ha bisogno di configurazioni diverse per sviluppo e produzione (es. l'URL base della tua API Django), puoi usare le variabili d'ambiente. `create-react-app` supporta variabili d'ambiente prefissate con `REACT_APP_`.
    *   Crea file `.env` (es. `.env.development`, `.env.production`) nella root della tua app React.
        Esempio: `.env.production`
        ```
        REACT_APP_API_URL=https://api.iltuosito.com/logs/api
        ```
        Esempio: `.env.development`
        ```
        REACT_APP_API_URL=http://localhost:8000/logs/api
        ```
    *   Accedi a queste variabili nel codice React con `process.env.REACT_APP_NOME_VARIABILE`.
        ```javascript
        // Esempio in un componente React
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/logs/api';
        // ... usa apiUrl per le chiamate axios ...
        ```
    Quando esegui `npm run build`, `create-react-app` includerà le variabili d'ambiente appropriate nel bundle di produzione.

### Strategie di Deployment

**Strategia 1: Servire il Frontend React tramite Django (Monolitico Semplificato)**

Questa strategia è più semplice per iniziare, specialmente se non vuoi gestire due processi di deployment separati.

1.  **Configura Django per Servire i File di Build di React:**
    *   Dopo aver eseguito `npm run build` nella tua app React, copia il contenuto della cartella `build/` di React in una posizione da cui Django possa servirla. Una convenzione è metterla in una cartella `frontend/` all'interno della directory `STATIC_ROOT` di Django, o in una cartella che aggiungi a `TEMPLATES[0]['DIRS']`.
    *   Oppure, configura `STATICFILES_DIRS` in Django per includere la cartella `build` di React.
        ```python
        # myproject/settings.py
        STATICFILES_DIRS = [
            BASE_DIR / "static", # I tuoi statici Django globali, se ne hai
            BASE_DIR.parent / "frontend_react/build", # Assumendo che frontend_react sia un fratello di myproject
        ]
        # E assicurati che il tuo STATIC_ROOT sia diverso, es.
        STATIC_ROOT = BASE_DIR / 'staticfiles_production'
        ```
    *   Modifica il `urls.py` principale di Django per servire `index.html` di React per tutte le rotte non API (dopo che `collectstatic` ha copiato tutto in `STATIC_ROOT`).
        ```python
        # myproject/urls.py
        from django.urls import path, include, re_path
        from django.views.generic import TemplateView
        from django.conf import settings
        from django.conf.urls.static import static

        urlpatterns = [
            path('admin/', admin.site.urls),
            path('logs/api/', include('learning_logs.urls_api')), # Le tue API DRF
            # ... altre URL API ...
            # Per tutte le altre rotte, servi l'index.html di React
            # Questo deve essere DOPO le tue rotte API
            re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
        ]

        # Servi i file statici (inclusi quelli di React) da STATIC_ROOT in produzione
        # NGINX dovrebbe gestire questo, ma per semplicità o piattaforme PaaS questo può aiutare.
        # Questo non è per DEBUG=True, ma per quando DEBUG=False e vuoi che Django serva gli statici
        # (generalmente non raccomandato per performance, Nginx è meglio).
        # urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) # Sconsigliato in prod vera
        ```
        **Nota:** Servire `index.html` per tutte le rotte non API è cruciale per il routing lato client di React. Quando l'utente naviga a `/pagina-react` o ricarica quella pagina, il server deve restituire `index.html`, e poi `react-router-dom` gestirà la visualizzazione del componente corretto.
        La riga `urlpatterns += static(...)` è più per lo sviluppo con `DEBUG=False` o per piattaforme molto semplici. In una configurazione di produzione robusta, Nginx serve i file statici.

2.  **Processo di Deployment:**
    *   Esegui `npm run build` nell'app React.
    *   Esegui `python manage.py collectstatic` in Django.
    *   Avvia Gunicorn: `gunicorn myproject.wsgi:application` (con le opportune configurazioni per workers, binding, ecc.).
    *   Configura Nginx per fare da reverse proxy a Gunicorn e per servire i file dalla `STATIC_ROOT`.

**Strategia 2: Deployment Separato di Backend e Frontend (PaaS)**

Questa è la strategia più comune e scalabile per applicazioni full-stack moderne. Backend e frontend sono deployati come servizi indipendenti.

*   **Backend Django:**
    *   Piattaforme come Heroku, Render, Google App Engine, AWS Elastic Beanstalk.
    *   **`Procfile` (per Heroku, Render, ecc.):** Un file nella root del progetto Django che dice alla piattaforma come avviare la tua applicazione.
        ```
        web: gunicorn myproject.wsgi --log-file -
        release: python manage.py migrate # Esegui migrazioni al deploy (specifico di Heroku/Render)
        ```
    *   **`runtime.txt` (per Heroku, Render Python):** Specifica la versione di Python.
        ```
        python-3.10.4
        ```
    *   La piattaforma gestirà l'installazione da `requirements.txt`, l'esecuzione di `collectstatic` (a volte), e l'avvio di Gunicorn.
    *   Configura le variabili d'ambiente sulla piattaforma (per `SECRET_KEY`, database, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` con l'URL del frontend deployato).

*   **Frontend React:**
    *   Piattaforme specializzate per app statiche/SPA come Netlify, Vercel, GitHub Pages, AWS S3+CloudFront.
    *   Colleghi il tuo repository Git alla piattaforma.
    *   Configuri il comando di build (es. `npm run build` o `yarn build`) e la directory di pubblicazione (es. `build` o `dist`).
    *   La piattaforma esegue il build e deploya i file statici risultanti su una CDN globale.
    *   Configura le variabili d'ambiente sulla piattaforma (es. `REACT_APP_API_URL` che punta all'URL del tuo backend Django deployato).

**Vantaggi del Deployment Separato:**
*   **Scalabilità Indipendente:** Puoi scalare il backend e il frontend separatamente in base al carico.
*   **Team Specializzati:** Team diversi possono lavorare e deployare in modo indipendente.
*   **Tecnologie Ottimali:** Ogni parte usa la piattaforma di hosting più adatta.
*   **CDN per il Frontend:** Il frontend beneficia della velocità delle Content Delivery Network.

### Considerazioni Finali sul Deployment

*   **Logging:** Configura un logging robusto per Django in produzione per monitorare errori e attività.
*   **Backup del Database:** Assicurati di avere una strategia di backup per il tuo database di produzione.
*   **Monitoraggio:** Usa strumenti per monitorare le performance e la disponibilità della tua applicazione.
*   **HTTPS:** Sempre. Usa Let's Encrypt per certificati SSL gratuiti o quelli forniti dalla tua piattaforma di hosting.
*   **Dominio Personalizzato:** Configura i tuoi domini personalizzati sia per il backend (se accessibile direttamente) sia per il frontend.

Il deployment può essere complesso e varia molto a seconda della piattaforma scelta. Inizia con una piattaforma PaaS per semplificare il processo iniziale.

## Esercizi Pratici (Concettuali)

Poiché il deployment effettivo richiede un account su una piattaforma di hosting, questi esercizi sono più concettuali e preparatori.

1.  **Prepara Django per la Produzione (Localmente):**
    *   Crea un file `requirements.txt` nel tuo progetto Django.
    *   Installa `gunicorn`. Aggiungilo a `requirements.txt`.
    *   Modifica `myproject/settings.py`:
        *   Imposta `DEBUG = False`.
        *   Imposta `ALLOWED_HOSTS = ['127.0.0.1', 'localhost']` (per testare Gunicorn localmente).
        *   Configura `STATIC_ROOT`.
        *   (Opzionale) Prova a usare `os.environ.get()` per `SECRET_KEY` (puoi impostare temporaneamente la variabile nel tuo terminale per testare).
    *   Esegui `python manage.py collectstatic`. Verifica che i file vengano copiati in `STATIC_ROOT`.
    *   Prova ad avviare Gunicorn localmente: `gunicorn myproject.wsgi:application --bind 127.0.0.1:8000`. Visita `127.0.0.1:8000` nel browser. Potresti notare che gli stili dell'admin mancano se non hai configurato un server web per servire `STATIC_ROOT`. Questo è normale; Gunicorn serve solo l'applicazione Django.
2.  **Prepara React per la Produzione:**
    *   Nella directory della tua app React, esegui `npm run build`.
    *   Esplora la cartella `build/` generata per capire la struttura dei file di produzione.
    *   (Opzionale) Se vuoi testare la build di produzione localmente, puoi usare un semplice server HTTP come `serve`:
        ```bash
        npm install -g serve  # Installa globalmente (o usa npx serve)
        serve -s build        # Serve la cartella build
        ```
        Questo avvierà un server (di solito su porta diversa, es. 3000 o 5000) che serve la tua app React buildata.
3.  **Crea File di Configurazione per una Piattaforma PaaS (es. Heroku/Render):**
    *   Nel tuo progetto Django, crea un `Procfile` con il comando `web: gunicorn myproject.wsgi --log-file -`.
    *   Crea un `runtime.txt` con la tua versione di Python (es. `python-3.10.12`).
    *   Rivedi il tuo `requirements.txt` per assicurarti che sia pulito e contenga tutte le dipendenze necessarie (incluso `psycopg2-binary` se usi PostgreSQL, `gunicorn`, `django-cors-headers`, ecc.).
4.  **Ricerca una Piattaforma di Deployment:**
    *   Scegli una piattaforma PaaS per il backend Django (es. Render, Heroku) e una per il frontend React (es. Netlify, Vercel, Render Static Sites).
    *   Leggi la documentazione "Getting Started" o "Deploy Django/React App" per le piattaforme scelte.
    *   Comprendi come configurare le variabili d'ambiente, collegare un database (per Django), e impostare i comandi di build/avvio su queste piattaforme.
    *   **Non è richiesto il deployment effettivo per questo esercizio**, ma la comprensione del processo.

Questo capitolo fornisce una panoramica. Il deployment reale spesso implica la risoluzione di problemi specifici della piattaforma e una configurazione più dettagliata.
```
