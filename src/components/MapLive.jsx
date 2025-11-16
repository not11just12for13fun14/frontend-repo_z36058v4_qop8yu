import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapLive() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')
  const [devices, setDevices] = useState([])
  const [pings, setPings] = useState({}) // device_id -> last ping
  const [trails, setTrails] = useState({}) // device_id -> array of latlng
  const wsRef = useRef(null)

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])

  const loadDevices = async () => {
    if (!token) return
    const res = await fetch(`${baseUrl}/devices`, { headers })
    if (res.ok) {
      const data = await res.json()
      setDevices(data)
      // seed last positions from device state if present
      const next = {}
      data.forEach(d => {
        if (d.last_lat && d.last_lng) next[d.device_id] = { lat: d.last_lat, lng: d.last_lng, speed_kmh: d.last_speed, heading_deg: d.last_heading, timestamp: d.last_seen }
      })
      setPings(next)
    }
  }

  useEffect(() => { loadDevices() }, [token])

  useEffect(() => {
    if (!token) return
    const url = new URL(`${baseUrl.replace('http', 'ws')}/ws/track`)
    url.searchParams.set('token', token)
    const ws = new WebSocket(url)
    wsRef.current = ws
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg.type === 'ping') {
          const d = msg.ping
          setPings(prev => ({ ...prev, [d.device_id]: d }))
          setTrails(prev => ({ ...prev, [d.device_id]: [ ...(prev[d.device_id]||[]), [d.lat, d.lng] ].slice(-200) }))
        }
      } catch (e) {}
    }
    ws.onclose = () => { wsRef.current = null }
    return () => { try { ws.close() } catch (e) {} }
  }, [token])

  const center = devices.length && devices[0].last_lat ? [devices[0].last_lat, devices[0].last_lng] : [37.7749, -122.4194]

  return (
    <div className="w-full h-[70vh] rounded-xl overflow-hidden border">
      <MapContainer center={center} zoom={12} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {devices.map((dev) => {
          const last = pings[dev.device_id]
          if (!last) return null
          const pos = [last.lat, last.lng]
          return (
            <>
              <Marker key={dev.id} position={pos}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{dev.name}</div>
                    <div>ID: {dev.device_id}</div>
                    <div>Speed: {last.speed_kmh || 0} km/h</div>
                    <div>Heading: {last.heading_deg || 0}°</div>
                    <div className="text-xs text-gray-500">{new Date(last.timestamp).toLocaleString()}</div>
                  </div>
                </Popup>
              </Marker>
              {trails[dev.device_id] && trails[dev.device_id].length > 1 && (
                <Polyline positions={trails[dev.device_id]} color="#2563eb" />
              )}
            </>
          )
        })}
      </MapContainer>
    </div>
  )
}
