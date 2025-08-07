// OBIETTIVO: Completare l'Esercizio 4 ("Crea il Form AggiungiLibroForm")
//            descritto nel README.md del Capitolo 8.
// COMPITO: Implementare il form per aggiungere un nuovo libro con autenticazione e validazione moderna.

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '@/stores/authStore'
import { Autore, LibroFormData } from '@/types/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Schema di validazione con Zod
const libroSchema = z.object({
  titolo: z.string()
    .min(1, 'Titolo è obbligatorio')
    .max(200, 'Titolo troppo lungo'),
  autore: z.number({
    required_error: 'Seleziona un autore',
    invalid_type_error: 'Seleziona un autore valido',
  }).min(1, 'Seleziona un autore'),
  data_pubblicazione: z.string()
    .min(1, 'Data di pubblicazione è obbligatoria')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato data non valido (YYYY-MM-DD)'),
  isbn: z.string()
    .min(1, 'ISBN è obbligatorio')
    .regex(/^[\d-]+$/, 'ISBN può contenere solo numeri e trattini')
    .transform((val) => val.replace(/-/g, '')) // Rimuovi trattini
    .refine((val) => val.length === 10 || val.length === 13, 'ISBN deve essere di 10 o 13 cifre'),
  numero_pagine: z.number()
    .min(1, 'Numero pagine deve essere maggiore di 0')
    .max(10000, 'Numero pagine troppo alto')
    .optional()
    .or(z.literal('')),
  prezzo: z.number()
    .min(0, 'Prezzo non può essere negativo')
    .max(9999.99, 'Prezzo troppo alto')
    .optional()
    .or(z.literal('')),
})

type LibroFormData = z.infer<typeof libroSchema>

interface AggiungiLibroFormProps {
  onSuccess?: (libro: any) => void
  onCancel?: () => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export default function AggiungiLibroForm({ onSuccess, onCancel }: AggiungiLibroFormProps) {
  const { isAuthenticated, token } = useAuth()
  const queryClient = useQueryClient()
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // TODO 1: Setup react-hook-form con validazione Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    setValue,
  } = useForm<LibroFormData>({
    resolver: zodResolver(libroSchema),
    defaultValues: {
      titolo: '',
      autore: undefined,
      data_pubblicazione: '',
      isbn: '',
      numero_pagine: undefined,
      prezzo: undefined,
    },
  })

