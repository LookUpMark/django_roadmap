# OBIETTIVO: Completare parte dell'Esercizio 1 e l'Esercizio 4 ("Crea la Vista index", "Implementa le Viste")
#            descritti nel README.md del Capitolo 3.
# COMPITO: Implementare le function-based views (FBV) `index`, `lista_libri`, e `dettaglio_libro`
#          nel file views.py della tua app (es. `pizzeria_app/views.py`).
#          Questo file serve come traccia per il contenuto di `views.py`.

# Immagina che questo sia il contenuto del tuo file `pizzeria_app/views.py`

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse

# TODO 0: Importa i modelli necessari (Autore, Libro) dal tuo file models.py.
# from .models import Autore, Libro # Decommenta e correggi se il nome dell'app è diverso

def index(request):
    # TODO 1: (Rif. Esercizio 1 del README) Implementare la vista index.
    #         Per ora, può restituire una semplice HttpResponse con un messaggio di benvenuto.
    #         Esempio: "Benvenuto nella Pizzeria App!"
    #         Oppure, se vuoi, crea un semplice template `index.html` e usa `render`.
    return HttpResponse("TODO: Implementa la vista index come da Esercizio 1 del README.")

def lista_libri(request):
    # TODO 2: (Rif. Esercizio 4 del README) Implementare la vista lista_libri.
    #         1. Recupera tutti gli oggetti Libro dal database.
    #            Suggerimento: `Libro.objects.all()`
    #            Opzionale: Ordina i libri per titolo (`.order_by('titolo')`).
    #         2. Crea un dizionario di contesto (`context`) passando la lista dei libri.
    #            Esempio: `context = {'elenco_libri': tutti_i_libri}`
    #         3. Usa la funzione `render` per restituire il template `lista_libri.html` (che creerai dopo)
    #            passando `request` e `context`.
    #            Il percorso del template sarà tipo 'pizzeria_app/lista_libri.html'.

    # Esempio di struttura (da completare):
    # tutti_i_libri = ... # Recupera i libri
    # context = {'elenco_libri': tutti_i_libri}
    # return render(request, 'pizzeria_app/lista_libri.html', context)

    return HttpResponse("TODO: Implementa la vista lista_libri per visualizzare i libri.")

def dettaglio_libro(request, libro_id): # libro_id verrà dalla URL
    # TODO 3: (Rif. Esercizio 4 del README) Implementare la vista dettaglio_libro.
    #         1. Accetta `libro_id` come argomento (oltre a `request`).
    #         2. Usa `get_object_or_404` per recuperare l'istanza di `Libro` con l'ID specificato.
    #            Passa il modello `Libro` e `pk=libro_id` a `get_object_or_404`.
    #         3. Crea un dizionario di contesto passando l'oggetto libro recuperato.
    #            Esempio: `context = {'libro_singolo': libro_recuperato}`
    #         4. Usa `render` per restituire il template `dettaglio_libro.html` (che creerai dopo)
    #            passando `request` e `context`.
    #            Il percorso del template sarà tipo 'pizzeria_app/dettaglio_libro.html'.

    # Esempio di struttura (da completare):
    # libro_recuperato = get_object_or_404(Libro, pk=libro_id)
    # context = {'libro_singolo': libro_recuperato}
    # return render(request, 'pizzeria_app/dettaglio_libro.html', context)

    return HttpResponse(f"TODO: Implementa la vista dettaglio_libro per il libro con ID: {libro_id}")


print("File exercise_1_views_fbv.py creato.")
print("Apri il file views.py della tua app ('pizzeria_app' o 'learning_logs')")
print("e definisci le funzioni index, lista_libri, e dettaglio_libro come indicato dai TODO.")
print("Fai riferimento agli Esercizi 1 e 4 nel README.md del Capitolo 3.")
