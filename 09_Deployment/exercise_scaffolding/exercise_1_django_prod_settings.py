# OBIETTIVO: Completare l'Esercizio 1 ("Prepara Django per la Produzione (Localmente)")
#            descritto nel README.md del Capitolo 9.
# COMPITO: Modificare `settings.py` del progetto Django per includere configurazioni
#          orientate alla produzione, come la gestione di DEBUG, ALLOWED_HOSTS,
#          STATIC_ROOT e l'uso di variabili d'ambiente (concettualmente).
#          Questo file serve come traccia per le modifiche da apportare.

# Immagina di modificare il file `myproject_exercise/settings.py` del tuo progetto Django.

"""
import os
from pathlib import Path
# from decouple import config # Esempio se usi python-decouple

BASE_DIR = Path(__file__).resolve().parent.parent

# TODO 1: Gestire SECRET_KEY tramite variabile d'ambiente.
#         In produzione, la SECRET_KEY NON DEVE essere hardcoded e versionata.
#         Per lo sviluppo, puoi mantenere un default se la variabile d'ambiente non è presente.
# SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'la_tua_chiave_segreta_di_sviluppo_qui')
# SECRET_KEY = config('DJANGO_SECRET_KEY', default='valore_di_default_per_sviluppo')

# TODO 2: Gestire DEBUG tramite variabile d'ambiente.
#         DEBUG deve essere False in produzione.
# DEBUG_ENV = os.environ.get('DJANGO_DEBUG', 'True') # Default a 'True' per sviluppo
# DEBUG = DEBUG_ENV.lower() in ['true', '1', 't']
# DEBUG = config('DJANGO_DEBUG', default=False, cast=bool) # Con python-decouple

# TODO 3: Gestire ALLOWED_HOSTS tramite variabile d'ambiente.
#         In produzione, deve contenere i domini/host effettivi del tuo sito.
#         Per testare Gunicorn localmente (come suggerito nell'esercizio), puoi aggiungere '127.0.0.1', 'localhost'.
# ALLOWED_HOSTS_STRING = os.environ.get('DJANGO_ALLOWED_HOSTS', '127.0.0.1,localhost')
# ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS_STRING.split(',') if host.strip()]
# if not ALLOWED_HOSTS and DEBUG: # Per sviluppo locale se DJANGO_ALLOWED_HOSTS non è settato
#     ALLOWED_HOSTS = ['127.0.0.1', 'localhost']


# ... (Altre impostazioni come INSTALLED_APPS, MIDDLEWARE, ecc. dovrebbero già esserci) ...


# TODO 4: Configurare STATIC_URL e STATIC_ROOT.
#         STATIC_URL è l'URL da cui verranno serviti i file statici (es. '/static/').
#         STATIC_ROOT è la directory assoluta dove `collectstatic` copierà tutti i file statici
#         per il deployment.
# STATIC_URL = '/static/'
# STATIC_ROOT = BASE_DIR / 'staticfiles_production' # O os.path.join(BASE_DIR, 'staticfiles_production')

# TODO 5: (Opzionale) Configurare STATICFILES_DIRS se hai file statici globali
#         non legati a specifiche app, e se vuoi che `collectstatic` li includa.
#         Esempio: STATICFILES_DIRS = [BASE_DIR / "global_static_files"]

# TODO 6: (Opzionale, ma buona pratica per produzione HTTPS) Configurare CSRF e Session cookies.
# CSRF_COOKIE_SECURE = os.environ.get('DJANGO_CSRF_COOKIE_SECURE', 'False').lower() in ['true', '1', 't']
# SESSION_COOKIE_SECURE = os.environ.get('DJANGO_SESSION_COOKIE_SECURE', 'False').lower() in ['true', '1', 't']
# Se usi HTTPS, questi dovrebbero essere True.

# TODO 7: (Azione esterna) Installare Gunicorn.
#         Nel terminale: `pip install gunicorn`
#         Aggiungerlo a `requirements.txt`: `pip freeze > requirements.txt`

# TODO 8: (Azione esterna) Eseguire `collectstatic`.
#         Nel terminale: `python manage.py collectstatic --noinput`
#         Verifica che i file vengano copiati nella directory definita da `STATIC_ROOT`.

# TODO 9: (Azione esterna) Testare Gunicorn localmente.
#         Nel terminale: `gunicorn myproject_exercise.wsgi:application --bind 127.0.0.1:8001`
#         (usa una porta diversa da 8000 se il server di sviluppo Django è in esecuzione).
#         Apri http://127.0.0.1:8001 nel browser.
#         Nota: Gli stili dell'admin potrebbero non funzionare correttamente con Gunicorn da solo,
#         perché Gunicorn non serve file statici. In produzione, Nginx o Whitenoise gestirebbero questo.
#         Per testare con Whitenoise (semplifica il serving di statici con Gunicorn):
#         - `pip install whitenoise`
#         - Aggiungi `whitenoise.middleware.WhiteNoiseMiddleware` a `MIDDLEWARE` in `settings.py`,
#           subito dopo `SecurityMiddleware`.
#           MIDDLEWARE = [
#               'django.middleware.security.SecurityMiddleware',
#               'whitenoise.middleware.WhiteNoiseMiddleware',
#               # ... altri middleware ...
#           ]
#         - Riprova Gunicorn. Ora gli statici (inclusi quelli dell'admin) dovrebbero essere serviti.
"""

print("File exercise_1_django_prod_settings.py creato.")
print("Questo file è una guida per le modifiche da apportare a `myproject_exercise/settings.py`.")
print("1. Apporta le modifiche indicate dai TODO 1-6 nel tuo `settings.py`.")
print("2. Esegui le azioni esterne indicate nei TODO 7-9 nel tuo terminale.")
print("Fai riferimento all'Esercizio 1 nel README.md del Capitolo 9 per i dettagli completi.")
