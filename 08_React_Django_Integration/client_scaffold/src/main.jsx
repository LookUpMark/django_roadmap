// OBIETTIVO: Completare l'Esercizio 1 ("Implementa AuthContext") - Parte Setup AuthProvider
//            descritto nel README.md del Capitolo 8.
// COMPITO: Avvolgere il componente <App /> con <AuthProvider /> per rendere il contesto
//          di autenticazione disponibile a tutta l'applicazione.

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Stili globali, se presenti

// TODO 1: Importare AuthProvider da './context/AuthContext.jsx'.
// import { AuthProvider } from './context/AuthContext'; // Decommenta questa riga

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* TODO 2: Avvolgere il componente <App /> con il <AuthProvider />.
              Esempio:
              <AuthProvider>
                <App />
              </AuthProvider>
    */}
    {/* <AuthProvider> */}
      <App />
    {/* </AuthProvider> */}
    {/* Le righe sopra sono un placeholder. Decommenta l'import e la struttura corretta. */}
    <div style={{border: "2px dashed blue", padding: "10px", marginTop: "20px", textAlign: "center"}}>
      <p><strong>TODO in main.jsx:</strong> Decommenta l'import di <code>AuthProvider</code> e avvolgi <code>&lt;App /&gt;</code> con <code>&lt;AuthProvider&gt; &lt;/AuthProvider&gt;</code>.</p>
    </div>
  </React.StrictMode>,
)

// TODO 3: (Verifica) Assicurati che il file `src/context/AuthContext.jsx` sia stato creato
//          e che lo scheletro sia pronto per essere implementato come da istruzioni
//          nell'Esercizio 1 del README.md del Capitolo 8.
```
