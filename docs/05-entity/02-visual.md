# Aspetto Visivo

## Manifestazione

Samantha non ha un avatar o un'immagine. Si manifesta esclusivamente attraverso:
- **Testo** su sfondo nero
- **Effetti tipografici** (typing, glitch, wingdings)
- **Stile terminale/command prompt**

## Palette Colori

| Elemento | Colore | Hex |
|----------|--------|-----|
| Sfondo | Nero puro | `#000000` |
| Testo principale | Bianco | `#FFFFFF` |
| Testo secondario | Grigio | `rgba(255,255,255,0.6)` |
| Cursore | Bianco lampeggiante | `#FFFFFF` |
| Glitch rosso | Magenta | `#FF0040` |
| Glitch ciano | Ciano | `#00FFFF` |
| Wingdings | Viola | `#A855F7` |

## Effetti Visivi

### 1. Typing Effect (CMD)
- Caratteri appaiono uno alla volta
- Velocità: 60ms per carattere
- Cursore lampeggiante `_` alla fine
- Pausa tra le frasi: 800ms

### 2. Effetto Glitch RGB
- Applicato solo alla frase finale
- Durata: 1 secondo
- Text-shadow rosso/ciano sfalsato
- Shake dello schermo
- Caratteri che si spostano/deformano

### 3. Effetto Wingdings
- Testo convertito in simboli Wingdings
- Colore viola con glow
- Durata: 0.5 secondi
- Transizione finale prima del redirect

## Font

- **Font principale**: `font-mono` (monospace di sistema)
- **Dimensioni**: Responsive (text-xl → text-4xl)
- **Tracking**: Standard
