'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

// Validation schema
const memberSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  state: z.string().min(1, 'Please select a state'),
  lga: z.string().min(1, 'LGA is required'),
  ward: z.string().optional(),
  support_status: z.string().default('supporter'),
})

type MemberFormData = z.infer<typeof memberSchema>

// Jigawa State LGAs and their wards
const JIGAWA_LGAS: Record<string, string[]> = {
  'Dutse': [
    'Aujara',
    'Chamo',
    'Dutse',
    'Fagam',
    'Galambi',
    'Kachi',
    'Limawa',
    'Madobi',
    'Sakwaya',
    'Takur',
  ],
  'Jahun': [
    'Aujara',
    'Gangawa',
    'Harbo Sabuwa',
    'Harbo Tsohuwa',
    'Jabarna',
    'Jahun',
    'Kanwa',
    'Kafin Baka',
    'Gunka',
    'Yalleman',
  ],
  'Kiyawa': [
    'Andaza',
    'Fake',
    'Katanga',
    'Kiyawa',
    'Kwadaza',
    'Maje',
    'Tsirma',
    'Zango',
    'Karankiya',
    'Daban Gari',
  ],
  'Birnin Kudu': [
    'Birnin Kudu',
    'Kantoga',
    'Kangire',
    'Kwangwara',
    'Kiyako',
    'Sundumina',
    'Surko',
    'Lafiya',
    'Unguwar Ƴa',
    'Yalwan Damai',
    'Wurno',
  ],
  'Buji': [
    'Buji',
    'Chira',
    'Falageri',
    'Gantsa',
    'Kafin Madaki',
    'Yakun',
    'Ahoto',
    'Madabe',
    'Gwadayi',
    'Gagarawa',
  ],
  'Gwaram': [
    'Basirka',
    'Dingaya',
    'Fagam',
    'Gwaram',
    'Kwandiko',
    'Maruta',
    'Sara',
    'Tsangarwa',
    'Zandam',
    'Kila',
  ],
}

const SUPPORT_STATUS_OPTIONS = [
  { value: 'supporter', label: 'Supporter' },
  { value: 'strong_supporter', label: 'Strong Supporter' },
  { value: 'loyal_supporter', label: 'Loyal Supporter' },
  { value: 'advocate', label: 'Advocate' },
]

interface OrganizationMemberFormProps {
  onMemberAdded?: () => void
  onBulkUpload?: () => void
}

export default function OrganizationMemberForm({ onMemberAdded, onBulkUpload }: OrganizationMemberFormProps) {
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedState, setSelectedState] = useState('Jigawa')
  const [selectedLga, setSelectedLga] = useState('')
  const [selectedWard, setSelectedWard] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      support_status: 'supporter',
      state: 'Jigawa',
    },
  })

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      setError('Please select a CSV file')
      return
    }

    setBulkUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', bulkFile)

      const response = await fetch('/api/supporter/organization/members/bulk', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Bulk upload failed')
        return
      }

      setSuccess(`Successfully uploaded ${result.successful} members. ${result.failed} failed.`)
      setBulkFile(null)
      onMemberAdded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk upload failed')
    } finally {
      setBulkUploading(false)
    }
  }

  const onSubmit = async (data: any) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/supporter/organization/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to register member')
        return
      }

      setSuccess('Member registered successfully!')
      reset()
      onMemberAdded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">
          Register Organization Member{showBulkUpload ? 's' : ''}
        </h3>
        <Button
          variant="outline"
          onClick={() => setShowBulkUpload(!showBulkUpload)}
          className="flex items-center gap-2"
        >
          {showBulkUpload ? 'Single Registration' : 'Bulk Upload'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {showBulkUpload ? (
        // Bulk Upload Form
        <div className="space-y-6">
          <div>
            <Label htmlFor="csvFile" className="mb-2 block">
              Upload CSV File
            </Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
              className="mb-4"
            />
            <p className="text-sm text-gray-600">
              CSV format: first_name,last_name,email,phone,state,lga,ward,support_status
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Example: John,Doe,john@example.com,08012345678,Lagos,Lagos Island,Ward 1,supporter
            </p>
          </div>

          <div className="pt-6 border-t">
            <Button
              onClick={handleBulkUpload}
              disabled={!bulkFile || bulkUploading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
              size="lg"
            >
              {bulkUploading ? 'Uploading Members...' : 'Upload Members'}
            </Button>
          </div>
        </div>
      ) : (
        // Single Member Registration Form
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Row */}
          <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name" className="mb-2 block">
              First Name *
            </Label>
            <Input
              id="first_name"
              placeholder="John"
              {...register('first_name')}
              className={errors.first_name ? 'border-red-500' : ''}
            />
            {errors.first_name && (
              <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="last_name" className="mb-2 block">
              Last Name *
            </Label>
            <Input
              id="last_name"
              placeholder="Doe"
              {...register('last_name')}
              className={errors.last_name ? 'border-red-500' : ''}
            />
            {errors.last_name && (
              <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Contact Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="mb-2 block">
              Phone *
            </Label>
            <Input
              id="phone"
              placeholder="+234 701 234 5678"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Location Row */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="state" className="mb-2 block">
              State *
            </Label>
            <Select value={selectedState} disabled>
              <SelectTrigger id="state" className={errors.state ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jigawa">Jigawa</SelectItem>
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lga" className="mb-2 block">
              LGA (Local Government Area) *
            </Label>
            <Select value={selectedLga} onValueChange={(value) => {
              setSelectedLga(value)
              setSelectedWard('')
              setValue('lga', value)
            }}>
              <SelectTrigger id="lga" className={errors.lga ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(JIGAWA_LGAS).map((lga) => (
                  <SelectItem key={lga} value={lga}>
                    {lga}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lga && (
              <p className="text-red-600 text-sm mt-1">{errors.lga.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="ward" className="mb-2 block">
              Ward (Optional)
            </Label>
            <Select value={selectedWard} onValueChange={(value) => {
              setSelectedWard(value)
              setValue('ward', value)
            }} disabled={!selectedLga}>
              <SelectTrigger id="ward">
                <SelectValue placeholder="Select Ward" />
              </SelectTrigger>
              <SelectContent>
                {selectedLga && JIGAWA_LGAS[selectedLga]?.map((ward) => (
                  <SelectItem key={ward} value={ward}>
                    {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Support Status */}
        <div>
          <Label htmlFor="support_status" className="mb-2 block">
            Support Status
          </Label>
          <Select defaultValue="supporter" onValueChange={(value) => {
            register('support_status').onChange({ target: { value } } as any)
          }}>
            <SelectTrigger id="support_status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
            size="lg"
          >
            {loading ? 'Registering Member...' : 'Register Member'}
          </Button>
        </div>
        </form>
      )}

      <p className="text-sm text-gray-600 mt-4">
        Fields marked with * are required. This member will be registered as part of your organization
        and associated with your organization account.
      </p>
    </Card>
  )
}
