import { useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'

export default function Auth() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setLoading(true); setError('')
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup'
      const res = await fetch(baseUrl + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'login' ? { email, password } : { name, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.location.href = '/dashboard'
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border p-6 bg-white/80 dark:bg-white/[0.04]">
        <div className="flex justify-center gap-3 mb-6">
          <button onClick={() => setMode('login')} className={`px-3 py-2 rounded-md text-sm ${mode==='login'?'bg-gray-900 text-white':'border'}`}>Login</button>
          <button onClick={() => setMode('signup')} className={`px-3 py-2 rounded-md text-sm ${mode==='signup'?'bg-gray-900 text-white':'border'}`}>Sign up</button>
        </div>
        {mode==='signup' && (
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full mb-3 px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" />
        )}
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" className="w-full mb-3 px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full mb-4 px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" />
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <button disabled={loading} onClick={submit} className="w-full bg-gray-900 text-white rounded-md py-2">{loading? 'Please wait...': (mode==='login'? 'Login':'Create account')}</button>
        <p className="text-xs text-gray-500 mt-3 text-center">By continuing you agree to our terms.</p>
      </div>
    </div>
  )
}
