import type { Profile, Match } from './types'
import { SKILL_LEVELS } from './options'

function jaccard(a: string[], b: string[]): number {
  const A = new Set(a)
  const B = new Set(b)
  if (A.size === 0 && B.size === 0) return 0
  let shared = 0
  for (const x of A) if (B.has(x)) shared++
  return shared / (A.size + B.size - shared)
}

// 1 = same level, 0 = furthest apart
function skillScore(a: string, b: string): number {
  const i = SKILL_LEVELS.indexOf(a)
  const j = SKILL_LEVELS.indexOf(b)
  if (i < 0 || j < 0) return 0
  return 1 - Math.abs(i - j) / (SKILL_LEVELS.length - 1)
}

const W = { sports: 0.5, availability: 0.2, playStyle: 0.2, skill: 0.1 }

const shared = (a: string[], b: string[]) => a.filter(x => b.includes(x))

export function rankMatches(me: Profile, all: Profile[], limit = 5): Match[] {
  return all
    .filter(p => p.id !== me.id)
    .filter(p => shared(me.interests, p.interests).length > 0) // must share a sport
    .map(p => {
      const score =
        W.sports * jaccard(me.interests, p.interests) +
        W.availability * jaccard(me.availability, p.availability) +
        W.playStyle * jaccard(me.play_styles, p.play_styles) +
        W.skill * skillScore(me.skill, p.skill)

      const reasons: string[] = []
      const sports = shared(me.interests, p.interests)
      if (sports.length) reasons.push(`You both play ${sports.join(', ')}`)
      const times = shared(me.availability, p.availability)
      if (times.length) reasons.push(`Both free ${times.join(', ')}`)
      if (me.skill === p.skill) reasons.push(`Both ${me.skill}`)

      return { ...p, similarity: Math.round(score * 100), reasons }
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}