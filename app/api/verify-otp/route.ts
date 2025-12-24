import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import * as bcrypt from 'bcryptjs'

const resend = new Resend(process.env.RESEND_API_KEY)

// Genera codice alfanumerico 8 caratteri maiuscolo
function generateParticipantCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: Request) {
  try {
    const { email, otp, registrationData } = await request.json()

    if (!email || !otp || !registrationData) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verifica OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', otp)
      .single()

    if (otpError || !otpRecord) {
      return NextResponse.json({ error: 'Codice errato.' }, { status: 400 })
    }

    // Verifica scadenza (10 minuti)
    const expiresAt = new Date(otpRecord.expires_at)
    if (new Date() > expiresAt) {
      // Elimina OTP scaduto
      await supabase.from('otp_codes').delete().eq('email', email)
      return NextResponse.json({ error: 'Codice scaduto.' }, { status: 400 })
    }

    // Genera codice partecipante unico
    let participantCode = ''
    let codeExists = true

    while (codeExists) {
      participantCode = generateParticipantCode()
      const { data: existing } = await supabase
        .from('game_participants')
        .select('id')
        .eq('participant_code', participantCode)
        .single()

      if (!existing) {
        codeExists = false
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registrationData.password, 10)

    // Crea partecipante
    const { error: insertError } = await supabase
      .from('game_participants')
      .insert({
        first_name: registrationData.firstName,
        last_name: registrationData.lastName,
        email: email,
        instagram: registrationData.instagram || null,
        nickname: registrationData.nickname,
        personal_message: registrationData.message || null,
        password_hash: hashedPassword,
        participant_code: participantCode,
        email_verified: true,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error creating participant:', insertError)
      return NextResponse.json({ error: 'Errore creazione account' }, { status: 500 })
    }

    // Elimina OTP usato
    await supabase.from('otp_codes').delete().eq('email', email)

    // Invia email conferma con codice
    await resend.emails.send({
      from: 'A Tutto Reality <noreply@matteozaramella.com>',
      to: email,
      subject: 'Accesso confermato',
      html: `
        <div style="font-family: monospace; padding: 20px; background: #000; color: #fff;">
          <h2>Accesso confermato</h2>
          <p>La registrazione è stata completata.</p>
          <p>Il tuo codice di accesso: <strong style="font-size: 24px; color: #a855f7;">${participantCode}</strong></p>
          <p style="color: #999;">Conservalo.</p>
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/game/area"
               style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #9333ea, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Accedi all'area riservata
            </a>
          </p>
          <hr style="border-color: #333; margin: 20px 0;">
          <p style="color: #666;">L'Entità<br>A Tutto Reality: La Rivoluzione</p>
        </div>
      `
    })

    return NextResponse.json({ success: true, participantCode })
  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ error: 'Errore verifica' }, { status: 500 })
  }
}
