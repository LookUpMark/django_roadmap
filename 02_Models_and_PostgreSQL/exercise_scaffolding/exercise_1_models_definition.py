# OBIETTIVO: Completare l'Esercizio 4 ("Definisci i Modelli") descritto nel README.md del Capitolo 2.
# COMPITO: Definire i modelli Django 'Autore' e 'Libro' nel file models.py dell'app 'learning_logs'
#          (o 'pizzeria_app' se hai seguito lo scaffolding del Capitolo 1).
#          Questo file serve come traccia per ciò che dovrai scrivere in `models.py`.

# Immagina che questo sia il contenuto del tuo file `pizzeria_app/models.py` (o `learning_logs/models.py`)

from django.db import models

class Autore(models.Model):
    # TODO 1: Definire il campo 'nome'.
    #         Deve essere un CharField con max_length=100.
    #         Riferisciti alla Lezione Teorica e all'Esercizio 4 del README.md.
    nome = None # Sostituisci None con la definizione corretta del campo.

    # TODO 2: Definire il campo 'cognome'.
    #         Deve essere un CharField con max_length=100.
    cognome = None # Sostituisci None con la definizione corretta del campo.

    # TODO 3: Definire il campo 'data_nascita'.
    #         Deve essere un DateField.
    #         Deve permettere valori NULL nel database (null=True).
    #         Deve permettere che il campo sia vuoto nei form (blank=True).
    data_nascita = None # Sostituisci None con la definizione corretta del campo.

    def __str__(self):
        # TODO 4: Implementare il metodo __str__ per ritornare nome e cognome dell'autore.
        # Esempio: "Mario Rossi"
        return f"{self.nome} {self.cognome}" # Modifica se necessario dopo aver definito i campi

class Libro(models.Model):
    # TODO 5: Definire il campo 'titolo'.
    #         Deve essere un CharField con max_length=200.
    titolo = None # Sostituisci None con la definizione corretta del campo.

    # TODO 6: Definire il campo 'autore' come ForeignKey al modello Autore.
    #         Quando un Autore viene eliminato, i suoi libri devono essere eliminati (CASCADE).
    #         Impostare 'related_name' a 'libri' per l'accesso inverso.
    autore = None # Sostituisci None con la definizione corretta del campo.

    # TODO 7: Definire il campo 'data_pubblicazione'.
    #         Deve essere un DateField.
    data_pubblicazione = None # Sostituisci None con la definizione corretta del campo.

    # TODO 8: Definire il campo 'isbn'.
    #         Deve essere un CharField con max_length=13.
    #         Deve essere unico (unique=True).
    isbn = None # Sostituisci None con la definizione corretta del campo.

    # TODO 9: Definire il campo 'numero_pagine'.
    #         Deve essere un IntegerField.
    #         Deve permettere valori NULL e blank.
    numero_pagine = None # Sostituisci None con la definizione corretta del campo.

    # TODO 10: Definire il campo 'prezzo'.
    #          Deve essere un DecimalField.
    #          max_digits=6, decimal_places=2.
    #          Deve permettere valori NULL e blank.
    prezzo = None # Sostituisci None con la definizione corretta del campo.

    def __str__(self):
        # TODO 11: Implementare il metodo __str__ per ritornare il titolo del libro.
        return self.titolo # Modifica se necessario dopo aver definito il campo titolo

# NOTA: Dopo aver definito questi modelli nel tuo vero file `models.py`,
#       dovrai creare ed eseguire le migrazioni.

print("File exercise_1_models_definition.py creato.")
print("Apri il file models.py della tua app ('pizzeria_app' o 'learning_logs')")
print("e definisci le classi Autore e Libro come indicato dai TODO qui sopra.")
print("Fai riferimento all'Esercizio 4 nel README.md del Capitolo 2.")
