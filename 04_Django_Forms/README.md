# Capitolo 4: Creare e Gestire i Form

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Comprendere come Django gestisce i form HTML e l'invio dei dati.
*   Creare classi di form personalizzate ereditando da `django.forms.Form`.
*   Utilizzare `ModelForm` per creare rapidamente form basati sui modelli Django esistenti.
*   Renderizzare i form nei template Django.
*   Gestire i dati inviati tramite metodo `POST` nelle viste.
*   Validare i dati dei form e mostrare messaggi di errore.
*   Comprendere e implementare il pattern Post/Redirect/Get (PRG) per una migliore esperienza utente.
*   Salvare i dati validati nel database.

## Lezione Teorica

I form HTML sono il modo principale con cui gli utenti inviano dati alle applicazioni web. Django fornisce un potente framework per creare, gestire e validare i form.

### Componenti dei Form Django

La gestione dei form in Django coinvolge principalmente tre parti:

1.  **Classe Form (in `forms.py`):** Una classe Python che definisce i campi del form, le loro proprietà (tipo di widget, etichette, validazioni). Si possono creare ereditando da `forms.Form` (per form generici) o `forms.ModelForm` (per form legati a un modello).
2.  **Template HTML:** Dove il form viene visualizzato all'utente. Django può renderizzare i campi del form automaticamente.
3.  **Vista (in `views.py`):** La logica che gestisce il form. Questo include:
    *   Creare un'istanza del form.
    *   Passare il form al template per la visualizzazione (richiesta `GET`).
    *   Ricevere i dati inviati dal form (richiesta `POST`).
    *   Validare i dati.
    *   Eseguire azioni basate sui dati validati (es. salvare nel database, inviare email).
    *   Rivisualizzare il form con errori se la validazione fallisce.

### Creare un Form con `forms.Form`

Usiamo `forms.Form` quando i dati del form non corrispondono direttamente a un modello del database, o quando vogliamo un controllo più granulare.

Crea un nuovo file `forms.py` nella tua app `learning_logs`:
`learning_logs/forms.py`

```python
# learning_logs/forms.py
from django import forms

class ContattoForm(forms.Form):
    nome = forms.CharField(label='Il tuo nome', max_length=100, required=True)
    email = forms.EmailField(label='La tua email', required=True)
    messaggio = forms.CharField(label='Messaggio', widget=forms.Textarea, required=True)
    ricevi_newsletter = forms.BooleanField(label='Desidero ricevere la newsletter', required=False)
```

*   `forms.CharField`, `forms.EmailField`, `forms.BooleanField`: Questi sono tipi di campo del form. Django ne offre molti altri (`IntegerField`, `DateField`, `ChoiceField`, ecc.).
*   `label`: L'etichetta visualizzata accanto al campo nel template.
*   `max_length`: Per i `CharField`, la lunghezza massima.
*   `required=True/False`: Indica se il campo è obbligatorio.
*   `widget=forms.Textarea`: Specifica come il campo deve essere renderizzato in HTML. `Textarea` crea un `<textarea>` invece di un `<input type="text">`. Django sceglie widget di default appropriati, ma puoi personalizzarli.

### Creare un Form con `forms.ModelForm`

`ModelForm` è una classe helper che ti permette di creare un `Form` da un modello Django. È molto utile perché riduce la duplicazione di codice: i campi del form, i tipi e le validazioni di base vengono derivati automaticamente dal modello.

Modifichiamo `learning_logs/forms.py` per aggiungere un form per creare un nuovo `Libro`:

```python
# learning_logs/forms.py
from django import forms
from .models import Libro # Importa il modello Libro

# ... (ContattoForm definito prima) ...

class LibroForm(forms.ModelForm):
    class Meta:
        model = Libro
        fields = ['titolo', 'autore', 'data_pubblicazione', 'isbn', 'numero_pagine', 'prezzo']
        # Potresti anche usare fields = '__all__' per includere tutti i campi del modello,
        # ma è generalmente meglio essere espliciti.
        # Escludere campi: exclude = ['campo_da_escludere']

        labels = {
            'data_pubblicazione': 'Data di Pubblicazione (YYYY-MM-DD)',
            'numero_pagine': 'Numero di Pagine',
        }
        widgets = {
            'data_pubblicazione': forms.DateInput(attrs={'type': 'date'}),
            'isbn': forms.TextInput(attrs={'placeholder': 'Es. 978-3-16-148410-0'}),
        }

    # Puoi aggiungere validazioni personalizzate qui se necessario
    def clean_isbn(self):
        isbn = self.cleaned_data.get('isbn')
        # Esempio di validazione: rimuovi i trattini prima di salvare o controllare il formato
        if isbn:
            isbn = isbn.replace('-', '')
            if not isbn.isdigit() or not (len(isbn) == 10 or len(isbn) == 13):
                raise forms.ValidationError("L'ISBN deve essere composto da 10 o 13 cifre.")
        return isbn
```

