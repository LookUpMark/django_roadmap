# Capitolo 5: Creare API REST con Django REST Framework

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Comprendere cos'è un'API REST e perché è fondamentale per architetture con frontend disaccoppiati (come React).
*   Installare e configurare Django REST Framework (DRF) in un progetto Django.
*   Definire `Serializer` per convertire istanze di modelli Django (QuerySet) in JSON e viceversa.
*   Creare viste API semplici utilizzando `APIView` di DRF.
*   Utilizzare `ViewSet` e `Router` di DRF per creare rapidamente endpoint CRUD (Create, Read, Update, Delete) per i tuoi modelli.
*   Esplorare e testare le API create utilizzando la "Browsable API" di DRF.

## Lezione Teorica

Finora abbiamo costruito un'applicazione Django tradizionale, dove Django gestisce sia la logica di backend sia il rendering delle pagine HTML (MVT). Tuttavia, le moderne applicazioni web spesso utilizzano un'architettura **disaccoppiata**, dove:

*   Il **backend** (es. Django) espone i dati e la logica di business tramite un'**API (Application Programming Interface)**.
*   Il **frontend** (es. un'app React, Vue, Angular, o un'app mobile) è un client separato che consuma questa API per visualizzare i dati e interagire con l'applicazione.

**REST (REpresentational State Transfer)** è uno stile architetturale molto popolare per progettare API web. Le API RESTful tipicamente:

*   Usano URL per identificare le risorse (es. `/api/libri/`, `/api/libri/1/`).
*   Usano metodi HTTP standard per le operazioni:
    *   `GET`: Per recuperare risorse.
    *   `POST`: Per creare nuove risorse.
    *   `PUT` / `PATCH`: Per aggiornare risorse esistenti.
    *   `DELETE`: Per eliminare risorse.
*   Comunicano utilizzando formati di dati standard, comunemente **JSON (JavaScript Object Notation)**.

**Django REST Framework (DRF)** è una libreria potente e flessibile per costruire API web in Django. Semplifica enormemente lo sviluppo di API RESTful.

### Installazione e Configurazione di DRF

1.  **Installa DRF:**
    Con il tuo ambiente virtuale attivo:
    ```bash
    pip install djangorestframework
    ```

2.  **Aggiungi DRF alle `INSTALLED_APPS`:**
    Nel tuo file `myproject/settings.py`:
    ```python
    # myproject/settings.py
    INSTALLED_APPS = [
        # ... altre app ...
        'rest_framework', # Aggiungi DRF
        'learning_logs',  # La tua app
        # ...
    ]
    ```

3.  **(Opzionale) Configura le Impostazioni Globali di DRF:**
    DRF offre molte impostazioni globali che puoi configurare in `settings.py` all'interno di un dizionario chiamato `REST_FRAMEWORK`. Per ora, possiamo iniziare senza configurazioni globali specifiche, ma è utile sapere che esiste. Ad esempio, potresti impostare classi di autenticazione o permessi predefinite qui.

    ```python
    # myproject/settings.py (opzionale per ora)
    # REST_FRAMEWORK = {
    #     'DEFAULT_PERMISSION_CLASSES': [
    #         'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    #     ]
    # }
    ```

### Serializers: Convertire Dati Complessi

Un **Serializer** in DRF converte tipi di dati complessi, come i QuerySet e le istanze dei modelli Django, in tipi di dati nativi Python che possono poi essere facilmente renderizzati in JSON, XML o altri formati di contenuto. I serializer gestiscono anche la deserializzazione, cioè la conversione di dati analizzati (es. da JSON) in tipi di dati complessi, dopo aver validato i dati in ingresso.

I serializer di DRF funzionano in modo molto simile ai `Form` e `ModelForm` di Django.

Crea un nuovo file `serializers.py` nella tua app `learning_logs`:
`learning_logs/serializers.py`

