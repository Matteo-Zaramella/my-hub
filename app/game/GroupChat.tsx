'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Message {
  id: number
  participant_id: number
  participant_name: string
  participant_code: string
  message: string
  is_system_message: boolean
  created_at: string
}

interface GroupChatProps {
  participant: {
    id: number
    participant_name: string
    participant_code: string
  }
}

export default function GroupChat({ participant }: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabase = createClient()

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load messages and setup realtime
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('game_chat_messages_v2')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) {
        console.error('Error loading messages:', error)
      } else if (data) {
        setMessages(data)
      }
      setLoading(false)
    }

    loadMessages()

    // Setup realtime subscription
    channelRef.current = supabase
      .channel('game-chat-v2')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_chat_messages_v2',
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)

    try {
      const { error } = await supabase.from('game_chat_messages_v2').insert({
        participant_id: participant.id,
        participant_name: participant.participant_name,
        participant_code: participant.participant_code,
        message: newMessage.trim(),
        is_system_message: false,
      })

      if (error) throw error

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Errore durante l\'invio del messaggio')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else {
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with online users */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            💬 Chat di Gruppo
          </h2>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{messages.length} messaggi</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-white/50 py-8">
            <p className="text-lg">Nessun messaggio ancora.</p>
            <p className="text-sm mt-2">Sii il primo a scrivere!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.participant_id === participant.id
            const isSystemMessage = msg.is_system_message

            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${isSystemMessage ? 'justify-center' : ''}`}
              >
                {isSystemMessage ? (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2 text-sm text-blue-300 text-center max-w-md">
                    {msg.message}
                  </div>
                ) : (
                  <div
                    className={`max-w-xs md:max-w-md ${isOwnMessage ? 'bg-purple-600/80' : 'bg-white/10'} backdrop-blur-sm rounded-2xl px-4 py-3 border ${isOwnMessage ? 'border-purple-500/30' : 'border-white/20'}`}
                  >
                    {!isOwnMessage && (
                      <div className="text-xs font-semibold text-white/70 mb-1">
                        {msg.participant_name}
                      </div>
                    )}
                    <div className="text-white break-words">{msg.message}</div>
                    <div
                      className={`text-xs mt-1 ${isOwnMessage ? 'text-purple-200' : 'text-white/50'}`}
                    >
                      {formatTime(msg.created_at)}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-white/10 p-4">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={sending}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {sending ? '...' : '📤'}
          </button>
        </form>
      </div>
    </div>
  )
}
