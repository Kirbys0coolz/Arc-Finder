import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../lib/auth-context'
import { createProfile } from '../lib/profiles'
import { SPORT_GROUPS, SKILL_LEVELS, PLAY_STYLES, AVAILABILITY } from '../lib/options'

// A row of clickable tags. Used for every group of options below.
function Chips({
  options,
  selected,
  onToggle,
}: {
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="chip-row">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`chip ${selected.includes(opt) ? 'selected' : ''}`}
          aria-pressed={selected.includes(opt)}
          onClick={() => onToggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function Profile() {
  // The shared login state: who is logged in, and whether they have a profile yet
  const { user, profile, loading, refreshProfile } = useAuth()
  const navigate = useNavigate()

  // What the person has picked so far (form state)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [sports, setSports] = useState<string[]>([])
  const [skill, setSkill] = useState('')
  const [playStyles, setPlayStyles] = useState<string[]>([])
  const [availability, setAvailability] = useState<string[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Add the value if it isn't selected, remove it if it is
  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Ignore a second click while the first save is still running
    if (submitting || !user) return

    setError('')
    if (!name.trim()) return setError('Please enter your name.')
    if (sports.length === 0) return setError('Pick at least one sport.')
    if (!skill) return setError('Pick your skill level.')
    if (playStyles.length === 0) return setError('Pick at least one play style.')
    if (availability.length === 0) return setError('Pick at least one time you are free.')

    setSubmitting(true)
    try {
      await createProfile({
        user_id: user.id, // links this profile to the logged-in account
        name: name.trim(),
        bio: bio.trim(),
        interests: sports, // the "interests" column holds the sports
        skill,
        play_styles: playStyles,
        availability,
      })
      await refreshProfile() // updates the shared state so every page sees the new profile
      navigate('/matches')
    } catch (err) {
      const e = err as { code?: string; message?: string }
      if (e.code === '23505') {
        // This account already has a profile (for example, saved in another tab)
        await refreshProfile()
      } else {
        setError(e.message ?? 'Could not save your profile. Please try again.')
      }
    }
    setSubmitting(false)
  }

  return (
    <main className="profile-page">
      <style>{`
        .profile-page {
          /* Same palette as the home page */
          --bg: #F6FBF7;
          --surface: #FFFFFF;
          --ink: #14261C;
          --muted: #5F7367;
          --primary: #2F7D57;
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

        .profile-heading { margin-bottom: 28px; }

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
          border: 0;
          border-radius: 14px;
          background: var(--primary);
          color: var(--surface);
          font: inherit;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .profile-button:hover:not(:disabled) {
          transform: translateY(-3px);
          background: var(--primary-strong);
          box-shadow: 0 10px 24px rgba(47, 125, 87, 0.25);
        }

        .profile-button:disabled { opacity: .7; cursor: not-allowed; }

        .profile-button.secondary {
          background: var(--tint-1);
          color: var(--primary-strong);
        }

        .profile-button.secondary:hover:not(:disabled) { background: var(--tint-2); }

        /* ── Form ── */
        .profile-form { display: grid; gap: 26px; margin-top: 8px; }

        .profile-field { display: grid; gap: 10px; }

        .profile-field > label,
        .profile-field > .field-label {
          font-size: 0.95rem;
          font-weight: 800;
        }

        .profile-field .hint {
          margin: -4px 0 0;
          font-size: 0.85rem;
          color: var(--muted);
        }

        .profile-field input[type="text"],
        .profile-field textarea {
          width: 100%;
          padding: 13px 15px;
          border: 2px solid var(--border);
          border-radius: 14px;
          background: var(--surface);
          color: var(--ink);
          font: inherit;
          transition: border-color .2s, box-shadow .2s;
        }

        .profile-field textarea { min-height: 96px; resize: vertical; }

        .profile-field input:focus,
        .profile-field textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(47, 125, 87, 0.2);
        }

        .group-title {
          margin: 6px 0 2px;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: .4px;
          text-transform: uppercase;
          color: var(--muted);
        }

        .chip-row { display: flex; flex-wrap: wrap; gap: 8px; }

        .chip {
          padding: 9px 14px;
          border: 2px solid var(--border);
          border-radius: 999px;
          background: var(--surface);
          color: var(--ink);
          font: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background .15s, border-color .15s, color .15s;
        }

        .chip:hover { border-color: var(--primary); }

        .chip.selected {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--surface);
        }

        .profile-error {
          margin: 0;
          padding: 12px 14px;
          border: 1px solid #FECACA;
          border-radius: 14px;
          background: #FEF2F2;
          color: #991B1B !important;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .summary-block { margin-top: 20px; }
        .summary-block h3 {
          margin: 0 0 8px;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: .4px;
          text-transform: uppercase;
          color: var(--muted);
        }

        .chip-static {
          padding: 7px 12px;
          border-radius: 999px;
          background: var(--tint-1);
          color: var(--primary-strong);
          font-size: 0.85rem;
          font-weight: 700;
        }

        .profile-brand:focus-visible,
        .profile-back:focus-visible,
        .profile-button:focus-visible,
        .chip:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-button, .chip { transition: none; }
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
          <p>
            {profile
              ? 'Your Arc-Finder profile and a home for your matching journey.'
              : 'Tell us a bit about you so we can find people to play with.'}
          </p>
        </header>

        <section className="profile-panel">
          <div className="profile-avatar" aria-hidden="true">
            <FontAwesomeIcon icon={faUser} />
          </div>

          {/* 1. Still working out who is logged in */}
          {loading && <p>Loading your profile...</p>}

          {/* 2. Returning user: show their profile */}
          {!loading && profile && (
            <>
              <h2>Welcome back, {profile.name}!</h2>
              {profile.bio && <p>{profile.bio}</p>}

              <div className="summary-block">
                <h3>Sports</h3>
                <div className="chip-row">
                  {profile.interests.map((s) => <span key={s} className="chip-static">{s}</span>)}
                </div>
              </div>
              <div className="summary-block">
                <h3>Skill level</h3>
                <div className="chip-row"><span className="chip-static">{profile.skill}</span></div>
              </div>
              <div className="summary-block">
                <h3>Play style</h3>
                <div className="chip-row">
                  {profile.play_styles.map((s) => <span key={s} className="chip-static">{s}</span>)}
                </div>
              </div>
              <div className="summary-block">
                <h3>Availability</h3>
                <div className="chip-row">
                  {profile.availability.map((s) => <span key={s} className="chip-static">{s}</span>)}
                </div>
              </div>

              <div className="profile-actions">
                <Link to="/matches" className="profile-button">Find my matches</Link>
                <Link to="/" className="profile-button secondary">Explore Arc-Finder</Link>
              </div>
            </>
          )}

          {/* 3. First-time user: show the form */}
          {!loading && !profile && (
            <>
              <h2>Create your profile</h2>
              <p>Pick what fits you. You'll be matched with people who play the same things at similar times.</p>

              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="profile-field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="What should people call you?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="bio">Bio (optional)</label>
                  <textarea
                    id="bio"
                    placeholder="Anything that helps someone say hi, like what you're hoping to play."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="profile-field">
                  <span className="field-label">Sports you play</span>
                  <p className="hint">Pick as many as you like.</p>
                  {Object.entries(SPORT_GROUPS).map(([group, items]) => (
                    <div key={group}>
                      <div className="group-title">{group}</div>
                      <Chips
                        options={items}
                        selected={sports}
                        onToggle={(v) => toggle(sports, setSports, v)}
                      />
                    </div>
                  ))}
                </div>

                <div className="profile-field">
                  <span className="field-label">Skill level</span>
                  <Chips
                    options={SKILL_LEVELS}
                    selected={skill ? [skill] : []}
                    onToggle={(v) => setSkill(v)}
                  />
                </div>

                <div className="profile-field">
                  <span className="field-label">What are you looking for?</span>
                  <Chips
                    options={PLAY_STYLES}
                    selected={playStyles}
                    onToggle={(v) => toggle(playStyles, setPlayStyles, v)}
                  />
                </div>

                <div className="profile-field">
                  <span className="field-label">When are you free?</span>
                  <Chips
                    options={AVAILABILITY}
                    selected={availability}
                    onToggle={(v) => toggle(availability, setAvailability, v)}
                  />
                </div>

                {error && <p className="profile-error" role="alert">{error}</p>}

                <div className="profile-actions">
                  <button type="submit" className="profile-button" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Create my profile'}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  )
}