import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const badgesDir = join(__dirname, '..', 'public', 'team-badges')

async function removeBlackBackground(inputPath, outputPath) {
  const image = sharp(inputPath)
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true })

  // Process pixels - make black/near-black pixels transparent
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // If pixel is very dark (black background), make it transparent
    if (r < 15 && g < 15 && b < 15) {
      data[i + 3] = 0 // Set alpha to 0
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toFile(outputPath)

  console.log(`✅ Fixed: ${outputPath}`)
}

async function removeCheckerboardBackground(inputPath, outputPath) {
  const image = sharp(inputPath)
  const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true })

  // Process pixels - remove checkerboard pattern (light gray and white alternating)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Checkerboard is typically light gray (#CCCCCC / 204,204,204) and white (#FFFFFF)
    // or similar gray tones
    const isGray = Math.abs(r - g) < 10 && Math.abs(g - b) < 10
    const isLightGray = isGray && r > 180 && r < 220
    const isWhite = isGray && r > 240

    if (isLightGray || isWhite) {
      data[i + 3] = 0 // Set alpha to 0
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toFile(outputPath)

  console.log(`✅ Fixed: ${outputPath}`)
}

async function main() {
  console.log('🔧 Fixing badge backgrounds...\n')

  try {
    // FSB - black background
    await removeBlackBackground(
      join(badgesDir, 'FSB.png'),
      join(badgesDir, 'FSB.png')
    )

    // AISE - black background
    await removeBlackBackground(
      join(badgesDir, 'AISE.png'),
      join(badgesDir, 'AISE.png')
    )

    // MSS - checkerboard background
    await removeCheckerboardBackground(
      join(badgesDir, 'MSS.png'),
      join(badgesDir, 'MSS.png')
    )

    console.log('\n✨ All badges fixed!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

main()
