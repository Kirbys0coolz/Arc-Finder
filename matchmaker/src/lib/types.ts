export type Profile = {
  id: string
  name: string
  bio: string
  interests: string[]
}

export type Match = Profile & {
  similarity: number
}