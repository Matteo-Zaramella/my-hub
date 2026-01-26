import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const badgesDir = join(__dirname, '..', 'public', 'team-badges')
const downloadsDir = 'C:\\Users\\matte\\Downloads'

async function removeCheckerboard(inputPath, outputPath) {
  console.log(`Processing: ${inputPath}`)

  const image = sharp(inputPath)
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true })

  let removed = 0

  // Process pixels - remove checkerboard pattern
  // Checkerboard is typically alternating gray (#CCCCCC ~204) and lighter gray (#999999 ~153)
  // or white and light gray
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Check if pixel is grayscale (R ≈ G ≈ B)
    const isGray = Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && Math.abs(r - b) < 15

    // Checkerboard colors are typically:
    // Light: ~204, 204, 204 (#CCCCCC) or ~238, 238, 238 (#EEEEEE)
    // Dark: ~153, 153, 153 (#999999) or ~204, 204, 204 (#CCCCCC)
    const isCheckerboardLight = isGray && r >= 150 && r <= 255
    const isCheckerboardDark = isGray && r >= 100 && r <= 180

    if (isCheckerboardLight || isCheckerboardDark) {
      data[i + 3] = 0 // Set alpha to 0 (transparent)
      removed++
    }
  }

  console.log(`  Removed ${removed} checkerboard pixels`)

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toFile(outputPath)

  console.log(`  ✅ Saved: ${outputPath}`)
}

async function main() {
  console.log('🔧 Fixing checkerboard backgrounds (aggressive)...\n')

  try {
    // Process MSS from downloads
    await removeCheckerboard(
      join(downloadsDir, 'mss ultimo.png'),
      join(badgesDir, 'MSS.png')
    )

    // Process AISE from downloads
    await removeCheckerboard(
      join(downloadsDir, 'aise ultimo.png'),
      join(badgesDir, 'AISE.png')
    )

    // Process FSB from downloads
    await removeCheckerboard(
      join(downloadsDir, 'fsb ultimo.png'),
      join(badgesDir, 'FSB.png')
    )

    console.log('\n✨ Done!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

main()
