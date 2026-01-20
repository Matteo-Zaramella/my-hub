import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// File dove salvare le variazioni in attesa
const VARIAZIONI_FILE = path.join(process.cwd(), 'data', 'variazioni-pending.json');

interface Variazione {
  id: string;
  timestamp: string;
  tipo: 'alimentazione' | 'palestra';
  testo: string;
  processato: boolean;
}

interface VariazioniData {
  variazioni: Variazione[];
}

function readVariazioni(): VariazioniData {
  try {
    if (fs.existsSync(VARIAZIONI_FILE)) {
      const content = fs.readFileSync(VARIAZIONI_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Errore lettura variazioni:', e);
  }
  return { variazioni: [] };
}

function writeVariazioni(data: VariazioniData): void {
  const dir = path.dirname(VARIAZIONI_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(VARIAZIONI_FILE, JSON.stringify(data, null, 2));
}

// GET - Leggi variazioni
export async function GET() {
  const data = readVariazioni();
  return NextResponse.json(data);
}

// POST - Aggiungi variazione
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, testo } = body;

    if (!tipo || !testo) {
      return NextResponse.json(
        { error: 'tipo e testo sono richiesti' },
        { status: 400 }
      );
    }

    const data = readVariazioni();
    const nuovaVariazione: Variazione = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      tipo,
      testo,
      processato: false
    };

    data.variazioni.push(nuovaVariazione);
    writeVariazioni(data);

    return NextResponse.json({ success: true, variazione: nuovaVariazione });
  } catch (e) {
    console.error('Errore salvataggio variazione:', e);
    return NextResponse.json(
      { error: 'Errore interno' },
      { status: 500 }
    );
  }
}

// DELETE - Rimuovi variazione processata
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id richiesto' },
        { status: 400 }
      );
    }

    const data = readVariazioni();
    data.variazioni = data.variazioni.filter(v => v.id !== id);
    writeVariazioni(data);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Errore eliminazione variazione:', e);
    return NextResponse.json(
      { error: 'Errore interno' },
      { status: 500 }
    );
  }
}
