# OBIETTIVO: Completare l'Esercizio 3 ("Crea i Template") descritto nel README.md del Capitolo 3.
# COMPITO: Creare la struttura di cartelle per i template e i file HTML:
#          `base.html`, `lista_libri.html`, `dettaglio_libro.html`.
#          Utilizzare la sintassi dei template Django per l'ereditarietà, le variabili e i tag.
# Questo file è una guida descrittiva per la creazione e il contenuto dei file HTML.

# --- Struttura delle Cartelle dei Template ---

# TODO 1: All'interno della directory della tua app (es. `pizzeria_app/`), crea le seguenti cartelle:
#         `pizzeria_app/`
#             `templates/`
#                 `pizzeria_app/`  <-- Sottocartella con lo stesso nome dell'app
#
#         Questa struttura (app/templates/app_name/template.html) aiuta Django a trovare i template
#         correttamente ed evita conflitti di nomi tra app diverse.

# --- Contenuto di `base.html` ---
# Percorso: `pizzeria_app/templates/pizzeria_app/base.html`

# TODO 2: Crea il file `base.html`. Questo template definirà la struttura HTML comune.
#         Deve includere:
#         - Struttura HTML base (DOCTYPE, html, head, body).
#         - Nel <head>: un blocco `{% block title %}{% endblock title %}` per il titolo della pagina.
#           Puoi mettere un titolo di default all'interno del blocco.
#         - Nel <body>:
#             - Un header o una navbar semplice.
#             - Link di navigazione (es. alla Home e alla Lista Libri) usando il tag `{% url %}`.
#               Esempio: `<a href="{% url 'pizzeria_app:index' %}">Home</a>` (assumendo app_name='pizzeria_app')
#             - Un blocco `{% block content %}{% endblock content %}` dove verrà inserito il contenuto specifico della pagina.
#             - Un footer semplice (opzionale).
#         - Riferisciti alla Lezione Teorica del Capitolo 3 per un esempio di `base.html`.

# Esempio schematico di `base.html`:
"""
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>{% block title %}Libreria Pizzeria{% endblock title %}</title>
    {# TODO: Aggiungi eventuali CSS o altri link qui #}
</head>
<body>
    <header>
        <h1>Libreria della Pizzeria</h1>
        <nav>
            <a href="{% url 'pizzeria_app:index' %}">Home</a> |
            <a href="{% url 'pizzeria_app:lista_libri' %}">Elenco Libri</a>
            {# TODO: Aggiungi altri link se necessario #}
        </nav>
    </header>
    <hr>
    <main>
        {% block content %}
        <!-- Il contenuto specifico della pagina andrà qui -->
        {% endblock content %}
    </main>
    <hr>
    <footer>
        <p>&copy; 2023 Pizzeria Books</p>
    </footer>
</body>
</html>
"""

# --- Contenuto di `lista_libri.html` ---
# Percorso: `pizzeria_app/templates/pizzeria_app/lista_libri.html`

# TODO 3: Crea il file `lista_libri.html`.
#         Deve:
#         - Estendere `base.html` usando `{% extends "pizzeria_app/base.html" %}`.
#         - Sovrascrivere il blocco `title`.
#         - Sovrascrivere il blocco `content` per visualizzare l'elenco dei libri:
#             - Un titolo (es. "Elenco dei Nostri Libri").
#             - Usare un tag `{% if elenco_libri %}` per verificare se ci sono libri.
#             - Se ci sono libri, ciclare su `elenco_libri` con `{% for libro in elenco_libri %}`.
#                 - Per ogni `libro`, visualizzare il titolo (es. `{{ libro.titolo }}`) e l'autore
#                   (es. `{{ libro.autore.nome }} {{ libro.autore.cognome }}`).
#                 - Il titolo del libro deve essere un link alla sua pagina di dettaglio.
#                   Usa il tag `{% url %}` passando il nome della rotta URL e l'ID del libro.
#                   Esempio: `<a href="{% url 'pizzeria_app:dettaglio_libro' libro.id %}">{{ libro.titolo }}</a>`
#             - Usare `{% empty %}` nel ciclo `for` per mostrare un messaggio se non ci sono libri.
#             - Chiudere i tag `{% endfor %}` e `{% endif %}`.
#         - Riferisciti alla Lezione Teorica e all'Esercizio 3 del README.md.

# --- Contenuto di `dettaglio_libro.html` ---
# Percorso: `pizzeria_app/templates/pizzeria_app/dettaglio_libro.html`

# TODO 4: Crea il file `dettaglio_libro.html`.
#         Deve:
#         - Estendere `base.html`.
#         - Sovrascrivere il blocco `title` (es. usando `{{ libro_singolo.titolo }}`).
#         - Sovrascrivere il blocco `content` per visualizzare i dettagli del `libro_singolo`:
#             - Titolo del libro.
#             - Nome e cognome dell'autore.
#             - Data di pubblicazione (formattata, es. `{{ libro_singolo.data_pubblicazione|date:"d M Y" }}`).
#             - ISBN.
#             - Numero di pagine e prezzo (se presenti, usa `{% if %}`).
#             - Un link per tornare all'elenco dei libri (`{% url 'pizzeria_app:lista_libri' %}`).
#         - Riferisciti alla Lezione Teorica e all'Esercizio 3 del README.md.


# --- Contenuto di `index.html` (Opzionale, per la vista index) ---
# Percorso: `pizzeria_app/templates/pizzeria_app/index.html`

# TODO 5: (Opzionale, se hai scelto di usare un template per la vista `index`) Crea `index.html`.
#         Deve:
#         - Estendere `base.html`.
#         - Sovrascrivere il blocco `content` con un messaggio di benvenuto.

print("File exercise_3_templates.py creato.")
print("1. Crea la struttura di cartelle `pizzeria_app/templates/pizzeria_app/`.")
print("2. Crea i file `base.html`, `lista_libri.html`, e `dettaglio_libro.html` (e opzionalmente `index.html`)")
print("   all'interno di `pizzeria_app/templates/pizzeria_app/` con il contenuto indicato dai TODO.")
print("Fai riferimento all'Esercizio 3 nel README.md del Capitolo 3 per i dettagli e gli esempi.")
