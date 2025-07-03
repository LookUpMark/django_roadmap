# OBIETTIVO: Completare l'Esercizio 3 ("Crea la Vista aggiungi_libro") descritto nel README.md del Capitolo 4.
# COMPITO: Implementare la vista `aggiungi_libro` nel file views.py della tua app,
#          che gestisca la visualizzazione e l'elaborazione del `LibroForm`.
#          Questo file serve come traccia per il contenuto di `pizzeria_app/views.py`.

# Immagina di aggiungere questa vista al tuo file `pizzeria_app/views.py`

from django.shortcuts import render, redirect # Assicurati che redirect sia importato
# TODO 1: Importa il LibroForm dal tuo file forms.py.
# from .forms import LibroForm # Decommenta e correggi se necessario

# TODO 2: Importa il modello Libro se intendi reindirizzare alla sua pagina di dettaglio.
# from .models import Libro # Decommenta e correggi se necessario (opzionale per questo esercizio specifico)

def aggiungi_libro(request):
    # TODO 3: Gestire la richiesta POST (quando il form viene inviato).
    if request.method == 'POST':
        # TODO 3a: Creare un'istanza di LibroForm popolata con i dati della richiesta (request.POST).
        # form = LibroForm(request.POST) # Decommenta e usa

        # TODO 3b: Verificare se il form è valido usando form.is_valid().
        # if form.is_valid(): # Decommenta e usa
            # TODO 3b-i: Se il form è valido, salvarlo usando form.save().
            #            Questo creerà una nuova istanza di Libro nel database.
            # nuovo_libro = form.save() # Decommenta e usa

            # TODO 3b-ii: Reindirizzare l'utente a una pagina di successo.
            #             Generalmente si reindirizza alla lista dei libri o alla pagina di dettaglio del nuovo libro.
            #             Usa redirect() e il nome della rotta URL (es. 'pizzeria_app:lista_libri').
            #             Se vuoi reindirizzare al dettaglio: redirect('pizzeria_app:dettaglio_libro', libro_id=nuovo_libro.id)
            # return redirect('pizzeria_app:lista_libri') # Decommenta e adatta
            pass # Rimuovi questo pass quando implementi la logica POST

    # TODO 4: Gestire la richiesta GET (quando la pagina viene caricata per la prima volta).
    else: # request.method == 'GET'
        # TODO 4a: Creare un'istanza vuota di LibroForm.
        # form = LibroForm() # Decommenta e usa
        pass # Rimuovi questo pass quando implementi la logica GET

    # TODO 5: Creare il contesto.
    #         Il contesto deve contenere l'istanza del form (sia essa vuota o con errori dopo un POST non valido).
    #         Esempio: context = {'form_da_template': form}
    # context = {'form_da_template': form} # Decommenta e adatta il nome della variabile se necessario

    # TODO 6: Renderizzare il template `aggiungi_libro.html`, passando request e context.
    #         Il percorso del template sarà tipo 'pizzeria_app/aggiungi_libro.html'.
    # return render(request, 'pizzeria_app/aggiungi_libro.html', context) # Decommenta e adatta

    # Ritorno temporaneo finché non implementi la logica
    from django.http import HttpResponse
    return HttpResponse("TODO: Implementa la vista aggiungi_libro come da Esercizio 3 del README.")

print("File exercise_2_view_form_handling.py creato.")
print("Apri il file views.py della tua app ('pizzeria_app/views.py')")
print("e definisci la funzione aggiungi_libro come indicato dai TODO qui sopra.")
print("Fai riferimento all'Esercizio 3 nel README.md del Capitolo 4 per i dettagli.")
