'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Message {
  id: number
  user_id: string
  message: string
  is_system_message: boolean
  created_at: string
  display_name?: string
}

interface UserProfile {
  user_id: string
  display_name: string
  is_online: boolean
}

export default function GroupChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([])
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

  // Initialize user and profile
  useEffect(() => {
    const initUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)

      if (user) {
        // Check if user profile exists
        const { data: profile } = await supabase
          .from('game_user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (!profile) {
          // Create profile if it doesn't exist
          const { data: newProfile } = await supabase
            .from('game_user_profiles')
            .insert({
              user_id: user.id,
              display_name: user.email?.split('@')[0] || 'Utente',
              is_original_participant: false,
            })
            .select()
            .single()

          setUserProfile(newProfile)
        } else {
          setUserProfile(profile)

          // Update online status
          await supabase
            .from('game_user_profiles')
            .update({ is_online: true, last_seen: new Date().toISOString() })
            .eq('user_id', user.id)
        }
      }
    }

    initUser()

    // Set offline on unmount
    return () => {
      if (currentUser) {
        supabase
          .from('game_user_profiles')
          .update({ is_online: false, last_seen: new Date().toISOString() })
          .eq('user_id', currentUser.id)
          .then()
      }
    }
  }, [])

  // Load messages and setup realtime
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('game_chat_messages')
        .select(
          `
          *,
          game_user_profiles!inner(display_name)
        `
        )
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) {
        console.error('Error loading messages:', error)
      } else {
        const formattedMessages = data.map((msg: any) => ({
          ...msg,
          display_name: msg.game_user_profiles?.display_name || 'Utente',
        }))
        setMessages(formattedMessages)
      }
      setLoading(false)
    }

    loadMessages()

    // Setup realtime subscription
    channelRef.current = supabase
      .channel('game-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_chat_messages',
        },
        async (payload) => {
          // Fetch user profile for the new message
          const { data: profile } = await supabase
            .from('game_user_profiles')
            .select('display_name')
            .eq('user_id', payload.new.user_id)
            .single()

          const newMsg = {
            ...payload.new,
            display_name: profile?.display_name || 'Utente',
          } as Message

          setMessages((prev) => [...prev, newMsg])
        }
      )
      .subscribe()

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [])

  // Load online users
  useEffect(() => {
    const loadOnlineUsers = async () => {
      const { data } = await supabase
        .from('game_user_profiles')
        .select('user_id, display_name, is_online')
        .eq('is_online', true)

      if (data) {
        setOnlineUsers(data)
      }
    }

    loadOnlineUsers()

    // Refresh online users every 30 seconds
    const interval = setInterval(loadOnlineUsers, 30000)
    return () => clearInterval(interval)
  }, [])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || sending) return

    setSending(true)

    try {
      const { error } = await supabase.from('game_chat_messages').insert({
        user_id: currentUser.id,
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
      <div className="flex items-center justify-center h-64">
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
            <span>{onlineUsers.length} online</span>
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
            const isOwnMessage = msg.user_id === currentUser?.id
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
                        {msg.display_name}
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
            disabled={sending || !currentUser}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending || !currentUser}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {sending ? '...' : '📤'}
          </button>
        </form>
        {!currentUser && (
          <p className="text-sm text-white/50 mt-2 text-center">
            Effettua il login per inviare messaggi
          </p>
        )}
      </div>
    </div>
  )
}
