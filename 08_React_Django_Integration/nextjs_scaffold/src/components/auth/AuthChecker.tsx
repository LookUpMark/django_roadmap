// Componente per verificare l'autenticazione all'avvio dell'app
// Gestisce il controllo del token e l'inizializzazione dello stato auth

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/stores/authStore'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface AuthCheckerProps {
  children: React.ReactNode
}

export default function AuthChecker({ children }: AuthCheckerProps) {
  const { checkAuth, isLoading } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth()
      } catch (error) {
        console.error('Errore durante il controllo autenticazione:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [checkAuth])

  // Mostra loading durante l'inizializzazione
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Inizializzazione in corso...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}