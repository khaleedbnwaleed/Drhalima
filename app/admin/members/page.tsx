'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Search, Download, Eye, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Plus, MessageSquare, UserPlus } from 'lucide-react'
import MembershipCard from '@/components/membership-card'

interface Supporter {
  id: string
  supporterId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  state: string
  lga: string
  ward: string
  support_status: string
  photoUrl?: string
  created_at: string
  pvcNumber?: string
  occupation?: string
  address?: string
  date_of_birth?: string
  voter_status?: string
}

export default function MembersManagement() {
  const [members, setMembers] = useState<Supporter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMember, setSelectedMember] = useState<Supporter | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAddMember, setShowAddMember] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [messageSubject, setMessageSubject] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [messageRecipient, setMessageRecipient] = useState<Supporter | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data.data || [])
      } else {
        setError('Failed to load members')
      }
    } catch (err) {
      setError('An error occurred while loading members')
      console.error('Fetch members error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateMemberStatus = async (memberId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supportStatus: newStatus }),
      })

      if (response.ok) {
        setSuccess(`Member status updated to ${newStatus.replace('_', ' ')}`)
        fetchMembers()
      } else {
        setError('Failed to update member status')
      }
    } catch (err) {
      setError('An error occurred while updating status')
      console.error('Update status error:', err)
    }
  }

  const sendMessage = async () => {
    if (!messageRecipient || !messageSubject || !messageContent) {
      setError('Please fill in all message fields')
      return
    }

    try {
      const response = await fetch(`/api/admin/members/${messageRecipient.id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: messageSubject,
          message: messageContent,
          messageType: 'direct'
        }),
      })

      if (response.ok) {
        setSuccess('Message sent successfully')
        setShowMessageDialog(false)
        setMessageSubject('')
        setMessageContent('')
        setMessageRecipient(null)
      } else {
        setError('Failed to send message')
      }
    } catch (err) {
      setError('An error occurred while sending message')
      console.error('Send message error:', err)
    }
  }

  const downloadMembershipCard = async () => {
    try {
      // Find the membership card element
      const cardElement = document.querySelector('.membership-card') as HTMLElement;
      if (!cardElement) {
        setError('Membership card not found. Please try again.');
        return;
      }

      // Use html2canvas to capture the card as an image
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `membership-card-${selectedMember?.supporterId || 'member'}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error downloading membership card:', error);
      setError('Failed to download membership card. Please try again.');
    }
  };

  const addMember = async (memberData: any) => {
    try {
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      })

      if (response.ok) {
        setSuccess('Member added successfully')
        setShowAddMember(false)
        fetchMembers()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to add member')
      }
    } catch (err) {
      setError('An error occurred while adding member')
      console.error('Add member error:', err)
    }
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = searchTerm === '' ||
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.supporterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm)

    const matchesFilter = filter === 'all' ||
      (filter === 'strong' && member.support_status === 'strong_supporter') ||
      (filter === 'undecided' && member.support_status === 'undecided') ||
      (filter === 'opponent' && member.support_status === 'opponent')

    return matchesSearch && matchesFilter
  })

  const exportMembers = () => {
    const csvData = [
      ['Supporter ID', 'First Name', 'Last Name', 'Email', 'Phone', 'State', 'LGA', 'Ward', 'Support Status', 'PVC Number', 'Occupation', 'Voter Status', 'Joined Date'],
      ...filteredMembers.map(member => [
        member.supporterId,
        member.firstName,
        member.lastName,
        member.email,
        member.phone,
        member.state,
        member.lga,
        member.ward,
        member.support_status,
        member.pvcNumber || '',
        member.occupation || '',
        member.voter_status || '',
        new Date(member.created_at).toLocaleDateString()
      ])
    ]

    const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getSupportStatusColor = (status: string) => {
    switch (status) {
      case 'strong_supporter': return 'bg-green-100 text-green-800'
      case 'undecided': return 'bg-yellow-100 text-yellow-800'
      case 'opponent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSupportStatusLabel = (status: string) => {
    switch (status) {
      case 'strong_supporter': return 'Strong Supporter'
      case 'undecided': return 'Undecided'
      case 'opponent': return 'Opponent'
      default: return status
    }
  }

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
            <h1 className="text-2xl font-bold text-primary">Members Management</h1>
          </div>
          <div className="flex gap-2">
            <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus size={18} />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>
                <AddMemberForm onSubmit={addMember} onCancel={() => setShowAddMember(false)} />
              </DialogContent>
            </Dialog>
            <Button
              onClick={exportMembers}
              variant="outline"
              className="gap-2"
              disabled={filteredMembers.length === 0}
            >
              <Download size={18} />
              Export CSV
            </Button>
          </div>
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
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Members</h3>
            <p className="text-3xl font-bold text-gray-900">{members.length}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Strong Supporters</h3>
            <p className="text-3xl font-bold text-green-600">
              {members.filter(m => m.support_status === 'strong_supporter').length}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Undecided</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {members.filter(m => m.support_status === 'undecided').length}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Opponents</h3>
            <p className="text-3xl font-bold text-red-600">
              {members.filter(m => m.support_status === 'opponent').length}
            </p>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by name, email, phone, or supporter ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All ({members.length})
            </Button>
            <Button
              variant={filter === 'strong' ? 'default' : 'outline'}
              onClick={() => setFilter('strong')}
              size="sm"
            >
              Strong ({members.filter(m => m.support_status === 'strong_supporter').length})
            </Button>
            <Button
              variant={filter === 'undecided' ? 'default' : 'outline'}
              onClick={() => setFilter('undecided')}
              size="sm"
            >
              Undecided ({members.filter(m => m.support_status === 'undecided').length})
            </Button>
            <Button
              variant={filter === 'opponent' ? 'default' : 'outline'}
              onClick={() => setFilter('opponent')}
              size="sm"
            >
              Opponents ({members.filter(m => m.support_status === 'opponent').length})
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading members...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' ? 'No members match your search criteria' : 'No members registered yet'}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="cards">Membership Cards</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={`${member.firstName} ${member.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-bold text-lg">
                            {member.firstName[0]}{member.lastName[0]}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">
                            {member.firstName} {member.lastName}
                          </h3>
                          <Badge className={getSupportStatusColor(member.support_status)}>
                            {getSupportStatusLabel(member.support_status)}
                          </Badge>
                          {member.voter_status === 'verified' && (
                            <Badge variant="secondary">
                              <CheckCircle size={12} className="mr-1" />
                              Verified Voter
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">ID:</span>
                            {member.supporterId}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={16} />
                            {member.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={16} />
                            {member.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            {member.lga}, {member.ward}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            Joined {new Date(member.created_at).toLocaleDateString()}
                          </div>
                          {member.pvcNumber && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">PVC:</span>
                              {member.pvcNumber}
                            </div>
                          )}
                          {member.occupation && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Occupation:</span>
                              {member.occupation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                        className="gap-2"
                      >
                        <Eye size={16} />
                        View Card
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMessageRecipient(member)
                          setShowMessageDialog(true)
                        }}
                        className="gap-2"
                      >
                        <MessageSquare size={16} />
                        Message
                      </Button>
                      <div className="flex gap-1">
                        {member.support_status !== 'strong_supporter' && (
                          <Button
                            size="sm"
                            onClick={() => updateMemberStatus(member.id, 'strong_supporter')}
                            className="bg-green-600 hover:bg-green-700 text-xs px-2"
                          >
                            Approve
                          </Button>
                        )}
                        {member.support_status !== 'opponent' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMemberStatus(member.id, 'opponent')}
                            className="text-red-600 hover:text-red-700 text-xs px-2"
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="cards" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="flex justify-center">
                    <MembershipCard
                      memberData={{
                        fullName: `${member.firstName} ${member.lastName}`,
                        cardId: member.supporterId,
                        state: member.state,
                        lga: member.lga,
                        ward: member.ward,
                        photoUrl: member.photoUrl || '/default-avatar.png',
                        qrCodeUrl: '', // Would need to generate QR code
                        qrCodeData: `SUP:${member.supporterId}|EMAIL:${member.email}`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Membership Card Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Membership Card</h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedMember(null)}
                  className="gap-2"
                >
                  Close
                </Button>
              </div>

              <div className="flex justify-center mb-6">
                <MembershipCard
                  memberData={{
                    fullName: `${selectedMember.firstName} ${selectedMember.lastName}`,
                    cardId: selectedMember.supporterId,
                    state: selectedMember.state,
                    lga: selectedMember.lga,
                    ward: selectedMember.ward,
                    photoUrl: selectedMember.photoUrl || '/default-avatar.png',
                    qrCodeUrl: '', // Would need to generate QR code
                    qrCodeData: `SUP:${selectedMember.supporterId}|EMAIL:${selectedMember.email}`,
                  }}
                />
              </div>

              <div className="text-center">
                <Button
                  onClick={downloadMembershipCard}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  Download Membership Card
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Message Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Send Message to {messageRecipient?.firstName} {messageRecipient?.lastName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Enter message subject"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Enter your message"
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={sendMessage}>
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

// Add Member Form Component
function AddMemberForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: 'Jigawa',
    lga: '',
    ward: '',
    address: '',
    pvcNumber: '',
    occupation: '',
    supportStatus: 'undecided',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lga">LGA *</Label>
          <Input
            id="lga"
            value={formData.lga}
            onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="ward">Ward *</Label>
          <Input
            id="ward"
            value={formData.ward}
            onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pvcNumber">PVC Number</Label>
          <Input
            id="pvcNumber"
            value={formData.pvcNumber}
            onChange={(e) => setFormData({ ...formData, pvcNumber: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="supportStatus">Support Status</Label>
        <Select value={formData.supportStatus} onValueChange={(value) => setFormData({ ...formData, supportStatus: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="undecided">Undecided</SelectItem>
            <SelectItem value="strong_supporter">Strong Supporter</SelectItem>
            <SelectItem value="opponent">Opponent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Member
        </Button>
      </div>
    </form>
  )
}