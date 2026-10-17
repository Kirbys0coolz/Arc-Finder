import { Link } from 'react-router-dom'

export default function Profile() {
  return (
    <main className="profile-page">
      <style>{`
        .profile-page {
          min-height: 100vh;
          padding: 48px 24px;
          color: #252044;
          background: linear-gradient(135deg, #fff5e8, #f4eaff, #e6faff);
          font-family: inherit;
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
          color: #7047eb;
          text-decoration: none;
        }

        .profile-back {
          color: #7047eb;
          text-decoration: none;
          font-weight: 700;
        }

        .profile-heading {
          margin-bottom: 28px;
        }

        .profile-heading h1 {
          margin: 0 0 12px;
          font-size: clamp(2.5rem, 7vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.05em;
        }

        .profile-heading p {
          color: #706982;
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .profile-panel {
          padding: clamp(24px, 5vw, 40px);
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(112, 71, 235, 0.12);
          border-radius: 28px;
          box-shadow: 0 20px 60px rgba(67, 43, 120, 0.08);
        }

        .profile-avatar {
          display: grid;
          width: 84px;
          height: 84px;
          margin-bottom: 22px;
          place-items: center;
          border-radius: 26px;
          background: linear-gradient(135deg, #a78bfa, #f9a8d4);
          font-size: 2.5rem;
        }

        .profile-panel h2 {
          margin: 0 0 10px;
          font-size: 1.6rem;
          font-weight: 850;
        }

        .profile-panel p {
          color: #706982;
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
          background: #7047eb;
          color: white;
          font-weight: 800;
          text-decoration: none;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .profile-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(112, 71, 235, 0.22);
        }

        .profile-button.secondary {
          background: #f0eaff;
          color: #7047eb;
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
          <div className="profile-avatar" aria-hidden="true">🌈</div>
          <h2>Welcome to your profile!</h2>
          <p>
            Your profile page is ready. Once your existing profile and database
            features are connected, this is where your personal details and
            preferences can live.
          </p>

          <div className="profile-actions">
            <Link to="/matches" className="profile-button">
              Find my matches ✨
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