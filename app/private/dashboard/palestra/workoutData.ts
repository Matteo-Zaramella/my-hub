// Schede Allenamento A-B-C - Ciclo 21 giorni
// Ciclo inizia: 19/01/2026 (stesso dell'alimentazione)

export const CYCLE_START_DATE = new Date('2026-01-19');

export type TipoGiorno = 'allenamento' | 'riposo';
export type TipoScheda = 'A' | 'B' | 'C' | null;

export interface Esercizio {
  nome: string;
  serie: number;
  ripetizioni: string;
  peso: string;
  note?: string;
}

export interface GiornoAllenamento {
  giorno: number; // 1-21
  giornoSettimana: string;
  settimana: number; // 1-3
  tipo: TipoGiorno;
  scheda: TipoScheda;
}

// ============ SCHEDE A, B, C ============
// Modifica questi esercizi con i tuoi

export const schedaA: Esercizio[] = [
  // Inserisci qui gli esercizi della Scheda A
  { nome: 'Esercizio 1', serie: 4, ripetizioni: '8-10', peso: '-- kg' },
  { nome: 'Esercizio 2', serie: 4, ripetizioni: '8-10', peso: '-- kg' },
  { nome: 'Esercizio 3', serie: 3, ripetizioni: '10-12', peso: '-- kg' },
  { nome: 'Esercizio 4', serie: 3, ripetizioni: '10-12', peso: '-- kg' },
  { nome: 'Esercizio 5', serie: 3, ripetizioni: '12-15', peso: '-- kg' },
];

export const schedaB: Esercizio[] = [
  // Inserisci qui gli esercizi della Scheda B
  { nome: 'Esercizio 1', serie: 4, ripetizioni: '8-10', peso: '-- kg' },
  { nome: 'Esercizio 2', serie: 4, ripetizioni: '8-10', peso: '-- kg' },
  { nome: 'Esercizio 3', serie: 3, ripetizioni: '10-12', peso: '-- kg' },
  { nome: 'Esercizio 4', serie: 3, ripetizioni: '10-12', peso: '-- kg' },
  { nome: 'Esercizio 5', serie: 3, ripetizioni: '12-15', peso: '-- kg' },
];

export const schedaC: Esercizio[] = [
  // Inserisci qui gli esercizi della Scheda C
  { nome: 'Esercizio 1', serie: 4, ripetizioni: '8-10', peso: '-- kg' },
  { nome: 'Esercizio 2', serie: 4, ripetizioni: '8-10', peso: '-- kg' },
  { nome: 'Esercizio 3', serie: 3, ripetizioni: '10-12', peso: '-- kg' },
  { nome: 'Esercizio 4', serie: 3, ripetizioni: '10-12', peso: '-- kg' },
  { nome: 'Esercizio 5', serie: 3, ripetizioni: '12-15', peso: '-- kg' },
];

// Funzione per ottenere la scheda corretta
export function getScheda(tipo: TipoScheda): Esercizio[] {
  switch (tipo) {
    case 'A': return schedaA;
    case 'B': return schedaB;
    case 'C': return schedaC;
    default: return [];
  }
}

// ============ CICLO 21 GIORNI ============
// Pattern: A-B-0-C-0-A-0 / B-0-C-0-A-B-0 / C-0-A-B-0-C-0

