# Arc-Finder

Find someone to play with. Arc-Finder matches people by the sports they play, when they're free, how they like to play, and their skill level, then lets them message each other to set up a game.

Built in 12 hours at Zothacks.

## Features

- **Accounts:** email and password sign-up and login with Supabase Auth
- **Sports profile:** pick your sports, skill level, play style, and availability with tag pickers
- **Ranked matches:** see your top 5 partners with a match percentage and the reasons you matched ("You both play Tennis", "Both free Weekend Mornings")
- **Real-time chat:** message a match directly; new messages appear instantly with Supabase Realtime

## How matching works

You only match with people who share at least one sport. Everyone else is scored from 0 to 100%:

| Factor | Weight | How it's measured |
|---|---|---|
| Sports | 50% | Overlap between your sports (Jaccard similarity) |
| Availability | 20% | Overlap between the times you're free |
| Play style | 20% | Overlap between play styles (casual, pickup, league...) |
| Skill level | 10% | 100% for the same level, lower the further apart you are |

The logic lives in `matchmaker/src/lib/match.ts`.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, React Router
- **Backend:** Supabase (Postgres, Auth, Realtime, Row Level Security)
- **Icons:** Font Awesome

## Project structure

```
matchmaker/
├── src/
│   ├── pages/        Home, Profile, Matches, Chat
│   ├── components/   Login, TagPicker, MatchCard, RequireAuth
│   └── lib/
│       ├── supabase.ts       Supabase client
│       ├── auth-context.tsx  Logged-in user and profile, shared app-wide
│       ├── profiles.ts       Read and save profiles
│       ├── match.ts          Matching algorithm
│       ├── chat.ts           Conversations, messages, real-time updates
│       ├── options.ts        Sports, skill levels, play styles, availability
│       └── types.ts          Shared TypeScript types
├── supabase/schema.sql       Database tables and security policies
└── scripts/
    ├── profiles.json         30 demo profiles
    ├── seed.mjs              Loads the demo profiles
    ├── test-match.ts         Prints and checks match results
    └── test-auth.mjs         Checks the security policies
```

## Running it locally

> [!NOTE]
> You need Node.js 20+ and a free [Supabase](https://supabase.com) project.

**1. Clone and install**

```bash
git clone https://github.com/Kirbys0coolz/Arc-Finder.git
cd Arc-Finder/matchmaker
npm install
```

**2. Add your Supabase keys.** Create `matchmaker/.env.local` with the values from Supabase → Project Settings → API:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

> [!WARNING]
> Never commit `.env.local`. It's already listed in `.gitignore`.

**3. Set up the database.** In the Supabase SQL Editor, run `supabase/schema.sql`. Chat also needs these two tables, with Realtime turned on for `messages`:

- `conversations`: `id`, `user_a`, `user_b` (one row per pair of users)
- `messages`: `id`, `conversation_id`, `sender_id`, `body`, `created_at`

**4. Configure auth.** Add `http://localhost:5173` under Authentication → URL Configuration.

> [!IMPORTANT]
> Under Authentication → Sign In / Providers → Email, turn off **Confirm email** so new accounts can log in right away.

**5. Load the demo profiles (optional).** Insert `scripts/profiles.json` into the `profiles` table.

> [!TIP]
> Row Level Security blocks inserts from the public key, so use the Supabase Table Editor or a key that bypasses RLS.

**6. Start it**

```bash
npm run dev
```

Open http://localhost:5173.

## Testing

```bash
npx tsx scripts/test-match.ts "Alex"   # top matches for a profile, plus sanity checks
```

## Team

- [Drew Layfield](https://github.com/username): Back-End Database
- [Delilah Rodriguez](https://github.com/username): Front-End
- [Srikar Dhanireddy](https://github.com/username): Back-End Login
- [Daniel Sohn](https://github.com/username): Front-End
