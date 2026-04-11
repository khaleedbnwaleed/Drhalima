'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [locale, setLocale] = useState<'en' | 'ha'>('en')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true)
    try {
      // Submit to Supabase
      const response = await fetch('/api/contact', {
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
      console.error('Error submitting contact form:', error)
    } finally {
      setLoading(false)
    }
  }

  const t = {
    en: {
      title: 'Get In Touch',
      subtitle: 'We\'d love to hear from you. Send us a message.',
      contactInfo: 'Contact Information',
      form: 'Send us a Message',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      success: 'Thank you! Your message has been sent successfully.',
      office: 'Main Office',
      email_label: 'Email',
      phone_label: 'Phone',
      address_label: 'Address',
    },
    ha: {
      title: 'Tuntuɓi',
      subtitle: 'Mun ji da kuke so. Aika mu sauni.',
      contactInfo: 'Bayanan Tuntuɓi',
      form: 'Aika Sauni',
      name: 'Suna Gida',
      email: 'Wasiƙa',
      phone: 'Waya',
      subject: 'Mata',
      message: 'Sauni',
      send: 'Aika',
      success: 'Godiya! Sauni ka je sosai.',
      office: 'Ofis',
      email_label: 'Wasiƙa',
      phone_label: 'Waya',
      address_label: 'Waje',
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

      {/* Contact Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-8">{currentT.contactInfo}</h2>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-secondary" />
                    <h3 className="font-semibold">{currentT.email_label}</h3>
                  </div>
                  <a href="mailto:contact@halima2025.ng" className="text-foreground/70 hover:text-primary transition-colors">
                    contact@halima2025.ng
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="w-5 h-5 text-secondary" />
                    <h3 className="font-semibold">{currentT.phone_label}</h3>
                  </div>
                  <a href="tel:+2348012345678" className="text-foreground/70 hover:text-primary transition-colors">
                    +234 801 234 5678
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-secondary" />
                    <h3 className="font-semibold">{currentT.address_label}</h3>
                  </div>
                  <address className="text-foreground/70 not-italic">
                    {currentT.office}<br />
                    Kano, Nigeria
                  </address>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-8">{currentT.form}</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">{currentT.success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentT.name}
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={currentT.name}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {currentT.email}
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={currentT.email}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {currentT.phone}
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={currentT.phone}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentT.subject}
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={currentT.subject}
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {currentT.message}
                  </label>
                  <textarea
                    {...register('message')}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={6}
                    placeholder={currentT.message}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {loading ? 'Sending...' : currentT.send}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  )
}
