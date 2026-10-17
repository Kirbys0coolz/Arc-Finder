import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { rankMatches } from '../src/lib/match'
import type { Profile } from '../src/lib/types'

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

const { data, error } = await supabase.from('profiles').select('*')
if (error) {
  console.error('Could not load profiles:', error)
  process.exit(1)
}
const all = data as Profile[]
console.log(`Loaded ${all.length} profiles\n`)

// Pick who to test as: pass a name on the command line, or default to the first profile
const nameArg = process.argv[2]
const me = nameArg
  ? all.find(p => p.name.toLowerCase().includes(nameArg.toLowerCase()))
  : all[0]

if (!me) {
  console.error(`No profile found matching "${nameArg}"`)
  process.exit(1)
}

console.log(`Testing as: ${me.name}`)
console.log(`  sports:       ${me.interests.join(', ')}`)
console.log(`  skill:        ${me.skill}`)
console.log(`  play styles:  ${me.play_styles.join(', ')}`)
console.log(`  availability: ${me.availability.join(', ')}\n`)

const results = rankMatches(me, all)

results.forEach((m, i) => {
  console.log(`${i + 1}. ${m.name}  (${m.similarity}%)`)
  console.log(`   ${m.interests.join(', ')} | ${m.skill} | ${m.availability.join(', ')}`)
  console.log(`   why: ${m.reasons.join(' / ')}\n`)
})

// Basic sanity checks
const checks: [string, boolean][] = [
  ['returns at most 5 results', results.length <= 5],
  ['never matches you with yourself', results.every(m => m.id !== me.id)],
  ['scores are between 0 and 100', results.every(m => m.similarity >= 0 && m.similarity <= 100)],
  ['sorted from highest to lowest', results.every((m, i) => i === 0 || results[i - 1].similarity >= m.similarity)],
  ['everyone shares at least one sport', results.every(m => m.interests.some(s => me.interests.includes(s)))],
]

for (const [label, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)