// OBIETTIVO: Completare l'Esercizio 3 (\"Crea il Componente ListaLibri in React\")
//            e parte dell'Esercizio 5 (\"Testa il Tutto\") descritti nel README.md del Capitolo 7.
// COMPITO: Implementare la logica per recuperare e visualizzare l'elenco dei libri dall'API Django.

'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Libro } from '@/types/api'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorMessage from './ui/ErrorMessage'
import LibroCard from './LibroCard'

export default function ListaLibri() {
  // TODO 1: Definire le variabili di stato usando useState:
  //         - 'libri': array vuoto, per memorizzare l'elenco dei libri.
  //         - 'caricamento': booleano, valore iniziale true, per indicare lo stato di caricamento.
  //         - 'errore': null iniziale, per memorizzare eventuali messaggi di errore.
  const [libri, setLibri] = useState<Libro[]>([])
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState<string | null>(null)

  useEffect(() => {
    const fetchLibri = async () => {
      // TODO 2: Impostare 'caricamento' a true e 'errore' a null prima di iniziare la chiamata API.
      setCaricamento(true)
      setErrore(null)

      try {
        // TODO 3: Effettuare una chiamata API GET all'endpoint del backend Django che restituisce la lista dei libri.
        //         L'URL dell'API sarà qualcosa come 'http://127.0.0.1:8000/pizzeria/api/libri/'
        //         (adatta il prefisso 'pizzeria/' se hai usato un nome diverso per l'app Django o per l'inclusione delle URL).
        //         Usa `await axios.get('URL_API_LIBRI')`.
        
        // NOTA: In Next.js, puoi usare il proxy configurato in next.config.js
        // oppure l'URL completo del backend Django
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const response = await axios.get(`${API_URL}/pizzeria/api/libri/`)
        
        // TODO 4: Se la chiamata ha successo (nessun errore sollevato):
        //         - Aggiornare lo stato 'libri' con i dati ricevuti (response.data).
        setLibri(response.data)
        console.log('Dati libri ricevuti:', response.data)

      } catch (err: any) {
        // TODO 5: Se si verifica un errore durante la chiamata API:
        //         - Aggiornare lo stato 'errore' con un messaggio appropriato (es. err.message).
        //         - Loggare l'errore in console.
        console.error('Errore nel fetch dei libri:', err)
        
        if (err.response) {
          // Errore dal server (4xx, 5xx)
          setErrore(`Errore server: ${err.response.status} - ${err.response.statusText}`)
        } else if (err.request) {
          // Errore di rete
          setErrore('Errore di connessione. Assicurati che il server Django sia in esecuzione.')
        } else {
          // Altri errori
          setErrore(`Errore: ${err.message}`)
        }
      } finally {
        // TODO 6: In ogni caso (successo o errore), impostare lo stato 'caricamento' a false.
        setCaricamento(false)
      }
    }

    // TODO 7: Chiamare la funzione fetchLibri() per avviare il recupero dati.
    fetchLibri()

    // TODO 8: Assicurarsi che l'array di dipendenze di useEffect sia vuoto (`[]`)
    //         per eseguire l'effetto solo una volta al montaggio del componente.
  }, []) // Array di dipendenze vuoto

  // TODO 9: Implementare la logica di rendering condizionale:
  //         - Se 'caricamento' è true, visualizzare un messaggio \"Caricamento libri in corso...\".
  if (caricamento) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Caricamento libri in corso...</p>
      </div>
    )
  }

  //         - Se 'errore' non è null, visualizzare un messaggio di errore.
  if (errore) {
    return <ErrorMessage message={errore} />
  }

  // TODO 10: Se non c'è caricamento e non ci sono errori, renderizzare l'elenco dei libri:
  //          - Un titolo (es. <h2>Elenco Libri dall'API</h2>).
  //          - Se `libri.length` è 0, mostrare \"Nessun libro disponibile.\".
  //          - Altrimenti, mappare l'array `libri` per creare una lista.
  //            Per ogni `libro` nell'array, creare un componente con `key={libro.id}`.
  //            All'interno, visualizzare almeno `libro.titolo` e `libro.isbn`.

  return (
    <div className="space-y-6">
      {/* Header con statistiche */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Elenco Libri dall'API
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {libri.length} {libri.length === 1 ? 'libro trovato' : 'libri trovati'}
          </p>
        </div>
        
        {/* Pulsante refresh */}
        <button
          onClick={() => window.location.reload()}
          className="btn-secondary text-sm"
          title="Ricarica elenco"
        >
          🔄 Ricarica
        </button>
      </div>

      {/* Lista libri */}
      {libri.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nessun libro disponibile
          </h3>
          <p className="text-gray-600 mb-6">
            Non ci sono libri nel database. Aggiungi alcuni libri tramite l'admin Django.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Per aggiungere libri:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Vai su <code className="bg-gray-100 px-1 rounded">http://127.0.0.1:8000/admin/</code></li>
              <li>Accedi con le credenziali admin</li>
              <li>Aggiungi alcuni autori e libri</li>
              <li>Ricarica questa pagina</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {libri.map((libro) => (
            <LibroCard key={libro.id} libro={libro} />
          ))}
        </div>
      )}

      {/* Info tecnica */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">
          ℹ️ Informazioni Tecniche
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Endpoint API:</strong> <code>GET /pizzeria/api/libri/</code></p>
          <p><strong>Stato connessione:</strong> 
            <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
              ✅ Connesso
            </span>
          </p>
          <p><strong>Ultima sincronizzazione:</strong> {new Date().toLocaleTimeString('it-IT')}</p>
        </div>
      </div>
    </div>
  )
}

// TODO 11: (Azione esterna) Configurare CORS nel backend Django.
//          - Segui le istruzioni dell'Esercizio 2 del README.md del Capitolo 7:
//            - `pip install django-cors-headers`
//            - Aggiungi `corsheaders` a `INSTALLED_APPS`
//            - Aggiungi `CorsMiddleware` a `MIDDLEWARE`
//            - Imposta `CORS_ALLOWED_ORIGINS` in `settings.py` (es. [\"http://localhost:3000\"] per Next.js)
//          - Riavvia il server Django.

// TODO 12: (Azione esterna) Questo componente è già integrato in `src/app/page.tsx`.
//           Verifica che funzioni correttamente e che non ci siano errori CORS nella console del browser.