'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Mail, Phone, MapPin, Search, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Volunteer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  volunteer_type: string
  volunteer_role: string
  assigned_lga: string
  assigned_ward: string
  skills: string[]
  status: string
  passport_photo_url?: string
  emergency_contact?: string
  availability?: string
  created_at: string
}

export default function VolunteersManagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [lgaFilter, setLgaFilter] = useState('all')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchVolunteers()
  }, [])

  const fetchVolunteers = async () => {
    try {
      const response = await fetch('/api/admin/volunteers')
      if (response.ok) {
        const data = await response.json()
        setVolunteers(data.data || [])
      } else {
        setError('Failed to load volunteers')
      }
    } catch (err) {
      setError('An error occurred while loading volunteers')
      console.error('Fetch volunteers error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateVolunteerStatus = async (volunteerId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/volunteers/${volunteerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setSuccess(`Volunteer status updated to ${newStatus}`)
        fetchVolunteers()
      } else {
        setError('Failed to update volunteer status')
      }
    } catch (err) {
      setError('An error occurred while updating status')
      console.error('Update status error:', err)
    }
  }

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = searchTerm === '' ||
      volunteer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.phone.includes(searchTerm)

    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter
    const matchesRole = roleFilter === 'all' || volunteer.volunteer_role === roleFilter
    const matchesLga = lgaFilter === 'all' || volunteer.assigned_lga === lgaFilter

    return matchesSearch && matchesStatus && matchesRole && matchesLga
  })

  const exportVolunteers = () => {
    const csvData = [
      ['Name', 'Email', 'Phone', 'Role', 'LGA', 'Ward', 'Status', 'Skills', 'Joined Date'],
      ...filteredVolunteers.map(volunteer => [
        `${volunteer.first_name} ${volunteer.last_name}`,
        volunteer.email,
        volunteer.phone,
        volunteer.volunteer_role,
        volunteer.assigned_lga,
        volunteer.assigned_ward,
        volunteer.status,
        volunteer.skills?.join(', ') || '',
        new Date(volunteer.created_at).toLocaleDateString()
      ])
    ]

    const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `volunteers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} />
      case 'pending': return <Clock size={16} />
      case 'active': return <CheckCircle size={16} />
      case 'rejected': return <XCircle size={16} />
      default: return null
    }
  }

  const uniqueRoles = [...new Set(volunteers.map(v => v.volunteer_role))]
  const uniqueLGAs = [...new Set(volunteers.map(v => v.assigned_lga))]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft size={18} />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">Volunteers Management</h1>
          </div>
          <Button
            onClick={exportVolunteers}
            variant="outline"
            className="gap-2"
            disabled={filteredVolunteers.length === 0}
          >
            <Download size={18} />
            Export CSV
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Volunteers</h3>
            <p className="text-3xl font-bold text-gray-900">{volunteers.length}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Approved</h3>
            <p className="text-3xl font-bold text-green-600">
              {volunteers.filter(v => v.status === 'approved').length}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {volunteers.filter(v => v.status === 'pending').length}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active</h3>
            <p className="text-3xl font-bold text-blue-600">
              {volunteers.filter(v => v.status === 'active').length}
            </p>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={lgaFilter} onValueChange={setLgaFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="LGA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All LGAs</SelectItem>
                {uniqueLGAs.map(lga => (
                  <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Volunteers List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading volunteers...</p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || roleFilter !== 'all' || lgaFilter !== 'all'
                ? 'No volunteers match your search criteria'
                : 'No volunteers registered yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVolunteers.map((volunteer) => (
              <Card key={volunteer.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      {volunteer.passport_photo_url ? (
                        <img
                          src={volunteer.passport_photo_url}
                          alt={`${volunteer.first_name} ${volunteer.last_name}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary font-bold text-lg">
                          {volunteer.first_name[0]}{volunteer.last_name[0]}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">
                          {volunteer.first_name} {volunteer.last_name}
                        </h3>
                        <Badge className={getStatusColor(volunteer.status)}>
                          {getStatusIcon(volunteer.status)}
                          <span className="ml-1 capitalize">{volunteer.status}</span>
                        </Badge>
                        <Badge variant="outline">
                          {volunteer.volunteer_role}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} />
                          {volunteer.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          {volunteer.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          {volunteer.assigned_lga}, {volunteer.assigned_ward}
                        </div>
                      </div>

                      {volunteer.skills && volunteer.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-600 mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {volunteer.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        Joined {new Date(volunteer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {volunteer.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateVolunteerStatus(volunteer.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateVolunteerStatus(volunteer.id, 'rejected')}
                          className="text-red-600 hover:text-red-700"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {volunteer.status === 'approved' && (
                      <Button
                        size="sm"
                        onClick={() => updateVolunteerStatus(volunteer.id, 'active')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Activate
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye size={16} />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
