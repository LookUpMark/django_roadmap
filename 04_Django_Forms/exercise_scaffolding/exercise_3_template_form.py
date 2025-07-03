# OBIETTIVO: Completare l'Esercizio 2 ("Crea il Template per Aggiungere Libri")
#            e parte dell'Esercizio 5 ("Aggiungi un Link") descritti nel README.md del Capitolo 4.
# COMPITO: Creare il template HTML `aggiungi_libro.html` per renderizzare il LibroForm
#          e aggiungere un link per navigare a questa pagina.
# Questo file è una guida descrittiva per la creazione del file HTML.

# --- Creazione del Template `aggiungi_libro.html` ---
# Percorso: `pizzeria_app/templates/pizzeria_app/aggiungi_libro.html`

# TODO 1: Crea il file `aggiungi_libro.html` nella directory dei template della tua app.
#         (es. `pizzeria_app/templates/pizzeria_app/aggiungi_libro.html`)

# TODO 2: Il template `aggiungi_libro.html` deve:
#         a. Estendere il template `base.html` (che dovresti aver creato nel Capitolo 3).
#            Esempio: `{% extends "pizzeria_app/base.html" %}`
#         b. Sovrascrivere il blocco `title`.
#            Esempio: `{% block title %}Aggiungi Nuovo Libro{% endblock title %}`
#         c. Sovrascrivere il blocco `content`. All'interno di questo blocco:
#            i.   Aggiungere un titolo H2, es. "Aggiungi un Nuovo Libro".
#            ii.  Creare un tag `<form>`:
#                 -   `method="post"` (per inviare i dati).
#                 -   `action` può essere omesso (invia alla stessa URL) o puntare alla URL del form
#                     usando `{% url 'pizzeria_app:aggiungi_libro' %}` (se hai definito il nome della rotta).
#                 -   `novalidate` (opzionale, per disabilitare la validazione HTML5 del browser e testare quella di Django).
#            iii. Includere il token CSRF: `{% csrf_token %}`. Questo è FONDAMENTALE.
#            iv.  Renderizzare il form passato dalla vista. Puoi usare:
#                 -   `{{ form_da_template.as_p }}` (renderizza ogni campo come un paragrafo <p>).
#                 -   `{{ form_da_template.as_ul }}` (renderizza come lista <ul>).
#                 -   `{{ form_da_template.as_table }}` (renderizza come tabella <tr><td>).
#                 -   Oppure renderizzare i campi manualmente per maggior controllo (vedi Lezione Teorica).
#                     Per questo esercizio, `as_p` è sufficiente.
#                     (Assicurati che 'form_da_template' corrisponda alla chiave usata nel context della vista).
#            v.   Aggiungere un pulsante di invio: `<button type="submit">Salva Libro</button>`.
#            vi.  (Opzionale) Aggiungere un link per "Annulla" o "Torna all'elenco" che punti alla lista dei libri.
#                 Esempio: `<a href="{% url 'pizzeria_app:lista_libri' %}">Annulla</a>`

# Esempio schematico di `aggiungi_libro.html`:
"""
{% extends "pizzeria_app/base.html" %}

{% block title %}Aggiungi Libro - Libreria Pizzeria{% endblock title %}

{% block content %}
    <h2>Aggiungi un Nuovo Libro al Catalogo</h2>

    <form method="post" novalidate>
        {% csrf_token %}

        {{ form_da_template.as_p }} {# Assumendo che 'form_da_template' sia la variabile del form nel contesto #}

        <button type="submit">Salva Libro</button>
    </form>

    <p style="margin-top: 20px;">
        <a href="{% url 'pizzeria_app:lista_libri' %}">Annulla e torna all'elenco</a>
    </p>
{% endblock content %}
"""

# --- Aggiungere l'URL per il Form (Rif. Esercizio 4 del README) ---
# Questo va fatto nel file `urls.py` della tua app (`pizzeria_app/urls.py`).

# TODO 3: Apri `pizzeria_app/urls.py`.
#         Aggiungi un `path` per la vista `aggiungi_libro`.
#         Esempio: `path('libri/aggiungi/', views.aggiungi_libro, name='aggiungi_libro'),`
#         Assicurati di aver importato `views` e che la vista `aggiungi_libro` esista in `views.py`.

# --- Aggiungere un Link alla Pagina del Form (Rif. Esercizio 5 del README) ---
# Questo link può essere aggiunto in `base.html` o in `lista_libri.html`.

# TODO 4: Modifica `pizzeria_app/templates/pizzeria_app/base.html` (o `lista_libri.html`).
#         Aggiungi un link nella navigazione (o in un punto appropriato) che punti alla pagina per aggiungere un libro.
#         Usa il tag `{% url %}` con il nome della rotta definito al TODO 3.
#         Esempio: `<a href="{% url 'pizzeria_app:aggiungi_libro' %}">Aggiungi Libro</a>`

print("File exercise_3_template_form.py creato.")
print("1. Crea il file `pizzeria_app/templates/pizzeria_app/aggiungi_libro.html` come da TODO 1-2.")
print("2. Modifica `pizzeria_app/urls.py` come da TODO 3.")
print("3. Modifica `base.html` o `lista_libri.html` per aggiungere un link come da TODO 4.")
print("Fai riferimento agli Esercizi 2, 4 e 5 nel README.md del Capitolo 4.")
