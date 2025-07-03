# OBIETTIVO: Completare l'Esercizio 4 ("Proteggi i ViewSet") descritto nel README.md del Capitolo 6.
# COMPITO: Modificare AutoreViewSet e LibroViewSet per usare la classe di permesso
#          `IsAuthenticatedOrReadOnly`.
#          Questo file serve come traccia per le modifiche in `pizzeria_app/views.py` (o `views_api.py`).

# Immagina di modificare il file `pizzeria_app/views.py` (o `views_api.py`)

"""
from rest_framework import viewsets
# TODO 1: Importare il modulo permissions da rest_framework.
# from rest_framework import permissions # Decommenta
# (altre importazioni: Autore, Libro, AutoreSerializer, LibroSerializer dovrebbero già esserci)

# TODO 2: (Opzionale, se non impostato globalmente) Importare TokenAuthentication.
# from rest_framework.authentication import TokenAuthentication # Decommenta se necessario

class AutoreViewSet(viewsets.ModelViewSet):
    queryset = Autore.objects.all().order_by('cognome', 'nome')
    serializer_class = AutoreSerializer

    # TODO 3: (Opzionale) Specificare `authentication_classes` se non impostato globalmente.
    #         Se hai già configurato DEFAULT_AUTHENTICATION_CLASSES in settings.py per includere
    #         TokenAuthentication, questo potrebbe non essere strettamente necessario qui,
    #         ma specificarlo esplicitamente può rendere più chiari i requisiti della vista.
    # authentication_classes = [TokenAuthentication] # Decommenta se vuoi essere esplicito o sovrascrivere i default

    # TODO 4: Impostare `permission_classes` su [permissions.IsAuthenticatedOrReadOnly].
    #         Questo permetterà richieste GET a tutti, ma richiederà autenticazione
    #         per metodi come POST, PUT, DELETE.
    permission_classes = [] # Sostituisci [] con [permissions.IsAuthenticatedOrReadOnly]


class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all().order_by('titolo')
    serializer_class = LibroSerializer

    # TODO 5: (Opzionale) Specificare `authentication_classes` come per AutoreViewSet.
    # authentication_classes = [TokenAuthentication] # Decommenta se vuoi essere esplicito

    # TODO 6: Impostare `permission_classes` su [permissions.IsAuthenticatedOrReadOnly]
    #         anche per LibroViewSet.
    permission_classes = [] # Sostituisci [] con [permissions.IsAuthenticatedOrReadOnly]

"""

# TODO 7: (Azione esterna, se non già fatto) Configurare i permessi predefiniti in `settings.py`.
#         Se vuoi che `IsAuthenticatedOrReadOnly` sia il default per la maggior parte delle viste,
#         puoi aggiungerlo a `DEFAULT_PERMISSION_CLASSES` in `REST_FRAMEWORK` nel tuo
#         `myproject_exercise/settings.py`.
# Esempio in `settings.py`:
"""
# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': [
#         'rest_framework.authentication.TokenAuthentication',
#         # ... altre classi di autenticazione ...
#     ],
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.IsAuthenticatedOrReadOnly',
#         # O 'rest_framework.permissions.IsAuthenticated' se vuoi che tutto sia protetto di default
#     ]
# }
"""
# Se imposti i default globalmente, potresti non aver bisogno di specificare `permission_classes`
# in ogni ViewSet, a meno che tu non voglia un comportamento diverso dal default per quel ViewSet.

print("File exercise_3_protect_viewsets.py creato.")
print("1. Apri il file views.py (o views_api.py) della tua app.")
print("2. Importa `permissions` da `rest_framework`.")
print("3. Modifica AutoreViewSet e LibroViewSet per impostare `permission_classes` come da TODO 4 e 6.")
print("4. (Opzionale) Considera di impostare i permessi e l'autenticazione di default globalmente in `settings.py` (TODO 7).")
print("Fai riferimento all'Esercizio 4 nel README.md del Capitolo 6 per i dettagli.")
