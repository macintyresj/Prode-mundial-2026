'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import {
  doc, getDoc, getDocs, setDoc, collection,
  query, where, serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { FIXTURE, canPredict, calcPoints, formatMatchDate, timeUntilLock } from '@/lib/fixture'

type Tab = 'posiciones' | 'mis-pronos' | 'fixture' | 'miembros' | 'admin'

interface UserProfile { uid: string; username: string }
interface Group { id: string; name: string; emoji: string; code: string; adminId: string; members: string[] }
interface Prediction { matchId: string; goalsLocal: number; goalsVisitor: number; userId: string }
interface MatchResult { matchId: string; goalsLocal: number; goalsVisitor: number }

export default function GroupPage() {
  const router = useRouter()
  const { id: groupId } = useParams() as { id: string }

  const [user, setUser] = useState<UserProfile | null>(null)
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<UserProfile[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [results, setResults] = useState<MatchResult[]>([])
  const [tab, setTab] = useState<Tab>('posiciones')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)

  const showToast = (msg: string, type = 'info') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const loadData = useCallback(async (uid: string) => {
    // Load group
    const gSnap = await getDoc(doc(db, 'groups', groupId))
    if (!gSnap.exists()) { router.replace('/dashboard'); return }
    const g = { id: gSnap.id, ...gSnap.data() } as Group
    setGroup(g)

    // Load members profiles
    const memberProfiles = await Promise.all(
      g.members.map(async (uid: string) => {
        const snap = await getDoc(doc(db, 'users', uid))
        return { uid, username: snap.data()?.username || 'Usuario' }
      })
    )
    setMembers(memberProfiles)

    // Load predictions
    const predsSnap = await getDocs(collection(db, 'groups', groupId, 'predictions'))
    setPredictions(predsSnap.docs.map(d => d.data() as Prediction))

    // Load results
    const resSnap = await getDocs(collection(db, 'groups', groupId, 'results'))
    setResults(resSnap.docs.map(d => d.data() as MatchResult))

    setLoading(false)
  }, [groupId, router])

  useEffect(() => {
    return onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) { router.replace('/login'); return }
      const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
      const username = snap.data()?.username || firebaseUser.displayName || 'Usuario'
      setUser({ uid: firebaseUser.uid, username })
      loadData(firebaseUser.uid)
    })
  }, [router, loadData])

  const getPred = (matchId: string, userId?: string) =>
    predictions.find(p => p.matchId === matchId && p.userId === (userId || user?.uid))
  const getResult = (matchId: string) => results.find(r => r.matchId === matchId)

  function getLeaderboard() {
    const scores: Record<string, { uid: string; name: string; pts: number; exact: number; result: number; played: number }> = {}
    members.forEach(m => { scores[m.uid] = { uid: m.uid, name: m.username, pts: 0, exact: 0, result: 0, played: 0 } })
    results.forEach(res => {
      predictions.filter(p => p.matchId === res.matchId).forEach(pred => {
        if (!scores[pred.userId]) return
        const { pts, tipo } = calcPoints(pred.goalsLocal, pred.goalsVisitor, res.goalsLocal, res.goalsVisitor)
        scores[pred.userId].pts += pts; scores[pred.userId].played++
        if (tipo === 'exact') scores[pred.userId].exact++
        if (tipo === 'result') scores[pred.userId].result++
      })
    })
    return Object.values(scores).sort((a, b) => b.pts - a.pts || b.exact - a.exact)
  }

  async function savePrediction(matchId: string, l: string, v: string) {
    if (l === '' || v === '' || !user) return showToast('Ingresá ambos valores', 'error')
    const match = FIXTURE.find(m => m.id === matchId)!
    if (!canPredict(match)) return showToast('El pronóstico ya está cerrado', 'error')
    const pred: Prediction = { matchId, userId: user.uid, goalsLocal: parseInt(l), goalsVisitor: parseInt(v) }
    await setDoc(doc(db, 'groups', groupId, 'predictions', `${user.uid}_${matchId}`), { ...pred, updatedAt: serverTimestamp() })
    showToast('✅ Pronóstico guardado!', 'success')
    loadData(user.uid)
  }

  async function saveResult(matchId: string, l: string, v: string) {
    if (l === '' || v === '' || !user) return showToast('Ingresá ambos valores', 'error')
    const res: MatchResult = { matchId, goalsLocal: parseInt(l), goalsVisitor: parseInt(v) }
    await setDoc(doc(db, 'groups', groupId, 'results', matchId), { ...res, updatedAt: serverTimestamp() })
    showToast('✅ Resultado guardado! Puntos recalculados.', 'success')
    loadData(user.uid)
  }

  // Styles
  const scoreInp: React.CSSProperties = { width:40, height:40, background:'var(--surface2)', border:'2px solid var(--border)', borderRadius:8, color:'var(--text)', fontFamily:'Bebas Neue,cursive', fontSize:22, textAlign:'center', outline:'none' }
  const matchCard: React.CSSProperties = { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px', marginBottom:8 }
  const grupTitle: React.CSSProperties = { fontFamily:'Barlow Condensed,sans-serif', fontSize:11, letterSpacing:3, textTransform:'uppercase', color:'var(--muted)', margin:'18px 0 8px', display:'flex', alignItems:'center', gap:8 }
  const tabStyle = (t: Tab): React.CSSProperties => ({ flexShrink:0, padding:'12px 18px', fontFamily:'Barlow Condensed,sans-serif', fontSize:11, fontWeight:600, letterSpacing:2, textTransform:'uppercase', cursor:'pointer', borderBottom: tab===t ? '2px solid var(--accent)' : '2px solid transparent', color: tab===t ? 'var(--accent)' : 'var(--muted)', whiteSpace:'nowrap' })
  const lbRow: React.CSSProperties = { display:'grid', gridTemplateColumns:'40px 1fr 55px 55px 55px', padding:'12px 16px', borderBottom:'1px solid var(--border)', alignItems:'center' }

  const grupos = [...new Set(FIXTURE.map(m => m.grupo))]
  const lb = getLeaderboard()
  const meInLb = lb.find(u => u.uid === user?.uid)
  const isAdmin = user?.uid === group?.adminId

  const statusBadge = (matchId: string) => {
    const match = FIXTURE.find(m => m.id === matchId)!
    if (getResult(matchId)) return <span style={{ fontSize:10, fontFamily:'Barlow Condensed,sans-serif', letterSpacing:2, textTransform:'uppercase', padding:'3px 7px', borderRadius:4, background:'rgba(167,139,250,.15)', color:'var(--purple)' }}>Finalizado</span>
    if (!canPredict(match)) return <span style={{ fontSize:10, fontFamily:'Barlow Condensed,sans-serif', letterSpacing:2, textTransform:'uppercase', padding:'3px 7px', borderRadius:4, background:'rgba(100,116,139,.15)', color:'var(--muted)' }}>Cerrado</span>
    const t = timeUntilLock(match)
    return <span style={{ fontSize:10, fontFamily:'Barlow Condensed,sans-serif', letterSpacing:2, textTransform:'uppercase', padding:'3px 7px', borderRadius:4, background:'rgba(16,185,129,.15)', color:'var(--green)' }}>Abierto{t ? ` · cierra en ${t}` : ''}</span>
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)', fontFamily:'Bebas Neue,cursive', fontSize:20, letterSpacing:3, position:'relative', zIndex:1 }}>
      ⚽ CARGANDO...
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', position:'relative', zIndex:1 }}>
      {/* Header */}
      <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'0 18px', display:'flex', alignItems:'center', justifyContent:'space-between', height:56, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={() => router.push('/dashboard')} style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:6, padding:'4px 9px', color:'var(--muted)', fontSize:11, cursor:'pointer', fontFamily:'Barlow,sans-serif' }}>← Grupos</button>
          <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:16, letterSpacing:2, color:'var(--accent)' }}>{group?.emoji} {group?.name}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:7, background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:20, padding:'4px 10px 4px 6px', fontSize:12 }}>
          <div style={{ width:22, height:22, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#ef4444)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#000' }}>{user?.username?.[0]?.toUpperCase()}</div>
          <span>{user?.username}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', background:'var(--surface)', borderBottom:'1px solid var(--border)', overflowX:'auto' }}>
        {(['posiciones','mis-pronos','fixture','miembros'] as Tab[]).map(t => (
          <div key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t==='posiciones'&&'🏆 Posiciones'}{t==='mis-pronos'&&'✏️ Mis Pronósticos'}{t==='fixture'&&'📋 Fixture'}{t==='miembros'&&'👥 Miembros'}
          </div>
        ))}
        {isAdmin && <div style={tabStyle('admin')} onClick={() => setTab('admin')}>⚙️ Admin</div>}
      </div>

      <div style={{ padding:18, maxWidth:860, margin:'0 auto', width:'100%' }}>

        {/* POSICIONES */}
        {tab === 'posiciones' && (
          <>
            <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:24, letterSpacing:2, marginBottom:16 }}>🏆 Posiciones</div>
            {meInLb && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:10, marginBottom:18 }}>
                {[['Mis Puntos', meInLb.pts], ['Exactos ⭐', meInLb.exact], ['Pronosticados', predictions.filter(p=>p.userId===user?.uid).length], ['Mi Posición', lb.findIndex(u=>u.uid===user?.uid)+1||'—']].map(([lbl, val]) => (
                  <div key={String(lbl)} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:14, textAlign:'center' }}>
                    <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:30, color:'var(--gold)', lineHeight:1 }}>{val}</div>
                    <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', marginTop:2 }}>{lbl}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
              <div style={{ display:'grid', gridTemplateColumns:'40px 1fr 55px 55px 55px', padding:'10px 16px', fontFamily:'Barlow Condensed,sans-serif', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', background:'var(--surface2)', borderBottom:'1px solid var(--border)' }}>
                <div>#</div><div>Jugador</div><div style={{textAlign:'center'}}>Pts</div><div style={{textAlign:'center'}}>⭐</div><div style={{textAlign:'center'}}>Jugados</div>
              </div>
              {lb.map((u, i) => (
                <div key={u.uid} style={{ ...lbRow, background: u.uid===user?.uid ? 'rgba(245,158,11,.05)' : undefined }}>
                  <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:18, color: i===0?'var(--gold)':i===1?'#94a3b8':i===2?'#b45309':'var(--muted)' }}>{i+1}</div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{u.name}{u.uid===user?.uid?' ←':''}{u.uid===group?.adminId?' 👑':''}</div>
                  <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:20, color:'var(--gold)', textAlign:'center' }}>{u.pts}</div>
                  <div style={{ textAlign:'center', fontSize:13, color:'var(--muted)' }}>{u.exact}</div>
                  <div style={{ textAlign:'center', fontSize:13, color:'var(--muted)' }}>{u.played}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* MIS PRONÓSTICOS */}
        {tab === 'mis-pronos' && (
          <>
            <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:24, letterSpacing:2, marginBottom:16 }}>✏️ Mis Pronósticos</div>
            {grupos.map(g => (
              <div key={g}>
                <div style={grupTitle}>Grupo {g}<div style={{ flex:1, height:1, background:'var(--border)' }} /></div>
                {FIXTURE.filter(m => m.grupo===g).map(match => {
                  const pred = getPred(match.id)
                  const res = getResult(match.id)
                  const can = canPredict(match) && !res
                  const pts = pred && res ? calcPoints(pred.goalsLocal, pred.goalsVisitor, res.goalsLocal, res.goalsVisitor) : null
                  return (
                    <div key={match.id} style={matchCard}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                        <span style={{ fontSize:11, color:'var(--muted)' }}>{formatMatchDate(match.fecha)}</span>
                        {statusBadge(match.id)}
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:8 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, fontWeight:600, fontSize:13 }}>
                          <span style={{ fontSize:20 }}>{match.flagLocal}</span>{match.local}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <input id={`pl_${match.id}`} style={scoreInp} type="number" min={0} max={20} defaultValue={pred?.goalsLocal??''} placeholder="0" disabled={!can} />
                          <span style={{ fontFamily:'Bebas Neue,cursive', fontSize:16, color:'var(--muted)' }}>:</span>
                          <input id={`pv_${match.id}`} style={scoreInp} type="number" min={0} max={20} defaultValue={pred?.goalsVisitor??''} placeholder="0" disabled={!can} />
                        </div>
                        <div style={{ display:'flex', alignItems:'center', flexDirection:'row-reverse', gap:6, fontWeight:600, fontSize:13 }}>
                          <span style={{ fontSize:20 }}>{match.flagVisitante}</span>{match.visitante}
                        </div>
                      </div>
                      {can && (
                        <button style={{ width:'100%', background:'var(--accent)', border:'none', borderRadius:6, padding:'7px 0', color:'#000', fontFamily:'Barlow Condensed,sans-serif', fontSize:12, fontWeight:700, letterSpacing:1, cursor:'pointer', marginTop:10 }}
                          onClick={() => savePrediction(match.id, (document.getElementById(`pl_${match.id}`) as HTMLInputElement)?.value, (document.getElementById(`pv_${match.id}`) as HTMLInputElement)?.value)}>
                          💾 {pred ? 'Actualizar' : 'Guardar'} pronóstico
                        </button>
                      )}
                      {!can && !res && pred && <div style={{ fontSize:11, color:'var(--accent)', marginTop:8, textAlign:'center' }}>🔒 Guardado: {pred.goalsLocal} - {pred.goalsVisitor}</div>}
                      {res && (
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8, paddingTop:8, borderTop:'1px solid var(--border)', fontSize:13 }}>
                          <span style={{ color:'var(--green)', fontWeight:600 }}>Real: {res.goalsLocal} - {res.goalsVisitor}</span>
                          {pts ? <span style={{ fontFamily:'Bebas Neue,cursive', fontSize:17, color: pts.tipo==='exact'?'var(--purple)':'var(--gold)' }}>{pts.tipo==='exact'?'⭐':pts.tipo==='result'?'✓':'✗'} +{pts.pts}pts</span>
                            : <span style={{ fontSize:12, color:'var(--muted)' }}>Sin pronóstico</span>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </>
        )}

        {/* FIXTURE */}
        {tab === 'fixture' && (
          <>
            <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:24, letterSpacing:2, marginBottom:16 }}>📋 Fixture</div>
            {grupos.map(g => (
              <div key={g}>
                <div style={grupTitle}>Grupo {g}<div style={{ flex:1, height:1, background:'var(--border)' }} /></div>
                {FIXTURE.filter(m => m.grupo===g).map(match => {
                  const res = getResult(match.id)
                  const total = predictions.filter(p => p.matchId===match.id).length
                  return (
                    <div key={match.id} style={matchCard}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                        <span style={{ fontSize:11, color:'var(--muted)' }}>{formatMatchDate(match.fecha)}</span>
                        {statusBadge(match.id)}
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:8 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, fontWeight:600, fontSize:13 }}><span style={{fontSize:20}}>{match.flagLocal}</span>{match.local}</div>
                        <div style={{ display:'flex', alignItems:'center' }}>
                          {res ? <span style={{ fontFamily:'Bebas Neue,cursive', fontSize:26, color:'var(--gold)' }}>{res.goalsLocal} : {res.goalsVisitor}</span>
                            : <span style={{ fontSize:15, color:'var(--muted)', padding:'0 8px' }}>vs</span>}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', flexDirection:'row-reverse', gap:6, fontWeight:600, fontSize:13 }}><span style={{fontSize:20}}>{match.flagVisitante}</span>{match.visitante}</div>
                      </div>
                      <div style={{ marginTop:8, fontSize:11, color:'var(--muted)', textAlign:'center' }}>👥 {total} pronóstico{total!==1?'s':''}</div>
                    </div>
                  )
                })}
              </div>
            ))}
          </>
        )}

        {/* MIEMBROS */}
        {tab === 'miembros' && (
          <>
            <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:24, letterSpacing:2, marginBottom:16 }}>👥 Miembros</div>
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>Código de invitación</div>
                <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:26, letterSpacing:6, color:'var(--gold)' }}>{group?.code}</div>
              </div>
              <button onClick={() => navigator.clipboard.writeText(group?.code||'').then(()=>showToast('¡Código copiado!','success'))}
                style={{ background:'var(--surface2)', border:'1px solid var(--accent)', borderRadius:6, padding:'8px 14px', color:'var(--accent)', fontFamily:'Barlow Condensed,sans-serif', fontSize:13, cursor:'pointer' }}>
                📋 Copiar
              </button>
            </div>
            {lb.map((u, i) => (
              <div key={u.uid} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#ef4444)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#000' }}>{u.name[0].toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14 }}>{u.name}{u.uid===user?.uid?' (vos)':''}</div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>#{i+1} · {u.played} partidos{u.uid===group?.adminId?' · 👑 Admin':''}</div>
                  </div>
                </div>
                <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:20, color:'var(--gold)' }}>{u.pts} pts</div>
              </div>
            ))}
          </>
        )}

        {/* ADMIN */}
        {tab === 'admin' && isAdmin && (
          <>
            <div style={{ fontFamily:'Bebas Neue,cursive', fontSize:24, letterSpacing:2, marginBottom:16 }}>⚙️ Panel Admin</div>
            <div style={{ background:'rgba(167,139,250,.08)', border:'1px solid rgba(167,139,250,.2)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'var(--purple)', marginBottom:16 }}>
              👑 Cargá los resultados. Los pronósticos se cierran 2 horas antes de cada partido.
            </div>
            {grupos.map(g => (
              <div key={g}>
                <div style={grupTitle}>Grupo {g}<div style={{ flex:1, height:1, background:'var(--border)' }} /></div>
                {FIXTURE.filter(m => m.grupo===g).map(match => {
                  const res = getResult(match.id)
                  return (
                    <div key={match.id} style={matchCard}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, fontWeight:600, fontSize:13 }}>
                        <span>{match.flagLocal} {match.local} vs {match.visitante} {match.flagVisitante}</span>
                        <span style={{ fontSize:11, color:'var(--muted)' }}>{formatMatchDate(match.fecha)}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <input id={`rl_${match.id}`} style={scoreInp} type="number" min={0} max={20} defaultValue={res?.goalsLocal??''} placeholder="0" />
                        <span style={{ fontFamily:'Bebas Neue,cursive', fontSize:16, color:'var(--muted)' }}>:</span>
                        <input id={`rv_${match.id}`} style={scoreInp} type="number" min={0} max={20} defaultValue={res?.goalsVisitor??''} placeholder="0" />
                        <span style={{ fontSize:12, color: res?'var(--green)':'var(--muted)', marginLeft:6 }}>{res?'✅ Cargado':'—'}</span>
                      </div>
                      <button style={{ width:'100%', background:'var(--green)', border:'none', borderRadius:6, padding:'8px 0', color:'#000', fontFamily:'Barlow Condensed,sans-serif', fontSize:13, fontWeight:700, letterSpacing:1, cursor:'pointer', marginTop:8 }}
                        onClick={() => saveResult(match.id, (document.getElementById(`rl_${match.id}`) as HTMLInputElement)?.value, (document.getElementById(`rv_${match.id}`) as HTMLInputElement)?.value)}>
                        {res ? '✏️ Actualizar' : '✅ Confirmar'} resultado
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:20, right:20, background:'var(--surface)', borderRadius:10, padding:'12px 18px', fontSize:13, zIndex:1000, boxShadow:'0 4px 20px rgba(0,0,0,.3)',
          border: toast.type==='success'?'1px solid rgba(16,185,129,.4)':toast.type==='error'?'1px solid rgba(239,68,68,.4)':'1px solid rgba(245,158,11,.4)',
          color: toast.type==='success'?'var(--green)':toast.type==='error'?'var(--accent2)':'var(--accent)' }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
