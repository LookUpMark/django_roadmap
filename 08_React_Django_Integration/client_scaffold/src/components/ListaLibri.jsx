// OBIETTIVO: Adattare il componente ListaLibri (se necessario) per il Capitolo 8.
// COMPITO: Assicurarsi che ListaLibri funzioni correttamente nel contesto del routing
//          e dell'eventuale autenticazione (anche se GET è pubblico).
//          Potrebbe non richiedere modifiche significative rispetto al Capitolo 7
//          se l'endpoint GET /libri/ è pubblico.

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Potrebbe servire per API_LIBRI_URL

function ListaLibri() {
  const [libri, setLibri] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  // TODO 1: Ottenere API_LIBRI_URL da AuthContext se esposto, altrimenti usare un URL hardcoded/env.
  const { API_LIBRI_URL } = useContext(AuthContext); // Assumendo che AuthContext lo fornisca
  // const effectiveApiUrl = API_LIBRI_URL || 'http://127.0.0.1:8000/pizzeria/api/libri/'; // Fallback

  useEffect(() => {
    const fetchLibri = async () => {
      setCaricamento(true);
      setErrore(null);
      try {
        // TODO 2: Usare l'URL API corretto (effectiveApiUrl) per la chiamata GET.
        //         Questa chiamata è pubblica (GET), quindi non dovrebbe richiedere token
        //         se l'endpoint è configurato con IsAuthenticatedOrReadOnly.
        // const response = await axios.get(effectiveApiUrl);
        // setLibri(response.data);
        console.log("Placeholder: Caricamento libri da implementare o verificare in ListaLibri.jsx.");
        // Simulazione dati per UI
        // setLibri([{id:1, titolo:"Libro Prova 1", isbn:"111"}, {id:2, titolo:"Libro Prova 2", isbn:"222"}]);
      } catch (err) {
        console.error("Errore nel fetch dei libri:", err);
        // setErrore(err.message || "Errore sconosciuto nel caricamento libri.");
        setErrore("Errore caricamento libri (placeholder).");
      } finally {
        setCaricamento(false);
      }
    };

    // if (effectiveApiUrl) { // Esegui solo se l'URL è disponibile
    //   fetchLibri(); // DECOMMENTA
    // } else {
    //   setErrore("URL API non configurato.");
    //   setCaricamento(false);
    // }
    // Per ora, chiamiamolo per mostrare il placeholder se l'URL non è pronto
    fetchLibri();

  }, [API_LIBRI_URL]); // riesegui se API_LIBRI_URL cambia (improbabile dopo init)

  if (caricamento) return <p>Caricamento elenco libri...</p>;
  if (errore) return <p style={{ color: 'red' }}>Errore: {errore}</p>;

  return (
    <div>
      <h2>Elenco dei Libri</h2>
      {libri.length === 0 ? (
        <p>Nessun libro trovato o API non ancora chiamata.</p>
      ) : (
        <ul>
          {libri.map(libro => (
            <li key={libro.id}>
              <strong>{libro.titolo}</strong>
              {libro.isbn && <span> (ISBN: {libro.isbn})</span>}
              {/* Potresti voler aggiungere un link al dettaglio del libro se hai una rotta per esso */}
            </li>
          ))}
        </ul>
      )}
      <p style={{marginTop: "20px", fontStyle: "italic"}}>
        (Placeholder: Se non vedi libri, completa i TODO in <code>src/components/ListaLibri.jsx</code> e <code>src/context/AuthContext.jsx</code> per la chiamata API.)
      </p>
    </div>
  );
}

export default ListaLibri;
```
