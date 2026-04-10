'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Heart, Target } from 'lucide-react'

const volunteerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  location: z.string().min(2, 'Location is required'),
  volunteerType: z.string().min(1, 'Please select a volunteer type'),
  skills: z.string().optional(),
})

type VolunteerFormData = z.infer<typeof volunteerSchema>

export default function VolunteerPage() {
  const [locale, setLocale] = useState<'en' | 'ha'>('en')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
  })

  const onSubmit = async (data: VolunteerFormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitted(true)
        reset()
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      console.error('Error submitting volunteer form:', error)
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
      <section className="pt-20 pb-12 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">{currentT.title}</h1>
          <p className="text-xl text-foreground/80">{currentT.subtitle}</p>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">{currentT.whyVolunteer}</h2>

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

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{currentT.success}</p>
              </div>
            )}

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
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
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
          </Card>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  )
}
