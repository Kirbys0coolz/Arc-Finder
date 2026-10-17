// Save this file as: matchmaker/src/components/Login.tsx
// (create the "components" folder inside "src" if it doesn't exist yet)

// useState lets this component remember values (like what the user typed).
import { useState } from 'react'
// FormEvent is only a TypeScript type for the "submit" event, so it's imported as a type.
import type { FormEvent } from 'react'
// This is the connection to Supabase that you created in supabaseClient.ts.
// The path goes up one folder (..) out of "components", then into "lib".
import { supabase } from '../lib/supabase'

export default function Login() {
  // "email" holds whatever is currently typed in the input box.
  // "setEmail" is the function that updates it.
  const [email, setEmail] = useState('')

  // "message" holds the text shown under the form: either a success note or an error.
  const [message, setMessage] = useState('')

  // "loading" is true while we wait for Supabase to respond.
  // We use it to disable the button so it can't be clicked twice.
  const [loading, setLoading] = useState(false)

  // This function runs when the user submits the form (clicks the button or presses Enter).
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // By default, a browser reloads the page when a form is submitted.
    // preventDefault() stops that, so our code can handle things instead.
    e.preventDefault()

    setLoading(true)
    setMessage('')

    // Ask Supabase to email the user a login link.
    // "await" pauses here until Supabase answers.
    // Supabase sends back an object; we only need the "error" part of it.
    const { error } = await supabase.auth.signInWithOtp({
      email, // the email the user typed
      options: {
        // After clicking the link in the email, the user is sent back to this address.
        // window.location.origin is your site's own address (http://localhost:5173 in development).
        // This address must also be listed under "Redirect URLs" in your Supabase dashboard.
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) {
      // Something went wrong (bad email, rate limit, wrong dashboard settings, etc.).
      setMessage(`Something went wrong: ${error.message}`)
    } else {
      // No error means Supabase accepted the request and sent the email.
      setMessage('Check your email for the login link.')
    }

    setLoading(false)
  }

  // Everything below is what appears on the page.
  return (
    <form onSubmit={handleSubmit}>
      <h2>Log in</h2>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="you@example.com"
        required
        // "value" makes the input show what is stored in our "email" state...
        value={email}
        // ...and "onChange" updates that state every time the user types a character.
        // Together these make it a "controlled input".
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Disabled while loading so the user can't send several emails by accident. */}
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send login link'}
      </button>

      {/* Only show the message paragraph if there is a message. */}
      {message && <p>{message}</p>}
    </form>
  )
}