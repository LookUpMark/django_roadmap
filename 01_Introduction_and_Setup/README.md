# Capitolo 1: Fondamenti di Django e Configurazione dell'Ambiente

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Comprendere l'architettura MVT (Model-View-Template) di Django.
*   Creare e attivare un ambiente virtuale Python.
*   Installare Django utilizzando pip.
*   Creare un nuovo progetto Django.
*   Creare una nuova applicazione Django all'interno di un progetto.
*   Comprendere la struttura di base delle cartelle di un progetto e di un'app Django.
*   Conoscere lo scopo dei file chiave come `manage.py`, `settings.py`, e `urls.py`.
*   Avviare il server di sviluppo di Django per visualizzare la pagina di benvenuto.

## Lezione Teorica

### L'Architettura MVT di Django

Django segue il pattern architetturale **MVT (Model-View-Template)**, che è una variante del più noto MVC (Model-View-Controller). Ecco come si suddivide:

*   **Model (Modello):** È il livello dei dati. Si occupa di interagire con il database. In Django, i modelli sono classi Python che mappano tabelle del database. L'ORM (Object-Relational Mapper) di Django facilita questa interazione.
*   **View (Vista):** È il livello della logica di business. Riceve una richiesta HTTP, elabora i dati (interagendo con i Modelli se necessario) e restituisce una risposta HTTP. In Django, le viste sono funzioni o classi Python. **Importante:** La "View" di Django è più simile al "Controller" nel pattern MVC.
*   **Template (Modello di Presentazione):** È il livello della presentazione. Si occupa di come i dati vengono mostrati all'utente. In Django, i template sono tipicamente file HTML con una sintassi speciale per inserire dati dinamici e logica di base. La "Template" di Django è più simile alla "View" nel pattern MVC.

