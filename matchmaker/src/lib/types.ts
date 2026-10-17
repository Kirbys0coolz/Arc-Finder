export type Profile = {
  id: string
  name: string
  bio: string
  interests: string[]      // sports
  skill: string            // one of SKILL_LEVELS
  play_styles: string[]
  availability: string[]
}

export type NewProfile = Omit<Profile, 'id'>

export type Match = Profile & {
  similarity: number
  reasons: string[]
}