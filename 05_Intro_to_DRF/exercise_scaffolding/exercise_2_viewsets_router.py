# OBIETTIVO: Completare gli Esercizi 3 e 4 ("Crea i ViewSet", "Configura le URL dell'API con un Router")
#            descritti nel README.md del Capitolo 5.
# COMPITO: Creare AutoreViewSet e LibroViewSet nel file views.py (o un nuovo views_api.py)
#          e configurare il router DRF nel file urls.py dell'app.
#          Questo file serve come traccia.

# --- Creazione dei ViewSet ---
# Immagina di aggiungere queste classi al tuo file `pizzeria_app/views.py`
# (o crea un `pizzeria_app/views_api.py` e importa lì)

"""
from rest_framework import viewsets
# TODO 1: Importa i modelli Autore e Libro dal tuo file models.py.
# from .models import Autore, Libro # Decommenta e correggi

# TODO 2: Importa i serializer AutoreSerializer e LibroSerializer dal tuo file serializers.py.
# from .serializers import AutoreSerializer, LibroSerializer # Decommenta e correggi

class AutoreViewSet(viewsets.ModelViewSet):
    # TODO 3a: Definire il queryset per AutoreViewSet.
    #          Deve recuperare tutti gli oggetti Autore, ordinati per cognome e nome.
    #          Esempio: queryset = Autore.objects.all().order_by('cognome', 'nome')
    queryset = None # Sostituisci None con la definizione corretta

    # TODO 3b: Definire la serializer_class per AutoreViewSet.
    #          Deve essere AutoreSerializer.
    serializer_class = None # Sostituisci None con il serializer corretto

    # TODO 3c: (Opzionale per ora) Definire permessi, autenticazione, ecc.
    #            Lo vedremo nel prossimo capitolo.

class LibroViewSet(viewsets.ModelViewSet):
    # TODO 4a: Definire il queryset per LibroViewSet.
    #          Deve recuperare tutti gli oggetti Libro, ordinati per titolo.
    #          Esempio: queryset = Libro.objects.all().order_by('titolo')
    queryset = None # Sostituisci None con la definizione corretta

    # TODO 4b: Definire la serializer_class per LibroViewSet.
    #          Deve essere LibroSerializer.
    serializer_class = None # Sostituisci None con il serializer corretto
"""

# --- Configurazione del Router e delle URL ---
# Immagina di modificare il file `pizzeria_app/urls.py`

"""
from django.urls import path, include # Assicurati che 'include' sia importato
from rest_framework.routers import DefaultRouter
# TODO 5: Importa i ViewSet che hai creato (es. dal modulo views o views_api).
# from . import views # o from . import views_api se li hai messi lì

# TODO 6: (Rif. Esercizio 4 del README) Creare un'istanza di DefaultRouter.
# router = DefaultRouter() # Decommenta

# TODO 7: (Rif. Esercizio 4 del README) Registrare AutoreViewSet con il router.
#         Prefisso URL: 'autori'.
#         ViewSet: views.AutoreViewSet (o views_api.AutoreViewSet).
#         Basename: 'autore'.
# router.register(r'autori', views.AutoreViewSet, basename='autore') # Decommenta e adatta

# TODO 8: (Rif. Esercizio 4 del README) Registrare LibroViewSet con il router.
#         Prefisso URL: 'libri'.
#         ViewSet: views.LibroViewSet.
#         Basename: 'libro'.
# router.register(r'libri', views.LibroViewSet, basename='libro') # Decommenta e adatta

# urlpatterns originali per le viste Django tradizionali (se presenti)
# urlpatterns_django = [
#     path('', views.index, name='index'),
#     ...
# ]

# TODO 9: Modificare urlpatterns per includere le URL generate dal router.
#         Le URL dell'API dovrebbero essere sotto un prefisso comune, ad esempio 'api/'.
#         Se hai urlpatterns_django, concatenali.
# urlpatterns = [
#     # path('', include(urlpatterns_django)), # Se hai viste Django tradizionali nella stessa app
#     path('api/', include(router.urls)), # Includi le URL del router sotto /api/
# ]

# Se `pizzeria_app/urls.py` è incluso dal `myproject_exercise/urls.py` con un prefisso
# (es. path('pizzeria/', include('pizzeria_app.urls')) ),
# allora le URL finali saranno tipo: /pizzeria/api/libri/, /pizzeria/api/autori/
"""

# --- Modifica urls.py del Progetto (myproject_exercise/urls.py) ---
# Assicurati che il file urls.py del progetto principale includa correttamente
# le URL della tua app 'pizzeria_app' se non l'hai già fatto.
# Esempio in `myproject_exercise/urls.py`:
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('pizzeria/', include('pizzeria_app.urls')), # O qualsiasi prefisso tu abbia scelto
]
"""

print("File exercise_2_viewsets_router.py creato.")
print("1. Apri il file views.py (o views_api.py) della tua app e definisci i ViewSet come da TODO 1-4.")
print("2. Apri il file urls.py della tua app ('pizzeria_app/urls.py') e configuralo con il Router come da TODO 5-9.")
print("3. Assicurati che urls.py del progetto principale includa le URL della tua app.")
print("Fai riferimento agli Esercizi 3 e 4 nel README.md del Capitolo 5 per i dettagli.")
