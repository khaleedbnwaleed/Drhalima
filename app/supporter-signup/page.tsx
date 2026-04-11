'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function SupporterSignupPage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactPerson: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Password strength indicator
    if (name === 'password') {
      if (value.length === 0) {
        setPasswordStrength('')
      } else if (value.length < 8) {
        setPasswordStrength('weak')
      } else if (value.length < 12) {
        setPasswordStrength('medium')
      } else {
        setPasswordStrength('strong')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Enhanced validation
    if (!formData.organizationName.trim()) {
      setError('Organization name is required')
      return
    }

    if (!formData.email.trim()) {
      setError('Email address is required')
      return
    }

    if (!formData.password) {
      setError('Password is required')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/supporter/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: formData.organizationName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          contactPerson: formData.contactPerson.trim() || null,
          phone: formData.phone.trim() || null,
          address: formData.address.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          setError('This email address is already registered. Please use a different email or try logging in.')
        } else if (response.status === 400) {
          setError(data.error || 'Please check your information and try again.')
        } else {
          setError(data.details ? `${data.error}: ${data.details}` : (data.error || 'Signup failed. Please try again.'))
        }
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/supporter-login')
      }, 2000)
    } catch (err) {
      console.error('Signup error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
        <Card className="w-full max-w-md shadow-xl">
          <div className="p-8 space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Signup Successful!
            </h2>
            <p className="text-gray-600">
              Your account has been created. Redirecting to login...
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <img src="/Logo.png" alt="Logo" className="mx-auto mb-4 h-16 w-auto" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Register Your Organization
            </h1>
            <p className="text-gray-600">
              Create an account to support the campaign
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Organization Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Contact Person Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="organization@example.com"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Street Address"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password (min. 8 characters) *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength === 'weak' ? 'bg-red-500 w-1/3' :
                            passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' :
                            passwordStrength === 'strong' ? 'bg-green-500 w-full' : 'w-0'
                          }`}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength === 'weak' ? 'text-red-600' :
                        passwordStrength === 'medium' ? 'text-yellow-600' :
                        passwordStrength === 'strong' ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {passwordStrength === 'weak' ? 'Weak' :
                         passwordStrength === 'medium' ? 'Medium' :
                         passwordStrength === 'strong' ? 'Strong' : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                  <p className="text-green-600 text-xs mt-1">✓ Passwords match</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded-lg transition"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link 
                href="/supporter-login" 
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link 
              href="/" 
              className="text-gray-600 text-sm hover:text-gray-800 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
