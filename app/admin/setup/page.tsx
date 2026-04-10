'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [actionStatus, setActionStatus] = useState('')

  const handleSetupAdmin = async () => {
    setLoading(true)
    setActionStatus('Setting up admin account...')
    
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup-admin' }),
      })

      const data = await response.json()
      setResult(data)
      setActionStatus('Setup complete!')
    } catch (error) {
      setResult({ error: String(error) })
      setActionStatus('Setup failed!')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckAdmin = async () => {
    setLoading(true)
    setActionStatus('Checking admin account...')
    
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-admin' }),
      })

      const data = await response.json()
      setResult(data)
      setActionStatus('Check complete!')
    } catch (error) {
      setResult({ error: String(error) })
      setActionStatus('Check failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Setup
          </h1>
          <p className="text-gray-600">
            Configure and test your admin account
          </p>
        </div>

        {/* Setup Card */}
        <Card className="p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Admin Account Setup
          </h2>

          <div className="space-y-4 mb-6">
            <p className="text-gray-700">
              Click the button below to create or reset your admin account with these credentials:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-blue-900">
                <strong>Email:</strong> <code className="bg-white px-3 py-1 rounded font-mono text-sm">admin@drhalimasulaiman.ng</code>
              </p>
              <p className="text-blue-900">
                <strong>Password:</strong> <code className="bg-white px-3 py-1 rounded font-mono text-sm">admin123</code>
              </p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Button
              onClick={handleSetupAdmin}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? 'Processing...' : 'Setup Admin Account'}
            </Button>
            <Button
              onClick={handleCheckAdmin}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Checking...' : 'Check Admin Account'}
            </Button>
          </div>

          {actionStatus && (
            <div className="text-center text-sm font-medium text-gray-600 mb-4">
              {actionStatus}
            </div>
          )}

          {result && (
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </Card>

        {/* Test Login Card */}
        <Card className="p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Test Login
          </h2>
          <p className="text-gray-700 mb-6">
            After setting up the admin account, you can test the login:
          </p>
          <a
            href="/admin/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go to Admin Login →
          </a>
        </Card>

        {/* Instructions Card */}
        <Card className="p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Instructions
          </h2>
          <ol className="space-y-3 text-gray-700 list-decimal list-inside">
            <li>Click "Setup Admin Account" to create the admin user</li>
            <li>Check the result to ensure it was created successfully</li>
            <li>Go to Admin Login page</li>
            <li>Enter the credentials shown above</li>
            <li>You should be redirected to the admin dashboard</li>
          </ol>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
