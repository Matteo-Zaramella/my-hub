import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email richiesta' }, { status: 400 })
    }

    const supabase = await createClient()

    // Controlla se email già registrata
    const { data: existing } = await supabase
      .from('game_participants')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Email già registrata' }, { status: 400 })
    }

    // Genera OTP 6 cifre
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Salva OTP in tabella temporanea (valido 10 minuti)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    const { error: upsertError } = await supabase
      .from('otp_codes')
      .upsert({
        email,
        code: otp,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      }, { onConflict: 'email' })

    if (upsertError) {
      console.error('Error saving OTP:', upsertError)
      return NextResponse.json({ error: 'Errore salvataggio codice' }, { status: 500 })
    }

    console.log('OTP saved successfully for:', email)

    // Invia email OTP
    console.log('Sending OTP to:', email)
    console.log('OTP code:', otp)

    const emailResult = await resend.emails.send({
      from: 'Sistema <noreply@matteozaramella.com>',
      to: email,
      subject: 'Codice di verifica',
      html: `
        <div style="font-family: monospace; padding: 20px; background: #000; color: #fff;">
          <h2>Codice di verifica</h2>
          <p>Il tuo codice: <strong style="font-size: 24px; color: #a855f7;">${otp}</strong></p>
          <p style="color: #999;">Valido per 10 minuti.</p>
        </div>
      `
    })

    console.log('Resend result:', emailResult)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: 'Errore invio codice' }, { status: 500 })
  }
}
