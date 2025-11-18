import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, name, participantCode } = await request.json()

    // Validazione
    if (!email || !name || !participantCode) {
      return NextResponse.json(
        { error: 'Dati mancanti' },
        { status: 400 }
      )
    }

    // Invia email di conferma
    const { data, error } = await resend.emails.send({
      from: 'My Hub <onboarding@resend.dev>', // Cambia con il tuo dominio quando configurato
      to: email,
      subject: '✅ Iscrizione Confermata - The Game',
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
                background: linear-gradient(135deg, #0a2818 0%, #000000 100%);
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
                background: linear-gradient(135deg, #22c55e, #10b981);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              .code-box {
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(34, 197, 94, 0.3);
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
                text-align: center;
              }
              .code-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.5);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
              }
              .code-value {
                font-size: 32px;
                font-weight: 700;
                color: #22c55e;
                letter-spacing: 3px;
                font-family: 'Courier New', monospace;
              }
              .message {
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.6;
                margin: 20px 0;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #22c55e, #10b981);
                color: #000000;
                padding: 16px 32px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 700;
                font-size: 16px;
                margin: 30px 0;
                transition: transform 0.2s;
              }
              .button:hover {
                transform: translateY(-2px);
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
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 class="title">✅ Iscrizione Confermata</h1>
              </div>

              <p class="message">
                Ciao <strong>${name}</strong>,
              </p>

              <p class="message">
                La tua iscrizione a <strong>The Game</strong> è stata completata con successo!
              </p>

              <div class="code-box">
                <div class="code-label">Il Tuo Codice Partecipante</div>
                <div class="code-value">${participantCode}</div>
              </div>

              <p class="message">
                Conserva questo codice con cura. Ti servirà per accedere alle sfide e monitorare il tuo progresso durante il gioco.
              </p>

              <div class="button-container">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://my-hub-chi.vercel.app'}" class="button">
                  🎮 Accedi alla Piattaforma
                </a>
              </div>

              <p class="message">
                <strong>Cosa succede ora?</strong><br>
                Riceverai ulteriori informazioni via email man mano che il gioco si avvicina.
              </p>

              <div class="footer">
                <p>My Hub · The Game</p>
                <p>Questa email è stata inviata automaticamente. Non rispondere a questo messaggio.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Errore invio email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Errore server' },
      { status: 500 }
    )
  }
}
