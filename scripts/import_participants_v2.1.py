#!/usr/bin/env python3
"""
Import script for game participants - Version 2.1
Generates SQL INSERT statements with unique codes and couples relationships
51 participants (removed: Laura Rettore, Paolo Milanesi)
"""

import random
import string

def generate_code():
    """Generate a 6-character unique code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# User ID placeholder - replace with actual user ID
USER_ID = 'YOUR_USER_ID_HERE'

# Participant data: (name, phone, instagram, category, notes, partner_name, is_couple)
participants = [
    ("Alberto Faraldi", "+39 375 502 2321", "@albi.fara7", "Mare", None, None, False),
    ("Angela Franco", "+39 391 362 5924", "@angela.franco_", "Arcella", None, "Emanuele Pedron", True),
    ("Angelica Bettella", "+39 377 099 8312", "@_ang3liquee_", "Amici", None, "Depo Matteo De Poli", True),
    ("Anna Ershova", "+39 371 315 5090", None, "Colleghi", None, None, False),
    ("Anna Gianaselli", "+39 346 103 4659", "@annagianeselli", "Arcella", None, "Francesco Nessi", True),
    ("Anna Maggi", "340 397 6335", "@_anna_maggi_", "Mare", None, None, False),
    ("Anastasia Nella D'Angelo", "320 344 2704", "@any_isnot", "Famiglia", "Email: dangeloanastasia7@gmail.com, Compleanno: 17 Giugno 2002, Pagina Instagram secondaria @only_any__", "Matteo Zaramella", True),
    ("Beatrice Migliorato", "346 705 0237", None, None, None, None, False),
    ("Benedetta Ferronato", "+39 324 993 7015", "@benedettaferronato", None, None, "Leonardo Michelotto", True),
    ("Bob Roberto Pietrantonj", "+39 347 104 9123", "@roberto__pietrantonj", "Mortise", None, None, False),
    ("Carola Pagnin", "+39 388 192 4585", None, "Severi", None, None, False),
    ("Depo Matteo De Poli", "+39 342 186 0759", "@o_profeta_.poli", "Mortise", None, "Angelica Bettella", True),
    ("Elena Ardito", "+39 351 799 5370", None, None, None, "Tiziano Miserendino", True),
    ("Elisa Volpatti", "+39 349 685 7621", None, None, None, "Matteo Giorgio Benvegnu", True),
    ("Emanuele Pedron", "+39 366 781 2619", None, None, None, "Angela Franco", True),
    ("Enrico Maragno", "327 295 1821", "@enrico_maragno", "Mortise", None, None, False),
    ("Francesca Pasini", "+39 392 204 0429", "@frannpeska", None, None, "Pietro De Zanetti", True),
    ("Francesca Colombin", "+39 342 169 1670", "@francescacolombin", None, None, None, False),
    ("Francesco Colonna", "+39 339 866 9742", None, "Mortise", None, None, False),
    ("Francesco Corricelli", "+39 328 855 1458", None, None, None, "Rachele D'Angelo", True),
    ("Francesco Marsilio", "+39 351 319 6883", None, "Arcella", None, None, False),
    ("Francesco Nessi", "+39 345 609 8426", "@nenzi_01", "Arcella", None, "Anna Gianaselli", True),
    ("Gabriele Gallo", "+39 320 344 9652", "@gg.phtgrphy", "Severi", "Email: gabrielegallo01@gmail.com, Account secondario @grl.gil", "Vittoria Bocchese", True),
    ("Gabriele Zambon", "+39 340 625 9014", "@gaabriele_zambon", "Mare", "Pagina svago @chiamamiiraa", None, False),
    ("Gaia Mancini", "329 802 8775", "@gaiaamancini_", None, None, None, False),
    ("Giovanni Francesco Garasto", "328 187 5002", "@gio_gara", "Arcella", None, None, False),
    ("Pietro Felicioli", "+39 338 908 8504", "@pietro.felicioli", "Arcella", None, "Martina Dell'Uomo", True),
    ("Giulia", "347 661 1207", "@giuliaademonte_", None, None, None, False),
    ("Giulio", "+39 366 520 1469", None, None, None, None, False),
    ("Ippolito Lavorati", "334 940 3479", "@ippolitolavorati", "Arcella", None, None, False),
    ("Irene Toffanin", "+39 342 063 2822", "@irene.toffanin", "Arcella", None, None, False),
    ("Giacomo Boaretto", "+39 346 644 6300", "@giacomo_boaretto", "Mare", "Alias: Jack", None, False),
    ("Matteo Giorgio Benvegnu", "+39 333 564 1156", "@matteogb_", "Severi", "Email: matteo.benvegnu@gmail.com", "Elisa Volpatti", True),
    ("Leonardo Michelotto", "+39 348 375 6058", "@leonardo_michielotto", "Arcella", None, "Benedetta Ferronato", True),
    ("Marco Bendistinto", "+39 366 729 8465", "@marco_bendi", "Severi", None, "Sophia Gardin", True),
    ("Matteo De Sandre", "+39 347 016 8530", "@matteodesandre12", "Famiglia", None, None, False),
    ("Mattia Bettio", "+39 328 018 7689", "@mattiabettio", "Severi", "Email: mattiabettio7@gmail.com", None, False),
    ("Alessandro Nai", "+39 331 308 3308", "@ale_naizi", "Arcella", None, None, False),
    ("Pietro De Zanetti", "+39 392 356 4928", "@pietrodezanetti", "Severi", "Email: pietro.dezza@gmail.com, Account foto @pietro_de_zanetti_foto", "Francesca Pasini", True),
    ("Rachele D'Angelo", "+39 324 920 7822", "@rachele_d_angelo", "Famiglia", None, "Francesco Corricelli", True),
    ("Sara Giacometti", "+39 352 043 6028", "@giacometti_sara", None, None, None, False),
    ("Sophia Gardin", "+39 388 473 2240", None, None, None, "Marco Bendistinto", True),
    ("Silvia Zaramella", "+39 340 944 0128", "@sz.silviazaramella", "Famiglia", "Relazione: Sorella, Email: silviazazza.27@gmail.com, Compleanno: 27 Settembre 1996", None, False),
    ("Tommaso Severino Paglia", "+39 342 358 0656", "@_la_spina_", "Mare", None, None, False),
    ("Martina Dell'Uomo", "+39 320 695 2480", "@marti.delluomo", "Arcella", "Compleanno: 06 Agosto 2002", "Pietro Felicioli", True),
    ("Tiziano Miserendino", "+39 345 103 9459", "@maquantoseialto", "Severi", "Email: vr46tizi@gmail.com", "Elena Ardito", True),
    ("Vittoria Bocchese", "+39 327 868 2424", "@vttrbcc", "Severi", None, "Gabriele Gallo", True),
    ("Riccardo Barnaba", None, "@riccardo_barnaba_", None, "Solo Instagram, Pagina svago @brickrick_official", None, False),
    ("Marco Bortolami", None, "@bortolami_marco", None, "Solo Instagram", None, False),
    ("Daniele Gasparin", "345 034 3849", "@onesengineer1", "Famiglia", "Relazione: Cugino", None, False),
    ("Davide Boscolo", "+39 342 354 9400", "@magnus_d25", "Mortise", None, None, False),
]

# Generate unique codes
used_codes = set()
participant_data = []

for name, phone, instagram, category, notes, partner_name, is_couple in participants:
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
        'notes': notes,
        'partner_name': partner_name,
        'is_couple': is_couple
    })

# Generate SQL
print("-- Generated INSERT statements for game_participants v2.1")
print(f"-- Total participants: {len(participant_data)}")
print(f"-- Couples: {sum(1 for p in participant_data if p['is_couple'])}")
print(f"-- Replace USER_ID with your actual user ID from Supabase\n")

for p in participant_data:
    phone_val = f"'{p['phone']}'" if p['phone'] else 'NULL'
    insta_val = f"'{p['instagram']}'" if p['instagram'] else 'NULL'
    cat_val = f"'{p['category']}'" if p['category'] else 'NULL'
    notes_val = f"'{p['notes']}'" if p['notes'] else 'NULL'
    partner_val = f"'{p['partner_name']}'" if p['partner_name'] else 'NULL'
    is_couple_val = 'TRUE' if p['is_couple'] else 'FALSE'

    sql = f"""INSERT INTO game_participants (user_id, participant_name, phone_number, instagram_handle, category, participant_code, notes, partner_name, is_couple)
VALUES ('{USER_ID}', '{p['name']}', {phone_val}, {insta_val}, {cat_val}, '{p['code']}', {notes_val}, {partner_val}, {is_couple_val});"""

    print(sql)

print("\n-- Summary:")
print(f"-- Total: {len(participant_data)} participants (was 53 in v2.0, removed Laura Rettore and Paolo Milanesi)")
print(f"-- Couples: {sum(1 for p in participant_data if p['is_couple'])} people in relationships")
print(f"-- Categories: Arcella (9), Mare (5), Severi (8), Mortise (4), Famiglia (5), Colleghi (1), Amici (1)")
