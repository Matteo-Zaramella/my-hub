import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// API Key semplice per proteggere l'endpoint (da usare solo tu)
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'atr-revolution-2026'

export async function POST(request: NextRequest) {
  try {
    // Verifica API key
    const authHeader = request.headers.get('x-api-key')
    if (authHeader !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      )
    }

    const { clue_id } = await request.json()

    if (!clue_id) {
      return NextResponse.json(
        { error: 'clue_id richiesto' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Ottieni l'indizio
    const { data: clue, error: clueError } = await supabase
      .from('game_clues')
      .select(`
        *,
        game_challenges (
          challenge_number,
          challenge_name
        )
      `)
      .eq('id', clue_id)
      .single()

    if (clueError || !clue) {
      return NextResponse.json(
        { error: 'Indizio non trovato' },
        { status: 404 }
      )
    }

    if (clue.is_published) {
      return NextResponse.json(
        { error: 'Indizio già pubblicato' },
        { status: 400 }
      )
    }

    // Pubblica l'indizio
    const { error: updateError } = await supabase
      .from('game_clues')
      .update({ is_published: true })
      .eq('id', clue_id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Errore nella pubblicazione' },
        { status: 500 }
      )
    }

    // Ottieni tutti i partecipanti con email verificata
    const { data: participants } = await supabase
      .from('game_participants')
      .select('email, nickname')
      .eq('email_verified', true)

    if (!participants || participants.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Indizio pubblicato (nessun partecipante da notificare)',
        emails_sent: 0
      })
    }

    // Determina il tipo di indizio
    const clueTypes = ['GIORNO', 'ORARIO', 'LUOGO']
    const clueType = clueTypes[clue.clue_number - 1] || `Indizio ${clue.clue_number}`

    // Invia email a tutti i partecipanti
    const emailPromises = participants.map(async (p) => {
      try {
        await resend.emails.send({
          from: 'Samantha <samantha@matteozaramella.dev>',
          to: p.email,
          subject: `Nuovo indizio disponibile - Sfida ${clue.game_challenges.challenge_number}`,
          html: `
            <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <p style="color: #888; font-size: 12px; letter-spacing: 3px;">A TUTTO REALITY: LA RIVOLUZIONE</p>
              </div>

              <div style="border: 1px solid #333; padding: 30px; margin: 20px 0;">
                <p style="color: #666; font-size: 12px; margin-bottom: 10px;">
                  SFIDA ${clue.game_challenges.challenge_number} • INDIZIO ${clue.clue_number} (${clueType})
                </p>

                <div style="font-size: 18px; line-height: 1.8; color: #fff; white-space: pre-line;">
${clue.clue_text}
                </div>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://matteozaramella.dev/game"
                   style="display: inline-block; border: 1px solid #fff; color: #fff; padding: 12px 30px; text-decoration: none; font-size: 14px;">
                  Vai al gioco
                </a>
              </div>

              <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #222;">
                <p style="color: #444; font-size: 11px;">
                  Tick. Tock.<br>
                  - Samantha
                </p>
              </div>
            </div>
          `
        })
        return { email: p.email, success: true }
      } catch (err) {
        console.error(`Error sending to ${p.email}:`, err)
        return { email: p.email, success: false }
      }
    })

    const results = await Promise.all(emailPromises)
    const successCount = results.filter(r => r.success).length

    return NextResponse.json({
      success: true,
      message: `Indizio pubblicato e ${successCount}/${participants.length} email inviate`,
      clue_id: clue_id,
      emails_sent: successCount,
      total_participants: participants.length
    })

  } catch (error) {
    console.error('Publish clue error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
