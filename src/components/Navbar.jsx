import { useEffect, useState } from 'react'
import { Menu, Moon, Sun } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(m)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [dark])

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-black/50 backdrop-blur">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-semibold">Tracker</a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 dark:text-gray-200">
          <a href="#features" className="hover:text-gray-900 dark:hover:text-white">Features</a>
          <a href="/dashboard" className="hover:text-gray-900 dark:hover:text-white">Dashboard</a>
          <a href="/auth" className="hover:text-gray-900 dark:hover:text-white">Login</a>
          <button onClick={() => setDark(d => !d)} className="rounded-md border px-2 py-1 text-xs">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(o => !o)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-2 text-sm">
          <a href="#features" className="block">Features</a>
          <a href="/dashboard" className="block">Dashboard</a>
          <a href="/auth" className="block">Login</a>
          <button onClick={() => setDark(d => !d)} className="rounded-md border px-2 py-1 text-xs">
            {dark ? 'Light' : 'Dark'} mode
          </button>
        </div>
      )}
    </header>
  )
}
