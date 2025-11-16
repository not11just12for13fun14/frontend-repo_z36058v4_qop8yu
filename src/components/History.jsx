import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function History() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])

  const [deviceId, setDeviceId] = useState('')
  const [devices, setDevices] = useState([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [route, setRoute] = useState([])

  const loadDevices = async () => {
    const res = await fetch(`${baseUrl}/devices`, { headers })
    if (res.ok) setDevices(await res.json())
  }

  useEffect(() => { if (token) loadDevices() }, [token])

  const load = async () => {
    if (!deviceId) return
    const params = new URLSearchParams()
    if (start) params.set('start', new Date(start).toISOString())
    if (end) params.set('end', new Date(end).toISOString())
    const res = await fetch(`${baseUrl}/devices/${deviceId}/history?${params.toString()}`, { headers })
    if (res.ok) {
      const data = await res.json()
      setRoute(data.map(p => [p.lat, p.lng]))
    }
  }

  const exportCsv = () => {
    const params = new URLSearchParams()
    if (start) params.set('start', new Date(start).toISOString())
    if (end) params.set('end', new Date(end).toISOString())
    window.open(`${baseUrl}/export/history/csv?device_id=${deviceId}&${params.toString()}`)
  }
  const exportPdf = () => {
    const params = new URLSearchParams()
    if (start) params.set('start', new Date(start).toISOString())
    if (end) params.set('end', new Date(end).toISOString())
    window.open(`${baseUrl}/export/history/pdf?device_id=${deviceId}&${params.toString()}`)
  }

  const center = route.length ? route[Math.floor(route.length/2)] : [37.7749, -122.4194]

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">History</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Select date range and replay routes.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="px-3 py-2 border rounded-md text-sm inline-flex items-center gap-2"><Download className="w-4 h-4"/> CSV</button>
          <button onClick={exportPdf} className="px-3 py-2 border rounded-md text-sm inline-flex items-center gap-2"><Download className="w-4 h-4"/> PDF</button>
        </div>
      </div>

      <div className="rounded-xl border p-4 bg-white/70 dark:bg-white/[0.03] grid sm:grid-cols-3 gap-3">
        <select value={deviceId} onChange={e=>setDeviceId(e.target.value)} className="px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]">
          <option value="">Select device</option>
          {devices.map(d => (<option key={d.id} value={d.device_id}>{d.name} — {d.device_id}</option>))}
        </select>
        <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} className="px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" />
        <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} className="px-3 py-2 rounded-md border bg-white/80 dark:bg-white/[0.06]" />
        <div className="sm:col-span-3">
          <button onClick={load} className="px-3 py-2 rounded-md bg-gray-900 text-white">Load history</button>
        </div>
      </div>

      <div className="mt-4 w-full h-[60vh] rounded-xl overflow-hidden border">
        <MapContainer center={center} zoom={12} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {route.length > 1 && (
            <Polyline positions={route} color="#16a34a" />
          )}
        </MapContainer>
      </div>
    </div>
  )
}
