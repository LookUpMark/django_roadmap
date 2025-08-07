/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurazione per sviluppo con Django backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*', // Proxy alle API Django
      },
    ]
  },
  
  // Configurazione immagini per copertine libri
  images: {
    domains: ['127.0.0.1', 'localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configurazione per sviluppo
  reactStrictMode: true,
  swcMinify: true,
  
  // Configurazione TypeScript
  typescript: {
    // Durante il build, ignora errori TypeScript (per sviluppo)
    ignoreBuildErrors: false,
  },
  
  // Configurazione ESLint
  eslint: {
    // Durante il build, ignora errori ESLint (per sviluppo)
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig