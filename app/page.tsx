'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      router.replace(user ? '/dashboard' : '/login')
    })
    return unsub
  }, [router])

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ fontFamily:'Bebas Neue,cursive', fontSize:24, letterSpacing:4, color:'var(--muted)' }}>⚽ CARGANDO...</span>
    </div>
  )
}
