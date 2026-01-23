import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET - Carica ultimi messaggi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')

    const supabase = createAdminClient()

    const { data: messages, error } = await supabase
      .from('game_chat_messages_game')
      .select(`
        id,
        participant_code,
        team_id,
        nickname,
        message,
        message_type,
        created_at,
        game_teams (
          team_code,
          team_name,
          team_color
        )
      `)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error loading messages:', error)
      return NextResponse.json(
        { error: 'Errore nel caricamento messaggi' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messages: messages || []
    })

  } catch (error) {
    console.error('Chat GET error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// POST - Invia nuovo messaggio
export async function POST(request: NextRequest) {
  try {
    const { participant_code, nickname, message, team_id } = await request.json()

    if (!nickname || !message) {
      return NextResponse.json(
        { error: 'Dati mancanti' },
        { status: 400 }
      )
    }

    // Validazione messaggio
    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Messaggio troppo lungo (max 500 caratteri)' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // team_id viene dal frontend:
    // - null = chat globale
    // - numero = chat di squadra
    // NON sovrascriviamo con il team del partecipante, rispettiamo la scelta dell'utente

    // Inserisci messaggio
    const { data: newMessage, error } = await supabase
      .from('game_chat_messages_game')
      .insert({
        participant_code: participant_code || null,
        team_id: team_id ?? null,
        nickname: nickname,
        message: message.trim(),
        message_type: 'user'
      })
      .select(`
        id,
        participant_code,
        team_id,
        nickname,
        message,
        message_type,
        created_at,
        game_teams (
          team_code,
          team_name,
          team_color
        )
      `)
      .single()

    if (error) {
      console.error('Error sending message:', error)
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
    console.error('Chat POST error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
