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

    // Crea partecipante e ottieni i dati completi
    const { data: newParticipant, error: insertError } = await supabase
      .from('game_participants')
      .insert({
        participant_name: `${registrationData.firstName} ${registrationData.lastName}`,
        participant_code: participantCode,
        email: email,
        instagram_handle: registrationData.instagram || null,
        nickname: registrationData.nickname || null,
        notes: registrationData.message || null,
        password: hashedPassword,
        registration_completed: true,
        participant_type: 'principale'
      })
      .select()
      .single()

    if (insertError || !newParticipant) {
      console.error('Error creating participant:', insertError)
      // Check for specific errors
      if (insertError?.code === '23505') {
        if (insertError.message?.includes('nickname')) {
          return NextResponse.json({ error: 'Nickname già in uso. Scegline un altro.' }, { status: 400 })
        }
        if (insertError.message?.includes('email')) {
          return NextResponse.json({ error: 'Email già registrata.' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Dati già esistenti.' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Errore creazione account' }, { status: 500 })
    }

    // Elimina OTP usato
    await supabase.from('otp_codes').delete().eq('email', email)

    // Invia email conferma con codice
    await resend.emails.send({
      from: 'Samantha <noreply@matteozaramella.com>',
      to: email,
      subject: 'Registrazione completata',
      html: `
        <div style="font-family: monospace; padding: 20px; background: #000; color: #fff;">
          <h2>Registrazione completata</h2>
          <p>Il tuo codice di accesso: <strong style="font-size: 24px; color: #a855f7;">${participantCode}</strong></p>
          <p style="color: #999;">Conservalo.</p>
        </div>
      `
    })

    // Rimuovi password dalla risposta
    const { password: _, ...participantWithoutPassword } = newParticipant
    return NextResponse.json({
      success: true,
      participantCode,
      participant: participantWithoutPassword
    })
  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ error: 'Errore verifica' }, { status: 500 })
  }
}
