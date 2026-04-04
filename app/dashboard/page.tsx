'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import {
  collection, doc, getDoc, getDocs, setDoc, addDoc,
  query, where, arrayUnion, updateDoc, serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface Group { id: string; name: string; emoji: string; code: string; adminId: string }

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let c = ''; for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)]; return c
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ uid: string; username: string } | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [modal, setModal] = useState<'none' | 'create' | 'join' | 'created'>('none')
  const [groupName, setGroupName] = useState('')
  const [groupEmoji, setGroupEmoji] = useState('⚽')
  const [joinCode, setJoinCode] = useState('')
  const [createdCode, setCreatedCode] = useState('')
  const [createdId, setCreatedId] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const loadGroups = useCallback(async (uid: string) => {
    const q = query(collection(db, 'groups'), where('members', 'array-contains', uid))
    const snap = await getDocs(q)
    setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() } as Group)))
  }, [])

  useEffect(() => {
    return onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) { router.replace('/login'); return }
      const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
      const username = snap.data()?.username || firebaseUser.displayName || 'Usuario'
      setUser({ uid: firebaseUser.uid, username })
      loadGroups(firebaseUser.uid)
    })
  }, [router, loadGroups])

  async function createGroup() {
    if (!groupName.trim() || !user) return setMsg('Ingresá un nombre')
    setLoading(true); setMsg('')
    const code = genCode()
    const ref = await addDoc(collection(db, 'groups'), {
      name: groupName.trim(),
      emoji: groupEmoji || '⚽',
      code,
      adminId: user.uid,
      members: [user.uid],
      createdAt: serverTimestamp(),
    })
    setCreatedCode(code); setCreatedId(ref.id)
    setGroupName(''); setModal('created')
    loadGroups(user.uid)
    setLoading(false)
  }

  async function joinGroup() {
    const code = joinCode.trim().toUpperCase()
    if (code.length !== 6 || !user) return setMsg('El código tiene 6 caracteres')
    setLoading(true); setMsg('')
    const q = query(collection(db, 'groups'), where('code', '==', code))
    const snap = await getDocs(q)
    if (snap.empty) { setMsg('Código no encontrado'); setLoading(false); return }
    const groupDoc = snap.docs[0]
    await updateDoc(groupDoc.ref, { members: arrayUnion(user.uid) })
    setModal('none'); setJoinCode('')
    router.push(`/grupos/${groupDoc.id}`)
    setLoading(false)
  }

  const logout = () => signOut(auth).then(() => router.replace('/login'))

  // Shared styles
  const card: React.CSSProperties = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }
  const overlay: React.CSSProperties = { position:'fixed', inset:0, background:'rgba(0,0,0,.75)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }
  const modalBox: React.CSSProperties = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'36px 32px', maxWidth:400, width:'100%' }
  const inp: React.CSSProperties = { width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, padding:'11px 14px', color:'var(--text)', fontFamily:'Barlow,sans-serif', fontSize:15, outline:'none', marginBottom:14 }
  const btnP: React.CSSProperties = { background:'linear-gradient(135deg,#f59e0b,#d97706)', border:'none', borderRadius:8, padding:'12px 0', color:'#000', fontFamily:'Barlow Condensed,sans-serif', fontSize:14, fontWeight:700, letterSpacing:2, textTransform:'uppercase', cursor:'pointer', flex:1 }
  const btnS: React.CSSProperties = { background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, padding:'11px 16px', color:'var(--text)', fontFamily:'Barlow Condensed,sans-serif', fontSize:14, cursor:'pointer' }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', position:'relative', zIndex:1 }}>
      {/* Header */}
      <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:58 }}>
        <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:26, letterSpacing:2, background:'linear-gradient(135deg,#fbbf24,#ef4444)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>⚽ PRODE 2026</div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:20, padding:'5px 12px 5px 7px', fontSize:13 }}>
            <div style={{ width:22, height:22, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#ef4444)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#000' }}>{user?.username?.[0]?.toUpperCase()}</div>
            <span>{user?.username}</span>
          </div>
          <button onClick={logout} style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:6, padding:'5px 10px', color:'var(--muted)', fontSize:12, cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>Salir</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:'32px 24px', maxWidth:680, margin:'0 auto', width:'100%' }}>
        <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:26, letterSpacing:2, marginBottom:16 }}>Tus Grupos</div>

        {groups.length === 0
          ? <div style={{ textAlign:'center', padding:32, color:'var(--muted)', fontSize:14 }}>🏟️ Todavía no estás en ningún grupo</div>
          : groups.map(g => (
            <div key={g.id} style={card} onClick={() => router.push(`/grupos/${g.id}`)}>
              <div>
                <div style={{ fontWeight:700, fontSize:15 }}>{g.emoji} {g.name}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>Código: {g.code}{g.adminId === user?.uid ? ' · 👑 Admin' : ''}</div>
              </div>
              <span style={{ fontSize:20, color:'var(--muted)' }}>›</span>
            </div>
          ))}

        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0', color:'var(--muted)', fontSize:12, letterSpacing:2, textTransform:'uppercase' }}>
          <div style={{ flex:1, height:1, background:'var(--border)' }} /><span>o</span><div style={{ flex:1, height:1, background:'var(--border)' }} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[
            { icon:'🏘️', title:'Crear grupo', desc:'Armá tu prode privado', action: () => { setModal('create'); setMsg('') } },
            { icon:'🔑', title:'Unirse a grupo', desc:'Ingresá con un código', action: () => { setModal('join'); setMsg('') } },
          ].map(a => (
            <div key={a.title} onClick={a.action} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:20, cursor:'pointer', textAlign:'center' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{a.icon}</div>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{a.title}</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal crear */}
      {modal === 'create' && (
        <div style={overlay} onClick={e => e.target === e.currentTarget && setModal('none')}>
          <div style={modalBox}>
            <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:28, letterSpacing:2, marginBottom:20 }}>Crear Grupo</div>
            <label style={{ display:'block', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', marginBottom:6 }}>Nombre del grupo</label>
            <input style={inp} value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Ej: Amigos del laburo" maxLength={30} />
            <label style={{ display:'block', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', marginBottom:6 }}>Emoji</label>
            <input style={{ ...inp, fontSize:24, textAlign:'center' }} value={groupEmoji} onChange={e => setGroupEmoji(e.target.value)} placeholder="⚽" maxLength={2} />
            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <button style={btnS} onClick={() => setModal('none')}>Cancelar</button>
              <button style={btnP} onClick={createGroup} disabled={loading}>{loading ? 'CREANDO...' : 'CREAR'}</button>
            </div>
            {msg && <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'var(--accent2)', marginTop:10 }}>{msg}</div>}
          </div>
        </div>
      )}

      {/* Modal unirse */}
      {modal === 'join' && (
        <div style={overlay} onClick={e => e.target === e.currentTarget && setModal('none')}>
          <div style={modalBox}>
            <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:28, letterSpacing:2, marginBottom:20 }}>Unirse a Grupo</div>
            <label style={{ display:'block', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', marginBottom:6 }}>Código de invitación</label>
            <input style={{ ...inp, fontFamily:'Bebas Neue,cursive', fontSize:28, textAlign:'center', letterSpacing:6, textTransform:'uppercase' }} value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="CÓDIGO" maxLength={6} />
            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <button style={btnS} onClick={() => setModal('none')}>Cancelar</button>
              <button style={btnP} onClick={joinGroup} disabled={loading}>{loading ? 'UNIÉNDOME...' : 'UNIRSE'}</button>
            </div>
            {msg && <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'var(--accent2)', marginTop:10 }}>{msg}</div>}
          </div>
        </div>
      )}

      {/* Modal grupo creado */}
      {modal === 'created' && (
        <div style={overlay}>
          <div style={{ ...modalBox, textAlign:'center' }}>
            <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:28, letterSpacing:2, marginBottom:12 }}>¡Grupo Creado! 🎉</div>
            <p style={{ color:'var(--muted)', fontSize:13, marginBottom:12 }}>Compartí este código para invitar a otros:</p>
            <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, padding:16, margin:'12px 0' }}>
              <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:36, letterSpacing:8, color:'var(--gold)' }}>{createdCode}</div>
              <p style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>Código de invitación</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(createdCode)} style={{ ...btnS, width:'100%', marginBottom:10, color:'var(--accent)', borderColor:'var(--accent)' }}>📋 Copiar código</button>
            <button onClick={() => { setModal('none'); router.push(`/grupos/${createdId}`) }} style={{ ...btnP, width:'100%', padding:13 }}>ENTRAR AL GRUPO →</button>
          </div>
        </div>
      )}
    </div>
  )
}
