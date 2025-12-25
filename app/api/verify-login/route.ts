import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { code, password } = await request.json()

    if (!code || !password) {
      return NextResponse.json({ error: 'Codice e password richiesti' }, { status: 400 })
    }

    // Validate code format (8 characters)
    if (code.length !== 8) {
      return NextResponse.json({ error: 'Codice non valido' }, { status: 400 })
    }

    const supabase = await createClient()

    // Find participant by code
    const { data: participant, error } = await supabase
      .from('game_participants')
      .select('password')
      .eq('participant_code', code.toUpperCase())
      .single()

    if (error || !participant) {
      return NextResponse.json({ error: 'Codice non trovato' }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, participant.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Password errata' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error verifying login:', error)
    return NextResponse.json({ error: 'Errore di verifica' }, { status: 500 })
  }
}
