# OBIETTIVO: Completare gli Esercizi 1, 2 e 3 ("Prepara PostgreSQL", "Installa psycopg2-binary",
#            "Configura settings.py") descritti nel README.md del Capitolo 2.
# COMPITO: Preparare il database PostgreSQL, installare il driver e modificare settings.py
#          per usare PostgreSQL.
# Questo file è principalmente una guida di commenti.

# --- Preparazione PostgreSQL e Installazione Driver (Azioni nel terminale/DB Tool) ---

# TODO 1: (Rif. Esercizio 1 del README) Preparare PostgreSQL.
#          - Assicurati che PostgreSQL sia installato e in esecuzione.
#          - Crea un nuovo utente PostgreSQL (se non ne hai uno per lo sviluppo).
#          - Crea un nuovo database vuoto per il progetto (es. `dpr_learning_db_exercise`).
#          Queste azioni si eseguono usando `psql` o uno strumento grafico come pgAdmin.

# TODO 2: (Rif. Esercizio 2 del README) Installare `psycopg2-binary`.
#          Attiva il tuo ambiente virtuale Django (es. `venv_esercizi`).
# Esempio nel terminale:
# pip install psycopg2-binary
#          Aggiungilo anche al tuo file `requirements.txt` se lo stai mantenendo.
# pip freeze > requirements.txt

# --- Configurazione di settings.py (Modifiche nel codice) ---

# TODO 3: (Rif. Esercizio 3 del README) Modificare `myproject_exercise/settings.py`.
#          Trova la sezione `DATABASES` e modificala per connetterti al tuo database PostgreSQL.
#          Usa le credenziali e il nome del database che hai creato al TODO 1.

# Esempio di come dovrebbe apparire la sezione DATABASES in `settings.py`:
"""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql', # TODO 3.1: Imposta l'engine corretto
        'NAME': 'NOME_DEL_TUO_DATABASE',          # TODO 3.2: Sostituisci con il nome del tuo DB (es. dpr_learning_db_exercise)
        'USER': 'NOME_UTENTE_POSTGRESQL',         # TODO 3.3: Sostituisci con il tuo utente DB
        'PASSWORD': 'PASSWORD_UTENTE_POSTGRESQL', # TODO 3.4: Sostituisci con la tua password DB
        'HOST': 'localhost',                        # TODO 3.5: O l'indirizzo del server DB se non è locale (lascia 'localhost' se locale)
        'PORT': '5432',                             # TODO 3.6: Porta standard di PostgreSQL (lascia '5432' se standard)
    }
}
"""

# NOTA IMPORTANTE SULLA SICUREZZA:
# Non inserire mai credenziali reali (password) direttamente nel codice sorgente
# che viene committato in un repository Git pubblico. Per lo sviluppo locale va bene,
# ma per la produzione, usa variabili d'ambiente o altri metodi sicuri.

print("File exercise_2_db_configuration.py creato.")
print("Esegui i TODO 1 e 2 nel tuo terminale/strumento DB.")
print("Poi, apri il file settings.py del tuo progetto ('myproject_exercise/settings.py')")
print("e modifica la sezione DATABASES come indicato nel TODO 3.")
print("Fai riferimento agli Esercizi 1, 2 e 3 nel README.md del Capitolo 2 per i dettagli.")
