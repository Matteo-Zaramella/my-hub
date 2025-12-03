#!/usr/bin/env python3
"""Properly hide circle 95 by removing the bg-red-600 assignment"""

file_path = r'D:\Claude\my-hub\app\LandingPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and fix the isMultiMinigame block
new_lines = []
for i, line in enumerate(lines):
    if "circleFill = 'bg-red-600'" in line:
        # Replace the line with empty assignment (will default to '')
        new_lines.append(line.replace("circleFill = 'bg-red-600'", "// circleFill stays empty - invisible but clickable"))
    elif 'Cerchio 95 (Saetta McQueen) - rosso lampeggiante quando attivo' in line:
        new_lines.append(line.replace('rosso lampeggiante quando attivo', 'invisibile ma cliccabile'))
    elif 'Cerchio 95 (Saetta McQueen) - rosso senza animazione' in line:
        new_lines.append(line.replace('rosso senza animazione', 'invisibile ma cliccabile'))
    else:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Fixed circle 95 - now invisible")
