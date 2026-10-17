export const SPORT_GROUPS: Record<string, string[]> = {
  'Team Sports': [
    'Soccer',
    'Basketball',
    'Volleyball',
    'Baseball',
    'Softball',
    'Football',
    'Flag Football',
    'Hockey',
    'Ultimate Frisbee',
  ],
  'Racket Sports': ['Tennis', 'Pickleball', 'Badminton', 'Table Tennis', 'Squash'],
  Outdoors: ['Running', 'Cycling', 'Hiking', 'Rock Climbing', 'Surfing', 'Skateboarding'],
  'Fitness & Other': ['Gym', 'Swimming', 'Golf', 'Bowling', 'Martial Arts', 'Yoga'],
}

// Skill level
export const SKILL_LEVELS: string[] = ['Beginner', 'Intermediate', 'Advanced', 'Competitive']

// What kind of game the person is looking for
export const PLAY_STYLES: string[] = [
  'Casual / Just for Fun',
  'Pickup Games',
  'Regular Team',
  'League Play',
  'Training Partner',
  'Tournaments',
]

// When they're free to play
export const AVAILABILITY: string[] = [
  'Weekday Mornings',
  'Weekday Afternoons',
  'Weekday Evenings',
  'Weekend Mornings',
  'Weekend Afternoons',
  'Weekend Evenings',
]

// Flat list
export const SPORT_OPTIONS: string[] = Object.values(SPORT_GROUPS).flat()