*   `class Meta`: Una classe interna che fornisce metadati al `ModelForm`.
    *   `model = Libro`: Specifica il modello su cui si basa il form.
    *   `fields = [...]`: Una lista di stringhe con i nomi dei campi del modello da includere nel form.
    *   `labels = {...}`: Un dizionario per personalizzare le etichette dei campi.
    *   `widgets = {...}`: Un dizionario per specificare widget personalizzati per i campi. Qui, usiamo `DateInput` con `type='date'` per avere un selettore di date nel browser (se supportato).
*   `def clean_isbn(self):`: Metodo di validazione personalizzato per un campo specifico. I metodi che iniziano con `clean_` seguito dal nome del campo (`nome_campo`) vengono chiamati automaticamente durante il processo di validazione. Deve restituire il valore pulito del campo. Se la validazione fallisce, solleva `forms.ValidationError`.
*   `self.cleaned_data`: Un dizionario contenente i dati "puliti" (validati e convertiti nel tipo Python corretto) del form.

### Renderizzare il Form nel Template

Django può renderizzare i campi del form in vari modi nel template:

*   `{{ form.as_p }}`: Renderizza ogni campo avvolto in un tag `<p>`.
*   `{{ form.as_ul }}`: Renderizza ogni campo avvolto in un tag `<li>`.
*   `{{ form.as_table }}`: Renderizza ogni campo avvolto in tag `<tr>`, `<th>` (per l'etichetta) e `<td>`.
*   Controllo manuale: Puoi renderizzare ogni campo individualmente per una maggiore personalizzazione.

Crea un template per aggiungere un nuovo libro:
`learning_logs/templates/learning_logs/aggiungi_libro.html`

```html
<!-- learning_logs/templates/learning_logs/aggiungi_libro.html -->
{% extends "learning_logs/base.html" %}

{% block title %}Aggiungi Nuovo Libro{% endblock title %}

{% block content %}
    <h2>Aggiungi un Nuovo Libro</h2>

    <form method="post" novalidate>
        {% csrf_token %} <!-- Importante per la sicurezza! -->

        {{ form.as_p }} <!-- Renderizza il form come paragrafi -->

        <!-- Esempio di rendering manuale di un campo (commentato)
        <div>
            {{ form.titolo.label_tag }}
            {{ form.titolo }}
            {% if form.titolo.errors %}
                <div style="color: red;">{{ form.titolo.errors }}</div>
            {% endif %}
            {% if form.titolo.help_text %}
                <small>{{ form.titolo.help_text }}</small>
            {% endif %}
        </div>
        -->

        <button type="submit">Salva Libro</button>
    </form>

    <p><a href="{% url 'learning_logs:lista_libri' %}">Annulla e torna all'elenco</a></p>
{% endblock content %}
```

*   `<form method="post">`: È importante specificare `method="post"` perché i dati del form verranno inviati nel corpo della richiesta HTTP, che è appropriato per operazioni che modificano dati sul server. L'attributo `action` può essere omesso se il form invia i dati alla stessa URL da cui è stato servito.
*   `novalidate`: Attributo HTML5 che disabilita la validazione del browser. È utile durante lo sviluppo per testare la validazione lato server di Django.
*   `{% csrf_token %}`: Questo tag di template è **cruciale** per la sicurezza. Protegge contro attacchi di tipo Cross-Site Request Forgery (CSRF). Django lo richiede per tutte le richieste `POST` (a meno che non sia specificamente disabilitato, il che è sconsigliato).

### Gestire il Form nella Vista

La vista che gestisce il form deve fare due cose:
1.  Se la richiesta è `GET`: Crea un'istanza vuota del form e la passa al template per la visualizzazione.
2.  Se la richiesta è `POST` (l'utente ha inviato il form):
    *   Crea un'istanza del form e la popola con i dati inviati (`request.POST`).
    *   Chiama il metodo `is_valid()` del form. Questo esegue tutte le routine di validazione (sia quelle predefinite basate sui tipi di campo, sia quelle personalizzate come `clean_isbn`).
    *   Se `form.is_valid()` è `True`:
        *   Accedi ai dati validati tramite `form.cleaned_data`.
        *   Esegui l'azione desiderata (es. salvare l'oggetto nel database usando `form.save()` se è un `ModelForm`).
        *   Reindirizza l'utente a un'altra pagina (pattern Post/Redirect/Get).
    *   Se `form.is_valid()` è `False`:
        *   Rivisualizza il template con l'istanza del form popolata. Il form ora conterrà i dati inseriti dall'utente e i messaggi di errore, che verranno mostrati nel template.

Aggiungi la vista per creare un nuovo libro in `learning_logs/views.py`:

```python
# learning_logs/views.py
from django.shortcuts import render, redirect, get_object_or_404
from .models import Libro, Autore # Assicurati che Autore sia importato se necessario
from .forms import LibroForm # Importa il tuo ModelForm

# ... (altre viste: index, lista_libri, dettaglio_libro) ...

def aggiungi_libro(request):
    if request.method == 'POST':
        # L'utente ha inviato il form, quindi creiamo un'istanza del form
        # e la popoliamo con i dati dalla richiesta:
        form = LibroForm(request.POST)
        if form.is_valid():
            # Il form è valido, i dati sono in form.cleaned_data
            # Se è un ModelForm, possiamo salvarlo direttamente
            form.save()
            # Reindirizza a una nuova URL dopo il salvataggio (pattern PRG)
            # 'lista_libri' è il 'name' che abbiamo dato alla URL della lista dei libri
            return redirect('learning_logs:lista_libri')
    else:
        # Richiesta GET, quindi creiamo un form vuoto
        form = LibroForm()

    context = {'form': form}
    return render(request, 'learning_logs/aggiungi_libro.html', context)
```

*   `request.method == 'POST'`: Controlla se la richiesta è di tipo POST.
*   `form = LibroForm(request.POST)`: Crea un'istanza del form associata ai dati inviati.
*   `form.is_valid()`: Esegue la validazione.
*   `form.save()`: Se stai usando un `ModelForm` e `form.is_valid()` è vero, `form.save()` crea e salva un nuovo oggetto del modello nel database. Se il `ModelForm` fosse stato istanziato con `instance=mio_oggetto_esistente`, `form.save()` aggiornerebbe quell'oggetto.
*   `return redirect('learning_logs:lista_libri')`: **Pattern Post/Redirect/Get (PRG)**. Dopo un POST andato a buon fine, è buona pratica reindirizzare l'utente. Questo previene problemi come:
    *   Se l'utente ricarica la pagina dopo un POST, il browser potrebbe provare a inviare nuovamente i dati del form, causando duplicazioni.
    *   L'URL rimane quella del form, e se l'utente la aggiunge ai segnalibri, potrebbe essere confuso.
    Il redirect invia una risposta HTTP 302 al browser, che poi fa una nuova richiesta GET alla pagina specificata (in questo caso, la lista dei libri).
*   `form = LibroForm()`: Per una richiesta GET, crea un form non associato (vuoto).
*   Il `context` passa l'istanza del form (vuota o con errori) al template.

### Aggiungere l'URL per il Form

Infine, aggiungi una rotta URL per la nuova vista in `learning_logs/urls.py`:

```python
# learning_logs/urls.py
from django.urls import path
from . import views

app_name = 'learning_logs'

urlpatterns = [
    path('', views.index, name='index'),
    path('libri/', views.lista_libri, name='lista_libri'),
    path('libri/<int:libro_id>/', views.dettaglio_libro, name='dettaglio_libro'),
    path('libri/aggiungi/', views.aggiungi_libro, name='aggiungi_libro'), # Nuova URL
]
```

E magari un link nel template `base.html` o `lista_libri.html` per raggiungere la pagina di aggiunta:

```html
<!-- In learning_logs/templates/learning_logs/lista_libri.html o base.html -->
<p><a href="{% url 'learning_logs:aggiungi_libro' %}">Aggiungi un nuovo libro</a></p>
```

### Modificare Oggetti Esistenti

Il processo per creare un form per modificare un oggetto esistente è molto simile:
1.  **Form:** Puoi usare lo stesso `ModelForm`.
2.  **URL:** Avrai bisogno di una URL che identifichi l'oggetto da modificare, es. `libri/<int:libro_id>/modifica/`.
3.  **Vista:**
    *   Recupera l'istanza dell'oggetto dal database usando l'ID dalla URL (`get_object_or_404`).
    *   Quando crei l'istanza del form (sia per GET che per POST), passala come argomento `instance`:
        ```python
        libro_da_modificare = get_object_or_404(Libro, pk=libro_id)
        if request.method == 'POST':
            form = LibroForm(request.POST, instance=libro_da_modificare)
            if form.is_valid():
                form.save()
                return redirect('learning_logs:dettaglio_libro', libro_id=libro_da_modificare.id)
        else:
            form = LibroForm(instance=libro_da_modificare)
        ```
    *   Il template sarà lo stesso (`aggiungi_libro.html` può essere rinominato o riutilizzato, magari passando un titolo diverso dal contesto).

## Esercizi Pratici

1.  **Crea `LibroForm`:**
    *   Nel file `learning_logs/forms.py`, crea la classe `LibroForm` come `ModelForm` basata sul modello `Libro`.
    *   Includi i campi: `titolo`, `autore`, `data_pubblicazione`, `isbn`, `numero_pagine`, `prezzo`.
    *   Personalizza le etichette per `data_pubblicazione` e `numero_pagine`.
    *   Usa un widget `DateInput` con `type='date'` per `data_pubblicazione`.
    *   Aggiungi una validazione personalizzata per il campo `isbn` (es. `clean_isbn`) che verifichi che sia composto solo da cifre e abbia una lunghezza di 10 o 13 caratteri (dopo aver rimosso eventuali trattini).
2.  **Crea il Template per Aggiungere Libri:**
    *   Crea il file `learning_logs/templates/learning_logs/aggiungi_libro.html`.
    *   Il template deve estendere `base.html`.
    *   Includi un titolo (es. "Aggiungi Nuovo Libro").
    *   Crea un tag `<form method="post">`.
    *   Non dimenticare `{% csrf_token %}`.
    *   Renderizza il form usando `{{ form.as_p }}`.
    *   Aggiungi un pulsante di invio (`<button type="submit">Salva</button>`).
    *   Aggiungi un link per tornare alla lista dei libri.
3.  **Crea la Vista `aggiungi_libro`:**
    *   In `learning_logs/views.py`, implementa la funzione `aggiungi_libro(request)`.
    *   Deve gestire sia le richieste `GET` (mostrando un form vuoto) sia le richieste `POST` (processando i dati del form).
    *   Se il metodo è `POST` e il form è valido, salva il nuovo libro e reindirizza l'utente alla pagina `lista_libri`.
    *   Se il form non è valido, o se il metodo è `GET`, renderizza il template `aggiungi_libro.html` con l'istanza del form (che conterrà gli errori, se presenti).
4.  **Aggiungi l'URL:**
    *   In `learning_logs/urls.py`, aggiungi un pattern URL che mappa a `views.aggiungi_libro` (es. `libri/aggiungi/`) e dagli un nome (es. `'aggiungi_libro'`).
5.  **Aggiungi un Link:**
    *   Nel template `learning_logs/templates/learning_logs/lista_libri.html` (o in `base.html`), aggiungi un link che punti alla pagina per aggiungere un nuovo libro, usando il tag `{% url %}`.
6.  **Testa:**
    *   Avvia il server di sviluppo.
    *   Naviga alla pagina della lista dei libri e clicca sul link per aggiungere un nuovo libro.
    *   Prova a inviare il form vuoto: dovresti vedere i messaggi di errore di validazione di Django.
    *   Prova a inserire un ISBN non valido (es. con lettere o lunghezza sbagliata): dovresti vedere il tuo messaggio di errore personalizzato.
    *   Compila correttamente il form e invialo. Dovresti essere reindirizzato alla lista dei libri e il nuovo libro dovrebbe apparire nell'elenco.
    *   Verifica tramite l'Admin di Django che il libro sia stato effettivamente salvato nel database.
```