  // TODO 2: Query per caricare la lista degli autori
  const {
    data: autori = [],
    isLoading: autoriLoading,
    error: autoriError,
  } = useQuery({
    queryKey: ['autori'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/pizzeria/api/autori/`)
      return response.data as Autore[]
    },
    enabled: isAuthenticated, // Esegui solo se autenticato
  })

  // TODO 3: Mutation per creare un nuovo libro
  const createLibroMutation = useMutation({
    mutationFn: async (data: LibroFormData) => {
      if (!token) {
        throw new Error('Token di autenticazione mancante')
      }

      const response = await axios.post(
        `${API_BASE_URL}/pizzeria/api/libri/`,
        {
          ...data,
          numero_pagine: data.numero_pagine || null,
          prezzo: data.prezzo ? data.prezzo.toString() : null,
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    },
    onSuccess: (newLibro) => {
      // Invalida e ricarica la cache dei libri
      queryClient.invalidateQueries({ queryKey: ['libri'] })
      
      setSubmitSuccess(true)
      reset() // Reset del form
      
      // Callback di successo
      if (onSuccess) {
        onSuccess(newLibro)
      }
      
      // Nascondi messaggio di successo dopo 3 secondi
      setTimeout(() => setSubmitSuccess(false), 3000)
    },
    onError: (error: any) => {
      console.error('Errore creazione libro:', error.response?.data || error.message)
      
      // Gestisci errori campo-specifici
      if (error.response?.data) {
        const errorData = error.response.data
        Object.keys(errorData).forEach((field) => {
          if (field in libroSchema.shape) {
            setError(field as keyof LibroFormData, { 
              message: Array.isArray(errorData[field]) ? errorData[field][0] : errorData[field] 
            })
          }
        })
      }
    },
  })

  // TODO 4: Implementare la logica di submit
  const onSubmit = async (data: LibroFormData) => {
    if (!isAuthenticated) {
      setError('root', { message: 'Devi essere autenticato per aggiungere un libro' })
      return
    }

    try {
      await createLibroMutation.mutateAsync(data)
    } catch (error) {
      // Errore gestito nella mutation
    }
  }

  // Pre-seleziona il primo autore quando la lista è caricata
  useEffect(() => {
    if (autori.length > 0 && !submitSuccess) {
      setValue('autore', autori[0].id)
    }
  }, [autori, setValue, submitSuccess])

  // Verifica autenticazione
  if (!isAuthenticated) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Accesso richiesto
          </h3>
          <p className="text-gray-600">
            Devi essere autenticato per aggiungere un libro.
          </p>
        </div>
      </div>
    )
  }

  // Messaggio di successo
  if (submitSuccess) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-green-500 text-4xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Libro aggiunto con successo!
          </h3>
          <p className="text-gray-600 mb-4">
            Il libro è stato aggiunto al catalogo.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="btn-primary"
          >
            Aggiungi un altro libro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            📚 Aggiungi Nuovo Libro
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Compila tutti i campi per aggiungere un libro al catalogo
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            ✕ Annulla
          </button>
        )}
      </div>

      {/* Errore caricamento autori */}
      {autoriError && (
        <div className="alert-error mb-4">
          <p className="text-sm">
            Errore nel caricamento degli autori. Riprova più tardi.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Titolo */}
        <div>
          <label htmlFor="titolo" className="label">
            Titolo del Libro *
          </label>
          <input
            {...register('titolo')}
            type="text"
            id="titolo"
            className={`input-field ${errors.titolo ? 'border-red-300' : ''}`}
            placeholder="Inserisci il titolo del libro"
          />
          {errors.titolo && (
            <p className="mt-1 text-sm text-red-600">{errors.titolo.message}</p>
          )}
        </div>

        {/* Autore */}
        <div>
          <label htmlFor="autore" className="label">
            Autore *
          </label>
          {autoriLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-gray-600">Caricamento autori...</span>
            </div>
          ) : (
            <select
              {...register('autore', { valueAsNumber: true })}
              id="autore"
              className={`input-field ${errors.autore ? 'border-red-300' : ''}`}
            >
              <option value="">Seleziona un autore</option>
              {autori.map((autore) => (
                <option key={autore.id} value={autore.id}>
                  {autore.nome} {autore.cognome}
                </option>
              ))}
            </select>
          )}
          {errors.autore && (
            <p className="mt-1 text-sm text-red-600">{errors.autore.message}</p>
          )}
        </div>

        {/* ISBN e Data Pubblicazione */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="isbn" className="label">
              ISBN *
            </label>
            <input
              {...register('isbn')}
              type="text"
              id="isbn"
              className={`input-field ${errors.isbn ? 'border-red-300' : ''}`}
              placeholder="978-88-xxx-xxxx-x"
            />
            {errors.isbn && (
              <p className="mt-1 text-sm text-red-600">{errors.isbn.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="data_pubblicazione" className="label">
              Data Pubblicazione *
            </label>
            <input
              {...register('data_pubblicazione')}
              type="date"
              id="data_pubblicazione"
              className={`input-field ${errors.data_pubblicazione ? 'border-red-300' : ''}`}
            />
            {errors.data_pubblicazione && (
              <p className="mt-1 text-sm text-red-600">{errors.data_pubblicazione.message}</p>
            )}
          </div>
        </div>

        {/* Numero Pagine e Prezzo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="numero_pagine" className="label">
              Numero Pagine
            </label>
            <input
              {...register('numero_pagine', { valueAsNumber: true })}
              type="number"
              id="numero_pagine"
              min="1"
              max="10000"
              className={`input-field ${errors.numero_pagine ? 'border-red-300' : ''}`}
              placeholder="es. 350"
            />
            {errors.numero_pagine && (
              <p className="mt-1 text-sm text-red-600">{errors.numero_pagine.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="prezzo" className="label">
              Prezzo (€)
            </label>
            <input
              {...register('prezzo', { valueAsNumber: true })}
              type="number"
              id="prezzo"
              min="0"
              max="9999.99"
              step="0.01"
              className={`input-field ${errors.prezzo ? 'border-red-300' : ''}`}
              placeholder="es. 19.99"
            />
            {errors.prezzo && (
              <p className="mt-1 text-sm text-red-600">{errors.prezzo.message}</p>
            )}
          </div>
        </div>

        {/* Errore generale */}
        {errors.root && (
          <div className="alert-error">
            <p className="text-sm">{errors.root.message}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Annulla
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || createLibroMutation.isPending || autoriLoading}
            className="btn-primary flex items-center"
          >
            {(isSubmitting || createLibroMutation.isPending) ? (
              <>
                <LoadingSpinner size="sm" color="white" className="mr-2" />
                Aggiunta in corso...
              </>
            ) : (
              '📚 Aggiungi Libro'
            )}
          </button>
        </div>
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Suggerimenti</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• I campi contrassegnati con * sono obbligatori</li>
          <li>• L'ISBN verrà automaticamente validato e formattato</li>
          <li>• Se non trovi l'autore, aggiungilo prima tramite l'admin Django</li>
        </ul>
      </div>
    </div>
  )
}