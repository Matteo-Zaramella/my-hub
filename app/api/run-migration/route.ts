import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ error: 'SQL required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user is authenticated (optional security check)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Execute raw SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
