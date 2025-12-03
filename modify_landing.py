#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('app/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Modification 1: Add isMultiMinigame constant
old_text1 = """            // Top right corner (position 9) - Admin access
            const isAdmin = index === 9
            // Bottom right corner (position 99) - Game access
            const isGame = index === 99"""

new_text1 = """            // Top right corner (position 9) - Admin access
            const isAdmin = index === 9
            // Position 94 (numero 95, Saetta McQueen) - Multi Minigame Febbraio
            const isMultiMinigame = index === 94
            // Bottom right corner (position 99) - Game access
            const isGame = index === 99"""

content = content.replace(old_text1, new_text1)

# Modification 2: Add isMultiMinigame styling
old_text2 = """          } else if (isWishlist && wishlistEnabled) {
            // Cerchio wishlist (posizione 10) - blu SOLO se abilitato
            circleFill = 'bg-blue-500'
          } else if (ceremonyActive) {"""

new_text2 = """          } else if (isWishlist && wishlistEnabled) {
            // Cerchio wishlist (posizione 10) - blu SOLO se abilitato
            circleFill = 'bg-blue-500'
          } else if (isMultiMinigame) {
            // Cerchio 95 (Saetta McQueen) - rosso lampeggiante quando attivo
            circleFill = 'bg-red-600 animate-pulse'
          } else if (ceremonyActive) {"""

content = content.replace(old_text2, new_text2)

# Modification 3: Add onClick handler
old_text3 = """                  if (isAdmin) handleAdminAccess()
                  if (isGame && passwordInputEnabled) handleGameAccess()"""

new_text3 = """                  if (isAdmin) handleAdminAccess()
                  if (isMultiMinigame) router.push('/minigames')
                  if (isGame && passwordInputEnabled) handleGameAccess()"""

content = content.replace(old_text3, new_text3)

with open('app/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ LandingPage.tsx modified successfully!")
print("Added cerchio 95 (Saetta McQueen) for multi-minigame")
