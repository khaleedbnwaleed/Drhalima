'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'

export default function VisionPage() {
  const [locale, setLocale] = useState<'en' | 'ha'>('en')

  const content = {
    en: {
      title: 'Our Vision for Tomorrow',
      visionStatement: 'A prosperous, inclusive, and peaceful state where every citizen has access to quality education, healthcare, and economic opportunities.',
      mission: 'To provide transformative leadership that prioritizes the welfare of all citizens, promotes inclusive development, and builds a legacy of progress for future generations.',
      roadmap: [
        {
          period: 'First 100 Days',
          items: [
            'Establish governance structures and transition teams',
            'Launch transparency and anti-corruption initiatives',
            'Conduct state-wide needs assessment',
            'Begin dialogue with communities',
          ]
        },
        {
          period: 'Year 1',
          items: [
            'Complete 25 new schools and healthcare centers',
            'Create 25,000 jobs',
            'Rehabilitate 100km of roads',
            'Implement free education program',
          ]
        },
        {
          period: 'Years 2-4',
          items: [
            'Double education and healthcare infrastructure',
            'Achieve 80% employment growth targets',
            'Complete major road rehabilitation',
            'Establish sustainable economic programs',
          ]
        },
      ],
      successMetrics: 'How We Measure Success',
      metrics: [
        'Student enrollment increases by 50%',
        'Healthcare access reaches 90% of population',
        'Employment rate increases by 40%',
        'Reduction in maternal mortality by 60%',
        'Infrastructure development covers all 34 LGAs',
      ]
    },
    ha: {
      title: 'Wahayin Jiya',
      visionStatement: 'Jiha mai karfi, mai haɓaka, da lafiya inda kowa ya sami ilimi kyau, aiki lafiya, da kasua.',
      mission: 'Ba da jagorar muhalanci don rayuwa na jama\'a, haɓaka kowa, da ba da kayan gida na gari na gida.',
      roadmap: [
        {
          period: 'Kwanaki 100 na Farko',
          items: [
            'Kafa gidan mulki da abin ƙaura',
            'Fara aiki bayyana da karya ba',
            'Bincika buƙatun jiha',
            'Fara magana da jama\'a',
          ]
        },
        {
          period: 'Shekara 1',
          items: [
            'Kawo da kasuwa 25 sabon da cibiyoyi',
            'Samar da aiki 25,000',
            'Gyara hari 100km',
            'Fara ilimi ba karshi',
          ]
        },
        {
          period: 'Shekara 2-4',
          items: [
            'Dinga kasua ilimi da lafiya',
            'Cimma rashin aiki kariya',
            'Kawo da gidansu hari',
            'Kafa shirye daimi na suna',
          ]
        },
      ],
      successMetrics: 'Yaya Za Mu Sanin Nasara',
      metrics: [
        'Karantawa ta karuwa da 50%',
        'Lafiya zuwa 90% na jama\'a',
        'Aiki karuwa da 40%',
        'Rage mutuwa da 60%',
        'Ginin abubuwwa a dukan 34 LGAs',
      ]
    }
  }

  const t = content[locale]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale} setLocale={setLocale} />

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 md:px-8 lg:px-16 bg-linear-to-b from-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-6">{t.title}</h1>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              {locale === 'en' ? 'Our Vision' : 'Wahayin Mu'}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {t.visionStatement}
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              {locale === 'en' ? 'Our Mission' : 'Abin Aiki'}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {t.mission}
            </p>
          </Card>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            {locale === 'en' ? 'Our Implementation Roadmap' : 'Bâkin Gida'},
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {t.roadmap.map((phase, idx) => (
              <Card key={idx} className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{idx + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{phase.period}</h3>
                </div>

                <ul className="space-y-4">
                  {phase.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            {t.successMetrics}
          </h2>

          <Card className="p-8">
            <ul className="space-y-4">
              {t.metrics.map((metric, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-secondary font-bold">{idx + 1}</span>
                  </div>
                  <span className="text-lg text-foreground/80 pt-1">{metric}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  )
}
