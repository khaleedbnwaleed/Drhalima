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

// Nigerian states
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT',
]

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

  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [bulkUploading, setBulkUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      support_status: 'supporter',
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
            <Select value={selectedState} onValueChange={(value) => {
              setSelectedState(value)
              register('state').onChange({ target: { value } } as any)
            }}>
              <SelectTrigger id="state" className={errors.state ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('state', { value: selectedState })} />
            {errors.state && (
              <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lga" className="mb-2 block">
              LGA (Local Government Area) *
            </Label>
            <Input
              id="lga"
              placeholder="e.g., Lagos Island"
              {...register('lga')}
              className={errors.lga ? 'border-red-500' : ''}
            />
            {errors.lga && (
              <p className="text-red-600 text-sm mt-1">{errors.lga.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="ward" className="mb-2 block">
              Ward (Optional)
            </Label>
            <Input
              id="ward"
              placeholder="e.g., Ward 1"
              {...register('ward')}
            />
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
