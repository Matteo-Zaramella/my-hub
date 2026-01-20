/**
 * Parser per i file di tracking Alimentazione e Palestra
 * Legge i file .md con frontmatter YAML e genera report/analytics
 *
 * Uso:
 *   npx ts-node scripts/trackingParser.ts
 *   npx ts-node scripts/trackingParser.ts --excel
 */

import * as fs from 'fs';
import * as path from 'path';

// Percorsi delle cartelle tracking
const ALIMENTAZIONE_PATH = path.join(process.env.USERPROFILE || '', 'Desktop', 'Alimentazione', 'tracking');
const PALESTRA_PATH = path.join(process.env.USERPROFILE || '', 'Desktop', 'Palestra', 'tracking');
const OUTPUT_PATH = path.join(__dirname, '..', 'data');

// Interfacce
interface AlimentazioneTracking {
  data: string;
  giorno_ciclo: number;
  settimana: number;
  giorno_settimana: string;
  tipo_giorno: 'allenamento' | 'riposo';
  scheda_allenamento: 'A' | 'B' | 'C' | null;
  pasti: Record<string, {
    completato: boolean;
    variazioni: string[];
  }>;
  macros?: {
    calorie_totali: number | null;
    proteine_g: number | null;
  };
  valutazione: number;
  acqua_litri: number;
}

interface PalestraTracking {
  data: string;
  giorno_ciclo: number;
  settimana: number;
  giorno_settimana: string;
  scheda: 'A' | 'B' | 'C' | null;
  tipo: 'allenamento' | 'riposo';
  esercizi?: Array<{
    nome: string;
    serie_completate: number;
    serie_previste: number;
    peso: string;
    completato: boolean;
  }>;
  valutazione?: number;
  completato?: boolean;
  sensazioni?: {
    energia: string;
    pump: string;
    recupero: string;
  };
}

interface Analytics {
  alimentazione: {
    giorni_totali: number;
    pasti_completati: number;
    pasti_totali: number;
    percentuale_completamento: number;
    variazioni_totali: number;
    media_valutazione: number;
    media_acqua: number;
    giorni_allenamento: number;
    giorni_riposo: number;
  };
  palestra: {
    allenamenti_totali: number;
    allenamenti_completati: number;
    percentuale_completamento: number;
    media_valutazione: number;
    schede_A: number;
    schede_B: number;
    schede_C: number;
    giorni_riposo: number;
  };
  per_giorno: Array<{
    data: string;
    alimentazione: AlimentazioneTracking | null;
    palestra: PalestraTracking | null;
  }>;
}

// Parser YAML semplificato (per frontmatter)
function parseYamlFrontmatter(content: string): Record<string, any> {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  const yaml = frontmatterMatch[1];
  const result: Record<string, any> = {};

  // Parser molto semplificato - per produzione usare js-yaml
  const lines = yaml.split('\n');
  let currentKey = '';
  let currentIndent = 0;
  let stack: { obj: any; indent: number }[] = [{ obj: result, indent: 0 }];

  for (const line of lines) {
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;
    const trimmed = line.trim();

    // Array item
    if (trimmed.startsWith('- ')) {
      const value = trimmed.slice(2).trim();
      const parent = stack[stack.length - 1].obj;
      if (Array.isArray(parent)) {
        if (value.includes(':')) {
          const [k, v] = value.split(':').map(s => s.trim());
          parent.push({ [k]: parseValue(v) });
        } else {
          parent.push(parseValue(value));
        }
      }
      continue;
    }

    // Key: value
    const match = trimmed.match(/^([^:]+):\s*(.*)?$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2]?.trim() || '';

      // Trova il parent corretto basato sull'indentazione
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1].obj;

      if (value === '' || value === '[]') {
        // Nested object o array
        if (value === '[]') {
          parent[key] = [];
        } else {
          parent[key] = {};
        }
        stack.push({ obj: parent[key], indent: indent + 2 });
      } else {
        parent[key] = parseValue(value);
      }
    }
  }

  return result;
}

