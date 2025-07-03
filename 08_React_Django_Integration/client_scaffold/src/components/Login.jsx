// OBIETTIVO: Completare l'Esercizio 2 ("Crea Componenti di Autenticazione") - Parte Login
//            descritto nel README.md del Capitolo 8.
// COMPITO: Implementare il form di login e la logica per chiamare la funzione `login` da AuthContext.

import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Per reindirizzamento e link

function Login() {
  // TODO 1: Definire stati per 'username', 'password', ed 'error'.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // TODO 2: Ottenere la funzione 'login' e 'isAuthenticated' da AuthContext usando useContext.
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Resetta errori precedenti

    // TODO 3: Implementare la logica di submit.
    //         - Chiamare la funzione `login(username, password)` da AuthContext.
    //         - Se il login ha successo (la promessa si risolve):
    //             - Navigare alla pagina principale (es. '/') usando `navigate`.
    //             - Opzionale: mostrare un messaggio di successo.
    //         - Se il login fallisce (la promessa viene rigettata):
    //             - Impostare un messaggio di errore nello stato 'error'.
    //             - L'errore potrebbe venire da `err.response.data.non_field_errors` o altri campi.
    try {
      // await login(username, password); // DECOMMENTA e implementa
      // navigate('/'); // DECOMMENTA e adatta la destinazione
      alert('Login (placeholder) successo! Implementa la chiamata a AuthContext.login e il redirect.'); // Placeholder
    } catch (err) {
      console.error("Errore durante il login:", err);
      // setError(err.response?.data?.non_field_errors?.[0] || 'Credenziali non valide o errore server.'); // Esempio gestione errore
      setError('Login fallito (placeholder). Implementa la gestione degli errori.'); // Placeholder
    }
  };

  // TODO 4: (Opzionale) Se l'utente è già autenticato (isAuthenticated è true),
  //         reindirizzalo alla pagina principale usando <Navigate to="/" />.
  //         Questo previene che un utente loggato veda nuovamente la pagina di login.
  // if (isAuthenticated) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div>
      <h2>Login Utente</h2>
      {/* TODO 5: Creare il JSX del form:
                - Un tag <form> con onSubmit={handleSubmit}.
                - Input per 'username' (type="text", value={username}, onChange per aggiornare lo stato).
                - Input per 'password' (type="password", value={password}, onChange).
                - Un pulsante <button type="submit">Login</button>.
                - Un'area per visualizzare il messaggio di 'error', se presente.
                - Un link alla pagina di registrazione.
      */}
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label htmlFor="login-username">Username:</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="login-password">Password:</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Non hai un account? <Link to="/register">Registrati qui</Link>
      </p>
      <p style={{marginTop: "20px", fontStyle: "italic"}}>
        (Placeholder: Completa i TODO in <code>src/components/Login.jsx</code> e <code>src/context/AuthContext.jsx</code>)
      </p>
    </div>
  );
}

export default Login;
```
