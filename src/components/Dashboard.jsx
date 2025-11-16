import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Filter, Trash2, Edit3, Download, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))
  const [entries, setEntries] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [summary, setSummary] = useState(null)

  const headers = useMemo(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }), [token])

  const fetchEntries = async () => {
    if (!token) return
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category) params.set('category', category)
    if (status) params.set('status', status)
    if (sortBy) params.set('sort_by', sortBy)
    if (sortDir) params.set('sort_dir', sortDir)
    const res = await fetch(`${baseUrl}/entries?${params.toString()}`, { headers })
    const data = await res.json()
    setEntries(data)
  }

  const fetchSummary = async () => {
    if (!token) return
    const res = await fetch(`${baseUrl}/entries/summary`, { headers })
    if (res.ok) setSummary(await res.json())
  }

  useEffect(() => { fetchEntries(); fetchSummary() }, [token])
  useEffect(() => { fetchEntries() }, [query, category, status, sortBy, sortDir])

  const onCreate = async (payload) => {
    const res = await fetch(`${baseUrl}/entries`, { method: 'POST', headers, body: JSON.stringify(payload) })
    if (res.ok) { setShowForm(false); setEditing(null); fetchEntries(); fetchSummary() }
  }

  const onUpdate = async (id, payload) => {
    const res = await fetch(`${baseUrl}/entries/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
    if (res.ok) { setShowForm(false); setEditing(null); fetchEntries(); fetchSummary() }
  }

  const onDelete = async (id) => {
    const res = await fetch(`${baseUrl}/entries/${id}`, { method: 'DELETE', headers })
    if (res.ok) fetchEntries()
  }

  const onExport = (type) => {
    window.open(`${baseUrl}/export/${type}?token=${token}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tracking Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Manage entries, analyze insights, and export.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onExport('csv')} className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm"><Download className="w-4 h-4" /> CSV</button>
            <button onClick={() => onExport('pdf')} className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm"><Download className="w-4 h-4" /> PDF</button>
            <button onClick={() => { setEditing(null); setShowForm(true) }} className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-md text-sm"><Plus className="w-4 h-4" /> New</button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title or notes" className="w-full pl-9 pr-3 py-2 rounded-md border bg-white/70 dark:bg-white/[0.06]" />
          </div>
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="px-3 py-2 rounded-md border bg-white/70 dark:bg-white/[0.06]" />
          <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 rounded-md border bg-white/70 dark:bg-white/[0.06]">
            <option value="">Any status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <div className="flex gap-2">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 rounded-md border bg-white/70 dark:bg-white/[0.06]">
              <option value="date">Sort by date</option>
              <option value="amount">Sort by amount</option>
              <option value="title">Sort by title</option>
            </select>
            <select value={sortDir} onChange={e => setSortDir(e.target.value)} className="px-3 py-2 rounded-md border bg-white/70 dark:bg-white/[0.06]">
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>

        {/* Cards */}
        {summary && (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border bg-white/70 dark:bg-white/[0.03]">
              <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
              <div className="text-2xl font-semibold">{summary.total?.toFixed(2)}</div>
            </div>
            {summary.byCategory?.slice(0,3).map((c) => (
              <div key={c.category} className="p-4 rounded-xl border bg-white/70 dark:bg-white/[0.03]">
                <div className="text-sm text-gray-600 dark:text-gray-300">{c.category}</div>
                <div className="text-2xl font-semibold">{c.total.toFixed(1)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="py-2">Title</th>
                <th className="py-2">Category</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/70 dark:divide-white/10">
              {entries.map((e) => (
                <tr key={e.id} className="text-gray-900 dark:text-gray-100">
                  <td className="py-3">{e.title}</td>
                  <td className="py-3">{e.category}</td>
                  <td className="py-3">{e.amount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${e.status === 'open' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-gray-500/10 text-gray-700'}`}>{e.status}</span>
                  </td>
                  <td className="py-3">{new Date(e.date).toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => { setEditing(e); setShowForm(true) }} className="inline-flex items-center gap-1 px-2 py-1 border rounded mr-2"><Edit3 className="w-4 h-4" /> Edit</button>
                    <button onClick={() => onDelete(e.id)} className="inline-flex items-center gap-1 px-2 py-1 border rounded text-red-600"><Trash2 className="w-4 h-4" /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <EntryForm onClose={() => { setShowForm(false); setEditing(null) }} onCreate={onCreate} onUpdate={onUpdate} editing={editing} userId={user?.id} />
        )}
      </div>
    </div>
  )
}

function EntryForm({ onClose, onCreate, onUpdate, editing, userId }) {
  const [title, setTitle] = useState(editing?.title || '')
  const [category, setCategory] = useState(editing?.category || '')
  const [amount, setAmount] = useState(editing?.amount || 0)
  const [status, setStatus] = useState(editing?.status || 'open')
  const [notes, setNotes] = useState(editing?.notes || '')
  const [date, setDate] = useState(editing ? new Date(editing.date).toISOString().slice(0,16) : new Date().toISOString().slice(0,16))

  const submit = () => {
    const payload = { user_id: userId, title, category, amount: parseFloat(amount), status, notes, date: new Date(date).toISOString() }
    if (editing) onUpdate(editing.id, payload)
    else onCreate(payload)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-neutral-900 p-6">
        <h3 className="text-lg font-semibold">{editing ? 'Edit Entry' : 'New Entry'}</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" />
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" />
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" />
          <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]">
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" className="sm:col-span-2 px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" rows={4} />
          <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 border rounded-md">Cancel</button>
          <button onClick={submit} className="px-3 py-2 rounded-md bg-gray-900 text-white">{editing ? 'Save' : 'Create'}</button>
        </div>
      </div>
    </div>
  )
}