```python
# learning_logs/serializers.py
from rest_framework import serializers
from .models import Libro, Autore

class AutoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autore
        fields = ['id', 'nome', 'cognome', 'data_nascita']

class LibroSerializer(serializers.ModelSerializer):
    # Per visualizzare i dettagli dell'autore invece del solo ID
    # autore = AutoreSerializer(read_only=True) # Opzione 1: Serializer annidato (sola lettura)
    # autore = serializers.StringRelatedField() # Opzione 2: Usa il metodo __str__ del modello Autore

    class Meta:
        model = Libro
        fields = ['id', 'titolo', 'autore', 'data_pubblicazione', 'isbn', 'numero_pagine', 'prezzo']
        # Puoi anche usare 'depth = 1' per includere un livello di relazioni annidate,
        # ma essere espliciti con serializer annidati o StringRelatedField è spesso meglio.

    # Se vuoi che 'autore' sia scrivibile tramite l'ID dell'autore durante la creazione/aggiornamento
    # e leggibile come oggetto serializzato, puoi fare così:
    # autore_id = serializers.PrimaryKeyRelatedField(queryset=Autore.objects.all(), source='autore', write_only=True)
    # autore = AutoreSerializer(read_only=True) # E mantieni questo per la lettura
    # E poi aggiungi 'autore_id' ai 'fields' invece di 'autore' per la scrittura, o gestiscilo separatamente.
    # Per semplicità iniziale, lasciare 'autore' come PrimaryKeyRelatedField (default per ForeignKey) va bene.
```

*   `serializers.ModelSerializer`: Funziona come `forms.ModelForm`. Specifica il `model` e i `fields` da includere.
*   **Relazioni:**
    *   Per impostazione predefinita, un campo `ForeignKey` (come `autore` in `Libro`) viene serializzato come la sua chiave primaria (l'ID dell'autore).
    *   **`AutoreSerializer(read_only=True)` (Opzione 1):** Se vuoi includere i dettagli completi dell'autore nel JSON del libro, puoi usare un serializer annidato. `read_only=True` significa che questo campo verrà usato per la serializzazione (output) ma non per la deserializzazione (input; non potrai creare/aggiornare un libro fornendo i dati completi dell'autore in questo modo, ma dovrai fornire l'ID dell'autore).
    *   **`serializers.StringRelatedField()` (Opzione 2):** Usa la rappresentazione stringa del modello correlato (il risultato del metodo `__str__` del modello `Autore`). Utile per una rappresentazione semplice.
    *   **`PrimaryKeyRelatedField` (Comportamento di Default):** Se non specificato diversamente, un campo `ForeignKey` viene trattato come un `PrimaryKeyRelatedField`. Per la serializzazione, mostra l'ID. Per la deserializzazione, si aspetta un ID.
    *   Per questo corso, inizieremo con il comportamento di default (l'ID dell'autore) per semplicità, ma è importante conoscere le alternative. Se vuoi che l'API accetti un ID per l'autore durante la creazione/aggiornamento di un libro, ma mostri i dettagli dell'autore durante la lettura, dovrai configurare il campo `autore` nel serializer in modo più avanzato (es. usando `PrimaryKeyRelatedField` per la scrittura e un serializer annidato per la lettura, o sovrascrivendo i metodi `create`/`update` del serializer).

### Creare Viste API con `APIView`

`APIView` è la classe base per le viste DRF. È simile alla classe `View` di Django, ma con funzionalità specifiche per le API REST, come la gestione della negoziazione del contenuto (JSON, XML, ecc.) e l'autenticazione.

Creiamo una vista API per elencare i libri e crearne uno nuovo. Modifica `learning_logs/views.py`:

