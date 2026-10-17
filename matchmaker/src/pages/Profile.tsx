import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faUser } from '@fortawesome/free-solid-svg-icons'
export default function Profile() {
  return (
    <main className="profile-page">
      <style>{`
        .profile-page {
          /* Same palette as the home page */
          --bg: #F6FBF7;
          --surface: #FFFFFF;
          --ink: #14261C;
          --muted: #5F7367;
          --primary: #2F7D57;          /* placeholder – swap in your Primary hex */
          --primary-strong: #1F5C3F;
          --tint-1: #E6F2EA;
          --tint-2: #D3E8DA;
          --tint-3: #BFDDC9;
          --border: #D8E8DD;

          min-height: 100vh;
          padding: 48px 24px;
          color-scheme: light;
          color: var(--ink);
          background: linear-gradient(135deg, var(--bg), var(--tint-1));
          font-family: inherit;
        }

        .profile-page * { box-sizing: border-box; }

        /* Shield the page from global/dark-mode styles that turn text white.
           Must stay above the component rules. */
        .profile-page :where(h1, h2, h3, h4, h5, h6, p, span, div, li, small, strong, em, label, section, header, nav) {
          color: inherit;
        }

        .profile-container {
          width: 100%;
          max-width: 850px;
          margin: 0 auto;
        }

        .profile-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
        }

        .profile-brand {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--primary-strong);
          text-decoration: none;
        }

        .profile-back {
          color: var(--primary-strong);
          text-decoration: none;
          font-weight: 700;
        }

        .profile-heading {
          margin-bottom: 28px;
        }

        .profile-heading h1 {
          margin: 0 0 12px;
          color: var(--ink);
          font-size: clamp(2.5rem, 7vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.05em;
        }

        .profile-heading p {
          margin-top: 30px;
          color: var(--muted);
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .profile-panel {
          padding: clamp(24px, 5vw, 40px);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 28px;
          box-shadow: 0 20px 60px rgba(20, 38, 28, 0.08);
        }

        .profile-avatar {
          display: grid;
          width: 84px;
          height: 84px;
          margin-bottom: 22px;
          place-items: center;
          border-radius: 26px;
          background: linear-gradient(135deg, var(--tint-2), var(--tint-3));
          font-size: 2.5rem;
        }

        .profile-panel h2 {
          margin: 0 0 10px;
          color: var(--ink);
          font-size: 1.6rem;
          font-weight: 850;
        }

        .profile-panel p {
          color: var(--muted);
          line-height: 1.7;
        }

        .profile-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .profile-button {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 13px 20px;
          border-radius: 14px;
          background: var(--primary);
          color: var(--surface);
          font-weight: 800;
          text-decoration: none;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .profile-button:hover {
          transform: translateY(-3px);
          background: var(--primary-strong);
          box-shadow: 0 10px 24px rgba(47, 125, 87, 0.25);
        }

        .profile-button.secondary {
          background: var(--tint-1);
          color: var(--primary-strong);
        }

        .profile-button.secondary:hover {
          background: var(--tint-2);
        }

        .profile-brand:focus-visible,
        .profile-back:focus-visible,
        .profile-button:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-button { transition: none; }
          .profile-button:hover { transform: none; }
        }
      `}</style>

      <div className="profile-container">
        <nav className="profile-nav">
          <Link to="/" className="profile-brand">✦ Arc-Finder</Link>
          <Link to="/" className="profile-back">← Back home</Link>
        </nav>

        <header className="profile-heading">
          <h1>Your corner of the arc.</h1>
          <p>Your Arc-Finder profile and a home for your matching journey.</p>
        </header>

        <section className="profile-panel">
          <div className="profile-avatar" aria-hidden="true">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <h2>Welcome to your profile!</h2>
          <p>
            Your profile page is ready. Once your existing profile and database
            features are connected, this is where your personal details and
            preferences can live.
          </p>

          <div className="profile-actions">
            <Link to="/matches" className="profile-button">
              Find my matches  
            </Link>
            <Link to="/" className="profile-button secondary">
              Explore Arc-Finder
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}