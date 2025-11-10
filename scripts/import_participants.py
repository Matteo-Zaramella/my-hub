#!/usr/bin/env python3
"""
Import script for game participants
Generates SQL INSERT statements with unique codes for each participant
"""

import random
import string

def generate_code():
    """Generate a 6-character unique code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# User ID placeholder - replace with actual user ID
USER_ID = 'YOUR_USER_ID_HERE'

participants = [
    ("Alberto Faraldi", "+39 375 502 2321", "@albi.fara7", "Mare", None),
    ("Angela Franco", "+39 391 362 5924", "@angela.franco_", "Arcella", None),
    ("Angelica Bettella", "+39 377 099 8312", "@_ang3liquee_", "Amici", None),
    ("Anna Ershova", "+39 371 315 5090", None, "Colleghi", None),
    ("Anna Gianaselli", "+39 346 103 4659", "@annagianeselli", "Arcella", None),
    ("Anna Maggi", "340 397 6335", "@_anna_maggi_", "Mare", None),
    ("Anastasia Nella D'Angelo", "320 344 2704", "@any_isnot", "Famiglia", "Email: dangeloanastasia7@gmail.com, Compleanno: 17 Giugno 2002"),
    ("Beatrice Migliorato", "346 705 0237", None, None, None),
    ("Benedetta Ferronato", "+39 324 993 7015", "@benedettaferronato", None, None),
    ("Bob Roberto Pietrantonj", "+39 347 104 9123", "@roberto__pietrantonj", "Mortise", None),
    ("Carola Pagnin", "+39 388 192 4585", None, "Severi", None),
    ("Depo Matteo De Poli", "+39 342 186 0759", "@o_profeta_.poli", "Mortise", None),
    ("Elena Ardito", "+39 351 799 5370", None, None, None),
    ("Elisa Volpatti", "+39 349 685 7621", None, None, None),
    ("Emanuele Pedron", "+39 366 781 2619", None, None, None),
    ("Enrico Maragno", "327 295 1821", "@enrico_maragno", "Mortise", None),
    ("Francesca Pasini", "+39 392 204 0429", "@frannpeska", None, "Ragazza di Pietro De Zanetti"),
    ("Francesca Colombin", "+39 342 169 1670", "@francescacolombin", None, None),
    ("Francesco Colonna", "+39 339 866 9742", None, "Mortise", None),
    ("Francesco Corricelli", "+39 328 855 1458", None, None, None),
    ("Francesco Marsilio", "+39 351 319 6883", None, "Arcella", None),
    ("Francesco Nessi", "+39 345 609 8426", "@nenzi_01", "Arcella", None),
    ("Gabriele Gallo", "+39 320 344 9652", "@gg.phtgrphy", "Severi", "Email: gabrielegallo01@gmail.com"),
    ("Gabriele Zambon", "+39 340 625 9014", "@gaabriele_zambon", "Mare", None),
    ("Gaia Mancini", "329 802 8775", "@gaiaamancini_", None, None),
    ("Giovanni Francesco Garasto", "328 187 5002", "@gio_gara", "Arcella", None),
    ("Pietro Felicioli", "+39 338 908 8504", "@pietro.felicioli", "Arcella", None),
    ("Giulia", "347 661 1207", "@giuliaademonte_", None, None),
    ("Giulio", "+39 366 520 1469", None, None, None),
    ("Ippolito Lavorati", "334 940 3479", "@ippolitolavorati", "Arcella", None),
    ("Irene Toffanin", "+39 342 063 2822", "@irene.toffanin", "Arcella", None),
    ("Giacomo Boaretto", "+39 346 644 6300", "@giacomo_boaretto", "Mare", "Alias: Jack"),
    ("Matteo Giorgio Benvegnu", "+39 333 564 1156", "@matteogb_", "Severi", "Email: matteo.benvegnu@gmail.com"),
    ("Laura Rettore", "+39 331 180 5050", "@laura.rettore", "Arcella", None),
    ("Leonardo Michelotto", "+39 348 375 6058", "@leonardo_michielotto", "Arcella", None),
    ("Marco Bendistinto", "+39 366 729 8465", "@marco_bendi", "Severi", None),
    ("Matteo De Sandre", "+39 347 016 8530", "@matteodesandre12", "Famiglia", None),
    ("Mattia Bettio", "+39 328 018 7689", "@mattiabettio", "Severi", "Email: mattiabettio7@gmail.com"),
    ("Alessandro Nai", "+39 331 308 3308", "@ale_naizi", "Arcella", None),
    ("Paolo Milanesi", "+39 338 692 3346", None, "Colleghi", "Email: paoloefra@tiscali.it"),
    ("Pietro De Zanetti", "+39 392 356 4928", "@pietrodezanetti", "Severi", "Email: pietro.dezza@gmail.com"),
    ("Rachele D'Angelo", "+39 324 920 7822", "@rachele_d_angelo", "Famiglia", None),
    ("Sara Giacometti", "+39 352 043 6028", "@giacometti_sara", None, None),
    ("Sophia Gardin", "+39 388 473 2240", None, None, None),
    ("Silvia Zaramella", "+39 340 944 0128", "@sz.silviazaramella", "Famiglia", "Email: silviazazza.27@gmail.com, Compleanno: 27 Settembre 1996"),
    ("Tommaso Severino Paglia", "+39 342 358 0656", "@_la_spina_", "Mare", None),
    ("Martina Dell'Uomo", "+39 320 695 2480", "@marti.delluomo", "Arcella", "Compleanno: 06 Agosto 2002"),
    ("Tiziano Miserendino", "+39 345 103 9459", "@maquantoseialto", "Severi", "Email: vr46tizi@gmail.com"),
    ("Vittoria Bocchese", "+39 327 868 2424", "@vttrbcc", "Severi", None),
    ("Riccardo Barnaba", None, "@riccardo_barnaba_", None, "Solo Instagram"),
    ("Marco Bortolami", None, "@bortolami_marco", None, "Solo Instagram"),
    ("Daniele Gasparin", "345 034 3849", "@onesengineer1", "Famiglia", "Cugino"),
    ("Davide Boscolo", "+39 342 354 9400", "@magnus_d25", "Mortise", None),
]

# Generate unique codes
used_codes = set()
participant_data = []

for name, phone, instagram, category, notes in participants:
    code = generate_code()
    while code in used_codes:
        code = generate_code()
    used_codes.add(code)

    participant_data.append({
        'name': name,
        'phone': phone,
        'instagram': instagram,
        'category': category,
        'code': code,
        'notes': notes
    })

# Generate SQL
print("-- Generated INSERT statements for game_participants")
print(f"-- Total participants: {len(participant_data)}")
print(f"-- Replace USER_ID with your actual user ID from Supabase\n")

for p in participant_data:
    phone_val = f"'{p['phone']}'" if p['phone'] else 'NULL'
    insta_val = f"'{p['instagram']}'" if p['instagram'] else 'NULL'
    cat_val = f"'{p['category']}'" if p['category'] else 'NULL'
    notes_val = f"'{p['notes']}'" if p['notes'] else 'NULL'

    sql = f"""INSERT INTO game_participants (user_id, participant_name, phone_number, instagram_handle, category, participant_code, notes)
VALUES ('{USER_ID}', '{p['name']}', {phone_val}, {insta_val}, {cat_val}, '{p['code']}', {notes_val});"""

    print(sql)

print("\n-- Summary:")
print(f"-- Total: {len(participant_data)} participants")
print(f"-- Categories: Arcella, Mare, Severi, Mortise, Famiglia, Colleghi, Amici")
