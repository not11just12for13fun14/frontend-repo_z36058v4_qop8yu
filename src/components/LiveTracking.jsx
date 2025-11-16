import { useEffect, useState, useMemo } from 'react'
import MapLive from './MapLive'

export default function LiveTracking() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')
  const [devices, setDevices] = useState([])
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])

  const load = async () => {
    if (!token) return
    const res = await fetch(`${baseUrl}/devices`, { headers })
    if (res.ok) setDevices(await res.json())
  }

  useEffect(() => { load() }, [token])

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Live Tracking</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Real-time locations with WebSocket updates.</p>
        </div>
      </div>
      <MapLive />
      <div className="mt-4 text-xs text-gray-500">Devices: {devices.map(d=>d.name).join(', ') || 'None yet'}</div>
    </div>
  )
}
