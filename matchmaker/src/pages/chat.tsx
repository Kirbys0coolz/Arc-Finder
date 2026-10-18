import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../lib/auth-context'
import { getMessages, getPartnerProfile, sendMessage, subscribeToMessages } from '../lib/chat'
import type { Message } from '../lib/chat'
import type { Profile } from '../lib/types'

// Adds messages to the list, skipping ones we already have, oldest first
function mergeMessages(current: Message[], incoming: Message[]): Message[] {
  const byId = new Map(current.map((m) => [m.id, m]))
  for (const m of incoming) byId.set(m.id, m)
  return [...byId.values()].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
}

export default function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const { user } = useAuth()
  const myId = user?.id

  const [messages, setMessages] = useState<Message[]>([])
  const [partner, setPartner] = useState<Profile | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!conversationId || !myId) return

    let cancelled = false
    setLoading(true)
    setError('')
    setMessages([])

    // Start listening first, so nothing is missed while the history loads
    const unsubscribe = subscribeToMessages(conversationId, (m) => {
      if (!cancelled) setMessages((prev) => mergeMessages(prev, [m]))
    })

    Promise.all([getMessages(conversationId), getPartnerProfile(conversationId, myId)])
      .then(([history, other]) => {
        if (cancelled) return
        setMessages((prev) => mergeMessages(prev, history))
        setPartner(other)
      })
      .catch(() => {
        if (!cancelled) setError('Could not open this conversation.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [conversationId, myId])

  // Keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const body = text.trim()
    if (!body || sending || !conversationId) return

    setSending(true)
    setError('')
    try {
      const saved = await sendMessage(conversationId, body)
      setMessages((prev) => mergeMessages(prev, [saved]))
      setText('')
    } catch {
      setError('Message not sent. Please try again.')
    }
    setSending(false)
  }

  const partnerName = partner?.name ?? 'Chat'

  return (
    <main className="chat-page">
      <style>{`
        .chat-page {
          --bg: #F6FBF7;
          --surface: #FFFFFF;
          --ink: #14261C;
          --muted: #5F7367;
          --primary: #2F7D57;
          --primary-strong: #1F5C3F;
          --tint-1: #E6F2EA;
          --tint-2: #D3E8DA;
          --border: #D8E8DD;

          min-height: 100dvh;
          color-scheme: light;
          color: var(--ink);
          background: linear-gradient(135deg, var(--bg), var(--tint-1));
          font-family: inherit;
        }

        .chat-page * { box-sizing: border-box; }
        .chat-page :where(h1, h2, p, span, div, small, header) { color: inherit; }

        .chat-shell {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 760px;
          height: 100dvh;
          margin: 0 auto;
          padding: 16px;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--surface);
          box-shadow: 0 10px 30px rgba(20, 38, 28, 0.07);
        }

        .chat-back {
          color: var(--primary-strong);
          font-weight: 800;
          text-decoration: none;
        }

        .chat-avatar {
          display: grid;
          flex: none;
          width: 44px;
          height: 44px;
          place-items: center;
          border-radius: 15px;
          background: linear-gradient(135deg, var(--primary), #3E9A6B);
          color: #FFFFFF;
          font-size: 1.25rem;
          font-weight: 800;
        }

        .chat-who { min-width: 0; }
        .chat-who h1 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 800;
          overflow-wrap: anywhere;
        }
        .chat-who p { margin: 2px 0 0; color: var(--muted); font-size: 0.8rem; }

        .chat-messages {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 8px;
          margin: 14px 0;
          padding: 4px 4px 8px;
          overflow-y: auto;
        }

        .chat-empty {
          margin: auto;
          color: var(--muted);
          text-align: center;
          line-height: 1.7;
        }

        .bubble {
          max-width: 78%;
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 0.95rem;
          line-height: 1.5;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
          animation: bubble-in 0.2s ease-out both;
        }

        .bubble small {
          display: block;
          margin-top: 4px;
          font-size: 0.68rem;
          opacity: 0.7;
        }

        .bubble.mine {
          align-self: flex-end;
          border-bottom-right-radius: 6px;
          background: var(--primary);
          color: #FFFFFF;
        }

        .bubble.theirs {
          align-self: flex-start;
          border: 1px solid var(--border);
          border-bottom-left-radius: 6px;
          background: var(--surface);
          color: var(--ink);
        }

        .chat-error {
          margin: 0 0 10px;
          padding: 10px 14px;
          border: 1px solid #FECACA;
          border-radius: 14px;
          background: #FEF2F2;
          color: #991B1B !important;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .chat-composer {
          display: flex;
          gap: 10px;
          padding: 10px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--surface);
          box-shadow: 0 10px 30px rgba(20, 38, 28, 0.07);
        }

        .chat-composer input {
          flex: 1;
          min-width: 0;
          padding: 12px 14px;
          border: 2px solid var(--border);
          border-radius: 14px;
          background: var(--surface);
          color: var(--ink);
          font: inherit;
        }

        .chat-composer input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(47, 125, 87, 0.2);
        }

        .chat-composer button {
          padding: 0 22px;
          border: 0;
          border-radius: 14px;
          background: var(--primary);
          color: #FFFFFF;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s;
        }

        .chat-composer button:hover:not(:disabled) { background: var(--primary-strong); }
        .chat-composer button:disabled { opacity: 0.6; cursor: not-allowed; }

        .chat-back:focus-visible,
        .chat-composer button:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 3px;
        }

        @keyframes bubble-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .bubble { animation: none; }
        }
      `}</style>

      <div className="chat-shell">
        <header className="chat-header">
          <Link to="/matches" className="chat-back" aria-label="Back to matches">←</Link>
          <span className="chat-avatar" aria-hidden="true">
            {partnerName.trim().charAt(0).toUpperCase()}
          </span>
          <div className="chat-who">
            <h1>{partnerName}</h1>
            {partner && <p>{partner.interests.join(' · ')}</p>}
          </div>
        </header>

        <div className="chat-messages" role="log" aria-live="polite">
          {loading && <p className="chat-empty">Opening chat...</p>}

          {!loading && messages.length === 0 && !error && (
            <p className="chat-empty">
              No messages yet.<br />Say hi and suggest a time to play!
            </p>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`bubble ${m.sender_id === myId ? 'mine' : 'theirs'}`}>
              {m.body}
              <small>
                {new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </small>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {error && <p className="chat-error" role="alert">{error}</p>}

        <form className="chat-composer" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Write a message..."
            aria-label="Message"
            maxLength={2000}
            autoComplete="off"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" disabled={sending || !text.trim()}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </main>
  )
}