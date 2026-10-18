import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { getMyProfile } from './profiles'
import type { Profile } from './types'

type AuthState = {
  user: User | null          // the logged-in account (null if logged out)
  profile: Profile | null    // their row in the profiles table (null if not created yet)
  loading: boolean           // true while we work out who is logged in
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Remembers which user we last loaded a profile for.
  // undefined = nothing loaded yet.
  const lastUserId = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    // Supabase calls this on page load (restoring a saved session),
    // on login, on logout, and when a token refreshes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)

      // Token refreshes and tab-focus events give the same user again.
      // Only reload the profile when the person actually changed.
      const id = u?.id ?? null
      if (id === lastUserId.current) return
      lastUserId.current = id

      setLoading(true)
      // setTimeout avoids a known Supabase deadlock when you call
      // supabase from inside this callback.
      setTimeout(async () => {
        try {
          setProfile(u ? await getMyProfile() : null)
        } catch (err) {
          console.error('Could not load profile:', err)
          setProfile(null)
        }
        setLoading(false)
      }, 0)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function refreshProfile() {
    setProfile(await getMyProfile())
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}