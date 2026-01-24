import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Configura nodemailer con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export async function POST(request: Request) {
  try {
    const { email, message } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
    }

    const emailLower = email.trim().toLowerCase()
    const messageText = message?.trim() || 'Nessun messaggio'

    // Salva la richiesta nel database
    const { error } = await supabase
      .from('game_access_requests')
      .insert({
        email: emailLower,
        message: messageText,
        status: 'pending'
      })

    if (error) {
      // Se è un duplicato, rispondi comunque con successo
      if (error.code === '23505') {
        return NextResponse.json({
          success: true,
          message: 'Richiesta già inviata in precedenza'
        })
      }
      console.error('Error saving request:', error)
      return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
    }

    // Invia email di notifica
    try {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: 'matteo.zaramella2002@gmail.com',
        subject: `[My Hub] Nuova richiesta accesso da ${emailLower}`,
        text: `Nuova richiesta di accesso al gioco:\n\nEmail: ${emailLower}\nMessaggio: ${messageText}\n\nData: ${new Date().toLocaleString('it-IT')}`,
        html: `
          <h2>Nuova richiesta di accesso</h2>
          <p><strong>Email:</strong> ${emailLower}</p>
          <p><strong>Messaggio:</strong> ${messageText}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('it-IT')}</p>
        `
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Non bloccare se l'email fallisce, la richiesta è già salvata
    }

    return NextResponse.json({
      success: true,
      message: 'Richiesta inviata con successo'
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
