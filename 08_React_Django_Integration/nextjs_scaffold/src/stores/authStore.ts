// OBIETTIVO: Completare l'Esercizio 1 ("Implementa AuthContext") descritto nel README.md del Capitolo 8.
// COMPITO: Implementare store Zustand per gestione autenticazione con funzioni login, logout, register
//          Questo sostituisce AuthContext con una soluzione più moderna e performante.

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import Cookies from 'js-cookie'
import { User, AuthTokens, LoginCredentials, RegisterData } from '@/types/api'

interface AuthState {
  // Stato
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Azioni
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  clearError: () => void
  checkAuth: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

// TODO 1: Definisci l'URL base della tua API Django. 
//         Adatta il percorso se la tua app Django o le URL API hanno prefissi diversi.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
const AUTH_ENDPOINTS = {
  login: `${API_BASE_URL}/pizzeria/api/auth/login/`,
  register: `${API_BASE_URL}/pizzeria/api/auth/register/`,
  user: `${API_BASE_URL}/pizzeria/api/auth/user/`,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Stato iniziale
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // TODO 2: Implementare la funzione login
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          console.log('Tentativo di login per:', credentials.username)
          
          // TODO 2a: Fare una richiesta POST all'endpoint di login dell'API DRF
          const response = await axios.post(AUTH_ENDPOINTS.login, credentials)
          
          // TODO 2b: Estrarre token e dati utente dalla risposta
          const { token, user } = response.data
          
          if (!token) {
            throw new Error('Token non ricevuto dal server')
          }

          // TODO 2c: Salvare il token nei cookie (più sicuro di localStorage per auth)
          Cookies.set('auth_token', token, { 
            expires: 7, // 7 giorni
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })

          // TODO 2d: Configurare header Authorization di default per axios
          axios.defaults.headers.common['Authorization'] = `Token ${token}`

          // TODO 2e: Aggiornare lo stato
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })

          console.log('Login riuscito:', user)
          
        } catch (error: any) {
          console.error('Errore di login:', error.response?.data || error.message)
          
          // Gestione errori specifici
          let errorMessage = 'Errore durante il login'
          if (error.response?.data) {
            if (error.response.data.non_field_errors) {
              errorMessage = error.response.data.non_field_errors[0]
            } else if (error.response.data.detail) {
              errorMessage = error.response.data.detail
            } else if (typeof error.response.data === 'string') {
              errorMessage = error.response.data
            }
          }
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage
          })
          
          throw error
        }
      },

      // TODO 3: Implementare la funzione register
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        
        try {
          console.log('Tentativo di registrazione per:', data.username)
          
          // TODO 3a: Fare una richiesta POST all'endpoint di registrazione
          const response = await axios.post(AUTH_ENDPOINTS.register, data)
          
          console.log('Registrazione riuscita:', response.data)
          
          // TODO 3b: Dopo registrazione, potresti voler fare login automatico
          // oppure reindirizzare alla pagina di login
          set({ isLoading: false, error: null })
          
          // Opzione 1: Login automatico dopo registrazione
          // if (response.data.token) {
          //   await get().login({ username: data.username, password: data.password })
          // }
          
        } catch (error: any) {
          console.error('Errore di registrazione:', error.response?.data || error.message)
          
          let errorMessage = 'Errore durante la registrazione'
          if (error.response?.data) {
            // Gestisci errori di validazione campo per campo
            const errors = error.response.data
            if (typeof errors === 'object') {
              const firstError = Object.values(errors)[0]
              if (Array.isArray(firstError)) {
                errorMessage = firstError[0] as string
              }
            }
          }
          
          set({
            isLoading: false,
            error: errorMessage
          })
          
          throw error
        }
      },

      // TODO 4: Implementare la funzione logout
      logout: () => {
        console.log('Logout utente')
        
        // TODO 4a: Rimuovere token dai cookie
        Cookies.remove('auth_token')
        
        // TODO 4b: Rimuovere header Authorization da axios
        delete axios.defaults.headers.common['Authorization']
        
        // TODO 4c: Reset dello stato
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      },

      // Funzione per pulire errori
      clearError: () => {
        set({ error: null })
      },

      // TODO 5: Implementare checkAuth per verificare token esistente
      checkAuth: async () => {
        const token = Cookies.get('auth_token')
        
        if (!token) {
          set({ isAuthenticated: false, isLoading: false })
          return
        }

        set({ isLoading: true })
        
        try {
          // Configura header per la richiesta
          axios.defaults.headers.common['Authorization'] = `Token ${token}`
          
          // Verifica validità token richiedendo dati utente
          const response = await axios.get(AUTH_ENDPOINTS.user)
          
          set({
            user: response.data,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          
        } catch (error) {
          console.error('Token non valido:', error)
          // Token non valido, esegui logout
          get().logout()
        }
      },

      // Funzione per aggiornare dati utente
      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }))
      },
    }),
    {
      name: 'auth-storage',
      // Persisti solo i dati essenziali, non il token (che è nei cookie)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// TODO 6: Hook personalizzato per facilità d'uso
export const useAuth = () => {
  const store = useAuthStore()
  return {
    // Stato
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    
    // Azioni
    login: store.login,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
    checkAuth: store.checkAuth,
    updateUser: store.updateUser,
  }
}

// TODO 7: (Azione Esterna) Inizializzare l'autenticazione nell'app
//         Chiama checkAuth() nel layout principale o in un provider
//         per verificare se l'utente è già autenticato al caricamento dell'app.