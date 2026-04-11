'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import OrganizationMemberForm from '@/components/organization-member-form'

interface OrganizationData {
  id: string
  organization_name: string
  contact_person: string
  email: string
  phone: string
  address?: string
  supporter_id: string
  created_at: string
}

interface OrganizationMember {
  id: string
  supporter_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  state: string
  lga: string
  ward: string
  status: string
  created_at: string
}

export default function SupporterDashboard() {
  const router = useRouter()
  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [membersLoading, setMembersLoading] = useState(false)

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        setLoading(true)
        
        // Fetch organization details
        const orgResponse = await fetch('/api/supporter/organization/details')
        
        if (!orgResponse.ok) {
          if (orgResponse.status === 401) {
            router.push('/supporter-login')
            return
          }
          throw new Error('Failed to fetch organization details')
        }

        const orgData = await orgResponse.json()
        setOrganization(orgData.organization)

        // Fetch members
        await fetchMembers()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizationData()
  }, [router])

  const fetchMembers = async () => {
    try {
      setMembersLoading(true)
      const response = await fetch('/api/supporter/organization/members')
      
      if (!response.ok) {
        throw new Error('Failed to fetch members')
      }

      const data = await response.json()
      setMembers(data.members || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch members')
    } finally {
      setMembersLoading(false)
    }
  }

  const handleMemberAdded = () => {
    setShowMemberForm(false)
    fetchMembers()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer locale="en" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Organization Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your organization and register members supporting Dr. Halima Sulaiman
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Organization Details Card */}
          {organization && (
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {organization.organization_name}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Organization ID
                      </label>
                      <p className="text-lg text-gray-900 font-mono">
                        {organization.supporter_id}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Contact Person
                      </label>
                      <p className="text-gray-900">{organization.contact_person}</p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Email
                      </label>
                      <p className="text-gray-900">{organization.email}</p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Phone
                      </label>
                      <p className="text-gray-900">{organization.phone}</p>
                    </div>

                    {organization.address && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Address
                        </label>
                        <p className="text-gray-900">{organization.address}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Member Since
                      </label>
                      <p className="text-gray-900">
                        {new Date(organization.created_at).toLocaleDateString('en-NG')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center text-center p-8 bg-white rounded-lg shadow">
                  <div className="mb-6">
                    <Badge className="text-lg px-4 py-2 bg-green-500">
                      Active Organization
                    </Badge>
                  </div>
                  <div className="mb-8">
                    <p className="text-4xl font-bold text-indigo-600">
                      {members.length}
                    </p>
                    <p className="text-gray-600 mt-2">
                      Members Registered
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowMemberForm(!showMemberForm)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    size="lg"
                  >
                    {showMemberForm ? 'Cancel' : '+ Register New Member'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Tabs for Members and Settings */}
          <Tabs defaultValue="members" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="members">
                Members ({members.length})
              </TabsTrigger>
              <TabsTrigger value="add">
                Add Member
              </TabsTrigger>
            </TabsList>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Registered Members
                </h3>

                {membersLoading ? (
                  <div className="text-center text-gray-600">Loading members...</div>
                ) : members.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">
                      No members registered yet
                    </p>
                    <Button
                      onClick={() => setShowMemberForm(true)}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Register First Member
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Supporter ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registered</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-mono text-sm">
                              {member.supporter_id}
                            </TableCell>
                            <TableCell>
                              {member.first_name} {member.last_name}
                            </TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{member.phone}</TableCell>
                            <TableCell>
                              {member.lga}, {member.state}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  member.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }
                              >
                                {member.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(member.created_at).toLocaleDateString('en-NG')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Add Member Tab */}
            <TabsContent value="add">
              <OrganizationMemberForm onMemberAdded={handleMemberAdded} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer locale="en" />
    </div>
  )
}
