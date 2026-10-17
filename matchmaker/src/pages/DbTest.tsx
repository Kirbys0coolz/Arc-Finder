import { useEffect } from 'react'
import { getAllProfiles, createProfile } from '../lib/profiles'

export default function DbTest() {
  useEffect(() => {
    getAllProfiles()
      .then(rows => console.log('READ ok:', rows))
      .catch(err => console.error('READ failed:', err))
  }, [])

  async function testWrite() {
    try {
      const row = await createProfile({
        name: 'Console Test',
        bio: 'testing',
        interests: ['pickleball'],
        skill: "beginner",
        play_styles: ["Pickup Games", "Regular Team"],
        availability: ["Weekend Afternoons", "Weekend Evenings"]
      })
      console.log('WRITE ok:', row)
    } catch (err) {
      console.error('WRITE failed:', err)
    }
  }

  return (
    <div className="p-4">
      <p>Supabase test: open the browser console (F12).</p>
      <button className="border px-3 py-1 mt-2" onClick={testWrite}>
        Insert test profile
      </button>
    </div>
  )
}