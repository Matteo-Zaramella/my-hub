import sharp from 'sharp'
import { readdir } from 'fs/promises'
import { join } from 'path'

const sourceDir = 'C:\\Users\\offic\\Downloads\\Immagini indizi'
const targetDir = 'D:\\Claude\\my-hub\\public\\ceremony-clues-images'

// Dimensione finale delle immagini (quadrato)
const SIZE = 1000 // 1000x1000px per stampa di qualità

const images = [
  { file: 'ENIGMA.jpg', name: 'enigma' },
  { file: 'VULCANO.jpg', name: 'vulcano' },
  { file: 'OBELISCO.jpg', name: 'obelisco' },
  { file: 'LABIRINTO.png', name: 'labirinto' },
  { file: 'UMIDIFICATORE.webp', name: 'umidificatore' },
  { file: 'ZAFFIRO.jpg', name: 'zaffiro' },
  { file: 'IPNOSI.jpg', name: 'ipnosi' },
  { file: 'ORCHESTRA.jpeg', name: 'orchestra' },
  { file: 'NEBULOSA.jpg', name: 'nebulosa' },
  { file: 'ERMETICO.jpg', name: 'ermetico' }
]

console.log('🎨 Conversione immagini cerimonia in formato quadrato 1:1\n')

for (let i = 0; i < images.length; i++) {
  const { file, name } = images[i]
  const sourcePath = join(sourceDir, file)
  const targetPath = join(targetDir, `${String(i + 1).padStart(2, '0')}-${name}.jpg`)

  try {
    const image = sharp(sourcePath)
    const metadata = await image.metadata()

    console.log(`📸 [${i + 1}/10] ${file}`)
    console.log(`   Originale: ${metadata.width}x${metadata.height}px`)

    // Determina il lato più corto
    const minDimension = Math.min(metadata.width, metadata.height)

    // Ritaglia al centro per ottenere un quadrato
    // poi ridimensiona a SIZE x SIZE
    await image
      .extract({
        left: Math.floor((metadata.width - minDimension) / 2),
        top: Math.floor((metadata.height - minDimension) / 2),
        width: minDimension,
        height: minDimension
      })
      .resize(SIZE, SIZE, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 95 })
      .toFile(targetPath)

    console.log(`   ✅ Salvata: ${targetPath}`)
    console.log(`   Dimensione finale: ${SIZE}x${SIZE}px\n`)

  } catch (error) {
    console.error(`   ❌ Errore: ${error.message}\n`)
  }
}

console.log('🎉 Conversione completata!')
console.log(`\n📁 Le immagini sono salvate in: ${targetDir}`)
console.log('\n💡 Formato: 1000x1000px quadrato, JPEG qualità 95%')
console.log('   Perfetto per stampa su foglio A4 (3x3 o 2x5 layout)')
