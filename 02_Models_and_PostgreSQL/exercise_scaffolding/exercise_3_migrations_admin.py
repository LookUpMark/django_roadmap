# OBIETTIVO: Completare gli Esercizi 5, 6, 7 e 8 ("Esegui le Migrazioni", "Crea un Superutente",
#            "Registra i Modelli nell'Admin", "Esplora l'Admin") descritti nel README.md del Capitolo 2.
# COMPITO: Creare ed eseguire migrazioni per i modelli definiti, creare un superutente,
#          registrare i modelli nell'interfaccia di amministrazione e testarla.
# Questo file è una guida mista di comandi da terminale e modifiche al codice.

# PREREQUISITI:
# - Aver completato exercise_1_models_definition.py (definito i modelli Autore e Libro in `models.py`).
# - Aver completato exercise_2_db_configuration.py (configurato `settings.py` per PostgreSQL).

# --- Migrazioni (Azioni nel terminale) ---

# TODO 1: (Rif. Esercizio 5 del README) Creare i file di migrazione.
#          Assicurati di essere nella directory del progetto che contiene `manage.py`.
#          Specifica il nome della tua app (es. `pizzeria_app` o `learning_logs`).
# Esempio nel terminale:
# python manage.py makemigrations pizzeria_app
# (Django dovrebbe rilevare i nuovi modelli Autore e Libro e creare un file di migrazione)

# TODO 2: (Rif. Esercizio 5 del README) Applicare le migrazioni al database.
#          Questo creerà le tabelle nel tuo database PostgreSQL.
# Esempio nel terminale:
# python manage.py migrate
# (Puoi verificare nel tuo strumento DB che le tabelle siano state create,
#  es. `pizzeria_app_autore` e `pizzeria_app_libro`)

# --- Creazione Superutente (Azione nel terminale) ---

# TODO 3: (Rif. Esercizio 6 del README) Creare un superutente Django.
#          Questo utente potrà accedere all'interfaccia di amministrazione.
# Esempio nel terminale:
# python manage.py createsuperuser
# (Segui le istruzioni per impostare username, email e password)

# --- Registrazione Modelli nell'Admin (Modifiche nel codice) ---

# TODO 4: (Rif. Esercizio 7 del README) Registrare i modelli Autore e Libro nell'Admin.
#          Apri il file `admin.py` della tua app (es. `pizzeria_app/admin.py`).
#          Importa i modelli e registrali.

# Esempio di come dovrebbe apparire il contenuto di `pizzeria_app/admin.py`:
"""
from django.contrib import admin
from .models import Autore, Libro # TODO 4.1: Importa i tuoi modelli Autore e Libro

# TODO 4.2: Registra il modello Autore con l'admin site.
# admin.site.register(Autore)

# TODO 4.3: Registra il modello Libro con l'admin site.
# admin.site.register(Libro)
"""

# --- Esplorare l'Admin (Azioni nel browser) ---

# TODO 5: (Rif. Esercizio 8 del README) Avviare il server di sviluppo.
# Esempio nel terminale:
# python manage.py runserver

# TODO 6: (Rif. Esercizio 8 del README) Accedere all'interfaccia di Admin.
#          Apri il browser e vai a http://127.0.0.1:8000/admin/
#          Effettua il login con le credenziali del superutente creato al TODO 3.

# TODO 7: (Rif. Esercizio 8 del README) Esplorare l'Admin.
#          - Dovresti vedere le sezioni "Autores" e "Libros" (o i nomi plurali dei tuoi modelli).
#          - Prova ad aggiungere alcuni autori.
#          - Prova ad aggiungere alcuni libri, associandoli agli autori creati.
#          - Esplora le funzionalità di modifica ed eliminazione.

# TODO 8: Fermare il server di sviluppo (CTRL+C nel terminale).

print("File exercise_3_migrations_admin.py creato.")
print("Esegui i TODO 1, 2, 3 nel tuo terminale.")
print("Poi, apri il file admin.py della tua app e modificalo come indicato nel TODO 4.")
print("Infine, esegui i TODO 5-8 per testare l'interfaccia di amministrazione.")
print("Fai riferimento agli Esercizi 5, 6, 7 e 8 nel README.md del Capitolo 2.")
