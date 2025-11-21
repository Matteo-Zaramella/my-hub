# Script PowerShell per rinominare "The Game" in "Il Castello di Zara"

Write-Host "🔄 Inizio sostituzione 'The Game' → 'Il Castello di Zara'..." -ForegroundColor Green

# Trova tutti i file
$files = Get-ChildItem -Path . -Recurse -Include *.tsx,*.ts,*.md,*.json -Exclude node_modules,.next,dist | Where-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    $content -match "The Game|the game|THE GAME"
}

$count = 0

foreach ($file in $files) {
    Write-Host "📝 Processing: $($file.FullName)" -ForegroundColor Yellow

    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # Sostituzioni
    $content = $content -replace 'The Game','Il Castello di Zara'
    $content = $content -replace 'the game','il castello di zara'
    $content = $content -replace 'THE GAME','IL CASTELLO DI ZARA'

    # Salva
    Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline

    $count++
}

Write-Host "✅ Completato! $count file processati." -ForegroundColor Green
Write-Host "🎯 Tutti i riferimenti a 'The Game' sono stati sostituiti con 'Il Castello di Zara'" -ForegroundColor Cyan
