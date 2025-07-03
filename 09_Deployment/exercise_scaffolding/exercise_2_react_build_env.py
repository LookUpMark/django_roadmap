# OBIETTIVO: Completare l'Esercizio 2 ("Prepara React per la Produzione")
#            descritto nel README.md del Capitolo 9.
# COMPITO: Eseguire il build di produzione dell'app React e comprendere come
#          gestire le variabili d'ambiente per React.
# Questo file è principalmente una guida di commenti per azioni da eseguire nel terminale
# e per la creazione di file `.env` per l'app React.

# --- Build di Produzione React ---

# TODO 1: Navigare nella directory della tua app React.
#         Esempio nel terminale (dalla root del progetto generale):
#         cd 08_React_Django_Integration/client_scaffold
#         (o la cartella equivalente del Capitolo 7 o 8 se stai continuando da lì)

# TODO 2: Eseguire il comando di build di produzione.
#         Se usi Vite (come nello scaffolding dei capitoli precedenti):
#         npm run build
#         Se usi Create React App (CRA):
#         npm run build
#
#         Questo comando creerà una cartella `dist` (per Vite) o `build` (per CRA)
#         contenente i file statici ottimizzati per la produzione.

# TODO 3: Esplorare la cartella `dist/` (o `build/`).
#         Nota la struttura dei file (index.html, asset statici in sottocartelle con hash nei nomi).

# --- Variabili d'Ambiente in React (concettuale per l'esercizio) ---

# TODO 4: Comprendere come React (Vite o CRA) gestisce le variabili d'ambiente.
#         - Per Vite: Le variabili d'ambiente devono iniziare con `VITE_`.
#           Esempio: `VITE_API_URL=https://api.tuosito.com`
#         - Per Create React App: Devono iniziare con `REACT_APP_`.
#           Esempio: `REACT_APP_API_URL=https://api.tuosito.com`

# TODO 5: Creare file `.env` per configurazioni specifiche dell'ambiente (opzionale per questo esercizio, ma buona pratica).
#         Nella root della tua app React (es. `08_React_Django_Integration/client_scaffold/`):
#         - Crea `.env.production` per le variabili di produzione.
#           Esempio di contenuto per `.env.production` (se usi Vite):
#           ```
#           VITE_API_URL=https://api.tuo_dominio_di_produzione.com/pizzeria/api
#           VITE_APP_TITLE=La Mia Super Libreria (Produzione)
#           ```
#         - Crea `.env.development` per le variabili di sviluppo.
#           Esempio di contenuto per `.env.development` (se usi Vite):
#           ```
#           VITE_API_URL=http://127.0.0.1:8000/pizzeria/api
#           VITE_APP_TITLE=Libreria Dev
#           ```
#         Questi file vengono caricati automaticamente da Vite/CRA a seconda dell'ambiente (`npm run dev` vs `npm run build`).
#         Ricorda di aggiungere i file `.env` specifici dell'ambiente (ma non `.env.local` se contiene segreti)
#         al tuo `.gitignore` se non vuoi commetterli, specialmente se contengono dati sensibili.
#         `.env.example` è spesso committato per mostrare quali variabili sono necessarie.

# TODO 6: Modificare il codice React per usare una variabile d'ambiente.
#         Ad esempio, in `AuthContext.jsx` o dove fai chiamate API,
#         invece di un URL hardcoded, usa `import.meta.env.VITE_API_URL` (per Vite)
#         o `process.env.REACT_APP_API_URL` (per CRA).
#
#         Esempio per Vite in un file .jsx:
#         ```javascript
#         const apiUrl = import.meta.env.VITE_API_URL || 'http://fallback.api.url/api';
#         // ... useEffect(() => { axios.get(`${apiUrl}/libri`); }, []); ...
#         ```
#         Dopo aver modificato il codice e aggiunto i file `.env`, riesegui `npm run build`.
#         Ispeziona i file JavaScript generati nella cartella `dist/` (o `build/`)
#         per vedere come la variabile d'ambiente è stata incorporata (dovrebbe essere il valore di produzione).

# TODO 7: (Opzionale) Testare la build di produzione localmente.
#         Puoi usare `npm install -g serve` e poi `serve -s dist` (o `serve -s build` per CRA)
#         dalla directory della tua app React per servire i file buildati.
#         Questo ti permette di vedere l'app come sarebbe in produzione (senza il dev server).

print("File exercise_2_react_build_env.py creato.")
print("Questo file è una guida per azioni da eseguire nel terminale e per la creazione di file .env.")
print("1. Esegui i TODO 1-3 per creare la build di produzione della tua app React.")
print("2. Comprendi e implementa (opzionalmente) la gestione delle variabili d'ambiente (TODO 4-6).")
print("3. (Opzionale) Testa la build localmente con `serve` (TODO 7).")
print("Fai riferimento all'Esercizio 2 nel README.md del Capitolo 9 per i dettagli.")
