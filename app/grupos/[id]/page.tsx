'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, getDocs, setDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import {
  FIXTURE, KNOCKOUT_TEMPLATE, KNOCKOUT_FASE_LABELS,
  canPredict, calcPointsGroup, calcPointsKnockout, formatMatchDate, timeUntilLock,
  type KnockoutMatch,
} from '@/lib/fixture'

type Tab = 'posiciones' | 'mis-pronos' | 'eliminatorias' | 'fixture' | 'miembros' | 'admin'

interface UserProfile { uid: string; username: string }
interface Group { id: string; name: string; emoji: string; code: string; adminId: string; members: string[] }
interface Prediction { matchId: string; goalsLocal: number; goalsVisitor: number; userId: string }
interface MatchResult { matchId: string; goalsLocal: number; goalsVisitor: number }
interface KnockoutPred { matchId: string; userId: string; winnerId: string; penalties: boolean }
interface KnockoutResult { matchId: string; winnerId: string; penalties: boolean; teamA: string; teamB: string; flagA: string; flagB: string }

export default function GroupPage() {
  const router = useRouter()
  const { id: groupId } = useParams() as { id: string }

  const [user, setUser] = useState<UserProfile | null>(null)
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<UserProfile[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [results, setResults] = useState<MatchResult[]>([])
  const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatch[]>([])
  const [knockoutPreds, setKnockoutPreds] = useState<KnockoutPred[]>([])
  const [knockoutResults, setKnockoutResults] = useState<KnockoutResult[]>([])
  const [tab, setTab] = useState<Tab>('posiciones')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)

  const showToast = (msg: string, type = 'info') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const loadData = useCallback(async (uid: string) => {
    const gSnap = await getDoc(doc(db, 'groups', groupId))
    if (!gSnap.exists()) { router.replace('/dashboard'); return }
    const g = { id: gSnap.id, ...gSnap.data() } as Group
    setGroup(g)

    const memberProfiles = await Promise.all(
      g.members.map(async (uid: string) => {
        const snap = await getDoc(doc(db, 'users', uid))
        return { uid, username: snap.data()?.username || 'Usuario' }
      })
    )
    setMembers(memberProfiles)

    const [predsSnap, resSnap, koMatchSnap, koPredSnap, koResSnap] = await Promise.all([
      getDocs(collection(db, 'groups', groupId, 'predictions')),
      getDocs(collection(db, 'groups', groupId, 'results')),
      getDocs(collection(db, 'groups', groupId, 'knockoutMatches')),
      getDocs(collection(db, 'groups', groupId, 'knockoutPredictions')),
      getDocs(collection(db, 'groups', groupId, 'knockoutResults')),
    ])

    setPredictions(predsSnap.docs.map(d => d.data() as Prediction))
    setResults(resSnap.docs.map(d => d.data() as MatchResult))
    setKnockoutPreds(koPredSnap.docs.map(d => d.data() as KnockoutPred))
    setKnockoutResults(koResSnap.docs.map(d => d.data() as KnockoutResult))

    // Merge template with saved admin data
    const savedMatches: Record<string, KnockoutMatch> = {}
    koMatchSnap.docs.forEach(d => { savedMatches[d.id] = d.data() as KnockoutMatch })
    setKnockoutMatches(KNOCKOUT_TEMPLATE.map(m => savedMatches[m.id] ? { ...m, ...savedMatches[m.id] } : m))

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

  const isAdmin = user?.uid === group?.adminId
  const getPred = (matchId: string) => predictions.find(p => p.matchId === matchId && p.userId === user?.uid)
  const getResult = (matchId: string) => results.find(r => r.matchId === matchId)
  const getKoPred = (matchId: string) => knockoutPreds.find(p => p.matchId === matchId && p.userId === user?.uid)
  const getKoResult = (matchId: string) => knockoutResults.find(r => r.matchId === matchId)

  function getLeaderboard() {
    const scores: Record<string, { uid: string; name: string; pts: number; exact: number; result: number; played: number }> = {}
    members.forEach(m => { scores[m.uid] = { uid: m.uid, name: m.username, pts: 0, exact: 0, result: 0, played: 0 } })

    // Group stage points
    results.forEach(res => {
      predictions.filter(p => p.matchId === res.matchId).forEach(pred => {
        if (!scores[pred.userId]) return
        const { pts, tipo } = calcPointsGroup(pred.goalsLocal, pred.goalsVisitor, res.goalsLocal, res.goalsVisitor)
        scores[pred.userId].pts += pts
        scores[pred.userId].played++
        if (tipo === 'exact') scores[pred.userId].exact++
        if (tipo === 'result') scores[pred.userId].result++
      })
    })

    // Knockout points
    knockoutResults.forEach(res => {
      knockoutPreds.filter(p => p.matchId === res.matchId).forEach(pred => {
        if (!scores[pred.userId]) return
        const pts = calcPointsKnockout(pred.winnerId, pred.penalties, res.winnerId, res.penalties)
        scores[pred.userId].pts += pts
        scores[pred.userId].played++
      })
    })

    return Object.values(scores).sort((a, b) => b.pts - a.pts || b.exact - a.exact)
  }

  async function savePrediction(matchId: string, l: string, v: string) {
    if (l === '' || v === '' || !user) return showToast('Ingresá ambos valores', 'error')
    const match = FIXTURE.find(m => m.id === matchId)!
    if (!canPredict(match.fecha)) return showToast('El pronóstico ya está cerrado', 'error')
    await setDoc(doc(db, 'groups', groupId, 'predictions', `${user.uid}_${matchId}`), {
      matchId, userId: user.uid, goalsLocal: parseInt(l), goalsVisitor: parseInt(v), updatedAt: serverTimestamp()
    })
    showToast('✅ Pronóstico guardado!', 'success')
    loadData(user.uid)
  }

  async function saveResult(matchId: string, l: string, v: string) {
    if (l === '' || v === '' || !user) return showToast('Ingresá ambos valores', 'error')
    await setDoc(doc(db, 'groups', groupId, 'results', matchId), {
      matchId, goalsLocal: parseInt(l), goalsVisitor: parseInt(v), updatedAt: serverTimestamp()
    })
    showToast('✅ Resultado guardado!', 'success')
    loadData(user.uid)
  }

  async function saveKnockoutPred(matchId: string, winnerId: string, penalties: boolean) {
    if (!user || !winnerId) return showToast('Seleccioná un ganador', 'error')
    const match = knockoutMatches.find(m => m.id === matchId)!
    if (!canPredict(match.fecha)) return showToast('El pronóstico ya está cerrado', 'error')
    await setDoc(doc(db, 'groups', groupId, 'knockoutPredictions', `${user.uid}_${matchId}`), {
      matchId, userId: user.uid, winnerId, penalties, updatedAt: serverTimestamp()
    })
    showToast('✅ Pronóstico guardado!', 'success')
    loadData(user.uid)
  }

  async function saveKnockoutResult(matchId: string, winnerId: string, penalties: boolean) {
    if (!user || !winnerId) return showToast('Seleccioná un ganador', 'error')
    const match = knockoutMatches.find(m => m.id === matchId)!
    await setDoc(doc(db, 'groups', groupId, 'knockoutResults', matchId), {
      matchId, winnerId, penalties,
      teamA: match.teamA, teamB: match.teamB, flagA: match.flagA, flagB: match.flagB,
      updatedAt: serverTimestamp()
    })
    showToast('✅ Resultado guardado!', 'success')
    loadData(user.uid)
  }

  async function saveKnockoutMatch(matchId: string, teamA: string, teamB: string, flagA: string, flagB: string) {
    if (!teamA || !teamB) return showToast('Ingresá ambos equipos', 'error')
    await setDoc(doc(db, 'groups', groupId, 'knockoutMatches', matchId), {
      matchId, teamA, teamB, flagA, flagB, updatedAt: serverTimestamp()
    })
    showToast('✅ Equipos guardados!', 'success')
    loadData(user!.uid)
  }

  // ── STYLES ──
  const scoreInp: React.CSSProperties = { width: 40, height: 40, background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontFamily: 'Bebas Neue,cursive', fontSize: 22, textAlign: 'center', outline: 'none' }
  const matchCard: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }
  const grupTitle: React.CSSProperties = { fontFamily: 'Barlow Condensed,sans-serif', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--muted)', margin: '20px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }
  const tabStyle = (t: Tab): React.CSSProperties => ({ flexShrink: 0, padding: '12px 18px', fontFamily: 'Barlow Condensed,sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent', color: tab === t ? 'var(--accent)' : 'var(--muted)', whiteSpace: 'nowrap' })
  const lbRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: '40px 1fr 55px 55px 55px', padding: '12px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center' }
  const btnTeam = (selected: boolean): React.CSSProperties => ({ flex: 1, padding: '10px 8px', borderRadius: 8, border: selected ? '2px solid var(--accent)' : '2px solid var(--border)', background: selected ? 'rgba(245,158,11,.12)' : 'var(--surface2)', color: selected ? 'var(--accent)' : 'var(--text)', fontFamily: 'Barlow,sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'center', transition: 'all .15s' })
  const btnPenalties = (selected: boolean, val: boolean): React.CSSProperties => ({ flex: 1, padding: '8px', borderRadius: 8, border: selected ? '2px solid var(--purple)' : '2px solid var(--border)', background: selected ? 'rgba(167,139,250,.12)' : 'var(--surface2)', color: selected ? 'var(--purple)' : 'var(--muted)', fontFamily: 'Barlow Condensed,sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', textAlign: 'center', transition: 'all .15s' })

  const grupos = [...new Set(FIXTURE.map(m => m.grupo))]
  const lb = getLeaderboard()
  const meInLb = lb.find(u => u.uid === user?.uid)
  const fases = ['dieciseisavos', 'octavos', 'cuartos', 'semifinal', 'tercero', 'final']

  const statusBadge = (fecha: string, hasResult: boolean) => {
    if (hasResult) return <span style={{ fontSize: 10, fontFamily: 'Barlow Condensed,sans-serif', letterSpacing: 2, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 4, background: 'rgba(167,139,250,.15)', color: 'var(--purple)' }}>Finalizado</span>
    if (!canPredict(fecha)) return <span style={{ fontSize: 10, fontFamily: 'Barlow Condensed,sans-serif', letterSpacing: 2, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 4, background: 'rgba(100,116,139,.15)', color: 'var(--muted)' }}>Cerrado</span>
    const t = timeUntilLock(fecha)
    return <span style={{ fontSize: 10, fontFamily: 'Barlow Condensed,sans-serif', letterSpacing: 2, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 4, background: 'rgba(16,185,129,.15)', color: 'var(--green)' }}>Abierto{t ? ` · ${t}` : ''}</span>
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: 'Bebas Neue,cursive', fontSize: 20, letterSpacing: 3, position: 'relative', zIndex: 1 }}>⚽ CARGANDO...</div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 9px', color: 'var(--muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'Barlow,sans-serif' }}>← Grupos</button>
          <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 16, letterSpacing: 2, color: 'var(--accent)' }}>{group?.emoji} {group?.name}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 10px 4px 6px', fontSize: 12 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#000' }}>{user?.username?.[0]?.toUpperCase()}</div>
          <span>{user?.username}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--surface)', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {(['posiciones', 'mis-pronos', 'eliminatorias', 'fixture', 'miembros'] as Tab[]).map(t => (
          <div key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t === 'posiciones' && '🏆 Posiciones'}
            {t === 'mis-pronos' && '✏️ Grupos'}
            {t === 'eliminatorias' && '⚔️ Llaves'}
            {t === 'fixture' && '📋 Fixture'}
            {t === 'miembros' && '👥 Miembros'}
          </div>
        ))}
        {isAdmin && <div style={tabStyle('admin')} onClick={() => setTab('admin')}>⚙️ Admin</div>}
      </div>

      <div style={{ padding: 18, maxWidth: 860, margin: '0 auto', width: '100%' }}>

        {/* ── POSICIONES ── */}
        {tab === 'posiciones' && (
          <>
            <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>🏆 Posiciones</div>
            {meInLb && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 10, marginBottom: 18 }}>
                {[['Mis Puntos', meInLb.pts], ['Exactos ⭐', meInLb.exact], ['Pronosticados', predictions.filter(p => p.userId === user?.uid).length + knockoutPreds.filter(p => p.userId === user?.uid).length], ['Mi Posición', lb.findIndex(u => u.uid === user?.uid) + 1 || '—']].map(([lbl, val]) => (
                  <div key={String(lbl)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 30, color: 'var(--gold)', lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginTop: 2 }}>{lbl}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 55px 55px 55px', padding: '10px 16px', fontFamily: 'Barlow Condensed,sans-serif', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                <div>#</div><div>Jugador</div><div style={{ textAlign: 'center' }}>Pts</div><div style={{ textAlign: 'center' }}>⭐</div><div style={{ textAlign: 'center' }}>Jugados</div>
              </div>
              {lb.map((u, i) => (
                <div key={u.uid} style={{ ...lbRow, background: u.uid === user?.uid ? 'rgba(245,158,11,.05)' : undefined }}>
                  <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 18, color: i === 0 ? 'var(--gold)' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : 'var(--muted)' }}>{i + 1}</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}{u.uid === user?.uid ? ' ←' : ''}{u.uid === group?.adminId ? ' 👑' : ''}</div>
                  <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 20, color: 'var(--gold)', textAlign: 'center' }}>{u.pts}</div>
                  <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>{u.exact}</div>
                  <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>{u.played}</div>
                </div>
              ))}
            </div>
            {/* Leyenda puntos */}
            <div style={{ marginTop: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8, fontFamily: 'Barlow Condensed,sans-serif' }}>Sistema de puntos</div>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 2 }}>
                <div>⭐ <strong>Grupos:</strong> Marcador exacto = 3pts · Resultado correcto = 1pt</div>
                <div>⚔️ <strong>Eliminatorias:</strong> Acertar ganador = 3pts · Acertar penales (sí o no) = +2pts</div>
              </div>
            </div>
          </>
        )}

        {/* ── PRONÓSTICOS GRUPOS ── */}
        {tab === 'mis-pronos' && (
          <>
            <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>✏️ Pronósticos · Fase de Grupos</div>
            {grupos.map(g => (
              <div key={g}>
                <div style={grupTitle}>Grupo {g}<div style={{ flex: 1, height: 1, background: 'var(--border)' }} /></div>
                {FIXTURE.filter(m => m.grupo === g).map(match => {
                  const pred = getPred(match.id)
                  const res = getResult(match.id)
                  const can = canPredict(match.fecha) && !res
                  const pts = pred && res ? calcPointsGroup(pred.goalsLocal, pred.goalsVisitor, res.goalsLocal, res.goalsVisitor) : null
                  return (
                    <div key={match.id} style={matchCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{formatMatchDate(match.fecha)}</span>
                        {statusBadge(match.fecha, !!res)}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13 }}><span style={{ fontSize: 20 }}>{match.flagLocal}</span>{match.local}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input id={`pl_${match.id}`} style={scoreInp} type="number" min={0} max={20} defaultValue={pred?.goalsLocal ?? ''} placeholder="0" disabled={!can} />
                          <span style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 16, color: 'var(--muted)' }}>:</span>
                          <input id={`pv_${match.id}`} style={scoreInp} type="number" min={0} max={20} defaultValue={pred?.goalsVisitor ?? ''} placeholder="0" disabled={!can} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', gap: 6, fontWeight: 600, fontSize: 13 }}><span style={{ fontSize: 20 }}>{match.flagVisitante}</span>{match.visitante}</div>
                      </div>
                      {can && (
                        <button style={{ width: '100%', background: 'var(--accent)', border: 'none', borderRadius: 6, padding: '7px 0', color: '#000', fontFamily: 'Barlow Condensed,sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', marginTop: 10 }}
                          onClick={() => savePrediction(match.id, (document.getElementById(`pl_${match.id}`) as HTMLInputElement)?.value, (document.getElementById(`pv_${match.id}`) as HTMLInputElement)?.value)}>
                          💾 {pred ? 'Actualizar' : 'Guardar'} pronóstico
                        </button>
                      )}
                      {!can && !res && pred && <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 8, textAlign: 'center' }}>🔒 Guardado: {pred.goalsLocal} - {pred.goalsVisitor}</div>}
                      {res && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: 13 }}>
                          <span style={{ color: 'var(--green)', fontWeight: 600 }}>Real: {res.goalsLocal} - {res.goalsVisitor}</span>
                          {pts ? <span style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 17, color: pts.tipo === 'exact' ? 'var(--purple)' : 'var(--gold)' }}>{pts.tipo === 'exact' ? '⭐' : pts.tipo === 'result' ? '✓' : '✗'} +{pts.pts}pts</span>
                            : <span style={{ fontSize: 12, color: 'var(--muted)' }}>Sin pronóstico</span>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </>
        )}

        {/* ── ELIMINATORIAS ── */}
        {tab === 'eliminatorias' && (
          <>
            <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 24, letterSpacing: 2, marginBottom: 8 }}>⚔️ Fase Eliminatoria</div>
            <div style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--accent)', marginBottom: 16 }}>
              🏅 <strong>3 pts</strong> por acertar el ganador · <strong>+2 pts</strong> por acertar si hay o no penales
            </div>
            {fases.map(fase => {
              const matches = knockoutMatches.filter(m => m.fase === fase)
              return (
                <div key={fase}>
                  <div style={grupTitle}>{KNOCKOUT_FASE_LABELS[fase]}<div style={{ flex: 1, height: 1, background: 'var(--border)' }} /></div>
                  {matches.map(match => {
                    const pred = getKoPred(match.id)
                    const res = getKoResult(match.id)
                    const hasTeams = !!(match.teamA && match.teamB)
                    const can = canPredict(match.fecha) && !res && hasTeams
                    const pts = pred && res ? calcPointsKnockout(pred.winnerId, pred.penalties, res.winnerId, res.penalties) : null
                    const [selWinner, setSelWinner] = useState(pred?.winnerId || '')
                    const [selPenalties, setSelPenalties] = useState<boolean | null>(pred?.penalties ?? null)

                    return (
                      <div key={match.id} style={matchCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <div>
                            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{formatMatchDate(match.fecha)}</span>
                            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 8 }}>· {match.estadio}</span>
                          </div>
                          {statusBadge(match.fecha, !!res)}
                        </div>

                        {!hasTeams ? (
                          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--muted)', fontSize: 13 }}>
                            ⏳ {match.label} — equipos por confirmar
                          </div>
                        ) : (
                          <>
                            {/* Equipos */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12, fontSize: 14, fontWeight: 700 }}>
                              <span>{match.flagA} {match.teamA}</span>
                              <span style={{ color: 'var(--muted)', fontFamily: 'Bebas Neue,cursive', fontSize: 18 }}>vs</span>
                              <span>{match.teamB} {match.flagB}</span>
                            </div>

                            {can ? (
                              <>
                                {/* Selector ganador */}
                                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, fontFamily: 'Barlow Condensed,sans-serif' }}>¿Quién gana?</div>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                  <button style={btnTeam(selWinner === match.teamA)} onClick={() => setSelWinner(match.teamA)}>
                                    {match.flagA} {match.teamA}
                                  </button>
                                  <button style={btnTeam(selWinner === match.teamB)} onClick={() => setSelWinner(match.teamB)}>
                                    {match.flagB} {match.teamB}
                                  </button>
                                </div>
                                {/* Selector penales */}
                                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, fontFamily: 'Barlow Condensed,sans-serif' }}>¿Va a penales?</div>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                  <button style={btnPenalties(selPenalties === true, true)} onClick={() => setSelPenalties(true)}>🥅 SÍ, penales</button>
                                  <button style={btnPenalties(selPenalties === false, false)} onClick={() => setSelPenalties(false)}>⚡ NO, en tiempo reglamentario</button>
                                </div>
                                <button
                                  style={{ width: '100%', background: selWinner && selPenalties !== null ? 'var(--accent)' : 'var(--surface2)', border: 'none', borderRadius: 6, padding: '8px 0', color: selWinner && selPenalties !== null ? '#000' : 'var(--muted)', fontFamily: 'Barlow Condensed,sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: selWinner && selPenalties !== null ? 'pointer' : 'not-allowed', marginTop: 4 }}
                                  onClick={() => { if (selWinner && selPenalties !== null) saveKnockoutPred(match.id, selWinner, selPenalties) }}
                                  disabled={!selWinner || selPenalties === null}>
                                  💾 {pred ? 'Actualizar' : 'Guardar'} pronóstico
                                </button>
                              </>
                            ) : (
                              <>
                                {/* Mostrar pronóstico guardado o resultado */}
                                {pred && !res && (
                                  <div style={{ background: 'rgba(245,158,11,.08)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--accent)', textAlign: 'center' }}>
                                    🔒 Tu pronóstico: <strong>{pred.winnerId}</strong> gana · {pred.penalties ? '🥅 Con penales' : '⚡ Sin penales'}
                                  </div>
                                )}
                                {res && (
                                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600, marginBottom: 4 }}>
                                      ✅ Ganó: {res.winnerId} · {res.penalties ? '🥅 Fue a penales' : '⚡ No fue a penales'}
                                    </div>
                                    {pred ? (
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                                          Tu pronóstico: {pred.winnerId} · {pred.penalties ? 'Con penales' : 'Sin penales'}
                                        </div>
                                        <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 20, color: 'var(--gold)' }}>+{pts ?? 0}pts</div>
                                      </div>
                                    ) : <div style={{ fontSize: 12, color: 'var(--muted)' }}>Sin pronóstico</div>}
                                  </div>
                                )}
                                {!pred && !res && hasTeams && (
                                  <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', padding: '8px 0' }}>⏰ Pronóstico cerrado</div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </>
        )}

        {/* ── FIXTURE ── */}
        {tab === 'fixture' && (
          <>
            <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>📋 Fixture · Fase de Grupos</div>
            {grupos.map(g => (
              <div key={g}>
                <div style={grupTitle}>Grupo {g}<div style={{ flex: 1, height: 1, background: 'var(--border)' }} /></div>
                {FIXTURE.filter(m => m.grupo === g).map(match => {
                  const res = getResult(match.id)
                  const total = predictions.filter(p => p.matchId === match.id).length
                  return (
                    <div key={match.id} style={matchCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{formatMatchDate(match.fecha)} · {match.estadio}</span>
                        {statusBadge(match.fecha, !!res)}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13 }}><span style={{ fontSize: 20 }}>{match.flagLocal}</span>{match.local}</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {res ? <span style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 26, color: 'var(--gold)' }}>{res.goalsLocal} : {res.goalsVisitor}</span>
                            : <span style={{ fontSize: 15, color: 'var(--muted)', padding: '0 8px' }}>vs</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', gap: 6, fontWeight: 600, fontSize: 13 }}><span style={{ fontSize: 20 }}>{match.flagVisitante}</span>{match.visitante}</div>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>👥 {total} pronóstico{total !== 1 ? 's' : ''}</div>
                    </div>
                  )
                })}
              </div>
            ))}
          </>
        )}

        {/* ── MIEMBROS ── */}
        {tab === 'miembros' && (
          <>
            <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>👥 Miembros</div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Código de invitación</div>
                <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 26, letterSpacing: 6, color: 'var(--gold)' }}>{group?.code}</div>
              </div>
              <button onClick={() => navigator.clipboard.writeText(group?.code || '').then(() => showToast('Código copiado!', 'success'))}
                style={{ background: 'var(--surface2)', border: '1px solid var(--accent)', borderRadius: 6, padding: '8px 14px', color: 'var(--accent)', fontFamily: 'Barlow Condensed,sans-serif', fontSize: 13, cursor: 'pointer' }}>
                📋 Copiar
              </button>
            </div>
            {lb.map((u, i) => (
              <div key={u.uid} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000' }}>{u.name[0].toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}{u.uid === user?.uid ? ' (vos)' : ''}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>#{i + 1} · {u.played} partidos{u.uid === group?.adminId ? ' · 👑 Admin' : ''}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 20, color: 'var(--gold)' }}>{u.pts} pts</div>
              </div>
            ))}
          </>
        )}

        {/* ── ADMIN ── */}
        {tab === 'admin' && isAdmin && (
          <>
            <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>⚙️ Panel Admin</div>

            {/* Admin grupos */}
            <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 18, letterSpacing: 2, marginBottom: 12, color: 'var(--accent)' }}>Resultados · Fase de Grupos</div>
            <div style={{ background: 'rgba(167,139,250,.08)', border: '1px solid rgba(167,139,250,.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--purple)', marginBottom: 16 }}>
              👑 Cargá los resultados. Los pronósticos se cierran 2 horas antes de cada partido.
            </div>
            {grupos.map(g => (
              <div key={g}>
                <div style={grupTitle}>Grupo {g}<div style={{ flex: 1, height: 1, background: 'var(--border)' }} /></div>
                {FIXTURE.filter(m => m.grupo === g).map(match => {
                  const res = getResult(match.id)
                  return (
                    <div key={match.id} style={matchCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontWeight: 600, fontSize: 13 }}>
                        <span>{match.flagLocal} {match.local} vs {match.visitante} {match.flagVisitante}</span>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{formatMatchDate(match.fecha)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input id={`rl_${match.id}`} style={scoreInp} type="number" min={0} max={20} defaultValue={res?.goalsLocal ?? ''} placeholder="0" />
                        <span style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 16, color: 'var(--muted)' }}>:</span>
                        <input id={`rv_${match.id}`} style={scoreInp} type="number" min={0} max={20} defaultValue={res?.goalsVisitor ?? ''} placeholder="0" />
                        <span style={{ fontSize: 12, color: res ? 'var(--green)' : 'var(--muted)', marginLeft: 6 }}>{res ? '✅' : '—'}</span>
                      </div>
                      <button style={{ width: '100%', background: 'var(--green)', border: 'none', borderRadius: 6, padding: '8px 0', color: '#000', fontFamily: 'Barlow Condensed,sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', marginTop: 8 }}
                        onClick={() => saveResult(match.id, (document.getElementById(`rl_${match.id}`) as HTMLInputElement)?.value, (document.getElementById(`rv_${match.id}`) as HTMLInputElement)?.value)}>
                        {res ? '✏️ Actualizar' : '✅ Confirmar'} resultado
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Admin eliminatorias */}
            <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 18, letterSpacing: 2, margin: '24px 0 12px', color: 'var(--accent)' }}>Eliminatorias · Equipos y Resultados</div>
            <div style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--accent)', marginBottom: 16 }}>
              ⚔️ Primero cargá los equipos de cada cruce. Después, una vez jugado, cargá quién ganó y si fue a penales.
            </div>
            {fases.map(fase => {
              const matches = knockoutMatches.filter(m => m.fase === fase)
              return (
                <div key={fase}>
                  <div style={grupTitle}>{KNOCKOUT_FASE_LABELS[fase]}<div style={{ flex: 1, height: 1, background: 'var(--border)' }} /></div>
                  {matches.map(match => {
                    const res = getKoResult(match.id)
                    const hasTeams = !!(match.teamA && match.teamB)
                    const [adminWinner, setAdminWinner] = useState(res?.winnerId || '')
                    const [adminPenalties, setAdminPenalties] = useState<boolean | null>(res?.penalties ?? null)

                    return (
                      <div key={match.id} style={{ ...matchCard, borderColor: hasTeams ? 'var(--border)' : 'rgba(245,158,11,.2)' }}>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>{match.label} · {formatMatchDate(match.fecha)}</div>

                        {/* Cargar equipos */}
                        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, fontFamily: 'Barlow Condensed,sans-serif' }}>Equipos</div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                          <input id={`ka_${match.id}`} defaultValue={match.teamA} placeholder="Equipo A (ej: Argentina 🇦🇷)" style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--text)', fontFamily: 'Barlow,sans-serif', fontSize: 13, outline: 'none' }} />
                          <input id={`kb_${match.id}`} defaultValue={match.teamB} placeholder="Equipo B (ej: Francia 🇫🇷)" style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--text)', fontFamily: 'Barlow,sans-serif', fontSize: 13, outline: 'none' }} />
                          <button style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', color: 'var(--text)', fontFamily: 'Barlow Condensed,sans-serif', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            onClick={() => {
                              const a = (document.getElementById(`ka_${match.id}`) as HTMLInputElement)?.value
                              const b = (document.getElementById(`kb_${match.id}`) as HTMLInputElement)?.value
                              saveKnockoutMatch(match.id, a, b, '', '')
                            }}>💾 Guardar</button>
                        </div>

                        {/* Cargar resultado */}
                        {hasTeams && (
                          <>
                            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, fontFamily: 'Barlow Condensed,sans-serif' }}>Resultado</div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                              <button style={btnTeam(adminWinner === match.teamA)} onClick={() => setAdminWinner(match.teamA)}>
                                {match.flagA} {match.teamA}
                              </button>
                              <button style={btnTeam(adminWinner === match.teamB)} onClick={() => setAdminWinner(match.teamB)}>
                                {match.flagB} {match.teamB}
                              </button>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                              <button style={btnPenalties(adminPenalties === true, true)} onClick={() => setAdminPenalties(true)}>🥅 SÍ, fue a penales</button>
                              <button style={btnPenalties(adminPenalties === false, false)} onClick={() => setAdminPenalties(false)}>⚡ NO, tiempo reglamentario</button>
                            </div>
                            <button style={{ width: '100%', background: adminWinner && adminPenalties !== null ? 'var(--green)' : 'var(--surface2)', border: 'none', borderRadius: 6, padding: '8px 0', color: adminWinner && adminPenalties !== null ? '#000' : 'var(--muted)', fontFamily: 'Barlow Condensed,sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: adminWinner && adminPenalties !== null ? 'pointer' : 'not-allowed' }}
                              onClick={() => { if (adminWinner && adminPenalties !== null) saveKnockoutResult(match.id, adminWinner, adminPenalties) }}
                              disabled={!adminWinner || adminPenalties === null}>
                              {res ? '✏️ Actualizar' : '✅ Confirmar'} resultado
                            </button>
                            {res && <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 6, textAlign: 'center' }}>✅ {res.winnerId} · {res.penalties ? 'Con penales' : 'Sin penales'}</div>}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: 'var(--surface)', borderRadius: 10, padding: '12px 18px', fontSize: 13, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,.3)', border: toast.type === 'success' ? '1px solid rgba(16,185,129,.4)' : toast.type === 'error' ? '1px solid rgba(239,68,68,.4)' : '1px solid rgba(245,158,11,.4)', color: toast.type === 'success' ? 'var(--green)' : toast.type === 'error' ? 'var(--accent2)' : 'var(--accent)' }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
