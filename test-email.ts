/**
 * Script di test per verificare l'invio email con Resend
 *
 * Esegui con: npx tsx test-email.ts
 * (Installa tsx se necessario: npm install -D tsx)
 */

import { Resend } from 'resend'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Carica variabili d'ambiente
dotenv.config({ path: path.join(__dirname, '.env.local') })

const resend = new Resend(process.env.RESEND_API_KEY)

async function testEmail() {
  console.log('🧪 Test invio email con Resend...\n')

  // Verifica API key
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Errore: RESEND_API_KEY non trovata in .env.local')
    process.exit(1)
  }

  console.log('✅ API Key caricata')
  console.log(`📧 Invio email di test a: matteo.zaramella2002@gmail.com\n`)

  try {
    const { data, error } = await resend.emails.send({
      from: 'My Hub <onboarding@resend.dev>',
      to: 'matteo.zaramella2002@gmail.com',
      subject: '🧪 Test Email - A Tutto Reality: La Rivoluzione',
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
                <h1 class="title">🧪 Test Email Riuscito!</h1>
              </div>

              <p class="message">
                Ciao <strong>Matteo</strong>,
              </p>

              <p class="message">
                Questo è un <strong>test di invio email</strong> per verificare la configurazione di Resend.
              </p>

              <div class="code-box">
                <div class="code-label">Codice Partecipante di Test</div>
                <div class="code-value">ABC123</div>
              </div>

              <p class="message">
                Se ricevi questa email, significa che il sistema di invio email è <strong>correttamente configurato</strong> e pronto per l'uso!
              </p>

              <p class="message">
                <strong>Prossimi passi:</strong><br>
                - Integrare l'invio email nel form di registrazione<br>
                - Creare template per reminder sfide<br>
                - Configurare automazioni settimanali
              </p>

              <div class="footer">
                <p>My Hub · A Tutto Reality: La Rivoluzione</p>
                <p>Email di test inviata il ${new Date().toLocaleString('it-IT')}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Errore invio email:', error)
      process.exit(1)
    }

    console.log('✅ Email inviata con successo!')
    console.log('\n📊 Dettagli:')
    console.log('  - Email ID:', data?.id)
    console.log('  - From:', 'My Hub <onboarding@resend.dev>')
    console.log('  - To:', 'matteo.zaramella2002@gmail.com')
    console.log('\n🎉 Test completato! Controlla la tua casella email.')

  } catch (error) {
    console.error('❌ Errore durante il test:', error)
    process.exit(1)
  }
}

// Esegui test
testEmail()
