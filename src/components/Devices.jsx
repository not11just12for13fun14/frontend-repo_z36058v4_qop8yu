import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

export default function Devices() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')
  const headers = useMemo(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }), [token])
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [deviceId, setDeviceId] = useState('')

  const load = async () => {
    const res = await fetch(`${baseUrl}/devices`, { headers })
    if (res.ok) setList(await res.json())
  }
  useEffect(() => { if (token) load() }, [token])

  const add = async () => {
    if (!name || !deviceId) return
    const user = JSON.parse(localStorage.getItem('user')||'null')
    const body = { owner_user_id: user.id, name, device_id: deviceId, is_active: true }
    const res = await fetch(`${baseUrl}/devices`, { method: 'POST', headers, body: JSON.stringify(body) })
    if (res.ok) { setName(''); setDeviceId(''); load() }
  }

  const remove = async (id) => {
    const res = await fetch(`${baseUrl}/devices/${id}`, { method: 'DELETE', headers })
    if (res.ok) load()
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Devices</h2>
      </div>
      <div className="rounded-xl border p-4 bg-white/70 dark:bg-white/[0.03]">
        <div className="grid sm:grid-cols-3 gap-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Device name" className="px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" />
          <input value={deviceId} onChange={e=>setDeviceId(e.target.value)} placeholder="IMEI / Device ID" className="px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" />
          <button onClick={add} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-900 text-white"><Plus className="w-4 h-4"/> Add device</button>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {list.map((d) => (
          <div key={d.id} className="rounded-xl border p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{d.name}</div>
              <div className="text-xs text-gray-500">{d.device_id} • Last: {d.last_seen ? new Date(d.last_seen).toLocaleString() : '—'}</div>
            </div>
            <button onClick={() => remove(d.id)} className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-red-600"><Trash2 className="w-4 h-4"/> Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
