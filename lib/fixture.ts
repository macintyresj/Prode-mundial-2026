export interface Match {
  id: string
  grupo: string
  fecha: string
  local: string
  visitante: string
  flagLocal: string
  flagVisitante: string
}

export const FIXTURE: Match[] = [
  { id:'A1', grupo:'A', fecha:'2026-06-11T18:00:00', local:'México', visitante:'Ecuador', flagLocal:'🇲🇽', flagVisitante:'🇪🇨' },
  { id:'A2', grupo:'A', fecha:'2026-06-11T21:00:00', local:'Estados Unidos', visitante:'Canadá', flagLocal:'🇺🇸', flagVisitante:'🇨🇦' },
  { id:'A3', grupo:'A', fecha:'2026-06-15T18:00:00', local:'México', visitante:'Canadá', flagLocal:'🇲🇽', flagVisitante:'🇨🇦' },
  { id:'A4', grupo:'A', fecha:'2026-06-15T21:00:00', local:'Ecuador', visitante:'Estados Unidos', flagLocal:'🇪🇨', flagVisitante:'🇺🇸' },
  { id:'A5', grupo:'A', fecha:'2026-06-19T20:00:00', local:'México', visitante:'Estados Unidos', flagLocal:'🇲🇽', flagVisitante:'🇺🇸' },
  { id:'A6', grupo:'A', fecha:'2026-06-19T20:00:00', local:'Canadá', visitante:'Ecuador', flagLocal:'🇨🇦', flagVisitante:'🇪🇨' },
  { id:'B1', grupo:'B', fecha:'2026-06-12T18:00:00', local:'España', visitante:'Brasil', flagLocal:'🇪🇸', flagVisitante:'🇧🇷' },
  { id:'B2', grupo:'B', fecha:'2026-06-12T21:00:00', local:'Alemania', visitante:'Japón', flagLocal:'🇩🇪', flagVisitante:'🇯🇵' },
  { id:'B3', grupo:'B', fecha:'2026-06-16T18:00:00', local:'España', visitante:'Japón', flagLocal:'🇪🇸', flagVisitante:'🇯🇵' },
  { id:'B4', grupo:'B', fecha:'2026-06-16T21:00:00', local:'Brasil', visitante:'Alemania', flagLocal:'🇧🇷', flagVisitante:'🇩🇪' },
  { id:'B5', grupo:'B', fecha:'2026-06-20T20:00:00', local:'España', visitante:'Alemania', flagLocal:'🇪🇸', flagVisitante:'🇩🇪' },
  { id:'B6', grupo:'B', fecha:'2026-06-20T20:00:00', local:'Japón', visitante:'Brasil', flagLocal:'🇯🇵', flagVisitante:'🇧🇷' },
  { id:'C1', grupo:'C', fecha:'2026-06-12T18:00:00', local:'Argentina', visitante:'Chile', flagLocal:'🇦🇷', flagVisitante:'🇨🇱' },
  { id:'C2', grupo:'C', fecha:'2026-06-12T21:00:00', local:'Portugal', visitante:'Uruguay', flagLocal:'🇵🇹', flagVisitante:'🇺🇾' },
  { id:'C3', grupo:'C', fecha:'2026-06-16T18:00:00', local:'Argentina', visitante:'Uruguay', flagLocal:'🇦🇷', flagVisitante:'🇺🇾' },
  { id:'C4', grupo:'C', fecha:'2026-06-16T21:00:00', local:'Chile', visitante:'Portugal', flagLocal:'🇨🇱', flagVisitante:'🇵🇹' },
  { id:'C5', grupo:'C', fecha:'2026-06-20T20:00:00', local:'Argentina', visitante:'Portugal', flagLocal:'🇦🇷', flagVisitante:'🇵🇹' },
  { id:'C6', grupo:'C', fecha:'2026-06-20T20:00:00', local:'Uruguay', visitante:'Chile', flagLocal:'🇺🇾', flagVisitante:'🇨🇱' },
  { id:'D1', grupo:'D', fecha:'2026-06-13T18:00:00', local:'Francia', visitante:'Polonia', flagLocal:'🇫🇷', flagVisitante:'🇵🇱' },
  { id:'D2', grupo:'D', fecha:'2026-06-13T21:00:00', local:'Inglaterra', visitante:'Países Bajos', flagLocal:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagVisitante:'🇳🇱' },
  { id:'D3', grupo:'D', fecha:'2026-06-17T18:00:00', local:'Francia', visitante:'Países Bajos', flagLocal:'🇫🇷', flagVisitante:'🇳🇱' },
  { id:'D4', grupo:'D', fecha:'2026-06-17T21:00:00', local:'Polonia', visitante:'Inglaterra', flagLocal:'🇵🇱', flagVisitante:'🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id:'D5', grupo:'D', fecha:'2026-06-21T20:00:00', local:'Francia', visitante:'Inglaterra', flagLocal:'🇫🇷', flagVisitante:'🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id:'D6', grupo:'D', fecha:'2026-06-21T20:00:00', local:'Países Bajos', visitante:'Polonia', flagLocal:'🇳🇱', flagVisitante:'🇵🇱' },
  { id:'E1', grupo:'E', fecha:'2026-06-13T18:00:00', local:'Bélgica', visitante:'Marruecos', flagLocal:'🇧🇪', flagVisitante:'🇲🇦' },
  { id:'E2', grupo:'E', fecha:'2026-06-13T21:00:00', local:'Croacia', visitante:'Senegal', flagLocal:'🇭🇷', flagVisitante:'🇸🇳' },
  { id:'E3', grupo:'E', fecha:'2026-06-17T18:00:00', local:'Bélgica', visitante:'Senegal', flagLocal:'🇧🇪', flagVisitante:'🇸🇳' },
  { id:'E4', grupo:'E', fecha:'2026-06-17T21:00:00', local:'Marruecos', visitante:'Croacia', flagLocal:'🇲🇦', flagVisitante:'🇭🇷' },
  { id:'E5', grupo:'E', fecha:'2026-06-21T20:00:00', local:'Bélgica', visitante:'Croacia', flagLocal:'🇧🇪', flagVisitante:'🇭🇷' },
  { id:'E6', grupo:'E', fecha:'2026-06-21T20:00:00', local:'Senegal', visitante:'Marruecos', flagLocal:'🇸🇳', flagVisitante:'🇲🇦' },
  { id:'F1', grupo:'F', fecha:'2026-06-14T18:00:00', local:'Italia', visitante:'Colombia', flagLocal:'🇮🇹', flagVisitante:'🇨🇴' },
  { id:'F2', grupo:'F', fecha:'2026-06-14T21:00:00', local:'Corea del Sur', visitante:'Nigeria', flagLocal:'🇰🇷', flagVisitante:'🇳🇬' },
  { id:'F3', grupo:'F', fecha:'2026-06-18T18:00:00', local:'Italia', visitante:'Nigeria', flagLocal:'🇮🇹', flagVisitante:'🇳🇬' },
  { id:'F4', grupo:'F', fecha:'2026-06-18T21:00:00', local:'Colombia', visitante:'Corea del Sur', flagLocal:'🇨🇴', flagVisitante:'🇰🇷' },
  { id:'F5', grupo:'F', fecha:'2026-06-22T20:00:00', local:'Italia', visitante:'Corea del Sur', flagLocal:'🇮🇹', flagVisitante:'🇰🇷' },
  { id:'F6', grupo:'F', fecha:'2026-06-22T20:00:00', local:'Nigeria', visitante:'Colombia', flagLocal:'🇳🇬', flagVisitante:'🇨🇴' },
  { id:'G1', grupo:'G', fecha:'2026-06-14T18:00:00', local:'Turquía', visitante:'Irán', flagLocal:'🇹🇷', flagVisitante:'🇮🇷' },
  { id:'G2', grupo:'G', fecha:'2026-06-14T21:00:00', local:'Portugal', visitante:'Ghana', flagLocal:'🇵🇹', flagVisitante:'🇬🇭' },
  { id:'G3', grupo:'G', fecha:'2026-06-18T18:00:00', local:'Turquía', visitante:'Ghana', flagLocal:'🇹🇷', flagVisitante:'🇬🇭' },
  { id:'G4', grupo:'G', fecha:'2026-06-18T21:00:00', local:'Irán', visitante:'Portugal', flagLocal:'🇮🇷', flagVisitante:'🇵🇹' },
  { id:'G5', grupo:'G', fecha:'2026-06-22T20:00:00', local:'Turquía', visitante:'Portugal', flagLocal:'🇹🇷', flagVisitante:'🇵🇹' },
  { id:'G6', grupo:'G', fecha:'2026-06-22T20:00:00', local:'Ghana', visitante:'Irán', flagLocal:'🇬🇭', flagVisitante:'🇮🇷' },
  { id:'H1', grupo:'H', fecha:'2026-06-15T18:00:00', local:'Australia', visitante:'Ghana', flagLocal:'🇦🇺', flagVisitante:'🇬🇭' },
  { id:'H2', grupo:'H', fecha:'2026-06-15T21:00:00', local:'Suiza', visitante:'Serbia', flagLocal:'🇨🇭', flagVisitante:'🇷🇸' },
  { id:'H3', grupo:'H', fecha:'2026-06-19T18:00:00', local:'Australia', visitante:'Serbia', flagLocal:'🇦🇺', flagVisitante:'🇷🇸' },
  { id:'H4', grupo:'H', fecha:'2026-06-19T21:00:00', local:'Suiza', visitante:'Australia', flagLocal:'🇨🇭', flagVisitante:'🇦🇺' },
  { id:'H5', grupo:'H', fecha:'2026-06-23T20:00:00', local:'Australia', visitante:'Suiza', flagLocal:'🇦🇺', flagVisitante:'🇨🇭' },
  { id:'H6', grupo:'H', fecha:'2026-06-23T20:00:00', local:'Serbia', visitante:'Ghana', flagLocal:'🇷🇸', flagVisitante:'🇬🇭' },
]

export const LOCK_HOURS = 2

export function canPredict(match: Match): boolean {
  const cutoff = new Date(new Date(match.fecha).getTime() - LOCK_HOURS * 3600000)
  return new Date() < cutoff
}

export function calcPoints(pL: number, pV: number, rL: number, rV: number) {
  if (pL === rL && pV === rV) return { pts: 3, tipo: 'exact' as const }
  const pr = pL > pV ? 1 : pL < pV ? -1 : 0
  const rr = rL > rV ? 1 : rL < rV ? -1 : 0
  if (pr === rr) return { pts: 1, tipo: 'result' as const }
  return { pts: 0, tipo: 'miss' as const }
}

export function formatMatchDate(fecha: string): string {
  const d = new Date(fecha)
  const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export function timeUntilLock(match: Match): string | null {
  const diff = new Date(match.fecha).getTime() - LOCK_HOURS * 3600000 - Date.now()
  if (diff <= 0) return null
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 48) return `${Math.floor(h/24)}d`
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}
