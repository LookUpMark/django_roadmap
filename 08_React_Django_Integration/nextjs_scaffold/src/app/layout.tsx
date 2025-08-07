import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/Providers'
import Navbar from '@/components/layout/Navbar'
import AuthChecker from '@/components/auth/AuthChecker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LibraryHub - Sistema Full-Stack',
  description: 'Sistema completo di gestione libreria con Django e Next.js - Capitolo 8',
  keywords: ['libreria', 'libri', 'gestione', 'catalogo', 'django', 'nextjs'],
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
        <Providers>
          <AuthChecker>
            <div className="min-h-full flex flex-col">
              {/* Navigation */}
              <Navbar />

              {/* Main Content */}
              <main className="flex-1">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>

              {/* Footer */}
              <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Django + Next.js Full-Stack Course - Capitolo 8
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>🚀 Next.js 14</span>
                      <span>🐍 Django REST</span>
                      <span>🎨 Tailwind CSS</span>
                      <span>📦 TypeScript</span>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </AuthChecker>
        </Providers>
      </body>
    </html>
  )
}