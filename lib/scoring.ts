// ============================================================
// SISTEMA DE PUNTOS
// ============================================================

// FASE DE GRUPOS
// 3 pts → marcador exacto
// 1 pt  → resultado correcto (quién gana o empate)
// 0 pts → incorrecto

export function calcPointsGroup(pL: number, pV: number, rL: number, rV: number) {
  if (pL === rL && pV === rV) return { pts: 3, tipo: 'exact' as const }
  const pr = pL > pV ? 1 : pL < pV ? -1 : 0
  const rr = rL > rV ? 1 : rL < rV ? -1 : 0
  if (pr === rr) return { pts: 1, tipo: 'result' as const }
  return { pts: 0, tipo: 'miss' as const }
}

// FASE ELIMINATORIA
// 5 pts → acertás el ganador
// +2 pts → acertás si va a penales
// 0 pts → incorrecto

export interface KnockoutPrediction {
  winnerId: string  // uid del equipo ganador predicho
  penalties: boolean // predijo que va a penales
}

export interface KnockoutResult {
  winnerId: string  // equipo que ganó
  penalties: boolean // fue a penales
}

export function calcPointsKnockout(pred: KnockoutPrediction, result: KnockoutResult) {
  let pts = 0
  const winnerCorrect = pred.winnerId === result.winnerId
  const penaltiesCorrect = pred.penalties === result.penalties

  if (winnerCorrect) pts += 5
  if (penaltiesCorrect) pts += 2

  return {
    pts,
    winnerCorrect,
    penaltiesCorrect,
  }
}
