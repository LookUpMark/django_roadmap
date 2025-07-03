# Capitolo 7: Costruire l'Interfaccia Utente con React

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Comprendere il ruolo di React in un'architettura full-stack disaccoppiata.
*   Installare Node.js e npm (Node Package Manager).
*   Creare una nuova applicazione React utilizzando `create-react-app`.
*   Comprendere la struttura di base di un progetto React (cartelle, file chiave).
*   Scrivere componenti React funzionali utilizzando JSX.
*   Utilizzare i concetti di base di React: `state` (con `useState` hook) e `props`.
*   Installare e utilizzare la libreria `axios` per effettuare chiamate HTTP (GET) alle API Django.
*   Utilizzare l'hook `useEffect` per effettuare chiamate API al caricamento del componente.
*   Visualizzare i dati ricevuti dall'API in un componente React.
*   Comprendere il problema del CORS (Cross-Origin Resource Sharing) e come configurare Django (usando `django-cors-headers`) per permettere le richieste dal server di sviluppo di React.

## Lezione Teorica

Finora abbiamo costruito il backend della nostra applicazione con Django e DRF, esponendo un'API RESTful. Ora è il momento di costruire il **frontend**, l'interfaccia utente con cui l'utente interagirà direttamente. Useremo **React**, una popolare libreria JavaScript per costruire interfacce utente.

### Perché React?

*   **Component-Based:** React permette di costruire UI complesse componendo piccoli pezzi isolati e riutilizzabili chiamati "componenti".
*   **Declarative:** Descrivi come dovrebbe apparire la tua UI in base allo stato attuale, e React si occupa di aggiornare efficientemente il DOM (Document Object Model) del browser.
*   **Virtual DOM:** React utilizza un Virtual DOM per ottimizzare gli aggiornamenti, rendendo le applicazioni veloci e reattive.
*   **Grande Ecosistema:** Ampia comunità, molte librerie di terze parti e strumenti di sviluppo.

### Installazione di Node.js e npm

React è una libreria JavaScript e per sviluppare con essa (e con la maggior parte degli strumenti moderni di frontend JavaScript), hai bisogno di:

*   **Node.js:** Un ambiente di esecuzione JavaScript lato server. Non useremo Node.js per eseguire il nostro server *di produzione* (quello è Django), ma gli strumenti di build di React e il server di sviluppo di React ne hanno bisogno.
*   **npm (Node Package Manager):** Viene installato automaticamente con Node.js. È il gestore di pacchetti per il mondo JavaScript, simile a `pip` per Python. Lo useremo per installare React, `axios`, e altre dipendenze.

