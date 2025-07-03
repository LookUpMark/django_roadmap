# OBIETTIVO: Completare l'Esercizio 3 ("Crea File di Configurazione per una Piattaforma PaaS")
#            descritto nel README.md del Capitolo 9.
# COMPITO: Creare i file `Procfile` e `runtime.txt` nella root del progetto Django,
#          utili per il deployment su piattaforme PaaS come Heroku o Render.
# Questo file è una guida per la creazione di questi file di configurazione.

# --- Creazione del `Procfile` ---

# TODO 1: Nella directory principale del tuo progetto Django (la cartella che contiene `manage.py`
#         e la cartella del progetto `myproject_exercise/`), crea un file chiamato `Procfile` (senza estensione).

# TODO 2: Aggiungi il seguente contenuto al file `Procfile`.
#         Questo dice alla piattaforma PaaS come avviare il tuo server web Gunicorn.
#         Assicurati che 'myproject_exercise.wsgi' corrisponda al percorso del tuo file wsgi.py
#         (nome_progetto.wsgi).
"""Procfile content:
web: gunicorn myproject_exercise.wsgi --log-file -
release: python manage.py migrate
"""
#         - `web:` definisce il processo web principale.
#         - `gunicorn myproject_exercise.wsgi` avvia Gunicorn usando la configurazione WSGI del tuo progetto.
#         - `--log-file -` invia i log di Gunicorn allo standard output, che la piattaforma PaaS di solito cattura.
#         - `release:` (specifico per alcune piattaforme come Heroku/Render) definisce un comando da eseguire
#           durante la fase di rilascio di un nuovo deploy, come l'applicazione delle migrazioni del database.

# --- Creazione del `runtime.txt` ---

# TODO 3: Nella stessa directory principale del progetto Django, crea un file chiamato `runtime.txt`.

# TODO 4: Aggiungi al file `runtime.txt` la versione di Python che vuoi che la piattaforma PaaS utilizzi.
#         È importante che questa versione sia compatibile con il tuo codice e le tue dipendenze.
#         Per trovare la tua versione locale di Python, puoi eseguire `python --version` nel terminale.
#         Esempio di contenuto per `runtime.txt`:
"""runtime.txt content:
python-3.10.12
"""
#         Sostituisci `3.10.12` con la versione desiderata (es. python-3.9.x, python-3.11.x, ecc.).
#         Controlla la documentazione della tua piattaforma PaaS per le versioni di Python supportate.

# --- Revisione `requirements.txt` ---

# TODO 5: Assicurati che il tuo file `requirements.txt` (nella root del progetto Django) sia aggiornato
#         e contenga tutte le dipendenze necessarie per la produzione, tra cui:
#         - `django`
#         - `gunicorn`
#         - `psycopg2-binary` (se usi PostgreSQL)
#         - `djangorestframework`
#         - `django-cors-headers`
#         - `python-decouple` o `django-environ` (se li usi per le variabili d'ambiente)
#         - Altre dipendenze specifiche del tuo progetto.
#         Puoi rigenerarlo con `pip freeze > requirements.txt` dal tuo ambiente virtuale
#         dopo esserti assicurato che tutte le dipendenze di produzione siano installate.

print("File exercise_3_paas_configs.py creato.")
print("Questo file è una guida per la creazione di `Procfile` e `runtime.txt`.")
print("1. Crea il file `Procfile` nella root del tuo progetto Django con il contenuto indicato (TODO 1-2).")
print("2. Crea il file `runtime.txt` nella root del tuo progetto Django con il contenuto indicato (TODO 3-4).")
print("3. Rivedi e aggiorna il tuo `requirements.txt` (TODO 5).")
print("Fai riferimento all'Esercizio 3 nel README.md del Capitolo 9 per i dettagli.")
