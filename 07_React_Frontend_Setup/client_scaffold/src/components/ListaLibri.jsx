// OBIETTIVO: Completare l'Esercizio 3 ("Crea il Componente ListaLibri in React")
//            e parte dell'Esercizio 5 ("Testa il Tutto") descritti nel README.md del Capitolo 7.
// COMPITO: Implementare la logica per recuperare e visualizzare l'elenco dei libri dall'API Django.

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios dovrebbe essere già installato

function ListaLibri() {
  // TODO 1: Definire le variabili di stato usando useState:
  //         - 'libri': array vuoto, per memorizzare l'elenco dei libri.
  //         - 'caricamento': booleano, valore iniziale true, per indicare lo stato di caricamento.
  //         - 'errore': null iniziale, per memorizzare eventuali messaggi di errore.
  const [libri, setLibri] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    const fetchLibri = async () => {
      // TODO 2: Impostare 'caricamento' a true e 'errore' a null prima di iniziare la chiamata API.
      // setCaricamento(true); // Già impostato inizialmente, ma utile se si ricaricano i dati
      // setErrore(null);

      try {
        // TODO 3: Effettuare una chiamata API GET all'endpoint del backend Django che restituisce la lista dei libri.
        //         L'URL dell'API sarà qualcosa come 'http://127.0.0.1:8000/pizzeria/api/libri/'
        //         (adatta il prefisso 'pizzeria/' se hai usato un nome diverso per l'app Django o per l'inclusione delle URL).
        //         Usa `await axios.get('URL_API_LIBRI')`.
        const response = { data: [] }; // SOSTITUISCI questo placeholder con la vera chiamata axios.get
        // const response = await axios.get('http://127.0.0.1:8000/NOME_APP/api/libri/'); // Esempio

        // TODO 4: Se la chiamata ha successo (nessun errore sollevato):
        //         - Aggiornare lo stato 'libri' con i dati ricevuti (response.data).
        //           setLibri(response.data);
        console.log("Dati ricevuti (placeholder):", response.data); // Rimuovi o commenta dopo l'implementazione

      } catch (err) {
        // TODO 5: Se si verifica un errore durante la chiamata API:
        //         - Aggiornare lo stato 'errore' con un messaggio appropriato (es. err.message).
        //         - Loggare l'errore in console (console.error("Testo errore:", err)).
        // setErrore(err.message);
        console.error("Errore nel fetch dei libri (placeholder):", err); // Rimuovi o commenta
      } finally {
        // TODO 6: In ogni caso (successo o errore), impostare lo stato 'caricamento' a false.
        // setCaricamento(false);
        console.log("Fetch completato (placeholder), caricamento dovrebbe essere false."); // Rimuovi o commenta
      }
    };

    // fetchLibri(); // TODO 7: Chiamare la funzione fetchLibri() per avviare il recupero dati.
                  // Decommenta questa riga dopo aver implementato la logica.

    // TODO 8: Assicurarsi che l'array di dipendenze di useEffect sia vuoto (`[]`)
    //         per eseguire l'effetto solo una volta al montaggio del componente.
  }, []); // Array di dipendenze vuoto

  // TODO 9: Implementare la logica di rendering condizionale:
  //         - Se 'caricamento' è true, visualizzare un messaggio "Caricamento libri in corso...".
  // if (caricamento) return <p>Caricamento libri in corso...</p>;

  //         - Se 'errore' non è null, visualizzare un messaggio di errore (es. "Errore: {errore}").
  // if (errore) return <p>Errore nel caricamento dei libri: {errore}</p>;

  // TODO 10: Se non c'è caricamento e non ci sono errori, renderizzare l'elenco dei libri:
  //          - Un titolo (es. <h2>Elenco Libri dall'API</h2>).
  //          - Se `libri.length` è 0, mostrare "<p>Nessun libro disponibile.</p>".
  //          - Altrimenti, mappare l'array `libri` per creare una lista `<ul>`.
  //            Per ogni `libro` nell'array, creare un `<li>` con `key={libro.id}`.
  //            All'interno del `<li>`, visualizzare almeno `libro.titolo` e `libro.isbn`.
  //            Esempio: <li><strong>{libro.titolo}</strong> (ISBN: {libro.isbn})</li>

  return (
    <div>
      <h2>Elenco Libri (Scaffolding)</h2>
      <p>Completa i TODO in <code>src/components/ListaLibri.jsx</code> per implementare questa sezione.</p>
      <p>Assicurati che il server Django sia in esecuzione e che CORS sia configurato correttamente.</p>
      {/* Placeholder per la lista, da sostituire con la logica dei TODO 9 e 10 */}
      {caricamento && <p>Caricamento (placeholder)...</p>}
      {errore && <p style={{color: 'red'}}>Errore (placeholder): {errore}</p>}
      {!caricamento && !errore && libri.length === 0 && <p>Nessun libro trovato (placeholder).</p>}
      {!caricamento && !errore && libri.length > 0 && (
        <ul>
          {libri.map(libro => (
            <li key={libro.id}>
              {libro.titolo} (Placeholder)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListaLibri;

// TODO 11: (Azione esterna) Configurare CORS nel backend Django.
//          - Segui le istruzioni dell'Esercizio 2 del README.md del Capitolo 7:
//            - `pip install django-cors-headers`
//            - Aggiungi `corsheaders` a `INSTALLED_APPS`
//            - Aggiungi `CorsMiddleware` a `MIDDLEWARE`
//            - Imposta `CORS_ALLOWED_ORIGINS` in `settings.py` (es. ["http://localhost:5173"] o la porta del dev server Vite)
//          - Riavvia il server Django.

// TODO 12: (Azione esterna) Integrare questo componente ListaLibri in `src/App.jsx`.
//           Importalo e usalo nel JSX di App.jsx.
//           Fai riferimento all'Esercizio 4 del README.md del Capitolo 7.
```
