// OBIETTIVO: Completare l'Esercizio 4 (\"Integra ListaLibri in App.js\")
//            descritto nel README.md del Capitolo 7, ora convertito per Next.js.
// COMPITO: Modificare questo file per importare e visualizzare il componente ListaLibri.

import { Suspense } from 'react'
import ListaLibri from '@/components/ListaLibri'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Benvenuto in LibraryHub
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Sistema moderno di gestione libreria costruito con Django e Next.js
        </p>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Capitolo 7:</strong> Setup Frontend con Next.js e TypeScript
          </p>
        </div>
      </div>

      {/* TODO Section */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          📝 Istruzioni per l'Esercizio
        </h2>
        <div className="space-y-4 text-gray-700">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-medium text-yellow-800 mb-2">TODO 1: Setup Backend Django</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Assicurati che il server Django sia in esecuzione su <code className="bg-yellow-100 px-1 rounded">http://127.0.0.1:8000</code></li>
              <li>• Configura CORS per permettere richieste da <code className="bg-yellow-100 px-1 rounded">http://localhost:3000</code></li>
              <li>• Verifica che gli endpoint API siano accessibili</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">TODO 2: Completa il Componente ListaLibri</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Apri <code className="bg-blue-100 px-1 rounded">src/components/ListaLibri.tsx</code></li>
              <li>• Implementa la logica per recuperare i dati dall'API Django</li>
              <li>• Gestisci stati di caricamento ed errore</li>
              <li>• Testa la connessione con il backend</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-medium text-green-800 mb-2">TODO 3: Avvia i Server</h3>
            <div className="text-sm text-green-700 space-y-2">
              <p><strong>Backend Django:</strong></p>
              <code className="block bg-green-100 p-2 rounded text-xs">
                cd django_react_corso_esercizi<br/>
                python manage.py runserver
              </code>
              <p><strong>Frontend Next.js:</strong></p>
              <code className="block bg-green-100 p-2 rounded text-xs">
                cd 07_React_Frontend_Setup/nextjs_scaffold<br/>
                npm install<br/>
                npm run dev
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Lista Libri Component */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          📚 Catalogo Libri
        </h2>
        <Suspense fallback={<LoadingSpinner />}>
          <ListaLibri />
        </Suspense>
      </div>

      {/* Info Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            🚀 Tecnologie Utilizzate
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Next.js 14 con App Router
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              TypeScript per type safety
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Tailwind CSS per styling
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Axios per API calls
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            📋 Prossimi Passi
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Implementa autenticazione (Capitolo 8)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Aggiungi form per creare libri
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Implementa routing dinamico
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Deploy in produzione
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}