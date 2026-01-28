import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, generateOTP } from '@/lib/supabase/admin'
import { Resend } from 'resend'

// Inizializza Resend solo se l'API key è presente
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { email, nickname } = await request.json()

    if (!email || !nickname) {
      return NextResponse.json(
        { error: 'Email e nickname sono obbligatori' },
        { status: 400 }
      )
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      )
    }

    // Validazione nickname (3-20 caratteri, solo lettere, numeri, underscore)
    const nicknameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!nicknameRegex.test(nickname)) {
      return NextResponse.json(
        { error: 'Nickname non valido (3-20 caratteri, solo lettere, numeri e underscore)' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Verifica se email già registrata
    const { data: existingEmail } = await supabase
      .from('game_participants')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Questa email è già registrata' },
        { status: 400 }
      )
    }

    // Verifica se nickname già usato
    const { data: existingNickname } = await supabase
      .from('game_participants')
      .select('id')
      .ilike('nickname', nickname)
      .single()

    if (existingNickname) {
      return NextResponse.json(
        { error: 'Questo nickname è già in uso' },
        { status: 400 }
      )
    }

    // Genera OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minuti

    // Elimina OTP precedenti per questa email e inserisci nuovo
    await supabase
      .from('otp_codes')
      .delete()
      .eq('email', email.toLowerCase())

    const { error: otpError } = await supabase
      .from('otp_codes')
      .insert({
        email: email.toLowerCase(),
        code: otp,
        expires_at: expiresAt.toISOString()
      })

    if (otpError) {
      console.error('Error saving OTP:', otpError)
      return NextResponse.json(
        { error: 'Errore nel salvataggio OTP' },
        { status: 500 }
      )
    }

    // Invia email con OTP (solo se Resend è configurato)
    if (!resend) {
      console.log('Resend non configurato, OTP generato:', otp)
      return NextResponse.json({
        success: true,
        message: 'Codice generato (email non inviata in ambiente di sviluppo)'
      })
    }

    const { error: emailError } = await resend.emails.send({
      from: 'A Tutto Reality <noreply@matteozaramella.dev>',
      to: email,
      subject: 'Il tuo codice di verifica - A Tutto Reality',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px;">
          <h1 style="color: #ffffff; text-align: center; font-weight: 300; letter-spacing: 2px;">
            A TUTTO REALITY
          </h1>
          <p style="color: #888; text-align: center; margin-bottom: 30px;">
            LA RIVOLUZIONE
          </p>

          <div style="background: #111; border: 1px solid #333; padding: 30px; text-align: center; margin: 20px 0;">
            <p style="color: #aaa; margin-bottom: 10px;">Il tuo codice di verifica:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #fff;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 15px;">
              Valido per 10 minuti
            </p>
          </div>

          <p style="color: #888; font-size: 14px; text-align: center;">
            Ciao <strong>${nickname}</strong>, inserisci questo codice per completare la registrazione.
          </p>

          <p style="color: #555; font-size: 12px; text-align: center; margin-top: 40px;">
            Se non hai richiesto questo codice, ignora questa email.
          </p>
        </div>
      `
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      return NextResponse.json(
        { error: 'Errore nell\'invio email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Codice inviato! Controlla la tua email.'
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
