# Capitolo 6: Autenticazione e Sicurezza delle API

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Comprendere l'importanza di proteggere le API.
*   Conoscere i diversi schemi di autenticazione disponibili in DRF.
*   Implementare l'autenticazione basata su Token (TokenAuthentication) per le tue API.
*   Creare endpoint per la registrazione di nuovi utenti e per il login (ottenimento di un token).
*   Utilizzare le classi di permessi di DRF (es. `IsAuthenticated`, `IsAdminUser`, `IsAuthenticatedOrReadOnly`) per controllare l'accesso a specifici endpoint o azioni API.
*   Proteggere gli endpoint di scrittura (POST, PUT, DELETE, PATCH) in modo che solo gli utenti autenticati possano utilizzarli.

## Lezione Teorica

Le API espongono dati e funzionalità, quindi è cruciale controllarne l'accesso. L'**autenticazione** verifica l'identità di un client (chi sei?), mentre l'**autorizzazione** (o permessi) determina a quali risorse o azioni quel client autenticato ha accesso (cosa puoi fare?).

DRF fornisce un sistema flessibile per gestire autenticazione e permessi.

### Schemi di Autenticazione in DRF

DRF supporta diversi schemi di autenticazione, tra cui:

*   **`SessionAuthentication`**: Utilizza il sistema di sessioni di Django. È utile se la tua API è consumata principalmente dal tuo stesso sito web Django (frontend tradizionale) o per la Browsable API.
*   **`BasicAuthentication`**: Autenticazione HTTP Basic. L'utente invia username e password (codificati in Base64) nell'header `Authorization`. È semplice ma meno sicura se non usata su HTTPS.
*   **`TokenAuthentication`**: L'utente invia un token univoco nell'header `Authorization`. Questo è uno schema comune per API consumate da client esterni (SPA, app mobili). I token vengono generati per gli utenti e devono essere mantenuti segreti.
*   **`RemoteUserAuthentication`**: Per l'integrazione con sistemi di autenticazione esterni che impostano l'header `REMOTE_USER`.
*   **Autenticazione JWT (JSON Web Token)**: Non inclusa direttamente in DRF core, ma molto popolare e supportata da pacchetti di terze parti come `djangorestframework-simplejwt`. JWT è uno standard per creare token di accesso che contengono "claims" (informazioni sull'utente) e sono firmati digitalmente. Offrono vantaggi in termini di statelessness e scalabilità.

Per questo corso, ci concentreremo su **`TokenAuthentication`** per la sua semplicità e idoneità a scenari comuni con frontend disaccoppiati.

### Implementare `TokenAuthentication`

1.  **Aggiungi `rest_framework.authtoken` a `INSTALLED_APPS`:**
    Questo modulo di DRF fornisce il modello `Token` e la logica di base.
    ```python
    # myproject/settings.py
    INSTALLED_APPS = [
        # ...
        'rest_framework',
        'rest_framework.authtoken', # Aggiungi questa riga
        'learning_logs',
        # ...
    ]
    ```

2.  **Esegui le Migrazioni:**
    Il modulo `authtoken` ha i suoi modelli di database (per memorizzare i token), quindi devi creare le tabelle corrispondenti.
    ```bash
    python manage.py migrate
    ```
    Questo creerà una tabella `authtoken_token`.

3.  **Imposta `TokenAuthentication` come Schema di Autenticazione Predefinito (Opzionale ma Consigliato):**
    Puoi impostare `TokenAuthentication` come metodo di autenticazione predefinito per tutte le tue viste API in `settings.py`.
    ```python
    # myproject/settings.py
    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': [
            'rest_framework.authentication.TokenAuthentication',
            # 'rest_framework.authentication.SessionAuthentication', # Puoi mantenerla per la Browsable API
        ],
        # Potresti anche voler impostare permessi predefiniti qui,
        # ad esempio, richiedere l'autenticazione per tutte le viste di default:
        # 'DEFAULT_PERMISSION_CLASSES': [
        #     'rest_framework.permissions.IsAuthenticated',
        # ]
    }
    ```
    Se non lo imposti globalmente, dovrai specificare `authentication_classes` in ogni ViewSet o APIView che vuoi proteggere.

4.  **Generare Token per gli Utenti:**
    I token devono essere generati per gli utenti. DRF fornisce un segnale che può creare automaticamente un token quando un nuovo utente viene creato.
    Crea o modifica `learning_logs/signals.py` (se non esiste, crealo):
    ```python
    # learning_logs/signals.py
    from django.conf import settings
    from django.db.models.signals import post_save
    from django.dispatch import receiver
    from rest_framework.authtoken.models import Token

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_auth_token(sender, instance=None, created=False, **kwargs):
        if created:
            Token.objects.create(user=instance)
    ```
    Poi, devi importare questi segnali nel metodo `ready()` della configurazione della tua app in `learning_logs/apps.py`:
    ```python
    # learning_logs/apps.py
    from django.apps import AppConfig

    class LearningLogsConfig(AppConfig):
        default_auto_field = 'django.db.models.BigAutoField'
        name = 'learning_logs'

        def ready(self):
            import learning_logs.signals # Importa i tuoi segnali
    ```
    In alternativa alla gestione dei segnali, puoi generare token manualmente (es. tramite l'admin di Django o un comando di gestione) o tramite un endpoint specifico.

### Creare Endpoint per Registrazione e Login

**1. Endpoint di Registrazione Utente:**
Abbiamo bisogno di un endpoint API dove i nuovi utenti possano registrarsi. Useremo un serializer per validare i dati dell'utente e creare un nuovo `User`.

Modifica `learning_logs/serializers.py`:
```python
# learning_logs/serializers.py
from rest_framework import serializers
from .models import Libro, Autore
from django.contrib.auth.models import User # Importa il modello User di Django

# ... (AutoreSerializer e LibroSerializer) ...

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) # La password non deve essere letta

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']
        # Potresti volere 'email' come required: extra_kwargs = {'email': {'required': True}}


    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), # .get per rendere email opzionale se non required
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Il token viene creato automaticamente dal segnale post_save
        return user
```

Ora, crea una vista per la registrazione in `learning_logs/views.py`:
```python
# learning_logs/views.py
# ... (altre importazioni DRF come APIView, Response, status, viewsets) ...
from .serializers import LibroSerializer, AutoreSerializer, UserSerializer # Aggiungi UserSerializer
from rest_framework.permissions import AllowAny # Per permettere a chiunque di registrarsi

# ... (LibroViewSet e AutoreViewSet) ...

class UserCreateAPIView(APIView):
    """
    Vista API per creare (registrare) un nuovo utente.
    """
    permission_classes = [AllowAny] # Chiunque può accedere a questa vista

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # Chiama il metodo create del serializer
            # Il token viene creato dal segnale, quindi non c'è bisogno di restituirlo qui direttamente
            # Potresti voler restituire i dati dell'utente (senza password) o solo un messaggio di successo
            user_data = serializer.data
            user_data.pop('password') # Rimuovi la password dalla risposta
            return Response(user_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

```

Aggiungi l'URL per questa vista in `learning_logs/urls.py` (all'interno di `router.urls` o in una lista separata inclusa sotto `/api/`):
```python
# learning_logs/urls.py (dentro la sezione API)
# ...
# Se non usi il router per questa vista singola, aggiungila manualmente:
# urlpatterns_api = [
#     path('register/', views.UserCreateAPIView.as_view(), name='api_user_register'),
# ]
# E poi includi urlpatterns_api.
# Oppure, se vuoi essere coerente con i router, puoi creare un ViewSet semplice per User.
# Per ora, la aggiungiamo alla lista delle URL del router per semplicità concettuale,
# anche se UserCreateAPIView non è un ViewSet.
# Modifica: è meglio non mescolare router.urls con path() manuali se non necessario.
# Quindi, la registriamo separatamente.

# ... (router e sue registrazioni) ...

# URL per le viste API DRF (quelle non gestite dal router)
urlpatterns_api_manual = [
    path('register/', views.UserCreateAPIView.as_view(), name='api_user_register'),
    # Aggiungeremo qui l'endpoint di login
]

urlpatterns = urlpatterns_django + [
    path('api/', include(router.urls)),
    path('api/auth/', include(urlpatterns_api_manual)), # Prefisso auth per registrazione/login
]
```

**2. Endpoint di Login (Ottenere un Token):**
DRF fornisce una vista integrata `obtain_auth_token` per ottenere un token data username e password.

Aggiungi l'URL per questa vista in `learning_logs/urls.py` (nella stessa lista `urlpatterns_api_manual`):
```python
# learning_logs/urls.py
# ...
from rest_framework.authtoken.views import obtain_auth_token # Importa la vista

# ... (router e sue registrazioni) ...

urlpatterns_api_manual = [
    path('register/', views.UserCreateAPIView.as_view(), name='api_user_register'),
    path('login/', obtain_auth_token, name='api_user_login'), # Endpoint per ottenere il token
]

urlpatterns = urlpatterns_django + [
    path('api/', include(router.urls)), # ViewSets
    path('api/auth/', include(urlpatterns_api_manual)), # Registrazione e Login
]
```
Ora, se un client invia una richiesta `POST` a `/logs/api/auth/login/` con `username` e `password` nel corpo della richiesta (form-data o JSON), riceverà una risposta JSON contenente il token dell'utente, se le credenziali sono valide. Esempio di risposta:
```json
{
    "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```
Il client dovrà quindi includere questo token nell'header `Authorization` per le richieste successive a endpoint protetti:
`Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b`

### Classi di Permessi di DRF

I permessi determinano se una richiesta deve essere concessa o negata l'accesso. Vengono controllati dopo che l'autenticazione ha avuto successo.

Alcune classi di permessi comuni integrate in DRF:

*   **`AllowAny`**: Qualsiasi utente, autenticato o meno, ha pieno accesso.
*   **`IsAuthenticated`**: Solo gli utenti autenticati hanno accesso.
*   **`IsAdminUser`**: Solo gli utenti con `user.is_staff == True` hanno accesso.
*   **`IsAuthenticatedOrReadOnly`**: Gli utenti autenticati hanno accesso completo (lettura/scrittura). Gli utenti non autenticati hanno accesso solo in lettura (metodi HTTP "safe" come `GET`, `HEAD`, `OPTIONS`). Molto comune per API pubbliche con funzionalità di modifica per utenti loggati.
*   **`DjangoModelPermissions`**: Lega i permessi ai permessi standard dei modelli Django (`add_model`, `change_model`, `delete_model`).
*   **`DjangoModelPermissionsOrAnonReadOnly`**: Come `DjangoModelPermissions`, ma permette l'accesso in sola lettura agli utenti anonimi.

Puoi impostare i permessi:
*   **Globalmente** in `settings.py` (come visto prima con `DEFAULT_PERMISSION_CLASSES`).
*   **Per ViewSet/APIView** usando l'attributo `permission_classes`.
*   **Per singola azione** in un ViewSet sovrascrivendo il metodo `get_permissions()`.

**Proteggere i ViewSet `LibroViewSet` e `AutoreViewSet`:**
Vogliamo che chiunque possa leggere la lista dei libri e degli autori (GET), ma solo gli utenti autenticati possano crearli, modificarli o eliminarli (POST, PUT, PATCH, DELETE). `IsAuthenticatedOrReadOnly` è perfetto per questo.

Modifica `learning_logs/views.py`:
```python
# learning_logs/views.py
# ...
from rest_framework import permissions # Importa i permessi

class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all().order_by('titolo')
    serializer_class = LibroSerializer
    authentication_classes = [TokenAuthentication] # Specifica se non globale
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Solo autenticati per scrivere

class AutoreViewSet(viewsets.ModelViewSet):
    queryset = Autore.objects.all().order_by('cognome', 'nome')
    serializer_class = AutoreSerializer
    authentication_classes = [TokenAuthentication] # Specifica se non globale
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Solo autenticati per scrivere
```
Se hai già impostato `TokenAuthentication` e `IsAuthenticatedOrReadOnly` come predefiniti in `settings.PY` `REST_FRAMEWORK`, non è necessario specificare `authentication_classes` e `permission_classes` qui, a meno che tu non voglia sovrascrivere le impostazioni predefinite per questi specifici ViewSet. Per chiarezza didattica, li abbiamo inclusi.

Ora, se provi a fare una richiesta POST, PUT o DELETE a `/api/libri/` o `/api/autori/` senza un token valido nell'header `Authorization`, riceverai un errore `401 Unauthorized` o `403 Forbidden`. Se includi un token valido, l'operazione sarà permessa. Le richieste GET continueranno a funzionare per tutti.

### Testare l'Autenticazione

Puoi testare l'autenticazione e i permessi usando:

*   **Browsable API:**
    *   Quando accedi a un endpoint protetto, la Browsable API potrebbe mostrarti un errore 401/403.
    *   DRF di solito fornisce un pulsante "Login" nella Browsable API se `SessionAuthentication` è abilitata. Puoi fare login con un utente Django per testare. Per `TokenAuthentication`, la Browsable API non gestisce direttamente l'invio del token header, quindi per testare scritture protette da token, strumenti esterni sono più indicati.
    *   Tuttavia, se hai `SessionAuthentication` attiva insieme a `TokenAuthentication` nelle `DEFAULT_AUTHENTICATION_CLASSES`, e accedi come utente nell'admin di Django, la Browsable API userà quella sessione per autenticarti.

*   **Strumenti come `curl` o Postman:**
    1.  **Registra un utente:** Fai una richiesta POST a `/logs/api/auth/register/` con `username` e `password`.
    2.  **Ottieni un token:** Fai una richiesta POST a `/logs/api/auth/login/` con lo stesso `username` e `password`. Copia il token dalla risposta.
    3.  **Accedi a un endpoint protetto:**
        *   Prova un GET a `/logs/api/libri/` (dovrebbe funzionare senza token).
        *   Prova un POST a `/logs/api/libri/` per creare un libro:
            *   **Senza token:** Dovrebbe fallire (401 o 403).
            *   **Con token:** Aggiungi un header `Authorization: Token TUO_TOKEN_COPIATO_QUI` e invia i dati del libro nel corpo della richiesta. Dovrebbe funzionare (201 Created).

Esempio con `curl`:
```bash
# Registrazione (sostituisci con i tuoi dati)
curl -X POST -H "Content-Type: application/json" -d '{"username":"testuser", "password":"testpassword123"}' http://127.0.0.1:8000/logs/api/auth/register/

# Login (sostituisci con i tuoi dati)
curl -X POST -H "Content-Type: application/json" -d '{"username":"testuser", "password":"testpassword123"}' http://127.0.0.1:8000/logs/api/auth/login/
# Copia il token dalla risposta, es: {"token":"abcdef12345..."}

# Prova a creare un libro SENZA token (fallirà)
curl -X POST -H "Content-Type: application/json" -d '{"titolo":"Libro Protetto", "autore": 1, "isbn":"1112223334"}' http://127.0.0.1:8000/logs/api/libri/
# Output: {"detail":"Authentication credentials were not provided."}

# Prova a creare un libro CON token (dovrebbe funzionare)
# Sostituisci TUO_TOKEN_QUI con il token reale e l'ID autore con uno valido
curl -X POST -H "Content-Type: application/json" -H "Authorization: Token TUO_TOKEN_QUI" -d '{"titolo":"Libro Protetto OK", "autore": 1, "isbn":"1112223335", "data_pubblicazione":"2023-01-01"}' http://127.0.0.1:8000/logs/api/libri/
# Output: Dati del libro creato e status 201
```

## Esercizi Pratici

1.  **Configura `TokenAuthentication`:**
    *   Aggiungi `'rest_framework.authtoken'` a `INSTALLED_APPS`.
    *   Esegui `python manage.py migrate`.
    *   Imposta `TokenAuthentication` come una delle `DEFAULT_AUTHENTICATION_CLASSES` in `REST_FRAMEWORK` nel tuo `settings.py`. Puoi anche mantenere `SessionAuthentication` per la Browsable API.
    *   Implementa il segnale `post_save` per creare automaticamente un token quando un nuovo utente viene creato (in `learning_logs/signals.py` e registralo in `apps.py`).
2.  **Crea l'Endpoint di Registrazione:**
    *   Definisci `UserSerializer` in `learning_logs/serializers.py` per il modello `User` di Django, includendo `username`, `password` (write-only), `email`, `first_name`, `last_name`. Implementa il metodo `create` per creare correttamente un nuovo utente usando `User.objects.create_user()`.
    *   Crea la vista `UserCreateAPIView` (basata su `APIView`) in `learning_logs/views.py`. Deve usare `UserSerializer` e avere `permission_classes = [AllowAny]`.
    *   Aggiungi un'URL per questa vista in `learning_logs/urls.py` (es. `/api/auth/register/`).
3.  **Aggiungi l'Endpoint di Login:**
    *   Importa `obtain_auth_token` da `rest_framework.authtoken.views`.
    *   Aggiungi un'URL in `learning_logs/urls.py` che mappa a `obtain_auth_token` (es. `/api/auth/login/`).
4.  **Proteggi i ViewSet:**
    *   Nelle classi `LibroViewSet` e `AutoreViewSet` in `learning_logs/views.py`, imposta `permission_classes = [permissions.IsAuthenticatedOrReadOnly]`. (Se hai già impostato `IsAuthenticatedOrReadOnly` come predefinito globalmente e `TokenAuthentication` come autenticazione predefinita, questo passaggio potrebbe essere ridondante ma è bene esserne consapevoli).
5.  **Testa il Flusso di Autenticazione:**
    *   **Senza token:**
        *   Prova a fare una richiesta `POST` (creare) a `/logs/api/libri/` usando `curl` o Postman. Dovrebbe fallire con un errore 401 o 403.
        *   Prova a fare una richiesta `GET` (elencare) a `/logs/api/libri/`. Dovrebbe funzionare.
    *   **Registrazione e Login:**
        *   Usa `curl` o Postman per fare una richiesta `POST` all'endpoint di registrazione (`/logs/api/auth/register/`) con i dati di un nuovo utente. Verifica che l'utente venga creato (puoi controllare nell'Admin di Django).
        *   Fai una richiesta `POST` all'endpoint di login (`/logs/api/auth/login/`) con le credenziali dell'utente appena creato. Copia il token dalla risposta.
    *   **Con token:**
        *   Ripeti la richiesta `POST` a `/logs/api/libri/` per creare un libro, ma questa volta includi l'header `Authorization: Token <il_tuo_token>`. Verifica che il libro venga creato con successo.
        *   Prova anche le operazioni `PUT` e `DELETE` su un libro specifico, includendo il token.
        *   Verifica che le richieste `GET` continuino a funzionare anche senza token.
```