**Installazione:**
Vai sul sito ufficiale di [Node.js](https://nodejs.org/) e scarica l'installer per il tuo sistema operativo. Scegli la versione **LTS (Long Term Support)**, che è generalmente la più stabile. L'installazione includerà sia Node.js sia npm.

Per verificare l'installazione, apri un nuovo terminale e digita:
```bash
node -v
npm -v
```
Dovresti vedere le versioni installate.

### Creare una Nuova Applicazione React

Il modo più semplice per iniziare un nuovo progetto React è usare `create-react-app`. È uno strumento ufficialmente supportato che configura un ambiente di sviluppo moderno con tutto il necessario.

1.  **Scegli una Posizione per il Frontend:**
    È buona pratica tenere il codice del frontend separato da quello del backend Django. All'interno della cartella principale del tuo progetto (es. `django_react_corso`), crea una nuova cartella per il frontend, ad esempio `frontend_react`:
    ```bash
    # Assumendo che tu sia nella cartella principale del progetto generale
    # (es. django_react_corso/)
    mkdir frontend_react
    cd frontend_react
    ```

2.  **Esegui `create-react-app`:**
    All'interno della cartella `frontend_react`, esegui:
    ```bash
    npx create-react-app .
    # Oppure, se preferisci un nome specifico per la sotto-cartella dell'app React:
    # npx create-react-app nome_app_react
    # e poi cd nome_app_react
    ```
    *   `npx` è uno strumento che viene con npm e permette di eseguire pacchetti npm senza installarli globalmente.
    *   `create-react-app` è il nome del pacchetto.
    *   `.` (o `nome_app_react`) è il nome della cartella dove verrà creata l'app React. Usando `.` la crea nella directory corrente (`frontend_react`).

    Questo processo potrebbe richiedere alcuni minuti, poiché scaricherà React e altre dipendenze.

### Struttura di un Progetto React (`create-react-app`)

Dopo la creazione, la struttura della tua cartella `frontend_react` (o `nome_app_react`) sarà simile a questa:

```
frontend_react/
├── node_modules/     # Contiene tutte le dipendenze JavaScript installate
├── public/           # Contiene file statici come index.html, favicon.ico
│   ├── index.html    # Il "guscio" HTML della tua app. React si inietta qui.
│   └── ...
├── src/              # Contiene il codice sorgente della tua applicazione React
│   ├── App.css       # Stili per il componente App principale
│   ├── App.js        # Il componente React principale
│   ├── App.test.js   # Test per App.js
│   ├── index.css     # Stili globali
│   ├── index.js      # Il punto di ingresso JavaScript. Renderizza App.js nel DOM.
│   ├── logo.svg
│   └── setupTests.js
├── .gitignore        # File ignorati da Git (node_modules è qui)
├── package.json      # Contiene metadati del progetto, script npm e lista delle dipendenze
└── package-lock.json # Registra le versioni esatte delle dipendenze
```

File chiave:
*   **`public/index.html`**: Questa è l'unica pagina HTML della tua Single Page Application (SPA). React modificherà dinamicamente il suo contenuto. Noterai un `<div id="root"></div>` al suo interno; è qui che React monterà la tua applicazione.
*   **`src/index.js`**: Il punto di ingresso JavaScript. Usa `ReactDOM.render()` per renderizzare il componente principale (`<App />`) all'interno del `div#root` di `index.html`.
*   **`src/App.js`**: Il componente React radice della tua applicazione. È qui che inizierai a costruire la tua UI.
*   **`package.json`**:
    *   `scripts`: Definisce comandi utili che puoi eseguire con `npm run <nome_script>` (es. `npm start`, `npm test`, `npm run build`).
    *   `dependencies` e `devDependencies`: Elencano i pacchetti npm da cui dipende il tuo progetto.

### Avviare il Server di Sviluppo React

`create-react-app` include un server di sviluppo live-reloading. Per avviarlo:
```bash
# Assicurati di essere nella directory della tua app React (es. frontend_react/)
npm start
```
Questo aprirà automaticamente la tua applicazione React nel browser, di solito all'indirizzo `http://localhost:3000/`. Ogni volta che modifichi un file sorgente in `src/`, il browser si aggiornerà automaticamente. Per fermare il server, premi `CTRL+C` nel terminale.

### Componenti React, JSX, State e Props

**1. Componenti Funzionali e JSX:**
In React, costruisci la UI usando componenti. I componenti possono essere classi o, più comunemente oggi, funzioni.

Modifica `src/App.js` per un semplice esempio:
```javascript
// src/App.js
import React from 'react'; // Importa React (necessario per JSX)
import './App.css'; // Puoi importare file CSS

function Saluto(props) { // Un semplice componente funzionale
  return <h1>Ciao, {props.nome}! Benvenuto in React.</h1>;
}

function App() { // Il componente App principale
  return (
    <div className="App">
      <header className="App-header">
        <Saluto nome="Studente" />
        <Saluto nome="Sviluppatore" />
        <p>Iniziamo a costruire la nostra interfaccia!</p>
      </header>
    </div>
  );
}

export default App; // Esporta il componente App per essere usato in index.js
```
*   **JSX (JavaScript XML):** La sintassi simile a HTML che vedi (`<h1>`, `<div className="App">`) è JSX. È un'estensione sintattica di JavaScript che permette di scrivere "HTML" direttamente nel codice JavaScript. Viene poi trascompilata (convertita) in chiamate a funzioni JavaScript (es. `React.createElement()`).
    *   Nota: `class` in HTML diventa `className` in JSX perché `class` è una parola chiave riservata in JavaScript.
*   **Componenti:** `Saluto` e `App` sono componenti funzionali. Sono funzioni JavaScript che restituiscono elementi React (descritti con JSX).
*   **Props (Proprietà):** I componenti possono ricevere dati tramite "props" (abbreviazione di properties). Nel componente `Saluto`, `props` è un oggetto che contiene gli attributi passati quando il componente viene usato (es. `<Saluto nome="Studente" />` passa `{ nome: "Studente" }` come `props`). Le props sono read-only.

**2. State (Stato) con l'Hook `useState`:**
Lo "state" è un dato che un componente può mantenere e modificare nel tempo. Quando lo state cambia, React ri-renderizza automaticamente il componente (e i suoi figli) per riflettere il nuovo stato. Gli "Hooks" (come `useState`) sono funzioni che ti permettono di "agganciarti" allo stato e al ciclo di vita di React da componenti funzionali.

```javascript
// src/App.js (esempio con state)
import React, { useState } from 'react'; // Importa useState
import './App.css';

function Contatore() {
  // Dichiara una nuova variabile di stato chiamata "conteggio"
  // useState restituisce una coppia: il valore corrente dello stato e una funzione per aggiornarlo.
  const [conteggio, setConteggio] = useState(0); // 0 è il valore iniziale

  return (
    <div>
      <p>Hai cliccato {conteggio} volte</p>
      <button onClick={() => setConteggio(conteggio + 1)}>
        Clicca qui
      </button>
      <button onClick={() => setConteggio(0)}>
        Resetta
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Esempio di State con useState</h2>
        <Contatore />
      </header>
    </div>
  );
}

export default App;
```
*   `useState(0)`: Inizializza la variabile di stato `conteggio` a `0`.
*   `setConteggio`: È la funzione usata per aggiornare il valore di `conteggio`. Chiamarla fa sì che React ri-renderizzi il componente `Contatore`.

### Effettuare Chiamate API con `axios` e `useEffect`

Per far comunicare il nostro frontend React con il backend Django, useremo `axios`, una popolare libreria basata su Promise per effettuare richieste HTTP.

**1. Installare `axios`:**
Nella directory della tua app React (es. `frontend_react/`), esegui:
```bash
npm install axios
```
Questo aggiungerà `axios` alle `dependencies` nel tuo `package.json`.

**2. L'Hook `useEffect`:**
L'hook `useEffect` permette di eseguire "effetti collaterali" (side effects) nei componenti funzionali. Gli effetti collaterali includono operazioni come il recupero dati, le sottoscrizioni, o la manipolazione manuale del DOM.

`useEffect` accetta due argomenti:
*   Una funzione che contiene la logica dell'effetto.
*   Un array di dipendenze (opzionale):
    *   Se omesso, l'effetto viene eseguito dopo ogni render.
    *   Se è un array vuoto (`[]`), l'effetto viene eseguito solo una volta dopo il primo render (simile a `componentDidMount` nelle classi).
    *   Se contiene variabili (`[variabile1, variabile2]`), l'effetto viene eseguito dopo il primo render e ogni volta che una di queste dipendenze cambia.

**3. Esempio: Recuperare e Visualizzare Libri dall'API Django:**
Creiamo un nuovo componente `ListaLibri.js` in `src/`:

`src/components/ListaLibri.js` (crea la cartella `components` se non esiste)
```javascript
// src/components/ListaLibri.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa axios

function ListaLibri() {
  const [libri, setLibri] = useState([]); // Stato per memorizzare la lista dei libri
  const [errore, setErrore] = useState(null); // Stato per eventuali errori
  const [caricamento, setCaricamento] = useState(true); // Stato per indicare il caricamento

  useEffect(() => {
    // Definisci una funzione asincrona per recuperare i dati
    const fetchLibri = async () => {
      try {
        // Assicurati che l'URL punti al tuo endpoint API DRF
        // Potrebbe essere /logs/api/libri/ se il server Django è sulla stessa origine
        // o l'URL completo se sono su origini diverse (es. http://localhost:8000/logs/api/libri/)
        const response = await axios.get('http://127.0.0.1:8000/logs/api/libri/');
        setLibri(response.data); // Imposta i dati dei libri nello stato
      } catch (err) {
        setErrore(err.message); // Imposta il messaggio di errore
        console.error("Errore nel fetch dei libri:", err);
      } finally {
        setCaricamento(false); // Imposta caricamento a false in ogni caso
      }
    };

    fetchLibri(); // Chiama la funzione per recuperare i dati

    // L'array di dipendenze vuoto [] significa che questo effetto viene eseguito solo una volta
    // dopo il primo render del componente, simile a componentDidMount.
  }, []);

  if (caricamento) {
    return <p>Caricamento libri in corso...</p>;
  }

  if (errore) {
    return <p>Errore nel caricamento dei libri: {errore}</p>;
  }

  return (
    <div>
      <h2>Elenco dei Libri dal Backend</h2>
      {libri.length > 0 ? (
        <ul>
          {libri.map(libro => (
            <li key={libro.id}>
              <strong>{libro.titolo}</strong> (ISBN: {libro.isbn})
              {/* Qui potresti voler mostrare più dettagli, come l'autore.
                  Se 'libro.autore' è solo un ID, dovrai fare un'altra chiamata
                  o modificare il serializer DRF per annidare i dati dell'autore. */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessun libro trovato.</p>
      )}
    </div>
  );
}

export default ListaLibri;
```

Ora usa questo componente in `src/App.js`:
```javascript
// src/App.js
import React from 'react';
import './App.css';
import ListaLibri from './components/ListaLibri'; // Importa il nuovo componente

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>La Mia Libreria Full-Stack</h1>
      </header>
      <main>
        <ListaLibri />
      </main>
    </div>
  );
}

export default App;
```

### Gestire CORS (Cross-Origin Resource Sharing)

Quando il tuo frontend React (es. in esecuzione su `http://localhost:3000`) prova a fare una richiesta API al tuo backend Django (es. in esecuzione su `http://localhost:8000`), il browser bloccherà la richiesta per motivi di sicurezza. Questo è dovuto alla **Same-Origin Policy**.

Per permettere a React di comunicare con Django, devi configurare **CORS** sul server Django. La libreria `django-cors-headers` lo rende facile.

1.  **Installa `django-cors-headers` nel tuo ambiente virtuale Django:**
    ```bash
    pip install django-cors-headers
    ```

2.  **Aggiungi `corsheaders` a `INSTALLED_APPS` in `myproject/settings.py` (Django):**
    Assicurati che sia posizionato prima di app che potrebbero gestire richieste, come `django.middleware.common.CommonMiddleware` se lo usi.
    ```python
    # myproject/settings.py
    INSTALLED_APPS = [
        # ...
        'corsheaders', # Aggiungi corsheaders
        'rest_framework',
        'rest_framework.authtoken',
        'learning_logs',
        # ...
    ]
    ```

3.  **Aggiungi `CorsMiddleware` a `MIDDLEWARE` in `myproject/settings.py`:**
    È importante posizionarlo il più in alto possibile, specialmente prima di middleware che generano risposte, come `CommonMiddleware`.
    ```python
    # myproject/settings.py
    MIDDLEWARE = [
        'corsheaders.middleware.CorsMiddleware', # Aggiungi questo
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    ]
    ```

4.  **Configura le Origini Consentite:**
    Devi specificare quali origini (domini frontend) sono autorizzate a fare richieste.
    In `myproject/settings.py`:
    ```python
    # myproject/settings.py

    # Per lo sviluppo, puoi permettere l'origine del server di sviluppo React:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000", # L'URL del tuo server di sviluppo React
        "http://127.0.0.1:3000",
    ]

    # In alternativa, per lo sviluppo, puoi permettere tutte le origini (meno sicuro per produzione):
    # CORS_ALLOW_ALL_ORIGINS = True # Non raccomandato per produzione

    # Puoi anche usare CORS_ALLOWED_ORIGIN_REGEXES per pattern più complessi.

    # Opzionale: specifica quali header non standard sono permessi
    # CORS_ALLOW_HEADERS = list(default_headers) + [
    #     'my-custom-header',
    # ]
    ```
    Per lo sviluppo, `CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]` è una buona scelta. In produzione, dovrai sostituirlo con il dominio effettivo del tuo frontend deployato.

Dopo aver configurato `django-cors-headers` e riavviato il server Django, il tuo frontend React su `localhost:3000` dovrebbe essere in grado di effettuare chiamate API al backend Django su `localhost:8000` senza errori CORS.

## Esercizi Pratici

1.  **Setup Ambiente Frontend:**
    *   Assicurati di avere Node.js e npm installati.
    *   Crea una cartella `frontend_react` (o un nome simile) al livello principale del tuo progetto (accanto alla cartella del progetto Django `myproject`).
    *   All'interno di `frontend_react`, inizializza una nuova applicazione React usando `npx create-react-app .`.
    *   Avvia il server di sviluppo React con `npm start` e assicurati di vedere la pagina di benvenuto di React.
2.  **Configura CORS in Django:**
    *   Nel tuo progetto Django (`myproject`):
        *   Installa `django-cors-headers`.
        *   Aggiungi `'corsheaders'` a `INSTALLED_APPS`.
        *   Aggiungi `'corsheaders.middleware.CorsMiddleware'` all'inizio di `MIDDLEWARE`.
        *   Configura `CORS_ALLOWED_ORIGINS` in `settings.py` per includere `"http://localhost:3000"`.
        *   Riavvia il server Django.
3.  **Crea il Componente `ListaLibri` in React:**
    *   Nella tua app React, crea una nuova cartella `src/components/`.
    *   All'interno di `src/components/`, crea un file `ListaLibri.js`.
    *   Nel componente `ListaLibri`:
        *   Importa `React`, `useState`, `useEffect` da `'react'` e `axios` da `'axios'`.
        *   Usa `useState` per creare variabili di stato per `libri` (array vuoto), `caricamento` (booleano, iniziale `true`), ed `errore` (null iniziale).
        *   Usa `useEffect` per effettuare una chiamata API `GET` all'endpoint `/logs/api/libri/` del tuo backend Django (assicurati che l'URL sia corretto, es. `http://127.0.0.1:8000/logs/api/libri/`).
            *   All'interno di `useEffect`, gestisci la risposta: se ha successo, aggiorna lo stato `libri` con i dati ricevuti e imposta `caricamento` a `false`.
            *   In caso di errore, aggiorna lo stato `errore` con il messaggio di errore e imposta `caricamento` a `false`.
            *   Ricorda di passare un array di dipendenze vuoto (`[]`) a `useEffect` per eseguirlo solo una volta.
        *   Nel return del componente:
            *   Se `caricamento` è `true`, mostra un messaggio "Caricamento...".
            *   Se `errore` non è `null`, mostra il messaggio di errore.
            *   Altrimenti, mappa l'array `libri` per visualizzare il titolo e l'ISBN di ogni libro in una lista `<ul>`.
4.  **Integra `ListaLibri` in `App.js`:**
    *   In `src/App.js`, importa il componente `ListaLibri`.
    *   Sostituisci il contenuto di default di `App.js` per includere un titolo per la tua applicazione e il componente `ListaLibri`.
5.  **Testa il Tutto:**
    *   Assicurati che sia il server Django (con le API e CORS configurato) sia il server di sviluppo React (`npm start`) siano in esecuzione.
    *   Apri `http://localhost:3000` nel tuo browser.
    *   Dovresti vedere il titolo della tua applicazione e, dopo un breve momento di caricamento, la lista dei libri recuperata dal tuo backend Django.
    *   Controlla la console del browser per eventuali errori (specialmente errori CORS se non configurato correttamente, o errori di rete).
    *   Prova ad aggiungere/modificare libri tramite l'API DRF (usando la Browsable API o Postman) e ricarica la pagina React per vedere se la lista si aggiorna.
```
