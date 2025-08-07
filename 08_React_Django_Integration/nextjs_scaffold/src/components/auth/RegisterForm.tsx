// OBIETTIVO: Completare l'Esercizio 2 ("Crea Componenti di Autenticazione") - Parte Registrazione
//            descritto nel README.md del Capitolo 8.
// COMPITO: Implementare il form di registrazione con validazione avanzata.

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
const registerSchema = z.object({
  username: z.string()
    .min(1, 'Username è obbligatorio')
    .min(3, 'Username deve essere almeno 3 caratteri')
    .max(150, 'Username troppo lungo')
    .regex(/^[\w.@+-]+$/, 'Username può contenere solo lettere, numeri e @/./+/-/_'),
  email: z.string()
    .min(1, 'Email è obbligatoria')
    .email('Formato email non valido'),
  first_name: z.string()
    .min(1, 'Nome è obbligatorio')
    .max(30, 'Nome troppo lungo'),
  last_name: z.string()
    .min(1, 'Cognome è obbligatorio')
    .max(30, 'Cognome troppo lungo'),
  password: z.string()
    .min(8, 'Password deve essere almeno 8 caratteri')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password deve contenere almeno una lettera minuscola, una maiuscola e un numero'),
  confirmPassword: z.string()
    .min(1, 'Conferma password è obbligatoria'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non corrispondono",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export default function RegisterForm({ onSuccess, redirectTo = '/auth/login' }: RegisterFormProps) {
  const router = useRouter()
  const { register: registerUser, isLoading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // TODO 1: Setup react-hook-form con validazione Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirmPassword: '',
    },
  })

  // Watch password per mostrare indicatori di forza
  const password = watch('password')

  // TODO 2: Implementare la logica di submit
  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Pulisci errori precedenti
      clearError()
      
      // TODO 2a: Preparare i dati per la registrazione (rimuovi confirmPassword)
      const { confirmPassword, ...registerData } = data
      
      // TODO 2b: Chiamare la funzione register dallo store
      await registerUser(registerData)
      
      // TODO 2c: Se la registrazione ha successo
      setRegistrationSuccess(true)
      
      // Reindirizza dopo un breve delay per mostrare il messaggio di successo
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(redirectTo)
        }
      }, 2000)
      
    } catch (err: any) {
      // TODO 2d: Gestire errori specifici del form
      if (err.response?.data) {
        const errorData = err.response.data
        
        // Gestisci errori campo-specifici
        Object.keys(errorData).forEach((field) => {
          if (field in data) {
            setError(field as keyof RegisterFormData, { 
              message: Array.isArray(errorData[field]) ? errorData[field][0] : errorData[field] 
            })
          }
        })
      }
    }
  }

  // Funzione per valutare la forza della password
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' }
    
    let score = 0
    if (pwd.length >= 8) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^a-zA-Z\d]/.test(pwd)) score++
    
    const levels = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Molto debole', color: 'bg-red-500' },
      { score: 2, label: 'Debole', color: 'bg-orange-500' },
      { score: 3, label: 'Media', color: 'bg-yellow-500' },
      { score: 4, label: 'Forte', color: 'bg-green-500' },
      { score: 5, label: 'Molto forte', color: 'bg-green-600' },
    ]
    
    return levels[score] || levels[0]
  }

  const passwordStrength = getPasswordStrength(password)

  if (registrationSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="card text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registrazione completata!
          </h2>
          <p className="text-gray-600 mb-4">
            Il tuo account è stato creato con successo. 
            Verrai reindirizzato alla pagina di login.
          </p>
          <LoadingSpinner className="mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Crea il tuo account
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Compila tutti i campi per registrarti
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
          {/* Nome e Cognome */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="label">
                Nome
              </label>
              <input
                {...register('first_name')}
                type="text"
                id="first_name"
                className={`input-field ${errors.first_name ? 'border-red-300' : ''}`}
                placeholder="Mario"
                autoComplete="given-name"
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="last_name" className="label">
                Cognome
              </label>
              <input
                {...register('last_name')}
                type="text"
                id="last_name"
                className={`input-field ${errors.last_name ? 'border-red-300' : ''}`}
                placeholder="Rossi"
                autoComplete="family-name"
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              {...register('username')}
              type="text"
              id="username"
              className={`input-field ${errors.username ? 'border-red-300' : ''}`}
              placeholder="mario.rossi"
              autoComplete="username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={`input-field ${errors.email ? 'border-red-300' : ''}`}
              placeholder="mario.rossi@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`input-field pr-10 ${errors.password ? 'border-red-300' : ''}`}
                placeholder="Crea una password sicura"
                autoComplete="new-password"
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
            
            {/* Indicatore forza password */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Conferma Password */}
          <div>
            <label htmlFor="confirmPassword" className="label">
              Conferma Password
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-300' : ''}`}
                placeholder="Ripeti la password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
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
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                Registrazione in corso...
              </>
            ) : (
              'Registrati'
            )}
          </button>
        </form>

        {/* Link login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Hai già un account?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Accedi qui
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}