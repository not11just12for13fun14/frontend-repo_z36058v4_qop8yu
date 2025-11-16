# GPS Tracking Web Application

A production-ready GPS tracking web app with real-time map updates, device management, route history and exports.

Tech stack
- Frontend: React + Vite + TailwindCSS, React Router, React-Leaflet
- Backend: FastAPI + Uvicorn, MongoDB (pymongo), JWT Auth, WebSockets, ReportLab

Key features
- Live Tracking Dashboard (WebSocket real-time updates on a Leaflet map)
- Device Management (create, list, delete)
- History Replay with date range + CSV/PDF export
- Alerts: speed, simple geofence enter
- Auth: email/password (JWT). Optional Google/OTP can be added.
- Dark/light mode, responsive UI, animated landing + pricing

Environment variables
- DATABASE_URL: MongoDB connection string
- DATABASE_NAME: Mongo database name
- JWT_SECRET: Secret for JWT signing
- VITE_BACKEND_URL: Frontend env pointing to backend (e.g., http://localhost:8000)

Quick start (dev)
1) Backend
- Create .env with DATABASE_URL, DATABASE_NAME, JWT_SECRET
- pip install -r requirements.txt
- uvicorn main:app --host 0.0.0.0 --port 8000 --reload

2) Frontend
- Create .env with VITE_BACKEND_URL=http://localhost:8000
- npm install
- npm run dev
- Visit http://localhost:3000

Routes
- /        Landing page with hero, features, pricing
- /auth    Login/Signup
- /gps     GPS tracking dashboard (live map, devices, history)
- /test    Backend/DB connectivity

Backend API overview
- POST /auth/signup, /auth/login -> JWT
- GET /devices, POST /devices, PUT/DELETE /devices/{id}
- POST /ingest -> Push GPS ping from device
  Example payload: { "device_id":"IMEI001", "lat":12.34, "lng":56.78, "speed_kmh":48.5, "heading_deg":180, "timestamp":"2024-05-01T10:00:00Z" }
- GET /devices/{deviceId}/history?start&end&limit
- GET /alerts
- GET /export/history/csv?device_id=...  (also /export/history/pdf)

Deployment
- Backend: Render/Railway/Fly/Cloud Run. Configure env vars and enable websockets. Expose port 8000. Configure CORS to your frontend origin.
- Frontend: Vercel/Netlify. Set VITE_BACKEND_URL to your backend URL (https). Build with npm run build.

Security notes
- Issue per-device API keys to secure /ingest in production (header X-Device-Key). Add rate limiting and validation.
- Use HTTPS everywhere. Configure CORS origins list for production.

Admin
- Simple admin endpoints /admin/users and /admin/devices require a user with role=admin.

License
MIT
