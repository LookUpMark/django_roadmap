# OBIETTIVO: Completare l'Esercizio 2 ("Crea i Serializer") descritto nel README.md del Capitolo 5.
# COMPITO: Creare AutoreSerializer e LibroSerializer nel file serializers.py della tua app.
#          Questo file serve come traccia per il contenuto di `pizzeria_app/serializers.py`.

# Crea un nuovo file `serializers.py` nella tua app (es. `pizzeria_app/serializers.py`)
# Immagina che questo sia il contenuto del tuo nuovo file `pizzeria_app/serializers.py`

from rest_framework import serializers
# TODO 1: Importa i modelli Autore e Libro dal tuo file models.py.
# from .models import Autore, Libro # Decommenta e correggi se necessario

class AutoreSerializer(serializers.ModelSerializer):
    # TODO 2: Definire la classe Meta interna per AutoreSerializer.
    class Meta:
        # TODO 2a: Specificare il modello (model = Autore).
        model = None # Sostituisci None con il modello Autore importato

        # TODO 2b: Specificare i campi da includere.
        #           La lista deve contenere: 'id', 'nome', 'cognome', 'data_nascita'.
        fields = [] # Sostituisci [] con la lista dei campi

class LibroSerializer(serializers.ModelSerializer):
    # TODO 3: (Opzionale Avanzato, per ora lascia il default) Gestire la rappresentazione del campo 'autore'.
    #         Per l'esercizio base, DRF gestirà 'autore' come un ID (PrimaryKeyRelatedField).
    #         Se vuoi esplorare alternative (come mostrato nella Lezione Teorica):
    #         - Serializer annidato: `autore = AutoreSerializer(read_only=True)`
    #         - StringRelatedField: `autore = serializers.StringRelatedField()`
    #         Per ora, non è necessario aggiungere nulla qui per il campo 'autore' per l'esercizio base.

    # TODO 4: Definire la classe Meta interna per LibroSerializer.
    class Meta:
        # TODO 4a: Specificare il modello (model = Libro).
        model = None # Sostituisci None con il modello Libro importato

        # TODO 4b: Specificare i campi da includere.
        #           La lista deve contenere: 'id', 'titolo', 'autore', 'data_pubblicazione',
        #           'isbn', 'numero_pagine', 'prezzo'.
        fields = [] # Sostituisci [] con la lista dei campi

        # TODO 4c: (Opzionale Avanzato) Se vuoi usare un serializer annidato per 'autore' in lettura
        #           e un ID per la scrittura, dovrai configurarlo in modo più complesso.
        #           Per l'esercizio base, questo non è richiesto. Lasciare 'autore' nei fields
        #           farà sì che si aspetti un ID in input e restituisca un ID in output.

# TODO 5: (Azione esterna a questo file) Installare Django REST Framework.
#         Nel tuo terminale, con l'ambiente virtuale attivo:
#         pip install djangorestframework
#         Aggiungilo a requirements.txt: pip freeze > requirements.txt

# TODO 6: (Azione esterna a questo file) Aggiungere 'rest_framework' a INSTALLED_APPS.
#         Modifica `myproject_exercise/settings.py` e aggiungi 'rest_framework' alla lista.

print("File exercise_1_serializers.py creato.")
print("1. Esegui i TODO 5 e 6 nel terminale e in settings.py.")
print("2. Crea un nuovo file serializers.py nella directory della tua app ('pizzeria_app/serializers.py').")
print("3. Definisci le classi AutoreSerializer e LibroSerializer come indicato dai TODO qui sopra.")
print("Fai riferimento all'Esercizio 2 nel README.md del Capitolo 5 per i dettagli.")
