// Menu 21 giorni - Piano Definizione
// Ciclo inizia: 19/01/2026

export const CYCLE_START_DATE = new Date('2026-01-19');

export type TipoGiorno = 'allenamento' | 'riposo';
export type TipoAllenamento = 'A' | 'B' | 'C' | null;

export interface Alimento {
  nome: string;
  quantita: string;
}

export interface Pasto {
  nome: string;
  orario: string;
  oraInizio: number; // ora in formato 24h (es. 6.5 = 06:30)
  oraFine: number;
  alimenti: Alimento[];
}

export interface GiornoMenu {
  giorno: number; // 1-21
  giornoSettimana: string;
  settimana: number; // 1-3
  tipo: TipoGiorno;
  allenamento: TipoAllenamento;
  calorie: number;
  proteine: number;
  pasti: Pasto[];
}

// Helper per creare i pasti comuni
const shakerMattutino = (conCreatina: boolean = true): Pasto => ({
  nome: 'Shaker Mattutino',
  orario: '06:30',
  oraInizio: 6.5,
  oraFine: 7,
  alimenti: [
    { nome: 'Whey protein', quantita: '30g' },
    { nome: 'Latte di avena', quantita: '200ml' },
    ...(conCreatina ? [{ nome: 'Creatina', quantita: '5g' }] : [])
  ]
});

const colazioneAlbumi = (frutta: string): Pasto => ({
  nome: 'Colazione',
  orario: '07:00',
  oraInizio: 7,
  oraFine: 10.5,
  alimenti: [
    { nome: 'Albumi', quantita: '150g (~5 albumi)' },
    { nome: 'Pane integrale', quantita: '90g' },
    { nome: frutta, quantita: frutta.includes('arancia') ? '~300g spremuta' : '150g' }
  ]
});

const colazioneWeekend = (frutta: string): Pasto => ({
  nome: 'Colazione',
  orario: '08:30',
  oraInizio: 8.5,
  oraFine: 10.5,
  alimenti: [
    { nome: 'Avena fiocchi', quantita: '70g' },
    { nome: 'Yogurt greco 0%', quantita: '150g' },
    { nome: frutta, quantita: frutta.includes('arancia') ? '~300g spremuta' : '150g' }
  ]
});

const spuntinoMattina: Pasto = {
  nome: 'Spuntino Mattina',
  orario: '10:30',
  oraInizio: 10.5,
  oraFine: 13,
  alimenti: [
    { nome: 'Yogurt greco 0%', quantita: '150g' },
    { nome: 'Clementine', quantita: '3 pz' }
  ]
};

const pranzoAllenamento = (proteina: string, verduraCotta: string): Pasto => ({
  nome: 'Pranzo',
  orario: '13:00',
  oraInizio: 13,
  oraFine: 17,
  alimenti: [
    { nome: 'Carote (antipasto)', quantita: '100g' },
    { nome: 'Riso integrale', quantita: '90g' },
    { nome: proteina, quantita: '200g' },
    { nome: verduraCotta, quantita: '200g' },
    { nome: 'Olio EVO', quantita: '1 cucchiaio' }
  ]
});

const pranzoRiposo = (proteina: string, verduraCotta: string): Pasto => ({
  nome: 'Pranzo',
  orario: '13:00',
  oraInizio: 13,
  oraFine: 17,
  alimenti: [
    { nome: 'Carote (antipasto)', quantita: '100g' },
    { nome: 'Riso integrale', quantita: '70g' },
    { nome: proteina, quantita: '200g' },
    { nome: verduraCotta, quantita: '200g' },
    { nome: 'Olio EVO', quantita: '1 cucchiaio' }
  ]
});

const preWorkout: Pasto = {
  nome: 'Pre-Workout',
  orario: '17:00',
  oraInizio: 17,
  oraFine: 19.5,
  alimenti: [
    { nome: 'Cracker integrali', quantita: '1 pacchetto' },
    { nome: 'Banana', quantita: '1 (130g)' },
    { nome: 'Mandorle', quantita: '15g' }
  ]
};

