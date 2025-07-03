# OBIETTIVO: Completare l'Esercizio 2 ("Crea l'Endpoint di Registrazione") descritto nel README.md del Capitolo 6.
# COMPITO: Definire UserSerializer e la vista UserCreateAPIView.
#          Questo file serve come traccia per modifiche in `serializers.py` e `views.py` (o `views_api.py`).

# --- Modifiche a `pizzeria_app/serializers.py` ---
# Aggiungi quanto segue al tuo file `serializers.py`

"""
from django.contrib.auth.models import User # TODO 1: Importa il modello User di Django.
# (le altre importazioni di serializers e modelli Autore, Libro dovrebbero già esserci)

class UserSerializer(serializers.ModelSerializer):
    # TODO 2: Definire il campo 'password' come CharField write_only.
    #         Questo assicura che la password non venga restituita nelle risposte API.
    # password = serializers.CharField(write_only=True) # Decommenta e usa

    class Meta:
        # TODO 3a: Specificare il modello (model = User).
        model = None # Sostituisci None con il modello User

        # TODO 3b: Specificare i campi da includere.
        #           Esempio: ['id', 'username', 'password', 'email', 'first_name', 'last_name']
        #           Assicurati che 'password' sia incluso qui se lo hai definito sopra.
        fields = [] # Sostituisci [] con la lista dei campi

        # TODO 3c: (Opzionale) Rendere alcuni campi obbligatori se non lo sono di default
        #            e se li vuoi obbligatori per la registrazione.
        # extra_kwargs = {'email': {'required': True}} # Esempio per rendere email obbligatoria

    def create(self, validated_data):
        # TODO 4: Implementare il metodo create per creare un nuovo utente.
        #         Usa `User.objects.create_user()` per gestire correttamente l'hashing della password.
        #         Esempio:
        #         user = User.objects.create_user(
        #             username=validated_data['username'],
        #             email=validated_data.get('email', ''), # Usa .get se il campo non è sempre richiesto
        #             password=validated_data['password'],
        #             first_name=validated_data.get('first_name', ''),
        #             last_name=validated_data.get('last_name', '')
        #         )
        #         return user
        pass # Rimuovi pass e implementa la logica
"""

# --- Modifiche a `pizzeria_app/views.py` (o `views_api.py`) ---
# Aggiungi quanto segue al tuo file delle viste API

"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny # TODO 5: Importa AllowAny.
# TODO 6: Importa UserSerializer dal tuo file serializers.py.
# from .serializers import UserSerializer # Decommenta e correggi

class UserCreateAPIView(APIView):
    # TODO 7: Impostare permission_classes su [AllowAny] per permettere la registrazione
    #         a utenti non autenticati.
    permission_classes = [] # Sostituisci [] con [AllowAny]

    def post(self, request, format=None):
        # TODO 8a: Creare un'istanza di UserSerializer con i dati da request.data.
        # serializer = UserSerializer(data=request.data) # Decommenta

        # TODO 8b: Verificare se il serializer è valido (serializer.is_valid()).
        # if serializer.is_valid(): # Decommenta
            # TODO 8b-i: Se valido, salvare il serializer (serializer.save()).
            #            Questo chiamerà il metodo `create` di UserSerializer.
            # serializer.save() # Decommenta

            # TODO 8b-ii: Preparare i dati utente da restituire (opzionale, ma buona pratica).
            #             È consigliabile non restituire la password.
            # user_data = serializer.data
            # user_data.pop('password', None) # Rimuovi la password se presente

            # TODO 8b-iii: Restituire una Response con i dati dell'utente (o un messaggio di successo)
            #              e lo status HTTP 201 CREATED.
            # return Response(user_data, status=status.HTTP_201_CREATED) # Decommenta
            pass # Rimuovi pass
        # else: # Decommenta
            # TODO 8c: Se il serializer non è valido, restituire gli errori del serializer
            #          con lo status HTTP 400 BAD REQUEST.
            # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # Decommenta
            pass # Rimuovi pass
        return Response({"message": "TODO: Implementare la logica POST"}, status=status.HTTP_501_NOT_IMPLEMENTED) # Ritorno temporaneo
"""

# --- Modifiche a `pizzeria_app/urls.py` ---
# Aggiungi la URL per la nuova vista di registrazione.

"""
# All'interno della lista urlpatterns del tuo router o in una lista separata per le API di auth:
# Esempio se hai una lista urlpatterns_api_manual:
# urlpatterns_api_manual = [
#     path('register/', views.UserCreateAPIView.as_view(), name='api_user_register'),
#     # ... altre eventuali URL manuali ...
# ]
# E poi assicurati che questa lista sia inclusa nelle urlpatterns principali dell'app,
# ad esempio sotto un prefisso come 'auth/':
# path('api/auth/', include(urlpatterns_api_manual)),
"""

# TODO 9: (Azioni esterne) Implementare i segnali per la creazione automatica del Token.
#         - Crea `pizzeria_app/signals.py` come mostrato nella Lezione Teorica del Capitolo 6.
#         - Modifica `pizzeria_app/apps.py` per importare i segnali nel metodo `ready()`.
#         - Aggiungi `rest_framework.authtoken` a `INSTALLED_APPS` in `settings.py`.
#         - Esegui `python manage.py migrate` per creare la tabella dei token.

print("File exercise_1_user_serializer_view.py creato.")
print("1. Modifica `pizzeria_app/serializers.py` per aggiungere UserSerializer come da TODO 1-4.")
print("2. Modifica `pizzeria_app/views.py` (o `views_api.py`) per aggiungere UserCreateAPIView come da TODO 5-8.")
print("3. Modifica `pizzeria_app/urls.py` per aggiungere la rotta per la registrazione.")
print("4. Completa i passaggi del TODO 9 relativi ai segnali e alla configurazione dei token.")
print("Fai riferimento all'Esercizio 2 nel README.md del Capitolo 6 per i dettagli.")
