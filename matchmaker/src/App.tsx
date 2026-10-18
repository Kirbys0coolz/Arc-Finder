import Login from './components/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth-context'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Matches from './pages/Matches'
import RequireAuth from './components/RequireAuth'
import Chat from './pages/chat'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat/:conversationId" element={<RequireAuth><Chat /></RequireAuth>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
