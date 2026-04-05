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
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.firebase.com https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com; connect-src 'self' https://*.firebase.com https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com wss://*.firebaseio.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com; frame-src 'self' https://*.firebaseapp.com https://apis.google.com https://accounts.google.com; img-src 'self' data: https://*.googleapis.com https://*.googleusercontent.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
          },
        ],
      },
    ]
  },
}
module.exports = nextConfig
