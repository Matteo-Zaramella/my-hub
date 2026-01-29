import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

export async function GET() {
  const supabase = createAdminClient()
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
  try {
    // Verifica che sia il giorno giusto (24 gennaio 2026)
    const now = new Date()
    const targetDate = new Date('2026-01-24')

    if (now.toDateString() !== targetDate.toDateString()) {
      return NextResponse.json({
        skipped: true,
        reason: 'Non è il 24 gennaio 2026'
      })
    }

    // Ottieni tutti i partecipanti con email
    const { data: participants, error } = await supabase
      .from('game_participants')
      .select('email, nickname')
      .not('email', 'is', null)

    if (error) {
      console.error('Error fetching participants:', error)
      return NextResponse.json({ error: 'Errore database' }, { status: 500 })
    }

    const emails = participants
      ?.filter(p => p.email)
      .map(p => p.email as string) || []

    if (emails.length === 0) {
      return NextResponse.json({ error: 'Nessun partecipante con email' }, { status: 400 })
    }

    // Invia email a tutti (solo se Resend è configurato)
    if (!resend) {
      return NextResponse.json({
        skipped: true,
        reason: 'Resend non configurato'
      })
    }

    const results = await Promise.allSettled(
      emails.map(email =>
        resend.emails.send({
          from: 'Samantha <noreply@matteozaramella.com>',
          to: email,
          subject: 'Trova i 10 indizi.',
          text: 'Trova i 10 indizi.',
          html: `
            <div style="font-family: monospace; background: #000; color: #fff; padding: 40px; text-align: center;">
              <p style="font-size: 24px; margin: 0;">Trova i 10 indizi.</p>
            </div>
          `
        })
      )
    )

    const sent = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: emails.length
    })

  } catch (error) {
    console.error('Error sending ceremony emails:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
