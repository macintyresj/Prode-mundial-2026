export interface Match {
  id: string
  grupo: string
  fecha: string
  local: string
  visitante: string
  flagLocal: string
  flagVisitante: string
  estadio?: string
  fase: 'grupos'
}

export interface KnockoutMatch {
  id: string
  fase: 'dieciseisavos' | 'octavos' | 'cuartos' | 'semifinal' | 'tercero' | 'final'
  fecha: string
  estadio: string
  label: string
  teamA: string
  teamB: string
  flagA: string
  flagB: string
}

export const FIXTURE: Match[] = [
  { id:'A1', grupo:'A', fase:'grupos', fecha:'2026-06-11T15:00:00', local:'México', visitante:'Sudáfrica', flagLocal:'🇲🇽', flagVisitante:'🇿🇦', estadio:'Ciudad de México' },
  { id:'A2', grupo:'A', fase:'grupos', fecha:'2026-06-11T22:00:00', local:'Corea del Sur', visitante:'Rep. Checa', flagLocal:'🇰🇷', flagVisitante:'🇨🇿', estadio:'Guadalajara' },
  { id:'A3', grupo:'A', fase:'grupos', fecha:'2026-06-18T12:00:00', local:'Rep. Checa', visitante:'Sudáfrica', flagLocal:'🇨🇿', flagVisitante:'🇿🇦', estadio:'Atlanta' },
  { id:'A4', grupo:'A', fase:'grupos', fecha:'2026-06-18T21:00:00', local:'México', visitante:'Corea del Sur', flagLocal:'🇲🇽', flagVisitante:'🇰🇷', estadio:'Guadalajara' },
  { id:'A5', grupo:'A', fase:'grupos', fecha:'2026-06-24T21:00:00', local:'Rep. Checa', visitante:'México', flagLocal:'🇨🇿', flagVisitante:'🇲🇽', estadio:'Ciudad de México' },
  { id:'A6', grupo:'A', fase:'grupos', fecha:'2026-06-24T21:00:00', local:'Sudáfrica', visitante:'Corea del Sur', flagLocal:'🇿🇦', flagVisitante:'🇰🇷', estadio:'Monterrey' },
  { id:'B1', grupo:'B', fase:'grupos', fecha:'2026-06-12T15:00:00', local:'Canadá', visitante:'Bosnia y Herz.', flagLocal:'🇨🇦', flagVisitante:'🇧🇦', estadio:'Toronto' },
  { id:'B2', grupo:'B', fase:'grupos', fecha:'2026-06-13T15:00:00', local:'Catar', visitante:'Suiza', flagLocal:'🇶🇦', flagVisitante:'🇨🇭', estadio:'San Francisco' },
  { id:'B3', grupo:'B', fase:'grupos', fecha:'2026-06-18T15:00:00', local:'Suiza', visitante:'Bosnia y Herz.', flagLocal:'🇨🇭', flagVisitante:'🇧🇦', estadio:'Los Ángeles' },
  { id:'B4', grupo:'B', fase:'grupos', fecha:'2026-06-18T18:00:00', local:'Canadá', visitante:'Catar', flagLocal:'🇨🇦', flagVisitante:'🇶🇦', estadio:'Vancouver' },
  { id:'B5', grupo:'B', fase:'grupos', fecha:'2026-06-24T15:00:00', local:'Suiza', visitante:'Canadá', flagLocal:'🇨🇭', flagVisitante:'🇨🇦', estadio:'Vancouver' },
  { id:'B6', grupo:'B', fase:'grupos', fecha:'2026-06-24T15:00:00', local:'Bosnia y Herz.', visitante:'Catar', flagLocal:'🇧🇦', flagVisitante:'🇶🇦', estadio:'Seattle' },
  { id:'C1', grupo:'C', fase:'grupos', fecha:'2026-06-13T18:00:00', local:'Brasil', visitante:'Marruecos', flagLocal:'🇧🇷', flagVisitante:'🇲🇦', estadio:'Nueva York/NJ' },
  { id:'C2', grupo:'C', fase:'grupos', fecha:'2026-06-13T21:00:00', local:'Haití', visitante:'Escocia', flagLocal:'🇭🇹', flagVisitante:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', estadio:'Boston' },
  { id:'C3', grupo:'C', fase:'grupos', fecha:'2026-06-19T18:00:00', local:'Escocia', visitante:'Marruecos', flagLocal:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', flagVisitante:'🇲🇦', estadio:'Boston' },
  { id:'C4', grupo:'C', fase:'grupos', fecha:'2026-06-19T21:00:00', local:'Brasil', visitante:'Haití', flagLocal:'🇧🇷', flagVisitante:'🇭🇹', estadio:'Filadelfia' },
  { id:'C5', grupo:'C', fase:'grupos', fecha:'2026-06-24T18:00:00', local:'Escocia', visitante:'Brasil', flagLocal:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', flagVisitante:'🇧🇷', estadio:'Miami' },
  { id:'C6', grupo:'C', fase:'grupos', fecha:'2026-06-24T18:00:00', local:'Marruecos', visitante:'Haití', flagLocal:'🇲🇦', flagVisitante:'🇭🇹', estadio:'Atlanta' },
  { id:'D1', grupo:'D', fase:'grupos', fecha:'2026-06-12T21:00:00', local:'Estados Unidos', visitante:'Paraguay', flagLocal:'🇺🇸', flagVisitante:'🇵🇾', estadio:'Los Ángeles' },
  { id:'D2', grupo:'D', fase:'grupos', fecha:'2026-06-14T00:00:00', local:'Australia', visitante:'Turquía', flagLocal:'🇦🇺', flagVisitante:'🇹🇷', estadio:'Vancouver' },
  { id:'D3', grupo:'D', fase:'grupos', fecha:'2026-06-19T15:00:00', local:'Estados Unidos', visitante:'Australia', flagLocal:'🇺🇸', flagVisitante:'🇦🇺', estadio:'Seattle' },
  { id:'D4', grupo:'D', fase:'grupos', fecha:'2026-06-20T00:00:00', local:'Turquía', visitante:'Paraguay', flagLocal:'🇹🇷', flagVisitante:'🇵🇾', estadio:'San Francisco' },
  { id:'D5', grupo:'D', fase:'grupos', fecha:'2026-06-25T22:00:00', local:'Turquía', visitante:'Estados Unidos', flagLocal:'🇹🇷', flagVisitante:'🇺🇸', estadio:'Los Ángeles' },
  { id:'D6', grupo:'D', fase:'grupos', fecha:'2026-06-25T22:00:00', local:'Paraguay', visitante:'Australia', flagLocal:'🇵🇾', flagVisitante:'🇦🇺', estadio:'San Francisco' },
  { id:'E1', grupo:'E', fase:'grupos', fecha:'2026-06-14T13:00:00', local:'Alemania', visitante:'Curazao', flagLocal:'🇩🇪', flagVisitante:'🇨🇼', estadio:'Houston' },
  { id:'E2', grupo:'E', fase:'grupos', fecha:'2026-06-14T19:00:00', local:'Costa de Marfil', visitante:'Ecuador', flagLocal:'🇨🇮', flagVisitante:'🇪🇨', estadio:'Filadelfia' },
  { id:'E3', grupo:'E', fase:'grupos', fecha:'2026-06-20T16:00:00', local:'Alemania', visitante:'Costa de Marfil', flagLocal:'🇩🇪', flagVisitante:'🇨🇮', estadio:'Toronto' },
  { id:'E4', grupo:'E', fase:'grupos', fecha:'2026-06-20T22:00:00', local:'Ecuador', visitante:'Curazao', flagLocal:'🇪🇨', flagVisitante:'🇨🇼', estadio:'Kansas City' },
  { id:'E5', grupo:'E', fase:'grupos', fecha:'2026-06-25T16:00:00', local:'Curazao', visitante:'Costa de Marfil', flagLocal:'🇨🇼', flagVisitante:'🇨🇮', estadio:'Filadelfia' },
  { id:'E6', grupo:'E', fase:'grupos', fecha:'2026-06-25T16:00:00', local:'Ecuador', visitante:'Alemania', flagLocal:'🇪🇨', flagVisitante:'🇩🇪', estadio:'Nueva York/NJ' },
  { id:'F1', grupo:'F', fase:'grupos', fecha:'2026-06-14T16:00:00', local:'Países Bajos', visitante:'Japón', flagLocal:'🇳🇱', flagVisitante:'🇯🇵', estadio:'Dallas' },
  { id:'F2', grupo:'F', fase:'grupos', fecha:'2026-06-14T22:00:00', local:'Suecia', visitante:'Túnez', flagLocal:'🇸🇪', flagVisitante:'🇹🇳', estadio:'Monterrey' },
  { id:'F3', grupo:'F', fase:'grupos', fecha:'2026-06-20T13:00:00', local:'Países Bajos', visitante:'Suecia', flagLocal:'🇳🇱', flagVisitante:'🇸🇪', estadio:'Houston' },
  { id:'F4', grupo:'F', fase:'grupos', fecha:'2026-06-21T00:00:00', local:'Túnez', visitante:'Japón', flagLocal:'🇹🇳', flagVisitante:'🇯🇵', estadio:'Monterrey' },
  { id:'F5', grupo:'F', fase:'grupos', fecha:'2026-06-25T19:00:00', local:'Japón', visitante:'Suecia', flagLocal:'🇯🇵', flagVisitante:'🇸🇪', estadio:'Dallas' },
  { id:'F6', grupo:'F', fase:'grupos', fecha:'2026-06-25T19:00:00', local:'Túnez', visitante:'Países Bajos', flagLocal:'🇹🇳', flagVisitante:'🇳🇱', estadio:'Kansas City' },
  { id:'G1', grupo:'G', fase:'grupos', fecha:'2026-06-15T15:00:00', local:'Bélgica', visitante:'Egipto', flagLocal:'🇧🇪', flagVisitante:'🇪🇬', estadio:'Seattle' },
  { id:'G2', grupo:'G', fase:'grupos', fecha:'2026-06-15T21:00:00', local:'Irán', visitante:'Nueva Zelanda', flagLocal:'🇮🇷', flagVisitante:'🇳🇿', estadio:'Los Ángeles' },
  { id:'G3', grupo:'G', fase:'grupos', fecha:'2026-06-21T15:00:00', local:'Bélgica', visitante:'Irán', flagLocal:'🇧🇪', flagVisitante:'🇮🇷', estadio:'Los Ángeles' },
  { id:'G4', grupo:'G', fase:'grupos', fecha:'2026-06-21T21:00:00', local:'Nueva Zelanda', visitante:'Egipto', flagLocal:'🇳🇿', flagVisitante:'🇪🇬', estadio:'Vancouver' },
  { id:'G5', grupo:'G', fase:'grupos', fecha:'2026-06-26T23:00:00', local:'Egipto', visitante:'Irán', flagLocal:'🇪🇬', flagVisitante:'🇮🇷', estadio:'Seattle' },
  { id:'G6', grupo:'G', fase:'grupos', fecha:'2026-06-26T23:00:00', local:'Nueva Zelanda', visitante:'Bélgica', flagLocal:'🇳🇿', flagVisitante:'🇧🇪', estadio:'Vancouver' },
  { id:'H1', grupo:'H', fase:'grupos', fecha:'2026-06-15T12:00:00', local:'España', visitante:'Cabo Verde', flagLocal:'🇪🇸', flagVisitante:'🇨🇻', estadio:'Atlanta' },
  { id:'H2', grupo:'H', fase:'grupos', fecha:'2026-06-15T18:00:00', local:'Arabia Saudí', visitante:'Uruguay', flagLocal:'🇸🇦', flagVisitante:'🇺🇾', estadio:'Miami' },
  { id:'H3', grupo:'H', fase:'grupos', fecha:'2026-06-21T12:00:00', local:'España', visitante:'Arabia Saudí', flagLocal:'🇪🇸', flagVisitante:'🇸🇦', estadio:'Atlanta' },
  { id:'H4', grupo:'H', fase:'grupos', fecha:'2026-06-21T18:00:00', local:'Uruguay', visitante:'Cabo Verde', flagLocal:'🇺🇾', flagVisitante:'🇨🇻', estadio:'Miami' },
  { id:'H5', grupo:'H', fase:'grupos', fecha:'2026-06-26T20:00:00', local:'Cabo Verde', visitante:'Arabia Saudí', flagLocal:'🇨🇻', flagVisitante:'🇸🇦', estadio:'Houston' },
  { id:'H6', grupo:'H', fase:'grupos', fecha:'2026-06-26T20:00:00', local:'Uruguay', visitante:'España', flagLocal:'🇺🇾', flagVisitante:'🇪🇸', estadio:'Guadalajara' },
  { id:'I1', grupo:'I', fase:'grupos', fecha:'2026-06-16T15:00:00', local:'Francia', visitante:'Senegal', flagLocal:'🇫🇷', flagVisitante:'🇸🇳', estadio:'Nueva York/NJ' },
  { id:'I2', grupo:'I', fase:'grupos', fecha:'2026-06-16T18:00:00', local:'Irak', visitante:'Noruega', flagLocal:'🇮🇶', flagVisitante:'🇳🇴', estadio:'Boston' },
  { id:'I3', grupo:'I', fase:'grupos', fecha:'2026-06-22T17:00:00', local:'Francia', visitante:'Irak', flagLocal:'🇫🇷', flagVisitante:'🇮🇶', estadio:'Filadelfia' },
  { id:'I4', grupo:'I', fase:'grupos', fecha:'2026-06-22T20:00:00', local:'Noruega', visitante:'Senegal', flagLocal:'🇳🇴', flagVisitante:'🇸🇳', estadio:'Nueva York/NJ' },
  { id:'I5', grupo:'I', fase:'grupos', fecha:'2026-06-26T15:00:00', local:'Noruega', visitante:'Francia', flagLocal:'🇳🇴', flagVisitante:'🇫🇷', estadio:'Boston' },
  { id:'I6', grupo:'I', fase:'grupos', fecha:'2026-06-26T15:00:00', local:'Senegal', visitante:'Irak', flagLocal:'🇸🇳', flagVisitante:'🇮🇶', estadio:'Toronto' },
  { id:'J1', grupo:'J', fase:'grupos', fecha:'2026-06-16T21:00:00', local:'Argentina', visitante:'Argelia', flagLocal:'🇦🇷', flagVisitante:'🇩🇿', estadio:'Kansas City' },
  { id:'J2', grupo:'J', fase:'grupos', fecha:'2026-06-17T00:00:00', local:'Austria', visitante:'Jordania', flagLocal:'🇦🇹', flagVisitante:'🇯🇴', estadio:'San Francisco' },
  { id:'J3', grupo:'J', fase:'grupos', fecha:'2026-06-22T13:00:00', local:'Argentina', visitante:'Austria', flagLocal:'🇦🇷', flagVisitante:'🇦🇹', estadio:'Dallas' },
  { id:'J4', grupo:'J', fase:'grupos', fecha:'2026-06-23T23:00:00', local:'Jordania', visitante:'Argelia', flagLocal:'🇯🇴', flagVisitante:'🇩🇿', estadio:'San Francisco' },
  { id:'J5', grupo:'J', fase:'grupos', fecha:'2026-06-27T22:00:00', local:'Argelia', visitante:'Austria', flagLocal:'🇩🇿', flagVisitante:'🇦🇹', estadio:'Kansas City' },
  { id:'J6', grupo:'J', fase:'grupos', fecha:'2026-06-27T22:00:00', local:'Jordania', visitante:'Argentina', flagLocal:'🇯🇴', flagVisitante:'🇦🇷', estadio:'Dallas' },
  { id:'K1', grupo:'K', fase:'grupos', fecha:'2026-06-17T13:00:00', local:'Portugal', visitante:'RD Congo', flagLocal:'🇵🇹', flagVisitante:'🇨🇩', estadio:'Houston' },
  { id:'K2', grupo:'K', fase:'grupos', fecha:'2026-06-17T22:00:00', local:'Uzbekistán', visitante:'Colombia', flagLocal:'🇺🇿', flagVisitante:'🇨🇴', estadio:'Ciudad de México' },
  { id:'K3', grupo:'K', fase:'grupos', fecha:'2026-06-23T13:00:00', local:'Portugal', visitante:'Uzbekistán', flagLocal:'🇵🇹', flagVisitante:'🇺🇿', estadio:'Houston' },
  { id:'K4', grupo:'K', fase:'grupos', fecha:'2026-06-23T22:00:00', local:'Colombia', visitante:'RD Congo', flagLocal:'🇨🇴', flagVisitante:'🇨🇩', estadio:'Guadalajara' },
  { id:'K5', grupo:'K', fase:'grupos', fecha:'2026-06-27T19:30:00', local:'Colombia', visitante:'Portugal', flagLocal:'🇨🇴', flagVisitante:'🇵🇹', estadio:'Miami' },
  { id:'K6', grupo:'K', fase:'grupos', fecha:'2026-06-27T19:30:00', local:'RD Congo', visitante:'Uzbekistán', flagLocal:'🇨🇩', flagVisitante:'🇺🇿', estadio:'Atlanta' },
  { id:'L1', grupo:'L', fase:'grupos', fecha:'2026-06-17T16:00:00', local:'Inglaterra', visitante:'Croacia', flagLocal:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagVisitante:'🇭🇷', estadio:'Dallas' },
  { id:'L2', grupo:'L', fase:'grupos', fecha:'2026-06-17T19:00:00', local:'Ghana', visitante:'Panamá', flagLocal:'🇬🇭', flagVisitante:'🇵🇦', estadio:'Toronto' },
  { id:'L3', grupo:'L', fase:'grupos', fecha:'2026-06-23T16:00:00', local:'Inglaterra', visitante:'Ghana', flagLocal:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagVisitante:'🇬🇭', estadio:'Boston' },
  { id:'L4', grupo:'L', fase:'grupos', fecha:'2026-06-23T19:00:00', local:'Panamá', visitante:'Croacia', flagLocal:'🇵🇦', flagVisitante:'🇭🇷', estadio:'Toronto' },
  { id:'L5', grupo:'L', fase:'grupos', fecha:'2026-06-27T17:00:00', local:'Panamá', visitante:'Inglaterra', flagLocal:'🇵🇦', flagVisitante:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', estadio:'Nueva York/NJ' },
  { id:'L6', grupo:'L', fase:'grupos', fecha:'2026-06-27T17:00:00', local:'Croacia', visitante:'Ghana', flagLocal:'🇭🇷', flagVisitante:'🇬🇭', estadio:'Filadelfia' },
]

export const KNOCKOUT_TEMPLATE: KnockoutMatch[] = [
  { id:'R73', fase:'dieciseisavos', fecha:'2026-06-28T21:00:00', estadio:'Los Ángeles', label:'P73 · 2º A vs 2º B', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R74', fase:'dieciseisavos', fecha:'2026-06-29T13:00:00', estadio:'Boston', label:'P74 · 1º E vs 3º', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R75', fase:'dieciseisavos', fecha:'2026-06-29T16:00:00', estadio:'Monterrey', label:'P75 · 1º F vs 2º C', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R76', fase:'dieciseisavos', fecha:'2026-06-29T19:00:00', estadio:'Houston', label:'P76 · 1º C vs 2º F', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R77', fase:'dieciseisavos', fecha:'2026-06-30T15:00:00', estadio:'Nueva York/NJ', label:'P77 · 1º I vs 3º', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R78', fase:'dieciseisavos', fecha:'2026-06-30T18:00:00', estadio:'Dallas', label:'P78 · 2º E vs 2º I', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R79', fase:'dieciseisavos', fecha:'2026-06-30T21:00:00', estadio:'Ciudad de México', label:'P79 · 1º A vs 3º', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R80', fase:'dieciseisavos', fecha:'2026-07-01T12:00:00', estadio:'Atlanta', label:'P80 · 1º L vs 3º', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R81', fase:'dieciseisavos', fecha:'2026-07-01T15:00:00', estadio:'San Francisco', label:'P81 · 1º D vs 3º', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R82', fase:'dieciseisavos', fecha:'2026-07-01T18:00:00', estadio:'Seattle', label:'P82 · 1º G vs 3º', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R83', fase:'dieciseisavos', fecha:'2026-07-02T13:00:00', estadio:'Toronto', label:'P83 · 2º K vs 2º L', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R84', fase:'dieciseisavos', fecha:'2026-07-02T16:00:00', estadio:'Los Ángeles', label:'P84 · 1º H vs 2º J', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R85', fase:'dieciseisavos', fecha:'2026-07-02T19:00:00', estadio:'Vancouver', label:'P85 · 1º B vs 3º', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R86', fase:'dieciseisavos', fecha:'2026-07-03T15:00:00', estadio:'Miami', label:'P86 · 1º J vs 2º H', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R87', fase:'dieciseisavos', fecha:'2026-07-03T18:00:00', estadio:'Kansas City', label:'P87 · 1º K vs 3º', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R88', fase:'dieciseisavos', fecha:'2026-07-03T21:00:00', estadio:'Dallas', label:'P88 · 2º D vs 2º G', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R89', fase:'octavos', fecha:'2026-07-04T17:00:00', estadio:'Filadelfia', label:'Octavos 1', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R90', fase:'octavos', fecha:'2026-07-04T21:00:00', estadio:'Houston', label:'Octavos 2', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R91', fase:'octavos', fecha:'2026-07-05T17:00:00', estadio:'Nueva York/NJ', label:'Octavos 3', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R92', fase:'octavos', fecha:'2026-07-05T21:00:00', estadio:'Ciudad de México', label:'Octavos 4', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R93', fase:'octavos', fecha:'2026-07-06T17:00:00', estadio:'Dallas', label:'Octavos 5', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R94', fase:'octavos', fecha:'2026-07-06T21:00:00', estadio:'Seattle', label:'Octavos 6', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R95', fase:'octavos', fecha:'2026-07-07T17:00:00', estadio:'Atlanta', label:'Octavos 7', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R96', fase:'octavos', fecha:'2026-07-07T21:00:00', estadio:'Vancouver', label:'Octavos 8', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R97', fase:'cuartos', fecha:'2026-07-09T17:00:00', estadio:'Boston', label:'Cuartos 1', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R98', fase:'cuartos', fecha:'2026-07-10T20:00:00', estadio:'Los Ángeles', label:'Cuartos 2', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R99', fase:'cuartos', fecha:'2026-07-11T17:00:00', estadio:'Miami', label:'Cuartos 3', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R100', fase:'cuartos', fecha:'2026-07-11T21:00:00', estadio:'Kansas City', label:'Cuartos 4', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R101', fase:'semifinal', fecha:'2026-07-14T20:00:00', estadio:'Dallas', label:'Semifinal 1', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R102', fase:'semifinal', fecha:'2026-07-15T20:00:00', estadio:'Atlanta', label:'Semifinal 2', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R103', fase:'tercero', fecha:'2026-07-18T20:00:00', estadio:'Miami', label:'Tercer Puesto', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
  { id:'R104', fase:'final', fecha:'2026-07-19T20:00:00', estadio:'Nueva York/NJ', label:'⭐ FINAL ⭐', teamA:'', teamB:'', flagA:'🏳️', flagB:'🏳️' },
]

export const LOCK_HOURS = 2

export function canPredict(fecha: string): boolean {
  const cutoff = new Date(new Date(fecha).getTime() - LOCK_HOURS * 3600000)
  return new Date() < cutoff
}

export function calcPointsGroup(pL: number, pV: number, rL: number, rV: number) {
  if (pL === rL && pV === rV) return { pts: 3, tipo: 'exact' as const }
  const pr = pL > pV ? 1 : pL < pV ? -1 : 0
  const rr = rL > rV ? 1 : rL < rV ? -1 : 0
  if (pr === rr) return { pts: 1, tipo: 'result' as const }
  return { pts: 0, tipo: 'miss' as const }
}

export function calcPointsKnockout(predWinner: string, predPenalties: boolean, realWinner: string, realPenalties: boolean) {
  let pts = 0
  if (predWinner === realWinner) pts += 3
  if (predPenalties === realPenalties) pts += 2
  return pts
}

export function formatMatchDate(fecha: string): string {
  const d = new Date(fecha)
  const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export function timeUntilLock(fecha: string): string | null {
  const diff = new Date(fecha).getTime() - LOCK_HOURS * 3600000 - Date.now()
  if (diff <= 0) return null
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 48) return `${Math.floor(h/24)}d`
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}

export const KNOCKOUT_FASE_LABELS: Record<string, string> = {
  dieciseisavos: '16avos de Final',
  octavos: 'Octavos de Final',
  cuartos: 'Cuartos de Final',
  semifinal: 'Semifinales',
  tercero: 'Tercer Puesto',
  final: 'Final',
}
