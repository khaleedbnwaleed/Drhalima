'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Heart, Target, AlertCircle, CheckCircle } from 'lucide-react'

// Helper function to validate Nigerian phone number (flexible format)
const validateNigerianPhoneFormat = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || cleaned.length === 11
}

const volunteerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .refine(
      validateNigerianPhoneFormat,
      'Enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)'
    ),
  location: z.string().min(2, 'Location is required'),
  volunteerType: z.string().min(1, 'Please select a volunteer type'),
  skills: z.string().optional(),
})

type VolunteerFormData = z.infer<typeof volunteerSchema>

export default function VolunteerPage() {
  const [locale, setLocale] = useState<'en' | 'ha'>('en')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
  })

  const onSubmit = async (data: VolunteerFormData) => {
    setLoading(true)
    setError('')

    try {
      // Clean phone number: remove spaces, dashes, parentheses
      const cleanedPhone = data.phone.replace(/[\s\-\(\)]/g, '')

      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          phone: cleanedPhone,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitted(true)
        reset()
        setError('')
      } else {
        setError(result.error || 'Failed to register as volunteer. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please check your connection and try again.')
      console.error('Error submitting volunteer form:', err)
    } finally {
      setLoading(false)
    }
  }

  const t = {
    en: {
      title: 'Become a Volunteer',
      subtitle: 'Join thousands of passionate individuals driving change in our communities',
      whyVolunteer: 'Why Volunteer?',
      benefits: [
        { icon: Heart, title: 'Make an Impact', desc: 'Directly contribute to positive change' },
        { icon: Users, title: 'Join a Community', desc: 'Connect with like-minded individuals' },
        { icon: Target, title: 'Develop Skills', desc: 'Gain valuable experience and knowledge' },
      ],
      form: 'Volunteer Registration Form',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      location: 'Location / LGA',
      volunteerType: 'Type of Volunteer Work',
      skills: 'Skills / Expertise',
      skillsPlaceholder: 'e.g., Teaching, Healthcare, Community Organizing',
      types: [
        'Community Mobilization',
        'Healthcare Support',
        'Education & Mentoring',
        'Event Organization',
        'Administrative Support',
        'Digital & Communications',
      ],
      submit: 'Register as Volunteer',
      success: 'Thank you for volunteering! We\'ll contact you shortly.',
    },
    ha: {
      title: 'Taimakawa',
      subtitle: 'Shiga jeren mutane masu rai mai tsafi da ke canja gida da al\'ummomi',
      whyVolunteer: 'Me yasan Taimakawa?',
      benefits: [
        { icon: Heart, title: 'Kawo da Sabuwa', desc: 'Kawo da canja sabuwa' },
        { icon: Users, title: 'Shiga Jama\'a', desc: 'Haɗa da wanda suke sama da tunanin ku' },
        { icon: Target, title: 'Haɓaka Aiki', desc: 'Samun gogewa da ilimi' },
      ],
      form: 'Fom Tajiyar Taimakawa',
      firstName: 'Suna da Farko',
      lastName: 'Suna na Gida',
      email: 'Wasiƙa',
      phone: 'Waya',
      location: 'Waje / LGA',
      volunteerType: 'Nau\'in Aiki Taimakawa',
      skills: 'Abubuwan Gogewa',
      skillsPlaceholder: 'Misali: Ilimi, Lafiya, Shirye Jama\'a',
      types: [
        'Shirye Jama\'a',
        'Goyon Bayan Lafiya',
        'Ilimi da Karya',
        'Shirye Taron',
        'Goyon Bayan Aiki',
        'Yanar Gizo',
      ],
      submit: 'Tajiya Taimakawa',
      success: 'Godiya da Taimakawa! Zamu tuntuɓi kaka da kaaje kaaje.',
    }
  }

  const currentT = t[locale]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale} setLocale={setLocale} />

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 md:px-8 lg:px-16 bg-linear-to-b from-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">{currentT.title}</h1>
          <p className="text-lg sm:text-xl text-foreground/80">{currentT.subtitle}</p>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-12">{currentT.whyVolunteer}</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {currentT.benefits.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <Card key={idx} className="p-8 text-center">
                  <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-foreground/70">{benefit.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-primary mb-8">{currentT.form}</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-green-700 font-medium">{currentT.success}</p>
              </div>
            )}

            {!submitted && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentT.firstName} *
                  </label>
                  <input
                    {...register('firstName')}
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentT.lastName} *
                  </label>
                  <input
                    {...register('lastName')}
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {currentT.email} *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentT.phone} *
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder={locale === 'en' ? 'e.g., 08012345678 or +234 801 234 5678' : 'Misali: 08012345678'}
                    className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phone ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  {!errors.phone && <p className="text-xs text-gray-500 mt-1">{locale === 'en' ? 'Format: 0801234567 or +2348012345678, spaces/dashes allowed' : 'Sarari: 0801234567 ko +2348012345678'}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentT.location} *
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {currentT.volunteerType} *
                </label>
                <select
                  {...register('volunteerType')}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a type...</option>
                  {currentT.types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.volunteerType && <p className="text-red-500 text-sm mt-1">{errors.volunteerType.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {currentT.skills}
                </label>
                <textarea
                  {...register('skills')}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={4}
                  placeholder={currentT.skillsPlaceholder}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                {loading ? 'Submitting...' : currentT.submit}
              </Button>
            </form>
            )}

            {submitted && (
              <div className="text-center">
                <Button
                  onClick={() => {
                    setSubmitted(false)
                    setError('')
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  {locale === 'en' ? 'Register Another Person' : 'Tajiya Wani Mutum'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  )
}
