'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { CheckCircle, BookOpen, Stethoscope, TrendingUp, Building2, Shield } from 'lucide-react'

export default function PlatformPage() {
  const [locale, setLocale] = useState<'en' | 'ha'>('en')

  const content = {
    en: {
      title: 'Our Platform for Change',
      subtitle: 'A comprehensive agenda built on consultation with communities across the state',
      sections: [
        {
          icon: BookOpen,
          title: 'Education Excellence',
          description: 'Quality education for all',
          points: [
            'Build 100 new schools in underserved areas',
            'Provide scholarships to 10,000 students annually',
            'Improve teacher training and welfare',
            'Establish vocational training centers',
            'Ensure free quality education for all children',
          ]
        },
        {
          icon: Stethoscope,
          title: 'Healthcare for All',
          description: 'Accessible and affordable healthcare',
          points: [
            'Establish 50 new healthcare centers',
            'Provide free maternal and child health services',
            'Reduce maternal mortality by 50%',
            'Ensure medicine availability in all facilities',
            'Implement health insurance for vulnerable groups',
          ]
        },
        {
          icon: TrendingUp,
          title: 'Economic Growth',
          description: 'Job creation and business opportunities',
          points: [
            'Create 100,000 jobs in the first term',
            'Establish SME support programs',
            'Develop agricultural value chains',
            'Attract foreign direct investment',
            'Support women entrepreneurs with N1 billion fund',
          ]
        },
        {
          icon: Building2,
          title: 'Infrastructure Development',
          description: 'Modern roads and utilities',
          points: [
            'Rehabilitate 500km of roads',
            'Ensure 24/7 electricity supply',
            'Provide clean water to all communities',
            'Build modern market infrastructure',
            'Develop digital connectivity in rural areas',
          ]
        },
        {
          icon: Shield,
          title: 'Security & Safety',
          description: 'Safe communities for all',
          points: [
            'Strengthen security forces with modern equipment',
            'Establish community policing programs',
            'Create early warning systems',
            'Support victims of violence and conflict',
            'Promote conflict resolution mechanisms',
          ]
        },
        {
          icon: Building2,
          title: 'Good Governance',
          description: 'Transparent and accountable leadership',
          points: [
            'Implement zero-tolerance for corruption',
            'Establish public procurement transparency',
            'Regular community town halls',
            'Independent budget monitoring',
            'Strengthen institutions and civil service',
          ]
        },
      ]
    },
    ha: {
      title: 'Bâkin Aiki na Canja',
      subtitle: 'Abin da aka takaita ciki tare da ƙasua a fadin jiha dukan ƙasa',
      sections: [
        {
          icon: BookOpen,
          title: 'Ilimi Mai Kyau',
          description: 'Ilimi kyau ga kowa',
          points: [
            'Gina kasuwa 100 sabon makarantu a waje',
            'Baje labarin ilimi ga talibai 10,000 a duk shekara',
            'Inganta horo da raye-rayen malikin makarantu',
            'Kafa sashe-sashe na ilimi na sana\'a',
            'Tiyar ilimi kyau ga duk yara',
          ]
        },
        {
          icon: Stethoscope,
          title: 'Lafiya ga Kowa',
          description: 'Aiki lafiya na karee',
          points: [
            'Kafa cibiyoyi 50 sabon',
            'Baje labarin aiki yaya ga cade da jarirai',
            'Rage mutuwa a cikin haihuwa da 50%',
            'Tiyar magani a duk cibiyoyi',
            'Aiki insurance ga masu wahala',
          ]
        },
        {
          icon: TrendingUp,
          title: 'Ci Gaban Tattalin Arziki',
          description: 'Samar da aiki',
          points: [
            'Samar da aiki 100,000 a likita na farko',
            'Kafa shirin goyon bayan kasua karama',
            'Shirye jerin noma',
            'Tira jari wajen jiya',
            'Goyon bayan mace masu kasuwa tare da N1 billion',
          ]
        },
        {
          icon: Building2,
          title: 'Ginin Abubuwwa',
          description: 'Karfafawa da sarkofafai',
          points: [
            'Gyara hari 500km',
            'Tiyar wutar lantarki a kowa',
            'Tiyar ruwan tsafi ga dukan gida',
            'Gina kasuwa maju\'i',
            'Shirye yanar gizo a waje',
          ]
        },
        {
          icon: Shield,
          title: 'Kariya & Aminci',
          description: 'Al\'ummomi masu aminci',
          points: [
            'Karfaita sojoji tare da sabbin kaya',
            'Kafa jerin kariya na kasuwa',
            'Kafa sashe sakwar waje',
            'Goyon bayan wadanda aka damje',
            'Haɓaka salinsantsi',
          ]
        },
        {
          icon: Building2,
          title: 'Mulki Mai Kyau',
          description: 'Cin gida mai bayyana',
          points: [
            'Aiki ba karya',
            'Bayyana da suni',
            'Taron jama\'a kila lokaci',
            'Kuɗi ga kullun',
            'Karfaita asalin mulki',
          ]
        },
      ]
    }
  }

  const t = content[locale]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale} setLocale={setLocale} />

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">{t.title}</h1>
          <p className="text-xl text-foreground/80">{t.subtitle}</p>
        </div>
      </section>

      {/* Policy Areas */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {t.sections.map((section, idx) => {
              const Icon = section.icon
              return (
                <Card key={idx} className="p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <Icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{section.title}</h3>
                      <p className="text-foreground/60 text-sm mt-1">{section.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mt-6">
                    {section.points.map((point, pointIdx) => (
                      <li key={pointIdx} className="flex gap-3 items-start">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-primary mb-4">
              {locale === 'en' ? 'How We\'ll Achieve This' : 'Yaya Zamu Cimma Wannan'}
            </h2>
            <div className="space-y-4 text-foreground/80">
              <p>
                {locale === 'en'
                  ? 'Our implementation strategy is built on three pillars: Strategic Planning, Community Engagement, and Performance Accountability.'
                  : 'Abin da zamu yi ya dogara akan: Takaita Gogewa, Tuntuɓi da al\'ummomi, da Albaski.'
                }
              </p>
              <p>
                {locale === 'en'
                  ? 'We will establish a State Development Office to coordinate all initiatives, track progress, and ensure timely delivery.'
                  : 'Zamu kafa ofis don gudanar da duk abubuwa, watsar ba da labari, da cika aiki a lokacin.'
                }
              </p>
              <p>
                {locale === 'en'
                  ? 'Monthly public reports will be published and regular town halls held to keep communities informed and engaged.'
                  : 'Zamu bada labari ga jama\'a kila wata da taron kasuwa don aika jama\'a.'
                }
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  )
}
