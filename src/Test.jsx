import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'

function Test() {
  const [backendStatus, setBackendStatus] = useState('checking...')
  const [backendUrl, setBackendUrl] = useState('')
  const [databaseStatus, setDatabaseStatus] = useState(null)

  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      setBackendUrl(baseUrl)
      const response = await fetch(`${baseUrl}`)
      if (response.ok) {
        const data = await response.json()
        setBackendStatus(`✅ Connected - ${data.message || 'OK'}`)
        await checkDatabaseConnection(baseUrl)
      } else {
        setBackendStatus(`❌ Failed - ${response.status} ${response.statusText}`)
        setDatabaseStatus({ error: 'Backend not accessible' })
      }
    } catch (error) {
      setBackendStatus(`❌ Error - ${error.message}`)
      setDatabaseStatus({ error: 'Backend not accessible' })
    }
  }

  const checkDatabaseConnection = async (baseUrl) => {
    try {
      const response = await fetch(`${baseUrl}/test`)
      if (response.ok) {
        const dbData = await response.json()
        setDatabaseStatus(dbData)
      } else {
        setDatabaseStatus({ error: `Failed to check database - ${response.status}` })
      }
    } catch (error) {
      setDatabaseStatus({ error: `Database check failed - ${error.message}` })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-black dark:to-neutral-900">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Backend & Database Test</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-white/80 dark:bg-white/[0.04] p-6">
            <h3 className="text-lg font-semibold mb-2">Backend URL</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 break-all">{backendUrl || 'Detecting...'}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Backend Status</h3>
              <p className="text-sm font-mono bg-gray-100 dark:bg-white/[0.06] p-2 rounded">{backendStatus}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-white/80 dark:bg-white/[0.04] p-6">
            <h3 className="text-lg font-semibold mb-2">Database Status</h3>
            <div className="text-sm bg-gray-100 dark:bg-white/[0.06] p-3 rounded">
              {databaseStatus ? (
                databaseStatus.error ? (
                  <p className="text-red-600 font-mono">{databaseStatus.error}</p>
                ) : (
                  <div className="space-y-2">
                    <p><span className="font-semibold">Backend:</span> {databaseStatus.backend}</p>
                    <p><span className="font-semibold">Database:</span> {databaseStatus.database}</p>
                    <p><span className="font-semibold">DB URL:</span> {databaseStatus.database_url}</p>
                    <p><span className="font-semibold">DB Name:</span> {databaseStatus.database_name}</p>
                    <p><span className="font-semibold">Connection:</span> {databaseStatus.connection_status}</p>
                    {databaseStatus.collections && databaseStatus.collections.length > 0 && (
                      <p><span className="font-semibold">Collections:</span> {databaseStatus.collections.join(', ')}</p>
                    )}
                  </div>
                )
              ) : (
                <p className="text-gray-500 font-mono">Checking database...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Test