```python
# learning_logs/views.py
from django.shortcuts import render, redirect, get_object_or_404
from .models import Libro, Autore
from .forms import LibroForm

# Importazioni per DRF
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status # Contiene codici di stato HTTP utili
from .serializers import LibroSerializer, AutoreSerializer # Importa i tuoi serializer

# ... (le tue viste Django esistenti: index, lista_libri, dettaglio_libro, aggiungi_libro) ...

# Esempio di vista API basata su APIView
class LibroListCreateAPIView(APIView):
    """
    Vista API per elencare tutti i libri o crearne uno nuovo.
    """
    def get(self, request, format=None):
        """ Restituisce una lista di tutti i libri. """
        libri = Libro.objects.all()
        serializer = LibroSerializer(libri, many=True) # many=True perché è un QuerySet (lista)
        return Response(serializer.data)

    def post(self, request, format=None):
        """ Crea un nuovo libro. """
        serializer = LibroSerializer(data=request.data) # Passa i dati della richiesta al serializer
        if serializer.is_valid():
            serializer.save() # Salva l'oggetto se il serializer è valido (ModelSerializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LibroDetailAPIView(APIView):
    """
    Vista API per recuperare, aggiornare o eliminare un'istanza di libro.
    """
    def get_object(self, pk):
        try:
            return Libro.objects.get(pk=pk)
        except Libro.DoesNotExist:
            raise Http404 # DRF la gestirà e restituirà un 404 Not Found

    def get(self, request, pk, format=None):
        libro = self.get_object(pk)
        serializer = LibroSerializer(libro)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        libro = self.get_object(pk)
        serializer = LibroSerializer(libro, data=request.data) # Passa l'istanza da aggiornare
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        libro = self.get_object(pk)
        libro.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) # Nessun contenuto da restituire dopo la cancellazione
```

*   `Response`: Simile a `HttpResponse` di Django, ma `Response` di DRF gestisce la negoziazione del contenuto, scegliendo il renderer appropriato (es. JSON) in base alla richiesta del client.
*   `serializer = LibroSerializer(libri, many=True)`: Quando serializzi un QuerySet (una lista di oggetti), devi passare `many=True`.
*   `serializer = LibroSerializer(data=request.data)`: Quando deserializzi (per creare o aggiornare), passi i dati della richiesta (`request.data` che contiene i dati analizzati, es. da JSON) all'argomento `data`.
*   `status=status.HTTP_201_CREATED`, `status.HTTP_400_BAD_REQUEST`, `status.HTTP_204_NO_CONTENT`: Usare codici di stato HTTP appropriati è una buona pratica nelle API REST.

### URL per le Viste API

Ora, mappa queste viste API nel tuo file `learning_logs/urls.py`. È buona pratica raggruppare le URL dell'API sotto un prefisso comune come `/api/`.

```python
# learning_logs/urls.py
from django.urls import path, include # Aggiungi include se non c'è
from . import views # Le tue viste Django
# from .views_api import LibroListCreateAPIView, LibroDetailAPIView # Se le metti in un file separato
# Per ora le teniamo in views.py

app_name = 'learning_logs' # Già presente

# URL per le viste Django tradizionali
urlpatterns_django = [
    path('', views.index, name='index'),
    path('libri/', views.lista_libri, name='lista_libri'),
    path('libri/aggiungi/', views.aggiungi_libro, name='aggiungi_libro'),
    path('libri/<int:libro_id>/', views.dettaglio_libro, name='dettaglio_libro'),
    # ... altre URL Django ...
]

# URL per le viste API DRF
urlpatterns_api = [
    path('libri/', views.LibroListCreateAPIView.as_view(), name='api_libro_list_create'),
    path('libri/<int:pk>/', views.LibroDetailAPIView.as_view(), name='api_libro_detail'),
]

urlpatterns = urlpatterns_django + [
    path('api/', include(urlpatterns_api)), # Raggruppa le API sotto /api/
]
```
*   `views.LibroListCreateAPIView.as_view()`: Per le Class-Based Views (come `APIView`), devi chiamare il metodo `.as_view()` nella definizione dell'URL.
*   Abbiamo separato `urlpatterns_django` e `urlpatterns_api` per chiarezza e poi li abbiamo uniti, mettendo tutte le API sotto un prefisso `api/`. Quindi, le URL saranno:
    *   `/logs/api/libri/`
    *   `/logs/api/libri/<pk>/`

### ViewSet e Router: Semplificare le API CRUD

Scrivere viste `APIView` separate per ogni operazione CRUD (List, Create, Retrieve, Update, Delete) può diventare ripetitivo. DRF fornisce `ViewSet` e `Router` per semplificare questo processo.

Un **`ViewSet`** è una classe che raggruppa la logica per un insieme di viste correlate. Ad esempio, un `ModelViewSet` fornisce automaticamente azioni `.list()`, `.retrieve()`, `.create()`, `.update()`, `.partial_update()`, e `.destroy()`.

Un **`Router`** analizza automaticamente le URL per un `ViewSet`.

