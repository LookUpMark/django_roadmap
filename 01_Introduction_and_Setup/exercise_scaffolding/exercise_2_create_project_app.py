# OBIETTIVO: Completare gli Esercizi 3, 4 e 5 ("Crea il Progetto", "Crea l'App", "Avvia il Server")
#            descritti nel README.md del Capitolo 1.
# COMPITO: Eseguire i comandi per creare un progetto e un'app Django, configurare l'app
#          e avviare il server di sviluppo.
# Questo file è principalmente una guida di commenti.

# PREREQUISITO: Aver completato exercise_1_setup_env.py (ambiente virtuale attivo e Django installato).

# TODO 1: (Rif. Esercizio 3 del README) Creare un nuovo progetto Django.
#          Assicurati di essere nella cartella principale del corso (es. django_react_corso_esercizi).
#          Il nome del progetto deve essere 'myproject_exercise'.
#          Importante: crea il progetto nella directory corrente per evitare un annidamento extra.
# Esempio nel terminale:
# django-admin startproject myproject_exercise .
# (Verifica che una cartella 'myproject_exercise' e un file 'manage.py' siano stati creati)

# TODO 2: (Rif. Esercizio 4 del README) Navigare nella directory del progetto appena creato.
# Esempio nel terminale:
# cd myproject_exercise
# (O se hai usato il '.', sei già dentro la cartella che contiene manage.py e la cartella myproject_exercise)
# Assicurati di essere nella directory che contiene 'manage.py'.

# TODO 3: (Rif. Esercizio 4 del README) Creare una nuova app Django chiamata 'pizzeria_app'.
# Esempio nel terminale:
# python manage.py startapp pizzeria_app
# (Verifica che una cartella 'pizzeria_app' sia stata creata)

# TODO 4: (Rif. Esercizio 4 del README) Registrare la nuova app 'pizzeria_app' nel progetto.
#          Modifica il file 'myproject_exercise/settings.py'.
#          Trova la lista INSTALLED_APPS e aggiungi 'pizzeria_app' alla fine.
# Esempio di come dovrebbe apparire la sezione in settings.py:
"""
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'pizzeria_app', # La tua nuova app
]
"""

# TODO 5: (Rif. Esercizio 5 del README) Avviare il server di sviluppo Django.
#          Assicurati di essere nella directory che contiene 'manage.py'.
# Esempio nel terminale:
# python manage.py runserver
# (Il server dovrebbe avviarsi. Apri il browser all'indirizzo http://127.0.0.1:8000/)
# Dovresti vedere la pagina di benvenuto di Django.

# TODO 6: Fermare il server di sviluppo (CTRL+C nel terminale).

print("Se vedi questo messaggio, hai creato il file Python correttamente.")
print("Assicurati di aver eseguito tutti i TODO nel tuo terminale e modificato settings.py come descritto.")
print("Fai riferimento agli Esercizi 3, 4 e 5 nel README.md del Capitolo 1 per i dettagli.")
