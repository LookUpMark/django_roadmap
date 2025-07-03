// OBIETTIVO: Completare l'Esercizio 4 ("Crea il Form AggiungiLibroForm")
//            descritto nel README.md del Capitolo 8.
// COMPITO: Implementare il form per aggiungere un nuovo libro, includendo la gestione
//          del token di autenticazione per la richiesta POST.

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Per accedere al token e API_LIBRI_URL

function AggiungiLibroForm({ onLibroAggiunto }) {
  // TODO 1: Definire stati per i campi del form: titolo, isbn, dataPubblicazione,
  //         numeroPagine, prezzo, autoreId (per l'ID dell'autore selezionato).
  //         Definire anche stati per 'autori' (lista per il dropdown), 'errore', e 'successo'.
  const [titolo, setTitolo] = useState('');
  const [isbn, setIsbn] = useState('');
  const [dataPubblicazione, setDataPubblicazione] = useState('');
  const [numeroPagine, setNumeroPagine] = useState('');
  const [prezzo, setPrezzo] = useState('');
  const [autoreId, setAutoreId] = useState('');
  const [autori, setAutori] = useState([]);
  const [errore, setErrore] = useState(null);
  const [successo, setSuccesso] = useState(false);

  // TODO 2: Ottenere 'authToken' (o 'isAuthenticated') e 'API_LIBRI_URL' da AuthContext.
  //         Potrebbe essere utile anche l'URL base degli autori se non è lo stesso di API_LIBRI_URL.
  const { authToken, API_LIBRI_URL } = useContext(AuthContext); // Assumendo che API_LIBRI_URL sia esposto
  const AUTORI_API_URL = API_LIBRI_URL.replace('/libri/', '/autori/'); // Esempio per derivare URL autori

  useEffect(() => {
    // TODO 3: In useEffect, caricare la lista degli autori dall'API (es. `${AUTORI_API_URL}`)
    //         per popolare il dropdown di selezione dell'autore.
    //         Questa chiamata non necessita di autenticazione se l'endpoint autori è pubblico (GET).
    const fetchAutori = async () => {
      try {
        // const response = await axios.get(AUTORI_API_URL); // DECOMMENTA e implementa
        // setAutori(response.data);
        // if (response.data.length > 0) {
        //   setAutoreId(response.data[0].id); // Pre-seleziona il primo autore
        // }
        console.log("Placeholder: Caricamento autori da implementare."); // Placeholder
      } catch (err) {
        console.error("Errore caricamento autori:", err);
        // setErrore("Impossibile caricare gli autori."); // Potresti volerlo mostrare
      }
    };
    // fetchAutori(); // DECOMMENTA
  }, [AUTORI_API_URL]); // Dipendenza dall'URL dell'API autori

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrore(null);
    setSuccesso(false);

    // TODO 4: Verificare se l'utente è autenticato (usando authToken).
    //         Se non autenticato, impostare un errore e non procedere.
    // if (!authToken) {
    //   setErrore("Devi essere autenticato per aggiungere un libro.");
    //   return;
    // }

    // TODO 5: Creare l'oggetto `nuovoLibro` con i dati dagli stati del form.
    //         Assicurati che i nomi dei campi corrispondano a quelli attesi dal serializer DRF.
    //         Converti `autoreId`, `numeroPagine`, `prezzo` ai tipi corretti (intero/float).
    const nuovoLibro = {
      titolo,
      isbn,
      data_pubblicazione: dataPubblicazione,
      numero_pagine: numeroPagine ? parseInt(numeroPagine) : null,
      prezzo: prezzo ? parseFloat(prezzo).toFixed(2) : null,
      autore: autoreId ? parseInt(autoreId) : null,
    };

    try {
      // TODO 6: Effettuare una richiesta POST a `API_LIBRI_URL` con `nuovoLibro`.
      //         Nell'header della richiesta, includere:
      //         - 'Content-Type': 'application/json'
      //         - 'Authorization': `Token ${authToken}` (l'header di default di axios dovrebbe già gestirlo se impostato in AuthContext)
      // const response = await axios.post(API_LIBRI_URL, nuovoLibro); // DECOMMENTA e implementa

      // TODO 7: Se la richiesta ha successo:
      //         - Impostare `successo` a true.
      //         - Resettare i campi del form.
      //         - Chiamare `onLibroAggiunto(response.data)` se la prop è fornita,
      //           per notificare il componente padre.
      // setSuccesso(true);
      // setTitolo(''); setIsbn(''); setDataPubblicazione(''); /* ...resetta altri campi... */
      // if (onLibroAggiunto) {
      //   onLibroAggiunto(response.data);
      // }
      alert('Aggiunta libro (placeholder) successo! Implementa la chiamata POST e la gestione del token.'); // Placeholder
    } catch (err) {
      // TODO 8: Se la richiesta fallisce:
      //         - Loggare l'errore.
      //         - Impostare lo stato `errore` con un messaggio appropriato
      //           (es. da `err.response.data`).
      console.error('Errore aggiunta libro:', err.response ? err.response.data : err.message);
      // setErrore(err.response?.data || { detail: "Errore durante l'aggiunta del libro."});
      setErrore({ detail: "Aggiunta libro fallita (placeholder). Implementa gestione errori."}); // Placeholder
    }
  };

  // Funzione helper per visualizzare gli errori (opzionale)
  const displayErrors = (errors) => {
    if (!errors) return null;
    if (typeof errors === 'string') return <p style={{ color: 'red' }}>{errors}</p>;
    return Object.entries(errors).map(([field, messages]) => (
      Array.isArray(messages) ? messages.map((message, index) => (
        <p key={`${field}-${index}`} style={{ color: 'red' }}>{field}: {message}</p>
      )) : <p key={field} style={{ color: 'red' }}>{field}: {messages.toString()}</p>
    ));
  };

  // TODO 9: Creare il JSX del form.
  //         - Titolo "Aggiungi Nuovo Libro".
  //         - Visualizzazione messaggi di `errore` e `successo`.
  //         - Campi input per titolo, isbn, data pubblicazione, numero pagine, prezzo.
  //         - Un `<select>` per l'autore, popolato con lo stato `autori`.
  //         - Un pulsante di submit.
  return (
    <form onSubmit={handleSubmit}>
      <h3>Aggiungi Nuovo Libro (Form Scaffolding)</h3>
      {errore && displayErrors(errore)}
      {successo && <p style={{ color: 'green' }}>Libro aggiunto con successo!</p>}

      <div>
        <label htmlFor="titolo">Titolo:</label>
        <input id="titolo" type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="autore">Autore:</label>
        <select id="autore" value={autoreId} onChange={(e) => setAutoreId(e.target.value)} required>
          <option value="">Seleziona un autore</option>
          {/* TODO 9a: Mappare lo stato 'autori' per creare le <option> del select.
                      Ogni option deve avere `key={autore.id}` e `value={autore.id}`.
                      Il testo visualizzato può essere `autore.nome cognome`.
          */}
          {autori.length === 0 && <option value="" disabled>Caricamento autori... (o nessun autore)</option>}
          {autori.map(autore => (
            <option key={autore.id} value={autore.id}>{autore.nome} {autore.cognome} (Placeholder)</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="isbn">ISBN:</label>
        <input id="isbn" type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="dataPubblicazione">Data Pubblicazione:</label>
        <input id="dataPubblicazione" type="date" value={dataPubblicazione} onChange={(e) => setDataPubblicazione(e.target.value)} />
      </div>
      <div>
        <label htmlFor="numeroPagine">Numero Pagine:</label>
        <input id="numeroPagine" type="number" value={numeroPagine} onChange={(e) => setNumeroPagine(e.target.value)} />
      </div>
      <div>
        <label htmlFor="prezzo">Prezzo:</label>
        <input id="prezzo" type="text" pattern="[0-9]+([,.][0-9]+)?" value={prezzo} onChange={(e) => setPrezzo(e.target.value)} />
      </div>
      <button type="submit">Aggiungi Libro</button>
      <p style={{marginTop: "20px", fontStyle: "italic"}}>
        (Placeholder: Completa i TODO in <code>src/components/AggiungiLibroForm.jsx</code> e <code>src/context/AuthContext.jsx</code>)
      </p>
    </form>
  );
}

export default AggiungiLibroForm;
```
