# Capitolo 3: Gestire Richieste e Risposte con Views, Template e URL

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Comprendere il flusso completo di una richiesta-risposta in Django.
*   Mappare URL a funzioni di vista (views) utilizzando `urls.py`.
*   Scrivere semplici function-based views (FBV) in `views.py`.
*   Comprendere la differenza concettuale tra function-based views e class-based views (CBV).
*   Utilizzare la funzione `render()` per passare dati da una vista a un template.
*   Creare template HTML e utilizzare la sintassi base dei template Django per visualizzare variabili e implementare logica semplice (cicli `for` e condizioni `if`).
*   Creare URL dinamiche per visualizzare dettagli specifici di oggetti.

## Lezione Teorica

### Il Flusso Richiesta-Risposta in Django (Riepilogo)

Come accennato nel Capitolo 1, quando un utente visita una URL nel tuo sito Django, avviene il seguente processo:

1.  **Richiesta HTTP:** Il browser invia una richiesta HTTP al server.
2.  **URL Dispatcher:** Django riceve la richiesta. Il primo componente che la gestisce è il **URL dispatcher**. Basandosi sul file `urls.py` principale del progetto (e successivamente sui file `urls.py` delle singole app), Django determina quale **view** deve elaborare questa richiesta.
3.  **View:** La view è una funzione (o un metodo di una classe) Python che riceve i dettagli della richiesta (un oggetto `HttpRequest`). La view contiene la logica per decidere cosa fare: può interagire con i modelli per leggere/scrivere dati dal/nel database, eseguire calcoli, ecc.
4.  **Template (Opzionale):** Se la view deve restituire una pagina HTML, solitamente carica un **template**. Passa al template i dati necessari (chiamati "contesto" o "context").
5.  **Rendering del Template:** Il sistema di template di Django processa il file HTML, sostituendo i segnaposto delle variabili con i dati reali forniti dal contesto e eseguendo la logica del template (cicli, condizioni).
6.  **Risposta HTTP:** La view restituisce un oggetto `HttpResponse` (o una sua sottoclasse come `JsonResponse` o il risultato di `render()`). Questa risposta, che spesso contiene l'HTML renderizzato, viene inviata al browser dell'utente.

### Mappare URL a Viste: `urls.py`

Il file `urls.py` è il responsabile di associare (mappare) specifici percorsi URL a specifiche funzioni di vista.

**1. `urls.py` a Livello di Progetto:**
Il tuo progetto Django ha un file `urls.py` principale, solitamente situato in `nome_del_progetto/urls.py`. Questo file è il punto di ingresso per tutte le URL.

```python
# nome_del_progetto/urls.py
from django.contrib import admin
from django.urls import path, include # 'include' è importante

urlpatterns = [
    path('admin/', admin.site.urls),
    # Aggiungeremo qui le URL delle nostre app
]
```

Per organizzare meglio le URL, è prassi comune che ogni app Django abbia il proprio file `urls.py`. Il file `urls.py` del progetto "include" poi le URL definite nelle app.

**2. `urls.py` a Livello di App:**
Crea un nuovo file chiamato `urls.py` all'interno della tua directory dell'app (es. `learning_logs/urls.py`).

```python
# learning_logs/urls.py
from django.urls import path
from . import views # Importa le viste dalla stessa directory (views.py)

app_name = 'learning_logs' # Namespace per le URL di questa app (opzionale ma consigliato)

urlpatterns = [
    # Esempio: path('', views.index, name='index'),
    # Aggiungeremo qui le nostre URL specifiche dell'app
]
```
*   `from . import views`: Importa il modulo `views.py` dalla directory corrente.
*   `app_name = 'learning_logs'`: Definire un `app_name` permette di creare un namespace per le URL. Questo è utile per evitare collisioni di nomi tra diverse app e per riferirsi alle URL in modo più pulito nei template e nelle viste (es. `{% url 'learning_logs:index' %}`).

Ora, dobbiamo dire al `urls.py` del progetto di includere le URL della nostra app `learning_logs`. Modifica `nome_del_progetto/urls.py`:

```python
# nome_del_progetto/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('logs/', include('learning_logs.urls')), # Includi le URL dell'app learning_logs
                                                 # sotto il prefisso 'logs/'
]
```
Con questa configurazione:
*   Una richiesta a `http://127.0.0.1:8000/admin/` sarà gestita dall'interfaccia di amministrazione.
*   Una richiesta a `http://127.0.0.1:8000/logs/...` sarà passata al file `learning_logs/urls.py` per un'ulteriore elaborazione.