function parseValue(value: string): any {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  if (!isNaN(Number(value)) && value !== '') return Number(value);
  if (value.startsWith('[') && value.endsWith(']')) {
    // Simple array parsing
    const inner = value.slice(1, -1);
    if (inner === '') return [];
    return inner.split(',').map(s => parseValue(s.trim()));
  }
  return value;
}

// Leggi tutti i file di tracking da una cartella
function readTrackingFiles(folderPath: string): Record<string, any>[] {
  if (!fs.existsSync(folderPath)) {
    console.warn(`Cartella non trovata: ${folderPath}`);
    return [];
  }

  const files = fs.readdirSync(folderPath)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .sort();

  return files.map(file => {
    const content = fs.readFileSync(path.join(folderPath, file), 'utf-8');
    const data = parseYamlFrontmatter(content);
    data._filename = file;
    return data;
  });
}

// Genera analytics
function generateAnalytics(): Analytics {
  const alimentazione = readTrackingFiles(ALIMENTAZIONE_PATH) as AlimentazioneTracking[];
  const palestra = readTrackingFiles(PALESTRA_PATH) as PalestraTracking[];

  // Analytics alimentazione
  let pastiCompletati = 0;
  let pastiTotali = 0;
  let variazioni = 0;
  let totaleValutazione = 0;
  let totaleAcqua = 0;
  let giorniAllenamento = 0;
  let giorniRiposo = 0;

  for (const giorno of alimentazione) {
    if (giorno.pasti) {
      for (const pasto of Object.values(giorno.pasti) as any[]) {
        pastiTotali++;
        if (pasto?.completato) pastiCompletati++;
        if (pasto?.variazioni?.length) variazioni += pasto.variazioni.length;
      }
    }
    if (giorno.valutazione) totaleValutazione += giorno.valutazione;
    if (giorno.acqua_litri) totaleAcqua += giorno.acqua_litri;
    if (giorno.tipo_giorno === 'allenamento') giorniAllenamento++;
    else giorniRiposo++;
  }

  // Analytics palestra
  let allenamentiTotali = 0;
  let allenamentiCompletati = 0;
  let totaleValutazionePalestra = 0;
  let schedeA = 0, schedeB = 0, schedeC = 0;
  let giorniRiposoPalestra = 0;

  for (const giorno of palestra) {
    if (giorno.tipo === 'allenamento') {
      allenamentiTotali++;
      if (giorno.completato) allenamentiCompletati++;
      if (giorno.valutazione) totaleValutazionePalestra += giorno.valutazione;
      if (giorno.scheda === 'A') schedeA++;
      if (giorno.scheda === 'B') schedeB++;
      if (giorno.scheda === 'C') schedeC++;
    } else {
      giorniRiposoPalestra++;
    }
  }

  // Combina per giorno
  const perGiorno: Analytics['per_giorno'] = [];
  const allDates = new Set([
    ...alimentazione.map(a => a.data),
    ...palestra.map(p => p.data)
  ]);

  for (const data of Array.from(allDates).sort()) {
    perGiorno.push({
      data,
      alimentazione: alimentazione.find(a => a.data === data) || null,
      palestra: palestra.find(p => p.data === data) || null
    });
  }

  return {
    alimentazione: {
      giorni_totali: alimentazione.length,
      pasti_completati: pastiCompletati,
      pasti_totali: pastiTotali,
      percentuale_completamento: pastiTotali > 0 ? Math.round((pastiCompletati / pastiTotali) * 100) : 0,
      variazioni_totali: variazioni,
      media_valutazione: alimentazione.length > 0 ? +(totaleValutazione / alimentazione.length).toFixed(1) : 0,
      media_acqua: alimentazione.length > 0 ? +(totaleAcqua / alimentazione.length).toFixed(1) : 0,
      giorni_allenamento: giorniAllenamento,
      giorni_riposo: giorniRiposo
    },
    palestra: {
      allenamenti_totali: allenamentiTotali,
      allenamenti_completati: allenamentiCompletati,
      percentuale_completamento: allenamentiTotali > 0 ? Math.round((allenamentiCompletati / allenamentiTotali) * 100) : 0,
      media_valutazione: allenamentiTotali > 0 ? +(totaleValutazionePalestra / allenamentiTotali).toFixed(1) : 0,
      schede_A: schedeA,
      schede_B: schedeB,
      schede_C: schedeC,
      giorni_riposo: giorniRiposoPalestra
    },
    per_giorno: perGiorno
  };
}

