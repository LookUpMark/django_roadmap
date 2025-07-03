// OBIETTIVO: Completare l'Esercizio 3 ("Configura react-router-dom") e
//            l'Esercizio 5 ("Crea Rotte Protette") descritti nel README.md del Capitolo 8.
// COMPITO: Configurare il routing per l'applicazione, includendo una rotta protetta
//          per il form di aggiunta libro.

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css'; // Assicurati che esista o rimuovi se non usato

// TODO 1: Importare i componenti necessari:
//         - ListaLibri, AggiungiLibroForm, Login, Register
//         - AuthContext per verificare l'autenticazione.
import AuthContext from './context/AuthContext';
import ListaLibri from './components/ListaLibri';
import Login from './components/Login';
import Register from './components/Register';
import AggiungiLibroForm from './components/AggiungiLibroForm';


// TODO 2: Definire il componente ProtectedRoute.
//         - Deve usare AuthContext per ottenere 'isAuthenticated' e 'caricamentoIniziale' (dall'AuthContext).
//         - Se 'caricamentoIniziale' è true, mostra un messaggio di caricamento.
//         - Se l'utente non è autenticato (e caricamentoIniziale è false), deve usare <Navigate to="/login" replace /> per reindirizzare.
//           (Opzionale: passa lo stato `location` a Navigate per reindirizzare indietro dopo il login: `state={{ from: location }}`)
//         - Altrimenti, deve renderizzare i componenti figli (puoi usare `<Outlet />` o `children` prop).
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, caricamentoIniziale } = useContext(AuthContext);
  const location = useLocation(); // Per il redirect state opzionale

  if (caricamentoIniziale) {
    return <div>Verifica autenticazione in corso...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};


function App() {
  // TODO 3: Ottenere 'isAuthenticated', 'logout' e 'caricamentoIniziale' da AuthContext.
  const { isAuthenticated, logout, caricamentoIniziale } = useContext(AuthContext);

  const handleLibroAggiunto = (nuovoLibro) => {
    console.log("Libro aggiunto dal form in App.jsx:", nuovoLibro);
    alert(`Libro "${nuovoLibro.titolo}" è stato aggiunto! (Da App.jsx)`);
    // In un'app reale, potresti voler invalidare una cache o rifare il fetch della lista libri.
  };

  // Non mostrare nulla o uno spinner finché lo stato di auth non è caricato
  if (caricamentoIniziale && !isAuthenticated) { // Modificato per non flashare se il token è già lì
     // Se il token è già in localStorage, AuthContext potrebbe impostare isAuthenticated rapidamente.
     // Questo check è più per il caso in cui ci sia una vera chiamata asincrona per validare il token.
     // Per questo esercizio, il caricamentoIniziale di AuthContext è sufficiente.
  }


  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home (Lista Libri)</Link></li>
            {/* TODO 4: Mostrare link condizionalmente basati su 'isAuthenticated':
                      - Se autenticato: Link a "Aggiungi Libro" e pulsante "Logout".
                      - Se non autenticato: Link a "Login" e "Registrati".
            */}
            {isAuthenticated ? (
              <>
                <li><Link to="/aggiungi-libro">Aggiungi Libro</Link></li>
                <li><button onClick={logout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Registrati</Link></li>
              </>
            )}
          </ul>
        </nav>

        <hr />
        <h1>Applicazione Libreria Full-Stack - Capitolo 8</h1>

        {/* TODO 5: Definire le <Routes> e le <Route>:
                  - Route per "/" che renderizza <ListaLibri />.
                  - Route per "/login" che renderizza <Login />.
                  - Route per "/register" che renderizza <Register />.
                  - Route per "/aggiungi-libro" che usa <ProtectedRoute> per renderizzare <AggiungiLibroForm />.
                    Passa la callback `handleLibroAggiunto` a AggiungiLibroForm.
        */}
        <Routes>
          <Route path="/" element={<ListaLibri />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/aggiungi-libro"
            element={
              <ProtectedRoute>
                <AggiungiLibroForm onLibroAggiunto={handleLibroAggiunto} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div><h2>Pagina Non Trovata (404)</h2><Link to="/">Torna alla Home</Link></div>} />
        </Routes>
        <p style={{marginTop: "30px", fontStyle: "italic", textAlign:"center"}}>
        (Scaffolding: Completa i TODO in tutti i file di <code>client_scaffold</code> per il Capitolo 8.)
      </p>
      </div>
    </Router>
  );
}

export default App;

// TODO 6: (Azione Esterna) Assicurarsi che AuthProvider avvolga App in main.jsx.
//          Verifica che `src/main.jsx` (o `src/index.js`) abbia:
//          import { AuthProvider } from './context/AuthContext';
//          ...
//          <React.StrictMode>
//            <AuthProvider>
//              <App />
//            </AuthProvider>
//          </React.StrictMode>
//          ...

// TODO 7: (Azione Esterna) Testare il flusso completo come descritto nell'Esercizio 6 del README.md.
//          - Registrazione, Login, Logout.
//          - Accesso a rotte protette (prima e dopo il login).
//          - Funzionalità di Aggiungi Libro (richiede autenticazione).
```
