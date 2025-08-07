// OBIETTIVO: Completare l'Esercizio 2 ("Crea Componenti di Autenticazione") - Parte Login
//            descritto nel README.md del Capitolo 8.
// COMPITO: Implementare il form di login con validazione e gestione errori moderna.

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useAuth } from '@/stores/authStore'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Schema di validazione con Zod
const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username è obbligatorio')
    .min(3, 'Username deve essere almeno 3 caratteri'),
  password: z.string()
    .min(1, 'Password è obbligatoria')
    .min(6, 'Password deve essere almeno 6 caratteri'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export default function LoginForm({ onSuccess, redirectTo = '/' }: LoginFormProps) {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  // TODO 1: Setup react-hook-form con validazione Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // TODO 2: Implementare la logica di submit
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Pulisci errori precedenti
      clearError()
      
      // TODO 2a: Chiamare la funzione login dallo store
      await login(data)
      
      // TODO 2b: Se il login ha successo, reindirizza o chiama callback
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectTo)
      }
      
    } catch (err: any) {
      // TODO 2c: Gestire errori specifici del form
      if (err.response?.data) {
        const errorData = err.response.data
        
        // Gestisci errori campo-specifici
        if (errorData.username) {
          setError('username', { message: errorData.username[0] })
        }
        if (errorData.password) {
          setError('password', { message: errorData.password[0] })
        }
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Accedi al tuo account
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Inserisci le tue credenziali per continuare
          </p>
        </div>

        {/* Errore generale */}
        {error && (
          <div className="alert-error mb-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo Username */}
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              {...register('username')}
              type="text"
              id="username"
              className={`input-field ${errors.username ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Inserisci il tuo username"
              autoComplete="username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Campo Password */}
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`input-field pr-10 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Inserisci la tua password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full btn-primary flex items-center justify-center"
          >
            {(isLoading || isSubmitting) ? (
              <>
                <LoadingSpinner size="sm" color="white" className="mr-2" />
                Accesso in corso...
              </>
            ) : (
              'Accedi'
            )}
          </button>
        </form>

        {/* Link registrazione */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Non hai un account?{' '}
            <Link 
              href="/auth/register" 
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Registrati qui
            </Link>
          </p>
        </div>

        {/* Demo credentials (solo per sviluppo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-800 font-medium mb-1">Demo Credentials:</p>
            <p className="text-xs text-yellow-700">
              Username: <code>admin</code> | Password: <code>admin123</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}