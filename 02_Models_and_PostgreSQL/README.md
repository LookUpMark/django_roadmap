# Capitolo 2: Modelli Django e Integrazione con PostgreSQL

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Comprendere il concetto di ORM (Object-Relational Mapper) in Django.
*   Definire modelli di dati in `models.py` utilizzando vari tipi di campo.
*   Capire i vantaggi di utilizzare PostgreSQL come database per applicazioni Django.
*   Installare il driver `psycopg2-binary` per connettere Django a PostgreSQL.
*   Configurare `settings.py` per utilizzare un database PostgreSQL locale.
*   Comprendere e utilizzare il sistema di migrazioni di Django (`makemigrations` e `migrate`).
*   Registrare i modelli nell'interfaccia di Amministrazione di Django e utilizzarla per interagire con i dati.

## Lezione Teorica

### L'ORM di Django: Interagire con il Database tramite Python

Un **Object-Relational Mapper (ORM)** è una tecnica di programmazione che permette di interrogare e manipolare dati da un database utilizzando un linguaggio di programmazione orientato agli oggetti (come Python) invece di scrivere direttamente query SQL. Django include un potente ORM integrato.

Vantaggi dell'uso dell'ORM di Django:

*   **Produttività:** Scrivi codice Python invece di SQL, il che può essere più veloce e intuitivo per molti sviluppatori.
*   **Astrazione dal Database:** L'ORM gestisce le differenze tra i vari sistemi di database (SQLite, PostgreSQL, MySQL, ecc.). In teoria, puoi cambiare database con modifiche minime al codice.
*   **Sicurezza:** Aiuta a prevenire attacchi di tipo SQL injection, poiché le query sono costruite in modo sicuro.
*   **Integrazione:** Si integra perfettamente con il resto del framework Django, come i form e l'interfaccia di amministrazione.

In Django, un **modello** è una classe Python che eredita da `django.db.models.Model`. Ogni attributo della classe modello rappresenta un campo del database (una colonna della tabella). Django usa questi modelli per creare automaticamente lo schema del database e per fornire un'API per accedere ai dati.

### Definire un Modello

I modelli sono definiti nel file `models.py` della tua applicazione Django. Ecco un esempio di come definire due modelli, `Autore` e `Libro`, con una relazione tra loro:

```python
# nome_della_app/models.py
from django.db import models

class Autore(models.Model):
    nome = models.CharField(max_length=100)
    cognome = models.CharField(max_length=100)
    data_nascita = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.nome} {self.cognome}"

class Libro(models.Model):
    titolo = models.CharField(max_length=200)
    autore = models.ForeignKey(Autore, on_delete=models.CASCADE, related_name='libri')
    data_pubblicazione = models.DateField()
    isbn = models.CharField(max_length=13, unique=True)
    numero_pagine = models.IntegerField(null=True, blank=True)
    prezzo = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.titolo
```

Analizziamo alcuni aspetti:

*   **`from django.db import models`**: Importa il modulo necessario.
*   **`class Autore(models.Model):`**: Ogni modello è una classe che eredita da `models.Model`.
*   **Campi del Modello**:
    *   `CharField`: Per stringhe di testo di piccole e medie dimensioni. `max_length` è obbligatorio.
    *   `DateField`: Per le date. `null=True` permette al campo di essere vuoto nel database. `blank=True` permette al campo di essere vuoto nei form.
    *   `ForeignKey`: Definisce una relazione "molti-a-uno". Un `Libro` ha un `Autore`, ma un `Autore` può avere molti `Libri`.
        *   `Autore`: Il modello a cui è collegato.
        *   `on_delete=models.CASCADE`: Specifica cosa succede quando l'oggetto `Autore` referenziato viene eliminato. `CASCADE` significa che se un autore viene eliminato, anche tutti i suoi libri verranno eliminati. Altre opzioni includono `SET_NULL`, `PROTECT`, ecc.
        *   `related_name='libri'`: Permette di accedere ai libri di un autore dall'oggetto autore stesso (es. `mio_autore.libri.all()`).
    *   `IntegerField`: Per numeri interi.
    *   `DecimalField`: Per numeri decimali a precisione fissa. `max_digits` è il numero totale di cifre, `decimal_places` è il numero di cifre decimali.
    *   `unique=True`: Assicura che il valore di questo campo sia unico in tutta la tabella.
*   **`__str__(self)`**: È un metodo speciale che definisce come un oggetto modello deve essere rappresentato come stringa. È utile per la visualizzazione nell'Admin di Django e nel debug.

### Introduzione a PostgreSQL

