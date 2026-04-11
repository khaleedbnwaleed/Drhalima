'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        return
      }

      // Redirect to admin dashboard
      router.push('/admin')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <img src="/Logo.png" alt="Logo" className="mx-auto mb-4 h-16 w-auto" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-600">
              Sign in to manage the campaign
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Test Credentials Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 text-sm font-semibold mb-2">Test Credentials:</p>
            <p className="text-blue-800 text-xs">Email: <code className="font-mono bg-white px-2 py-1 rounded">admin@drhalimasulaiman.ng</code></p>
            <p className="text-blue-800 text-xs">Password: <code className="font-mono bg-white px-2 py-1 rounded">admin123</code></p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="admin@drhalimasulaiman.ng"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold rounded-lg transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium transition">
              ← Back to campaign site
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
