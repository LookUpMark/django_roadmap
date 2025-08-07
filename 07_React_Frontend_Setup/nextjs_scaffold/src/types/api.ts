// Tipi TypeScript per l'API Django
// Questi tipi corrispondono ai modelli Django e ai serializers DRF

export interface Autore {
  id: number
  nome: string
  cognome: string
  data_nascita?: string | null
  created_at?: string
  updated_at?: string
}

export interface Libro {
  id: number
  titolo: string
  autore: number | Autore // Può essere un ID o un oggetto Autore completo
  data_pubblicazione: string
  isbn: string
  numero_pagine?: number | null
  prezzo?: string | null
  created_at?: string
  updated_at?: string
}

// Tipi per le risposte API
export interface ApiResponse<T> {
  count?: number
  next?: string | null
  previous?: string | null
  results: T[]
}

export interface ApiError {
  detail?: string
  non_field_errors?: string[]
  [key: string]: any
}

// Tipi per l'autenticazione
export interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  is_staff?: boolean
  is_active?: boolean
  date_joined?: string
}

export interface AuthTokens {
  access?: string
  refresh?: string
  token?: string // Per DRF Token Authentication
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
}

// Tipi per i form
export interface LibroFormData {
  titolo: string
  autore: number
  data_pubblicazione: string
  isbn: string
  numero_pagine?: number
  prezzo?: number
}

export interface AutoreFormData {
  nome: string
  cognome: string
  data_nascita?: string
}

// Tipi per lo stato dell'applicazione
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
  hasNext: boolean
  hasPrevious: boolean
}

// Enum per i tipi di messaggio
export enum MessageType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface Message {
  id: string
  type: MessageType
  title?: string
  content: string
  duration?: number
}