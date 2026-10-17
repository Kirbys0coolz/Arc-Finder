
export default function Home() {
  return (
    <main className="arc-home">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .arc-home {
          --ink: #292044;
          --muted: #77718c;
          min-height: 100vh;
          overflow: hidden;
          color: var(--ink);
          background: #fffaff;
          font-family: 'DM Sans', sans-serif;
        }

        .arc-home * { box-sizing: border-box; }
        .arc-home a { text-decoration: none; }
        .arc-home button, .arc-home a { -webkit-tap-highlight-color: transparent; }

        .arc-nav {
          max-width: 1160px;
          margin: auto;
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
          color: white;
          background: linear-gradient(135deg, #8c67f6, #ff77b7);
          box-shadow: 0 7px 18px #b39bfa55;
          font-size: 24px;
        }

        .arc-nav-links {
          display: flex;
          align-items: center;
          gap: 26px;
        }

        .arc-nav-links a {
          color: #625a78;
          font-size: 14px;
          font-weight: 600;
          transition: color .2s;
        }

        .arc-nav-links a:hover { color: #885cf5; }

        .arc-nav-cta, .arc-button {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          border: 0;
          border-radius: 15px;
          background: #33254f;
          color: white !important;
          font-weight: 700;
          transition: transform .2s, box-shadow .2s;
        }

        .arc-nav-cta { padding: 12px 18px; font-size: 13px; }
        .arc-button { padding: 16px 22px; font-size: 14px; }

        .arc-nav-cta:hover, .arc-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px #33254f30;
        }

        .arc-hero {
          max-width: 1160px;
          margin: auto;
          padding: 65px 28px 76px;
          display: grid;
          grid-template-columns: 1.05fr .95fr;
          align-items: center;
          gap: 46px;
        }

        .arc-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border: 1px solid #eee3ff;
          border-radius: 999px;
          background: #f5eeff;
          color: #7850d5;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .2px;
        }

        .arc-pulse {
          width: 8px;
          height: 8px;
          background: #9b73ff;
          border-radius: 50%;
          animation: arc-pulse 1.8s infinite;
        }

        .arc-title {
          margin: 25px 0 20px;
          font: 700 clamp(43px, 5.5vw, 70px)/1.06 'Space Grotesk', sans-serif;
          letter-spacing: -3.5px;
        }

        .arc-gradient-text {
          background: linear-gradient(100deg, #8858f5 10%, #ed67ad 55%, #ff9a68);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .arc-description {
          max-width: 465px;
          margin: 0;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.85;
        }

        .arc-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 13px;
          margin-top: 30px;
        }

        .arc-primary {
          background: linear-gradient(110deg, #8b62f6, #b05df1);
          box-shadow: 0 9px 22px #a67aef40;
        }

        .arc-secondary {
          background: white;
          color: #45365f !important;
          border: 1px solid #eae3f4;
        }

        .arc-social-proof {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 28px;
          color: #898198;
          font-size: 12px;
        }

        .arc-dots { display: flex; padding-left: 4px; }
        .arc-dot {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          margin-left: -4px;
          border: 2px solid #fffaff;
          border-radius: 50%;
          font-size: 13px;
        }

        .arc-art {
          position: relative;
          min-height: 425px;
          display: grid;
          place-items: center;
          isolation: isolate;
        }

        .arc-orb {
          position: absolute;
          z-index: -1;
          width: min(360px, 85%);
          aspect-ratio: 1;
          border-radius: 42% 58% 64% 36% / 43% 42% 58% 57%;
          background: linear-gradient(140deg, #e8d8ff, #ffd9e9 55%, #ffedc9);
          animation: arc-morph 10s ease-in-out infinite alternate;
        }

        .arc-orb::before, .arc-orb::after {
          content: "";
          position: absolute;
          border: 1px solid #fff9;
          border-radius: 50%;
          inset: 22px;
        }

        .arc-orb::after { inset: 44px; }

        .arc-feature-card {
          width: min(320px, 83%);
          padding: 24px;
          border: 1px solid #ffffffd9;
          border-radius: 25px;
          background: #ffffffd9;
          box-shadow: 0 22px 70px #61458b20;
          backdrop-filter: blur(12px);
          animation: arc-float 5s ease-in-out infinite;
        }

        .arc-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .arc-card-label {
          color: #8d83a0;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .arc-sparkle { color: #ff9e52; font-size: 25px; }

        .arc-avatar-row { display: flex; gap: 12px; margin-bottom: 18px; }

        .arc-avatar {
          display: grid;
          flex: 1;
          place-items: center;
          min-height: 112px;
          border-radius: 19px;
          font-size: 46px;
        }

        .arc-avatar-one { background: linear-gradient(145deg, #eee3ff, #dcd0ff); }
        .arc-avatar-two { background: linear-gradient(145deg, #ffe2ec, #ffcbdc); }

        .arc-match-title {
          margin: 0 0 7px;
          font: 700 21px 'Space Grotesk', sans-serif;
          letter-spacing: -.6px;
        }

        .arc-match-subtitle {
          margin: 0;
          color: #817890;
          font-size: 12px;
          line-height: 1.7;
        }

        .arc-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 17px; }

        .arc-tag {
          padding: 7px 10px;
          border-radius: 999px;
          background: #f3edff;
          color: #7955bd;
          font-size: 10px;
          font-weight: 700;
        }

        .arc-floaty {
          position: absolute;
          display: grid;
          place-items: center;
          border: 1px solid #ffffffc9;
          border-radius: 19px;
          background: #ffffffd9;
          box-shadow: 0 12px 35px #76569b20;
          animation: arc-float 4s ease-in-out infinite;
        }

        .arc-floaty-star {
          top: 46px;
          right: 8%;
          width: 63px;
          height: 63px;
          color: #ffab51;
          font-size: 33px;
          animation-delay: -1s;
        }

        .arc-floaty-heart {
          bottom: 48px;
          left: 3%;
          width: 67px;
          height: 67px;
          color: #ed70a8;
          font-size: 31px;
          animation-delay: -2s;
        }

        .arc-floaty-orbit {
          top: 80px;
          left: 3%;
          width: 46px;
          height: 46px;
          color: #8e6bf5;
          font-size: 23px;
          animation-delay: -1.5s;
        }

        .arc-floaty-spark {
          right: 7%;
          bottom: 65px;
          width: 48px;
          height: 48px;
          color: #50bfa8;
          font-size: 24px;
          animation-delay: -3s;
        }

        .arc-features {
          padding: 66px 28px 76px;
          background: white;
          border-top: 1px solid #f1eaf8;
        }

        .arc-section-inner { max-width: 1100px; margin: auto; }

        .arc-section-heading { text-align: center; margin-bottom: 37px; }

        .arc-section-heading h2 {
          margin: 0 0 12px;
          font: 700 clamp(29px, 4vw, 41px) 'Space Grotesk', sans-serif;
          letter-spacing: -1.5px;
        }

        .arc-section-heading p {
          margin: 0;
          color: #817890;
          font-size: 14px;
          line-height: 1.8;
        }

        .arc-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .arc-info-card {
          padding: 25px;
          border: 1px solid #eee7f5;
          border-radius: 23px;
          background: #fff;
          transition: transform .25s, box-shadow .25s;
        }

        .arc-info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 35px #6b4a8c10;
        }

        .arc-info-icon {
          display: grid;
          place-items: center;
          width: 51px;
          height: 51px;
          margin-bottom: 20px;
          border-radius: 17px;
          font-size: 25px;
        }

        .arc-info-card h3 {
          margin: 0 0 10px;
          font: 700 19px 'Space Grotesk', sans-serif;
        }

        .arc-info-card p {
          margin: 0;
          color: #817890;
          font-size: 13px;
          line-height: 1.8;
        }

        .arc-bottom-cta {
          margin: 64px auto 0;
          padding: 43px 25px;
          border-radius: 28px;
          text-align: center;
          background: linear-gradient(115deg, #f0e8ff, #ffe8f0 60%, #fff0d8);
        }

        .arc-bottom-cta h2 {
          margin: 0 0 12px;
          font: 700 clamp(27px, 4vw, 37px) 'Space Grotesk', sans-serif;
          letter-spacing: -1.2px;
        }

        .arc-bottom-cta p {
          margin: 0 0 23px;
          color: #766b86;
          font-size: 14px;
          line-height: 1.8;
        }

        .arc-footer {
          max-width: 1160px;
          margin: auto;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          color: #898198;
          font-size: 12px;
        }

        .arc-footer a { color: #716286; font-weight: 700; }

        @keyframes arc-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }

        @keyframes arc-morph {
          0% { border-radius: 42% 58% 64% 36% / 43% 42% 58% 57%; transform: rotate(-5deg); }
          100% { border-radius: 58% 42% 40% 60% / 55% 60% 40% 45%; transform: rotate(7deg); }
        }

        @keyframes arc-pulse {
          0%, 100% { box-shadow: 0 0 0 0 #9b73ff70; }
          50% { box-shadow: 0 0 0 6px #9b73ff00; }
        }

        @media (prefers-reduced-motion: reduce) {
          .arc-home *, .arc-home *::before, .arc-home *::after {
            animation: none !important;
            scroll-behavior: auto !important;
            transition: none !important;
          }
        }

        @media (max-width: 760px) {
          .arc-nav { padding: 17px 20px; }
          .arc-brand { font-size: 20px; }
          .arc-nav-links { gap: 13px; }
          .arc-nav-links a { font-size: 12px; }
          .arc-nav-cta { padding: 10px 12px; font-size: 12px; }
          .arc-hero {
            grid-template-columns: 1fr;
            gap: 18px;
            padding: 45px 22px 55px;
          }
          .arc-hero-copy { text-align: center; }
          .arc-description { margin: auto; }
          .arc-actions, .arc-social-proof { justify-content: center; }
          .arc-title { letter-spacing: -2px; }
          .arc-art { min-height: 370px; }
          .arc-feature-grid { grid-template-columns: 1fr; }
          .arc-features { padding: 55px 22px; }
          .arc-info-card { padding: 23px; }
          .arc-bottom-cta { margin-top: 42px; }
        }

        @media (max-width: 400px) {
          .arc-nav-links { gap: 9px; }
          .arc-nav-links a { font-size: 11px; }
          .arc-nav-cta { padding: 9px; }
          .arc-brand { font-size: 18px; gap: 7px; }
          .arc-logo { width: 36px; height: 36px; }
          .arc-button { padding: 14px 16px; }
        }
      `}</style>

      <header className="arc-nav">
        <a className="arc-brand" href="/" aria-label="Arc-Finder home">
          <span className="arc-logo" aria-hidden="true">✳</span>
          Arc-Finder
        </a>

        <nav className="arc-nav-links" aria-label="Main navigation">
          <a href="#features">Discover</a>
          <a href="/profile">Profile</a>
          <a className="arc-nav-cta" href="/matches">
            Find matches <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="arc-hero">
        <div className="arc-hero-copy">
          <div className="arc-pill">
            <span className="arc-pulse" />
            YOUR NEXT DISCOVERY STARTS HERE
          </div>

          <h1 className="arc-title">
            Your next
            <br />
            favorite is
            <br />
            <span className="arc-gradient-text">out there.</span>
          </h1>

          <p className="arc-description">
            Good connections start with the things you love.
            Explore your interests, discover new possibilities,
            and find matches that feel like you.
          </p>

          <div className="arc-actions">
            <a className="arc-button arc-primary" href="/matches">
              Find your matches <span aria-hidden="true">↗</span>
            </a>
            <a className="arc-button arc-secondary" href="/profile">
              Build your profile <span aria-hidden="true">✦</span>
            </a>
          </div>

          <div className="arc-social-proof">
            <div className="arc-dots" aria-hidden="true">
              <span className="arc-dot" style={{ background: "#FFE0B9" }}>🌼</span>
              <span className="arc-dot" style={{ background: "#E5D9FF" }}>🪻</span>
              <span className="arc-dot" style={{ background: "#FFDCE8" }}>🌸</span>
            </div>
            <span>Made for curious minds and unique interests.</span>
          </div>
        </div>

        <div className="arc-art" aria-label="Illustration of discovering a match">
          <div className="arc-orb" />

          <div className="arc-floaty arc-floaty-star" aria-hidden="true">✦</div>
          <div className="arc-floaty arc-floaty-heart" aria-hidden="true">♥</div>
          <div className="arc-floaty arc-floaty-orbit" aria-hidden="true">✳</div>
          <div className="arc-floaty arc-floaty-spark" aria-hidden="true">✧</div>

          <div className="arc-feature-card">
            <div className="arc-card-top">
              <span className="arc-card-label">A LITTLE SOMETHING FOR YOU</span>
              <span className="arc-sparkle" aria-hidden="true">✦</span>
            </div>

            <div className="arc-avatar-row" aria-hidden="true">
              <div className="arc-avatar arc-avatar-one">🌙</div>
              <div className="arc-avatar arc-avatar-two">☀️</div>
            </div>

            <h2 className="arc-match-title">Your kind of connection.</h2>
            <p className="arc-match-subtitle">
              Different stories, shared interests, and a little bit of magic.
            </p>

            <div className="arc-tags">
              <span className="arc-tag">✦ Shared interests</span>
              <span className="arc-tag">♡ New discoveries</span>
            </div>
          </div>
        </div>
      </section>

      <section className="arc-features" id="features">
        <div className="arc-section-inner">
          <div className="arc-section-heading">
            <h2>A little more <span className="arc-gradient-text">you.</span></h2>
            <p>
              Finding what fits you should feel exciting, not overwhelming.
            </p>
          </div>

          <div className="arc-feature-grid">
            <article className="arc-info-card">
              <div
                className="arc-info-icon"
                style={{ background: "#F0E7FF" }}
                aria-hidden="true"
              >
                ✨
              </div>
              <h3>Discover your vibe</h3>
              <p>
                Show off the interests and tags that make you unique.
                Your next discovery might be closer than you think.
              </p>
            </article>

            <article className="arc-info-card">
              <div
                className="arc-info-icon"
                style={{ background: "#FFE6EF" }}
                aria-hidden="true"
              >
                💗
              </div>
              <h3>Find your matches</h3>
              <p>
                Explore the matching experience and uncover connections
                through the things you have in common.
              </p>
            </article>

            <article className="arc-info-card">
              <div
                className="arc-info-icon"
                style={{ background: "#E0F8F0" }}
                aria-hidden="true"
              >
                🪄
              </div>
              <h3>Make it yours</h3>
              <p>
                Create a profile that reflects your personality
                and gives your discoveries a personal touch.
              </p>
            </article>
          </div>

          <div className="arc-bottom-cta">
            <h2>Ready to find your next <span className="arc-gradient-text">favorite?</span></h2>
            <p>
              Your interests are a great place to start.
              Let's see what you discover.
            </p>
            <a className="arc-button arc-primary" href="/matches">
              Let's explore <span aria-hidden="true">✦</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="arc-footer">
        <a className="arc-brand" href="/" style={{ fontSize: 17 }}>
          <span className="arc-logo" style={{ width: 32, height: 32, borderRadius: 11, fontSize: 18 }} aria-hidden="true">✳</span>
          Arc-Finder
        </a>
        <span>Made with a little curiosity and a lot of heart ♡</span>
      </footer>
    </main>
  );
}