// Genera CSV per Excel
function generateCSV(analytics: Analytics): string {
  const lines: string[] = [];

  // Header
  lines.push('Data,Giorno Ciclo,Settimana,Tipo Giorno,Scheda,Pasti Completati,Variazioni,Valutazione Cibo,Acqua (L),Allenamento Completato,Valutazione Allenamento,Energia,Pump');

  // Dati
  for (const giorno of analytics.per_giorno) {
    const a = giorno.alimentazione;
    const p = giorno.palestra;

    const pastiCompletati = a?.pasti
      ? Object.values(a.pasti).filter((p: any) => p?.completato).length
      : 0;
    const variazioni = a?.pasti
      ? Object.values(a.pasti).reduce((sum: number, p: any) => sum + (p?.variazioni?.length || 0), 0)
      : 0;

    lines.push([
      giorno.data,
      a?.giorno_ciclo || p?.giorno_ciclo || '',
      a?.settimana || p?.settimana || '',
      a?.tipo_giorno || p?.tipo || '',
      a?.scheda_allenamento || p?.scheda || '',
      pastiCompletati,
      variazioni,
      a?.valutazione || '',
      a?.acqua_litri || '',
      p?.completato ? 'Si' : (p?.tipo === 'riposo' ? 'Riposo' : 'No'),
      p?.valutazione || '',
      p?.sensazioni?.energia || '',
      p?.sensazioni?.pump || ''
    ].join(','));
  }

  return lines.join('\n');
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const generateExcel = args.includes('--excel') || args.includes('-e');

  console.log('📊 Parsing tracking files...\n');

  const analytics = generateAnalytics();

  // Crea cartella output se non esiste
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
  }

  // Salva JSON
  const jsonPath = path.join(OUTPUT_PATH, 'tracking-analytics.json');
  fs.writeFileSync(jsonPath, JSON.stringify(analytics, null, 2));
  console.log(`✅ Analytics JSON salvato: ${jsonPath}`);

  // Stampa summary
  console.log('\n📈 SUMMARY ALIMENTAZIONE:');
  console.log(`   Giorni tracciati: ${analytics.alimentazione.giorni_totali}`);
  console.log(`   Pasti completati: ${analytics.alimentazione.pasti_completati}/${analytics.alimentazione.pasti_totali} (${analytics.alimentazione.percentuale_completamento}%)`);
  console.log(`   Variazioni: ${analytics.alimentazione.variazioni_totali}`);
  console.log(`   Media valutazione: ${analytics.alimentazione.media_valutazione}/5`);
  console.log(`   Media acqua: ${analytics.alimentazione.media_acqua}L`);

  console.log('\n🏋️ SUMMARY PALESTRA:');
  console.log(`   Allenamenti: ${analytics.palestra.allenamenti_completati}/${analytics.palestra.allenamenti_totali} (${analytics.palestra.percentuale_completamento}%)`);
  console.log(`   Scheda A: ${analytics.palestra.schede_A}x | Scheda B: ${analytics.palestra.schede_B}x | Scheda C: ${analytics.palestra.schede_C}x`);
  console.log(`   Giorni riposo: ${analytics.palestra.giorni_riposo}`);
  console.log(`   Media valutazione: ${analytics.palestra.media_valutazione}/5`);

  // Genera CSV se richiesto
  if (generateExcel) {
    const csvPath = path.join(OUTPUT_PATH, 'tracking-report.csv');
    fs.writeFileSync(csvPath, generateCSV(analytics));
    console.log(`\n📑 CSV per Excel salvato: ${csvPath}`);
  }

  console.log('\n✨ Done!');
}

main().catch(console.error);
