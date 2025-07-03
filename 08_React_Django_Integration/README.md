# Capitolo 8: Integrazione Full-Stack e Autenticazione React-Django

## Obiettivi di Apprendimento

Dopo aver completato questo capitolo, sarai in grado di:

*   Creare form in React per inviare dati (POST) agli endpoint API di Django (es. per creare nuovi libri).
*   Gestire lo stato di autenticazione in un'applicazione React (sapere se un utente è loggato o meno).
*   Implementare un flusso di login in React:
    *   Inviare credenziali all'endpoint di login dell'API DRF.
    *   Ricevere e salvare il token di autenticazione (es. in `localStorage`).
*   Includere il token di autenticazione nelle intestazioni (headers) delle richieste API protette da React verso Django.
*   Implementare un flusso di registrazione utente da React.
*   Implementare un flusso di logout in React (rimuovere il token).
*   Utilizzare il Context API di React per gestire globalmente lo stato di autenticazione.
*   Implementare il routing lato client con `react-router-dom` per navigare tra diverse "pagine" nell'applicazione React.
*   Creare "rotte protette" in React accessibili solo agli utenti autenticati.

## Lezione Teorica

In questo capitolo uniremo il frontend React con il backend Django/DRF in modo più completo, concentrandoci sull'interazione con gli endpoint API che richiedono dati (POST) e sull'autenticazione.

### Creare Form in React per Inviare Dati (POST)

Similmente a come abbiamo recuperato dati (GET), possiamo inviare dati (POST) usando `axios`.

**Esempio: Form per Aggiungere un Nuovo Libro**

