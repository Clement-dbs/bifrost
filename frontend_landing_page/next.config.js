/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pas de rewrite vers le backend — la landing est 100% statique.
  // À réactiver quand le dashboard sera déployé :
  //
  // async rewrites() {
  //   const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
  //   return [{ source: '/api/backend/:path*', destination: `${apiBase}/api/:path*` }]
  // },
}

module.exports = nextConfig