const spuntinoRiposo: Pasto = {
  nome: 'Spuntino Pomeriggio',
  orario: '17:00',
  oraInizio: 17,
  oraFine: 18,
  alimenti: [
    { nome: 'Barretta proteica', quantita: '~150 kcal' }
  ]
};

const shakerRiposo: Pasto = {
  nome: 'Shaker Pomeridiano',
  orario: '18:00',
  oraInizio: 18,
  oraFine: 20,
  alimenti: [
    { nome: 'Whey protein', quantita: '35g' },
    { nome: 'Latte di avena', quantita: '250ml' },
    { nome: 'Creatina', quantita: '5g' }
  ]
};

const postWorkout: Pasto = {
  nome: 'Post-Workout',
  orario: '19:30',
  oraInizio: 19.5,
  oraFine: 20,
  alimenti: [
    { nome: 'Whey protein', quantita: '35g' },
    { nome: 'Latte di avena', quantita: '250ml' },
    { nome: 'Creatina', quantita: '5g' }
  ]
};

const postWorkoutSabato: Pasto = {
  nome: 'Post-Workout',
  orario: '11:30',
  oraInizio: 11.5,
  oraFine: 13,
  alimenti: [
    { nome: 'Whey protein', quantita: '35g' },
    { nome: 'Latte di avena', quantita: '250ml' },
    { nome: 'Creatina', quantita: '5g' },
    { nome: 'Banana', quantita: '1 (130g)' }
  ]
};

const cenaAllenamento = (verduraCruda: string, proteina: string, quantitaProteina: string, verduraCotta: string): Pasto => ({
  nome: 'Cena',
  orario: '20:00',
  oraInizio: 20,
  oraFine: 22,
  alimenti: [
    { nome: verduraCruda + ' (antipasto)', quantita: '100g' },
    { nome: proteina, quantita: quantitaProteina },
    { nome: 'Pane integrale', quantita: '70g' },
    { nome: verduraCotta, quantita: '200g' }
  ]
});

const cenaRiposo = (verduraCruda: string, proteina: string, quantitaProteina: string, carbo: string, quantitaCarbo: string, verduraCotta: string): Pasto => ({
  nome: 'Cena',
  orario: '20:00',
  oraInizio: 20,
  oraFine: 22,
  alimenti: [
    { nome: verduraCruda + ' (antipasto)', quantita: '100g' },
    { nome: proteina, quantita: quantitaProteina },
    { nome: carbo, quantita: quantitaCarbo },
    { nome: verduraCotta, quantita: '200g' }
  ]
});

const shakerSerale: Pasto = {
  nome: 'Shaker Serale',
  orario: '22:00',
  oraInizio: 22,
  oraFine: 23.99,
  alimenti: [
    { nome: 'Whey protein', quantita: '30g' },
    { nome: 'Acqua', quantita: '250ml' }
  ]
};

const spuntinoSabato: Pasto = {
  nome: 'Spuntino Pomeriggio',
  orario: '17:00',
  oraInizio: 17,
  oraFine: 20,
  alimenti: [
    { nome: 'Cracker integrali', quantita: '1 pacchetto' },
    { nome: 'Mandorle', quantita: '15g' }
  ]
};

// ============ MENU 21 GIORNI ============

