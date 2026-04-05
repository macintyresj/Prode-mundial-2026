export interface Match {
  id: string
  grupo: string
  fecha: string
  local: string
  visitante: string
  flagLocal: string
  flagVisitante: string
  estadio?: string
}

export const FIXTURE: Match[] = [
  // GRUPO A
  { id:'A1', grupo:'A', fecha:'2026-06-11T15:00:00', local:'México', visitante:'Sudáfrica', flagLocal:'🇲🇽', flagVisitante:'🇿🇦', estadio:'Ciudad de México' },
  { id:'A2', grupo:'A', fecha:'2026-06-11T22:00:00', local:'Corea del Sur', visitante:'Rep. Checa', flagLocal:'🇰🇷', flagVisitante:'🇨🇿', estadio:'Guadalajara' },
  { id:'A3', grupo:'A', fecha:'2026-06-18T12:00:00', local:'Rep. Checa', visitante:'Sudáfrica', flagLocal:'🇨🇿', flagVisitante:'🇿🇦', estadio:'Atlanta' },
  { id:'A4', grupo:'A', fecha:'2026-06-18T21:00:00', local:'México', visitante:'Corea del Sur', flagLocal:'🇲🇽', flagVisitante:'🇰🇷', estadio:'Guadalajara' },
  { id:'A5', grupo:'A', fecha:'2026-06-24T21:00:00', local:'Rep. Checa', visitante:'México', flagLocal:'🇨🇿', flagVisitante:'🇲🇽', estadio:'Ciudad de México' },
  { id:'A6', grupo:'A', fecha:'2026-06-24T21:00:00', local:'Sudáfrica', visitante:'Corea del Sur', flagLocal:'🇿🇦', flagVisitante:'🇰🇷', estadio:'Monterrey' },
  // GRUPO B
  { id:'B1', grupo:'B', fecha:'2026-06-12T15:00:00', local:'Canadá', visitante:'Bosnia y Herz.', flagLocal:'🇨🇦', flagVisitante:'🇧🇦', estadio:'Toronto' },
  { id:'B2', grupo:'B', fecha:'2026-06-13T15:00:00', local:'Catar', visitante:'Suiza', flagLocal:'🇶🇦', flagVisitante:'🇨🇭', estadio:'San Francisco' },
  { id:'B3', grupo:'B', fecha:'2026-06-18T15:00:00', local:'Suiza', visitante:'Bosnia y Herz.', flagLocal:'🇨🇭', flagVisitante:'🇧🇦', estadio:'Los Ángeles' },
  { id:'B4', grupo:'B', fecha:'2026-06-18T18:00:00', local:'Canadá', visitante:'Catar', flagLocal:'🇨🇦', flagVisitante:'🇶🇦', estadio:'Vancouver' },
  { id:'B5', grupo:'B', fecha:'2026-06-24T15:00:00', local:'Suiza', visitante:'Canadá', flagLocal:'🇨🇭', flagVisitante:'🇨🇦', estadio:'Vancouver' },
  { id:'B6', grupo:'B', fecha:'2026-06-24T15:00:00', local:'Bosnia y Herz.', visitante:'Catar', flagLocal:'🇧🇦', flagVisitante:'🇶🇦', estadio:'Seattle' },
  // GRUPO C
  { id:'C1', grupo:'C', fecha:'2026-06-13T18:00:00', local:'Brasil', visitante:'Marruecos', flagLocal:'🇧🇷', flagVisitante:'🇲🇦', estadio:'Nueva York/Nueva Jersey' },
  { id:'C2', grupo:'C', fecha:'2026-06-13T21:00:00', local:'Haití', visitante:'Escocia', flagLocal:'🇭🇹', flagVisitante:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', estadio:'Boston' },
  { id:'C3', grupo:'C', fecha:'2026-06-19T18:00:00', local:'Escocia', visitante:'Marruecos', flagLocal:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', flagVisitante:'🇲🇦', estadio:'Boston' },
  { id:'C4', grupo:'C', fecha:'2026-06-19T21:00:00', local:'Brasil', visitante:'Haití', flagLocal:'🇧🇷', flagVisitante:'🇭🇹', estadio:'Filadelfia' },
  { id:'C5', grupo:'C', fecha:'2026-06-24T18:00:00', local:'Escocia', visitante:'Brasil', flagLocal:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', flagVisitante:'🇧🇷', estadio:'Miami' },
  { id:'C6', grupo:'C', fecha:'2026-06-24T18:00:00', local:'Marruecos', visitante:'Haití', flagLocal:'🇲🇦', flagVisitante:'🇭🇹', estadio:'Atlanta' },
  // GRUPO D
  { id:'D1', grupo:'D', fecha:'2026-06-12T21:00:00', local:'Estados Unidos', visitante:'Paraguay', flagLocal:'🇺🇸', flagVisitante:'🇵🇾', estadio:'Los Ángeles' },
  { id:'D2', grupo:'D', fecha:'2026-06-14T00:00:00', local:'Australia', visitante:'Turquía', flagLocal:'🇦🇺', flagVisitante:'🇹🇷', estadio:'Vancouver' },
  { id:'D3', grupo:'D', fecha:'2026-06-19T15:00:00', local:'Estados Unidos', visitante:'Australia', flagLocal:'🇺🇸', flagVisitante:'🇦🇺', estadio:'Seattle' },
  { id:'D4', grupo:'D', fecha:'2026-06-20T00:00:00', local:'Turquía', visitante:'Paraguay', flagLocal:'🇹🇷', flagVisitante:'🇵🇾', estadio:'San Francisco' },
  { id:'D5', grupo:'D', fecha:'2026-06-25T22:00:00', local:'Turquía', visitante:'Estados Unidos', flagLocal:'🇹🇷', flagVisitante:'🇺🇸', estadio:'Los Ángeles' },
  { id:'D6', grupo:'D', fecha:'2026-06-25T22:00:00', local:'Paraguay', visitante:'Australia', flagLocal:'🇵🇾', flagVisitante:'🇦🇺', estadio:'San Francisco' },
  // GRUPO E
  { id:'E1', grupo:'E', fecha:'2026-06-14T13:00:00', local:'Alemania', visitante:'Curazao', flagLocal:'🇩🇪', flagVisitante:'🇨🇼', estadio:'Houston' },
  { id:'E2', grupo:'E', fecha:'2026-06-14T19:00:00', local:'Costa de Marfil', visitante:'Ecuador', flagLocal:'🇨🇮', flagVisitante:'🇪🇨', estadio:'Filadelfia' },
  { id:'E3', grupo:'E', fecha:'2026-06-20T16:00:00', local:'Alemania', visitante:'Costa de Marfil', flagLocal:'🇩🇪', flagVisitante:'🇨🇮', estadio:'Toronto' },
  { id:'E4', grupo:'E', fecha:'2026-06-20T22:00:00', local:'Ecuador', visitante:'Curazao', flagLocal:'🇪🇨', flagVisitante:'🇨🇼', estadio:'Kansas City' },
  { id:'E5', grupo:'E', fecha:'2026-06-25T16:00:00', local:'Curazao', visitante:'Costa de Marfil', flagLocal:'🇨🇼', flagVisitante:'🇨🇮', estadio:'Filadelfia' },
  { id:'E6', grupo:'E', fecha:'2026-06-25T16:00:00', local:'Ecuador', visitante:'Alemania', flagLocal:'🇪🇨', flagVisitante:'🇩🇪', estadio:'Nueva York/Nueva Jersey' },
  // GRUPO F
  { id:'F1', grupo:'F', fecha:'2026-06-14T16:00:00', local:'Países Bajos', visitante:'Japón', flagLocal:'🇳🇱', flagVisitante:'🇯🇵', estadio:'Dallas' },
  { id:'F2', grupo:'F', fecha:'2026-06-14T22:00:00', local:'Suecia', visitante:'Túnez', flagLocal:'🇸🇪', flagVisitante:'🇹🇳', estadio:'Monterrey' },
  { id:'F3', grupo:'F', fecha:'2026-06-20T13:00:00', local:'Países Bajos', visitante:'Suecia', flagLocal:'🇳🇱', flagVisitante:'🇸🇪', estadio:'Houston' },
  { id:'F4', grupo:'F', fecha:'2026-06-21T00:00:00', local:'Túnez', visitante:'Japón', flagLocal:'🇹🇳', flagVisitante:'🇯🇵', estadio:'Monterrey' },
  { id:'F5', grupo:'F', fecha:'2026-06-25T19:00:00', local:'Japón', visitante:'Suecia', flagLocal:'🇯🇵', flagVisitante:'🇸🇪', estadio:'Dallas' },
  { id:'F6', grupo:'F', fecha:'2026-06-25T19:00:00', local:'Túnez', visitante:'Países Bajos', flagLocal:'🇹🇳', flagVisitante:'🇳🇱', estadio:'Kansas City' },
  // GRUPO G
  { id:'G1', grupo:'G', fecha:'2026-06-15T15:00:00', local:'Bélgica', visitante:'Egipto', flagLocal:'🇧🇪', flagVisitante:'🇪🇬', estadio:'Seattle' },
  { id:'G2', grupo:'G', fecha:'2026-06-15T21:00:00', local:'Irán', visitante:'Nueva Zelanda', flagLocal:'🇮🇷', flagVisitante:'🇳🇿', estadio:'Los Ángeles' },
  { id:'G3', grupo:'G', fecha:'2026-06-21T15:00:00', local:'Bélgica', visitante:'Irán', flagLocal:'🇧🇪', flagVisitante:'🇮🇷', estadio:'Los Ángeles' },
  { id:'G4', grupo:'G', fecha:'2026-06-21T21:00:00', local:'Nueva Zelanda', visitante:'Egipto', flagLocal:'🇳🇿', flagVisitante:'🇪🇬', estadio:'Vancouver' },
  { id:'G5', grupo:'G', fecha:'2026-06-26T23:00:00', local:'Egipto', visitante:'Irán', flagLocal:'🇪🇬', flagVisitante:'🇮🇷', estadio:'Seattle' },
  { id:'G6', grupo:'G', fecha:'2026-06-26T23:00:00', local:'Nueva Zelanda', visitante:'Bélgica', flagLocal:'🇳🇿', flagVisitante:'🇧🇪', estadio:'Vancouver' },
  // GRUPO H
  { id:'H1', grupo:'H', fecha:'2026-06-15T12:00:00', local:'España', visitante:'Cabo Verde', flagLocal:'🇪🇸', flagVisitante:'🇨🇻', estadio:'Atlanta' },
  { id:'H2', grupo:'H', fecha:'2026-06-15T18:00:00', local:'Arabia Saudí', visitante:'Uruguay', flagLocal:'🇸🇦', flagVisitante:'🇺🇾', estadio:'Miami' },
  { id:'H3', grupo:'H', fecha:'2026-06-21T12:00:00', local:'España', visitante:'Arabia Saudí', flagLocal:'🇪🇸', flagVisitante:'🇸🇦', estadio:'Atlanta' },
  { id:'H4', grupo:'H', fecha:'2026-06-21T18:00:00', local:'Uruguay', visitante:'Cabo Verde', flagLocal:'🇺🇾', flagVisitante:'🇨🇻', estadio:'Miami' },
  { id:'H5', grupo:'H', fecha:'2026-06-26T20:00:00', local:'Cabo Verde', visitante:'Arabia Saudí', flagLocal:'🇨🇻', flagVisitante:'🇸🇦', estadio:'Houston' },
  { id:'H6', grupo:'H', fecha:'2026-06-26T20:00:00', local:'Uruguay', visitante:'España', flagLocal:'🇺🇾', flagVisitante:'🇪🇸', estadio:'Guadalajara' },
  // GRUPO I
  { id:'I1', grupo:'I', fecha:'2026-06-16T15:00:00', local:'Francia', visitante:'Senegal', flagLocal:'🇫🇷', flagVisitante:'🇸🇳', estadio:'Nueva York/Nueva Jersey' },
  { id:'I2', grupo:'I', fecha:'2026-06-16T18:00:00', local:'Irak', visitante:'Noruega', flagLocal:'🇮🇶', flagVisitante:'🇳🇴', estadio:'Boston' },
  { id:'I3', grupo:'I', fecha:'2026-06-22T17:00:00', local:'Francia', visitante:'Irak', flagLocal:'🇫🇷', flagVisitante:'🇮🇶', estadio:'Filadelfia' },
  { id:'I4', grupo:'I', fecha:'2026-06-22T20:00:00', local:'Noruega', visitante:'Senegal', flagLocal:'🇳🇴', flagVisitante:'🇸🇳', estadio:'Nueva York/Nueva Jersey' },
  { id:'I5', grupo:'I', fecha:'2026-06-26T15:00:00', local:'Noruega', visitante:'Francia', flagLocal:'🇳🇴', flagVisitante:'🇫🇷', estadio:'Boston' },
  { id:'I6', grupo:'I', fecha:'2026-06-26T15:00:00', local:'Senegal', visitante:'Irak', flagLocal:'🇸🇳', flagVisitante:'🇮🇶', estadio:'Toronto' },
  // GRUPO J
  { id:'J1', grupo:'J', fecha:'2026-06-16T21:00:00', local:'Argentina', visitante:'Argelia', flagLocal:'🇦🇷', flagVisitante:'🇩🇿', estadio:'Kansas City' },
  { id:'J2', grupo:'J', fecha:'2026-06-17T00:00:00', local:'Austria', visitante:'Jordania', flagLocal:'🇦🇹', flagVisitante:'🇯🇴', estadio:'San Francisco' },
  { id:'J3', grupo:'J', fecha:'2026-06-22T13:00:00', local:'Argentina', visitante:'Austria', flagLocal:'🇦🇷', flagVisitante:'🇦🇹', estadio:'Dallas' },
  { id:'J4', grupo:'J', fecha:'2026-06-23T23:00:00', local:'Jordania', visitante:'Argelia', flagLocal:'🇯🇴', flagVisitante:'🇩🇿', estadio:'San Francisco' },
  { id:'J5', grupo:'J', fecha:'2026-06-27T22:00:00', local:'Argelia', visitante:'Austria', flagLocal:'🇩🇿', flagVisitante:'🇦🇹', estadio:'Kansas City' },
  { id:'J6', grupo:'J', fecha:'2026-06-27T22:00:00', local:'Jordania', visitante:'Argentina', flagLocal:'🇯🇴', flagVisitante:'🇦🇷', estadio:'Dallas' },
  // GRUPO K
  { id:'K1', grupo:'K', fecha:'2026-06-17T13:00:00', local:'Portugal', visitante:'RD Congo', flagLocal:'🇵🇹', flagVisitante:'🇨🇩', estadio:'Houston' },
  { id:'K2', grupo:'K', fecha:'2026-06-17T22:00:00', local:'Uzbekistán', visitante:'Colombia', flagLocal:'🇺🇿', flagVisitante:'🇨🇴', estadio:'Ciudad de México' },
  { id:'K3', grupo:'K', fecha:'2026-06-23T13:00:00', local:'Portugal', visitante:'Uzbekistán', flagLocal:'🇵🇹', flagVisitante:'🇺🇿', estadio:'Houston' },
  { id:'K4', grupo:'K', fecha:'2026-06-23T22:00:00', local:'Colombia', visitante:'RD Congo', flagLocal:'🇨🇴', flagVisitante:'🇨🇩', estadio:'Guadalajara' },
  { id:'K5', grupo:'K', fecha:'2026-06-27T19:30:00', local:'Colombia', visitante:'Portugal', flagLocal:'🇨🇴', flagVisitante:'🇵🇹', estadio:'Miami' },
  { id:'K6', grupo:'K', fecha:'2026-06-27T19:30:00', local:'RD Congo', visitante:'Uzbekistán', flagLocal:'🇨🇩', flagVisitante:'🇺🇿', estadio:'Atlanta' },
  // GRUPO L
  { id:'L1', grupo:'L', fecha:'2026-06-17T16:00:00', local:'Inglaterra', visitante:'Croacia', flagLocal:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagVisitante:'🇭🇷', estadio:'Dallas' },
  { id:'L2', grupo:'L', fecha:'2026-06-17T19:00:00', local:'Ghana', visitante:'Panamá', flagLocal:'🇬🇭', flagVisitante:'🇵🇦', estadio:'Toronto' },
  { id:'L3', grupo:'L', fecha:'2026-06-23T16:00:00', local:'Inglaterra', visitante:'Ghana', flagLocal:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagVisitante:'🇬🇭', estadio:'Boston' },
  { id:'L4', grupo:'L', fecha:'2026-06-23T19:00:00', local:'Panamá', visitante:'Croacia', flagLocal:'🇵🇦', flagVisitante:'🇭🇷', estadio:'Toronto' },
  { id:'L5', grupo:'L', fecha:'2026-06-27T17:00:00', local:'Panamá', visitante:'Inglaterra', flagLocal:'🇵🇦', flagVisitante:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', estadio:'Nueva York/Nueva Jersey' },
  { id:'L6', grupo:'L', fecha:'2026-06-27T17:00:00', local:'Croacia', visitante:'Ghana', flagLocal:'🇭🇷', flagVisitante:'🇬🇭', estadio:'Filadelfia' },
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
