import { Link } from 'react-router-dom'
import './Matches.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBaseballBatBall, faFutbol, faPersonHiking } from '@fortawesome/free-solid-svg-icons'

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
          <span>kind of sport.</span>
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