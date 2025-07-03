# OBIETTIVO: Completare l'Esercizio 1 ("Crea LibroForm") descritto nel README.md del Capitolo 4.
# COMPITO: Creare la classe LibroForm come ModelForm nel file forms.py della tua app.
#          Questo file serve come traccia per il contenuto di `pizzeria_app/forms.py`.

# Crea un nuovo file `forms.py` nella tua app (es. `pizzeria_app/forms.py`)
# Immagina che questo sia il contenuto del tuo nuovo file `pizzeria_app/forms.py`

from django import forms
# TODO 1: Importa il modello Libro dal tuo file models.py.
# from .models import Libro # Decommenta e correggi se necessario

class LibroForm(forms.ModelForm):
    # TODO 2: Definire la classe Meta interna.
    class Meta:
        # TODO 2a: Specificare il modello su cui si basa il form (model = Libro).
        model = None # Sostituisci None con il modello Libro importato

        # TODO 2b: Specificare i campi da includere nel form.
        #           La lista deve contenere: 'titolo', 'autore', 'data_pubblicazione',
        #           'isbn', 'numero_pagine', 'prezzo'.
        fields = [] # Sostituisci [] con la lista dei nomi dei campi

        # TODO 2c: (Opzionale ma raccomandato) Personalizzare le etichette (labels).
        #           Crea un dizionario `labels` per cambiare le etichette di default.
        #           Esempio: labels = {'data_pubblicazione': 'Data di Pubblicazione (YYYY-MM-DD)'}
        labels = {
            # 'data_pubblicazione': 'Data di Pubblicazione (Formato YYYY-MM-DD)',
            # 'numero_pagine': 'Numero Totale di Pagine',
        }

        # TODO 2d: (Opzionale ma raccomandato) Personalizzare i widget.
        #           Crea un dizionario `widgets` per cambiare i widget di default.
        #           Esempio: Usare `forms.DateInput` con `attrs={'type': 'date'}` per `data_pubblicazione`.
        widgets = {
            # 'data_pubblicazione': forms.DateInput(attrs={'type': 'date', 'placeholder': 'YYYY-MM-DD'}),
            # 'isbn': forms.TextInput(attrs={'placeholder': 'Es. 978-xxxxxxxxxx'}),
        }

    # TODO 3: (Opzionale ma richiesto dall'esercizio) Aggiungere una validazione personalizzata per il campo ISBN.
    #         Definire un metodo `clean_isbn(self)`.
    #         Questo metodo deve:
    #         - Ottenere il valore dell'ISBN da `self.cleaned_data`.
    #         - Rimuovere eventuali trattini ('-') dall'ISBN.
    #         - Verificare che l'ISBN pulito sia composto solo da cifre.
    #         - Verificare che la lunghezza dell'ISBN pulito sia 10 o 13.
    #         - Se una delle validazioni fallisce, sollevare `forms.ValidationError` con un messaggio appropriato.
    #         - Se tutte le validazioni passano, restituire l'ISBN pulito (senza trattini).
    #         - Riferisciti alla Lezione Teorica del Capitolo 4 per un esempio.
    def clean_isbn(self):
        isbn_value = self.cleaned_data.get('isbn')
        if isbn_value:
            # isbn_pulito = isbn_value.replace('-', '')
            # if not isbn_pulito.isdigit():
            #     raise forms.ValidationError("L'ISBN deve contenere solo cifre.")
            # if not (len(isbn_pulito) == 10 or len(isbn_pulito) == 13):
            #     raise forms.ValidationError("L'ISBN deve essere di 10 o 13 cifre.")
            # return isbn_pulito # Restituisci l'ISBN pulito
            pass # Rimuovi 'pass' e implementa la logica
        return isbn_value # Restituisci il valore originale se non presente o se la logica non è implementata

print("File exercise_1_libro_form.py creato.")
print("Crea un nuovo file forms.py nella directory della tua app ('pizzeria_app/forms.py').")
print("Definisci la classe LibroForm come indicato dai TODO qui sopra.")
print("Fai riferimento all'Esercizio 1 nel README.md del Capitolo 4 per i dettagli.")