Modifichiamo `learning_logs/views.py` per usare `ModelViewSet`:

```python
# learning_logs/views.py
# ... (altre importazioni e viste Django) ...

# Importazioni aggiuntive per DRF ViewSet
from rest_framework import viewsets

# Rimuovi o commenta le precedenti LibroListCreateAPIView e LibroDetailAPIView
# class LibroListCreateAPIView(APIView): ...
# class LibroDetailAPIView(APIView): ...

class LibroViewSet(viewsets.ModelViewSet):
    """
    Un ViewSet per visualizzare e modificare le istanze di Libro.
    Fornisce automaticamente le azioni `list`, `create`, `retrieve`,
    `update` e `destroy`.
    """
    queryset = Libro.objects.all().order_by('titolo')
    serializer_class = LibroSerializer
    # Puoi aggiungere qui permessi, filtri, paginazione, ecc.
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Esempio

class AutoreViewSet(viewsets.ModelViewSet):
    """
    Un ViewSet per visualizzare e modificare le istanze di Autore.
    """
    queryset = Autore.objects.all().order_by('cognome', 'nome')
    serializer_class = AutoreSerializer
```

*   `queryset`: Il QuerySet base da cui recuperare gli oggetti.
*   `serializer_class`: La classe serializer da usare per questo ViewSet.
*   `ModelViewSet` eredita da `GenericAPIView` e include implementazioni per varie azioni.

Ora, aggiorna `learning_logs/urls.py` per usare un `Router`:

```python
# learning_logs/urls.py
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter # Importa il router

app_name = 'learning_logs'

# Crea un router e registra i nostri viewset con esso.
router = DefaultRouter()
router.register(r'libri', views.LibroViewSet, basename='libro') # 'libro' è la base per i nomi URL generati
router.register(r'autori', views.AutoreViewSet, basename='autore')

# URL per le viste Django tradizionali
urlpatterns_django = [
    path('', views.index, name='index'),
    path('libri/', views.lista_libri, name='lista_libri'),
    path('libri/aggiungi/', views.aggiungi_libro, name='aggiungi_libro'),
    path('libri/<int:libro_id>/', views.dettaglio_libro, name='dettaglio_libro'),
]

# Le URL dell'API sono ora gestite automaticamente dal router.
# Non abbiamo più bisogno di urlpatterns_api definito manualmente.
urlpatterns = urlpatterns_django + [
    path('api/', include(router.urls)), # Includi le URL generate dal router
]

# Se vuoi vedere le URL generate dal router, puoi fare:
# print(router.urls)
```
*   `DefaultRouter`: Crea automaticamente le URL per le azioni standard (list, create, retrieve, update, destroy).
    *   `GET /api/libri/` -> `list` (elenca tutti i libri)
    *   `POST /api/libri/` -> `create` (crea un nuovo libro)
    *   `GET /api/libri/{pk}/` -> `retrieve` (dettaglio di un libro)
    *   `PUT /api/libri/{pk}/` -> `update` (aggiorna un libro)
    *   `PATCH /api/libri/{pk}/` -> `partial_update` (aggiorna parzialmente un libro)
    *   `DELETE /api/libri/{pk}/` -> `destroy` (elimina un libro)
*   `router.register(r'libri', views.LibroViewSet, basename='libro')`:
    *   Il primo argomento è il prefisso URL per questo ViewSet (es. `api/libri/`).
    *   Il secondo è la classe ViewSet.
    *   `basename`: Usato per generare i nomi delle URL. Se `queryset` è impostato nel ViewSet, DRF può derivarlo automaticamente dal modello, ma è buona pratica specificarlo.

### La Browsable API di DRF

Una delle funzionalità più utili di DRF è la **Browsable API**. Se apri le URL dell'API nel tuo browser web, DRF ti presenterà un'interfaccia HTML che ti permette di:

*   Visualizzare i dati (GET).
*   Inviare dati per creare o aggiornare risorse (POST, PUT, PATCH) tramite form HTML.
*   Eliminare risorse (DELETE).

Questo è estremamente utile per esplorare e testare la tua API durante lo sviluppo, senza bisogno di strumenti esterni come Postman o curl (anche se questi sono comunque utili).

