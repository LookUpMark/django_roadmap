// Provider principale per l'applicazione Next.js
// Gestisce React Query, Zustand e altri provider globali

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  // Crea QueryClient con configurazione ottimizzata
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configurazione per le query
            staleTime: 5 * 60 * 1000, // 5 minuti
            gcTime: 10 * 60 * 1000, // 10 minuti (ex cacheTime)
            retry: (failureCount, error: any) => {
              // Non ritentare per errori 4xx
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false
              }
              return failureCount < 3
            },
            refetchOnWindowFocus: false,
            refetchOnMount: true,
          },
          mutations: {
            // Configurazione per le mutations
            retry: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools - solo in sviluppo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}