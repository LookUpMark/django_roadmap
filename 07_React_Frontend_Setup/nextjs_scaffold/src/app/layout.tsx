import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LibraryHub - Gestione Libreria',
  description: 'Sistema completo di gestione libreria con Django e Next.js',
  keywords: ['libreria', 'libri', 'gestione', 'catalogo'],
  authors: [{ name: 'Django React Course' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <div className="min-h-full">
          {/* Header Navigation */}
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">
                    📚 LibraryHub
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Capitolo 7 - Next.js Setup
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                Django + Next.js Full-Stack Course - Esercizio Capitolo 7
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}