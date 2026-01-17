import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, generateParticipantCode } from '@/lib/supabase/admin'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, nickname, otp } = await request.json()

    if (!email || !nickname || !otp) {
      return NextResponse.json(
        { error: 'Dati mancanti' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Verifica OTP
    const { data: otpData, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', otp)
      .single()

    if (otpError || !otpData) {
      return NextResponse.json(
        { error: 'Codice non valido' },
        { status: 400 }
      )
    }

    // Verifica scadenza
    if (new Date(otpData.expires_at) < new Date()) {
      // Elimina OTP scaduto
      await supabase
        .from('otp_codes')
        .delete()
        .eq('id', otpData.id)

      return NextResponse.json(
        { error: 'Codice scaduto. Richiedi un nuovo codice.' },
        { status: 400 }
      )
    }

    // Genera codice partecipante univoco
    let participantCode: string
    let isUnique = false

    do {
      participantCode = generateParticipantCode()
      const { data: existing } = await supabase
        .from('game_participants')
        .select('id')
        .eq('participant_code', participantCode)
        .single()

      isUnique = !existing
    } while (!isUnique)

    // Genera password casuale (non verrà usata, ma il campo è NOT NULL)
    const randomPassword = Math.random().toString(36).slice(-12)
    const passwordHash = await bcrypt.hash(randomPassword, 10)

    // Crea partecipante
    const { data: participant, error: insertError } = await supabase
      .from('game_participants')
      .insert({
        participant_code: participantCode,
        first_name: nickname, // Usa nickname come nome (campo obbligatorio)
        last_name: '-',       // Placeholder (campo obbligatorio)
        nickname: nickname,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        email_verified: true,
        total_points: 0
      })
      .select('participant_code, nickname')
      .single()

    if (insertError) {
      console.error('Error creating participant:', insertError)

      // Gestisci errore duplicato
      if (insertError.code === '23505') {
        if (insertError.message.includes('email')) {
          return NextResponse.json(
            { error: 'Questa email è già registrata' },
            { status: 400 }
          )
        }
        if (insertError.message.includes('nickname')) {
          return NextResponse.json(
            { error: 'Questo nickname è già in uso' },
            { status: 400 }
          )
        }
      }

      return NextResponse.json(
        { error: 'Errore nella creazione account' },
        { status: 500 }
      )
    }

    // Elimina OTP usato
    await supabase
      .from('otp_codes')
      .delete()
      .eq('id', otpData.id)

    return NextResponse.json({
      success: true,
      participant_code: participant.participant_code,
      nickname: participant.nickname,
      message: 'Registrazione completata!'
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
