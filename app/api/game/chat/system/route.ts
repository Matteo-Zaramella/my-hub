import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST - Invia messaggio di sistema
export async function POST(request: NextRequest) {
  try {
    const { message, message_type = 'system' } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Messaggio mancante' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Inserisci messaggio di sistema
    const { data: newMessage, error } = await supabase
      .from('game_chat_messages_game')
      .insert({
        participant_code: null,
        team_id: null,
        nickname: message_type === 'samantha' ? 'Samantha' : 'Sistema',
        message: message.trim(),
        message_type: message_type  // system, samantha
      })
      .select('*')
      .single()

    if (error) {
      console.error('Error sending system message:', error)
      return NextResponse.json(
        { error: 'Errore nell\'invio del messaggio' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: newMessage
    })

  } catch (error) {
    console.error('System message error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
