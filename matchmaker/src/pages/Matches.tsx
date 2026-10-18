import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './Matches.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBaseballBatBall, faFutbol, faPersonHiking } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../lib/auth-context'
import { getAllProfiles } from '../lib/profiles'
import { rankMatches } from '../lib/match'
import type { Match } from '../lib/types'

export default function Matches() {
  // "profile" is the logged-in user's own row in the profiles table
  const { profile, loading } = useAuth()

  const [matches, setMatches] = useState<Match[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

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

        {!busy && !error && matches.length === 0 && (
          <p className="match-state">
            Nobody shares a sport with you right now. Add more sports to your
            profile, or check back as more people join.
          </p>
        )}

        {!busy && !error && matches.length > 0 && (
          <ol className="match-list">
            {matches.map((m, i) => (
              <li key={m.id}>
                <article className="match-card">
                  <div className="match-top">
                    <div className="match-who">
                      <span className="match-rank" aria-hidden="true">{i + 1}</span>
                      <h3 className="match-name">{m.name}</h3>
                    </div>
                  </div>

                  {m.bio && <p className="match-bio">{m.bio}</p>}

                  <p className="match-label">Why you matched</p>
                  <ul className="match-reasons">
                    {m.reasons.map((r) => <li key={r}>{r}</li>)}
                  </ul>

                  <p className="match-label">Plays</p>
                  <div className="match-chips">
                    {m.interests.map((s) => <span key={s} className="match-chip">{s}</span>)}
                  </div>
                </article>
              </li>
            ))}
          </ol>
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