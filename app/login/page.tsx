'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

// Convertimos username -> email ficticio para Firebase Auth
const toEmail = (u: string) => `${u.toLowerCase().trim().replace(/\s+/g, '_')}@prode2026.app`

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) return setError('Completá todos los campos')
    setLoading(true); setError('')
    try {
      await signInWithEmailAndPassword(auth, toEmail(username), password)
      router.replace('/dashboard')
    } catch {
      setError('Usuario o contraseña incorrectos')
    }
    setLoading(false)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password || !password2) return setError('Completá todos los campos')
    if (password.length < 4) return setError('La contraseña debe tener al menos 4 caracteres')
    if (password !== password2) return setError('Las contraseñas no coinciden')
    if (username.trim().length < 2) return setError('El nombre debe tener al menos 2 caracteres')
    setLoading(true); setError('')
    try {
      const email = toEmail(username)
      // Verificar si el username ya existe
      const userSnap = await getDoc(doc(db, 'usernames', username.toLowerCase().trim()))
      if (userSnap.exists()) { setError('Ese nombre ya está en uso'); setLoading(false); return }

      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: username.trim() })
      // Guardar perfil en Firestore
      await setDoc(doc(db, 'users', cred.user.uid), { username: username.trim(), createdAt: Date.now() })
      // Reservar username
      await setDoc(doc(db, 'usernames', username.toLowerCase().trim()), { uid: cred.user.uid })

      setSuccess('¡Cuenta creada! Ingresando...')
      setTimeout(() => router.replace('/dashboard'), 1000)
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError('Ese nombre ya está en uso')
      else setError('Error al crear la cuenta. Intentá de nuevo.')
    }
    setLoading(false)
  }

  const inp: React.CSSProperties = {
    width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8,
    padding:'11px 14px', color:'var(--text)', fontFamily:'Barlow,sans-serif', fontSize:15,
    outline:'none', marginBottom:14,
  }
  const btn: React.CSSProperties = {
    width:'100%', background:'linear-gradient(135deg,#f59e0b,#d97706)', border:'none', borderRadius:8,
    padding:13, color:'#000', fontFamily:'Barlow Condensed,sans-serif', fontSize:15, fontWeight:700,
    letterSpacing:2, textTransform:'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop:6,
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, position:'relative', zIndex:1 }}>
      <div style={{ width:'100%', maxWidth:400, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'44px 36px', textAlign:'center', boxShadow:'0 0 80px rgba(245,158,11,.08)' }}>
        <div style={{ fontSize:56, marginBottom:8 }}>🏆</div>
        <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:40, letterSpacing:3, background:'linear-gradient(135deg,#fbbf24,#ef4444)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1 }}>PRODE 2026</div>
        <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:12, letterSpacing:4, color:'var(--muted)', textTransform:'uppercase', marginBottom:32, marginTop:4 }}>Mundial USA · Canadá · México</div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <label style={{ display:'block', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', marginBottom:6, textAlign:'left' }}>Nombre de usuario</label>
            <input style={inp} value={username} onChange={e => setUsername(e.target.value)} placeholder="Ej: Lionel" maxLength={20} autoComplete="username" />
            <label style={{ display:'block', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', marginBottom:6, textAlign:'left' }}>Contraseña</label>
            <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" autoComplete="current-password" />
            <button style={btn} type="submit" disabled={loading}>{loading ? 'ENTRANDO...' : 'ENTRAR AL PRODE'}</button>
            <div style={{ marginTop:14, fontSize:13, color:'var(--muted)' }}>
              ¿Primera vez? <span style={{ color:'var(--accent)', cursor:'pointer' }} onClick={() => { setMode('register'); setError('') }}>Registrate</span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <label style={{ display:'block', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', marginBottom:6, textAlign:'left' }}>Tu nombre</label>
            <input style={inp} value={username} onChange={e => setUsername(e.target.value)} placeholder="Ej: Lionel" maxLength={20} autoComplete="username" />
            <label style={{ display:'block', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', marginBottom:6, textAlign:'left' }}>Contraseña</label>
            <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 4 caracteres" autoComplete="new-password" />
            <label style={{ display:'block', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', marginBottom:6, textAlign:'left' }}>Confirmá la contraseña</label>
            <input style={inp} type="password" value={password2} onChange={e => setPassword2(e.target.value)} placeholder="••••••" autoComplete="new-password" />
            <button style={btn} type="submit" disabled={loading}>{loading ? 'CREANDO...' : 'CREAR CUENTA'}</button>
            <div style={{ marginTop:14, fontSize:13, color:'var(--muted)' }}>
              ¿Ya tenés cuenta? <span style={{ color:'var(--accent)', cursor:'pointer' }} onClick={() => { setMode('login'); setError('') }}>Ingresá</span>
            </div>
          </form>
        )}

        {error && <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'var(--accent2)', marginTop:10 }}>{error}</div>}
        {success && <div style={{ background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.3)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'var(--green)', marginTop:10 }}>{success}</div>}
      </div>
    </div>
  )
}
