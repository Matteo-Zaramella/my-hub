/**
 * Parser per i file di tracking Alimentazione e Palestra
 * Legge i file .md con frontmatter YAML e genera report/analytics
 *
 * Uso:
 *   node scripts/trackingParser.mjs
 *   node scripts/trackingParser.mjs --excel
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Percorsi delle cartelle tracking
const ALIMENTAZIONE_PATH = path.join(homedir(), 'Desktop', 'Alimentazione', 'tracking');
const PALESTRA_PATH = path.join(homedir(), 'Desktop', 'Palestra', 'tracking');
const OUTPUT_PATH = path.join(__dirname, '..', 'data');

// Parser YAML con js-yaml
function parseYamlFrontmatter(content) {
  // Normalizza line endings (Windows CRLF -> LF)
  const normalized = content.replace(/\r\n/g, '\n');
  const frontmatterMatch = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  try {
    return yaml.load(frontmatterMatch[1]) || {};
  } catch (e) {
    console.error('Errore parsing YAML:', e.message);
    return {};
  }
}

// Leggi tutti i file di tracking da una cartella
function readTrackingFiles(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️  Cartella non trovata: ${folderPath}`);
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
function generateAnalytics() {
  const alimentazione = readTrackingFiles(ALIMENTAZIONE_PATH);
  const palestra = readTrackingFiles(PALESTRA_PATH);

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
      for (const pasto of Object.values(giorno.pasti)) {
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
  const perGiorno = [];
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
    generato_il: new Date().toISOString(),
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
function generateCSV(analytics) {
  const lines = [];

  // Header
  lines.push('Data,Giorno Ciclo,Settimana,Tipo Giorno,Scheda,Pasti Completati,Variazioni,Valutazione Cibo,Acqua (L),Allenamento Completato,Valutazione Allenamento,Energia,Pump');

  // Dati
  for (const giorno of analytics.per_giorno) {
    const a = giorno.alimentazione;
    const p = giorno.palestra;

    const pastiCompletati = a?.pasti
      ? Object.values(a.pasti).filter(p => p?.completato).length
      : 0;
    const variazioniCount = a?.pasti
      ? Object.values(a.pasti).reduce((sum, p) => sum + (p?.variazioni?.length || 0), 0)
      : 0;

    lines.push([
      giorno.data,
      a?.giorno_ciclo || p?.giorno_ciclo || '',
      a?.settimana || p?.settimana || '',
      a?.tipo_giorno || p?.tipo || '',
      a?.scheda_allenamento || p?.scheda || '',
      pastiCompletati,
      variazioniCount,
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