export const menu21Giorni: GiornoMenu[] = [
  // ==================== SETTIMANA 1 ====================

  // Giorno 1 - Lunedì S1 - ALLENAMENTO A
  {
    giorno: 1,
    giornoSettimana: 'Lunedì',
    settimana: 1,
    tipo: 'allenamento',
    allenamento: 'A',
    calorie: 2600,
    proteine: 235,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 arance (spremuta)'),
      spuntinoMattina,
      pranzoAllenamento('Petto di pollo', 'Spinaci'),
      preWorkout,
      postWorkout,
      cenaAllenamento('Cavolo cappuccio', 'Merluzzo', '350g', 'Zucca'),
      shakerSerale
    ]
  },

  // Giorno 2 - Martedì S1 - ALLENAMENTO B
  {
    giorno: 2,
    giornoSettimana: 'Martedì',
    settimana: 1,
    tipo: 'allenamento',
    allenamento: 'B',
    calorie: 2600,
    proteine: 235,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 kiwi'),
      spuntinoMattina,
      pranzoAllenamento('Petto di tacchino', 'Zucca'),
      preWorkout,
      postWorkout,
      cenaAllenamento('Finocchi', 'Petto di pollo', '300g', 'Fagiolini'),
      shakerSerale
    ]
  },

  // Giorno 3 - Mercoledì S1 - RIPOSO
  {
    giorno: 3,
    giornoSettimana: 'Mercoledì',
    settimana: 1,
    tipo: 'riposo',
    allenamento: null,
    calorie: 2300,
    proteine: 205,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('1 pera'),
      spuntinoMattina,
      pranzoRiposo('Orata', 'Fagiolini'),
      spuntinoRiposo,
      shakerRiposo,
      cenaRiposo('Cavolo cappuccio', 'Orata', '350g', 'Patate', '200g', 'Verza'),
      shakerSerale
    ]
  },

  // Giorno 4 - Giovedì S1 - ALLENAMENTO C
  {
    giorno: 4,
    giornoSettimana: 'Giovedì',
    settimana: 1,
    tipo: 'allenamento',
    allenamento: 'C',
    calorie: 2600,
    proteine: 235,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 arance (spremuta)'),
      spuntinoMattina,
      pranzoAllenamento('Merluzzo', 'Verza'),
      preWorkout,
      postWorkout,
      cenaAllenamento('Finocchi', 'Petto di tacchino', '300g', 'Spinaci'),
      shakerSerale
    ]
  },

  // Giorno 5 - Venerdì S1 - RIPOSO
  {
    giorno: 5,
    giornoSettimana: 'Venerdì',
    settimana: 1,
    tipo: 'riposo',
    allenamento: null,
    calorie: 2300,
    proteine: 205,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 kiwi'),
      spuntinoMattina,
      pranzoRiposo('Gamberi', 'Spinaci'),
      spuntinoRiposo,
      shakerRiposo,
      cenaRiposo('Cavolo cappuccio', 'Legumi cotti', '400g', 'Patate', '200g', 'Zucca'),
      shakerSerale
    ]
  },

  // Giorno 6 - Sabato S1 - ALLENAMENTO A (mattutino)
  {
    giorno: 6,
    giornoSettimana: 'Sabato',
    settimana: 1,
    tipo: 'allenamento',
    allenamento: 'A',
    calorie: 2550,
    proteine: 235,
    pasti: [
      colazioneWeekend('1 pera'),
      postWorkoutSabato,
      {
        nome: 'Pranzo',
        orario: '13:00',
        oraInizio: 13,
        oraFine: 17,
        alimenti: [
          { nome: 'Cavolo cappuccio (antipasto)', quantita: '100g' },
          { nome: 'Riso integrale', quantita: '90g' },
          { nome: 'Tonno al naturale', quantita: '150g' },
          { nome: 'Zucca', quantita: '200g' },
          { nome: 'Olio EVO', quantita: '1 cucchiaio' }
        ]
      },
      spuntinoSabato,
      cenaAllenamento('Finocchi', 'Branzino', '350g', 'Fagiolini'),
      shakerSerale
    ]
  },

  // Giorno 7 - Domenica S1 - RIPOSO
  {
    giorno: 7,
    giornoSettimana: 'Domenica',
    settimana: 1,
    tipo: 'riposo',
    allenamento: null,
    calorie: 2300,
    proteine: 205,
    pasti: [
      shakerMattutino(true),
      colazioneWeekend('2 arance (spremuta)'),
      spuntinoMattina,
      {
        nome: 'Pranzo',
        orario: '13:00',
        oraInizio: 13,
        oraFine: 17,
        alimenti: [
          { nome: 'Finocchi (antipasto)', quantita: '100g' },
          { nome: 'Riso integrale', quantita: '70g' },
          { nome: 'Sfilacci di cavallo', quantita: '150g' },
          { nome: 'Fagiolini', quantita: '200g' },
          { nome: 'Olio EVO', quantita: '1 cucchiaio' }
        ]
      },
      spuntinoRiposo,
      shakerRiposo,
      cenaRiposo('Cavolo cappuccio', 'Fiocchi di latte', '350g', 'Patate', '200g', 'Verza'),
      shakerSerale
    ]
  },

  // ==================== SETTIMANA 2 ====================

  // Giorno 8 - Lunedì S2 - ALLENAMENTO B
  {
    giorno: 8,
    giornoSettimana: 'Lunedì',
    settimana: 2,
    tipo: 'allenamento',
    allenamento: 'B',
    calorie: 2600,
    proteine: 235,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 arance (spremuta)'),
      spuntinoMattina,
      pranzoAllenamento('Petto di pollo', 'Verza'),
      preWorkout,
      postWorkout,
      cenaAllenamento('Finocchi', 'Merluzzo', '350g', 'Spinaci'),
      shakerSerale
    ]
  },

  // Giorno 9 - Martedì S2 - RIPOSO
  {
    giorno: 9,
    giornoSettimana: 'Martedì',
    settimana: 2,
    tipo: 'riposo',
    allenamento: null,
    calorie: 2300,
    proteine: 205,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 kiwi'),
      spuntinoMattina,
      pranzoRiposo('Petto di tacchino', 'Spinaci'),
      spuntinoRiposo,
      shakerRiposo,
      cenaRiposo('Cavolo cappuccio', 'Petto di pollo', '300g', 'Polenta', '200g', 'Zucca'),
      shakerSerale
    ]
  },

  // Giorno 10 - Mercoledì S2 - ALLENAMENTO C
  {
    giorno: 10,
    giornoSettimana: 'Mercoledì',
    settimana: 2,
    tipo: 'allenamento',
    allenamento: 'C',
    calorie: 2600,
    proteine: 235,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('1 pera'),
      spuntinoMattina,
      pranzoAllenamento('Orata', 'Zucca'),
      preWorkout,
      postWorkout,
      cenaAllenamento('Finocchi', 'Orata', '350g', 'Fagiolini'),
      shakerSerale
    ]
  },

  // Giorno 11 - Giovedì S2 - RIPOSO
  {
    giorno: 11,
    giornoSettimana: 'Giovedì',
    settimana: 2,
    tipo: 'riposo',
    allenamento: null,
    calorie: 2300,
    proteine: 205,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 arance (spremuta)'),
      spuntinoMattina,
      pranzoRiposo('Merluzzo', 'Fagiolini'),
      spuntinoRiposo,
      shakerRiposo,
      cenaRiposo('Cavolo cappuccio', 'Petto di tacchino', '300g', 'Polenta', '200g', 'Verza'),
      shakerSerale
    ]
  },

  // Giorno 12 - Venerdì S2 - ALLENAMENTO A
  {
    giorno: 12,
    giornoSettimana: 'Venerdì',
    settimana: 2,
    tipo: 'allenamento',
    allenamento: 'A',
    calorie: 2600,
    proteine: 235,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 kiwi'),
      spuntinoMattina,
      pranzoAllenamento('Gamberi', 'Verza'),
      preWorkout,
      postWorkout,
      cenaAllenamento('Finocchi', 'Legumi cotti', '400g', 'Spinaci'),
      shakerSerale
    ]
  },

  // Giorno 13 - Sabato S2 - ALLENAMENTO B (mattutino)
  {
    giorno: 13,
    giornoSettimana: 'Sabato',
    settimana: 2,
    tipo: 'allenamento',
    allenamento: 'B',
    calorie: 2550,
    proteine: 235,
    pasti: [
      colazioneWeekend('1 pera'),
      postWorkoutSabato,
      {
        nome: 'Pranzo',
        orario: '13:00',
        oraInizio: 13,
        oraFine: 17,
        alimenti: [
          { nome: 'Finocchi (antipasto)', quantita: '100g' },
          { nome: 'Riso integrale', quantita: '90g' },
          { nome: 'Tonno al naturale', quantita: '150g' },
          { nome: 'Spinaci', quantita: '200g' },
          { nome: 'Olio EVO', quantita: '1 cucchiaio' }
        ]
      },
      spuntinoSabato,
      cenaAllenamento('Cavolo cappuccio', 'Branzino', '350g', 'Zucca'),
      shakerSerale
    ]
  },

  // Giorno 14 - Domenica S2 - RIPOSO
  {
    giorno: 14,
    giornoSettimana: 'Domenica',
    settimana: 2,
    tipo: 'riposo',
    allenamento: null,
    calorie: 2300,
    proteine: 205,
    pasti: [
      shakerMattutino(true),
      colazioneWeekend('2 arance (spremuta)'),
      spuntinoMattina,
      {
        nome: 'Pranzo',
        orario: '13:00',
        oraInizio: 13,
        oraFine: 17,
        alimenti: [
          { nome: 'Cavolo cappuccio (antipasto)', quantita: '100g' },
          { nome: 'Riso integrale', quantita: '70g' },
          { nome: 'Sfilacci di cavallo', quantita: '150g' },
          { nome: 'Zucca', quantita: '200g' },
          { nome: 'Olio EVO', quantita: '1 cucchiaio' }
        ]
      },
      spuntinoRiposo,
      shakerRiposo,
      cenaRiposo('Finocchi', 'Fiocchi di latte', '350g', 'Patate', '200g', 'Fagiolini'),
      shakerSerale
    ]
  },

  // ==================== SETTIMANA 3 ====================

  // Giorno 15 - Lunedì S3 - ALLENAMENTO C
  {
    giorno: 15,
    giornoSettimana: 'Lunedì',
    settimana: 3,
    tipo: 'allenamento',
    allenamento: 'C',
    calorie: 2600,
    proteine: 235,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 arance (spremuta)'),
      spuntinoMattina,
      pranzoAllenamento('Petto di pollo', 'Fagiolini'),
      preWorkout,
      postWorkout,
      cenaAllenamento('Cavolo cappuccio', 'Merluzzo', '350g', 'Verza'),
      shakerSerale
    ]
  },

  // Giorno 16 - Martedì S3 - RIPOSO
  {
    giorno: 16,
    giornoSettimana: 'Martedì',
    settimana: 3,
    tipo: 'riposo',
    allenamento: null,
    calorie: 2300,
    proteine: 205,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 kiwi'),
      spuntinoMattina,
      pranzoRiposo('Petto di tacchino', 'Verza'),
      spuntinoRiposo,
      shakerRiposo,
      cenaRiposo('Finocchi', 'Petto di pollo', '300g', 'Polenta', '200g', 'Spinaci'),
      shakerSerale
    ]
  },

  // Giorno 17 - Mercoledì S3 - ALLENAMENTO A
  {
    giorno: 17,
    giornoSettimana: 'Mercoledì',
    settimana: 3,
    tipo: 'allenamento',
    allenamento: 'A',
    calorie: 2600,
    proteine: 235,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('1 pera'),
      spuntinoMattina,
      pranzoAllenamento('Orata', 'Spinaci'),
      preWorkout,
      postWorkout,
      cenaAllenamento('Cavolo cappuccio', 'Orata', '350g', 'Zucca'),
      shakerSerale
    ]
  },

  // Giorno 18 - Giovedì S3 - ALLENAMENTO B
  {
    giorno: 18,
    giornoSettimana: 'Giovedì',
    settimana: 3,
    tipo: 'allenamento',
    allenamento: 'B',
    calorie: 2600,
    proteine: 235,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 arance (spremuta)'),
      spuntinoMattina,
      pranzoAllenamento('Merluzzo', 'Zucca'),
      preWorkout,
      postWorkout,
      cenaAllenamento('Finocchi', 'Petto di tacchino', '300g', 'Fagiolini'),
      shakerSerale
    ]
  },

  // Giorno 19 - Venerdì S3 - RIPOSO
  {
    giorno: 19,
    giornoSettimana: 'Venerdì',
    settimana: 3,
    tipo: 'riposo',
    allenamento: null,
    calorie: 2300,
    proteine: 205,
    pasti: [
      shakerMattutino(true),
      colazioneAlbumi('2 kiwi'),
      spuntinoMattina,
      pranzoRiposo('Gamberi', 'Fagiolini'),
      spuntinoRiposo,
      shakerRiposo,
      cenaRiposo('Cavolo cappuccio', 'Legumi cotti', '400g', 'Patate', '200g', 'Verza'),
      shakerSerale
    ]
  },

  // Giorno 20 - Sabato S3 - ALLENAMENTO C (mattutino)
  {
    giorno: 20,
    giornoSettimana: 'Sabato',
    settimana: 3,
    tipo: 'allenamento',
    allenamento: 'C',
    calorie: 2550,
    proteine: 235,
    pasti: [
      colazioneWeekend('1 pera'),
      postWorkoutSabato,
      {
        nome: 'Pranzo',
        orario: '13:00',
        oraInizio: 13,
        oraFine: 17,
        alimenti: [
          { nome: 'Cavolo cappuccio (antipasto)', quantita: '100g' },
          { nome: 'Riso integrale', quantita: '90g' },
          { nome: 'Tonno al naturale', quantita: '150g' },
          { nome: 'Verza', quantita: '200g' },
          { nome: 'Olio EVO', quantita: '1 cucchiaio' }
        ]
      },
      spuntinoSabato,
      cenaAllenamento('Finocchi', 'Branzino', '350g', 'Spinaci'),
      shakerSerale
    ]
  },

  // Giorno 21 - Domenica S3 - RIPOSO
  {
    giorno: 21,
    giornoSettimana: 'Domenica',
    settimana: 3,
    tipo: 'riposo',
    allenamento: null,
    calorie: 2300,
    proteine: 205,
    pasti: [
      shakerMattutino(true),
      colazioneWeekend('2 arance (spremuta)'),
      spuntinoMattina,
      {
        nome: 'Pranzo',
        orario: '13:00',
        oraInizio: 13,
        oraFine: 17,
        alimenti: [
          { nome: 'Finocchi (antipasto)', quantita: '100g' },
          { nome: 'Riso integrale', quantita: '70g' },
          { nome: 'Sfilacci di cavallo', quantita: '150g' },
          { nome: 'Spinaci', quantita: '200g' },
          { nome: 'Olio EVO', quantita: '1 cucchiaio' }
        ]
      },
      spuntinoRiposo,
      shakerRiposo,
      cenaRiposo('Cavolo cappuccio', 'Fiocchi di latte', '350g', 'Patate', '200g', 'Zucca'),
      shakerSerale
    ]
  }
];

