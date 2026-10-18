import { supabase } from './supabase'
import type { Profile } from './types'

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  created_at: string
}

// Finds the conversation between two users, or creates it.
// Ids are sorted so the same pair always maps to the same row.
export async function getOrCreateConversation(myId: string, otherId: string): Promise<string> {
  const [a, b] = [myId, otherId].sort()

  const find = () =>
    supabase.from('conversations').select('id').eq('user_a', a).eq('user_b', b).maybeSingle()

  const { data: existing, error: findError } = await find()
  if (findError) throw findError
  if (existing) return existing.id

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_a: a, user_b: b })
    .select('id')
    .single()

  if (error) {
    // The other person created it at the same moment, so just fetch it
    if (error.code === '23505') {
      const { data: again, error: againError } = await find()
      if (againError || !again) throw againError ?? error
      return again.id
    }
    throw error
  }
  return data.id
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(200)
  if (error) throw error
  return data
}

export async function sendMessage(conversationId: string, body: string): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, body })
    .select()
    .single()
  if (error) throw error
  return data
}

// Calls onMessage every time a new message arrives. Returns a function that stops listening.
export function subscribeToMessages(
  conversationId: string,
  onMessage: (m: Message) => void
): () => void {
  const channel = supabase
    .channel(`chat:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onMessage(payload.new as Message)
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export async function getPartnerProfile(conversationId: string, myId: string): Promise<Profile | null> {
  const { data: convo, error } = await supabase
    .from('conversations')
    .select('user_a, user_b')
    .eq('id', conversationId)
    .single()
  if (error) throw error

  const otherId = convo.user_a === myId ? convo.user_b : convo.user_a

  const { data, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', otherId)
    .maybeSingle()
  if (profileError) throw profileError
  return data
}