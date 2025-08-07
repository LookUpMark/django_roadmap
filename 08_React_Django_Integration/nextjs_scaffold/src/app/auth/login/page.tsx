// Pagina di login
// Utilizza il componente LoginForm e gestisce il redirect dopo l'autenticazione

'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/stores/authStore'
import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Ottieni il redirect URL dai parametri di query
  const redirectTo = searchParams.get('redirect') || '/'

  // Reindirizza se già autenticato
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo])

  // Non mostrare la pagina se già autenticato
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900">
            <span>📚</span>
            <span>LibraryHub</span>
          </Link>
          <p className="mt-2 text-gray-600">
            Accedi per gestire il catalogo libri
          </p>
        </div>

        {/* Alert se redirect da pagina protetta */}
        {searchParams.get('redirect') && (
          <div className="alert-warning mb-6">
            <p className="text-sm">
              Devi effettuare l'accesso per visualizzare questa pagina.
            </p>
          </div>
        )}

        {/* Form di Login */}
        <LoginForm 
          redirectTo={redirectTo}
          onSuccess={() => {
            // Callback opzionale dopo login riuscito
            console.log('Login completato con successo')
          }}
        />

        {/* Link utili */}
        <div className="mt-8 text-center space-y-4">
          <div className="text-sm text-gray-600">
            <Link 
              href="/" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              ← Torna alla homepage
            </Link>
          </div>
          
          {/* Demo info per sviluppo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <h4 className="font-medium text-blue-900 mb-2">
                🧪 Modalità Sviluppo
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Backend Django:</strong> Assicurati che sia in esecuzione su <code>http://127.0.0.1:8000</code></p>
                <p><strong>CORS:</strong> Configurato per <code>http://localhost:3000</code></p>
                <p><strong>Endpoint:</strong> <code>POST /pizzeria/api/auth/login/</code></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}