// Funzione per ottenere il giorno corrente del ciclo (1-21)
export function getGiornoCiclo(data: Date = new Date()): number {
  const startDate = new Date(CYCLE_START_DATE);
  startDate.setHours(0, 0, 0, 0);

  const currentDate = new Date(data);
  currentDate.setHours(0, 0, 0, 0);

  const diffTime = currentDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Ciclo di 21 giorni (0-20 -> 1-21)
  const giornoCiclo = ((diffDays % 21) + 21) % 21; // Gestisce anche date precedenti
  return giornoCiclo + 1;
}

// Funzione per ottenere il menu del giorno corrente
export function getMenuOggi(data: Date = new Date()): GiornoMenu {
  const giornoCiclo = getGiornoCiclo(data);
  return menu21Giorni[giornoCiclo - 1];
}

// Funzione per ottenere il pasto corrente in base all'orario
export function getPastoCorrente(data: Date = new Date()): Pasto | null {
  const menu = getMenuOggi(data);
  const ora = data.getHours() + data.getMinutes() / 60;

  // Trova il pasto corrente
  for (const pasto of menu.pasti) {
    if (ora >= pasto.oraInizio && ora < pasto.oraFine) {
      return pasto;
    }
  }

  // Se prima del primo pasto
  if (ora < menu.pasti[0].oraInizio) {
    return null; // Nessun pasto ancora
  }

  // Se dopo l'ultimo pasto
  return null;
}

// Funzione per ottenere il prossimo pasto
export function getProssimoPasto(data: Date = new Date()): Pasto | null {
  const menu = getMenuOggi(data);
  const ora = data.getHours() + data.getMinutes() / 60;

  for (const pasto of menu.pasti) {
    if (ora < pasto.oraInizio) {
      return pasto;
    }
  }

  return null; // Nessun pasto rimanente oggi
}
