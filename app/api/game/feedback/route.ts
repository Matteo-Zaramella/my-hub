import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

// Inizializza Resend solo se l'API key è presente
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { message, participant_code, nickname, team_name } = await request.json()

    // Validazione
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Il messaggio è obbligatorio' },
        { status: 400 }
      )
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Il messaggio non può superare i 1000 caratteri' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Salva nel database
    const { data: feedback, error: dbError } = await supabase
      .from('game_feedback')
      .insert({
        message: message.trim(),
        participant_code: participant_code || null,
        nickname: nickname || 'Anonimo',
        team_name: team_name || null
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error saving feedback:', dbError)
      return NextResponse.json(
        { error: 'Errore nel salvataggio del feedback' },
        { status: 500 }
      )
    }

    // Invia email (solo se Resend è configurato)
    if (resend) {
      try {
        await resend.emails.send({
        from: 'Feedback Cerimonia <noreply@matteozaramella.com>',
        to: 'matteo.zaramella2002@gmail.com',
        subject: `[Feedback] ${nickname || 'Anonimo'}${team_name ? ` - ${team_name}` : ''}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">
              Nuovo Feedback Ricevuto
            </h2>

            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Da:</strong> ${nickname || 'Anonimo'}</p>
              ${participant_code ? `<p style="margin: 5px 0;"><strong>Codice:</strong> ${participant_code}</p>` : ''}
              ${team_name ? `<p style="margin: 5px 0;"><strong>Squadra:</strong> ${team_name}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Data:</strong> ${new Date().toLocaleString('it-IT')}</p>
            </div>

            <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #555;">Messaggio:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${message.trim()}</p>
            </div>

            <p style="color: #888; font-size: 12px; margin-top: 20px;">
              ID Feedback: ${feedback.id}
            </p>
          </div>
        `
      })
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Non blocchiamo se l'email fallisce, il feedback è comunque salvato
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback inviato con successo'
    })

  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// GET - Lista feedback (solo admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get('key')

    if (adminKey !== process.env.ADMIN_SECRET_KEY && adminKey !== 'cerimonia2026') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const supabase = createAdminClient()

    const { data: feedbacks, error } = await supabase
      .from('game_feedback')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      feedbacks
    })

  } catch (error) {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
