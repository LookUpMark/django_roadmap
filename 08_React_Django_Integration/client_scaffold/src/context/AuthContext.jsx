// OBIETTIVO: Completare l'Esercizio 1 ("Implementa AuthContext") descritto nel README.md del Capitolo 8.
// COMPITO: Implementare la logica per AuthProvider, incluse le funzioni login, logout, register
//          e la gestione del token di autenticazione.

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// TODO 1: Definisci l'URL base della tua API Django. Potrebbe essere una variabile d'ambiente in un progetto reale.
//         Adatta il percorso se la tua app Django o le URL API hanno prefissi diversi.
const API_BASE_URL = 'http://127.0.0.1:8000/pizzeria/api/auth/'; // Esempio: /NOME_APP_DJANGO/api/auth/
const API_LIBRI_URL = 'http://127.0.0.1:8000/pizzeria/api/libri/'; // Esempio per altre chiamate

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // TODO 2: Definire lo stato per authToken, utente (opzionale), e caricamentoIniziale.
  //         - authToken: recupera il token da localStorage all'avvio, o null.
  //         - utente: null iniziale, potresti popolarlo con i dati dell'utente dopo il login.
  //         - caricamentoIniziale: true iniziale, per gestire il caricamento del token da localStorage.
  const [authToken, setAuthToken] = useState(localStorage.getItem('userAuthToken')); // Nome chiave localStorage modificato
  const [utente, setUtente] = useState(null);
  const [caricamentoIniziale, setCaricamentoIniziale] = useState(true);

  useEffect(() => {
    // TODO 3: In useEffect, gestisci l'impostazione dell'header Authorization di default per axios
    //         se authToken esiste. Rimuovi l'header se authToken è null.
    //         Imposta caricamentoIniziale a false alla fine.
    //         Questo effetto deve dipendere da `authToken`.
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Token ${authToken}`;
      // console.log("Token impostato negli header di Axios:", authToken);
      // Potresti anche voler recuperare i dati dell'utente qui se il token esiste
      // e non hai ancora i dati utente.
    } else {
      delete axios.defaults.headers.common['Authorization'];
      // console.log("Header Authorization rimosso da Axios.");
    }
    setCaricamentoIniziale(false);
  }, [authToken]);

  const login = async (username, password) => {
    // TODO 4: Implementare la funzione login.
    //         - Fare una richiesta POST all'endpoint di login dell'API DRF (es. `${API_BASE_URL}login/`).
    //         - In caso di successo:
    //             - Salvare il token ricevuto (response.data.token) in localStorage (usa 'userAuthToken' come chiave).
    //             - Aggiornare lo stato authToken.
    //             - (Opzionale) Recuperare e impostare i dati dell'utente.
    //             - Restituire true o i dati dell'utente.
    //         - In caso di errore:
    //             - Loggare l'errore.
    //             - Lanciare l'errore per permettere al componente chiamante di gestirlo.
    try {
      console.log("Tentativo di login per:", username); // Debug
      // const response = await axios.post(...); // IMPLEMENTA QUI
      // const token = response.data.token;
      // localStorage.setItem('userAuthToken', token);
      // setAuthToken(token);
      // console.log("Login riuscito, token:", token); // Debug
      // return true; // o response.data
      throw new Error("Funzione di login non ancora implementata in AuthContext."); // Placeholder
    } catch (error) {
      console.error("Errore di login in AuthContext:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    // TODO 5: Implementare la funzione register.
    //         - Fare una richiesta POST all'endpoint di registrazione (es. `${API_BASE_URL}register/`).
    //         - In caso di successo, loggare il risultato o gestire come preferisci
    //           (es. reindirizzare al login, o fare login automatico se l'API restituisce un token).
    //         - In caso di errore, loggare e lanciare l'errore.
    try {
      console.log("Tentativo di registrazione per:", userData.username); // Debug
      // const response = await axios.post(...); // IMPLEMENTA QUI
      // console.log("Registrazione riuscita:", response.data); // Debug
      // return response.data;
      throw new Error("Funzione di registrazione non ancora implementata in AuthContext."); // Placeholder
    } catch (error) {
      console.error("Errore di registrazione in AuthContext:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const logout = () => {
    // TODO 6: Implementare la funzione logout.
    //         - Rimuovere 'userAuthToken' da localStorage.
    //         - Impostare authToken e utente a null.
    //         (L'header di Axios verrà rimosso dall'useEffect quando authToken cambia).
    console.log("Tentativo di logout."); // Debug
    // localStorage.removeItem('userAuthToken');
    // setAuthToken(null);
    // setUtente(null);
    console.log("Logout (placeholder) eseguito in AuthContext."); // Debug
  };

  // TODO 7: Se caricamentoIniziale è true, restituisci un elemento di caricamento (es. <div>Caricamento...</div>).
  // if (caricamentoIniziale) {
  //   return <div>Caricamento stato autenticazione...</div>;
  // }

  // TODO 8: Nel Provider value, includere authToken, utente (se lo usi),
  //         le funzioni login, logout, register, e una proprietà `isAuthenticated` (booleano basato su authToken).
  const contextValue = {
    authToken,
    utente,
    isAuthenticated: !!authToken, // Vero se authToken non è null/undefined/stringa vuota
    login,
    logout,
    register,
    API_LIBRI_URL // Esponi anche l'URL base per i libri se serve ad altri componenti
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// TODO 9: (Azione Esterna) Avvolgere il componente <App /> con <AuthProvider />
//          nel file `src/main.jsx` (o `src/index.js` se non usi Vite puro).
//          Fai riferimento all'Esercizio 1 del README.md del Capitolo 8.
```
