'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'

interface Volunteer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  volunteer_type: string
  skills: string
  status: string
  created_at: string
}

export default function VolunteersManagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const url = filter === 'all' 
          ? '/api/volunteers' 
          : `/api/volunteers?status=${filter}`
        const response = await fetch(url)
        const data = await response.json()
        setVolunteers(data || [])
      } catch (error) {
        console.error('Error fetching volunteers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVolunteers()
  }, [filter])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft size={18} />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">Volunteers Management</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-8">
          {['all', 'pending', 'approved'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
              className={filter === status ? 'bg-primary text-white' : ''}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Volunteers List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-foreground/60">Loading volunteers...</p>
          ) : volunteers.length === 0 ? (
            <p className="text-foreground/60">No volunteers found</p>
          ) : (
            volunteers.map((volunteer) => (
              <Card key={volunteer.id} className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {volunteer.first_name} {volunteer.last_name}
                    </h3>
                    <div className="space-y-1 text-sm text-foreground/60">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        {volunteer.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        {volunteer.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        {volunteer.location}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground/60 mb-2">Volunteer Type</p>
                    <p className="font-medium text-foreground mb-4">{volunteer.volunteer_type}</p>
                    <p className="text-sm font-medium text-foreground/60 mb-2">Skills</p>
                    <p className="text-sm text-foreground/80">{volunteer.skills || 'Not specified'}</p>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-foreground/60">Status</p>
                      <p className={`font-bold capitalize ${
                        volunteer.status === 'pending' ? 'text-yellow-600' :
                        volunteer.status === 'approved' ? 'text-green-600' :
                        'text-red-600'
                      }`}>
                        {volunteer.status}
                      </p>
                    </div>
                    <p className="text-xs text-foreground/50">
                      Joined {new Date(volunteer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