Dopo aver configurato i `ViewSet` e il `Router`, avvia il server di sviluppo (`python manage.py runserver`) e naviga a:
*   `http://127.0.0.1:8000/logs/api/` (o il tuo prefisso + `/api/`) per vedere le root dell'API.
*   `http://127.0.0.1:8000/logs/api/libri/` per vedere la lista dei libri e un form per aggiungerne di nuovi.
*   `http://127.0.0.1:8000/logs/api/libri/1/` (sostituisci 1 con un ID valido) per vedere i dettagli di un libro e i form per modificarlo o eliminarlo.

Questo conclude l'introduzione a DRF. Abbiamo creato endpoint API RESTful completi per i nostri modelli `Libro` e `Autore` con relativamente poco codice grazie a `ModelViewSet` e `Router`.

## Esercizi Pratici

1.  **Installa e Configura DRF:**
    *   Installa `djangorestframework` nel tuo ambiente virtuale.
    *   Aggiungi `'rest_framework'` a `INSTALLED_APPS` in `myproject/settings.py`.
2.  **Crea i Serializer:**
    *   Crea il file `learning_logs/serializers.py`.
    *   Definisci `AutoreSerializer` come `ModelSerializer` per il modello `Autore`, includendo i campi `id`, `nome`, `cognome`, `data_nascita`.
    *   Definisci `LibroSerializer` come `ModelSerializer` per il modello `Libro`.
        *   Includi i campi `id`, `titolo`, `autore`, `data_pubblicazione`, `isbn`, `numero_pagine`, `prezzo`.
        *   Per il campo `autore`, per ora lascia che DRF lo gestisca come una chiave primaria (ID). In un secondo momento, potresti voler esplorare come visualizzare più dettagli dell'autore usando un serializer annidato o `StringRelatedField`.
3.  **Crea i ViewSet:**
    *   In `learning_logs/views.py`:
        *   Importa `viewsets` da `rest_framework`.
        *   Crea `AutoreViewSet` come `viewsets.ModelViewSet` basato sul modello `Autore` e `AutoreSerializer`. Imposta un `queryset` che recuperi tutti gli autori, ordinati per cognome e nome.
        *   Crea `LibroViewSet` come `viewsets.ModelViewSet` basato sul modello `Libro` e `LibroSerializer`. Imposta un `queryset` che recuperi tutti i libri, ordinati per titolo.
4.  **Configura le URL dell'API con un Router:**
    *   In `learning_logs/urls.py`:
        *   Importa `DefaultRouter` da `rest_framework.routers`.
        *   Crea un'istanza di `DefaultRouter`.
        *   Registra `AutoreViewSet` con il router sotto il prefisso URL `autori`.
        *   Registra `LibroViewSet` con il router sotto il prefisso URL `libri`.
        *   Modifica `urlpatterns` per includere `router.urls` sotto un prefisso generale per l'API (es. `api/`). La struttura finale delle URL per i libri dovrebbe essere simile a `/logs/api/libri/` e `/logs/api/libri/<pk>/`.
5.  **Testa con la Browsable API:**
    *   Avvia il server di sviluppo Django.
    *   Apri il browser e naviga alla root della tua API (es. `http://127.0.0.1:8000/logs/api/`). Dovresti vedere i link per "autori" e "libri".
    *   Esplora l'endpoint `/logs/api/autori/`:
        *   Visualizza la lista degli autori.
        *   Utilizza il form in fondo alla pagina per aggiungere un nuovo autore.
        *   Naviga alla pagina di dettaglio di un autore (es. `/logs/api/autori/1/`) e prova a modificarlo o eliminarlo.
    *   Fai lo stesso per l'endpoint `/logs/api/libri/`:
        *   Visualizza la lista dei libri. Nota come il campo `autore` mostra l'ID dell'autore.
        *   Aggiungi un nuovo libro. Dovrai fornire l'ID di un autore esistente per il campo `autore`.
        *   Esplora le funzionalità di modifica ed eliminazione per un singolo libro.
    *   Prova a inviare dati non validi tramite i form della browsable API per vedere come DRF gestisce gli errori di validazione (che derivano dai tuoi serializer e modelli).
```
