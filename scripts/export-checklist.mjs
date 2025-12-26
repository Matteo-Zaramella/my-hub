import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import * as fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function exportChecklist() {
  // Get all checklist items
  const { data: items, error } = await supabase
    .from('game_checklist')
    .select('*')
    .order('category')
    .order('created_at')

  if (error) {
    console.error('Error:', error)
    return null
  }

  return items
}

async function exportGamePhases() {
  const { data: phases, error } = await supabase
    .from('game_phases')
    .select('*')
    .order('phase_number')

  if (error) {
    console.error('Error phases:', error)
    return null
  }

  return phases
}

async function main() {
  const checklist = await exportChecklist()
  const phases = await exportGamePhases()

  // Create markdown content
  let content = '# A Tutto Reality: La Rivoluzione - Checklist e Fasi\n\n'
  content += `Data export: ${new Date().toLocaleString('it-IT')}\n\n`

  // Checklist
  content += '## Checklist Task\n\n'

  if (checklist && checklist.length > 0) {
    // Group by category
    const byCategory = checklist.reduce((acc, item) => {
      const cat = item.category || 'Altro'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    }, {})

    for (const [category, items] of Object.entries(byCategory)) {
      content += `### ${category}\n\n`
      for (const item of items) {
        const status = item.completed ? '✅' : '⬜'
        const priority = item.priority === 'urgent' ? '🔴 URGENTE' : item.priority === 'high' ? '🟠' : ''
        content += `- ${status} ${item.title} ${priority}\n`
        if (item.description) {
          content += `  - ${item.description}\n`
        }
      }
      content += '\n'
    }
  } else {
    content += 'Nessuna task trovata.\n\n'
  }

  // Phases
  content += '## Fasi del Gioco\n\n'

  if (phases && phases.length > 0) {
    for (const phase of phases) {
      content += `### Fase ${phase.phase_number}: ${phase.title}\n`
      content += `- Inizio: ${phase.start_date}\n`
      content += `- Fine: ${phase.end_date}\n`
      if (phase.description) {
        content += `- Descrizione: ${phase.description}\n`
      }
      content += '\n'
    }
  } else {
    content += 'Nessuna fase trovata.\n\n'
  }

  console.log(content)
  return content
}

main().then(content => {
  if (content) {
    const desktopPath = 'C:/Users/matte/Desktop/MY_HUB_CHECKLIST_EXPORT.md'
    fs.writeFileSync(desktopPath, content)
    console.log('\n✅ Exported to:', desktopPath)
  }
})
