import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import './Matches.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBaseballBatBall, faFutbol, faPersonHiking } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../lib/auth-context'
import { getAllProfiles } from '../lib/profiles'
import { rankMatches } from '../lib/match'
import type { Match } from '../lib/types'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { getOrCreateConversation } from '../lib/chat'

export default function Matches() {
  // "profile" is the logged-in user's own row in the profiles table
  const { user, profile, loading } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const [startingId, setStartingId] = useState<string | null>(null)
  const [chatError, setChatError] = useState('')

  async function startChat(m: Match) {
    if (!user || !m.user_id || startingId) return
    setStartingId(m.id)
    setChatError('')
    try {
      const conversationId = await getOrCreateConversation(user.id, m.user_id)
      navigate(`/chat/${conversationId}`)
    } catch {
      setChatError('Could not start the chat. Please try again.')
      setStartingId(null)
    }
  }

  useEffect(() => {
    if (!profile) return

    // Stops an old request from updating the page after you've left it
    let cancelled = false
    setFetching(true)
    setError('')

    getAllProfiles()
      .then((all) => {
        if (!cancelled) setMatches(rankMatches(profile, all))
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Could not load matches.')
      })
      .finally(() => {
        if (!cancelled) setFetching(false)
      })

    return () => {
      cancelled = true
    }
  }, [profile])

  // Logged in but no profile yet: they need to make one first
  if (!loading && !profile) return <Navigate to="/profile" replace />

  const busy = loading || fetching

  return (
    <main className="matches-page">
      <nav className="matches-nav">
        <Link to="/" className="matches-brand">
          ✦ Arc-Finder
        </Link>
        <Link to="/" className="matches-back">
          ← Back home
        </Link>
      </nav>

      <section className="matches-hero">
        <span className="matches-eyebrow">
          YOUR NEXT DISCOVERY STARTS HERE
        </span>

        <h1>
          Find your
          <br />
          <span>kind of match.</span>
        </h1>

        <p>
          Discover your next match with Arc-Finder. Your journey starts with
          exploring your preferences and interests, and finding the right connections to enhance your
           sporting experience. Whether you're looking for a new teammate, a friendly opponent, or just someone to share your passion for the game, Arc-Finder is here to help you make those connections.
        </p>
      </section>

      <section className="matches-panel">
        <div className="matches-illustration" aria-hidden="true">
          <span><FontAwesomeIcon icon={faPersonHiking} />
          </span>
          <span><FontAwesomeIcon icon={faBaseballBatBall} /></span>
          <span><FontAwesomeIcon icon={faFutbol} /></span>
        </div>

        <h2>Your matching adventure awaits!</h2>

        <p className="matches-description">
          {profile
            ? `${profile.name}, here are the people who fit you best, ranked by shared sports, schedule, play style, and skill level.`
            : 'Loading your profile...'}
        </p>

        {busy && !error && <p className="match-state">Finding your matches...</p>}

        {error && <p className="match-error" role="alert">{error}</p>}

        {chatError && <p className="match-error" role="alert">{chatError}</p>}

        {!busy && !error && matches.length === 0 && (
          <p className="match-state">
            Nobody shares a sport with you right now. Add more sports to your
            profile, or check back as more people join.
          </p>
        )}

        {!busy && !error && matches.length > 0 && (
          <ul className="match-list">
            {matches.map((m, i) => (
              <li key={m.id} style={{ '--i': i } as CSSProperties}>
                <article className={`match-card ${i === 0 ? 'match-card-top' : ''}`}>
                  <header className="match-head">
                    <span className="match-avatar" aria-hidden="true">
                      {m.name.trim().charAt(0).toUpperCase()}
                    </span>

                    <div className="match-id">
                      <h3 className="match-name">{m.name}</h3>
                      <span className="match-skill">{m.skill}</span>
                    </div>

                    <div className="match-badges">
                      {i === 0 && <span className="match-best">★ Best match</span>}
                      <span className="match-rank">#{i + 1}</span>
                    </div>
                  </header>

                  {m.bio && <p className="match-bio">“{m.bio}”</p>}

                  <ul className="match-reasons">
                    {m.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>

                  <dl className="match-details">
                    <div>
                      <dt>Plays</dt>
                      <dd>
                        {m.interests.map((s) => (
                          <span key={s} className="match-chip">{s}</span>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt>Looking for</dt>
                      <dd>
                        {m.play_styles.map((s) => (
                          <span key={s} className="match-chip match-chip-soft">{s}</span>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt>Free</dt>
                      <dd>
                        {m.availability.map((s) => (
                          <span key={s} className="match-chip match-chip-soft">{s}</span>
                        ))}
                      </dd>
                    </div>
                  </dl>

                  <div className="match-actions">
                    {m.user_id ? (
                      <button
                        type="button"
                        className="match-message"
                        onClick={() => startChat(m)}
                        disabled={startingId !== null}
                      >
                        {startingId === m.id ? 'Opening chat...' : 'Message'}
                      </button>
                    ) : (
                      <span className="match-offline">Demo profile · not on chat</span>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        <div className="matches-actions">
          <Link to="/profile" className="matches-button">
            Visit my profile →
          </Link>
          <Link to="/" className="matches-button secondary">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  )
}