import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getMyProfile } from '../lib/profiles'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setIsError(false)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) {
        setIsError(true)
        setMessage(error.message)
        setLoading(false)
        return
      }

      // No session means "Confirm email" is still on in Supabase
      if (!data.session) {
        setMessage('Check your email to confirm your account, then log in.')
        setLoading(false)
        return
      }

      // A brand-new account has no profile yet
      navigate('/profile')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setIsError(true)
      setMessage(error.message)
      setLoading(false)
      return
    }

    // Returning users go to their matches, new users to the profile form
    const profile = await getMyProfile()
    navigate(profile ? '/matches' : '/profile')
  }

  return (
    <main className="arc-login">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .arc-login {
          --bg: #F6FBF7;
          --surface: #FFFFFF;
          --ink: #14261C;
          --muted: #5F7367;
          --primary: #2F7D57;
          --accent: #FACC15;

          --primary-strong: #1F5C3F;
          --primary-light: #3E9A6B;
          --tint-1: #E6F2EA;
          --tint-2: #D3E8DA;
          --tint-3: #BFDDC9;
          --border: #D8E8DD;
          --glow: rgba(47, 125, 87, .25);
          --shadow: rgba(20, 38, 28, .12);
          --glass: rgba(255, 255, 255, .88);
          --glass-line: rgba(255, 255, 255, .7);

          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color-scheme: light;
          color: var(--ink);
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
        }

        .arc-login * { box-sizing: border-box; }
        .arc-login :where(h1, h2, h3, p, span, div, label, small, strong, header, footer, nav, section) {
          color: inherit;
        }
        .arc-login a { text-decoration: none; }

        .arc-nav {
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
          padding: 22px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .arc-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font: 700 23px 'Space Grotesk', sans-serif;
          letter-spacing: -1px;
          color: var(--ink);
        }

        .arc-logo {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: var(--surface);
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          box-shadow: 0 7px 18px var(--glow);
          font-size: 24px;
        }

        .arc-nav-links { display: flex; align-items: center; gap: 26px; }
        .arc-nav-links a {
          color: var(--muted);
          font-size: 14px;
          font-weight: 600;
          transition: color .2s;
        }
        .arc-nav-links a:hover { color: var(--primary); }

        .arc-nav-cta, .arc-button {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          border: 0;
          border-radius: 15px;
          background: var(--ink);
          color: var(--surface) !important;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s, background .2s;
        }
        .arc-nav-cta { padding: 12px 18px; font-size: 13px; }
        .arc-button { width: 100%; padding: 16px 22px; font-size: 14px; }

        .arc-nav-cta:hover, .arc-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px var(--shadow);
        }

        .arc-primary { background: var(--primary); box-shadow: 0 9px 22px var(--glow); }
        .arc-primary:hover:not(:disabled) { background: var(--primary-strong); }
        .arc-button:disabled { opacity: .7; cursor: not-allowed; }

        .arc-login a:focus-visible, .arc-button:focus-visible {
          outline: 3px solid var(--accent);
          outline-offset: 3px;
        }

        .arc-login-stage {
          flex: 1;
          position: relative;
          display: grid;
          place-items: center;
          padding: 40px 22px 60px;
          isolation: isolate;
        }

        .arc-orb {
          position: absolute;
          z-index: -1;
          width: min(560px, 95%);
          aspect-ratio: 1;
          border-radius: 42% 58% 64% 36% / 43% 42% 58% 57%;
          background: linear-gradient(140deg, var(--tint-3), var(--tint-2) 55%, var(--tint-1));
          animation: arc-morph 10s ease-in-out infinite alternate;
        }
        .arc-orb::before, .arc-orb::after {
          content: "";
          position: absolute;
          border: 1px solid var(--glass-line);
          border-radius: 50%;
          inset: 30px;
        }
        .arc-orb::after { inset: 60px; }

        .arc-floaty {
          position: absolute;
          display: grid;
          place-items: center;
          border: 1px solid var(--glass-line);
          border-radius: 19px;
          background: var(--glass);
          box-shadow: 0 12px 35px var(--shadow);
          animation: arc-float 4s ease-in-out infinite;
        }
        .arc-floaty-1 { top: 12%; left: 14%; width: 60px; height: 60px; color: var(--primary); font-size: 30px; }
        .arc-floaty-2 { top: 18%; right: 14%; width: 50px; height: 50px; color: #CA9A04; font-size: 24px; animation-delay: -1.5s; }
        .arc-floaty-3 { bottom: 14%; right: 18%; width: 64px; height: 64px; color: var(--primary-strong); font-size: 30px; animation-delay: -2.5s; }
        .arc-floaty-4 { bottom: 18%; left: 16%; width: 46px; height: 46px; color: var(--muted); font-size: 22px; animation-delay: -1s; }

        .arc-card {
          width: min(400px, 100%);
          padding: 32px 28px;
          border: 1px solid var(--glass-line);
          border-radius: 25px;
          background: var(--glass);
          box-shadow: 0 22px 70px var(--shadow);
          backdrop-filter: blur(12px);
          animation: arc-card-in .7s cubic-bezier(.2, .8, .2, 1) both;
        }

        .arc-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--tint-1);
          color: var(--primary-strong);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .2px;
        }
        .arc-pulse {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          animation: arc-pulse 1.8s infinite;
        }

        .arc-card-title {
          margin: 20px 0 10px;
          font: 700 clamp(30px, 6vw, 38px)/1.1 'Space Grotesk', sans-serif;
          letter-spacing: -1.5px;
        }

        .arc-gradient-text {
          color: var(--primary);
          background: linear-gradient(100deg, var(--primary-strong) 10%, var(--primary) 90%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .arc-card-text {
          margin: 0 0 24px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .arc-field { display: grid; gap: 7px; margin-bottom: 16px; }
        .arc-field label { font-size: 13px; font-weight: 700; }
        .arc-field input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid var(--border);
          border-radius: 15px;
          background: var(--surface);
          color: var(--ink);
          font: 500 15px 'DM Sans', sans-serif;
          transition: border-color .2s, box-shadow .2s;
        }
        .arc-field input::placeholder { color: var(--muted); opacity: .6; }
        .arc-field input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--glow);
        }

        .arc-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, .4);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: arc-spin .8s linear infinite;
        }

        .arc-message {
          margin: 16px 0 0;
          padding: 12px 14px;
          border-radius: 15px;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.6;
          animation: arc-pop .45s ease-out both;
        }
        .arc-message-ok  { background: var(--tint-1); border: 1px solid var(--border); color: var(--ink); }
        .arc-message-err { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; }

        .arc-switch {
          margin: 18px 0 0;
          text-align: center;
          color: var(--muted);
          font-size: 13px;
        }
        .arc-switch button {
          border: 0;
          background: none;
          padding: 0;
          color: var(--primary);
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }
        .arc-switch button:hover { color: var(--primary-strong); text-decoration: underline; }

        .arc-footer {
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          color: var(--muted);
          font-size: 12px;
        }

        @keyframes arc-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes arc-morph {
          0% { border-radius: 42% 58% 64% 36% / 43% 42% 58% 57%; transform: rotate(-5deg); }
          100% { border-radius: 58% 42% 40% 60% / 55% 60% 40% 45%; transform: rotate(7deg); }
        }
        @keyframes arc-pulse {
          0%, 100% { box-shadow: 0 0 0 0 var(--glow); }
          50% { box-shadow: 0 0 0 6px transparent; }
        }
        @keyframes arc-card-in {
          from { opacity: 0; transform: translateY(24px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes arc-pop {
          0% { opacity: 0; transform: scale(.92); }
          60% { opacity: 1; transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        @keyframes arc-spin { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .arc-login *, .arc-login *::before, .arc-login *::after {
            animation: none !important;
            transition: none !important;
          }
        }

        @media (max-width: 760px) {
          .arc-nav { padding: 17px 20px; }
          .arc-brand { font-size: 20px; }
          .arc-nav-links { gap: 13px; }
          .arc-nav-links a { font-size: 12px; }
          .arc-nav-cta { padding: 10px 12px; font-size: 12px; }
          .arc-floaty-2, .arc-floaty-4 { display: none; }
          .arc-floaty-1 { top: 2%; left: 4%; }
          .arc-floaty-3 { bottom: 3%; right: 6%; }
          .arc-footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      <header className="arc-nav">
        <a className="arc-brand" href="/" aria-label="Arc-Finder home">
          <span className="arc-logo" aria-hidden="true">✳</span>
          Arc-Finder
        </a>

        <nav className="arc-nav-links" aria-label="Main navigation">
          <a href="/#features">Discover</a>
          <a href="/profile">Profile</a>
          <a className="arc-nav-cta" href="/">
            Home <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="arc-login-stage">
        <div className="arc-orb" aria-hidden="true" />
        <div className="arc-floaty arc-floaty-1" aria-hidden="true">✦</div>
        <div className="arc-floaty arc-floaty-2" aria-hidden="true">✮</div>
        <div className="arc-floaty arc-floaty-3" aria-hidden="true">✳</div>
        <div className="arc-floaty arc-floaty-4" aria-hidden="true">✧</div>

        <form className="arc-card" onSubmit={handleSubmit}>
          <div className="arc-pill">
            <span className="arc-pulse" />
            {mode === 'signin' ? 'WELCOME BACK' : 'JOIN THE ARC'}
          </div>

          <h1 className="arc-card-title">
            {mode === 'signin' ? 'Log in to find your ' : 'Sign up to find your '}
            <span className="arc-gradient-text">next favorite.</span>
          </h1>

          <p className="arc-card-text">
            {mode === 'signin'
              ? 'Enter your email and password to pick up where you left off.'
              : 'Create an account with your email and a password of at least 6 characters.'}
          </p>

          <div className="arc-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="arc-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="arc-button arc-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="arc-spinner" aria-hidden="true" />
                {mode === 'signin' ? 'Logging in...' : 'Creating account...'}
              </>
            ) : (
              <>
                {mode === 'signin' ? 'Log in' : 'Create account'} <span aria-hidden="true">✦</span>
              </>
            )}
          </button>

          {message && (
            <p
              role="status"
              className={`arc-message ${isError ? 'arc-message-err' : 'arc-message-ok'}`}
            >
              {message}
            </p>
          )}

          <p className="arc-switch">
            {mode === 'signin' ? 'New here? ' : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setMessage('')
                setIsError(false)
              }}
            >
              {mode === 'signin' ? 'Create an account' : 'Log in'}
            </button>
          </p>
        </form>
      </section>

      <footer className="arc-footer">
        <a className="arc-brand" href="/" style={{ fontSize: 17 }}>
          <span
            className="arc-logo"
            style={{ width: 32, height: 32, borderRadius: 11, fontSize: 18 }}
            aria-hidden="true"
          >
            ✳
          </span>
          Arc-Finder
        </a>
        <span>Made with a little curiosity and a lot of heart ♡</span>
      </footer>
    </main>
  )
}