Mentre Django funziona bene con SQLite per lo sviluppo (ed è il default), **PostgreSQL** (spesso chiamato "Postgres") è un sistema di gestione di database relazionale open-source potente, affidabile e ricco di funzionalità, molto popolare per le applicazioni in produzione.

Perché PostgreSQL è una buona scelta:

*   **Robustezza e Affidabilità:** È noto per la sua stabilità e integrità dei dati.
*   **Scalabilità:** Gestisce bene grandi quantità di dati e carichi di lavoro elevati.
*   **Funzionalità Avanzate:** Supporta tipi di dati complessi, full-text search, transazioni ACID, e molte estensioni.
*   **Conformità SQL:** Aderisce strettamente agli standard SQL.
*   **Comunità Attiva:** Ha una vasta e attiva comunità di sviluppatori.

### Installare `psycopg2-binary`

Per permettere a Django di comunicare con un database PostgreSQL, hai bisogno di un "driver" o "adattatore" Python. Il più comune è `psycopg2`.

Con il tuo ambiente virtuale attivo, installalo:

```bash
pip install psycopg2-binary
```

**Nota:** `psycopg2-binary` è un pacchetto che include le dipendenze precompilate, rendendo l'installazione più semplice su molte piattaforme. Per alcuni sistemi operativi o per compilare da sorgente, potresti aver bisogno di installare `psycopg2` e le sue dipendenze di sistema (come `libpq-dev` e `python3-dev` su sistemi Debian/Ubuntu).

### Configurare `settings.py` per PostgreSQL

Dopo aver installato `psycopg2-binary`, devi dire a Django come connettersi al tuo database PostgreSQL. Questo si fa modificando la sezione `DATABASES` nel file `settings.py` del tuo progetto.

Prima di tutto, assicurati di avere un server PostgreSQL in esecuzione e di aver creato un database per il tuo progetto. I passaggi per installare PostgreSQL e creare un database variano a seconda del sistema operativo.

Supponiamo che tu abbia:
*   Un server PostgreSQL in esecuzione sulla tua macchina locale (localhost).
*   Creato un utente PostgreSQL (es. `mio_utente_db`) con una password (es. `mia_password_db`).
*   Creato un database vuoto (es. `mio_database_django`).

Ecco come potrebbe apparire la configurazione in `nome_del_progetto/settings.py`:

```python
# nome_del_progetto/settings.py

# ... altre impostazioni ...

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mio_database_django',    # Nome del tuo database PostgreSQL
        'USER': 'mio_utente_db',         # Nome utente PostgreSQL
        'PASSWORD': 'mia_password_db',   # Password utente PostgreSQL
        'HOST': 'localhost',               # O l'indirizzo del tuo server DB se non è locale
        'PORT': '5432',                  # Porta standard di PostgreSQL
    }
}

# ... altre impostazioni ...
```

**Importante per la sicurezza:** Non inserire mai credenziali sensibili (come password del database) direttamente nel codice sorgente che viene versionato (es. con Git). In produzione, queste dovrebbero essere gestite tramite variabili d'ambiente o file di configurazione non versionati. Per ora, per lo sviluppo locale, questa configurazione è accettabile.

### Il Sistema di Migrazioni di Django

Dopo aver definito o modificato i tuoi modelli, o dopo aver cambiato la configurazione del database, devi applicare queste modifiche allo schema del database. Django gestisce questo processo tramite un sistema di **migrazioni**.

Le migrazioni sono file Python che descrivono le modifiche da apportare allo schema del database.

I comandi principali per le migrazioni sono:

1.  **`python manage.py makemigrations [nome_app]`**:
    *   Questo comando analizza i tuoi file `models.py` (opzionalmente solo per `nome_app` specificato) e confronta lo stato attuale dei modelli con l'ultimo stato registrato nelle migrazioni esistenti.
    *   Se rileva delle modifiche (nuovi modelli, campi aggiunti/rimossi/modificati), crea un nuovo file di migrazione nella cartella `migrations` della tua app. Questo file contiene il codice Python per applicare tali modifiche.

2.  **`python manage.py migrate [nome_app] [nome_migrazione]`**:
    *   Questo comando applica le migrazioni non ancora applicate al database.
    *   Esegue il codice contenuto nei file di migrazione per modificare effettivamente lo schema del database (creare tabelle, aggiungere colonne, ecc.).
    *   Django tiene traccia di quali migrazioni sono state applicate in una tabella speciale nel database chiamata `django_migrations`.
    *   Se non specifichi `nome_app` o `nome_migrazione`, Django applicherà tutte le migrazioni non applicate di tutte le app.

