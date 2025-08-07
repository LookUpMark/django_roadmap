// Pagina di registrazione
// Utilizza il componente RegisterForm e gestisce il redirect dopo la registrazione

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/stores/authStore'
import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Reindirizza se già autenticato
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

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
            Crea il tuo account per iniziare
          </p>
        </div>

        {/* Form di Registrazione */}
        <RegisterForm 
          redirectTo="/auth/login?message=registration_success"
          onSuccess={() => {
            // Callback opzionale dopo registrazione riuscita
            console.log('Registrazione completata con successo')
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
          
          {/* Info sulla privacy */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-left">
            <h4 className="font-medium text-gray-900 mb-2">
              🔒 Privacy e Sicurezza
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Le tue informazioni sono protette e crittografate</p>
              <p>• Non condividiamo i tuoi dati con terze parti</p>
              <p>• Puoi eliminare il tuo account in qualsiasi momento</p>
            </div>
          </div>
          
          {/* Demo info per sviluppo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <h4 className="font-medium text-blue-900 mb-2">
                🧪 Modalità Sviluppo
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Backend Django:</strong> Assicurati che sia in esecuzione su <code>http://127.0.0.1:8000</code></p>
                <p><strong>Endpoint:</strong> <code>POST /pizzeria/api/auth/register/</code></p>
                <p><strong>Validazione:</strong> Password deve contenere almeno 8 caratteri con maiuscole, minuscole e numeri</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}