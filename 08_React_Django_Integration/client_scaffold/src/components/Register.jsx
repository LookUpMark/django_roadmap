// OBIETTIVO: Completare l'Esercizio 2 ("Crea Componenti di Autenticazione") - Parte Registrazione
//            descritto nel README.md del Capitolo 8.
// COMPITO: Implementare il form di registrazione e la logica per chiamare la funzione `register` da AuthContext.

import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Per reindirizzamento e link

function Register() {
  // TODO 1: Definire stati per 'username', 'password', 'email', 'error', e 'success'.
  //         (Aggiungi altri campi come 'first_name', 'last_name' se il tuo UserSerializer li gestisce).
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  // const [firstName, setFirstName] = useState(''); // Esempio
  // const [lastName, setLastName] = useState('');   // Esempio
  const [error, setError] = useState(null); // Può essere un oggetto con più errori
  const [success, setSuccess] = useState(false);

  // TODO 2: Ottenere la funzione 'register' da AuthContext.
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Resetta errori precedenti
    setSuccess(false);

    // TODO 3: Implementare la logica di submit.
    //         - Creare un oggetto `userData` con i valori dagli stati del form.
    //         - Chiamare `await register(userData)` da AuthContext.
    //         - Se la registrazione ha successo:
    //             - Impostare `success` a true.
    //             - Opzionale: reindirizzare alla pagina di login (`navigate('/login')`).
    //         - Se la registrazione fallisce:
    //             - Impostare `error` con i messaggi di errore ricevuti (potrebbe essere `err.response.data`).
    const userData = {
      username,
      password,
      email,
      // first_name: firstName, // Esempio
      // last_name: lastName,   // Esempio
    };

    try {
      // await register(userData); // DECOMMENTA e implementa
      setSuccess(true);
      alert('Registrazione (placeholder) successo! Implementa la chiamata a AuthContext.register e il redirect.'); // Placeholder
      // navigate('/login'); // DECOMMENTA per reindirizzare
    } catch (err) {
      console.error("Errore durante la registrazione:", err);
      // setError(err.response?.data || { detail: "Errore sconosciuto durante la registrazione." }); // Esempio gestione errore
      setError({ detail: "Registrazione fallita (placeholder). Implementa la gestione degli errori." }); // Placeholder
    }
  };

  // Funzione helper per visualizzare gli errori (opzionale, ma utile se l'API restituisce errori per campo)
  const displayErrors = (errors) => {
    if (!errors) return null;
    if (typeof errors === 'string') return <p style={{ color: 'red' }}>{errors}</p>;
    return Object.entries(errors).map(([field, messages]) => (
      Array.isArray(messages) ? messages.map((message, index) => (
        <p key={`${field}-${index}`} style={{ color: 'red' }}>{field}: {message}</p>
      )) : <p key={field} style={{ color: 'red' }}>{field}: {messages.toString()}</p>
    ));
  };

  return (
    <div>
      <h2>Registra un Nuovo Utente</h2>
      {/* TODO 4: Creare il JSX del form:
                - Un tag <form> con onSubmit={handleSubmit}.
                - Input per 'username', 'email', 'password'.
                  (Considera di aggiungere un input per la conferma della password).
                - Pulsante <button type="submit">Registrati</button>.
                - Visualizzazione dei messaggi di 'error' (usando displayErrors se implementato) e 'success'.
                - Un link alla pagina di login.
      */}
      <form onSubmit={handleSubmit}>
        {error && displayErrors(error)}
        {success && <p style={{ color: 'green' }}>Registrazione avvenuta con successo! Ora puoi <Link to="/login">effettuare il login</Link>.</p>}

        <div>
          <label htmlFor="reg-username">Username:</label>
          <input id="reg-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="reg-email">Email:</label>
          <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /* required se il backend lo richiede */ />
        </div>
        <div>
          <label htmlFor="reg-password">Password:</label>
          <input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {/* Aggiungi altri campi qui se necessario (es. first_name, last_name, password confirm) */}
        <button type="submit">Registrati</button>
      </form>
      <p>
        Hai già un account? <Link to="/login">Accedi qui</Link>
      </p>
      <p style={{marginTop: "20px", fontStyle: "italic"}}>
        (Placeholder: Completa i TODO in <code>src/components/Register.jsx</code> e <code>src/context/AuthContext.jsx</code>)
      </p>
    </div>
  );
}

export default Register;
```
