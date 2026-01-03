import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Cron job per inviare promemoria email ai partecipanti che hanno selezionato "Forse" come RSVP.
 * Schedulato per l'11 Gennaio 2026 alle 10:00.
 */
export async function GET(request: Request) {
  // Verifica che la richiesta provenga da Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  try {
    // Trova tutti i partecipanti con RSVP = 'maybe'
    const { data: maybeResponses, error: fetchError } = await supabase
      .from('party_survey_responses')
      .select('participant_code')
      .eq('rsvp_status', 'maybe')

    if (fetchError) {
      console.error('Error fetching maybe responses:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch responses', details: fetchError },
        { status: 500 }
      )
    }

    if (!maybeResponses || maybeResponses.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No participants with maybe RSVP',
        sent: 0,
      })
    }

    // Ottieni i dati dei partecipanti (email, nome)
    const participantCodes = maybeResponses.map(r => r.participant_code)

    const { data: participants, error: participantsError } = await supabase
      .from('game_participants')
      .select('email, participant_name, participant_code')
      .in('participant_code', participantCodes)

    if (participantsError) {
      console.error('Error fetching participants:', participantsError)
      return NextResponse.json(
        { error: 'Failed to fetch participants', details: participantsError },
        { status: 500 }
      )
    }

    if (!participants || participants.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No participants found',
        sent: 0,
      })
    }

    // Invia email a ogni partecipante
    let sentCount = 0
    const errors: string[] = []

    for (const participant of participants) {
      if (!participant.email) continue

      try {
        const { error: emailError } = await resend.emails.send({
          from: 'Samantha <noreply@matteozaramella.com>',
          to: participant.email,
          subject: '⏰ Promemoria: Conferma la tua presenza! - A Tutto Reality',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background-color: #000000;
                    color: #ffffff;
                    margin: 0;
                    padding: 20px;
                  }
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: linear-gradient(135deg, #1a1a2e 0%, #000000 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 40px;
                  }
                  .header {
                    text-align: center;
                    margin-bottom: 30px;
                  }
                  .title {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0;
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                  }
                  .message {
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.6;
                    margin: 20px 0;
                  }
                  .highlight {
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    border-radius: 8px;
                    padding: 20px;
                    margin: 30px 0;
                    text-align: center;
                  }
                  .highlight-text {
                    font-size: 18px;
                    color: #f59e0b;
                    font-weight: 600;
                  }
                  .button {
                    display: inline-block;
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: #000000;
                    padding: 16px 32px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 16px;
                    margin: 30px 0;
                  }
                  .button-container {
                    text-align: center;
                    margin: 30px 0;
                  }
                  .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.4);
                  }
                  .date-box {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: center;
                  }
                  .date-label {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.5);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                  }
                  .date-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #ffffff;
                    margin-top: 5px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 class="title">⏰ Promemoria Presenza</h1>
                  </div>

                  <p class="message">
                    Ciao <strong>${participant.participant_name}</strong>,
                  </p>

                  <p class="message">
                    Abbiamo notato che hai indicato <strong>"Forse"</strong> come risposta alla tua presenza per <strong>A Tutto Reality: La Rivoluzione</strong>.
                  </p>

                  <div class="highlight">
                    <div class="highlight-text">
                      Mancano meno di 2 settimane all'evento!
                    </div>
                  </div>

                  <div class="date-box">
                    <div class="date-label">Data Evento</div>
                    <div class="date-value">24 Gennaio 2026</div>
                  </div>

                  <p class="message">
                    Per aiutarci ad organizzare al meglio la serata, ti chiediamo gentilmente di confermare la tua presenza il prima possibile.
                  </p>

                  <div class="button-container">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://my-hub-chi.vercel.app'}" class="button">
                      Conferma la tua presenza
                    </a>
                  </div>

                  <p class="message" style="font-size: 14px; color: rgba(255, 255, 255, 0.5);">
                    Accedi alla piattaforma e seleziona "Ci sarò" o "Non ci sarò" nella sezione Info.
                  </p>

                  <div class="footer">
                    <p>My Hub · A Tutto Reality: La Rivoluzione</p>
                    <p>Questa email è stata inviata automaticamente. Non rispondere a questo messaggio.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        })

        if (emailError) {
          console.error(`Error sending email to ${participant.email}:`, emailError)
          errors.push(`${participant.email}: ${emailError.message}`)
        } else {
          sentCount++
          console.log(`Reminder sent to ${participant.email}`)
        }
      } catch (err) {
        console.error(`Error processing ${participant.email}:`, err)
        errors.push(`${participant.email}: ${String(err)}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${sentCount} reminder emails`,
      sent: sentCount,
      total: participants.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Unexpected error in rsvp-reminder cron:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
