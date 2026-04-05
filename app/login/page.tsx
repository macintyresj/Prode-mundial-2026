'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const profileRef = doc(db, 'users', user.uid)
      const profileSnap = await getDoc(profileRef)

      if (!profileSnap.exists()) {
        const username = user.displayName || user.email?.split('@')[0] || 'Usuario'
        await setDoc(profileRef, {
          username,
          email: user.email,
          createdAt: Date.now(),
        })
        await setDoc(doc(db, 'usernames', username.toLowerCase().replace(/\s+/g, '_')), {
          uid: user.uid,
        })
      }

      router.replace('/dashboard')
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Cerraste la ventana antes de completar el login')
      } else if (err.code === 'auth/popup-blocked') {
        setError('Tu navegador bloqueó la ventana emergente. Permitila e intentá de nuevo.')
      } else {
        setError('Error al iniciar sesión. Intentá de nuevo.')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20, position: 'relative', zIndex: 1
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '48px 36px', textAlign: 'center',
        boxShadow: '0 0 80px rgba(245,158,11,.08)'
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🏆</div>
        <div style={{
          fontFamily: 'Bebas Neue, cursive', fontSize: 42, letterSpacing: 3,
          background: 'linear-gradient(135deg, #fbbf24, #ef4444)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1
        }}>PRODE 2026</div>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12,
          letterSpacing: 4, color: 'var(--muted)', textTransform: 'uppercase',
          marginBottom: 48, marginTop: 6
        }}>Mundial USA · Canadá · México</div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 12, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
            padding: '14px 20px', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontSize: 16,
            fontWeight: 700, letterSpacing: 1, color: '#374151'
          }}>
            {loading ? 'INICIANDO...' : 'CONTINUAR CON GOOGLE'}
          </span>
        </button>

        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 20, lineHeight: 1.6 }}>
          Al ingresar aceptás jugar limpio y no hacer trampa en los pronósticos 😄
        </p>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)',
            borderRadius: 8, padding: '10px 14px', fontSize: 13,
            color: 'var(--accent2)', marginTop: 16
          }}>{error}</div>
        )}
      </div>
    </div>
  )
}