Il flusso tipico di una richiesta in Django è:
1.  L'utente invia una richiesta tramite il browser.
2.  Django, attraverso il file `urls.py` principale, determina quale "view" deve gestire quella specifica URL.
3.  La "view" esegue la logica necessaria: potrebbe recuperare dati dal database tramite i "model", eseguire calcoli, ecc.
4.  La "view" quindi passa i dati a un "template".
5.  Il "template" renderizza l'HTML finale con i dati ricevuti.
6.  Django invia la risposta HTTP (l'HTML renderizzato) al browser dell'utente.

### Creare un Ambiente Virtuale Python

Prima di installare Django, è buona pratica creare un ambiente virtuale. Questo isola le dipendenze del tuo progetto da quelle di altri progetti e dal sistema Python globale.

```bash
# Crea una cartella per il tuo progetto (opzionale, ma consigliato)
mkdir mio_progetto_django
cd mio_progetto_django

# Crea un ambiente virtuale (il nome 'venv' è una convenzione comune)
python -m venv venv
```

Dopo aver creato l'ambiente virtuale, devi attivarlo:

*   Su macOS e Linux:
    ```bash
    source venv/bin/activate
    ```
*   Su Windows (prompt dei comandi):
    ```bash
    .\venv\Scripts\activate
    ```
*   Su Windows (PowerShell):
    ```bash
    .\venv\Scripts\Activate.ps1
    ```

Una volta attivato, il nome dell'ambiente virtuale apparirà all'inizio del prompt del tuo terminale (es. `(venv)`). Per disattivarlo, esegui semplicemente il comando `deactivate`.

### Installazione di Django

Con l'ambiente virtuale attivo, puoi installare Django usando `pip`, il gestore di pacchetti Python:

```bash
pip install django
```

Puoi verificare che Django sia stato installato correttamente e controllarne la versione con:

```bash
python -m django --version
```

### Creare un Nuovo Progetto Django

Un "progetto" Django è una collezione di impostazioni e app per un particolare sito web o applicazione. Per creare un nuovo progetto, usa il comando `django-admin startproject`:

```bash
django-admin startproject nome_del_progetto .
```

*   `nome_del_progetto`: Sostituiscilo con il nome che vuoi dare al tuo progetto (es. `config` o `myproject`). Per gli esercizi di scaffolding, useremo `myproject_exercise`.
*   `.` (punto): Indica di creare il progetto nella directory corrente. Se omesso, verrà creata una nuova cartella con il nome del progetto. Per questo corso, usare il `.` è spesso preferito per evitare un livello di annidamento superfluo.

Questo comando creerà una cartella `nome_del_progetto` e un file `manage.py` nella directory corrente.

### Creare una Nuova App Django

Un'"applicazione" (o "app") Django è un modulo Python che fa qualcosa di specifico. Un progetto Django può contenere molte app. Ad esempio, potresti avere un'app per un blog, un'app per un forum, un'app per la gestione degli utenti, ecc. Le app sono pensate per essere riutilizzabili.

Per creare una nuova app, vai nella directory del progetto (dove si trova `manage.py`) e usa il comando `python manage.py startapp`:

```bash
python manage.py startapp nome_della_app
```

*   `nome_della_app`: Sostituiscilo con il nome che vuoi dare alla tua app (es. `blog`, `prodotti`). Per gli esercizi di scaffolding, useremo `pizzeria_app`.

Questo comando creerà una nuova cartella con il nome dell'app, contenente vari file specifici per l'app.

**Importante:** Dopo aver creato un'app, devi informare Django della sua esistenza aggiungendola all'elenco `INSTALLED_APPS` nel file `settings.py` del tuo progetto.

```python
# nome_del_progetto/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'nome_della_app',  # Aggiungi qui la tua nuova app (es. 'pizzeria_app')
]
```

### Struttura delle Cartelle e File Chiave

Dopo aver creato un progetto e un'app, la struttura delle cartelle sarà simile a questa:

```
mio_progetto_django/ # Cartella principale del corso
├── myproject_exercise/      <-- Cartella di configurazione del progetto
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py       <-- Impostazioni del progetto
│   ├── urls.py           <-- URL a livello di progetto
│   └── wsgi.py
├── pizzeria_app/         <-- Cartella dell'applicazione (esempio)
│   ├── __init__.py
│   ├── admin.py          <-- Configurazione dell'interfaccia di amministrazione
│   ├── apps.py           <-- Configurazione dell'applicazione
│   ├── migrations/       <-- Migrazioni del database
│   │   └── __init__.py
│   ├── models.py         <-- Definizioni dei modelli di dati
│   ├── tests.py          <-- Test per l'applicazione
│   └── views.py          <-- Logica delle viste (funzioni/classi)
├── manage.py             <-- Utilità a riga di comando del progetto
└── venv_esercizi/        <-- Ambiente virtuale (esempio)
```

Scopo dei file chiave:

*   **`manage.py`**: Un'utilità a riga di comando che ti permette di interagire con il tuo progetto Django in vari modi (es. avviare il server, creare migrazioni, creare superuser). È il tuo principale strumento di lavoro.
*   **`nome_del_progetto/settings.py`**: Contiene tutte le configurazioni del tuo progetto Django, come la configurazione del database, le app installate, la gestione dei file statici, le chiavi segrete, ecc.
*   **`nome_del_progetto/urls.py`**: Definisce le rotte URL a livello di progetto. Qui mappi le URL alle viste. Ogni app può anche avere il proprio file `urls.py`.
*   **`nome_della_app/models.py`**: Qui definisci i modelli di dati per la tua applicazione.
*   **`nome_della_app/views.py`**: Qui scrivi la logica delle tue viste.
*   **`nome_della_app/admin.py`**: Qui registri i tuoi modelli per renderli accessibili tramite l'interfaccia di amministrazione di Django.
*   **`nome_della_app/migrations/`**: Questa cartella contiene i file di migrazione generati da Django quando modifichi i tuoi modelli. Le migrazioni tengono traccia delle modifiche allo schema del database.

### Lanciare il Server di Sviluppo

Django include un server web leggero per lo sviluppo. Per avviarlo, assicurati di essere nella directory principale del progetto (dove si trova `manage.py`) e esegui:

```bash
python manage.py runserver
```

Se tutto è configurato correttamente, vedrai un output simile a:

```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
You have unapplied migrations; your app may not work properly until they are applied.
Run 'python manage.py migrate' to apply them.
October 26, 2023 - 15:00:00 # Data e ora fittizie
Django version 4.x.x, using settings 'nome_del_progetto.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Apri il tuo browser e vai all'indirizzo `http://127.0.0.1:8000/`. Dovresti vedere la pagina di benvenuto di Django ("The install worked successfully! Congratulations!").

Per fermare il server di sviluppo, premi `CTRL+C` nel terminale.

## Esercizi Pratici

**Nota per lo studente:** Lo scaffolding per questi esercizi si trova nella cartella `exercise_scaffolding/` di questo capitolo. I file `.py` lì presenti contengono commenti `TODO` che ti guideranno. Questo `README.md` fornisce la descrizione completa degli esercizi.

1.  **Esercizio 1: Crea l'Ambiente**
    *   **Obiettivo:** Configurare l'ambiente di sviluppo Python e installare Django.
    *   **Passi (da eseguire nel terminale):**
        1.  Crea una nuova cartella per il tuo progetto di esercizi (es. `django_react_corso_esercizi`).
        2.  All'interno di questa cartella, crea un ambiente virtuale Python (es. `venv_esercizi`).
            ```bash
            python -m venv venv_esercizi
            ```
        3.  Attiva l'ambiente virtuale.
            *   macOS/Linux: `source venv_esercizi/bin/activate`
            *   Windows (cmd): `.\venv_esercizi\Scripts\activate`
            *   Windows (PowerShell): `.\venv_esercizi\Scripts\Activate.ps1`
        4.  Con l'ambiente virtuale attivo, installa Django.
            ```bash
            pip install django
            ```
        5.  Verifica l'installazione.
            ```bash
            python -m django --version
            ```
    *   **Riferimento Scaffolding:** `exercise_scaffolding/exercise_1_setup_env.py`

2.  **Esercizio 2 (Combinato con Esercizi 3, 4, 5 del README originale): Crea Progetto, App e Avvia Server**
    *   **Obiettivo:** Creare la struttura base di un progetto e un'app Django, e avviare il server.
    *   **Passi:**
        1.  **Crea il Progetto (Rif. Esercizio 3 del README originale):**
            *   Assicurati di essere nella cartella creata al punto 1.1 (es. `django_react_corso_esercizi`).
            *   Crea un nuovo progetto Django chiamato `myproject_exercise`. Usa il `.` alla fine del comando per evitare un ulteriore livello di directory.
                ```bash
                django-admin startproject myproject_exercise .
                ```
        2.  **Crea l'App (Rif. Esercizio 4 del README originale):**
            *   Naviga nella directory principale del progetto (quella che contiene `manage.py`).
            *   Crea una nuova app Django chiamata `pizzeria_app`.
                ```bash
                python manage.py startapp pizzeria_app
                ```
            *   Registra l'app `pizzeria_app` nel file `myproject_exercise/settings.py` aggiungendola alla lista `INSTALLED_APPS`.
        3.  **Avvia il Server (Rif. Esercizio 5 del README originale):**
            *   Dalla directory del progetto (quella con `manage.py`), avvia il server di sviluppo.
                ```bash
                python manage.py runserver
                ```
            *   Apri il browser e visita `http://127.0.0.1:8000/` per vedere la pagina di benvenuto di Django.
            *   Ferma il server con `CTRL+C`.
    *   **Riferimento Scaffolding:** `exercise_scaffolding/exercise_2_create_project_app.py`