export const ciclo21Giorni: GiornoAllenamento[] = [
  // ==================== SETTIMANA 1 ====================
  // Pattern: A-B-0-C-0-A-0
  { giorno: 1, giornoSettimana: 'Lunedì', settimana: 1, tipo: 'allenamento', scheda: 'A' },
  { giorno: 2, giornoSettimana: 'Martedì', settimana: 1, tipo: 'allenamento', scheda: 'B' },
  { giorno: 3, giornoSettimana: 'Mercoledì', settimana: 1, tipo: 'riposo', scheda: null },
  { giorno: 4, giornoSettimana: 'Giovedì', settimana: 1, tipo: 'allenamento', scheda: 'C' },
  { giorno: 5, giornoSettimana: 'Venerdì', settimana: 1, tipo: 'riposo', scheda: null },
  { giorno: 6, giornoSettimana: 'Sabato', settimana: 1, tipo: 'allenamento', scheda: 'A' },
  { giorno: 7, giornoSettimana: 'Domenica', settimana: 1, tipo: 'riposo', scheda: null },

  // ==================== SETTIMANA 2 ====================
  // Pattern: B-0-C-0-A-B-0
  { giorno: 8, giornoSettimana: 'Lunedì', settimana: 2, tipo: 'allenamento', scheda: 'B' },
  { giorno: 9, giornoSettimana: 'Martedì', settimana: 2, tipo: 'riposo', scheda: null },
  { giorno: 10, giornoSettimana: 'Mercoledì', settimana: 2, tipo: 'allenamento', scheda: 'C' },
  { giorno: 11, giornoSettimana: 'Giovedì', settimana: 2, tipo: 'riposo', scheda: null },
  { giorno: 12, giornoSettimana: 'Venerdì', settimana: 2, tipo: 'allenamento', scheda: 'A' },
  { giorno: 13, giornoSettimana: 'Sabato', settimana: 2, tipo: 'allenamento', scheda: 'B' },
  { giorno: 14, giornoSettimana: 'Domenica', settimana: 2, tipo: 'riposo', scheda: null },

  // ==================== SETTIMANA 3 ====================
  // Pattern: C-0-A-B-0-C-0
  { giorno: 15, giornoSettimana: 'Lunedì', settimana: 3, tipo: 'allenamento', scheda: 'C' },
  { giorno: 16, giornoSettimana: 'Martedì', settimana: 3, tipo: 'riposo', scheda: null },
  { giorno: 17, giornoSettimana: 'Mercoledì', settimana: 3, tipo: 'allenamento', scheda: 'A' },
  { giorno: 18, giornoSettimana: 'Giovedì', settimana: 3, tipo: 'allenamento', scheda: 'B' },
  { giorno: 19, giornoSettimana: 'Venerdì', settimana: 3, tipo: 'riposo', scheda: null },
  { giorno: 20, giornoSettimana: 'Sabato', settimana: 3, tipo: 'allenamento', scheda: 'C' },
  { giorno: 21, giornoSettimana: 'Domenica', settimana: 3, tipo: 'riposo', scheda: null },
];

// ============ FUNZIONI HELPER ============

// Funzione per ottenere il giorno corrente del ciclo (1-21)
export function getGiornoCiclo(data: Date = new Date()): number {
  const startDate = new Date(CYCLE_START_DATE);
  startDate.setHours(0, 0, 0, 0);

  const currentDate = new Date(data);
  currentDate.setHours(0, 0, 0, 0);

  const diffTime = currentDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Ciclo di 21 giorni (0-20 -> 1-21)
  const giornoCiclo = ((diffDays % 21) + 21) % 21;
  return giornoCiclo + 1;
}

// Funzione per ottenere il giorno allenamento corrente
export function getGiornoOggi(data: Date = new Date()): GiornoAllenamento {
  const giornoCiclo = getGiornoCiclo(data);
  return ciclo21Giorni[giornoCiclo - 1];
}

// Funzione per ottenere la scheda di oggi (se c'è allenamento)
export function getSchedaOggi(data: Date = new Date()): Esercizio[] | null {
  const oggi = getGiornoOggi(data);
  if (oggi.tipo === 'riposo') return null;
  return getScheda(oggi.scheda);
}

// Funzione per ottenere il prossimo allenamento
export function getProssimoAllenamento(data: Date = new Date()): { giorno: GiornoAllenamento; inGiorni: number } | null {
  const giornoCiclo = getGiornoCiclo(data);

  // Cerca nei prossimi 7 giorni
  for (let i = 1; i <= 7; i++) {
    const giornoIndex = ((giornoCiclo - 1 + i) % 21);
    const giorno = ciclo21Giorni[giornoIndex];
    if (giorno.tipo === 'allenamento') {
      return { giorno, inGiorni: i };
    }
  }

  return null;
}

// Funzione per ottenere statistiche del ciclo
export function getStatisticheCiclo(): { totaleAllenamenti: number; schedeA: number; schedeB: number; schedeC: number } {
  const allenamenti = ciclo21Giorni.filter(g => g.tipo === 'allenamento');
  return {
    totaleAllenamenti: allenamenti.length,
    schedeA: allenamenti.filter(g => g.scheda === 'A').length,
    schedeB: allenamenti.filter(g => g.scheda === 'B').length,
    schedeC: allenamenti.filter(g => g.scheda === 'C').length,
  };
}

// Orario allenamento (per sincronizzazione con alimentazione)
export const ORARIO_ALLENAMENTO = {
  feriale: { inizio: '18:00', fine: '19:30' },
  sabato: { inizio: '10:00', fine: '11:30' },
};

// Funzione per verificare se è ora di allenarsi
export function isOraAllenamento(data: Date = new Date()): boolean {
  const oggi = getGiornoOggi(data);
  if (oggi.tipo === 'riposo') return false;

  const ora = data.getHours() + data.getMinutes() / 60;
  const isSabato = oggi.giornoSettimana === 'Sabato';

  if (isSabato) {
    return ora >= 10 && ora < 11.5;
  } else {
    return ora >= 18 && ora < 19.5;
  }
}