### Scrivere Viste: `views.py`

Una vista in Django è una funzione Python (o un metodo di una classe) che prende un oggetto `HttpRequest` come primo argomento e restituisce un oggetto `HttpResponse`.

**Function-Based Views (FBV)**
Per iniziare, le FBV sono più semplici da capire. Definiamone una in `learning_logs/views.py`:

```python
# learning_logs/views.py
from django.shortcuts import render
from django.http import HttpResponse # Per risposte semplici

# Importa i tuoi modelli se devi accedere al database
from .models import Libro

def index(request):
    """La homepage per learning_logs."""
    return HttpResponse("Ciao! Questa è la pagina principale dell'app Learning Logs.")

def lista_libri(request):
    """Mostra una lista di tutti i libri."""
    libri = Libro.objects.all().order_by('titolo') # Prende tutti i libri, ordinati per titolo
    context = {'libri': libri} # Crea un dizionario di contesto
    return render(request, 'learning_logs/lista_libri.html', context) # Usa render()
```

Analizziamo `lista_libri`:
1.  `def lista_libri(request):`: Ogni funzione di vista riceve un oggetto `request` che contiene informazioni sulla richiesta corrente (metodo HTTP, dati POST/GET, utente, ecc.).
2.  `libri = Libro.objects.all().order_by('titolo')`: Qui usiamo l'ORM di Django. `Libro.objects.all()` recupera tutti gli oggetti `Libro` dal database. `.order_by('titolo')` li ordina alfabeticamente per titolo. Il risultato (`libri`) è un `QuerySet`, una collezione di oggetti modello.
3.  `context = {'libri': libri}`: Il "contesto" è un dizionario Python. Le chiavi di questo dizionario (`'libri'` in questo caso) diventano i nomi delle variabili accessibili nel template. I valori (`libri`, il QuerySet) sono i dati che vogliamo passare al template.
4.  `return render(request, 'learning_logs/lista_libri.html', context)`:
    *   `render()` è una scorciatoia di Django molto comune. Fa due cose principali:
        1.  Carica il template specificato (in questo caso `learning_logs/lista_libri.html`).
        2.  Passa il `context` al template, renderizza il template (sostituisce le variabili e esegue la logica del template) e restituisce un `HttpResponse` con il risultato HTML.

**Class-Based Views (CBV)**
Django offre anche le Class-Based Views (CBV), che sono un modo alternativo per scrivere viste usando classi Python invece di funzioni. Le CBV possono aiutare a riutilizzare codice e a strutturare viste complesse in modo più organizzato, specialmente quando si eseguono operazioni CRUD (Create, Retrieve, Update, Delete) standard.

Esempio concettuale (non lo implementeremo completamente ora):
```python
# learning_logs/views.py (esempio CBV)
from django.views.generic import ListView
from .models import Libro

class ListaLibriView(ListView):
    model = Libro
    template_name = 'learning_logs/lista_libri_cbv.html' # Può essere lo stesso template
    context_object_name = 'libri' # Nome della variabile nel template
    ordering = ['titolo']
```
Le CBV hanno viste generiche predefinite (come `ListView`, `DetailView`, `CreateView`, `UpdateView`, `DeleteView`) che gestiscono molta della logica standard per te. In questo corso ci concentreremo principalmente sulle FBV per chiarezza iniziale, ma è importante sapere che le CBV esistono e sono ampiamente utilizzate.

Ora, mappiamo queste viste nel file `learning_logs/urls.py`:
```python
# learning_logs/urls.py
from django.urls import path
from . import views

app_name = 'learning_logs'

urlpatterns = [
    path('', views.index, name='index'), # URL radice dell'app (es. /logs/)
    path('libri/', views.lista_libri, name='lista_libri'), # URL per la lista dei libri (es. /logs/libri/)
]
```
*   `path('', views.index, name='index')`: Mappa la URL radice dell'app (che corrisponde a `/logs/` a causa dell' `include` nel `urls.py` del progetto) alla funzione `views.index`. `name='index'` assegna un nome a questa rotta URL, utile per riferimenti inversi.
*   `path('libri/', views.lista_libri, name='lista_libri')`: Mappa `/logs/libri/` alla funzione `views.lista_libri`.

