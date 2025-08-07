// Componente per visualizzare una card di un libro

import { Libro, Autore } from '@/types/api'

interface LibroCardProps {
  libro: Libro
  onClick?: (libro: Libro) => void
  className?: string
}

export default function LibroCard({ libro, onClick, className = "" }: LibroCardProps) {
  // Gestisce il caso in cui autore può essere un ID o un oggetto completo
  const getAutoreNome = (autore: number | Autore): string => {
    if (typeof autore === 'number') {
      return `Autore ID: ${autore}`
    }
    return `${autore.nome} ${autore.cognome}`
  }

  const formatPrezzo = (prezzo: string | null): string => {
    if (!prezzo) return 'Prezzo non disponibile'
    const prezzoNum = parseFloat(prezzo)
    return `€ ${prezzoNum.toFixed(2)}`
  }

  const formatData = (data: string): string => {
    try {
      return new Date(data).toLocaleDateString('it-IT')
    } catch {
      return data
    }
  }

  return (
    <div 
      className={`
        card hover:shadow-md transition-shadow duration-200 cursor-pointer
        ${onClick ? 'hover:bg-gray-50' : ''}
        ${className}
      `}
      onClick={() => onClick?.(libro)}
    >
      {/* Header della card */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {libro.titolo}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            di {getAutoreNome(libro.autore)}
          </p>
        </div>
        <div className="ml-2 flex-shrink-0">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            📚 Libro
          </span>
        </div>
      </div>

      {/* Dettagli del libro */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <span className="font-medium w-20">ISBN:</span>
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
            {libro.isbn}
          </span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium w-20">Pubblicato:</span>
          <span>{formatData(libro.data_pubblicazione)}</span>
        </div>

        {libro.numero_pagine && (
          <div className="flex items-center">
            <span className="font-medium w-20">Pagine:</span>
            <span>{libro.numero_pagine}</span>
          </div>
        )}

        {libro.prezzo && (
          <div className="flex items-center">
            <span className="font-medium w-20">Prezzo:</span>
            <span className="font-semibold text-green-600">
              {formatPrezzo(libro.prezzo)}
            </span>
          </div>
        )}
      </div>

      {/* Footer della card */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ID: {libro.id}</span>
          {onClick && (
            <span className="text-blue-600 hover:text-blue-800">
              Clicca per dettagli →
            </span>
          )}
        </div>
      </div>
    </div>
  )
}