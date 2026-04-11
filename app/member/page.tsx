'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import SupporterRegistrationForm from '@/components/supporter-registration-form'
import { Card } from '@/components/ui/card'
import { Users, Heart, Target, CheckCircle } from 'lucide-react'

export default function MemberPage() {
  const [locale, setLocale] = useState<'en' | 'ha'>('en')

  const t = {
    en: {
      title: 'Become a Member',
      subtitle: 'Join our movement and be part of the change for a better future',
      whyMember: 'Why Become a Member?',
      benefits: [
        { icon: Heart, title: 'Support the Cause', desc: 'Stand with Dr. Halima Suleiman Zakari for positive change' },
        { icon: Users, title: 'Join the Community', desc: 'Connect with fellow supporters and activists' },
        { icon: CheckCircle, title: 'Get Involved', desc: 'Participate in campaigns and community initiatives' },
      ],
      form: 'Member Registration',
    },
    ha: {
      title: 'Zama Membar',
      subtitle: 'Shiga cikin yunƙurin mu kuma kasance cikin canjin don gida maikyau',
      whyMember: 'Me yasan Zama Membar?',
      benefits: [
        { icon: Heart, title: 'Goyon Bayan Manufa', desc: 'Tsaya tare da Daktariya Halima Suleiman Zakari don canja sabuwa' },
        { icon: Users, title: 'Shiga Jama\'a', desc: 'Haɗa da \'yan goyon baya da masu fafutuka' },
        { icon: CheckCircle, title: 'Kasance Cikin', desc: 'Kasance cikin kamfen da ajiyun jama\'a' },
      ],
      form: 'Tajiyar Membar',
    }
  }

  const currentT = t[locale]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 md:px-8 lg:px-16 bg-linear-to-b from-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">{currentT.title}</h1>
          <p className="text-xl text-foreground/80">{currentT.subtitle}</p>
        </div>
      </section>

      {/* Why Become a Member */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">{currentT.whyMember}</h2>

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

      {/* Registration Form */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary">{currentT.form}</h2>
          </div>
          <SupporterRegistrationForm />
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  )
}