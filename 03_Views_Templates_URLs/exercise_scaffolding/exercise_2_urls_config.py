# OBIETTIVO: Completare l'Esercizio 2 ("Configura le URL") descritto nel README.md del Capitolo 3.
# COMPITO: Configurare `urls.py` a livello di progetto per includere le URL dell'app,
#          e creare/configurare `urls.py` a livello di app per mappare le viste create.
# Questo file serve come traccia per il contenuto dei tuoi file `urls.py`.

# --- Configurazione urls.py a livello di Progetto ---
# Immagina che questo sia il contenuto del tuo file `myproject_exercise/urls.py`

"""
from django.contrib import admin
from django.urls import path, include # TODO 1: Assicurati che 'include' sia importato.

urlpatterns = [
    path('admin/', admin.site.urls),
    # TODO 2: (Rif. Esercizio 2 del README) Includere le URL della tua app (es. 'pizzeria_app').
    #         Scegli un prefisso per le URL dell'app, ad esempio 'pizzeria/'.
    #         Il path dovrebbe puntare a 'pizzeria_app.urls'.
    # Esempio: path('pizzeria/', include('pizzeria_app.urls')),
]
"""

# --- Configurazione urls.py a livello di App ---
# Crea un nuovo file `urls.py` nella directory della tua app (es. `pizzeria_app/urls.py`)
# Immagina che questo sia il contenuto del tuo nuovo file `pizzeria_app/urls.py`

"""
from django.urls import path
# TODO 3: Importa le viste dal modulo views.py della tua app.
# from . import views # Decommenta e usa

# TODO 4: (Rif. Esercizio 2 del README) Definire app_name per il namespace.
# app_name = 'pizzeria_app' # Sostituisci con il nome della tua app

urlpatterns = [
    # TODO 5: (Rif. Esercizio 2 del README) Mappare la URL radice dell'app (path vuoto '')
    #         alla vista `views.index`. Assegnale il nome 'index'.
    # Esempio: path('', views.index, name='index'),

    # TODO 6: (Rif. Esercizio 2 del README) Mappare la URL 'libri/'
    #         alla vista `views.lista_libri`. Assegnale il nome 'lista_libri'.
    # Esempio: path('libri/', views.lista_libri, name='lista_libri'),

    # TODO 7: (Rif. Esercizio 2 del README) Mappare la URL dinamica 'libri/<int:libro_id>/'
    #         alla vista `views.dettaglio_libro`. Assegnale il nome 'dettaglio_libro'.
    #         `<int:libro_id>` cattura un intero dalla URL e lo passa come argomento `libro_id` alla vista.
    # Esempio: path('libri/<int:libro_id>/', views.dettaglio_libro, name='dettaglio_libro'),
]
"""

print("File exercise_2_urls_config.py creato.")
print("1. Apri il file urls.py del tuo progetto ('myproject_exercise/urls.py') e modificalo come da TODO 1-2.")
print("2. Crea un nuovo file urls.py nella directory della tua app ('pizzeria_app/urls.py').")
print("3. Modifica 'pizzeria_app/urls.py' come indicato nei TODO 3-7.")
print("Fai riferimento all'Esercizio 2 nel README.md del Capitolo 3 per i dettagli.")
