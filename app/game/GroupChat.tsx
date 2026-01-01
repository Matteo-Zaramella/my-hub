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

interface Reaction {
  id: number
  message_id: number
  participant_id: number
  participant_code: string
  emoji: string
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
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
  const [canSendMessage, setCanSendMessage] = useState(true)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const presenceChannelRef = useRef<RealtimeChannel | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  const AVAILABLE_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '👏']

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load messages, reactions and setup realtime
  useEffect(() => {
    const loadData = async () => {
      // Load messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('game_chat_messages_v2')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100)

      if (messagesError) {
        console.error('Error loading messages:', messagesError)
      } else if (messagesData) {
        setMessages(messagesData)
      }

      // Load reactions
      const { data: reactionsData, error: reactionsError } = await supabase
        .from('game_chat_reactions')
        .select('*')

      if (reactionsError) {
        console.error('Error loading reactions:', reactionsError)
      } else if (reactionsData) {
        setReactions(reactionsData)
      }

      // Check rate limit
      await checkRateLimit()

      // Run cleanup function
      await supabase.rpc('cleanup_old_chat_messages')

      setLoading(false)
    }

    loadData()

    // Setup realtime subscription for messages
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
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_chat_reactions',
        },
        (payload) => {
          setReactions((prev) => [...prev, payload.new as Reaction])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'game_chat_reactions',
        },
        (payload) => {
          setReactions((prev) => prev.filter(r => r.id !== payload.old.id))
        }
      )
      .subscribe()

    // Update presence every 30 seconds in database
    const updatePresence = async () => {
      await supabase
        .from('game_chat_presence')
        .upsert({
          participant_id: participant.id,
          participant_code: participant.participant_code,
          participant_name: participant.participant_name,
          last_seen_at: new Date().toISOString(),
        })
    }

    // Initial presence update
    updatePresence()

    // Update presence every 30 seconds
    heartbeatIntervalRef.current = setInterval(updatePresence, 30000)

    // Count unique online users from database (last seen < 2 minutes)
    const updateOnlineCount = async () => {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()
      const { data, error } = await supabase
        .from('game_chat_presence')
        .select('participant_id', { count: 'exact', head: false })
        .gte('last_seen_at', twoMinutesAgo)

      if (!error && data) {
        setOnlineCount(data.length)
      }
    }

    // Initial count
    updateOnlineCount()

    // Update count every 10 seconds
    const countInterval = setInterval(updateOnlineCount, 10000)

    // Subscribe to presence changes
    presenceChannelRef.current = supabase
      .channel('game-chat-presence-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_chat_presence',
        },
        () => {
          updateOnlineCount()
        }
      )
      .subscribe()

    return () => {
      channelRef.current?.unsubscribe()
      presenceChannelRef.current?.unsubscribe()
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }
      clearInterval(countInterval)
    }
  }, [])

  // Check rate limit
  const checkRateLimit = async () => {
    const { data } = await supabase
      .from('game_chat_rate_limit')
      .select('last_message_at')
      .eq('participant_id', participant.id)
      .single()

    if (data) {
      const lastMessageTime = new Date(data.last_message_at).getTime()
      const now = new Date().getTime()
      const diffSeconds = Math.floor((now - lastMessageTime) / 1000)

      if (diffSeconds < 10) {
        setCanSendMessage(false)
        setCooldownSeconds(10 - diffSeconds)

        // Start countdown
        const interval = setInterval(() => {
          setCooldownSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(interval)
              setCanSendMessage(true)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }
  }

  // Add reaction to message
  const addReaction = async (messageId: number, emoji: string) => {
    // Check if user already reacted with this emoji
    const existingReaction = reactions.find(
      r => r.message_id === messageId &&
           r.participant_id === participant.id &&
           r.emoji === emoji
    )

    if (existingReaction) {
      // Remove reaction
      await supabase
        .from('game_chat_reactions')
        .delete()
        .eq('id', existingReaction.id)
    } else {
      // Add reaction
      await supabase
        .from('game_chat_reactions')
        .insert({
          message_id: messageId,
          participant_id: participant.id,
          participant_code: participant.participant_code,
          emoji,
        })
    }

    setShowEmojiPicker(null)
  }

  // Get reactions for a message
  const getMessageReactions = (messageId: number) => {
    const messageReactions = reactions.filter(r => r.message_id === messageId)
    const grouped = messageReactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = []
      }
      acc[reaction.emoji].push(reaction)
      return acc
    }, {} as Record<string, Reaction[]>)

    return Object.entries(grouped).map(([emoji, reactionsList]) => ({
      emoji,
      count: reactionsList.length,
      hasReacted: reactionsList.some(r => r.participant_id === participant.id),
    }))
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending || !canSendMessage) return

    setSending(true)

    try {
      // Insert message
      const { error } = await supabase.from('game_chat_messages_v2').insert({
        participant_id: participant.id,
        participant_name: participant.participant_name,
        participant_code: participant.participant_code,
        message: newMessage.trim(),
        is_system_message: false,
      })

      if (error) throw error

      // Update rate limit
      await supabase
        .from('game_chat_rate_limit')
        .upsert({
          participant_id: participant.id,
          last_message_at: new Date().toISOString(),
        })

      setNewMessage('')

      // Start cooldown
      setCanSendMessage(false)
      setCooldownSeconds(10)

      const interval = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setCanSendMessage(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
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

  // Get latest system message
  const latestSystemMessage = messages
    .filter(m => m.is_system_message)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

  return (
    <div className="flex flex-col h-full bg-black/20">
      {/* Header with online users */}
      <div className="bg-black/30 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            💬 Chat di Gruppo
          </h2>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>{onlineCount} online</span>
            </div>
            <span className="text-white/40">{messages.filter(m => !m.is_system_message).length} msg</span>
          </div>
        </div>
      </div>

      {/* Pinned System Message */}
      {latestSystemMessage && (
        <div className="bg-purple-500/10 border-b border-purple-500/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">📢</span>
            <p className="text-white/80 text-sm flex-1">{latestSystemMessage.message}</p>
            <span className="text-xs text-white/40">{formatTime(latestSystemMessage.created_at)}</span>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.filter(m => !m.is_system_message).length === 0 ? (
          <div className="text-center text-white/40 py-12">
            <p className="text-base">Nessun messaggio ancora</p>
            <p className="text-sm mt-1">Sii il primo a scrivere!</p>
          </div>
        ) : (
          messages
            .filter(m => !m.is_system_message)
            .map((msg) => {
            const isOwnMessage = msg.participant_id === participant.id

            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex flex-col gap-1 max-w-[80%] md:max-w-[70%]">
                  <div
                    className={`rounded-xl px-3 py-2 ${
                      isOwnMessage
                        ? 'bg-purple-500/30 border border-purple-500/20'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {!isOwnMessage && (
                      <div className="text-xs font-medium text-purple-300 mb-1">
                        {msg.participant_name}
                      </div>
                    )}
                    <div className="text-white/90 text-sm break-words">{msg.message}</div>
                    <div className="flex items-center justify-between mt-1 gap-2">
                      <span className="text-[10px] text-white/40">
                        {formatTime(msg.created_at)}
                      </span>
                      <button
                        onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                        className="text-xs text-white/30 hover:text-white/60 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Reactions */}
                  {getMessageReactions(msg.id).length > 0 && (
                    <div className={`flex flex-wrap gap-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      {getMessageReactions(msg.id).map((reaction) => (
                        <button
                          key={reaction.emoji}
                          onClick={() => addReaction(msg.id, reaction.emoji)}
                          className={`px-1.5 py-0.5 rounded-full text-xs flex items-center gap-0.5 transition ${
                            reaction.hasReacted
                              ? 'bg-purple-500/20 border border-purple-400/30'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <span>{reaction.emoji}</span>
                          <span className="text-white/50 text-[10px]">{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Emoji Picker */}
                  {showEmojiPicker === msg.id && (
                    <div className={`flex flex-wrap gap-1 p-2 bg-black/40 border border-white/10 rounded-lg ${isOwnMessage ? 'self-end' : 'self-start'}`}>
                      {AVAILABLE_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(msg.id, emoji)}
                          className="text-lg hover:scale-110 transition-transform p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-white/10 px-4 py-3 bg-black/30">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={canSendMessage ? "Scrivi un messaggio..." : `Attendi ${cooldownSeconds}s...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50 disabled:opacity-50"
            disabled={sending || !canSendMessage}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending || !canSendMessage}
            className="bg-purple-500/30 border border-purple-500/30 text-white px-4 py-2.5 rounded-lg hover:bg-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {sending ? '...' : !canSendMessage ? cooldownSeconds : '→'}
          </button>
        </form>
        <div className="mt-1.5 text-[10px] text-white/30 text-center">
          {newMessage.length}/500
        </div>
      </div>
    </div>
  )
}
