/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurazione per testing API Django
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*', // Proxy alle API Django
      },
    ]
  },
  
  // Configurazione per sviluppo
  reactStrictMode: true,
  swcMinify: true,
  
  // Configurazione ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig