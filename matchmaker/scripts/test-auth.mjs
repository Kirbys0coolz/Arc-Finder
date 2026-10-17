import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'

// Read the same .env.local the app uses
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

const email = `authtest-${Date.now()}@example.com`
const password = 'test-password-123'

const sampleProfile = {
  name: 'Auth Test',
  bio: 'created by test-auth.mjs',
  interests: ['Pickleball'],
  skill: 'Beginner',
  play_styles: ['Casual / Just for Fun'],
  availability: ['Weekday Evenings'],
}

function check(label, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${!ok && detail ? `  -> ${detail}` : ''}`)
}

// 1. Logged out: inserting should be blocked
{
  const { error } = await supabase.from('profiles').insert({ ...sampleProfile, user_id: randomUUID() })
  check('logged-out insert is blocked', !!error, 'insert succeeded, anon insert policy/grant still exists')
}

// 2. Sign up
const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
if (signUpError) {
  console.error('Sign up failed:', signUpError.message)
  process.exit(1)
}
if (!signUpData.session) {
  console.error('Signed up, but no session was returned. "Confirm email" is probably still on.')
  console.error('Turn it off under Authentication -> Providers -> Email, then rerun.')
  process.exit(1)
}
const userId = signUpData.user.id
check('sign up returns a user id and session', !!userId)
console.log(`      test user: ${email}`)
console.log(`      user id:   ${userId}`)

// 3. Create own profile
{
  const { data, error } = await supabase
    .from('profiles')
    .insert({ ...sampleProfile, user_id: userId })
    .select()
    .single()
  check('logged-in user can create their own profile', !error && data?.user_id === userId, error?.message)
}

// 4. Second profile for the same user should be rejected (unique)
{
  const { error } = await supabase.from('profiles').insert({ ...sampleProfile, user_id: userId })
  check('a second profile for the same user is rejected', !!error, 'duplicate was allowed')
}

// 5. Cannot create a profile for someone else
{
  const { error } = await supabase.from('profiles').insert({ ...sampleProfile, user_id: randomUUID() })
  check('cannot create a profile for a different user_id', !!error, 'insert for another id succeeded')
}

// 6. Find own profile by user_id
{
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle()
  check('can look up own profile by user_id', !error && data?.name === 'Auth Test', error?.message)
}

// 7. Update own profile
{
  const { data, error } = await supabase
    .from('profiles')
    .update({ bio: 'updated by test' })
    .eq('user_id', userId)
    .select()
  check('can update own profile', !error && data?.length === 1 && data[0].bio === 'updated by test', error?.message)
}

// 8. Cannot update a seeded profile (user_id is null)
{
  const { data, error } = await supabase
    .from('profiles')
    .update({ bio: 'hacked' })
    .is('user_id', null)
    .select()
  check('cannot update seeded profiles', !error && (data?.length ?? 0) === 0, `${data?.length} rows were changed`)
}

// 9. Read still works for everyone, including seeded profiles
{
  const { data, error } = await supabase.from('profiles').select('id, user_id')
  check('can read all profiles', !error && data.length > 0, error?.message)
  console.log(`      ${data?.length} profiles visible (${data?.filter(p => p.user_id === null).length} seeded)`)
}

// 10. Sign out, sign back in, confirm it is the same user
await supabase.auth.signOut()
{
  const { error } = await supabase.from('profiles').update({ bio: 'logged out edit' }).eq('user_id', userId)
  const { data } = await supabase.from('profiles').select('bio').eq('user_id', userId).single()
  check('logged-out user cannot edit the profile', data?.bio !== 'logged out edit', error?.message)
}
{
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  check('log back in with the same email and password', !error, error?.message)
  check('same user id after logging in again', data?.user?.id === userId, `got ${data?.user?.id}`)
}

console.log('\nDone. Delete the test user under Authentication -> Users in the dashboard.')
console.log('Its profile is removed automatically (on delete cascade).')