Il flusso di lavoro tipico è:
1.  Definisci o modifica i modelli in `models.py`.
2.  Esegui `python manage.py makemigrations nome_della_tua_app`.
3.  Controlla il file di migrazione generato (opzionale, ma buono per capire cosa sta succedendo).
4.  Esegui `python manage.py migrate` per applicare le modifiche al database.

### L'Admin di Django

Django include un'interfaccia di amministrazione (Admin) potente e pronta all'uso. È un'applicazione web che ti permette di visualizzare, creare, modificare ed eliminare record dai tuoi modelli, senza dover scrivere codice aggiuntivo per l'interfaccia.

Per utilizzare l'Admin:

1.  **Crea un Superutente:**
    Se non l'hai ancora fatto, devi creare un utente amministratore (superuser) per poter accedere all'Admin.
    ```bash
    python manage.py createsuperuser
    ```
    Ti verranno chiesti un nome utente, un indirizzo email e una password.

2.  **Registra i Modelli:**
    Per rendere i tuoi modelli gestibili tramite l'Admin, devi registrarli nel file `admin.py` della tua applicazione.

    ```python
    # nome_della_app/admin.py
    from django.contrib import admin
    from .models import Autore, Libro # Importa i tuoi modelli

    admin.site.register(Autore)
    admin.site.register(Libro)
    ```
    Esistono modi più avanzati per personalizzare come i modelli appaiono e si comportano nell'Admin usando le classi `ModelAdmin`, ma `admin.site.register(NomeModello)` è il modo più semplice per iniziare.

3.  **Accedi all'Admin:**
    *   Avvia il server di sviluppo: `python manage.py runserver`.
    *   Apri il browser e vai all'URL `/admin/` (es. `http://127.0.0.1:8000/admin/`).
    *   Effettua il login con le credenziali del superutente che hai creato.
    *   Dovresti vedere i tuoi modelli registrati e poter interagire con i loro dati.

L'Admin è uno strumento incredibilmente utile per lo sviluppo e la gestione dei contenuti.

## Esercizi Pratici

1.  **Prepara PostgreSQL:**
    *   Assicurati di avere PostgreSQL installato e in esecuzione sulla tua macchina.
    *   Crea un nuovo utente PostgreSQL (se non ne hai già uno dedicato per lo sviluppo).
    *   Crea un nuovo database vuoto per questo progetto (es. `dpr_learning_db`).
2.  **Installa `psycopg2-binary`:**
    *   Attiva il tuo ambiente virtuale (se non è già attivo).
    *   Installa `psycopg2-binary` usando `pip`.
3.  **Configura `settings.py`:**
    *   Nel tuo progetto Django (`myproject` dal Capitolo 1), modifica il file `myproject/settings.py`.
    *   Aggiorna la sezione `DATABASES` per connetterti al tuo database PostgreSQL, usando le credenziali e il nome del database che hai creato al punto 1.
4.  **Definisci i Modelli:**
    *   Nell'app `learning_logs` (creata nel Capitolo 1), apri il file `models.py`.
    *   Definisci i modelli `Autore` e `Libro` come mostrato nell'esempio della lezione teorica. Assicurati di includere i metodi `__str__` per entrambi.
5.  **Esegui le Migrazioni:**
    *   Nel terminale, naviga nella directory del progetto (`myproject`).
    *   Esegui `python manage.py makemigrations learning_logs`. Dovresti vedere che Django ha rilevato i tuoi nuovi modelli e creato un file di migrazione (es. `0001_initial.py`) nella cartella `learning_logs/migrations/`.
    *   Esegui `python manage.py migrate`. Questo applicherà le migrazioni, creando le tabelle `learning_logs_autore` e `learning_logs_libro` nel tuo database PostgreSQL. Puoi verificarlo usando uno strumento di gestione di PostgreSQL (come `psql` o pgAdmin).
6.  **Crea un Superutente:**
    *   Esegui `python manage.py createsuperuser` e segui le istruzioni per creare un account amministratore.
7.  **Registra i Modelli nell'Admin:**
    *   Apri il file `learning_logs/admin.py`.
    *   Importa i modelli `Autore` e `Libro` da `.models`.
    *   Registra entrambi i modelli usando `admin.site.register()`.
8.  **Esplora l'Admin:**
    *   Avvia il server di sviluppo: `python manage.py runserver`.
    *   Vai a `http://127.0.0.1:8000/admin/` nel tuo browser.
    *   Effettua il login con le credenziali del superutente.
    *   Dovresti vedere le sezioni "Autores" e "Libros". Prova ad aggiungere alcuni autori e alcuni libri attraverso l'interfaccia Admin. Nota come la `ForeignKey` per l'autore nel form del libro ti permette di selezionare un autore esistente.
```