1.  **Crea il Componente Form (`AggiungiLibroForm.js`):**
    `src/components/AggiungiLibroForm.js`
    ```javascript
    // src/components/AggiungiLibroForm.js
    import React, { useState, useEffect } from 'react';
    import axios from 'axios';

    function AggiungiLibroForm({ onLibroAggiunto }) {
      const [titolo, setTitolo] = useState('');
      const [isbn, setIsbn] = useState('');
      const [dataPubblicazione, setDataPubblicazione] = useState('');
      const [numeroPagine, setNumeroPagine] = useState('');
      const [prezzo, setPrezzo] = useState('');
      const [autoreId, setAutoreId] = useState(''); // ID dell'autore selezionato
      const [autori, setAutori] = useState([]); // Lista degli autori per il dropdown
      const [errore, setErrore] = useState(null);
      const [successo, setSuccesso] = useState(false);

      // Carica gli autori per il dropdown al montaggio del componente
      useEffect(() => {
        const fetchAutori = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/logs/api/autori/');
            setAutori(response.data);
            if (response.data.length > 0) {
              setAutoreId(response.data[0].id); // Pre-seleziona il primo autore
            }
          } catch (err) {
            console.error("Errore nel caricamento degli autori:", err);
            setErrore("Impossibile caricare gli autori per la selezione.");
          }
        };
        fetchAutori();
      }, []);

      const handleSubmit = async (event) => {
        event.preventDefault(); // Previene il ricaricamento della pagina
        setErrore(null);
        setSuccesso(false);

        const nuovoLibro = {
          titolo,
          isbn,
          data_pubblicazione: dataPubblicazione, // Assicurati che i nomi corrispondano al serializer DRF
          numero_pagine: numeroPagine ? parseInt(numeroPagine) : null,
          prezzo: prezzo ? parseFloat(prezzo) : null,
          autore: parseInt(autoreId), // Invia l'ID dell'autore
        };

        try {
          // Recupera il token dal localStorage (lo implementeremo dopo)
          const token = localStorage.getItem('authToken');
          if (!token) {
            setErrore("Autenticazione richiesta per aggiungere un libro.");
            return;
          }

          const response = await axios.post(
            'http://127.0.0.1:8000/logs/api/libri/',
            nuovoLibro,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}` // Invia il token per l'autenticazione
              }
            }
          );
          console.log('Libro aggiunto:', response.data);
          setSuccesso(true);
          // Resetta i campi del form
          setTitolo('');
          setIsbn('');
          setDataPubblicazione('');
          setNumeroPagine('');
          setPrezzo('');
          // Chiama la callback per aggiornare la lista dei libri nel componente padre
          if (onLibroAggiunto) {
            onLibroAggiunto(response.data);
          }
        } catch (err) {
          console.error('Errore nell\'aggiunta del libro:', err.response ? err.response.data : err.message);
          setErrore(err.response && err.response.data ? JSON.stringify(err.response.data) : "Si è verificato un errore.");
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <h3>Aggiungi Nuovo Libro</h3>
          {errore && <p style={{ color: 'red' }}>Errore: {errore}</p>}
          {successo && <p style={{ color: 'green' }}>Libro aggiunto con successo!</p>}

          <div>
            <label>Titolo:</label>
            <input type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} required />
          </div>
          <div>
            <label>Autore:</label>
            <select value={autoreId} onChange={(e) => setAutoreId(e.target.value)} required>
              <option value="">Seleziona un autore</option>
              {autori.map(autore => (
                <option key={autore.id} value={autore.id}>
                  {autore.nome} {autore.cognome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>ISBN:</label>
            <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
          </div>
          <div>
            <label>Data Pubblicazione (YYYY-MM-DD):</label>
            <input type="date" value={dataPubblicazione} onChange={(e) => setDataPubblicazione(e.target.value)} />
          </div>
          <div>
            <label>Numero Pagine:</label>
            <input type="number" value={numeroPagine} onChange={(e) => setNumeroPagine(e.target.value)} />
          </div>
          <div>
            <label>Prezzo:</label>
            <input type="text" value={prezzo} onChange={(e) => setPrezzo(e.target.value)} />
          </div>
          <button type="submit">Aggiungi Libro</button>
        </form>
      );
    }

    export default AggiungiLibroForm;
    ```
    *   Usiamo `useState` per ogni campo del form.
    *   `handleSubmit` costruisce l'oggetto `nuovoLibro` e fa una richiesta `POST` con `axios`.
    *   **Importante:** L'header `Authorization: Token ${token}` è necessario per gli endpoint protetti.
    *   `onLibroAggiunto`: Una prop callback per notificare al componente padre che un libro è stato aggiunto, così può aggiornare la sua lista.

2.  **Integra il Form in `App.js` (o un altro componente genitore):**
    Potresti voler passare una funzione a `AggiungiLibroForm` per aggiornare la lista dei libri quando uno nuovo viene aggiunto.

### Gestione dello Stato di Autenticazione

Abbiamo bisogno di un modo per sapere se l'utente è loggato e per memorizzare il token di autenticazione.

**1. `localStorage` per il Token:**
`localStorage` è uno spazio di archiviazione nel browser che persiste anche dopo la chiusura della finestra. È un posto comune (anche se con alcune considerazioni di sicurezza) per memorizzare token.
*   `localStorage.setItem('authToken', token);`
*   `localStorage.getItem('authToken');`
*   `localStorage.removeItem('authToken');`

**Considerazioni sulla Sicurezza di `localStorage`:**
I token in `localStorage` sono vulnerabili ad attacchi XSS (Cross-Site Scripting). Se un malintenzionato riesce a iniettare JavaScript nella tua pagina, può leggere il token. Per applicazioni con requisiti di sicurezza elevati, i token HTTP-only cookies sono un'alternativa più sicura, ma più complessa da implementare, specialmente in scenari CORS. Per questo corso, useremo `localStorage` per semplicità, ma è fondamentale esserne consapevoli.

**2. Context API per lo Stato Globale:**
Per rendere lo stato di autenticazione (es. il token, informazioni sull'utente, se è loggato) accessibile a molti componenti senza dover passare props attraverso molti livelli (prop drilling), possiamo usare il **Context API** di React.

*   **Crea un AuthContext:**
    `src/context/AuthContext.js`
    ```javascript
    // src/context/AuthContext.js
    import React, { createContext, useState, useEffect } from 'react';
    import axios from 'axios';

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
      const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
      const [utente, setUtente] = useState(null); // Potremmo voler caricare i dati dell'utente
      const [caricamentoIniziale, setCaricamentoIniziale] = useState(true);

      // Configura axios per includere il token in tutte le richieste se presente
      useEffect(() => {
        if (authToken) {
          axios.defaults.headers.common['Authorization'] = `Token ${authToken}`;
          // TODO: Potresti voler recuperare i dati dell'utente qui se hai un endpoint /api/me/
          // Ad esempio:
          // axios.get('http://127.0.0.1:8000/api/auth/user/') // Assumendo che tu abbia questo endpoint
          //   .then(response => setUtente(response.data))
          //   .catch(() => { // Token non valido o scaduto
          //     localStorage.removeItem('authToken');
          //     setAuthToken(null);
          //     delete axios.defaults.headers.common['Authorization'];
          //   });
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
        setCaricamentoIniziale(false);
      }, [authToken]);

      const login = async (username, password) => {
        try {
          const response = await axios.post('http://127.0.0.1:8000/logs/api/auth/login/', { username, password });
          const token = response.data.token;
          localStorage.setItem('authToken', token);
          setAuthToken(token);
          // axios.defaults.headers.common['Authorization'] = `Token ${token}`; // Gestito da useEffect
          // TODO: Recupera i dati dell'utente dopo il login
          return true;
        } catch (error) {
          console.error("Errore di login:", error.response ? error.response.data : error.message);
          // Gestisci l'errore, magari restituendo il messaggio di errore
          throw error;
        }
      };

      const register = async (userData) => {
        try {
          const response = await axios.post('http://127.0.0.1:8000/logs/api/auth/register/', userData);
          // Dopo la registrazione, potresti voler fare il login automaticamente o reindirizzare alla pagina di login
          console.log("Registrazione riuscita:", response.data);
          // Non fa il login automatico qui, l'utente dovrà loggarsi separatamente
          return response.data;
        } catch (error) {
          console.error("Errore di registrazione:", error.response ? error.response.data : error.message);
          throw error;
        }
      };

      const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUtente(null);
        // delete axios.defaults.headers.common['Authorization']; // Gestito da useEffect
      };

      if (caricamentoIniziale) {
        return <div>Caricamento autenticazione...</div>; // O uno spinner
      }

      return (
        <AuthContext.Provider value={{ authToken, utente, login, logout, register, isAuthenticated: !!authToken }}>
          {children}
        </AuthContext.Provider>
      );
    };

    export default AuthContext;
    ```
    *   `AuthContext` memorizza `authToken` e una funzione `login`, `logout`, `register`.
    *   `useEffect` controlla `localStorage` al montaggio per vedere se un token esiste già.
    *   `axios.defaults.headers.common['Authorization']` imposta l'header globalmente per tutte le richieste axios.

*   **Fornisci il Context alla tua App:**
    In `src/index.js` (o `src/App.js`):
    ```javascript
    // src/index.js
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import './index.css';
    import App from './App';
    import { AuthProvider } from './context/AuthContext'; // Importa

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <AuthProvider> {/* Avvolgi App con AuthProvider */}
          <App />
        </AuthProvider>
      </React.StrictMode>
    );
    ```

*   **Usa il Context nei Componenti:**
    ```javascript
    // Esempio in un componente Login.js
    import React, { useState, useContext } from 'react';
    import AuthContext from '../context/AuthContext';
    // import { useNavigate } from 'react-router-dom'; // Per reindirizzare dopo il login

    function LoginComponent() {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const { login } = useContext(AuthContext);
      // const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
          await login(username, password);
          // navigate('/'); // Reindirizza alla homepage o a una dashboard
          alert('Login effettuato con successo!'); // Semplice alert per ora
        } catch (err) {
          setError(err.response?.data?.non_field_errors?.[0] || 'Credenziali non valide o errore server.');
        }
      };
      // ... form JSX ...
    }
    ```

### Implementare Login, Registrazione e Logout

**1. Componente Login (`Login.js`):**
`src/components/Login.js`
```javascript
// src/components/Login.js
import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
// Se usi react-router-dom v6+ per reindirizzare:
// import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  // const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(username, password);
      alert('Login effettuato con successo!'); // Sostituisci con un reindirizzamento
      // navigate('/'); // Esempio di reindirizzamento alla home
    } catch (err) {
       // DRF per il login standard restituisce errori in non_field_errors
      setError(err.response?.data?.non_field_errors?.[0] || 'Credenziali non valide o errore di rete.');
      console.error("Errore di login:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Login</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
```

**2. Componente Registrazione (`Register.js`):**
`src/components/Register.js`
```javascript
// src/components/Register.js
import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  // Aggiungi altri campi se necessario (first_name, last_name)
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { register } = useContext(AuthContext);
  // const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await register({ username, password, email /*, first_name, last_name */ });
      setSuccess(true);
      // navigate('/login'); // Reindirizza alla pagina di login dopo la registrazione
      alert('Registrazione completata! Ora puoi effettuare il login.');
    } catch (err) {
      setError(err.response?.data || {detail: "Errore durante la registrazione."});
      console.error("Errore di registrazione:", err);
    }
  };

  // Funzione per visualizzare gli errori in modo più leggibile
  const displayErrors = (errors) => {
    if (!errors) return null;
    return Object.entries(errors).map(([field, messages]) => (
      Array.isArray(messages) ? messages.map((message, index) => (
        <p key={`${field}-${index}`} style={{ color: 'red' }}>{field}: {message}</p>
      )) : <p key={field} style={{ color: 'red' }}>{field}: {messages}</p>
    ));
  };


  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrazione</h3>
      {error && displayErrors(error)}
      {success && <p style={{ color: 'green' }}>Registrazione avvenuta con successo! Ora puoi fare il login.</p>}
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {/* Aggiungi campi per conferma password, first_name, last_name se li hai nel serializer */}
      <button type="submit">Registrati</button>
    </form>
  );
}