### Creare Template HTML

I template sono file HTML (o altri file di testo) che contengono variabili e tag speciali che Django processa. Per convenzione, i template specifici di un'app si trovano in una sottocartella chiamata `templates` all'interno della directory dell'app, e ulteriormente annidati in una cartella con lo stesso nome dell'app per creare un namespace ed evitare conflitti.

Crea le seguenti cartelle e file:
`learning_logs/`
  `templates/`
    `learning_logs/`  <-- Questa sottocartella con il nome dell'app è importante!
      `base.html`       <-- Un template di base (opzionale, ma buona pratica)
      `lista_libri.html`

**1. Template di Base (`base.html`):**
È comune creare un template di base che definisce la struttura HTML comune a tutte le pagine del sito. Le altre pagine poi "estendono" questo template di base.

```html
<!-- learning_logs/templates/learning_logs/base.html -->
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}La Mia Libreria{% endblock title %}</title>
    <style>
        body { font-family: sans-serif; margin: 20px; background-color: #f4f4f4; }
        header { background-color: #333; color: white; padding: 10px 0; text-align: center; }
        nav a { margin: 0 15px; color: white; text-decoration: none; }
        .container { background-color: white; padding: 20px; margin-top: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <header>
        <h1>La Mia Libreria Django</h1>
        <nav>
            <a href="{% url 'learning_logs:index' %}">Home</a>
            <a href="{% url 'learning_logs:lista_libri' %}">Elenco Libri</a>
            <!-- Altri link di navigazione qui -->
        </nav>
    </header>

    <div class="container">
        {% block content %}
        <!-- Il contenuto specifico della pagina andrà qui -->
        {% endblock content %}
    </div>

    <footer>
        <p style="text-align: center; margin-top: 30px; color: #777;">
            &copy; 2023 La Mia Libreria Personale
        </p>
    </footer>
</body>
</html>
```
*   `{% block title %}` e `{% block content %}`: Questi sono **tag di blocco**. I template figli possono sovrascrivere il contenuto di questi blocchi.
*   `{% url 'learning_logs:index' %}`: Questo è un **tag di template** che genera dinamicamente l'URL per la vista chiamata `index` all'interno del namespace `learning_logs`. È il modo preferito per linkare pagine, perché se cambi la struttura dell'URL in `urls.py`, i link nei template si aggiorneranno automaticamente.

**2. Template per la Lista dei Libri (`lista_libri.html`):**
Questo template estenderà `base.html` e visualizzerà la lista dei libri.

```html
<!-- learning_logs/templates/learning_logs/lista_libri.html -->
{% extends "learning_logs/base.html" %}

{% block title %}Elenco dei Libri - La Mia Libreria{% endblock title %}

{% block content %}
    <h2>Elenco dei Nostri Libri</h2>

    {% if libri %}
        <ul>
            {% for libro in libri %}
                <li>
                    <strong>{{ libro.titolo }}</strong> - <em>{{ libro.autore.nome }} {{ libro.autore.cognome }}</em>
                    (Pubblicato: {{ libro.data_pubblicazione|date:"d M Y" }})
                    <!-- Aggiungeremo un link al dettaglio qui -->
                </li>
            {% empty %}
                <li>Nessun libro disponibile al momento.</li>
            {% endfor %}
        </ul>
    {% else %}
        <p>Non ci sono libri da mostrare.</p>
    {% endif %}
{% endblock content %}
```

Analizziamo la sintassi del template:
*   `{% extends "learning_logs/base.html" %}`: Dice a Django di usare `base.html` come layout principale. Deve essere la prima riga del template.
*   `{% block title %}` e `{% block content %}`: Sovrascrivono i blocchi definiti in `base.html`.
*   `{% if libri %}` ... `{% else %}` ... `{% endif %}`: Logica condizionale. Controlla se la variabile `libri` (passata dal contesto della vista) esiste e non è vuota.
*   `{% for libro in libri %}` ... `{% empty %}` ... `{% endfor %}`: Cicla attraverso la lista `libri`.
    *   `{% empty %}`: Blocco opzionale eseguito se la lista `libri` è vuota.
