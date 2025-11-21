#!/bin/bash

# Script per rinominare "The Game" in "Il Castello di Zara"

echo "🔄 Inizio sostituzione 'The Game' → 'Il Castello di Zara'..."

# Lista file da processare
files=$(find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.md" -o -name "*.json" \) ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" -exec grep -l "The Game\|the game" {} \;)

count=0

for file in $files; do
  echo "📝 Processing: $file"

  # Sostituzioni usando sed
  sed -i 's/The Game/Il Castello di Zara/g' "$file"
  sed -i 's/the game/il castello di zara/g' "$file"
  sed -i 's/THE GAME/IL CASTELLO DI ZARA/g' "$file"

  count=$((count + 1))
done

echo "✅ Completato! $count file processati."
echo "🎯 Tutti i riferimenti a 'The Game' sono stati sostituiti con 'Il Castello di Zara'"
