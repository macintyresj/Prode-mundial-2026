/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.firebase.com https://*.firebaseapp.com https://*.googleapis.com; connect-src 'self' https://*.firebase.com https://*.firebaseapp.com https://*.googleapis.com wss://*.firebaseio.com; frame-src 'self' https://*.firebaseapp.com; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
          },
        ],
      },
    ]
  },
}
module.exports = nextConfig
