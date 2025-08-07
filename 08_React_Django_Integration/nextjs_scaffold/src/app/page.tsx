// Homepage principale dell'applicazione Next.js
// Mostra overview del sistema e link alle funzionalità principali

import Link from 'next/link'
import { Suspense } from 'react'
import StatsOverview from '@/components/dashboard/StatsOverview'
import RecentBooks from '@/components/books/RecentBooks'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Benvenuto in LibraryHub
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Sistema completo di gestione libreria costruito con Django REST Framework e Next.js. 
          Gestisci il tuo catalogo, aggiungi libri e monitora le statistiche.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/libri" className="btn-primary inline-flex items-center">
            📚 Esplora Catalogo
          </Link>
          <Link href="/libri/aggiungi" className="btn-secondary inline-flex items-center">
            ➕ Aggiungi Libro
          </Link>
        </div>

        {/* Progress Badge */}
        <div className="mt-8 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Capitolo 8: Integrazione Full-Stack Completata
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Autenticazione Sicura
            </h3>
            <p className="text-gray-600 text-sm">
              Sistema di login/registrazione con JWT tokens e validazione avanzata
            </p>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Performance Ottimizzate
            </h3>
            <p className="text-gray-600 text-sm">
              React Query per caching intelligente e Zustand per state management
            </p>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              UI/UX Moderna
            </h3>
            <p className="text-gray-600 text-sm">
              Interfaccia responsive con Tailwind CSS e componenti riutilizzabili
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          📊 Panoramica Sistema
        </h2>
        <Suspense fallback={<LoadingSpinner />}>
          <StatsOverview />
        </Suspense>
      </div>

      {/* Recent Books */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            📚 Libri Recenti
          </h2>
          <Link 
            href="/libri" 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Vedi tutti →
          </Link>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <RecentBooks />
        </Suspense>
      </div>

      {/* Technology Stack */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          🛠️ Stack Tecnologico
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">⚛️</div>
            <h4 className="font-medium text-gray-900">Next.js 14</h4>
            <p className="text-xs text-gray-600">React Framework</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">🐍</div>
            <h4 className="font-medium text-gray-900">Django REST</h4>
            <p className="text-xs text-gray-600">Backend API</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">📦</div>
            <h4 className="font-medium text-gray-900">TypeScript</h4>
            <p className="text-xs text-gray-600">Type Safety</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">🎨</div>
            <h4 className="font-medium text-gray-900">Tailwind CSS</h4>
            <p className="text-xs text-gray-600">Styling</p>
          </div>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          🎓 Progresso del Corso
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Completamento Capitolo 8</span>
            <span className="text-sm font-bold text-green-600">100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Setup Next.js</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Autenticazione</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>State Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>CRUD Operations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          🚀 Prossimi Passi
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Capitolo 9: Deployment</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Configurazione produzione Django</li>
              <li>• Build ottimizzato Next.js</li>
              <li>• Deploy su cloud provider</li>
              <li>• Monitoring e logging</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Features Avanzate</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Search e filtering avanzati</li>
              <li>• Upload immagini copertine</li>
              <li>• Sistema recensioni</li>
              <li>• Notifiche real-time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}