export default Register;
```

**3. Pulsante Logout:**
In un componente Navbar o Header:
```javascript
// Esempio in un componente Navbar
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
// import { Link } from 'react-router-dom'; // Se usi react-router

function Navbar() {
  const { isAuthenticated, logout, utente } = useContext(AuthContext);

  return (
    <nav>
      {/* <Link to="/">Home</Link> */}
      {isAuthenticated ? (
        <>
          {/* utente && <span>Ciao, {utente.username}!</span> */}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          {/* <Link to="/login">Login</Link> */}
          {/* <Link to="/register">Registrati</Link> */}
          <p>Non sei loggato. <button onClick={() => alert('Vai alla pagina di login')}>Login</button></p>
        </>
      )}
    </nav>
  );
}
// export default Navbar;
```

### Routing Lato Client con `react-router-dom`

Per navigare tra diverse "pagine" (componenti) nella tua SPA React senza ricaricare la pagina, usa `react-router-dom`.

1.  **Installa `react-router-dom`:**
    ```bash
    npm install react-router-dom
    ```

2.  **Configura il Router in `App.js` (o `index.js`):**
    `src/App.js`
    ```javascript
    // src/App.js
    import React, { useContext } from 'react';
    import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
    import './App.css';
    import ListaLibri from './components/ListaLibri';
    import AggiungiLibroForm from './components/AggiungiLibroForm';
    import Login from './components/Login';
    import Register from './components/Register';
    import AuthContext from './context/AuthContext';

    // Componente per Rotte Protette
    function ProtectedRoute({ children }) {
      const { isAuthenticated } = useContext(AuthContext);
      if (!isAuthenticated) {
        // Se non autenticato, reindirizza alla pagina di login
        return <Navigate to="/login" replace />;
      }
      return children;
    }

    function App() {
      const { isAuthenticated, logout } = useContext(AuthContext);

      const handleLibroAggiunto = (nuovoLibro) => {
        // Potresti voler aggiornare la lista dei libri qui se ListaLibri è renderizzato
        // o usare un context separato per i dati dei libri
        console.log("Libro aggiunto dal form:", nuovoLibro);
        alert(`Libro "${nuovoLibro.titolo}" aggiunto!`);
      };

      return (
        <Router>
          <div className="App">
            <nav>
              <ul>
                <li><Link to="/">Home (Lista Libri)</Link></li>
                {isAuthenticated && (
                  <li><Link to="/aggiungi-libro">Aggiungi Libro</Link></li>
                )}
                {!isAuthenticated && (
                  <li><Link to="/login">Login</Link></li>
                )}
                {!isAuthenticated && (
                  <li><Link to="/register">Registrati</Link></li>
                )}
                {isAuthenticated && (
                  <li><button onClick={logout}>Logout</button></li>
                )}
              </ul>
            </nav>

            <hr />

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
              {/* Aggiungi altre rotte qui */}
            </Routes>
          </div>
        </Router>
      );
    }

    export default App;
    ```
    *   `BrowserRouter` (aliased as `Router`): Avvolge la tua applicazione per abilitare il routing.
    *   `Routes`: Contenitore per le tue `Route`.
    *   `Route`: Definisce un percorso (`path`) e il componente da renderizzare (`element`).
    *   `Link`: Usato per creare link di navigazione (come `<a>` ma per il routing SPA).
    *   `ProtectedRoute`: Un componente personalizzato che controlla se l'utente è autenticato prima di renderizzare il componente figlio (`AggiungiLibroForm`). Se non autenticato, usa `Navigate` per reindirizzare alla pagina di login.

Ora hai un'applicazione React con navigazione tra pagine, form per interagire con l'API Django, e un sistema di autenticazione basato su token.

## Esercizi Pratici

1.  **Implementa `AuthContext`:**
    *   Crea `src/context/AuthContext.js` come mostrato nella lezione.
    *   Implementa le funzioni `login`, `logout`, e `register` che interagiscono con i tuoi endpoint API DRF (`/api/auth/login/`, `/api/auth/register/`).
    *   Gestisci il token in `localStorage` e imposta l'header `Authorization` di default per `axios`.
    *   Avvolgi il componente `<App />` con `<AuthProvider />` in `src/index.js`.
2.  **Crea Componenti di Autenticazione:**
    *   Crea `src/components/Login.js`. Deve contenere un form per username e password e usare `AuthContext` per chiamare la funzione `login`. Mostra messaggi di errore.
    *   Crea `src/components/Register.js`. Deve contenere un form per username, password, email (e altri campi se vuoi) e usare `AuthContext` per chiamare `register`. Mostra messaggi di errore/successo.
3.  **Configura `react-router-dom`:**
    *   Installa `react-router-dom`.
    *   In `src/App.js`, configura `BrowserRouter`, `Routes`, e `Route`.
    *   Crea rotte per:
        *   `/` (Home, che mostra `ListaLibri`).
        *   `/login` (mostra `Login`).
        *   `/register` (mostra `Register`).
        *   `/aggiungi-libro` (mostra `AggiungiLibroForm`).
    *   Aggiungi componenti `Link` nella UI (es. una semplice navbar in `App.js`) per navigare tra queste rotte.
4.  **Crea il Form `AggiungiLibroForm`:**
    *   Crea `src/components/AggiungiLibroForm.js` come mostrato.
    *   Il form deve permettere di inserire titolo, ISBN, data pubblicazione, numero pagine, prezzo e selezionare un autore da un dropdown (carica gli autori da `/api/autori/`).
    *   Al submit, deve fare una richiesta POST a `/api/libri/`, includendo il token di autenticazione dall' `AuthContext` (o da `localStorage` se `AuthContext` non è ancora usato per questo).
    *   Gestisci la risposta e mostra messaggi di successo o errore.
5.  **Crea Rotte Protette:**
    *   Implementa il componente `ProtectedRoute` come mostrato nella lezione, che usa `AuthContext` per verificare se l'utente è autenticato.
    *   Proteggi la rotta `/aggiungi-libro` in modo che sia accessibile solo se l'utente è loggato. Se non loggato, deve reindirizzare a `/login`.
6.  **Testa il Flusso Completo:**
    *   Avvia entrambi i server (Django e React).
    *   Prova a navigare alle diverse pagine.
    *   **Registrazione:** Vai alla pagina di registrazione, crea un nuovo utente.
    *   **Login:** Vai alla pagina di login, effettua l'accesso con l'utente appena creato.
    *   **Accesso a Rotta Protetta:**
        *   Prova ad accedere a `/aggiungi-libro` prima del login (dovresti essere reindirizzato).
        *   Dopo il login, prova ad accedere nuovamente a `/aggiungi-libro` (dovresti vedere il form).
    *   **Aggiungi un Libro:** Compila e invia il form per aggiungere un libro. Verifica che il libro venga aggiunto (controlla la lista libri o l'admin Django).
    *   **Logout:** Implementa un pulsante di logout che chiami la funzione `logout` da `AuthContext` e verifica che l'utente venga effettivamente sloggato (es. non può più accedere a `/aggiungi-libro`).
    *   Controlla la console del browser e del server Django per eventuali errori.
```
