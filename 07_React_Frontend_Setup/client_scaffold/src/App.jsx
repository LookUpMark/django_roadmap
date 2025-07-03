// OBIETTIVO: Completare l'Esercizio 4 ("Integra ListaLibri in App.js")
//            descritto nel README.md del Capitolo 7.
// COMPITO: Modificare questo file per importare e visualizzare il componente ListaLibri.

import React from 'react'; // useState e useEffect non sono necessari qui per l'esercizio base
import './App.css'; // Assicurati che App.css esista o rimuovi l'import se non usato
// TODO 1: Importare il componente ListaLibri da './components/ListaLibri.jsx'.
// import ListaLibri from './components/ListaLibri'; // Decommenta questa riga

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Libreria Full-Stack (React Frontend) - Capitolo 7</h1>
        {/* TODO 2: Rimuovere il contenuto di default di create-react-app/Vite se presente
                  (es. logo, link "Learn React", contatore).
                  Il template Vite base è già abbastanza pulito, ma verifica. */}
      </header>
      <main>
        {/* TODO 3: Includere qui il componente ListaLibri.
                  Esempio: <ListaLibri /> */}

        {/* Placeholder finché non si decommenta l'import e si usa ListaLibri */}
        <div style={{border: "2px dashed red", padding: "20px", margin: "20px", textAlign: "center"}}>
          <p>
            <strong>TODO:</strong> Decommenta l'import di <code>ListaLibri</code> e visualizza il componente <code>&lt;ListaLibri /&gt;</code> qui sotto.
          </p>
          <p>
            Modifica <code>src/App.jsx</code> e completa <code>src/components/ListaLibri.jsx</code> seguendo i TODO in entrambi i file.
          </p>
          {/* <ListaLibri /> */}
        </div>
      </main>
      <footer>
        <p>Esercizio Capitolo 7 - Setup Frontend React</p>
      </footer>
    </div>
  );
}

export default App;

// TODO 4: (Azione esterna) Avviare entrambi i server.
//         - Server Django (con API e CORS configurato): `python manage.py runserver` (nella cartella del progetto Django)
//         - Server di sviluppo React (Vite): `npm run dev` (nella cartella `07_React_Frontend_Setup/client_scaffold`)
//         Apri l'URL del server React (es. http://localhost:5173, controlla il tuo terminale Vite) nel browser.
//         Verifica che la lista dei libri (o i messaggi di caricamento/errore da ListaLibri.jsx) venga visualizzata
//         e che non ci siano errori CORS nella console del browser.
```