*   `{{ libro.titolo }}`: **Variabili del template**. Vengono sostituite con il valore dell'attributo corrispondente dell'oggetto. Qui accediamo agli attributi dell'oggetto `libro` (es. `libro.titolo`, `libro.autore.nome`). Django gestisce automaticamente le chiamate ai metodi o l'accesso agli attributi.
*   `{{ libro.data_pubblicazione|date:"d M Y" }}`: Esempio di **filtro di template**. I filtri modificano la visualizzazione delle variabili. Il filtro `date` formatta un oggetto data. `"d M Y"` è un formato specifico (es. "26 Ott 2023").

### URL Dinamiche

Spesso vuoi creare pagine che mostrano dettagli specifici di un oggetto, come la pagina di un singolo libro. Per questo, hai bisogno di URL dinamiche che includano un identificatore (come l'ID del libro).

**1. Modifica la Vista:**
Crea una nuova vista in `learning_logs/views.py` per mostrare i dettagli di un libro.

```python
# learning_logs/views.py
# ... (altri import e viste) ...
from django.shortcuts import get_object_or_404 # Utile per gestire oggetti non trovati

def dettaglio_libro(request, libro_id): # libro_id verrà dalla URL
    """Mostra i dettagli di un singolo libro."""
    # libro = Libro.objects.get(pk=libro_id) # pk significa Primary Key (chiave primaria, di solito l'ID)
    # Usare get_object_or_404 è meglio perché gestisce l'errore se l'ID non esiste
    libro = get_object_or_404(Libro, pk=libro_id)
    context = {'libro': libro}
    return render(request, 'learning_logs/dettaglio_libro.html', context)
```
*   `libro_id`: Questo parametro nella definizione della vista deve corrispondere al nome del parametro catturato nella URL (vedi sotto).
*   `get_object_or_404(Libro, pk=libro_id)`: È una scorciatoia di Django che prova a recuperare un oggetto `Libro` con la chiave primaria (ID) specificata. Se l'oggetto non esiste, solleva automaticamente un errore HTTP 404 (Not Found).

**2. Modifica `urls.py` dell'App:**
Aggiungi un pattern URL per la vista `dettaglio_libro` in `learning_logs/urls.py`.

```python
# learning_logs/urls.py
# ... (altri import e urlpatterns) ...

urlpatterns = [
    path('', views.index, name='index'),
    path('libri/', views.lista_libri, name='lista_libri'),
    path('libri/<int:libro_id>/', views.dettaglio_libro, name='dettaglio_libro'), # Nuova URL
]
```
*   `<int:libro_id>`: Questa è la parte dinamica.
    *   `int`: È un "path converter" che dice a Django di aspettarsi un intero in questa parte dell'URL.
    *   `libro_id`: È il nome della variabile che conterrà il valore intero estratto dall'URL. Questo nome verrà passato come argomento alla funzione di vista `dettaglio_libro`.
    *   Esempio: Se l'URL è `/logs/libri/5/`, Django chiamerà `views.dettaglio_libro(request, libro_id=5)`.

**3. Crea il Template `dettaglio_libro.html`:**
Crea il file `learning_logs/templates/learning_logs/dettaglio_libro.html`.

```html
<!-- learning_logs/templates/learning_logs/dettaglio_libro.html -->
{% extends "learning_logs/base.html" %}

{% block title %}{{ libro.titolo }} - Dettagli Libro{% endblock title %}

{% block content %}
    <h2>{{ libro.titolo }}</h2>
    <p><strong>Autore:</strong> {{ libro.autore.nome }} {{ libro.autore.cognome }}</p>
    <p><strong>Data di Pubblicazione:</strong> {{ libro.data_pubblicazione|date:"d F Y" }}</p>
    <p><strong>ISBN:</strong> {{ libro.isbn }}</p>
    {% if libro.numero_pagine %}
        <p><strong>Pagine:</strong> {{ libro.numero_pagine }}</p>
    {% endif %}
    {% if libro.prezzo %}
        <p><strong>Prezzo:</strong> € {{ libro.prezzo }}</p>
    {% endif %}

    <p><a href="{% url 'learning_logs:lista_libri' %}">Torna all'elenco dei libri</a></p>
{% endblock content %}
```

**4. Aggiungi Link nel Template `lista_libri.html`:**
Ora, modifica `lista_libri.html` per linkare alla pagina di dettaglio di ogni libro.

```html
<!-- learning_logs/templates/learning_logs/lista_libri.html -->
{% extends "learning_logs/base.html" %}

{% block title %}Elenco dei Libri - La Mia Libreria{% endblock title %}

{% block content %}
    <h2>Elenco dei Nostri Libri</h2>

    {% if libri %}
        <ul>
            {% for libro in libri %}
                <li>
                    <a href="{% url 'learning_logs:dettaglio_libro' libro.id %}">
                        <strong>{{ libro.titolo }}</strong>
                    </a>
                    - <em>{{ libro.autore.nome }} {{ libro.autore.cognome }}</em>
                    (Pubblicato: {{ libro.data_pubblicazione|date:"d M Y" }})
                </li>
            {% empty %}
                <li>Nessun libro disponibile al momento.</li>
            {% endfor %}
        </ul>
    {% else %}
        <p>Non ci sono libri da mostrare.</p>
    {% endif %}
{% endblock content %}
```
*   `{% url 'learning_logs:dettaglio_libro' libro.id %}`: Qui, il tag `url` prende un argomento aggiuntivo, `libro.id`. Questo valore sarà usato per popolare la parte `<int:libro_id>` della URL dinamica. Django sa quale URL generare grazie al nome `'dettaglio_libro'` e al namespace `'learning_logs'`.

Con questi passaggi, hai creato un sistema base per visualizzare liste e dettagli di oggetti dal tuo database!

## Esercizi Pratici

1.  **Crea la Vista `index`:**
    *   Nel file `learning_logs/views.py`, implementa la vista `index` (se non l'hai già fatto). Per ora, può semplicemente restituire una stringa "Homepage dell'app Learning Logs" usando `HttpResponse`, oppure puoi creare un semplice template `index.html`.
2.  **Configura le URL:**
    *   Assicurati che il file `urls.py` del progetto (`myproject/urls.py`) includa correttamente le URL dell'app `learning_logs` sotto un prefisso (es. `logs/`).
    *   Nel file `learning_logs/urls.py`:
        *   Definisci `app_name = 'learning_logs'`.
        *   Mappa la URL radice dell'app alla vista `index`.
        *   Mappa la URL `libri/` alla vista `lista_libri`.
        *   Mappa la URL dinamica `libri/<int:libro_id>/` alla vista `dettaglio_libro`.
3.  **Crea i Template:**
    *   Crea la struttura di cartelle `learning_logs/templates/learning_logs/`.
    *   Crea il template di base `base.html` come mostrato nella lezione, includendo blocchi per `title` e `content`, e una semplice navigazione.
    *   Crea il template `lista_libri.html` che estende `base.html`. Deve ciclare attraverso i libri passati dalla vista e visualizzare il titolo e l'autore di ciascuno. Ogni titolo di libro deve essere un link alla sua pagina di dettaglio.
    *   Crea il template `dettaglio_libro.html` che estende `base.html`. Deve visualizzare tutti i dettagli rilevanti del libro passato dalla vista (titolo, autore, data di pubblicazione, ISBN, ecc.).
4.  **Implementa le Viste:**
    *   In `learning_logs/views.py`:
        *   Implementa la vista `lista_libri`. Deve recuperare tutti gli oggetti `Libro` (e magari anche gli `Autore` correlati per evitare query N+1, usando `select_related('autore')` se necessario, anche se per ora `Libro.objects.all()` va bene), ordinarli e passarli al template `lista_libri.html` tramite il contesto.
        *   Implementa la vista `dettaglio_libro`. Deve accettare `libro_id` come argomento, recuperare il `Libro` corrispondente usando `get_object_or_404`, e passarlo al template `dettaglio_libro.html`.
5.  **Popola il Database e Testa:**
    *   Se non l'hai già fatto nel capitolo precedente, usa l'Admin di Django (`/admin/`) per aggiungere alcuni `Autore` e diversi `Libro` al tuo database. Assicurati di associare i libri agli autori.
    *   Avvia il server di sviluppo (`python manage.py runserver`).
    *   Naviga a:
        *   `/logs/` (o qualsiasi prefisso tu abbia scelto) per vedere la tua pagina `index`.
        *   `/logs/libri/` per vedere l'elenco dei libri.
        *   Clicca sui link dei titoli dei libri per visitare le pagine di dettaglio (es. `/logs/libri/1/`, `/logs/libri/2/`, ecc.).
        *   Verifica che tutti i link funzionino e che i dati vengano visualizzati correttamente.
```
