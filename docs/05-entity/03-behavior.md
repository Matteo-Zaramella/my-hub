# Comportamento

## Quando Appare Samantha

Samantha appare **una sola volta** per ogni visitatore:
- Al primo accesso al sito
- Prima della schermata di selezione nome
- Non riappare dopo (localStorage: `terminal_welcome_shown`)

## Flusso di Interazione

```
1. Schermo nero (1.5s di attesa)
2. Messaggio di benvenuto (typing)
3. Istruzioni (typing, una frase alla volta)
4. "Buon divertimento!" (typing)
5. Effetto Glitch RGB (1s)
6. Effetto Wingdings (0.5s)
7. Redirect alla selezione nome
```

## Comportamento per Frase

Ogni frase:
1. Appare carattere per carattere (typing)
2. Rimane visibile per 800ms
3. Viene cancellata carattere per carattere
4. Pausa di 800ms
5. Inizia la frase successiva

**Eccezione**: L'ultima frase ("Buon divertimento!") non viene cancellata ma subisce l'effetto glitch.

## Interazioni Utente

### Durante l'animazione
- **Nessuna interazione possibile**: L'utente deve attendere
- **No skip button**: L'esperienza è intenzionalmente non saltabile
- **No click/tap**: Input ignorati

### Dopo l'animazione
- Samantha non riappare
- L'utente procede autonomamente

## Easter Eggs

### Nomi Speciali
Se l'utente inserisce uno di questi nomi, il campo viene cancellato silenziosamente:
- GASTER
- DR GASTER
- WD GASTER
- W.D. GASTER
- W D GASTER

(Riferimento a Undertale/Deltarune)
