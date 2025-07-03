# OBIETTIVO: Completare l'Esercizio 3 ("Aggiungi l'Endpoint di Login") descritto nel README.md del Capitolo 6.
# COMPITO: Aggiungere l'endpoint di login fornito da DRF (`obtain_auth_token`) alle URL della tua app.
#          Questo file serve come traccia per le modifiche in `pizzeria_app/urls.py`.

# Immagina di modificare il file `pizzeria_app/urls.py`

"""
from django.urls import path, include
# ... (altre importazioni come DefaultRouter, views, ecc. dovrebbero già esserci) ...

# TODO 1: Importare la vista `obtain_auth_token` da DRF.
# from rest_framework.authtoken.views import obtain_auth_token # Decommenta

# router = DefaultRouter()
# router.register(r'autori', views.AutoreViewSet, basename='autore')
# router.register(r'libri', views.LibroViewSet, basename='libro')

# Se stai usando una lista separata per le URL di autenticazione manuali:
urlpatterns_api_manual = [
    # La rotta per 'register/' dovrebbe già essere qui dall'esercizio precedente
    # path('register/', views.UserCreateAPIView.as_view(), name='api_user_register'), # Esempio

    # TODO 2: Aggiungere un path per l'endpoint di login.
    #         Mappalo alla vista `obtain_auth_token` importata.
    #         Assegnagli un nome, ad esempio 'api_user_login'.
    # Esempio: path('login/', obtain_auth_token, name='api_user_login'),
]

urlpatterns = [
    # path('api/', include(router.urls)), # Le tue URL gestite dal router

    # TODO 3: Assicurati che `urlpatterns_api_manual` (o il singolo path di login)
    #         sia incluso nelle urlpatterns principali dell'app, preferibilmente sotto un prefisso 'auth/'.
    # Esempio: path('api/auth/', include(urlpatterns_api_manual)),
]

# Se non hai una lista `urlpatterns_api_manual` e aggiungi le URL direttamente
# a `urlpatterns`, la struttura potrebbe essere:
# urlpatterns = [
#     path('api/', include(router.urls)),
#     path('api/auth/register/', views.UserCreateAPIView.as_view(), name='api_user_register'),
#     TODO 2 (qui): path('api/auth/login/', obtain_auth_token, name='api_user_login'),
# ]
"""

# TODO 4: (Azione esterna) Impostare `TokenAuthentication` come schema di autenticazione.
#         Questo può essere fatto globalmente in `myproject_exercise/settings.py`
#         all'interno del dizionario `REST_FRAMEWORK`:
"""
# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': [
#         'rest_framework.authentication.TokenAuthentication',
#         # 'rest_framework.authentication.SessionAuthentication', # Puoi mantenerla per la Browsable API
#     ],
#     # Potresti anche aver già impostato DEFAULT_PERMISSION_CLASSES qui
# }
"""
#         Se non lo imposti globalmente, dovrai aggiungere `authentication_classes = [TokenAuthentication]`
#         ai ViewSet/APIView che vuoi proteggere. Per `obtain_auth_token`, DRF gestisce l'autenticazione
#         necessaria per verificare username/password.

print("File exercise_2_login_endpoint.py creato.")
print("1. Apri il file urls.py della tua app ('pizzeria_app/urls.py').")
print("2. Importa `obtain_auth_token` e aggiungi un path per esso come indicato nei TODO 1-3.")
print("3. (Opzionale ma raccomandato) Configura `TokenAuthentication` globalmente in `settings.py` come da TODO 4, se non già fatto.")
print("Fai riferimento all'Esercizio 3 nel README.md del Capitolo 6 per i dettagli.")
