#!/usr/bin/env python3
"""Make circle 95 invisible (black like others) but still clickable"""

file_path = r'D:\Claude\my-hub\app\LandingPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the red color from circle 95 - comment out the line
old_code = '''          } else if (isMultiMinigame) {
            // Cerchio 95 (Saetta McQueen) - rosso senza animazione
            circleFill = 'bg-red-600'
          } else if (ceremonyActive) {'''

new_code = '''          } else if (isMultiMinigame) {
            // Cerchio 95 (Saetta McQueen) - invisibile ma cliccabile
            // circleFill rimane vuoto (nero come gli altri)
          } else if (ceremonyActive) {'''

content = content.replace(old_code, new_code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Circle 95 is now invisible (black) but still clickable")
