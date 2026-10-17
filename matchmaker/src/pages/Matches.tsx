import { Link } from 'react-router-dom'
import './Matches.css'

export default function Matches() {
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
          <span>kind of magic.</span>
        </h1>

        <p>
          Discover your next match with Arc-Finder. Your journey starts with
          exploring the profiles and preferences that make you uniquely you.
        </p>
      </section>

      <section className="matches-panel">
        <div className="matches-illustration" aria-hidden="true">
          <span>💜</span>
          <span>✨</span>
          <span>🌈</span>
        </div>

        <h2>Your matching adventure awaits!</h2>

        <p className="matches-description">
          This is your matching dashboard. We can connect it to your existing
          matching engine to calculate and display real results.
        </p>

        <div className="matches-actions">
          <Link to="/profile" className="matches-button">
            Visit my profile →
          </Link>
          <Link to="/" className="matches-button secondary">
            Back to home
          </Link>
        </div>

        <p className="matches-note">
          Real match results aren't connected to this page yet.
        </p>
      </section>
    </main>
  )
}