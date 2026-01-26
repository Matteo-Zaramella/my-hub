import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

// Questo cron viene chiamato ogni sabato mattina
// Controlla se c'è un indizio da pubblicare oggi e invia le notifiche
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    // Trova indizi che devono essere rivelati oggi e non hanno ancora notifica inviata
    const { data: cluesToNotify, error: cluesError } = await supabase
      .from('game_clues')
      .select(`
        id,
        clue_number,
        clue_text,
        revealed_date,
        notification_sent,
        game_challenges (
          challenge_number,
          title
        )
      `)
      .eq('revealed_date', today + 'T00:00:00')
      .or('notification_sent.is.null,notification_sent.eq.false')

    if (cluesError) {
      console.error('Error fetching clues:', cluesError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!cluesToNotify || cluesToNotify.length === 0) {
      return NextResponse.json({
        message: 'Nessun indizio da notificare oggi',
        date: today
      })
    }

    // Ottieni tutti i partecipanti con email
    const { data: participants, error: partError } = await supabase
      .from('game_participants')
      .select('email, nickname')
      .not('email', 'is', null)

    if (partError || !participants || participants.length === 0) {
      return NextResponse.json({
        message: 'Nessun partecipante con email',
        clues_found: cluesToNotify.length
      })
    }

    const emails = participants.map(p => p.email).filter(Boolean) as string[]
    let totalSent = 0

    // Per ogni indizio da notificare
    for (const clue of cluesToNotify) {
      const challengeInfo = clue.game_challenges as { challenge_number: number; title: string } | null
      const clueTypes = ['GIORNO', 'ORARIO', 'LUOGO']
      const clueType = clueTypes[clue.clue_number - 1] || `Indizio ${clue.clue_number}`

      // Invia email a tutti
      const results = await Promise.allSettled(
        emails.map(email =>
          resend.emails.send({
            from: 'Samantha <noreply@matteozaramella.com>',
            to: email,
            subject: `Nuovo indizio disponibile - ${challengeInfo?.title || 'Sfida'}`,
            html: `
              <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <p style="color: #888; font-size: 12px; letter-spacing: 3px;">A TUTTO REALITY: LA RIVOLUZIONE</p>
                </div>

                <div style="border: 1px solid #333; padding: 30px; margin: 20px 0;">
                  <p style="color: #666; font-size: 12px; margin-bottom: 10px;">
                    ${challengeInfo?.title || 'SFIDA'} • INDIZIO ${clue.clue_number} (${clueType})
                  </p>

                  <div style="font-size: 18px; line-height: 1.8; color: #fff; white-space: pre-line;">
${clue.clue_text}
                  </div>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://www.matteozaramella.com/game/area"
                     style="display: inline-block; border: 1px solid #fff; color: #fff; padding: 12px 30px; text-decoration: none; font-size: 14px;">
                    Vai al gioco
                  </a>
                </div>

                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #222;">
                  <p style="color: #444; font-size: 11px;">
                    Tick. Tock.
                  </p>
                </div>
              </div>
            `
          })
        )
      )

      const sent = results.filter(r => r.status === 'fulfilled').length
      totalSent += sent

      // Marca indizio come notificato (ignora errore se colonna non esiste)
      await supabase
        .from('game_clues')
        .update({ notification_sent: true })
        .eq('id', clue.id)
        .catch(() => {}) // Ignora se colonna non esiste

      console.log(`Indizio ${clue.id}: ${sent}/${emails.length} email inviate`)
    }

    return NextResponse.json({
      success: true,
      date: today,
      clues_notified: cluesToNotify.length,
      emails_sent: totalSent,
      total_recipients: emails.length
    })

  } catch (error) {
    console.error('Cron publish-clues error:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
