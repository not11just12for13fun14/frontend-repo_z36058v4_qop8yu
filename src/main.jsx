import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Test from './Test'
import './index.css'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import DashboardGPS from './DashboardGPS'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<Test />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gps" element={<DashboardGPS />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
